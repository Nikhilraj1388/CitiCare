interface EmailRecipient {
  email: string;
  name?: string;
}

interface EmailOptions {
  to: string | EmailRecipient[];
  name?: string;
  subject: string;
  html: string;
}

export class EmailService {
  /**
   * Check if Brevo is configured with an API key and sender email
   */
  private static isConfigured(): boolean {
    return !!(
      process.env.BREVO_API_KEY &&
      (process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || process.env.EMAIL_USER)
    );
  }

  /**
   * Send transactional email using Brevo's HTTP API (port 443, Render-compatible)
   */
  static async send(options: EmailOptions): Promise<boolean> {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const senderName = process.env.BREVO_SENDER_NAME || "CitiCare";

    if (!apiKey || !senderEmail) {
      const recipient = typeof options.to === "string" ? options.to : options.to[0]?.email;
      console.log(`📧 [EMAIL SKIPPED] To: ${recipient} | Subject: ${options.subject}`);
      console.log(`   Configure BREVO_API_KEY and BREVO_SENDER_EMAIL in .env to enable emails`);
      return false;
    }

    const recipients =
      typeof options.to === "string"
        ? [{ email: options.to, name: options.name || "" }]
        : options.to.map((r) => ({ email: r.email, name: r.name || "" }));

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: recipients,
          subject: options.subject,
          htmlContent: options.html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`📧 [BREVO EMAIL FAILED] Status: ${response.status}`, errorData);
        return false;
      }

      const data = await response.json().catch(() => ({}));
      const recipientStr = recipients.map((r) => r.email).join(", ");
      console.log(`📧 [BREVO EMAIL SENT] To: ${recipientStr} | Subject: ${options.subject}`, data);
      return true;
    } catch (error) {
      const recipient = typeof options.to === "string" ? options.to : options.to[0]?.email;
      console.error(`📧 [BREVO EMAIL ERROR] To: ${recipient}`, error);
      return false;
    }
  }

  static async sendWelcome(email: string, fullName: string) {
    return this.send({
      to: email,
      name: fullName,
      subject: "Welcome to CitiCare! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #0d9488); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to CitiCare</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #111827;">Hello, ${fullName}! 👋</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              Your account has been created successfully. You can now report civic issues
              in your city and track their resolution in real-time.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard"
                style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px;">— The CitiCare Team</p>
          </div>
        </div>
      `,
    });
  }

  static async sendComplaintCreated(
    email: string,
    fullName: string,
    complaintNumber: string,
    title: string,
    department: string
  ) {
    return this.send({
      to: email,
      name: fullName,
      subject: `Complaint ${complaintNumber} Submitted ✅`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #0d9488); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Complaint Submitted</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #111827;">Hi ${fullName},</h2>
            <p style="color: #6b7280;">Your complaint has been submitted and assigned to the relevant department.</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Reference:</strong> ${complaintNumber}</p>
              <p style="margin: 4px 0;"><strong>Title:</strong> ${title}</p>
              <p style="margin: 4px 0;"><strong>Department:</strong> ${department}</p>
              <p style="margin: 4px 0;"><strong>Status:</strong> Submitted</p>
            </div>
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard/complaints"
                style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Track Complaint
              </a>
            </div>
          </div>
        </div>
      `,
    });
  }

  static async sendStatusUpdate(
    email: string,
    fullName: string,
    complaintNumber: string,
    title: string,
    oldStatus: string,
    newStatus: string,
    remarks?: string
  ) {
    const statusColors: Record<string, string> = {
      SUBMITTED: "#3b82f6",
      UNDER_REVIEW: "#f59e0b",
      IN_PROGRESS: "#6366f1",
      RESOLVED: "#10b981",
      REOPENED: "#ef4444",
    };
    return this.send({
      to: email,
      name: fullName,
      subject: `Complaint ${complaintNumber} — Status Updated`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #0d9488); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Status Update</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #111827;">Hi ${fullName},</h2>
            <p style="color: #6b7280;">Your complaint status has been updated.</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Reference:</strong> ${complaintNumber}</p>
              <p style="margin: 4px 0;"><strong>Title:</strong> ${title}</p>
              <p style="margin: 4px 0;"><strong>Previous:</strong> ${oldStatus.replace("_", " ")}</p>
              <p style="margin: 4px 0;">
                <strong>Current:</strong>
                <span style="background: ${statusColors[newStatus] || "#6b7280"}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 13px;">
                  ${newStatus.replace("_", " ")}
                </span>
              </p>
              ${remarks ? `<p style="margin: 8px 0 4px;"><strong>Remarks:</strong> ${remarks}</p>` : ""}
            </div>
          </div>
        </div>
      `,
    });
  }

  static async sendPasswordReset(email: string, fullName: string, resetToken: string) {
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    return this.send({
      to: email,
      name: fullName,
      subject: "Reset Your CitiCare Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #0d9488); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #111827;">Hi ${fullName},</h2>
            <p style="color: #6b7280;">You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px;">If you didn't request this, ignore this email.</p>
          </div>
        </div>
      `,
    });
  }

  static async sendComplaintResolved(
    email: string,
    fullName: string,
    complaintNumber: string,
    title: string
  ) {
    return this.send({
      to: email,
      name: fullName,
      subject: `Complaint ${complaintNumber} Resolved! ✅`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #0d9488); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Complaint Resolved! 🎉</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #111827;">Great news, ${fullName}!</h2>
            <p style="color: #6b7280;">Your complaint <strong>${complaintNumber}</strong> — "${title}" has been resolved.</p>
            <p style="color: #6b7280;">Please rate the resolution to help us improve our services.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard/complaints"
                style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Rate Resolution
              </a>
            </div>
          </div>
        </div>
      `,
    });
  }
}
