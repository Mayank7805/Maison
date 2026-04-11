"use client";
import { AppLayout } from "@/components/layout/AppLayout";
import Link from "next/link";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
        <h1 className="font-display text-8xl md:text-[120px] tracking-tight mb-8">404</h1>
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-12">
          The page you are looking for does not exist.
        </p>
        <Link href="/" className="inline-block border-b border-foreground pb-1 font-mono text-[11px] uppercase tracking-[0.2em] hover:text-primary transition-colors">
          Return to Homepage
        </Link>
      </div>
    </AppLayout>
  );
}
