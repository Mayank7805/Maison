"use client"

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { BottomNav } from "./BottomNav";

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className={`flex-1 flex flex-col pb-16 md:pb-0 ${!isHome ? 'pt-16' : ''}`}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
