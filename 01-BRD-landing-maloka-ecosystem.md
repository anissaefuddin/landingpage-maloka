# BRD: Landing Maloka — AI-Native Personal Engineering Ecosystem Registry

| Field | Nilai |
|---|---|
| Versi | 1.2 |
| Status | Draft — Checkpoint Review (MVP Scope Refined) |
| Tanggal | 2026-05-21 |
| Author | Claude Code Documentation Factory |
| Sponsor | Anissa Efuddin |
| Stakeholder | Engineer (author), Visitors (portfolio viewers), Home server infrastructure team |


## 1. Ringkasan eksekutif

Landing Maloka akan bertransformasi dari static website menjadi **Personal Engineering Portfolio OS** — showcase yang comprehensive untuk seluruh portofolio engineering personal: aplikasi web, mobile, backend systems, infrastructure, AI projects, IoT systems, dan automation workflows. Portfolio harus terstruktur, AI-friendly, dan storytelling-driven.

**Phase 1 MVP fokus**: Real-time project registry + documentation viewer + portfolio narrative showcase. Dokumentasi ter-sync otomatis dari repository via GitHub webhook. Setiap project tell a story — challenges, lessons learned, innovations, dan AI involvement.

**Expected Impact:**
- 📊 Comprehensive engineering portfolio showcase yang impressive
- 📚 Unified documentation viewer (pull docs langsung dari repository)
- 🎓 Portfolio narrative yang storytelling (bukan sekadar list project)
- 🚀 AI-native workflow — dokumentasi terstruktur untuk AI analysis
- 💼 Living engineering CV yang updated realtime

**Investment & Timeline:** MVP Phase 1 (Project Registry + Portfolio Showcase + Docs Viewer) = ~2 minggu development lean. Phase 2-3 incremental dengan monitoring & analytics.


## 2. Latar belakang

### 2.1 Kondisi saat ini

Saat ini:
- 7+ aplikasi dan services aktif di home server (RIMS, landing-istimewa, lasem-tourism, MinIO, Portainer, Nextcloud, Grafana)
- Landing Maloka masih berupa static Next.js website (showcase sederhana saja)
- Dokumentasi project tersebar di berbagai repository (tidak ter-orchestrate)
- Monitoring tools ada (Grafana, Portainer) tapi tidak integrated ke portfolio showcase
- Deployment info tidak realtime visible di landing page
- AI-assisted documentation workflow ada (Claude Skills) tapi output tidak ter-center


### 2.2 Masalah & Opportunity

**Pain Points:**
- Portfolio tidak showcase actual project documentation (docs scattered di berbagai repo)
- Visitor tidak punya single source untuk lihat seluruh engineering work secara structured
- Portfolio terasa "cold" — no story, no personality, just list of projects
- Dokumentasi manual — tidak ter-sync otomatis saat push ke repository
- No context tentang challenges, lessons, atau AI involvement dalam project

**Opportunity:**
- Transform landing page menjadi **dynamic, storytelling portfolio** yang showcase engineering journey
- Centralize documentation viewer dengan realtime sync dari repository — single source untuk semua docs
- Add portfolio narrative: challenges faced, lessons learned, innovations — jadi portfolio terasa lebih human
- AI-native workflow: structured docs yang cocok untuk AI analysis, showcasing AI-assisted development
- Scalable foundation: sekarang registry 7 project, nanti expand ke 20+ tanpa architectural change


### 2.3 Drivers

**Internal drivers:**
- Keinginan untuk showcase engineering capability lebih structured & realtime
- Need untuk centralize knowledge management & documentation
- Desire untuk accelerate AI-assisted engineering workflow dengan standardized docs

**External drivers:**
- Portfolio visibility semakin penting untuk professional branding & opportunity
- Interest dalam personal AI OS / digital garden concept
- Home server ecosystem sudah mature — time to orchestrate + visualize


## 3. Tujuan bisnis (business objectives)

### Tujuan utama (Phase 1 MVP only)

1. **Unified Project Registry & Portfolio Showcase**
   - Showcase 7+ projects dalam grid/list yang impressive
   - Setiap project terdokumentasi dengan metadata lengkap per `project.config.yaml` standard
   - Support project taxonomy: 8 types (untuk filtering & visual differentiation)
   - Support lifecycle state display: idea, building, active, archived, experimental
   - Target: 7/7 projects ter-index dan visible dalam portfolio
   - Timeline: Week 1-2

