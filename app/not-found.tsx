import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you’re looking for doesn’t exist or has moved.",
  // A 404 should never be indexed or waste crawl budget.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70svh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-wider uppercase text-primary">
        404
      </p>
      <h1 className="text-3xl font-semibold sm:text-4xl">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="max-w-md leading-relaxed text-muted-foreground">
        The link may be out of date, or the page may have moved. Everything else
        is still where you left it.
      </p>
      <Button href="/" variant="outline" size="lg">
        <ArrowLeft className="size-4" aria-hidden />
        Back to home
      </Button>
    </div>
  );
}
