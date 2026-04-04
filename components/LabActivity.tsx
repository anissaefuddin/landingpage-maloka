"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FeaturedCard, TabThumb, type AppItem } from "./AppCard";

const AUTO_ADVANCE_MS = 6000;
const MAX_VISIBLE_TABS = 5;

const apps: AppItem[] = [
  {
    name: "Agro System",
    image: "/images/agro.svg",
    url: "https://agro.maloka.app",
  },
  {
    name: "RIMS",
    image: "/images/rims.svg",
    url: "https://rims.maloka.app",
  },
  {
    name: "Knowledge Platform",
    image: "/images/knowledge.svg",
    url: "https://knowledge.maloka.app",
  },
  {
    name: "API System",
    image: "/images/api.svg",
    url: "https://api.maloka.app",
  },
  {
    name: "API System 2",
    image: "/images/api.svg",
    url: "https://api2.maloka.app",
  },
  {
    name: "API System 3",
    image: "/images/api.svg",
    url: "https://api3.maloka.app",
  },
];

type StatusMap = Record<string, "loading" | "active" | "inactive">;

export default function LabActivity() {
  const sectionRef = useRef<HTMLElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  const [statuses, setStatuses] = useState<StatusMap>(() => {
    const initial: StatusMap = {};
    apps.forEach((app) => {
      initial[app.url] = "loading";
    });
    return initial;
  });

  const activeCount = Object.values(statuses).filter((s) => s === "active").length;
  const isChecking = Object.values(statuses).some((s) => s === "loading");
  const needsScroll = apps.length > MAX_VISIBLE_TABS;

  // Check statuses via API route
  useEffect(() => {
    const checkStatus = async (app: AppItem) => {
      try {
        const res = await fetch(`/api/status?url=${encodeURIComponent(app.url)}`);
        const data = await res.json();
        setStatuses((prev) => ({
          ...prev,
          [app.url]: data.status === "active" ? "active" : "inactive",
        }));
      } catch {
        setStatuses((prev) => ({ ...prev, [app.url]: "inactive" }));
      }
    };

    apps.forEach((app, i) => {
      setTimeout(() => checkStatus(app), i * 300);
    });
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % apps.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused]);

  // Measure FeaturedCard height
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => setCardHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeIndex]);

  // Scroll active tab into view (scoped to tab container only, not the page)
  useEffect(() => {
    const container = tabListRef.current;
    if (!container) return;
    const activeEl = container.children[activeIndex] as HTMLElement | undefined;
    if (!activeEl) return;
    const top = activeEl.offsetTop - container.offsetTop;
    const bottom = top + activeEl.offsetHeight;
    if (top < container.scrollTop) {
      container.scrollTo({ top, behavior: "smooth" });
    } else if (bottom > container.scrollTop + container.clientHeight) {
      container.scrollTo({ top: bottom - container.clientHeight, behavior: "smooth" });
    }
  }, [activeIndex]);

  // Vertical scroll buttons
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = tabListRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 5);
    setCanScrollDown(el.scrollTop < el.scrollHeight - el.clientHeight - 5);
  }, []);

  useEffect(() => {
    const el = tabListRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scrollTabs = (dir: "up" | "down") => {
    const el = tabListRef.current;
    if (!el) return;
    const thumbH = (el.firstElementChild as HTMLElement)?.offsetHeight ?? 64;
    el.scrollBy({ top: dir === "up" ? -thumbH - 12 : thumbH + 12, behavior: "smooth" });
  };

  return (
    <section id="lab-status" ref={sectionRef} className="relative overflow-hidden px-6 py-24 md:py-32">
      {/* Background decoration */}
      <div
        className="animate-gradient absolute top-0 right-0 h-72 w-72 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--secondary), var(--primary))" }}
      />
      <div
        className="animate-gradient absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-alt))" }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
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

          <p className="mx-auto mb-2 max-w-lg text-base" style={{ color: "var(--muted)" }}>
            Real systems currently running in the lab
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            {isChecking
              ? "Checking systems..."
              : `${activeCount} of ${apps.length} Projects Running`}
          </motion.p>
        </motion.div>

        {/* Side-by-side: Tabs (left) + Featured card (right) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col-reverse gap-5 md:flex-row md:items-start"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Tab list — left (height matches featured card) */}
          <div
            className="tab-panel-height relative flex w-full flex-col md:w-72 md:overflow-hidden"
            style={{ "--card-h": cardHeight ? `${cardHeight}px` : "auto" } as React.CSSProperties}
          >
            {/* Scroll up */}
            {needsScroll && (
              <motion.button
                onClick={() => scrollTabs("up")}
                className="mb-1.5 flex w-full items-center justify-center rounded-lg border py-1"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                  opacity: canScrollUp ? 1 : 0.3,
                  pointerEvents: canScrollUp ? "auto" : "none",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Scroll tabs up"
              >
                <ChevronUp size={16} style={{ color: "var(--muted)" }} />
              </motion.button>
            )}

            {/* Scrollable tab container */}
            <div
              ref={tabListRef}
              className="scrollbar-hide flex flex-1 flex-row gap-3 overflow-x-auto md:flex-col md:overflow-x-hidden md:overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {apps.map((app, i) => (
                <div key={app.url} className="shrink-0 md:shrink">
                  <TabThumb
                    app={app}
                    status={statuses[app.url]}
                    isActive={i === activeIndex}
                    onClick={() => setActiveIndex(i)}
                  />
                </div>
              ))}
            </div>

            {/* Scroll down */}
            {needsScroll && (
              <motion.button
                onClick={() => scrollTabs("down")}
                className="mt-1.5 flex w-full items-center justify-center rounded-lg border py-1"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                  opacity: canScrollDown ? 1 : 0.3,
                  pointerEvents: canScrollDown ? "auto" : "none",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Scroll tabs down"
              >
                <ChevronDown size={16} style={{ color: "var(--muted)" }} />
              </motion.button>
            )}
          </div>

          {/* Featured card — right */}
          <div ref={cardRef} className="min-w-0 flex-[2]">
            <FeaturedCard
              app={apps[activeIndex]}
              status={statuses[apps[activeIndex].url]}
            />
          </div>
        </motion.div>

        {/* Narrative message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center text-sm italic"
          style={{ color: "var(--muted)" }}
        >
          &ldquo;This lab is active, experiments are running, and systems are alive.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
