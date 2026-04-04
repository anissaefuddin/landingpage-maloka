"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { APP_COUNT } from "@/lib/apps";

export default function FloatingStatusBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#lab-status"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 md:hidden"
          data-clickable
        >
          <div
            className="flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-md"
            style={{
              background: "color-mix(in srgb, var(--card-bg) 80%, transparent)",
              borderColor: "var(--card-border)",
            }}
          >
            {/* Pulse dot */}
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#34d399", animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#34d399" }} />
            </span>

            <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
              {APP_COUNT} {APP_COUNT === 1 ? "system" : "systems"} running
            </span>

            <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>•</span>

            <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--primary)" }}>
              Explore
              <ArrowRight size={12} />
            </span>
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