2. **Real-time Documentation Viewer**
   - GitHub webhook integration: doc changes → auto-sync ke landing-maloka
   - Render documentation (PRD, ARCHITECTURE, ROADMAP, API, TASK) langsung dari repository source
   - Support per-document visibility control (public/private)
   - No manual copy-paste — docs always current
   - Target: All projects' docs ter-sync dalam < 5s setelah push
   - Timeline: Week 1-2

3. **Portfolio Narrative & Storytelling**
   - Display project story: challenges, lessons learned, innovations
   - Track AI involvement: show which aspects of project used AI assistance
   - Artifact gallery: screenshots, demos, deployment links
   - Transform portfolio dari "cold technical archive" menjadi "human engineering journey"
   - Target: 100% projects dengan narrative fields filled
   - Timeline: Week 2

4. **Extensible Foundation**
   - Architecture support untuk 20+ projects tanpa redesign
   - Modular `project.config.yaml` standard untuk consistency
   - Data structure ready untuk Phase 2 monitoring & Phase 3 analytics
   - Target: Infrastructure ready untuk scaling
   - Timeline: Built-in design, tidak extra effort


### Out of scope (NOT in Phase 1 MVP)

**Explicitly NOT Phase 1:**
- ❌ Deployment monitoring & status badges (Phase 2)
- ❌ Uptime tracking & health checks (Phase 2)
- ❌ Grafana / Portainer integration (Phase 2)
- ❌ CI/CD status display (Phase 2)
- ❌ Alerting & notifications (Phase 2)
- ❌ Private monitoring dashboard (Phase 2)
- ❌ AI analytics & insights (Phase 3)
- ❌ Project timeline analytics (Phase 3)
- ❌ Auto-generated summaries (Phase 3)

**Generally out of scope:**
- ❌ Enterprise project management tool (no task assignment, team collaboration)
- ❌ Multi-user RBAC system (owner only)
- ❌ Real-time WebSocket (polling OK)
- ❌ Multi-tenant support (personal ecosystem)


## 4. Stakeholder & dampak

### 4.1 Stakeholder map

| Stakeholder | Role | Tingkat keterlibatan | Concern utama |
|---|---|---|---|
| Anissa Efuddin | Platform owner / engineer | Daily: manage projects, update docs, write narratives | Portfolio quality, docs realtime, storytelling effectiveness |
| Public visitors | Portfolio viewers | Read-only browse | Quality of portfolio, project credibility, documentation clarity |
| GitHub | Repository & webhook provider | Event-driven | Webhook reliability, API availability |


### 4.2 Dampak per stakeholder

| Stakeholder | Dampak positif | Risiko / kekhawatiran |
|---|---|---|
| Engineer (Anissa) | Central portfolio showcase; realtime docs sync; storytelling about engineering journey; showcase AI involvement | Maintenance of metadata/narratives per project |
| Visitors | Impressive portfolio; clear project documentation; human storytelling; understanding of engineering capability | None (read-only) |


## 5. Persyaratan bisnis tingkat tinggi

### 5.1 Core requirements

| ID | Persyaratan | Prioritas | Rasional |
|---|---|---|---|
| BR-1 | Sistem harus archive web apps, mobile apps, backend, infra, AI projects, IoT systems, automation workflows dalam satu portfolio registry | Must | Core objective: unified portfolio showcase |
| BR-2 | Setiap project harus punya metadata lengkap: nama, stack, type, lifecycle state, description, GitHub repo, docs links | Must | Enable comprehensive portfolio display |
| BR-3 | Documentation ter-sync realtime dari repository saat push event terjadi | Must | Docs always current; support AI-native workflow |
| BR-4 | Per-document visibility control: public atau private | Should | Flexibility; default public untuk portfolio |
| BR-5 | Project lifecycle state harus visible: idea, building, active, archived, experimental | Should | Show engineering journey |
| BR-6 | Portfolio narrative display: challenges, lessons learned, innovations untuk each project | Should | Transform portfolio menjadi storytelling; humanize showcase |
| BR-7 | AI involvement tracking: show which aspects used AI (documentation, architecture, testing, etc) | Should | Showcase AI-native workflow as differentiator |
| BR-8 | Artifact gallery untuk screenshots, demos, deployment links | Should | Visual showcase capabilities |
| BR-9 | Repository adalah source of truth; landing-maloka hanya visualization layer | Must | Maintain decentralized docs; no duplication |
| BR-10 | Public portfolio area tidak perlu authentication | Must | Visitor access; branding visibility |
| BR-11 | Page load time < 2s untuk home / < 1.5s untuk project detail | Should | Good UX; home server acceptable performance |
| BR-12 | Portfolio harus responsive (mobile-friendly) | Should | Visitors dapat browse dari device apapun |

