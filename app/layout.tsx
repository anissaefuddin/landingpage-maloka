import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "maloka.app — Multi Application Lab of Knowledge",
  description:
    "A playful digital lab to build, experiment, and scale real systems. From concept to production — modern, modular, and always innovating.",
  keywords: [
    "maloka",
    "digital lab",
    "web development",
    "application development",
    "knowledge platform",
    "software engineering",
  ],
  authors: [{ name: "maloka.app" }],
  openGraph: {
    title: "maloka.app — Multi Application Lab of Knowledge",
    description:
      "A playful digital lab to build, experiment, and scale real systems.",
    url: "https://maloka.app",
    siteName: "maloka.app",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "maloka.app — Multi Application Lab of Knowledge",
    description:
      "A playful digital lab to build, experiment, and scale real systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${poppins.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ScrollProgress />
        <Cursor />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
