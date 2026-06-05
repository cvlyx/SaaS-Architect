import { db } from "../src";
import { industryPacksTable } from "../src/schema/industryPacks";
import { subscriptionPlansTable } from "../src/schema/subscriptions";

const industryPacks = [
  { name: "Healthcare", slug: "healthcare", description: "HIPAA-compliant tools for medical practices", features: ["Patient records", "Appointment scheduling", "Billing"], roles: ["doctor", "nurse", "admin", "receptionist"], icon: "HeartPulse", color: "#ef4444" },
  { name: "Construction", slug: "construction", description: "Project management for contractors and builders", features: ["Blueprint markup", "Site inspections", "Material tracking"], roles: ["project_manager", "supervisor", "worker", "engineer"], icon: "HardHat", color: "#f59e0b" },
  { name: "Retail", slug: "retail", description: "POS and inventory management for stores", features: ["POS system", "Inventory tracking", "Supplier management"], roles: ["manager", "cashier", "stock_clerk"], icon: "ShoppingCart", color: "#22c55e" },
  { name: "Education", slug: "education", description: "LMS and student management for institutions", features: ["Course management", "Gradebook", "Student portal"], roles: ["teacher", "student", "admin", "parent"], icon: "GraduationCap", color: "#3b82f6" },
  { name: "Technology", slug: "technology", description: "Agile tools for software teams", features: ["Sprint planning", "Code review", "Issue tracking"], roles: ["developer", "team_lead", "product_owner", "scrum_master"], icon: "Monitor", color: "#8b5cf6" },
  { name: "Finance", slug: "finance", description: "Compliance and reporting for financial services", features: ["Audit trails", "Financial reporting", "Risk assessment"], roles: ["analyst", "compliance_officer", "manager", "advisor"], icon: "Landmark", color: "#06b6d4" },
];

const subscriptionPlans = [
  { name: "Starter", description: "For small teams getting started", priceMonthly: "29", priceYearly: "290", maxUsers: 10, features: ["Up to 10 users", "Basic analytics", "Email support"], isPopular: false },
  { name: "Growth", description: "For growing organizations", priceMonthly: "99", priceYearly: "990", maxUsers: 50, features: ["Up to 50 users", "Advanced analytics", "Priority support", "Custom roles"], isPopular: true },
  { name: "Enterprise", description: "For large-scale deployments", priceMonthly: "299", priceYearly: "2990", maxUsers: 999999, features: ["Unlimited users", "Full analytics suite", "24/7 phone support", "Custom integrations", "SLA guarantee"], isPopular: false },
];

async function seed() {
  console.log("Seeding industry packs...");
  for (const pack of industryPacks) {
    await db.insert(industryPacksTable).values(pack).onConflictDoNothing({ target: industryPacksTable.slug });
  }

  console.log("Seeding subscription plans...");
  for (const plan of subscriptionPlans) {
    await db.insert(subscriptionPlansTable).values(plan).onConflictDoNothing({ target: subscriptionPlansTable.name });
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
