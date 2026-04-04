"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Mail, Smartphone } from "lucide-react";
import type { AppItem } from "./AppCard";
import { WA_URL, EMAIL_URL } from "@/lib/contact";

type MobileAppModalProps = {
  app: AppItem | null;
  open: boolean;
  onClose: () => void;
};

export default function MobileAppModal({ app, open, onClose }: MobileAppModalProps) {
  if (!app) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--card-border)]"
              style={{ color: "var(--muted)" }}
              data-clickable
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Icon */}
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}
              >
                <Smartphone size={28} />
              </div>

              {/* App name */}
              <h3
                className="mb-1 text-xl font-bold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {app.name}
              </h3>

              {/* Type label */}
              <span
                className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}
              >
                Mobile Application
              </span>

              {/* Description */}
              {app.description && (
                <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {app.description}
                </p>
              )}

              {/* Friendly explanation */}
              <div
                className="mb-6 rounded-xl p-4 text-left text-sm leading-relaxed"
                style={{ background: "var(--badge-bg)", color: "var(--muted)" }}
              >
                This application is designed for mobile devices.
                <br /><br />
                If you&apos;d like to explore or use this system, feel free to reach out.
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <motion.a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ripple inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg"
                  style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(37,211,102,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  data-clickable
                >
                  <MessageCircle size={18} />
                  Chat via WhatsApp
                </motion.a>

                <motion.a
                  href={EMAIL_URL}
                  className="ripple inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-semibold transition-colors hover:bg-[var(--primary)] hover:text-white"
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  data-clickable
                >
                  <Mail size={18} />
                  Contact via Email
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
