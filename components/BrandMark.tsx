"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Brand mark that swaps PNG variant based on the active theme.
 * Reads `data-theme` from <html> and watches for changes.
 * Defers rendering until mount to avoid SSR/CSR hydration mismatch
 * (the visible variant depends on client-only localStorage state).
 */
export default function BrandMark({ className = "h-16 w-16", priority = false, sizes = "128px" }: Props) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const src = theme === "light" ? "/IconSvg-lightmode.png" : "/IconSvg-darkmode.png";

  return (
    <span
      className={`relative inline-block ${className}`}
      role="img"
      aria-label="maloka.app"
      suppressHydrationWarning
    >
      {theme !== null && (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain"
        />
      )}
    </span>
  );
}
