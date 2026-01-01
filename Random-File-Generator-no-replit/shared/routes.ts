import { z } from 'zod';
import { insertGeneratedPdfSchema, generatedPdfs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  pdfs: {
    list: {
      method: 'GET' as const,
      path: '/api/pdfs',
      responses: {
        200: z.array(z.custom<typeof generatedPdfs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/pdfs',
      input: insertGeneratedPdfSchema,
      responses: {
        201: z.custom<typeof generatedPdfs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    download: {
      method: 'GET' as const,
      path: '/api/pdfs/:id/download',
      responses: {
        200: z.any(), // PDF stream
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
