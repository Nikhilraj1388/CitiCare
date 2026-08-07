import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding CitiCare database...\n");

  // ─── Departments ──────────────────────────────────────────────────────────
  console.log("📌 Creating departments...");
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: "PWD" },
      update: {},
      create: { name: "Public Works", code: "PWD", description: "Handles roads, bridges, and public infrastructure" },
    }),
    prisma.department.upsert({
      where: { code: "WSD" },
      update: {},
      create: { name: "Water Supply", code: "WSD", description: "Manages water supply, pipelines, and water treatment" },
    }),
    prisma.department.upsert({
      where: { code: "SWM" },
      update: {},
      create: { name: "Solid Waste Management", code: "SWM", description: "Handles garbage collection and waste disposal" },
    }),
    prisma.department.upsert({
      where: { code: "ELE" },
      update: {},
      create: { name: "Electricity", code: "ELE", description: "Manages street lights and electrical infrastructure" },
    }),
    prisma.department.upsert({
      where: { code: "SEW" },
      update: {},
      create: { name: "Sewage", code: "SEW", description: "Handles sewage systems and drainage" },
    }),
    prisma.department.upsert({
      where: { code: "GAD" },
      update: {},
      create: { name: "General Administration", code: "GAD", description: "Handles general civic matters and encroachments" },
    }),
    prisma.department.upsert({
      where: { code: "HRT" },
      update: {},
      create: { name: "Horticulture", code: "HRT", description: "Manages parks, trees, and green spaces" },
    }),
    prisma.department.upsert({
      where: { code: "BLD" },
      update: {},
      create: { name: "Building & Infrastructure", code: "BLD", description: "Manages public buildings and facilities" },
    }),
  ]);

  console.log(`   ✅ ${departments.length} departments created`);

  // ─── Complaint Categories ─────────────────────────────────────────────────
  console.log("📌 Creating complaint categories...");
  const categories = await Promise.all([
    prisma.complaintCategory.upsert({
      where: { name: "Road Damage" },
      update: {},
      create: { name: "Road Damage", icon: "Construction", severity: 4 },
    }),
    prisma.complaintCategory.upsert({
      where: { name: "Garbage" },
      update: {},
      create: { name: "Garbage", icon: "Trash2", severity: 3 },
    }),
    prisma.complaintCategory.upsert({
      where: { name: "Street Light" },
      update: {},
      create: { name: "Street Light", icon: "Lightbulb", severity: 2 },
    }),
    prisma.complaintCategory.upsert({
      where: { name: "Water Leakage" },
      update: {},
      create: { name: "Water Leakage", icon: "Droplets", severity: 4 },
    }),
    prisma.complaintCategory.upsert({
      where: { name: "Sewage" },
      update: {},
      create: { name: "Sewage", icon: "PipetteIcon", severity: 5 },
    }),
    prisma.complaintCategory.upsert({
      where: { name: "Public Facility Damage" },
      update: {},
      create: { name: "Public Facility Damage", icon: "Building2", severity: 3 },
    }),
    prisma.complaintCategory.upsert({
      where: { name: "Tree Hazard" },
      update: {},
      create: { name: "Tree Hazard", icon: "TreePine", severity: 4 },
    }),
    prisma.complaintCategory.upsert({
      where: { name: "Encroachment" },
      update: {},
      create: { name: "Encroachment", icon: "ShieldAlert", severity: 2 },
    }),
    prisma.complaintCategory.upsert({
      where: { name: "Other" },
      update: {},
      create: { name: "Other", icon: "HelpCircle", severity: 1 },
    }),
  ]);

  console.log(`   ✅ ${categories.length} categories created`);

  // ─── Category → Department Mapping ────────────────────────────────────────
  console.log("📌 Creating category-department mappings...");

  const mappings = [
    { category: "Road Damage", department: "PWD" },
    { category: "Garbage", department: "SWM" },
    { category: "Street Light", department: "ELE" },
    { category: "Water Leakage", department: "WSD" },
    { category: "Sewage", department: "SEW" },
    { category: "Public Facility Damage", department: "BLD" },
    { category: "Tree Hazard", department: "HRT" },
    { category: "Encroachment", department: "GAD" },
    { category: "Other", department: "GAD" },
  ];

  for (const m of mappings) {
    const cat = categories.find((c) => c.name === m.category)!;
    const dept = departments.find((d) => d.code === m.department)!;

    await prisma.categoryDepartmentMapping.upsert({
      where: {
        categoryId_departmentId: {
          categoryId: cat.id,
          departmentId: dept.id,
        },
      },
      update: {},
      create: {
        categoryId: cat.id,
        departmentId: dept.id,
      },
    });
  }

  console.log(`   ✅ ${mappings.length} mappings created`);

  // ─── SLA Rules ────────────────────────────────────────────────────────────
  console.log("📌 Creating SLA rules...");

  const slaRules = [
    { category: "Road Damage", hours: 72, escalationLevel: 1 },
    { category: "Garbage", hours: 24, escalationLevel: 1 },
    { category: "Street Light", hours: 48, escalationLevel: 1 },
    { category: "Water Leakage", hours: 24, escalationLevel: 1 },
    { category: "Sewage", hours: 12, escalationLevel: 1 },
    { category: "Public Facility Damage", hours: 72, escalationLevel: 1 },
    { category: "Tree Hazard", hours: 48, escalationLevel: 1 },
    { category: "Encroachment", hours: 120, escalationLevel: 1 },
    { category: "Other", hours: 96, escalationLevel: 1 },
  ];

  for (const s of slaRules) {
    const cat = categories.find((c) => c.name === s.category)!;

    await prisma.slaRule.upsert({
      where: {
        categoryId_escalationLevel: {
          categoryId: cat.id,
          escalationLevel: s.escalationLevel,
        },
      },
      update: {},
      create: {
        categoryId: cat.id,
        hours: s.hours,
        escalationLevel: s.escalationLevel,
      },
    });
  }

  console.log(`   ✅ ${slaRules.length} SLA rules created`);

  // ─── Admin User ───────────────────────────────────────────────────────────
  console.log("📌 Creating admin user...");

  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  await prisma.user.upsert({
    where: { email: "admin@citicare.com" },
    update: {},
    create: {
      fullName: "System Administrator",
      email: "admin@citicare.com",
      phone: "9999999999",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("   ✅ Admin user created (admin@citicare.com / Admin@123)");

  // ─── System Settings ─────────────────────────────────────────────────────
  console.log("📌 Creating system settings...");

  const settings = [
    { key: "app_name", value: "CitiCare" },
    { key: "app_version", value: "1.0.0" },
    { key: "max_images_per_complaint", value: "3" },
    { key: "complaint_number_prefix", value: "CIT" },
    { key: "default_sla_hours", value: "72" },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log(`   ✅ ${settings.length} system settings created`);

  console.log("\n🎉 Seeding complete!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
