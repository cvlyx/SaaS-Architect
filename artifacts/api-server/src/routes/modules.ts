import { Router } from "express";
import { db, modulesTable, organizationModulesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetOrganizationModulesParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const modules = await db.select().from(modulesTable).orderBy(modulesTable.category);
    res.json(modules.map(m => ({ ...m, priceMonthly: m.priceMonthly ? Number(m.priceMonthly) : null })));
  } catch (err) {
    req.log.error({ err }, "Failed to list modules");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/organization/:orgId", async (req, res) => {
  const parsed = GetOrganizationModulesParams.safeParse({ orgId: Number(req.params.orgId) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid orgId" });

  try {
    const orgModules = await db
      .select()
      .from(organizationModulesTable)
      .where(eq(organizationModulesTable.organizationId, parsed.data.orgId));

    const moduleIds = orgModules.map(om => om.moduleId);
    if (moduleIds.length === 0) return res.json([]);

    const modules = await db.select().from(modulesTable);
    const filtered = modules
      .filter(m => moduleIds.includes(m.id))
      .map(m => ({ ...m, priceMonthly: m.priceMonthly ? Number(m.priceMonthly) : null }));

    res.json(filtered);
  } catch (err) {
    req.log.error({ err }, "Failed to get org modules");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
