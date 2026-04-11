"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    // Animate progress bar quickly to 80%, then finish on mount
    const t1 = setTimeout(() => setProgress(60), 50);
    const t2 = setTimeout(() => setProgress(80), 150);
    const t3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return (
    <>
      {/* Slim gold progress bar at top */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="progress-bar"
            className="fixed top-0 left-0 z-[100] h-[2px] bg-gold"
            style={{ width: `${progress}%` }}
            initial={{ opacity: 0, width: "0%" }}
            animate={{ opacity: 1, width: `${progress}%` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Page fade-in */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.16, 0.68, 0.27, 0.99] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
