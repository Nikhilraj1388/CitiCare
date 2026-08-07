import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static isConfigured(): boolean {
    return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
  }

  static async send(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured()) {
      console.log(`📧 [EMAIL SKIPPED] To: ${options.to} | Subject: ${options.subject}`);
      console.log(`   Configure EMAIL_USER and EMAIL_PASS in .env to enable emails`);
      return false;
    }

    try {
      await transporter.sendMail({
        from: `"CitiCare" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`📧 [EMAIL SENT] To: ${options.to} | Subject: ${options.subject}`);
      return true;
    } catch (error) {
      console.error(`📧 [EMAIL FAILED] To: ${options.to}`, error);
      return false;
    }
  }

  static async sendWelcome(email: string, fullName: string) {
    return this.send({
      to: email,
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
