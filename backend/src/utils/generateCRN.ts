import prisma from "../config/database";

/**
 * Generates a unique Complaint Reference Number
 * Format: CIT-2026-000001
 */
export async function generateCRN(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `CIT-${year}-`;

  // Get the latest complaint number for this year
  const latest = await prisma.complaint.findFirst({
    where: {
      complaintNumber: { startsWith: prefix },
    },
    orderBy: { complaintNumber: "desc" },
    select: { complaintNumber: true },
  });

  let nextNumber = 1;
  if (latest) {
    const lastNum = parseInt(latest.complaintNumber.split("-")[2], 10);
    nextNumber = lastNum + 1;
  }

  return `${prefix}${String(nextNumber).padStart(6, "0")}`;
}
