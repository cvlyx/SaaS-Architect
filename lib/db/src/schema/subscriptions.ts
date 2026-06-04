import { pgTable, text, serial, integer, numeric, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const subscriptionPlansTable = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceMonthly: numeric("price_monthly", { precision: 10, scale: 2 }).notNull(),
  priceYearly: numeric("price_yearly", { precision: 10, scale: 2 }).notNull(),
  maxUsers: integer("max_users").notNull(),
  features: jsonb("features").notNull().$type<string[]>().default([]),
  isPopular: boolean("is_popular").notNull().default(false),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  planId: integer("plan_id").notNull(),
  planName: text("plan_name").notNull(),
  status: text("status").notNull().default("trial"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
});

export const paymentRecordsTable = pgTable("payment_records", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("paid"),
  description: text("description").notNull(),
  invoiceUrl: text("invoice_url"),
  paidAt: timestamp("paid_at", { withTimezone: true }).notNull().defaultNow(),
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