### 5.2 Project taxonomy & data structure

**Project Type** (required for filtering, search, grouping, analytics):

| Type | Contoh | Rendering | Monitoring |
|---|---|---|---|
| WEB_APP | RIMS, landing-istimewa, lasem-tourism | Live URL badge, uptime metrics | HTTP uptime, deployment logs |
| MOBILE_APP | TBD | APK/Play Store link, version badge | App store availability |
| API_SERVICE | Backend services | API endpoint badge, status endpoint | HTTP health check |
| IOT_SYSTEM | IoT sensors, ESP32 systems | Device status, last sync time | Device connectivity, data stream |
| AI_TOOL | Claude-assisted workflows, ML experiments | Model version, input/output samples | Inference latency, token usage |
| AUTOMATION | Scripts, cron jobs, GitHub Actions workflows | Execution status, last run time | Success rate, execution logs |
| INTERNAL_TOOL | Dashboards, admin utilities | Access restricted badge, auth type | Availability, performance |
| EXPERIMENTAL | POC, prototype, learning project | Prototype badge, WIP indicator | Optional monitoring |

**Deployment Type** (required for deployment logic, monitoring, UI rendering):

| Deployment Type | Environment | Health Check | Artifacts |
|---|---|---|---|
| STATIC | Static web hosting (Vercel, GitHub Pages) | HTTP GET / | Built assets in repo |
| DOCKER | Docker container on home server | Container health, port check | Docker image, logs |
| APK | Mobile app local/sideload | App version, installed status | APK binary in MinIO |
| PLAYSTORE | Google Play Store | Release version, app store status | Published app build |
| APPSTORE | Apple App Store | Release version, app store status | Published app build |
| EDGE_DEVICE | IoT/edge device (ESP32, Raspberry Pi) | Device alive check, last heartbeat | Firmware binary, logs |
| LOCAL_RUNTIME | Local development/testing | Process status, port binding | Local build artifacts |

**Project Metadata Standard** — setiap repo harus punya `project.config.yaml` atau `project.config.json` di root:

```yaml
# project.config.yaml
name: "RIMS"
type: "WEB_APP"
status: "ACTIVE"
lifecycle_state: "ACTIVE"  # idea | building | active | archived | experimental
short_description: "Real-time Inventory Management System"
repository: "https://github.com/..."
homepage: "https://rims.maloka.app"

# Technical metadata
stack:
  backend: ["Laravel", "MySQL"]
  frontend: ["Vue.js", "Tailwind CSS"]
  infrastructure: ["Docker", "Nginx"]

# Deployment
deployment:
  type: "DOCKER"
  url: "https://rims.maloka.app"
  container_name: "rims-app"
  health_check: "https://rims.maloka.app/health"

# Documentation
documentation:
  prd:
    path: "docs/PRD.md"
    visibility: "PUBLIC"
  architecture:
    path: "docs/ARCHITECTURE.md"
    visibility: "PUBLIC"
  roadmap:
    path: "docs/ROADMAP.md"
    visibility: "PUBLIC"
  api:
    path: "docs/API.md"
    visibility: "PUBLIC"

# AI involvement
ai_assisted:
  - "documentation"
  - "architecture"
  - "testing"
  - "refactoring"
  - "deployment"
ai_involvement_score: 70  # percentage 0-100

# Artifacts
artifacts:
  screenshots: "docs/screenshots/"
  demos: "docs/demos/"
  releases: "releases/"
  builds: "builds/"

# Tags & portfolio narrative
tags:
  - "production"
  - "e-commerce"
  - "inventory"
portfolio_narrative: "First major production system built with AI-assisted architecture & testing"
lessons_learned:
  - "Containerization essential for multi-environment deployment"
  - "AI-generated tests caught edge cases manual tests missed"
challenges:
  - "Initial deployment complexity; solved with Docker orchestration"
innovations:
  - "AI-assisted database schema design"
  - "Automated deployment via GitHub Actions"
```

