"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MessageCircle, Rocket, Hand } from "lucide-react";

export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="cta"
      ref={ref}
      className="relative overflow-hidden px-6 py-24 md:py-32"
    >
      {/* Background blobs */}
      <div
        className="animate-gradient absolute -top-20 -left-20 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
      />
      <div
        className="animate-gradient absolute -bottom-20 -right-20 h-80 w-80 rounded-full opacity-15 blur-3xl"
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
            <Hand size={16} className="text-[var(--accent-alt)]" />
            <span style={{ color: "var(--muted)" }}>Let&apos;s Play &amp; Build</span>
          </motion.div>

          <h2
            className="mb-6 text-3xl font-bold leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Let&apos;s Build Something{" "}
            <span className="gradient-text">Fun Together</span>
          </h2>

          <p
            className="mx-auto mb-10 max-w-lg text-lg leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Got an idea? A project? Or just want to say hello? The lab is always open for new experiments and collaborations.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.a
            href="mailto:hello@maloka.app"
            className="ripple inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket size={18} />
            Start a Project
          </motion.a>

          <motion.a
            href="https://wa.me/6285641542123"
            target="_blank"
            rel="noopener noreferrer"
            className="ripple inline-flex items-center gap-2 rounded-full border-2 px-8 py-3.5 text-base font-semibold transition-colors duration-300 hover:bg-[var(--accent)] hover:text-white"
            style={{
              borderColor: "var(--accent)",
              color: "var(--accent)",
            }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={18} />
            Say Hello
          </motion.a>
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8"
        >
          <a
            href="mailto:hello@maloka.app"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            <Mail size={16} />
            hello@maloka.app
          </a>
          <a
            href="https://wa.me/6285641542123"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
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
