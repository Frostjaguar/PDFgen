import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import PDFDocument from "pdfkit";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.pdfs.list.path, async (req, res) => {
    const pdfs = await storage.listPdfs();
    res.json(pdfs);
  });

  app.post(api.pdfs.create.path, async (req, res) => {
    try {
      const input = api.pdfs.create.input.parse(req.body);
      const pdf = await storage.createPdf(input);
      res.status(201).json(pdf);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.pdfs.download.path, async (req, res) => {
    const id = Number(req.params.id);
    const pdf = await storage.getPdf(id);

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${pdf.fileName}"`);
    res.setHeader("Content-Type", "application/pdf");

    const doc = new PDFDocument({
      bufferPages: false,
    });

    doc.pipe(res);

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lettersPerPage = 2500; // ~50 lines x 50 chars

    for (let page = 0; page < pdf.pageCount; page++) {
      let text = "";

      for (let i = 0; i < lettersPerPage; i++) {
        text += letters[Math.floor(Math.random() * letters.length)];

        // Add newline every 50 characters for readability
        if ((i + 1) % 50 === 0) {
          text += "\n";
        }
      }

      doc.fontSize(10).text(text, 50, 50, {
        width: 500,
        height: 750,
      });

      if (page < pdf.pageCount - 1) {
        doc.addPage();
      }
    }

    doc.end();
  });

  return httpServer;
}
