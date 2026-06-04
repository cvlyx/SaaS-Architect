import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const industryPacksTable = pgTable("industry_packs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  features: jsonb("features").notNull().$type<string[]>().default([]),
  roles: jsonb("roles").notNull().$type<string[]>().default([]),
  icon: text("icon").notNull().default("Building2"),
  color: text("color").notNull().default("#22c55e"),
});

export const insertIndustryPackSchema = createInsertSchema(industryPacksTable).omit({ id: true });
export type InsertIndustryPack = z.infer<typeof insertIndustryPackSchema>;
export type IndustryPack = typeof industryPacksTable.$inferSelect;