| BR-ID | Persyaratan tambahan | Prioritas | Rasional |
|---|---|---|---|
| BR-14 | Setiap project repository harus punya `project.config.yaml` mendefinisikan type, deployment type, AI involvement, metadata | Must | Enable automated indexing, filtering, analytics, dashboard rendering |
| BR-15 | Artifact storage centralized di MinIO untuk: screenshots, APK, demo assets, build outputs, release binaries | Should | Scalable storage; single point for artifact management |
| BR-16 | Portfolio harus display project narrative: lessons learned, challenges, AI involvement, innovation highlights | Should | Transform portfolio dari technical archive menjadi storytelling engineering journey |
| BR-17 | Setiap project harus track AI involvement: documentation, architecture, testing, refactoring, deployment; optional AI involvement score (0-100%) | Should | Showcase AI-native workflow; differentiation for portfolio |


## 6. Asumsi & dependensi

### Asumsi

- ✅ GitHub repositories dengan docs/ folder structure + `project.config.yaml` metadata siap disetup
- ✅ MinIO object storage available untuk artifact storage
- ✅ GitHub webhook endpoint reachable dari internet
- ✅ GitHub Actions CI/CD workflow available (untuk deployment links, not monitoring)
- ✅ Engineer willing maintain metadata & docs/narrative per project
- ✅ Visitor traffic volume rendah (home server scale)


### Dependensi

- 🔗 GitHub webhook stability (untuk realtime doc sync)
- 🔗 GitHub API availability (untuk fetch docs)
- 🔗 MinIO availability (untuk artifact access)


## 7. Constraint

- **Architecture**: Must align dengan existing Next.js + home server stack; no new external dependencies jika bisa
- **Timeline**: MVP Phase 1 harus selesai < 1 bulan untuk momentum; no multi-quarter phasing
- **Resource**: Personal project = limited time availability; design untuk low maintenance
- **Storage**: Home server limited (~500GB available after services); 30-day log retention acceptable
- **Performance**: Accept 3-5s load time untuk heavy widgets (not SLA production system)
- **Scaling**: Support 20+ project archive tanpa redesign (but not enterprise scale)
- **Security**: OAuth GitHub acceptable untuk auth (no elaborate RBAC needed)
- **Compliance**: No compliance requirement (personal ecosystem); standard security practices OK


## 8. Metrik success

| Metrik | Baseline | Target | Cara ukur | Periode |
|---|---|---|---|---|
| Project registry completeness | 0/7 | 7/7 projects in registry with metadata | manual audit | Week 2 |
| Project taxonomy classification | N/A | 100% projects classified by type | metadata validation | Week 1 |
| Portfolio narrative completeness | 0% | 100% projects have challenges + lessons + innovations | file audit | Week 2 |
| AI involvement tracking | 0% | 100% projects have ai_assisted array + score | metadata validation | Week 2 |
| Documentation sync latency | N/A | < 5s after push to repo | log analysis | Week 2 |
| Home page load time | N/A | < 2 seconds | browser tools | Week 2 |
| Project detail page load | N/A | < 1.5 seconds | browser tools | Week 2 |
| Portfolio public visibility | N/A | All 7 projects + public docs + narrative visible | QA check | Week 2 |
| Artifact gallery functional | 0% | Screenshots, demos, deployment links rendering | QA check | Week 2 |
| Mobile responsiveness | 0% | Portfolio works on 360px-2560px width | browser testing | Week 2 |


## 9. Risiko & mitigasi

| ID | Risiko | Probabilitas | Dampak | Mitigasi | Owner |
|---|---|---|---|---|---|
| R-1 | Webhook failure → doc sync gagal → portfolio outdated | Sedang | Sedang | Retry logic + manual retry button; sync status badge shows out-of-sync state | Engineer |
| R-2 | GitHub API rate limit exceeded | Rendah | Sedang | Implement backoff; cache docs locally; engineer notified in UI | Engineer |
| R-3 | Project metadata inconsistent across repositories | Sedang | Sedang | Define project.config.yaml template; validation script | Engineer |
| R-4 | Markdown parsing error (malformed file) | Rendah | Rendah | Fallback to raw markdown display; error logged | Engineer |
| R-5 | Visitor confused about private vs public docs | Rendah | Rendah | Clear visual indicators (lock icon, label); legend in UI | Engineer |
| R-6 | Engineering time to maintain metadata/narrative per project | Sedang | Sedang | Simple template structure; can be updated in batch with docs | Engineer |


