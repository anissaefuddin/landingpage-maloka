# Landing Maloka — Personal Engineering Portfolio OS

An **AI-native engineering portfolio system** that aggregates all your projects, syncs documentation in real-time from GitHub, and showcases your engineering journey with structured narratives.

**Live**: [maloka.app](https://maloka.app)

---

## What is Landing Maloka?

A personal engineering registry. Every project has:

- ✅ **Project metadata** — name, type, lifecycle state, tech stack
- ✅ **Real-time documentation** — PRD, architecture, roadmap, API docs sync automatically from GitHub
- ✅ **Portfolio narrative** — challenges faced, lessons learned, innovations
- ✅ **AI involvement tracking** — show which aspects used AI assistance
- ✅ **Artifact gallery** — screenshots, demos, APK downloads
- ✅ **Mobile responsive** — works on all devices (360px – 2560px)

**Key principle**: Repository is the source of truth. Landing Maloka orchestrates & visualizes.

---

## 🎯 Quick Start

### Prerequisites

- Node.js 20 LTS
- Docker + Docker Compose
- PostgreSQL 16
- Redis 7

### Setup (5 minutes)

```bash
# 1. Clone repo
git clone https://github.com/ansae/landing-maloka.git
cd landing-maloka

# 2. Install dependencies
npm install

# 3. Start local stack (Docker)
docker-compose -f docker-compose.dev.yml up -d

# 4. Setup database
npm run migrate
npm run seed

# 5. Start app
npm run dev

# 6. Open browser
open http://localhost:3000
```

**Expected**: Home page loads with 7 project cards. Click a card to see details, docs, and gallery.

---

## 📁 Project Structure

```
landing-maloka/
├── app/
│   ├── page.tsx                 # Home / registry
│   ├── projects/[id]/page.tsx   # Project detail
│   ├── api/
│   │   ├── projects/route.ts    # List all projects
│   │   ├── projects/[id]/route.ts
│   │   ├── projects/[id]/docs/[type]/route.ts
│   │   ├── projects/[id]/artifacts/route.ts
│   │   └── webhook/route.ts     # GitHub webhook handler
│   └── components/
│       ├── ProjectCard.tsx
│       ├── DocumentationViewer.tsx
│       ├── PortfolioNarrative.tsx
│       └── ArtifactGallery.tsx
├── lib/
│   ├── db.ts                    # PostgreSQL queries
│   ├── github.ts                # GitHub API wrapper
│   ├── markdown.ts              # Markdown rendering
│   └── redis.ts                 # Cache layer
├── __tests__/
│   ├── api/                     # API route tests
│   ├── integration/             # DB + API tests
│   └── e2e/                     # Playwright E2E tests
├── docker-compose.dev.yml       # Local dev stack
├── docker-compose.prod.yml      # Production stack
├── Dockerfile                   # Next.js production image
├── nginx.prod.conf              # Reverse proxy config
└── README.md                    # This file
```

---

## 🔧 Development

### Available commands

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting & formatting
npm run lint
npm run format

# Testing
npm test                        # Unit + integration tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report
npm run test:e2e               # Playwright E2E tests

# Database
npm run migrate                 # Run migrations
npm run seed                    # Seed test data
npm run db:check               # Connection health check

# Deployment
npm run deploy:dev             # Deploy to dev
npm run deploy:prod            # Deploy to production (requires SSH key)
```

### Environment variables (development)

Create `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://landing_maloka_app:password@localhost:5432/landing_maloka_dev

# Redis
REDIS_URL=redis://localhost:6379

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
```

### Making changes

**Frontend (pages/components):**
1. Edit `.tsx` files in `app/` or `components/`
2. Next.js auto-reloads
3. Browser reflects changes instantly

**API routes:**
1. Edit `app/api/**/*.ts` files
2. Next.js rebuilds API routes
3. Test with `curl http://localhost:3000/api/projects`

**Database:**
1. Edit schema in `lib/db.ts` or migration files
2. Run `npm run migrate`
3. Seed if needed: `npm run seed`

**Webhook handler:**
1. Edit `app/api/webhook/route.ts`
2. Test with mock GitHub webhook:
   ```bash
   npm run test -- webhook.test.ts
   ```
3. Or trigger real webhook by pushing to a project repo

---

## 📖 Documentation

Complete documentation in project root:

- **[02-FRD](02-FRD-landing-maloka-ecosystem-v2.0.md)** — Functional requirements (user stories)
- **[03-TechSpec](03-TechSpec-landing-maloka-ecosystem-v3.0.md)** — Technical architecture
- **[04-DB](04-DB-landing-maloka-ecosystem.md)** — Database schema & design
- **[05-API](05-API-landing-maloka-ecosystem.md)** — API specification
- **[06-Security](06-Security-landing-maloka-ecosystem.md)** — Security model & best practices
- **[07-Test](07-Test-landing-maloka-ecosystem.md)** — Testing strategy & scenarios
- **[08-Deploy](08-Deploy-landing-maloka-ecosystem.md)** — Deployment guide & CI/CD

---

## 🔐 Security

Landing Maloka is **public portfolio** (no authentication required for MVP). Security focuses on:

- ✅ **Webhook validation** — HMAC-SHA256 signature on all GitHub webhooks
- ✅ **Markdown safety** — XSS prevention via `react-markdown` sanitization
- ✅ **SQL injection prevention** — Parameterized queries (ORM)
- ✅ **HTTPS only** — Behind Nginx reverse proxy with TLS
- ✅ **Secrets management** — All credentials in `.env` (git-ignored)
- ✅ **Per-document visibility** — Hide private docs from visitors

See [06-Security](06-Security-landing-maloka-ecosystem.md) for details.

---

## 🚢 Deployment

### Development → Localhost

```bash
docker-compose -f docker-compose.dev.yml up -d
npm run dev
# App: http://localhost:3000
```

### Production → Home Server

See [08-Deploy](08-Deploy-landing-maloka-ecosystem.md) for full guide.

**Quick deploy:**
```bash
git push origin main
# GitHub Actions automatically deploys to production
```

**Manual deploy:**
```bash
ssh user@home-server
cd /opt/landing-maloka && git pull origin main
docker-compose -f docker-compose.prod.yml build && docker-compose -f docker-compose.prod.yml up -d
curl https://maloka.app/health
```

---

## 🧪 Testing

### Run all tests

```bash
npm test
```

### Test specific file

```bash
npm test -- api/projects.test.ts
npm test -- --watch
```

### E2E tests (Playwright)

```bash
npm run test:e2e
```

### Coverage report

```bash
npm test -- --coverage
# Open coverage/lcov-report/index.html
```

See [07-Test](07-Test-landing-maloka-ecosystem.md) for test scenarios.

---

## 🌍 GitHub Webhook Setup

Landing Maloka uses GitHub webhooks to sync documentation automatically.

### Configure webhook for your project repo

1. Go to **GitHub repo** → Settings → Webhooks → Add webhook
2. **Payload URL**: `https://maloka.app/api/webhook`
3. **Content type**: `application/json`
4. **Secret**: Use `GITHUB_WEBHOOK_SECRET` from `.env`
5. **Events**: Select `push` events
6. **Active**: ✅ enabled

### Test webhook

```bash
# Push a change to docs in your project repo
git add docs/PRD.md
git commit -m "Update PRD"
git push origin main

# Check landing-maloka for updated docs (< 5 seconds)
curl https://maloka.app/api/projects/{project-id}/docs/prd
```

---

## 📦 Project Metadata Standard

Each project repo needs:

### 1. `project.config.yaml` (metadata only)

```yaml
name: "RIMS"
type: "WEB_APP"
lifecycle_state: "active"
short_description: "Inventory management system"
github_repo_url: "https://github.com/ansae/rims"
deployment_url: "https://rims.maloka.dev"

stack:
  backend: [Laravel, PostgreSQL]
  frontend: [Vue, Tailwind]
  infrastructure: [Docker, Nginx]

documentation:
  prd:
    path: "docs/PRD.md"
    visibility: "PUBLIC"
  architecture:
    path: "docs/ARCHITECTURE.md"
    visibility: "PUBLIC"
  roadmap:
    path: "docs/ROADMAP.md"
    visibility: "PRIVATE"

ai_assisted: [architecture, documentation, testing]
```

### 2. `PORTFOLIO.md` (storytelling & narrative)

```markdown
# RIMS — Project Story

RIMS was built to solve real-time inventory tracking across multiple warehouses.
The challenge: keep stock synchronized across 15 locations without complex infrastructure.

## Challenges

- Multi-warehouse real-time sync consistency
- Mobile app offline-first architecture
- Legacy mainframe integration (20-year-old system)

## Lessons Learned

- PostgreSQL JSONB enables flexible schema evolution
- Vue Composition API > Options API for large projects
- Real-time sync requires eventual consistency acceptance

## Innovations

- Custom webhook-based sync architecture (instead of polling)
- Containerized functions for serverless migration path
- Blue-Green deployment for zero-downtime updates
```

**Why split?** 
- YAML is for metadata (readable by machines and config parsers)
- Markdown is for narrative (natural medium for storytelling & AI-generation)
- Easier to maintain, version, and edit

See [BRD](01-BRD-landing-maloka-ecosystem-v1.2.md) for full spec.

---

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
lsof -i :3000
kill -9 <PID>
```

### Database connection error

```bash
# Check PostgreSQL running
docker-compose -f docker-compose.dev.yml ps postgres

# Check credentials in .env.local
echo $DATABASE_URL

# Restart PostgreSQL
docker-compose -f docker-compose.dev.yml restart postgres
```

### Redis connection error

```bash
# Check Redis running
docker-compose -f docker-compose.dev.yml ps redis

# Flush cache (clears all)
redis-cli FLUSHALL

# Restart Redis
docker-compose -f docker-compose.dev.yml restart redis
```

### Webhook not syncing

1. Check GitHub webhook delivery: **Repo** → Settings → Webhooks → Recent Deliveries
2. Verify secret matches `GITHUB_WEBHOOK_SECRET`
3. Check logs: `docker-compose logs app | grep webhook`
4. Test manually: `npm run test -- webhook.test.ts`

### Tests failing

```bash
# Clear cache
npm run jest -- --clearCache

# Run with verbose output
npm test -- --verbose

# Run single test
npm test -- projects.test.ts --testNamePattern="returns all projects"
```

---

## 🤝 Contributing

Landing Maloka is a personal portfolio OS. Contributions welcome!

1. Fork repo
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open pull request

**Guidelines:**
- Follow existing code style (run `npm run lint`)
- Add tests for new features
- Update documentation
- Ensure all tests pass before PR

---

## 📝 License

MIT. See LICENSE file.

---

## 🎓 Stack & dependencies

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- react-markdown (safe rendering)
- react-syntax-highlighter (code blocks)

**Backend:**
- Node.js 20
- Next.js API routes
- PostgreSQL 16
- Redis 7
- Axios (HTTP client)

**Testing:**
- Jest
- React Testing Library
- Supertest
- Playwright

**DevOps:**
- Docker
- Docker Compose
- Nginx
- GitHub Actions

---

## 📞 Support

Questions? Issues?

- Check [documentation](/)
- Review [GitHub issues](https://github.com/ansae/landing-maloka/issues)
- Email: [anissaefuddin@gmail.com](mailto:anissaefuddin@gmail.com)

---

## 🚀 Roadmap

**Phase 1 (MVP — in progress):**
- ✅ Project registry & discovery
- ✅ Real-time documentation viewer
- ✅ Portfolio narrative & storytelling
- ✅ AI involvement tracking
- ✅ Artifact gallery

**Phase 2 (Planned):**
- 🔜 Deployment status badges
- 🔜 Uptime monitoring
- 🔜 Private dashboard
- 🔜 Search optimization

**Phase 3+ (Future):**
- 🔜 AI analytics & insights
- 🔜 Engineering timeline
- 🔜 Collaboration features

---

## Made with 🤖 Claude

This project was designed & implemented with AI assistance via [Claude Code](https://claude.com/claude-code). Documentation generated by AI Documentation Factory.

---

**Last updated**: 2026-05-21 | **Version**: 1.0-MVP
