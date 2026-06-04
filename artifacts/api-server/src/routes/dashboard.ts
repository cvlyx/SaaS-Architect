import { Router } from "express";
import { db, organizationsTable, usersTable, industryPacksTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  try {
    const [orgCount] = await db.select({ count: count() }).from(organizationsTable);
    const [userCount] = await db.select({ count: count() }).from(usersTable);

    const allOrgs = await db.select().from(organizationsTable);
    const activeOrgs = allOrgs.filter(o => o.status === "active").length;
    const trialOrgs = allOrgs.filter(o => o.status === "trial").length;

    res.json({
      totalOrganizations: Number(orgCount?.count ?? 0),
      activeOrganizations: activeOrgs,
      totalUsers: Number(userCount?.count ?? 0),
      monthlyRevenue: 18450,
      trialOrganizations: trialOrgs,
      churnRate: 2.4,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get platform summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/activity", async (req, res) => {
  try {
    const orgs = await db
      .select()
      .from(organizationsTable)
      .orderBy(organizationsTable.createdAt)
      .limit(10);

    const activities = orgs.map((org, i) => ({
      id: i + 1,
      type: ["signup", "subscription", "upgrade", "signup", "subscription"][i % 5] as string,
      description: `${org.name} ${["joined the platform", "subscribed to Pro plan", "upgraded to Enterprise", "started free trial", "renewed subscription"][i % 5]}`,
      organizationName: org.name,
      timestamp: org.createdAt.toISOString(),
    }));

    res.json(activities);
  } catch (err) {
    req.log.error({ err }, "Failed to get recent activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/industry-breakdown", async (req, res) => {
  try {
    const orgs = await db.select().from(organizationsTable);
    const packs = await db.select().from(industryPacksTable);

    const breakdown: Record<string, number> = {};
    for (const org of orgs) {
      const pack = packs.find(p => p.id === org.industryPackId);
      const name = pack?.name ?? "Other";
      breakdown[name] = (breakdown[name] ?? 0) + 1;
    }

    const total = orgs.length || 1;
    const result = Object.entries(breakdown).map(([industry, cnt]) => ({
      industry,
      count: cnt,
      percentage: Math.round((cnt / total) * 100),
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get industry breakdown");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/growth", async (req, res) => {
  try {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();

    const metrics = months.slice(0, currentMonth + 1).map((month, i) => ({
      month,
      newOrganizations: Math.floor(Math.random() * 20 + 5 + i * 2),
      revenue: Math.floor(Math.random() * 5000 + 8000 + i * 800),
      activeUsers: Math.floor(Math.random() * 100 + 200 + i * 25),
    }));

    res.json(metrics);
  } catch (err) {
    req.log.error({ err }, "Failed to get growth metrics");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
