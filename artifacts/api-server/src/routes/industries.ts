import { Router } from "express";
import { db } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import {
  healthcarePatients, healthcareStaff, healthcareAppointments,
  constructionProjects, constructionWorkers, constructionSafetyReports,
  retailProducts, retailInventory, retailCustomers,
  technologyProjects, technologyTasks, technologyTeamMembers,
  financeAccounts, financeTransactions, financeBudgets,
} from "@workspace/db";

function crud(table: any, requiredFields: string[], orderCol?: any, label?: string) {
  const router = Router();
  const name = label || "entity";

  router.get("/", async (req, res) => {
    try {
      const orgId = Number(req.query.organizationId);
      let q: any = db.select().from(table);
      if (orgId) q = q.where(eq(table.organizationId, orgId));
      const rows = orderCol ? await q.orderBy(orderCol) : await q;
      res.json(rows);
    } catch (err: any) { req.log.error({ err }, `Failed to list ${name}`); res.status(500).json({ error: "Internal server error" }); }
  });

  router.post("/", async (req, res) => {
    try {
      const missing = requiredFields.filter((f: string) => !req.body[f]);
      if (missing.length) return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
      const [row] = await db.insert(table).values(req.body).returning();
      res.status(201).json(row);
    } catch (err: any) { req.log.error({ err }, `Failed to create ${name}`); res.status(500).json({ error: "Internal server error" }); }
  });

  router.get("/:id", async (req, res) => {
    try {
      const [row] = await db.select().from(table).where(eq(table.id, Number(req.params.id)));
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (err: any) { req.log.error({ err }, `Failed to get ${name}`); res.status(500).json({ error: "Internal server error" }); }
  });

  router.patch("/:id", async (req, res) => {
    try {
      const [row] = await db.update(table).set(req.body).where(eq(table.id, Number(req.params.id))).returning();
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (err: any) { req.log.error({ err }, `Failed to update ${name}`); res.status(500).json({ error: "Internal server error" }); }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await db.delete(table).where(eq(table.id, Number(req.params.id)));
      res.status(204).send();
    } catch (err: any) { req.log.error({ err }, `Failed to delete ${name}`); res.status(500).json({ error: "Internal server error" }); }
  });

  return router;
}

const hcPatients = crud(healthcarePatients, ["organizationId", "firstName", "lastName"], healthcarePatients.lastName, "healthcare.patients");
const hcStaff = crud(healthcareStaff, ["organizationId", "firstName", "lastName", "role", "department"], healthcareStaff.lastName, "healthcare.staff");
const hcAppts = crud(healthcareAppointments, ["organizationId", "patientId", "date", "time", "reason"], undefined, "healthcare.appointments");

const cnProjects = crud(constructionProjects, ["organizationId", "name"], constructionProjects.name, "construction.projects");
const cnWorkers = crud(constructionWorkers, ["organizationId", "firstName", "lastName", "role"], constructionWorkers.lastName, "construction.workers");
const cnSafety = crud(constructionSafetyReports, ["organizationId", "reportedBy", "date", "description"], constructionSafetyReports.date, "construction.safety");

const rtProducts = crud(retailProducts, ["organizationId", "name", "sku", "price"], retailProducts.name, "retail.products");
const rtInventory = crud(retailInventory, ["organizationId", "productId", "quantity"], retailInventory.lastRestocked, "retail.inventory");
const rtCustomers = crud(retailCustomers, ["organizationId", "firstName", "lastName"], retailCustomers.lastName, "retail.customers");

const tcProjects = crud(technologyProjects, ["organizationId", "name"], technologyProjects.name, "technology.projects");
const tcTasks = crud(technologyTasks, ["organizationId", "title"], technologyTasks.dueDate, "technology.tasks");
const tcMembers = crud(technologyTeamMembers, ["organizationId", "firstName", "lastName", "role"], technologyTeamMembers.lastName, "technology.members");

const fnAccounts = crud(financeAccounts, ["organizationId", "name", "type"], financeAccounts.name, "finance.accounts");
const fnTransactions = crud(financeTransactions, ["organizationId", "accountId", "type", "amount", "date"], financeTransactions.date, "finance.transactions");
const fnBudgets = crud(financeBudgets, ["organizationId", "name", "amount"], financeBudgets.name, "finance.budgets");

const router = Router();

router.use("/healthcare/patients", hcPatients);
router.use("/healthcare/staff", hcStaff);
router.use("/healthcare/appointments", hcAppts);

router.use("/construction/projects", cnProjects);
router.use("/construction/workers", cnWorkers);
router.use("/construction/safety-reports", cnSafety);

router.use("/retail/products", rtProducts);
router.use("/retail/inventory", rtInventory);
router.use("/retail/customers", rtCustomers);

router.use("/technology/projects", tcProjects);
router.use("/technology/tasks", tcTasks);
router.use("/technology/team-members", tcMembers);

router.use("/finance/accounts", fnAccounts);
router.use("/finance/transactions", fnTransactions);
router.use("/finance/budgets", fnBudgets);

// ── Stats endpoints ──
async function getStats(table: any, orgId: number, key: string) {
  if (!orgId) return null;
  const [result] = await db.select({ count: count() }).from(table).where(eq(table.organizationId, orgId));
  return { [key]: Number(result?.count ?? 0) };
}

router.get("/healthcare/stats", async (req, res) => {
  try {
    const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [p, s, a] = await Promise.all([getStats(healthcarePatients, o, "totalPatients"), getStats(healthcareStaff, o, "totalStaff"), getStats(healthcareAppointments, o, "totalAppointments")]);
    res.json({ ...p, ...s, ...a });
  } catch (err) { req.log.error({ err }, "Failed to get healthcare stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/construction/stats", async (req, res) => {
  try {
    const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [p, w, sr] = await Promise.all([getStats(constructionProjects, o, "totalProjects"), getStats(constructionWorkers, o, "totalWorkers"), getStats(constructionSafetyReports, o, "totalSafetyReports")]);
    res.json({ ...p, ...w, ...sr });
  } catch (err) { req.log.error({ err }, "Failed to get construction stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/retail/stats", async (req, res) => {
  try {
    const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [p, i, c] = await Promise.all([getStats(retailProducts, o, "totalProducts"), getStats(retailInventory, o, "totalInventoryItems"), getStats(retailCustomers, o, "totalCustomers")]);
    res.json({ ...p, ...i, ...c });
  } catch (err) { req.log.error({ err }, "Failed to get retail stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/technology/stats", async (req, res) => {
  try {
    const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [p, t, m] = await Promise.all([getStats(technologyProjects, o, "totalProjects"), getStats(technologyTasks, o, "totalTasks"), getStats(technologyTeamMembers, o, "totalTeamMembers")]);
    res.json({ ...p, ...t, ...m });
  } catch (err) { req.log.error({ err }, "Failed to get technology stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/finance/stats", async (req, res) => {
  try {
    const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [a, t, b] = await Promise.all([getStats(financeAccounts, o, "totalAccounts"), getStats(financeTransactions, o, "totalTransactions"), getStats(financeBudgets, o, "totalBudgets")]);
    res.json({ ...a, ...t, ...b });
  } catch (err) { req.log.error({ err }, "Failed to get finance stats"); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
