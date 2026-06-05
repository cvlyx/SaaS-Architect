import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const industryPacksTable = sqliteTable("industry_packs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  features: text("features", { mode: "json" }).notNull().$type<string[]>().default([]),
  roles: text("roles", { mode: "json" }).notNull().$type<string[]>().default([]),
  icon: text("icon").notNull().default("Building2"),
  color: text("color").notNull().default("#22c55e"),
});

export const insertIndustryPackSchema = createInsertSchema(industryPacksTable).omit({ id: true });
export type InsertIndustryPack = z.infer<typeof insertIndustryPackSchema>;
export type IndustryPack = typeof industryPacksTable.$inferSelect;
