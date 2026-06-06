import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { createClient } from "@libsql/client";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/debug/db", async (req, res) => {
  try {
    const client = createClient({
      url: process.env.DATABASE_URL || "not-set",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const result = await client.execute("SELECT 1 as test");
    res.json({ db_url_set: !!process.env.DATABASE_URL, db_token_set: !!process.env.TURSO_AUTH_TOKEN, jwt_secret_set: !!process.env.JWT_SECRET, query_result: result.rows });
  } catch (e: any) {
    res.json({ db_url_set: !!process.env.DATABASE_URL, db_token_set: !!process.env.TURSO_AUTH_TOKEN, jwt_secret_set: !!process.env.JWT_SECRET, error: e.message, stack: e.stack?.split("\n").slice(0,5).join("\n") });
  }
});

export default router;
