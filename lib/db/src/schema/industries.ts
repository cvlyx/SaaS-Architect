import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { organizationsTable } from "./organizations";

// ── Healthcare ──
export const healthcarePatients = sqliteTable("healthcare_patients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"), dateOfBirth: text("date_of_birth"),
  gender: text("gender"), bloodType: text("blood_type"), allergies: text("allergies"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const healthcareStaff = sqliteTable("healthcare_staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  role: text("role").notNull(), department: text("department").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const healthcareAppointments = sqliteTable("healthcare_appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  patientId: integer("patient_id").notNull().references(() => healthcarePatients.id),
  staffId: integer("staff_id").references(() => healthcareStaff.id),
  date: text("date").notNull(), time: text("time").notNull(),
  reason: text("reason").notNull(), notes: text("notes"),
  status: text("status").notNull().default("scheduled"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Construction ──
export const constructionProjects = sqliteTable("construction_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), description: text("description"),
  location: text("location"), startDate: text("start_date"), endDate: text("end_date"),
  budget: real("budget"), status: text("status").notNull().default("planning"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const constructionWorkers = sqliteTable("construction_workers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  role: text("role").notNull(), certification: text("certification"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const constructionSafetyReports = sqliteTable("construction_safety_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  projectId: integer("project_id").references(() => constructionProjects.id),
  reportedBy: text("reported_by").notNull(), date: text("date").notNull(),
  severity: text("severity").notNull().default("low"),
  description: text("description").notNull(), correctiveAction: text("corrective_action"),
  status: text("status").notNull().default("open"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Retail ──
export const retailProducts = sqliteTable("retail_products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), sku: text("sku").notNull(),
  description: text("description"), price: real("price").notNull(),
  category: text("category"), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const retailInventory = sqliteTable("retail_inventory", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  productId: integer("product_id").notNull().references(() => retailProducts.id),
  quantity: integer("quantity").notNull().default(0),
  reorderLevel: integer("reorder_level").default(10),
  location: text("location"), lastRestocked: text("last_restocked"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const retailCustomers = sqliteTable("retail_customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  loyaltyPoints: integer("loyalty_points").default(0),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Technology ──
export const technologyProjects = sqliteTable("technology_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), description: text("description"),
  repository: text("repository"), startDate: text("start_date"), endDate: text("end_date"),
  status: text("status").notNull().default("planning"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const technologyTasks = sqliteTable("technology_tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  projectId: integer("project_id").references(() => technologyProjects.id),
  title: text("title").notNull(), description: text("description"),
  assignee: text("assignee"), priority: text("priority").default("medium"),
  dueDate: text("due_date"), status: text("status").notNull().default("todo"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const technologyTeamMembers = sqliteTable("technology_team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), role: text("role").notNull(),
  department: text("department"), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Finance ──
export const financeAccounts = sqliteTable("finance_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), accountNumber: text("account_number"),
  type: text("type").notNull().default("checking"),
  balance: real("balance").notNull().default(0), currency: text("currency").default("USD"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const financeTransactions = sqliteTable("finance_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  accountId: integer("account_id").notNull().references(() => financeAccounts.id),
  type: text("type").notNull(), amount: real("amount").notNull(),
  description: text("description"), date: text("date").notNull(),
  category: text("category"), status: text("status").notNull().default("completed"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const financeBudgets = sqliteTable("finance_budgets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), amount: real("amount").notNull(),
  spent: real("spent").notNull().default(0),
  startDate: text("start_date"), endDate: text("end_date"),
  category: text("category"), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Non-Profit ──
export const nonprofitDonors = sqliteTable("nonprofit_donors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  totalDonations: real("total_donations").default(0), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const nonprofitDonations = sqliteTable("nonprofit_donations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  donorId: integer("donor_id").notNull().references(() => nonprofitDonors.id),
  amount: real("amount").notNull(), date: text("date").notNull(),
  campaign: text("campaign"), notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const nonprofitCampaigns = sqliteTable("nonprofit_campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), goal: real("goal").notNull(),
  raised: real("raised").default(0), startDate: text("start_date"), endDate: text("end_date"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Legal ──
export const legalClients = sqliteTable("legal_clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const legalCases = sqliteTable("legal_cases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  clientId: integer("client_id").notNull().references(() => legalClients.id),
  title: text("title").notNull(), type: text("type").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const legalDocuments = sqliteTable("legal_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  caseId: integer("case_id").notNull().references(() => legalCases.id),
  title: text("title").notNull(), type: text("type").notNull(),
  filedBy: text("filed_by"), status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Manufacturing ──
export const manufacturingProducts = sqliteTable("manufacturing_products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), sku: text("sku"),
  description: text("description"), unitCost: real("unit_cost").default(0),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const manufacturingProductionRuns = sqliteTable("manufacturing_production_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  productId: integer("product_id").notNull().references(() => manufacturingProducts.id),
  quantity: integer("quantity").notNull(), startDate: text("start_date"), endDate: text("end_date"),
  status: text("status").notNull().default("planned"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const manufacturingSuppliers = sqliteTable("manufacturing_suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), contact: text("contact"), email: text("email"),
  phone: text("phone"), leadTime: integer("lead_time").default(7),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Real Estate ──
export const realestateProperties = sqliteTable("realestate_properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), address: text("address"),
  type: text("type").notNull().default("residential"),
  price: real("price"), status: text("status").notNull().default("available"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const realestateClients = sqliteTable("realestate_clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  type: text("type").notNull().default("buyer"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const realestateLeases = sqliteTable("realestate_leases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  propertyId: integer("property_id").notNull().references(() => realestateProperties.id),
  clientId: integer("client_id").notNull().references(() => realestateClients.id),
  startDate: text("start_date").notNull(), endDate: text("end_date"),
  rent: real("rent"), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Hospitality ──
export const hospitalityRooms = sqliteTable("hospitality_rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  roomNumber: text("room_number").notNull(), type: text("type").notNull(),
  pricePerNight: real("price_per_night").notNull(),
  capacity: integer("capacity").default(2), status: text("status").notNull().default("available"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const hospitalityGuests = sqliteTable("hospitality_guests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  nationality: text("nationality"), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const hospitalityBookings = sqliteTable("hospitality_bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  roomId: integer("room_id").notNull().references(() => hospitalityRooms.id),
  guestId: integer("guest_id").notNull().references(() => hospitalityGuests.id),
  checkIn: text("check_in").notNull(), checkOut: text("check_out").notNull(),
  totalAmount: real("total_amount"), status: text("status").notNull().default("confirmed"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Transportation ──
export const transportationVehicles = sqliteTable("transportation_vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  plateNumber: text("plate_number").notNull(), model: text("model"),
  capacity: real("capacity"), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const transportationDrivers = sqliteTable("transportation_drivers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  licenseNumber: text("license_number"), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const transportationShipments = sqliteTable("transportation_shipments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  vehicleId: integer("vehicle_id").references(() => transportationVehicles.id),
  driverId: integer("driver_id").references(() => transportationDrivers.id),
  origin: text("origin").notNull(), destination: text("destination").notNull(),
  pickupDate: text("pickup_date"), deliveryDate: text("delivery_date"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Media ──
export const mediaArticles = sqliteTable("media_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  title: text("title").notNull(), content: text("content"),
  author: text("author"), category: text("category"),
  status: text("status").notNull().default("draft"),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const mediaAssets = sqliteTable("media_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), type: text("type").notNull(),
  url: text("url"), fileSize: real("file_size"),
  alt: text("alt"), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const mediaCampaigns = sqliteTable("media_campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(), type: text("type").notNull(),
  budget: real("budget"), startDate: text("start_date"), endDate: text("end_date"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Consulting ──
export const consultingClients = sqliteTable("consulting_clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  company: text("company"), email: text("email"), phone: text("phone"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const consultingConsultants = sqliteTable("consulting_consultants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  specialization: text("specialization"), billRate: real("bill_rate"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const consultingEngagements = sqliteTable("consulting_engagements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  clientId: integer("client_id").notNull().references(() => consultingClients.id),
  consultantId: integer("consultant_id").references(() => consultingConsultants.id),
  title: text("title").notNull(), scope: text("scope"),
  startDate: text("start_date"), endDate: text("end_date"),
  budget: real("budget"), status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ── Government ──
export const governmentCitizens = sqliteTable("government_citizens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(), lastName: text("last_name").notNull(),
  email: text("email"), phone: text("phone"),
  dateOfBirth: text("date_of_birth"), address: text("address"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const governmentPermits = sqliteTable("government_permits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  type: text("type").notNull(), applicantName: text("applicant_name").notNull(),
  description: text("description"), fee: real("fee"),
  issueDate: text("issue_date"), expiryDate: text("expiry_date"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
export const governmentServiceRequests = sqliteTable("government_service_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  citizenId: integer("citizen_id").notNull().references(() => governmentCitizens.id),
  type: text("type").notNull(), description: text("description").notNull(),
  priority: text("priority").default("normal"),
  status: text("status").notNull().default("open"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});