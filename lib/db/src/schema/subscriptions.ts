import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { organizationsTable } from "./organizations";

export const subscriptionPlansTable = sqliteTable("subscription_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  priceMonthly: text("price_monthly").notNull(),
  priceYearly: text("price_yearly").notNull(),
  maxUsers: integer("max_users").notNull(),
  features: text("features", { mode: "json" }).notNull().$type<string[]>().default([]),
  isPopular: integer("is_popular", { mode: "boolean" }).notNull().default(false),
});

export const subscriptionsTable = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  planId: integer("plan_id").notNull().references(() => subscriptionPlansTable.id),
  planName: text("plan_name").notNull(),
  status: text("status").notNull().default("trial"),
  currentPeriodStart: text("current_period_start").notNull(),
  currentPeriodEnd: text("current_period_end").notNull(),
});

export const paymentRecordsTable = sqliteTable("payment_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  amount: text("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("paid"),
  description: text("description").notNull(),
  invoiceUrl: text("invoice_url"),
  paidAt: text("paid_at").notNull().default(sql`(datetime('now'))`),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlansTable).omit({ id: true });
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlansTable.$inferSelect;

export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({ id: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;

export const insertPaymentRecordSchema = createInsertSchema(paymentRecordsTable).omit({ id: true });
export type InsertPaymentRecord = z.infer<typeof insertPaymentRecordSchema>;
export type PaymentRecord = typeof paymentRecordsTable.$inferSelect;
