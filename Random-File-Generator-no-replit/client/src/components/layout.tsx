import { ReactNode } from "react";
import { Link } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:rotate-6">
              <span className="text-white font-mono font-bold text-lg">PG</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              PDFGen
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
