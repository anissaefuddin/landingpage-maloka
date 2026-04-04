"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";

const floatingShapes = [
  { color: "var(--primary)", size: 80, x: "10%", y: "20%", delay: 0, anim: "animate-float" },
  { color: "var(--secondary)", size: 60, x: "80%", y: "15%", delay: 0.5, anim: "animate-float-reverse" },
  { color: "var(--accent)", size: 100, x: "70%", y: "70%", delay: 1, anim: "animate-float" },
  { color: "var(--accent-alt)", size: 50, x: "20%", y: "75%", delay: 1.5, anim: "animate-float-slow" },
  { color: "var(--primary-light)", size: 70, x: "50%", y: "10%", delay: 0.8, anim: "animate-float-reverse" },
  { color: "var(--secondary)", size: 40, x: "90%", y: "50%", delay: 0.3, anim: "animate-float-slow" },
  { color: "var(--accent)", size: 55, x: "5%", y: "50%", delay: 1.2, anim: "animate-float" },
];

export default function HeroPlayground() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  const parallaxX = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{
        background: "var(--background)",
      }}
    >
      {/* Floating shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full opacity-20 blur-sm ${shape.anim}`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: shape.color,
            x: parallaxX,
            y: parallaxY,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ delay: shape.delay, duration: 0.8, type: "spring" }}
          whileHover={{ scale: 1.4, opacity: 0.4 }}
        />
      ))}

      {/* Decorative blobs */}
      <div
        className="animate-gradient absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
      />
      <div
        className="animate-gradient absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-15 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-alt))" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-3xl text-center"
        style={{ x: parallaxX, y: parallaxY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm shadow-sm"
        >
          <Sparkles size={16} className="text-[var(--accent)]" />
          <span style={{ color: "var(--muted)" }}>Welcome to the Lab Playground</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <span className="gradient-text">maloka.app</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed md:text-xl"
          style={{ color: "var(--muted)" }}
        >
          Multi Application Lab of Knowledge — a playful lab where ideas turn into real digital systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.a
            href="#lab-status"
            className="ripple inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore the Lab
            <ArrowDown size={16} />
          </motion.a>
          <motion.a
            href="#cta"
            className="ripple inline-flex items-center gap-2 rounded-full border-2 px-8 py-3.5 text-base font-semibold transition-colors duration-300 hover:bg-[var(--primary)] hover:text-white"
            style={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Let&apos;s Build Together
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs" style={{ color: "var(--muted)" }}>Scroll to explore</span>
          <ArrowDown size={16} style={{ color: "var(--muted)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
