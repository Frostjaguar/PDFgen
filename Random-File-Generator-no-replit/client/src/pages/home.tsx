import { useState } from "react";
import { Layout } from "@/components/layout";
import { useCreatePdf, usePdfs, downloadPdf } from "@/hooks/use-pdfs";
import { PdfCard } from "@/components/pdf-card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { toast } = useToast();
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState("1");

  const createPdf = useCreatePdf();
  const { data: pdfs, isLoading: isLoadingHistory } = usePdfs();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName || !pageCount) return;

    const pages = parseInt(pageCount, 10);
    if (isNaN(pages) || pages <= 0 || pages > 100) {
      toast({
        title: "Invalid page count",
        description: "Please enter a number between 1 and 100.",
        variant: "destructive",
      });
      return;
    }

    try {
      let finalFileName = fileName;
      if (!finalFileName.endsWith('.pdf')) {
        finalFileName += '.pdf';
      }

      const result = await createPdf.mutateAsync({
        fileName: finalFileName,
        pageCount: pages,
      });

      toast({
        title: "PDF generated!",
        description: "Your download should start automatically.",
      });

      setFileName("");
      setPageCount("1");
      downloadPdf(result.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: GENERATOR FORM */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground">
              Generate <span className="text-gradient">Random PDFs</span>
              <br />in Seconds.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Create PDF documents filled with random letters. Don't know why you may need it, or use it for, but it exists and works
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/60">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Filename Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Filename
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. document"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">.pdf extension will be added automatically</p>
              </div>

              {/* Page Count Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Number of Pages
                </label>
                <input
                  type="number"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  placeholder="1"
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">Maximum 100 pages per PDF</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createPdf.isPending}
                className="
                  w-full px-6 py-4 rounded-xl font-bold text-lg
                  bg-gradient-to-r from-primary to-primary/90
                  text-primary-foreground shadow-lg shadow-primary/25
                  hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-md
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  transition-all duration-200 ease-out flex items-center justify-center gap-2
                "
              >
                {createPdf.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate & Download</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: HISTORY */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Recent History</h2>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {pdfs?.length || 0} PDFs
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoadingHistory ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted/20 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : pdfs && pdfs.length > 0 ? (
              <AnimatePresence>
                {pdfs.map((pdf, idx) => (
                  <PdfCard key={pdf.id} pdf={pdf} index={idx} />
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-border/60 rounded-xl bg-muted/5">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No PDFs yet</h3>
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto mt-1">
                  Generated PDFs will appear here for quick re-downloading.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
