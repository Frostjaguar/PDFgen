import { pgTable, text, serial, integer, timestamp, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const generatedPdfs = pgTable("generated_pdfs", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  pageCount: integer("page_count").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGeneratedPdfSchema = createInsertSchema(generatedPdfs).omit({ 
  id: true, 
  createdAt: true 
});

export type GeneratedPdf = typeof generatedPdfs.$inferSelect;
export type InsertGeneratedPdf = z.infer<typeof insertGeneratedPdfSchema>;

export type CreatePdfRequest = InsertGeneratedPdf;
