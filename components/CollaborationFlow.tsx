"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageSquare,
  Lightbulb,
  Hammer,
  Rocket,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Contact",
    description:
      "Start with a simple conversation — share your idea or challenge.",
    color: "var(--primary)",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm",
    description:
      "We explore possibilities, refine ideas, and design the right solution.",
    color: "var(--secondary)",
  },
  {
    icon: Hammer,
    title: "Build",
    description:
      "Rapid development with a focus on real-world usability and scalability.",
    color: "var(--accent)",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description:
      "Systems go live — stable, monitored, and ready for use.",
    color: "var(--accent-alt)",
  },
  {
    icon: TrendingUp,
    title: "Impact",
    description:
      "Real results, continuous improvement, and evolving systems.",
    color: "var(--primary)",
  },
];

type Step = (typeof steps)[number];

function MobileStepSlider({ steps, inView }: { steps: Step[]; inView: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 12 : 1;
    const idx = Math.round(el.scrollLeft / cardW);
    setActiveIdx(Math.min(idx, steps.length - 1));
  }, [steps.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="md:hidden">
      <div
        ref={scrollRef}
        className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 * i + 0.3, duration: 0.4 }}
            className="w-[75vw] min-w-[75vw] snap-center rounded-2xl border p-5"
            style={{
              background: "var(--card-bg)",
              borderColor: i === activeIdx ? step.color : "var(--card-border)",
              boxShadow: i === activeIdx ? `0 8px 24px color-mix(in srgb, ${step.color} 20%, transparent)` : "none",
            }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: `color-mix(in srgb, ${step.color} 15%, transparent)`,
                  color: step.color,
                }}
              >
                <step.icon size={20} />
              </div>
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: step.color }}
                >
                  Step {i + 1}
                </span>
                <h3
                  className="text-base font-bold"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {step.title}
                </h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {steps.map((step, i) => (
          <motion.button
            key={i}
            onClick={() => {
              const el = scrollRef.current;
              if (!el || !el.firstElementChild) return;
              const cardW = (el.firstElementChild as HTMLElement).offsetWidth + 12;
              el.scrollTo({ left: cardW * i, behavior: "smooth" });
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIdx ? 20 : 6,
              height: 6,
              background: i === activeIdx ? step.color : "var(--card-border)",
            }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function CollaborationFlow() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative overflow-hidden px-5 py-16 md:px-6 md:py-32">
      {/* Background */}
      <div
        className="animate-gradient absolute -bottom-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm shadow-sm"
          >
            <Rocket size={16} style={{ color: "var(--accent)" }} />
            <span style={{ color: "var(--muted)" }}>Collaboration</span>
          </motion.div>

          <h2
            className="mb-3 text-2xl font-bold md:mb-4 md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            How We Build Together
          </h2>
          <p className="mx-auto max-w-lg text-sm md:text-base" style={{ color: "var(--muted)" }}>
            From first conversation to real impact — a clear path to collaboration.
          </p>
        </motion.div>

        {/* ─── Desktop: horizontal flow ─── */}
        <div className="hidden md:block">
          <div className="relative flex items-start justify-between">
            {/* Connecting line */}
            <motion.div
              className="absolute top-8 right-8 left-8 h-0.5"
              style={{ background: "var(--card-border)" }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            />
            {/* Animated progress overlay */}
            <motion.div
              className="absolute top-8 left-8 h-0.5 origin-left"
              style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))", width: "calc(100% - 64px)" }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.6, duration: 1.5, ease: "easeInOut" }}
            />

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 * i + 0.4, duration: 0.5, type: "spring", bounce: 0.3 }}
                className="group relative z-10 flex w-1/5 flex-col items-center text-center"
              >
                {/* Step circle */}
                <motion.div
                  whileHover={{ scale: 1.15, boxShadow: `0 0 24px color-mix(in srgb, ${step.color} 40%, transparent)` }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 transition-shadow duration-300"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: step.color,
                    color: step.color,
                  }}
                >
                  <step.icon size={24} />
                </motion.div>

                <h3
                  className="mb-1.5 text-sm font-bold"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {step.title}
                </h3>
                <p className="max-w-[160px] text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {step.description}
                </p>

                {/* Step number */}
                <span
                  className="mt-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                  style={{ background: `color-mix(in srgb, ${step.color} 12%, transparent)`, color: step.color }}
                >
                  {i + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Mobile: horizontal snap scroll cards ─── */}
        <MobileStepSlider steps={steps} inView={inView} />

        {/* Bottom statement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center text-xs italic md:mt-14 md:text-sm"
          style={{ color: "var(--muted)" }}
        >
          &ldquo;Built using real systems, not prototypes.&rdquo;
        </motion.p>

        {/* Micro CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <motion.a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors md:px-0 md:py-0"
            style={{ color: "var(--primary)" }}
            whileHover={{ x: 4 }}
            data-clickable
          >
            Ready to start? Let&apos;s build together
            <ArrowRight size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
