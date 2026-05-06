import type { AppItem } from "@/components/AppCard";

export const apps: AppItem[] = [
  {
    name: "Catat Apps",
    image: "/images/catat-apps.png",
    url: "https://script.google.com/macros/s/AKfycbzK5HXE93yl25uV8DwV-y93xhN5jYkoToS-JnWGfAhsrCgRN8J-aJQA7cuTbp7EO8Sq/exec",
    type: "mobile",
    description: "A mobile application for tracking and managing transactions home stays.",
  },
  {
    name: "AI agent with WhatsApp chat bot",
    image: "/images/openclaw-agent.png",
    url: "https://script.google.com/macros/s/AKfycbzK5HXE93yl25uV8DwV-y93xhN5jYkoToS-JnWGfAhsrCgRN8J-aJQA7cuTbp7EO8Sq/exec",
    type: "internal",
    description: "A WhatsApp chat bot to assist users in finding information about Maloka and its services.",
  },
  {
    name: "Fuelshift Apps",
    image: "/images/fuelshift-apps.png",
    url: "https://script.google.com/macros/s/AKfycbxDwByHkyBB2Cw5H686T1Bmrcj3_Jj5jCRAAwSg8r0DQS568tys88wt3fPRfeQAoTlt/exec",
    type: "mobile",
    description: "A mobile application for tracking and managing shift POM.",
  },
];

export const APP_COUNT = apps.length;
