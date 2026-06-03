import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const carriersTable = pgTable("carriers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  contactName: text("contact_name"),
  phone: text("phone"),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCarrierSchema = createInsertSchema(carriersTable).omit({ id: true, createdAt: true });
export type InsertCarrier = z.infer<typeof insertCarrierSchema>;
export type Carrier = typeof carriersTable.$inferSelect;
