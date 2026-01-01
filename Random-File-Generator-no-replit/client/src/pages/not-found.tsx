import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-4 shadow-xl border-border/50">
        <CardContent className="pt-6 pb-8 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            404 Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8 text-base">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Return Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
