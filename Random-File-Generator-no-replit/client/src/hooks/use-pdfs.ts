import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertGeneratedPdf } from "@shared/routes";

// GET /api/pdfs
export function usePdfs() {
  return useQuery({
    queryKey: [api.pdfs.list.path],
    queryFn: async () => {
      const res = await fetch(api.pdfs.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PDF history");
      return api.pdfs.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/pdfs
export function useCreatePdf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertGeneratedPdf) => {
      const validated = api.pdfs.create.input.parse(data);
      const res = await fetch(api.pdfs.create.path, {
        method: api.pdfs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.pdfs.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create PDF");
      }
      return api.pdfs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.pdfs.list.path] });
    },
  });
}

// Helper to trigger download
export function downloadPdf(id: number) {
  const url = buildUrl(api.pdfs.download.path, { id });
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
