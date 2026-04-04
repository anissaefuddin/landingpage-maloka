"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Server, FlaskConical, Blocks, Rocket } from "lucide-react";

const items = [
  {
    icon: Server,
    title: "Systems Running in Production",
    description:
      "6+ applications deployed and actively used — from agro-tech to internal systems.",
    proof: "6+ apps deployed",
    color: "#7c3aed",
    accent: "var(--primary)",
  },
  {
    icon: FlaskConical,
    title: "Experiments Running in the Lab",
    description:
      "Continuous prototyping and testing of new ideas — the lab is always active.",
    proof: "Active environments",
    color: "#06b6d4",
    accent: "var(--secondary)",
  },
  {
    icon: Blocks,
    title: "Built on Modular Architecture",
    description:
      "Designed with scalable, reusable components for long-term growth.",
    proof: "Microservice-ready",
    color: "#f472b6",
    accent: "var(--accent)",
  },
];

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="noise-overlay relative overflow-hidden px-6 py-24 md:py-32">
      {/* Background decoration */}
      <div
        className="animate-gradient absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
      />
      <div
        className="animate-gradient absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--secondary), var(--accent-alt))" }}
      />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm shadow-sm"
          >
            <Rocket size={16} style={{ color: "var(--accent)" }} />
            <span style={{ color: "var(--muted)" }}>Proof of Work</span>
          </motion.div>

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
                scale: 1.03,
                y: -6,
                transition: { duration: 0.25 },
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
                whileHover={{ rotate: 12, scale: 1.15 }}
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

              <p className="mb-4 leading-relaxed" style={{ color: "var(--muted)" }}>
                {item.description}
              </p>

              {/* Proof indicator */}
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: `${item.color}12`, color: item.accent }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: item.color }}
                />
                {item.proof}
              </div>

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
