import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const organizationsTable = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  size: text("size").notNull(),
  industryPackId: integer("industry_pack_id").notNull(),
  logoUrl: text("logo_url"),
  website: text("website"),
  status: text("status").notNull().default("trial"),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertOrganizationSchema = createInsertSchema(organizationsTable).omit({ id: true, createdAt: true });
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizationsTable.$inferSelect;
