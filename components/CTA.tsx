"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MessageCircle, Rocket, Handshake } from "lucide-react";
import { CONTACT_EMAIL, EMAIL_URL, WA_URL, WA_DISPLAY } from "@/lib/contact";

export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="cta"
      ref={ref}
      className="noise-overlay relative overflow-hidden px-6 py-24 md:py-32"
    >
      {/* Background blobs */}
      <div
        className="animate-gradient absolute -top-20 -left-20 h-96 w-96 rounded-full opacity-15 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
      />
      <div
        className="animate-gradient absolute -bottom-20 -right-20 h-96 w-96 rounded-full opacity-15 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--secondary), var(--accent-alt))" }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm shadow-sm"
          >
            <Handshake size={16} className="text-[var(--accent-alt)]" />
            <span style={{ color: "var(--muted)" }}>Open for Collaboration</span>
          </motion.div>

          <h2
            className="mb-6 text-3xl font-bold leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Let&apos;s Build{" "}
            <span className="gradient-text">Real Systems</span>{" "}
            Together
          </h2>

          <p
            className="mx-auto mb-6 max-w-lg text-lg leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Open for collaboration, system development, and experimental projects. The lab is always ready for the next challenge.
          </p>

          <div className="mb-10 flex flex-col items-center gap-1.5">
            <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
              Currently accepting limited projects
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              No commitment — just a conversation
            </p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.a
            href={EMAIL_URL}
            className="ripple inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
            whileHover={{ scale: 1.06, y: -3, boxShadow: "0 10px 40px rgba(124,58,237,0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket size={18} />
            Start a Project
          </motion.a>

          <motion.a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ripple inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-base font-semibold transition-colors duration-300 hover:bg-[var(--accent)] hover:text-white"
            style={{
              borderColor: "var(--accent)",
              color: "var(--accent)",
            }}
            whileHover={{ scale: 1.06, y: -3, boxShadow: "0 10px 30px rgba(244,114,182,0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </motion.a>
        </motion.div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 flex items-center justify-center gap-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--badge-text)" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--badge-text)" }} />
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
            Response within 24 hours
          </span>
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8"
        >
          <motion.a
            href={EMAIL_URL}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all"
            style={{ color: "var(--muted)", borderColor: "var(--card-border)", background: "var(--card-bg)" }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Mail size={14} />
            {CONTACT_EMAIL}
          </motion.a>
          <motion.a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all"
            style={{ color: "var(--muted)", borderColor: "var(--card-border)", background: "var(--card-bg)" }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <MessageCircle size={14} />
            {WA_DISPLAY}
          </motion.a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 border-t pt-8"
          style={{ borderColor: "var(--card-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            © {new Date().getFullYear()} maloka.app — Multi Application Lab of Knowledge
          </p>
        </motion.div>
      </div>
    </section>
  );
}
