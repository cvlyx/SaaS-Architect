import { Router } from "express";
import { db, industryPacksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetIndustryPackParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const packs = await db.select().from(industryPacksTable);
    res.json(packs);
  } catch (err) {
    req.log.error({ err }, "Failed to list industry packs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const parsed = GetIndustryPackParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  try {
    const [pack] = await db
      .select()
      .from(industryPacksTable)
      .where(eq(industryPacksTable.id, parsed.data.id));
    if (!pack) return res.status(404).json({ error: "Not found" });
    res.json(pack);
  } catch (err) {
    req.log.error({ err }, "Failed to get industry pack");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
