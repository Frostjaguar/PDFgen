import { generatedPdfs, type GeneratedPdf, type InsertGeneratedPdf } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createPdf(pdf: InsertGeneratedPdf): Promise<GeneratedPdf>;
  getPdf(id: number): Promise<GeneratedPdf | undefined>;
  listPdfs(): Promise<GeneratedPdf[]>;
}

export class DatabaseStorage implements IStorage {
  async createPdf(insertPdf: InsertGeneratedPdf): Promise<GeneratedPdf> {
    const [pdf] = await db
      .insert(generatedPdfs)
      .values(insertPdf)
      .returning();
    return pdf;
  }

  async getPdf(id: number): Promise<GeneratedPdf | undefined> {
    const [pdf] = await db
      .select()
      .from(generatedPdfs)
      .where(eq(generatedPdfs.id, id));
    return pdf;
  }

  async listPdfs(): Promise<GeneratedPdf[]> {
    return await db
      .select()
      .from(generatedPdfs)
      .orderBy(desc(generatedPdfs.createdAt));
  }
}

export const storage = new DatabaseStorage();
