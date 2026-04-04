"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sparkles, ArrowDown, Activity, Zap } from "lucide-react";
import { APP_COUNT } from "@/lib/apps";

/* ── Magnetic Button ── */
function MagneticButton({
  children,
  className,
  style,
  href,
  target,
  rel,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href: string;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({ x: (e.clientX - cx) * 0.15, y: (e.clientY - cy) * 0.15 });
  }, []);

  const handleLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      style={style}
      data-clickable
    >
      {children}
    </motion.a>
  );
}

const floatingShapes = [
  { color: "var(--primary)", size: 80, x: "10%", y: "20%", delay: 0, anim: "animate-float" },
  { color: "var(--secondary)", size: 60, x: "80%", y: "15%", delay: 0.5, anim: "animate-float-reverse" },
  { color: "var(--accent)", size: 100, x: "70%", y: "70%", delay: 1, anim: "animate-float" },
  { color: "var(--accent-alt)", size: 50, x: "20%", y: "75%", delay: 1.5, anim: "animate-float-slow" },
  { color: "var(--primary-light)", size: 70, x: "50%", y: "10%", delay: 0.8, anim: "animate-float-reverse" },
  { color: "var(--secondary)", size: 40, x: "90%", y: "50%", delay: 0.3, anim: "animate-float-slow" },
  { color: "var(--accent)", size: 55, x: "5%", y: "50%", delay: 1.2, anim: "animate-float" },
  { color: "var(--primary)", size: 35, x: "35%", y: "85%", delay: 0.6, anim: "animate-float-reverse" },
  { color: "var(--secondary)", size: 45, x: "60%", y: "5%", delay: 1.0, anim: "animate-float-slow" },
  { color: "var(--accent-alt)", size: 30, x: "95%", y: "80%", delay: 0.9, anim: "animate-float" },
];

export default function HeroPlayground() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 40, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 40, stiffness: 150 });

  const parallaxX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-20, 20]);
  const parallaxXSlow = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const parallaxYSlow = useTransform(springY, [-0.5, 0.5], [-8, 8]);
  const glowX = useTransform(springX, [-0.5, 0.5], ["40%", "60%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["40%", "60%"]);

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
      className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{ background: "var(--background)" }}
    >
      {/* Cursor-reactive glow */}
      <motion.div
        className="pointer-events-none absolute h-[600px] w-[600px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: "radial-gradient(circle, var(--primary), transparent 70%)",
          left: glowX,
          top: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Floating shapes with parallax */}
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
            x: i % 2 === 0 ? parallaxX : parallaxXSlow,
            y: i % 2 === 0 ? parallaxY : parallaxYSlow,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ delay: shape.delay, duration: 0.8, type: "spring" }}
          whileHover={{ scale: 1.5, opacity: 0.45 }}
        />
      ))}

      {/* Decorative blobs */}
      <div
        className="animate-gradient absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
      />
      <div
        className="animate-gradient absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-alt))" }}
      />
      <div
        className="animate-gradient absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--secondary), var(--accent))" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-3xl text-center"
        style={{ x: parallaxXSlow, y: parallaxYSlow }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm shadow-sm backdrop-blur-sm"
        >
          <Sparkles size={16} className="text-[var(--accent)]" />
          <span style={{ color: "var(--muted)" }}>Welcome to the Lab</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4 text-5xl font-bold leading-tight tracking-tight md:text-7xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <span className="gradient-text">maloka.app</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-2 text-sm font-medium uppercase tracking-widest"
          style={{ color: "var(--primary)" }}
        >
          Multi Application Lab of Knowledge
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mb-8 max-w-xl text-lg leading-relaxed md:text-xl"
          style={{ color: "var(--muted)" }}
        >
          A living lab where real systems are built, deployed, and continuously evolving.
        </motion.p>

        {/* Proof indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-10 flex items-center justify-center gap-6"
        >
          <div
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: "var(--badge-text)" }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--badge-text)" }} />
            </span>
            {APP_COUNT} {APP_COUNT === 1 ? "System" : "Systems"} Running
          </div>
          <div
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
          >
            <Zap size={14} />
            Experiments Active
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton
            href="#lab-status"
            className="ripple inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(124,58,237,0.4)]"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
          >
            <Activity size={18} />
            Explore the Lab
          </MagneticButton>
          <MagneticButton
            href="#cta"
            className="ripple inline-flex items-center gap-2 rounded-full border-2 px-8 py-3.5 text-base font-semibold transition-colors duration-300 hover:bg-[var(--primary)] hover:text-white"
            style={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
            }}
          >
            Let&apos;s Build Together
          </MagneticButton>
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
