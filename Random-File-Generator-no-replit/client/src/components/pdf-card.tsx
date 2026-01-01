import { GeneratedPdf } from "@shared/schema";
import { format } from "date-fns";
import { Download, FileText } from "lucide-react";
import { downloadPdf } from "@/hooks/use-pdfs";
import { motion } from "framer-motion";

interface PdfCardProps {
  pdf: GeneratedPdf;
  index: number;
}

export function PdfCard({ pdf, index }: PdfCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative bg-card hover:bg-muted/30 border border-border/50 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground truncate pr-4" title={pdf.fileName}>
              {pdf.fileName}
            </h4>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 font-mono">
              <span className="bg-muted px-1.5 py-0.5 rounded text-foreground/70">
                {pdf.pageCount} page{pdf.pageCount !== 1 ? 's' : ''}
              </span>
              <span>•</span>
              <span>{format(new Date(pdf.createdAt!), 'MMM d, HH:mm')}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => downloadPdf(pdf.id)}
          className="shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all active:scale-95"
          title="Download Again"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