## 10. Pendekatan / fase implementasi

### Phase 1 — MVP: Core Foundation (Weeks 1-2)

**Scope**: Project Registry + Public Portfolio + GitHub Integration + Documentation Viewer

**Deliverables:**
- Project registry UI (card-based listing)
- Public portfolio showcase (project cards, stack, metadata, screenshots)
- GitHub webhook integration + doc sync realtime
- Markdown documentation viewer (render PRD, ARCHITECTURE, ROADMAP from repo)
- Per-document visibility control (public/private)
- Project lifecycle state display (idea/building/active/archived/experimental)

**Success**: 7 projects documented, docs sync working, public portfolio live


### Phase 2 — Monitoring & Observability (Weeks 3-4)

**Scope**: Deployment Monitoring + Uptime + CI/CD Status + Alerts

**Deliverables:**
- Private dashboard (GitHub OAuth protected)
- Integration: Portainer (container status), Grafana (metrics), Uptime Kuma (uptime), GitHub Actions (CI/CD)
- Monitoring widgets (status badges, uptime charts, deployment logs)
- Alert system (Discord/Telegram webhook)
- Performance optimization (caching, lazy loading)

**Success**: Monitoring dashboard production-ready, alerts working


### Phase 3 — AI Analytics & Portfolio Intelligence (Future)

**Scope**: AI-assisted insights, project analytics, portfolio auto-generation

**Deliverables:**
- Project activity timeline (commit, deployment, doc updates)
- AI-generated project summaries
- Engineering insights (stack trends, project velocity)
- Auto-generated portfolio sections
- Advanced search & filtering

**Success**: Insights dashboard providing actionable engineering analytics


## 11. Asumsi teknis untuk arsitek

Beberapa asumsi teknis untuk fase planning selanjutnya:

- **Repository structure**: Setiap repo punya `project.config.yaml` (root) + `docs/` folder dengan markdown files
- **Metadata standard**: `project.config.yaml` mendefinisikan: name, type (dari taxonomy), deployment_type, status, lifecycle_state, stack, deployment, documentation, ai_assisted, artifacts, tags, portfolio_narrative, lessons_learned, challenges, innovations, ai_involvement_score
- **Taxonomy**: Project types (8) dan deployment types (7) defined di BRD section 5.2, rigid untuk consistency
- **Artifact storage**: Screenshots, APK, demos, builds stored di MinIO; referenced dari `project.config.yaml` atau markdown inline
- **Webhook source**: GitHub push → GitHub Actions → webhook call → landing-maloka fetch latest `project.config.yaml` & docs
- **Monitoring data**: Polling interval 30s-5m per deployment type, cached untuk performance
- **Documentation storage**: Docs rendered on-demand dari repo, not cached DB (avoid duplication)
- **Source of truth principle**: Repository remains primary source; landing-maloka orchestrates + visualizes only


## 12. Open questions

- [ ] project.config.yaml vs project.config.json — prefer YAML or JSON? — @engineer — target Week 1
- [ ] AI involvement score calculation: manual input atau auto-detect dari commit history? — @engineer — target Week 2
- [ ] Portfolio narrative fields: hardcoded set (lessons_learned, challenges, innovations) atau flexible custom fields? — @engineer — target Week 1
- [ ] Exact GitHub OAuth implementation strategy (callback URL, token storage, refresh)? — @engineer — target Week 1
- [ ] Monitoring alert threshold: hard-coded atau configurable per project? — @engineer — target Phase 2 Week 1
- [ ] Support for archived/experimental projects: separate tab or mixed with active? — @engineer — target Phase 1 Week 1
- [ ] Screenshots & artifact upload: direct MinIO upload UI atau via repository push? — @engineer — target Phase 1 Week 2


## 13. Approval

| Role | Nama | Status |
|---|---|---|
| Sponsor | Anissa Efuddin | ⏳ Awaiting approval |
| Engineering Owner | Anissa Efuddin | ⏳ Awaiting approval |

---

## Document history

| Versi | Tanggal | Change |
|---|---|---|
| 1.0 | 2026-05-21 | Initial draft — AI Documentation Factory |
| 1.1 | 2026-05-21 | Revision 1: Added project taxonomy (8 types), deployment taxonomy (7 types), metadata standard (project.config.yaml), artifact storage strategy (MinIO), portfolio narrative, AI involvement tracking |

