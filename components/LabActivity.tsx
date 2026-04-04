"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronUp, ChevronDown, RefreshCw } from "lucide-react";
import { FeaturedCard, TabThumb, type AppItem } from "./AppCard";
import MobileAppModal from "./MobileAppModal";
import { apps } from "@/lib/apps";

const AUTO_ADVANCE_MS = 6000;
const REFRESH_INTERVAL_MS = 30000;
const MAX_VISIBLE_TABS = 5;

type AppStatus = "loading" | "active" | "inactive";

type StatusInfo = {
  status: AppStatus;
  responseTime: number;
  checkedAt: string;
  uptime: string;
};

type StatusMap = Record<string, StatusInfo>;

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function LabActivity() {
  const sectionRef = useRef<HTMLElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileModalApp, setMobileModalApp] = useState<AppItem | null>(null);
  const [statuses, setStatuses] = useState<StatusMap>(() => {
    const initial: StatusMap = {};
    apps.forEach((app) => {
      initial[app.url] = {
        status: "loading",
        responseTime: -1,
        checkedAt: "",
        uptime: "99.9%",
      };
    });
    return initial;
  });

  const activeCount = Object.values(statuses).filter((s) => s.status === "active").length;
  const isChecking = Object.values(statuses).some((s) => s.status === "loading");
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    setNeedsScroll(apps.length > MAX_VISIBLE_TABS);
  }, []);

  // Check statuses via API route
  const checkAllStatuses = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    for (let i = 0; i < apps.length; i++) {
      const app = apps[i];
      try {
        const res = await fetch(`/api/status?url=${encodeURIComponent(app.url)}`);
        const data = await res.json();
        setStatuses((prev) => ({
          ...prev,
          [app.url]: {
            status: data.status === "active" ? "active" : "inactive",
            responseTime: data.responseTime ?? -1,
            checkedAt: data.checkedAt ?? new Date().toISOString(),
            uptime: prev[app.url]?.uptime ?? "99.9%",
          },
        }));
      } catch {
        setStatuses((prev) => ({
          ...prev,
          [app.url]: {
            ...prev[app.url],
            status: "inactive",
            responseTime: -1,
            checkedAt: new Date().toISOString(),
          },
        }));
      }
      // Stagger requests
      if (i < apps.length - 1) await new Promise((r) => setTimeout(r, 200));
    }
    setRefreshing(false);
  }, []);

  // Initial check
  useEffect(() => {
    checkAllStatuses();
  }, [checkAllStatuses]);

  // Auto-refresh every 30s
  useEffect(() => {
    const timer = setInterval(() => checkAllStatuses(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [checkAllStatuses]);

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

  // Scroll active tab into view (scoped to tab container only)
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

  const defaultStatus: StatusInfo = { status: "loading", responseTime: -1, checkedAt: "", uptime: "99.9%" };
  const currentApp = apps[activeIndex];
  const currentStatus = statuses[currentApp.url] ?? defaultStatus;

  return (
    <section id="lab-status" ref={sectionRef} className="noise-overlay relative overflow-hidden px-5 py-16 md:px-6 md:py-32">
      {/* Background decoration */}
      <div
        className="animate-gradient absolute top-0 right-0 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--secondary), var(--primary))" }}
      />
      <div
        className="animate-gradient absolute -bottom-20 -left-20 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-alt))" }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-12"
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
            className="mb-3 text-2xl font-bold md:mb-4 md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Lab Activity
          </h2>

          <p className="mx-auto mb-2 max-w-lg text-sm md:text-base" style={{ color: "var(--muted)" }}>
            Live systems are actually running right now
          </p>

          {/* Status summary row */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:mt-4 md:gap-4">
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="text-xs font-medium md:text-sm"
              style={{ color: "var(--primary)" }}
            >
              {isChecking
                ? "Checking systems..."
                : `${activeCount} of ${apps.length} Systems Running`}
            </motion.span>

            <motion.button
              onClick={() => checkAllStatuses()}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors md:py-1"
              style={{
                borderColor: "var(--card-border)",
                color: "var(--muted)",
                background: "var(--card-bg)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                className="flex items-center"
              >
                <RefreshCw size={12} />
              </motion.span>
              {refreshing ? "Updating..." : "Refresh"}
            </motion.button>
          </div>
        </motion.div>

        {/* Side-by-side: Tabs (left) + Featured card (right) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:gap-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Tab list — left */}
          <div
            className="tab-panel-height relative flex w-full flex-col md:w-72 md:overflow-hidden"
            style={{ "--card-h": cardHeight ? `${cardHeight}px` : "auto" } as React.CSSProperties}
          >
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

            <div
              ref={tabListRef}
              className="scrollbar-hide flex flex-1 snap-x snap-mandatory flex-row gap-3 overflow-x-auto pb-1 md:snap-none md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pb-0"
              style={{ scrollbarWidth: "none" }}
            >
              {apps.map((app, i) => (
                <div key={app.url} className="min-w-[200px] shrink-0 snap-start md:min-w-0 md:shrink">
                  <TabThumb
                    app={app}
                    status={(statuses[app.url] ?? defaultStatus).status}
                    isActive={i === activeIndex}
                    onClick={() => setActiveIndex(i)}
                  />
                </div>
              ))}
            </div>

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
              app={currentApp}
              status={currentStatus.status}
              responseTime={currentStatus.responseTime}
              checkedAt={currentStatus.checkedAt}
              uptime={currentStatus.uptime}
              onMobileClick={() => setMobileModalApp(currentApp)}
            />
          </div>
        </motion.div>

        {/* Last checked footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-6 flex flex-col items-center gap-2 md:mt-8"
        >
          <p className="text-center text-xs italic md:text-sm" style={{ color: "var(--muted)" }}>
            &ldquo;This lab is active, experiments are running, and systems are alive.&rdquo;
          </p>
          {currentStatus.checkedAt && (
            <motion.p
              key={currentStatus.checkedAt}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] md:text-xs"
              style={{ color: "var(--muted)" }}
            >
              Last checked: {timeAgo(currentStatus.checkedAt)} &middot; Auto-refreshes every 30s
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Mobile app modal */}
      <MobileAppModal
        app={mobileModalApp}
        open={mobileModalApp !== null}
        onClose={() => setMobileModalApp(null)}
      />
    </section>
  );
}
