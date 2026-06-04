import { pgTable, text, serial, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull().default("Box"),
  priceMonthly: numeric("price_monthly", { precision: 10, scale: 2 }),
});

export const insertModuleSchema = createInsertSchema(modulesTable).omit({ id: true });
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modulesTable.$inferSelect;

export const organizationModulesTable = pgTable("organization_modules", {
  id: serial("id").primaryKey(),
  organizationId: serial("organization_id").notNull(),
  moduleId: serial("module_id").notNull(),
});
