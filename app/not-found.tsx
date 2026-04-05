"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Home, ArrowLeft, Compass } from "lucide-react";

function MagneticButton({
  children,
  className,
  style,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href: string;
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
];

export default function NotFound() {
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
      onMouseMove={handleMouseMove}
      className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{ background: "var(--background)" }}
    >
      {/* Cursor-reactive glow */}
      <motion.div
        className="pointer-events-none absolute h-[600px] w-[600px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: "radial-gradient(circle, var(--accent), transparent 70%)",
          left: glowX,
          top: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

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
            x: i % 2 === 0 ? parallaxX : parallaxXSlow,
            y: i % 2 === 0 ? parallaxY : parallaxYSlow,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ delay: shape.delay, duration: 0.8, type: "spring" }}
        />
      ))}

      {/* Decorative blobs */}
      <div
        className="animate-gradient absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
      />
      <div
        className="animate-gradient absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--secondary), var(--accent-alt))" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-2xl text-center"
        style={{ x: parallaxXSlow, y: parallaxYSlow }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm shadow-sm backdrop-blur-sm"
        >
          <Compass size={16} className="text-[var(--accent)]" />
          <span style={{ color: "var(--muted)" }}>Lost in the Lab</span>
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-2 text-[120px] font-bold leading-none tracking-tighter md:text-[180px]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <span className="gradient-text">404</span>
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-4 text-2xl font-semibold md:text-3xl"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--foreground)" }}
        >
          Page Not Found
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mb-10 max-w-md text-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          This experiment doesn&apos;t exist — or it got lost in the void between deployments.
          Let&apos;s get you back to the lab.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton
            href="/"
            className="ripple inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(124,58,237,0.4)]"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
          >
            <Home size={18} />
            Back to Lab
          </MagneticButton>
          <MagneticButton
            href="javascript:history.back()"
            className="ripple inline-flex items-center gap-2 rounded-full border-2 px-8 py-3.5 text-base font-semibold transition-colors duration-300 hover:bg-[var(--primary)] hover:text-white"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            <ArrowLeft size={18} />
            Go Back
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
