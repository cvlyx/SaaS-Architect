import { Router } from "express";
import { db, organizationsTable, usersTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import {
  CreateOrganizationBody,
  GetOrganizationParams,
  UpdateOrganizationParams,
  UpdateOrganizationBody,
  GetOrganizationStatsParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const orgs = await db.select().from(organizationsTable).orderBy(organizationsTable.createdAt);
    res.json(orgs);
  } catch (err) {
    req.log.error({ err }, "Failed to list organizations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = CreateOrganizationBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body", details: parsed.error });

  try {
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const [org] = await db
      .insert(organizationsTable)
      .values({ ...parsed.data, trialEndsAt })
      .returning();
    res.status(201).json(org);
  } catch (err) {
    req.log.error({ err }, "Failed to create organization");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const parsed = GetOrganizationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  try {
    const [org] = await db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.id, parsed.data.id));
    if (!org) return res.status(404).json({ error: "Not found" });
    res.json(org);
  } catch (err) {
    req.log.error({ err }, "Failed to get organization");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  const paramsParsed = UpdateOrganizationParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) return res.status(400).json({ error: "Invalid id" });
  const bodyParsed = UpdateOrganizationBody.safeParse(req.body);
  if (!bodyParsed.success) return res.status(400).json({ error: "Invalid body" });

  try {
    const [org] = await db
      .update(organizationsTable)
      .set(bodyParsed.data)
      .where(eq(organizationsTable.id, paramsParsed.data.id))
      .returning();
    if (!org) return res.status(404).json({ error: "Not found" });
    res.json(org);
  } catch (err) {
    req.log.error({ err }, "Failed to update organization");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/stats", async (req, res) => {
  const parsed = GetOrganizationStatsParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  try {
    const [userCount] = await db
      .select({ count: count() })
      .from(usersTable)
      .where(eq(usersTable.organizationId, parsed.data.id));

    const [org] = await db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.id, parsed.data.id));

    if (!org) return res.status(404).json({ error: "Not found" });

    res.json({
      totalUsers: Number(userCount?.count ?? 0),
      activeModules: 3,
      storageUsedMb: Math.round(Math.random() * 500 + 50),
      lastActivityAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get org stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
