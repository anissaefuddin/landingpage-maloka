# maloka.app

A playful, interactive landing page for **maloka.app** — a digital playground showcasing live lab experiments and systems.

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Language** — TypeScript
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com)
- **Animations** — [Framer Motion](https://www.framer.com/motion/)
- **Icons** — [Lucide React](https://lucide.dev)
- **Fonts** — Poppins, Space Grotesk (via `next/font`)

## Project Structure

```
app/
├── api/status/route.ts   # Server-side URL health checker
├── globals.css            # Theme variables, animations, utilities
├── layout.tsx             # Root layout with fonts & metadata
└── page.tsx               # Landing page (assembles sections)

components/
├── AppCard.tsx            # FeaturedCard & TabThumb components
├── CTA.tsx                # Call-to-action section
├── Cursor.tsx             # Custom cursor effect
├── HeroPlayground.tsx     # Hero section with animated playground
├── LabActivity.tsx        # Live lab status with tabbed cards
├── SocialProof.tsx        # Social proof section
└── ThemeToggle.tsx        # Dark/light theme switcher

public/images/             # Placeholder SVG app icons
```

## Features

- **Lab Activity** — Tabbed cards layout with auto-advancing featured card, vertical scrollable tab list, and live status badges fetched via server-side API route
- **Theme Toggle** — Light/dark mode with smooth transitions
- **Custom Cursor** — Playful cursor effect that responds to interactive elements
- **Responsive** — Adaptive layouts for desktop, tablet, and mobile
- **Animations** — Spring physics, staggered reveals, hover effects via Framer Motion

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/status?url=<url>` | GET | Checks if a URL is reachable via HEAD request. Returns `{ status: "active" }` or `{ status: "inactive" }`. |

## License

Private project.
