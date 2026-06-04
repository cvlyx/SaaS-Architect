import { Router } from "express";
import { db, subscriptionPlansTable, subscriptionsTable, paymentRecordsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetCurrentSubscriptionQueryParams,
  GetPaymentHistoryQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const plans = await db.select().from(subscriptionPlansTable).orderBy(subscriptionPlansTable.priceMonthly);
    res.json(plans.map(p => ({
      ...p,
      priceMonthly: Number(p.priceMonthly),
      priceYearly: Number(p.priceYearly),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list subscription plans");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/current", async (req, res) => {
  const parsed = GetCurrentSubscriptionQueryParams.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "organizationId required" });

  try {
    const [sub] = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.organizationId, parsed.data.organizationId))
      .orderBy(subscriptionsTable.id)
      .limit(1);

    if (!sub) return res.status(404).json({ error: "No subscription found" });

    const daysRemaining = Math.max(
      0,
      Math.ceil((new Date(sub.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );

    res.json({ ...sub, daysRemaining });
  } catch (err) {
    req.log.error({ err }, "Failed to get current subscription");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/history", async (req, res) => {
  const parsed = GetPaymentHistoryQueryParams.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "organizationId required" });

  try {
    const records = await db
      .select()
      .from(paymentRecordsTable)
      .where(eq(paymentRecordsTable.organizationId, parsed.data.organizationId))
      .orderBy(paymentRecordsTable.paidAt);

    res.json(records.map(r => ({ ...r, amount: Number(r.amount) })));
  } catch (err) {
    req.log.error({ err }, "Failed to get payment history");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
