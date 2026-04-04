import type { AppItem } from "@/components/AppCard";

export const apps: AppItem[] = [
  {
    name: "Catat Apps",
    image: "/images/catat-apps.png",
    url: "https://script.google.com/macros/s/AKfycbzK5HXE93yl25uV8DwV-y93xhN5jYkoToS-JnWGfAhsrCgRN8J-aJQA7cuTbp7EO8Sq/exec",
    type: "mobile",
    description: "A mobile application for tracking and managing transactions home stays.",
  },
];

export const APP_COUNT = apps.length;
