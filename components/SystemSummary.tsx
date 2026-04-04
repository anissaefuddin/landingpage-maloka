"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Terminal, GitBranch, Cpu, Globe, Database, Shield, Radio } from "lucide-react";
import { APP_COUNT } from "@/lib/apps";

/* ── count-up hook ── */
function useCountUp(end: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(ease * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);
  return value;
}

function CountUpStat({
  end,
  suffix,
  prefix,
  color,
  inView,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  color: string;
  inView: boolean;
}) {
  const v = useCountUp(end, 1400, inView);
  return (
    <p
      className="text-2xl font-bold md:text-3xl"
      style={{ fontFamily: "var(--font-space-grotesk)", color }}
    >
      {prefix}
      {v}
      {suffix}
    </p>
  );
}

const stats: {
  icon: typeof Globe;
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  color: string;
  trend?: string;
}[] = [
  { icon: Globe, end: APP_COUNT, label: "Apps Deployed", color: "var(--primary)", trend: "Live systems" },
  { icon: Database, end: 3, label: "Active Databases", color: "var(--secondary)", trend: "All healthy" },
  { icon: GitBranch, end: 100, suffix: "+", label: "Git Commits", color: "var(--accent)", trend: "+15 this week" },
  { icon: Shield, end: 99, suffix: ".9%", label: "Uptime Target", color: "var(--accent-alt)", trend: "On track" },
];

const capabilities = [
  {
    icon: Terminal,
    title: "Full-Stack Systems",
    description: "End-to-end applications from API design to production deployment.",
    color: "var(--primary)",
  },
  {
    icon: Cpu,
    title: "Microservice Architecture",
    description: "Modular services designed to scale independently and reliably.",
    color: "var(--secondary)",
  },
  {
    icon: Globe,
    title: "Multi-Tenant Platforms",
    description: "Shared infrastructure serving multiple clients with isolated data.",
    color: "var(--accent)",
  },
];

export default function SystemSummary() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-24 md:py-32">
      {/* Background */}
      <div
        className="animate-gradient absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
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
            <Cpu size={16} style={{ color: "var(--secondary)" }} />
            <span style={{ color: "var(--muted)" }}>System Overview</span>
          </motion.div>

          <h2
            className="mb-4 text-3xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Lab Infrastructure
          </h2>
          <p className="mx-auto max-w-lg text-base" style={{ color: "var(--muted)" }}>
            A snapshot of the systems powering the maloka lab — always running, always evolving.
          </p>
        </motion.div>

        {/* "Live data" label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 flex items-center justify-center gap-2"
        >
          <Radio size={14} className="animate-pulse" style={{ color: "var(--badge-text)" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--badge-text)" }}>
            Live data
          </span>
        </motion.div>

        {/* Stats row with count-up */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.06, y: -6, boxShadow: `0 12px 32px color-mix(in srgb, ${stat.color} 25%, transparent)` }}
              className="group rounded-2xl border p-5 text-center transition-shadow duration-300"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <motion.div
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, color: stat.color }}
                whileHover={{ rotate: 12 }}
              >
                <stat.icon size={20} />
              </motion.div>
              <CountUpStat
                end={stat.end}
                suffix={stat.suffix}
                prefix={stat.prefix}
                color={stat.color}
                inView={inView}
              />
              <p className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>
                {stat.label}
              </p>
              {stat.trend && (
                <p className="mt-1.5 text-[10px] font-semibold" style={{ color: stat.color, opacity: 0.7 }}>
                  {stat.trend}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Capabilities grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i + 0.5, duration: 0.6, type: "spring", bounce: 0.3 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="card-hover group rounded-2xl border p-7"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <motion.div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: `color-mix(in srgb, ${cap.color} 12%, transparent)`, color: cap.color }}
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <cap.icon size={24} />
              </motion.div>
              <h3
                className="mb-2 text-lg font-bold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {cap.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {cap.description}
              </p>
              <div
                className="mt-4 h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, ${cap.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
