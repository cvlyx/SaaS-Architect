import { Router } from "express";
import { eq } from "drizzle-orm";
import {
  GetIndustryPackParams,
} from "@workspace/api-zod";

// Mock industry packs data
const mockIndustryPacks = [
  { id: 1, name: "Healthcare", slug: "healthcare", description: "Patient management, scheduling, and compliance tools.", features: [], roles: [], icon: "HeartPulse", color: "#ef4444" },
  { id: 2, name: "Construction", slug: "construction", description: "Project tracking, safety management, and vendor coordination.", features: [], roles: [], icon: "HardHat", color: "#f97316" },
  { id: 3, name: "Education", slug: "education", description: "Student information systems and classroom management.", features: [], roles: [], icon: "GraduationCap", color: "#eab308" },
  { id: 4, name: "Retail", slug: "retail", description: "Point of sale, inventory, and customer relationship tools.", features: [], roles: [], icon: "ShoppingBag", color: "#22c55e" },
  { id: 5, name: "Technology", slug: "technology", description: "DevOps, project management, and sprint planning.", features: [], roles: [], icon: "Laptop", color: "#06b6d4" },
  { id: 6, name: "Finance", slug: "finance", description: "Budgeting, reporting, and compliance workflows.", features: [], roles: [], icon: "DollarSign", color: "#3b82f6" },
  { id: 7, name: "Non-Profit", slug: "non-profit", description: "Donor management and volunteer coordination.", features: [], roles: [], icon: "Heart", color: "#8b5cf6" },
  { id: 8, name: "Legal", slug: "legal", description: "Case management and document workflows.", features: [], roles: [], icon: "Scales", color: "#ec4899" },
  { id: 9, name: "Manufacturing", slug: "manufacturing", description: "Production tracking and supply chain management.", features: [], roles: [], icon: "Factory", color: "#14b8a6" },
  { id: 10, name: "Real Estate", slug: "real-estate", description: "Property management and client tracking.", features: [], roles: [], icon: "Home", color: "#f43f5e" },
  { id: 11, name: "Hospitality", slug: "hospitality", description: "Hotel and restaurant management tools.", features: [], roles: [], icon: "Utensils", color: "#f59e0b" },
  { id: 12, name: "Transportation", slug: "transportation", description: "Logistics and fleet management.", features: [], roles: [], icon: "Truck", color: "#10b981" },
  { id: 13, name: "Media", slug: "media", description: "Content management and editorial workflows.", features: [], roles: [], icon: "Camera", color: "#0ea5e9" },
  { id: 14, name: "Consulting", slug: "consulting", description: "Client engagement and project delivery tools.", features: [], roles: [], icon: "Briefcase", color: "#6366f1" },
  { id: 15, name: "Government", slug: "government", description: "Public sector workflow management.", features: [], roles: [], icon: "Building2", color: "#a855f7" }
];

const router = Router();

router.get("/", async (req, res) => {
  res.json(mockIndustryPacks);
});

router.get("/:id", async (req, res) => {
  const parsed = GetIndustryPackParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  const pack = mockIndustryPacks.find(p => p.id === parsed.data.id);
  if (!pack) return res.status(404).json({ error: "Not found" });
  return res.json(pack);
});

export default router;
