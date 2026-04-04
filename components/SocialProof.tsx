"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Server, FlaskConical, Blocks } from "lucide-react";

const items = [
  {
    icon: Server,
    title: "Real Systems Built",
    description:
      "Production-grade applications powering real businesses — from agriculture to research management.",
    color: "#7c3aed",
    accent: "var(--primary)",
  },
  {
    icon: FlaskConical,
    title: "Live Experiments",
    description:
      "Constantly prototyping, testing, and iterating on new ideas. The lab never sleeps.",
    color: "#06b6d4",
    accent: "var(--secondary)",
  },
  {
    icon: Blocks,
    title: "Scalable Architecture",
    description:
      "Built on modern, modular foundations designed to grow with your ambitions.",
    color: "#f472b6",
    accent: "var(--accent)",
  },
];

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-24 md:py-32">
      {/* Background decoration */}
      <div
        className="animate-gradient absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
      />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2
            className="mb-4 text-3xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            What&apos;s Built Here
          </h2>
          <p className="mx-auto max-w-lg text-base" style={{ color: "var(--muted)" }}>
            From concept to production — real work, real results, real impact.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.15 * i,
                duration: 0.6,
                type: "spring",
                bounce: 0.35,
              }}
              whileHover={{
                scale: 1.02,
                rotateY: 3,
                rotateX: -2,
                transition: { duration: 0.2 },
              }}
              className="card-hover group rounded-2xl border p-8"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <motion.div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: `${item.color}15`, color: item.accent }}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <item.icon size={28} />
              </motion.div>

              <h3
                className="mb-3 text-xl font-bold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {item.title}
              </h3>

              <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                {item.description}
              </p>

              <div
                className="mt-5 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
