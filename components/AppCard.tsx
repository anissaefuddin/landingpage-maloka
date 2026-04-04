"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Clock, Gauge, ArrowUpRight } from "lucide-react";

export type AppItem = {
  name: string;
  image: string;
  url: string;
};

export type AppStatus = "loading" | "active" | "inactive";

/* ───────────────────── Featured Card (large) ───────────────────── */

type FeaturedCardProps = {
  app: AppItem;
  status: AppStatus;
  responseTime?: number;
  checkedAt?: string;
  uptime?: string;
};

export function FeaturedCard({ app, status, responseTime, checkedAt, uptime }: FeaturedCardProps) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
    <AnimatePresence mode="wait">
      <motion.a
        key={app.url}
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.97 }}
        transition={{ duration: 0.35, type: "spring", bounce: 0.2 }}
        whileHover={{ scale: 1.01 }}
        className="group relative block h-full w-full overflow-hidden rounded-3xl border shadow-lg transition-shadow duration-300 hover:shadow-2xl"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
        data-clickable
      >
        {/* Image area */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {status === "loading" ? (
            <div className="absolute inset-0">
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-[var(--card-bg)] via-[var(--card-border)] to-[var(--card-bg)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
            </div>
          ) : (
            <Image
              src={app.image}
              alt={app.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          )}

          {/* Light reflection gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Status badge — top right */}
          <div className="absolute top-4 right-4">
            <StatusBadge status={status} />
          </div>

          {/* Micro details — top left */}
          {status !== "loading" && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {responseTime != null && responseTime >= 0 && (
                <div className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                  <Gauge size={11} />
                  {responseTime}ms
                </div>
              )}
              {uptime && (
                <div className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                  <Clock size={11} />
                  {uptime} uptime
                </div>
              )}
            </div>
          )}

          {/* Bottom info overlay */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
            <div>
              <h3
                className="text-xl font-bold text-white md:text-2xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {app.name}
              </h3>
              <p className="mt-1 text-sm text-white/70">
                {app.url.replace(/^https?:\/\//, "")}
              </p>
            </div>
            <motion.div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,0.35)" }}
            >
              <ArrowUpRight size={18} className="text-white" />
            </motion.div>
          </div>
        </div>
      </motion.a>
    </AnimatePresence>
    </motion.div>
  );
}

/* ───────────────────── Tab Thumbnail ───────────────────── */

type TabThumbProps = {
  app: AppItem;
  status: AppStatus;
  isActive: boolean;
  onClick: () => void;
};

export function TabThumb({ app, status, isActive, onClick }: TabThumbProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 md:px-4 md:py-3"
      style={{
        background: isActive ? "var(--primary)" : "var(--card-bg)",
        borderColor: isActive ? "var(--primary)" : "var(--card-border)",
        color: isActive ? "#fff" : "var(--foreground)",
        boxShadow: isActive ? "0 4px 20px rgba(124,58,237,0.25)" : "none",
      }}
      data-clickable
    >
      {/* Tiny image */}
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg md:h-10 md:w-10">
        <Image
          src={app.image}
          alt={app.name}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{app.name}</p>
        <div className="flex items-center gap-1.5">
          <StatusDot status={status} small />
          <span
            className="text-xs"
            style={{ color: isActive ? "rgba(255,255,255,0.7)" : "var(--muted)" }}
          >
            {status === "loading" ? "Checking..." : status === "active" ? "Active" : "Offline"}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ───────────────────── Shared sub-components ───────────────────── */

function StatusBadge({ status }: { status: AppStatus }) {
  if (status === "loading") {
    return (
      <div
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md"
        style={{ background: "rgba(100,100,100,0.5)", color: "#e2e8f0" }}
      >
        <div className="h-2 w-2 animate-pulse rounded-full bg-gray-300" />
        Checking...
      </div>
    );
  }

  const isOnline = status === "active";

  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md"
      style={{
        background: isOnline ? "rgba(5,150,105,0.25)" : "rgba(220,38,38,0.25)",
        color: isOnline ? "#6ee7b7" : "#fca5a5",
      }}
    >
      <StatusDot status={status} />
      {isOnline ? "Active" : "Offline"}
    </div>
  );
}

function StatusDot({ status, small }: { status: AppStatus; small?: boolean }) {
  const size = small ? "h-1.5 w-1.5" : "h-2 w-2";

  if (status === "loading") {
    return <div className={`${size} animate-pulse rounded-full bg-gray-400`} />;
  }

  const isOnline = status === "active";

  return (
    <span className={`relative flex ${size}`}>
      {isOnline && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75`}
          style={{ background: "#34d399" }}
        />
      )}
      <span
        className={`relative inline-flex ${size} rounded-full`}
        style={{ background: isOnline ? "#34d399" : "#ef4444" }}
      />
    </span>
  );
}
