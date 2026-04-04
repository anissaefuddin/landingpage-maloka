"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Activity, Sprout, BarChart3, Brain, Cog, X } from "lucide-react";

const projects = [
  {
    name: "Agro System",
    emoji: "🌱",
    icon: Sprout,
    color: "#22c55e",
    description: "Smart agricultural monitoring and management platform for modern farming operations.",
    status: "Running",
  },
  {
    name: "RIMS",
    emoji: "📊",
    icon: BarChart3,
    color: "#3b82f6",
    description: "Research Information Management System — centralized data analytics and reporting.",
    status: "Running",
  },
  {
    name: "Knowledge Platform",
    emoji: "🧠",
    icon: Brain,
    color: "#a855f7",
    description: "Interactive learning and knowledge-sharing ecosystem built for collaboration.",
    status: "Running",
  },
  {
    name: "API System",
    emoji: "⚙️",
    icon: Cog,
    color: "#f59e0b",
    description: "Robust API gateway and microservice orchestration layer powering all lab systems.",
    status: "Running",
  },
];

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const stepTime = 2000 / target;
    const timer = setInterval(() => {
      current++;
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="text-4xl font-bold md:text-5xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
      {count}{suffix}
    </span>
  );
}

export default function LabStatus() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <section id="lab-status" ref={sectionRef} className="relative overflow-hidden px-6 py-24 md:py-32">
      {/* Background decoration */}
      <div
        className="animate-gradient absolute top-0 right-0 h-72 w-72 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--secondary), var(--primary))" }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          {/* Active badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: "var(--badge-text)" }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ background: "var(--badge-text)" }}
              />
            </span>
            Lab Active
          </motion.div>

          <h2
            className="mb-4 text-3xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Lab Activity
          </h2>

          {/* Counter */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <Counter target={projects.length} />
            <span className="text-lg" style={{ color: "var(--muted)" }}>
              Projects Running in the Lab
            </span>
          </div>

          <p className="mx-auto max-w-lg text-base" style={{ color: "var(--muted)" }}>
            This lab is active, experiments are running, and systems are alive.
          </p>
        </motion.div>

        {/* Project Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.2 + i * 0.15,
                duration: 0.5,
                type: "spring",
                bounce: 0.3,
              }}
              whileHover={{
                scale: 1.03,
                rotateX: 2,
                rotateY: -2,
                transition: { duration: 0.2 },
              }}
              onClick={() => setExpandedCard(expandedCard === i ? null : i)}
              className="card-hover group cursor-pointer rounded-2xl border p-6"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
                perspective: "1000px",
              }}
              data-clickable
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                style={{ background: `${project.color}20`, color: project.color }}
              >
                <project.icon size={24} />
              </div>

              <h3 className="mb-1 text-lg font-semibold">{project.name}</h3>
              <span className="text-2xl">{project.emoji}</span>

              <div className="mt-3 flex items-center gap-1.5">
                <Activity size={12} style={{ color: project.color }} />
                <span className="text-xs font-medium" style={{ color: project.color }}>
                  {project.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded Card Modal */}
        <AnimatePresence>
          {expandedCard !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm"
              onClick={() => setExpandedCard(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="relative w-full max-w-md rounded-3xl border p-8 shadow-2xl"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setExpandedCard(null)}
                  className="absolute top-4 right-4 rounded-full p-1"
                  style={{ color: "var(--muted)" }}
                >
                  <X size={20} />
                </button>

                {(() => {
                  const IconComp = projects[expandedCard].icon;
                  return (
                    <div
                      className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                      style={{
                        background: `${projects[expandedCard].color}20`,
                        color: projects[expandedCard].color,
                      }}
                    >
                      <IconComp size={28} />
                    </div>
                  );
                })()}

                <h3 className="mb-2 text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {projects[expandedCard].name} {projects[expandedCard].emoji}
                </h3>
                <p className="mb-4 leading-relaxed" style={{ color: "var(--muted)" }}>
                  {projects[expandedCard].description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ background: projects[expandedCard].color }}
                    />
                    <span
                      className="relative inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ background: projects[expandedCard].color }}
                    />
                  </span>
                  <span className="text-sm font-medium" style={{ color: projects[expandedCard].color }}>
                    System Active
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
