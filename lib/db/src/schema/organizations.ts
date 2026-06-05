import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { industryPacksTable } from "./industryPacks";

export const organizationsTable = sqliteTable("organizations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  size: text("size").notNull(),
  industryPackId: integer("industry_pack_id").notNull().references(() => industryPacksTable.id),
  logoUrl: text("logo_url"),
  website: text("website"),
  status: text("status").notNull().default("trial"),
  trialEndsAt: text("trial_ends_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const insertOrganizationSchema = createInsertSchema(organizationsTable).omit({ id: true, createdAt: true });
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizationsTable.$inferSelect;
