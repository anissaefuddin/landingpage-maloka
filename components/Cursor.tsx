"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function Cursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[data-clickable]");
      setHovering(!!isClickable);
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", checkHover);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", checkHover);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [x, y, visible]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden rounded-full md:block"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 48 : clicking ? 20 : 32,
          height: hovering ? 48 : clicking ? 20 : 32,
          background: hovering
            ? "radial-gradient(circle, rgba(124,58,237,0.3), rgba(6,182,212,0.2))"
            : "radial-gradient(circle, rgba(124,58,237,0.2), rgba(244,114,182,0.15))",
          opacity: visible ? 1 : 0,
          transition: "width 0.2s, height 0.2s, background 0.3s, opacity 0.2s",
          mixBlendMode: "normal",
        }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-2 w-2 rounded-full md:block"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          background: hovering ? "var(--secondary)" : "var(--primary)",
          opacity: visible ? 1 : 0,
          transition: "background 0.3s, opacity 0.2s",
        }}
      />
    </>
  );
}
