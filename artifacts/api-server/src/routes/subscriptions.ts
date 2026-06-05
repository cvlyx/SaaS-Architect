import { Router } from "express";
import {
  GetCurrentSubscriptionQueryParams,
  GetPaymentHistoryQueryParams,
} from "@workspace/api-zod";

// Mock subscription plans data
const mockSubscriptionPlans = [
  {
    id: 1,
    name: "Starter",
    description: "Perfect for small teams getting started",
    priceMonthly: 49,
    priceYearly: 499,
    maxUsers: 10,
    features: ["5 industry packs", "Basic role management", "Email support", "Standard analytics"],
    isPopular: false
  },
  {
    id: 2,
    name: "Professional",
    description: "Ideal for growing organizations",
    priceMonthly: 149,
    priceYearly: 1499,
    maxUsers: 50,
    features: ["All industry packs", "Advanced role management", "Priority support", "Advanced analytics", "Custom workflows"],
    isPopular: true
  },
  {
    id: 3,
    name: "Enterprise",
    description: "For large organizations with complex needs",
    priceMonthly: 399,
    priceYearly: 3999,
    maxUsers: 9999,
    features: ["Everything in Professional", "SSO integration", "Dedicated account manager", "Custom integrations", "On-premise options"],
    isPopular: false
  }
];

const router = Router();

router.get("/", async (req, res) => {
  res.json(mockSubscriptionPlans);
});

router.get("/current", async (req, res) => {
  const parsed = GetCurrentSubscriptionQueryParams.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "organizationId required" });

  // Mock current subscription
  const currentPeriodStart = new Date();
  const currentPeriodEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  return res.json({
    id: 1,
    organizationId: parsed.data.organizationId,
    planId: 2,
    status: "active",
    currentPeriodStart: currentPeriodStart.toISOString(),
    currentPeriodEnd: currentPeriodEnd.toISOString(),
    createdAt: new Date().toISOString(),
    daysRemaining: 14
  });
});

router.get("/history", async (req, res) => {
  res.json([]);
});

export default router;
