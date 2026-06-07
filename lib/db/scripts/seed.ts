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
  { name: "Non-Profit", slug: "non-profit", description: "Donor and volunteer management for organizations", features: ["Donor tracking", "Volunteer scheduling", "Campaign management"], roles: ["director", "coordinator", "volunteer"], icon: "Heart", color: "#ec4899" },
  { name: "Legal", slug: "legal", description: "Case and document management for law firms", features: ["Case tracking", "Document workflow", "Client portal"], roles: ["partner", "associate", "paralegal", "admin"], icon: "Scale", color: "#6366f1" },
  { name: "Manufacturing", slug: "manufacturing", description: "Production and supply chain management", features: ["Production runs", "Supplier tracking", "Quality control"], roles: ["plant_manager", "supervisor", "operator", "inspector"], icon: "Factory", color: "#a16207" },
  { name: "Real Estate", slug: "real-estate", description: "Property and client management for agencies", features: ["Property listings", "Client CRM", "Lease tracking"], roles: ["agent", "broker", "manager"], icon: "Building", color: "#14b8a6" },
  { name: "Hospitality", slug: "hospitality", description: "Hotel and restaurant management tools", features: ["Room booking", "Guest profiles", "Service management"], roles: ["manager", "front_desk", "housekeeping", "chef"], icon: "Hotel", color: "#f97316" },
  { name: "Transportation", slug: "transportation", description: "Logistics and fleet management solutions", features: ["Fleet tracking", "Route planning", "Driver management"], roles: ["dispatcher", "driver", "manager"], icon: "Truck", color: "#64748b" },
  { name: "Media", slug: "media", description: "Content and editorial workflow management", features: ["Content calendar", "Editorial workflow", "Asset library"], roles: ["editor", "writer", "designer", "publisher"], icon: "Newspaper", color: "#dc2626" },
  { name: "Consulting", slug: "consulting", description: "Client engagement and project delivery tools", features: ["Client CRM", "Engagement tracking", "Resource planning"], roles: ["partner", "consultant", "analyst"], icon: "Briefcase", color: "#2563eb" },
  { name: "Government", slug: "government", description: "Public sector workflow and permit management", features: ["Permit processing", "License renewals", "Service requests"], roles: ["clerk", "officer", "admin", "inspector"], icon: "Government", color: "#4f46e5" },
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
