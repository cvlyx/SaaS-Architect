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
