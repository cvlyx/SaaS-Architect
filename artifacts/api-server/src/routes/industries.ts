import { Router } from "express";
import { db } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import {
  healthcarePatients, healthcareStaff, healthcareAppointments,
  constructionProjects, constructionWorkers, constructionSafetyReports,
  retailProducts, retailInventory, retailCustomers,
  technologyProjects, technologyTasks, technologyTeamMembers,
  financeAccounts, financeTransactions, financeBudgets,
  nonprofitDonors, nonprofitDonations, nonprofitCampaigns,
  legalClients, legalCases, legalDocuments,
  manufacturingProducts, manufacturingProductionRuns, manufacturingSuppliers,
  realestateProperties, realestateClients, realestateLeases,
  hospitalityRooms, hospitalityGuests, hospitalityBookings,
  transportationVehicles, transportationDrivers, transportationShipments,
  mediaArticles, mediaAssets, mediaCampaigns,
  consultingClients, consultingConsultants, consultingEngagements,
  governmentCitizens, governmentPermits, governmentServiceRequests,
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

const npDonors = crud(nonprofitDonors, ["organizationId", "firstName", "lastName"], nonprofitDonors.lastName, "nonprofit.donors");
const npDonations = crud(nonprofitDonations, ["organizationId", "donorId", "amount", "date"], nonprofitDonations.date, "nonprofit.donations");
const npCampaigns = crud(nonprofitCampaigns, ["organizationId", "name", "goal"], nonprofitCampaigns.name, "nonprofit.campaigns");

const lgClients = crud(legalClients, ["organizationId", "firstName", "lastName"], legalClients.lastName, "legal.clients");
const lgCases = crud(legalCases, ["organizationId", "clientId", "title", "type"], legalCases.title, "legal.cases");
const lgDocs = crud(legalDocuments, ["organizationId", "caseId", "title", "type"], legalDocuments.title, "legal.documents");

const mfProducts = crud(manufacturingProducts, ["organizationId", "name"], manufacturingProducts.name, "manufacturing.products");
const mfRuns = crud(manufacturingProductionRuns, ["organizationId", "productId", "quantity"], manufacturingProductionRuns.startDate, "manufacturing.production");
const mfSuppliers = crud(manufacturingSuppliers, ["organizationId", "name"], manufacturingSuppliers.name, "manufacturing.suppliers");

const reProperties = crud(realestateProperties, ["organizationId", "name", "type"], realestateProperties.name, "realestate.properties");
const reClients = crud(realestateClients, ["organizationId", "firstName", "lastName", "type"], realestateClients.lastName, "realestate.clients");
const reLeases = crud(realestateLeases, ["organizationId", "propertyId", "clientId", "startDate"], realestateLeases.startDate, "realestate.leases");

const hpRooms = crud(hospitalityRooms, ["organizationId", "roomNumber", "type", "pricePerNight"], hospitalityRooms.roomNumber, "hospitality.rooms");
const hpGuests = crud(hospitalityGuests, ["organizationId", "firstName", "lastName"], hospitalityGuests.lastName, "hospitality.guests");
const hpBookings = crud(hospitalityBookings, ["organizationId", "roomId", "guestId", "checkIn", "checkOut"], hospitalityBookings.checkIn, "hospitality.bookings");

const tpVehicles = crud(transportationVehicles, ["organizationId", "plateNumber"], transportationVehicles.plateNumber, "transportation.vehicles");
const tpDrivers = crud(transportationDrivers, ["organizationId", "firstName", "lastName"], transportationDrivers.lastName, "transportation.drivers");
const tpShipments = crud(transportationShipments, ["organizationId", "origin", "destination"], transportationShipments.pickupDate, "transportation.shipments");

const mdArticles = crud(mediaArticles, ["organizationId", "title"], mediaArticles.title, "media.articles");
const mdAssets = crud(mediaAssets, ["organizationId", "name", "type"], mediaAssets.name, "media.assets");
const mdCampaigns = crud(mediaCampaigns, ["organizationId", "name", "type"], mediaCampaigns.name, "media.campaigns");

const csClients = crud(consultingClients, ["organizationId", "firstName", "lastName"], consultingClients.lastName, "consulting.clients");
const csConsultants = crud(consultingConsultants, ["organizationId", "firstName", "lastName"], consultingConsultants.lastName, "consulting.consultants");
const csEngagements = crud(consultingEngagements, ["organizationId", "clientId", "title"], consultingEngagements.title, "consulting.engagements");

const gvCitizens = crud(governmentCitizens, ["organizationId", "firstName", "lastName"], governmentCitizens.lastName, "government.citizens");
const gvPermits = crud(governmentPermits, ["organizationId", "type", "applicantName"], governmentPermits.issueDate, "government.permits");
const gvRequests = crud(governmentServiceRequests, ["organizationId", "citizenId", "type", "description"], undefined, "government.requests");

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

router.use("/non-profit/donors", npDonors);
router.use("/non-profit/donations", npDonations);
router.use("/non-profit/campaigns", npCampaigns);

router.use("/legal/clients", lgClients);
router.use("/legal/cases", lgCases);
router.use("/legal/documents", lgDocs);

router.use("/manufacturing/products", mfProducts);
router.use("/manufacturing/production-runs", mfRuns);
router.use("/manufacturing/suppliers", mfSuppliers);

router.use("/real-estate/properties", reProperties);
router.use("/real-estate/clients", reClients);
router.use("/real-estate/leases", reLeases);

router.use("/hospitality/rooms", hpRooms);
router.use("/hospitality/guests", hpGuests);
router.use("/hospitality/bookings", hpBookings);

router.use("/transportation/vehicles", tpVehicles);
router.use("/transportation/drivers", tpDrivers);
router.use("/transportation/shipments", tpShipments);

router.use("/media/articles", mdArticles);
router.use("/media/assets", mdAssets);
router.use("/media/campaigns", mdCampaigns);

router.use("/consulting/clients", csClients);
router.use("/consulting/consultants", csConsultants);
router.use("/consulting/engagements", csEngagements);

router.use("/government/citizens", gvCitizens);
router.use("/government/permits", gvPermits);
router.use("/government/service-requests", gvRequests);

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

router.get("/non-profit/stats", async (req, res) => {
  try { const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [d, dn, c] = await Promise.all([getStats(nonprofitDonors, o, "totalDonors"), getStats(nonprofitDonations, o, "totalDonations"), getStats(nonprofitCampaigns, o, "totalCampaigns")]);
    res.json({ ...d, ...dn, ...c });
  } catch (err) { req.log.error({ err }, "Failed stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/legal/stats", async (req, res) => {
  try { const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [c, ca, d] = await Promise.all([getStats(legalClients, o, "totalClients"), getStats(legalCases, o, "totalCases"), getStats(legalDocuments, o, "totalDocuments")]);
    res.json({ ...c, ...ca, ...d });
  } catch (err) { req.log.error({ err }, "Failed stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/manufacturing/stats", async (req, res) => {
  try { const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [p, pr, s] = await Promise.all([getStats(manufacturingProducts, o, "totalProducts"), getStats(manufacturingProductionRuns, o, "totalProductionRuns"), getStats(manufacturingSuppliers, o, "totalSuppliers")]);
    res.json({ ...p, ...pr, ...s });
  } catch (err) { req.log.error({ err }, "Failed stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/real-estate/stats", async (req, res) => {
  try { const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [p, c, l] = await Promise.all([getStats(realestateProperties, o, "totalProperties"), getStats(realestateClients, o, "totalClients"), getStats(realestateLeases, o, "totalLeases")]);
    res.json({ ...p, ...c, ...l });
  } catch (err) { req.log.error({ err }, "Failed stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/hospitality/stats", async (req, res) => {
  try { const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [r, g, b] = await Promise.all([getStats(hospitalityRooms, o, "totalRooms"), getStats(hospitalityGuests, o, "totalGuests"), getStats(hospitalityBookings, o, "totalBookings")]);
    res.json({ ...r, ...g, ...b });
  } catch (err) { req.log.error({ err }, "Failed stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/transportation/stats", async (req, res) => {
  try { const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [v, d, s] = await Promise.all([getStats(transportationVehicles, o, "totalVehicles"), getStats(transportationDrivers, o, "totalDrivers"), getStats(transportationShipments, o, "totalShipments")]);
    res.json({ ...v, ...d, ...s });
  } catch (err) { req.log.error({ err }, "Failed stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/media/stats", async (req, res) => {
  try { const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [a, as, c] = await Promise.all([getStats(mediaArticles, o, "totalArticles"), getStats(mediaAssets, o, "totalAssets"), getStats(mediaCampaigns, o, "totalCampaigns")]);
    res.json({ ...a, ...as, ...c });
  } catch (err) { req.log.error({ err }, "Failed stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/consulting/stats", async (req, res) => {
  try { const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [c, co, e] = await Promise.all([getStats(consultingClients, o, "totalClients"), getStats(consultingConsultants, o, "totalConsultants"), getStats(consultingEngagements, o, "totalEngagements")]);
    res.json({ ...c, ...co, ...e });
  } catch (err) { req.log.error({ err }, "Failed stats"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/government/stats", async (req, res) => {
  try { const o = Number(req.query.organizationId);
    if (!o) return res.status(400).json({ error: "organizationId required" });
    const [c, p, s] = await Promise.all([getStats(governmentCitizens, o, "totalCitizens"), getStats(governmentPermits, o, "totalPermits"), getStats(governmentServiceRequests, o, "totalRequests")]);
    res.json({ ...c, ...p, ...s });
  } catch (err) { req.log.error({ err }, "Failed stats"); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
