# BRD: Landing Maloka — Personal Engineering Portfolio OS

| Field | Nilai |
|---|---|
| Versi | 1.2 |
| Status | Draft — Checkpoint Review (MVP Scope Refined) |
| Tanggal | 2026-05-21 |
| Author | Claude Code Documentation Factory |
| Sponsor | Anissa Efuddin |
| Stakeholder | Engineer (author), Visitors (portfolio viewers) |


## 1. Ringkasan eksekutif

Landing Maloka akan bertransformasi menjadi **Personal Engineering Portfolio OS** — showcase yang comprehensive untuk seluruh portofolio engineering personal (web apps, mobile, backend, infrastructure, AI projects, IoT, automation). Portfolio showcase terstruktur, AI-friendly, dan storytelling-driven.

**Phase 1 MVP fokus**: Project registry + documentation viewer + portfolio narrative showcase. Dokumentasi ter-sync otomatis dari repository via GitHub webhook. Setiap project tell a story — challenges, lessons learned, innovations, AI involvement.

**Expected Impact:**
- 📊 Comprehensive engineering portfolio showcase yang impressive
- 📚 Unified documentation viewer (realtime sync dari repository)
- 🎓 Portfolio narrative yang storytelling (bukan sekadar list project)
- 🚀 AI-native workflow — dokumentasi terstruktur untuk AI analysis
- 💼 Living engineering CV yang updated realtime

**Investment & Timeline:** MVP Phase 1 (Project Registry + Portfolio + Docs Viewer) = **2 weeks lean**. Phase 2-3 incremental.

---

## 2. Latar belakang

### 2.1 Kondisi saat ini

- Landing Maloka masih static Next.js website (simple showcase)
- Dokumentasi project tersebar di berbagai repository (tidak ter-orchestrate)
- Portfolio terasa "cold" — no story, no personality
- 7+ projects existing tapi tidak terpusat/visible

### 2.2 Masalah & Opportunity

**Pain Points:**
- Portfolio tidak showcase actual project documentation
- No single source untuk lihat seluruh engineering work
- Portfolio terasa impersonal — no challenges/learnings/narrative
- Dokumentasi manual — tidak ter-sync otomatis

**Opportunity:**
- Transform ke **dynamic, storytelling portfolio**
- Centralize documentation viewer dengan realtime sync
- Add portfolio narrative: challenges, lessons learned, innovations
- Showcase AI-assisted development sebagai differentiator
- Scalable foundation: 7 → 20+ projects tanpa redesign

---

## 3. Tujuan bisnis (Phase 1 MVP only)

1. **Unified Project Registry & Portfolio Showcase**
   - Showcase 7+ projects dalam impressive grid/list
   - Metadata lengkap per project (type, lifecycle, stack, description)
   - Support lifecycle state: idea, building, active, archived, experimental
   - Target: 7/7 projects ter-index dan visible

2. **Real-time Documentation Viewer**
   - GitHub webhook integration: doc changes → auto-sync
   - Render docs (PRD, ARCHITECTURE, ROADMAP, API, TASK) dari repository source
   - Per-document visibility control (public/private)
   - Target: All docs sync dalam < 5s setelah push

3. **Portfolio Narrative & Storytelling**
   - Display project story: challenges, lessons learned, innovations
   - Track AI involvement: show which aspects used AI assistance
   - Artifact gallery: screenshots, demos, deployment links
   - Target: 100% projects dengan narrative fields filled

4. **Extensible Foundation**
   - Architecture support untuk 20+ projects tanpa redesign
   - Modular `project.config.yaml` standard
   - Data structure ready untuk Phase 2+ features

### Out of scope (NOT Phase 1)

**Explicitly NOT Phase 1:**
- ❌ Deployment monitoring & status badges (Phase 2)
- ❌ Uptime tracking (Phase 2)
- ❌ Grafana / Portainer integration (Phase 2)
- ❌ Alerting & notifications (Phase 2)
- ❌ Private monitoring dashboard (Phase 2)
- ❌ AI analytics & insights (Phase 3)

---

## 4. Stakeholder & dampak

### 4.1 Stakeholder map

| Stakeholder | Role | Concern utama |
|---|---|---|
| Anissa Efuddin | Platform owner / engineer | Portfolio quality, docs realtime, storytelling |
| Public visitors | Portfolio viewers | Portfolio credibility, documentation clarity |
| GitHub | Repository & webhook provider | Webhook reliability, API availability |

### 4.2 Dampak per stakeholder

| Stakeholder | Dampak positif | Risiko |
|---|---|---|
| Engineer | Central portfolio showcase; realtime docs sync; storytelling | Maintenance of metadata/narratives |
| Visitors | Impressive portfolio; clear docs; human storytelling; understand capability | None (read-only) |

---

## 5. Persyaratan bisnis tingkat tinggi

| ID | Persyaratan | Prioritas | Rasional |
|---|---|---|---|
| BR-1 | Archive web/mobile/backend/infra/AI/IoT/automation dalam satu portfolio registry | Must | Core objective: unified showcase |
| BR-2 | Setiap project punya metadata: nama, stack, type, lifecycle, description, docs links | Must | Enable comprehensive display |
| BR-3 | Documentation ter-sync realtime dari repository saat push event | Must | Docs always current |
| BR-4 | Per-document visibility control: public atau private | Should | Flexibility |
| BR-5 | Project lifecycle state visible: idea, building, active, archived, experimental | Should | Show engineering journey |
| BR-6 | Portfolio narrative: challenges, lessons learned, innovations untuk each project | Should | Storytelling; humanize showcase |
| BR-7 | AI involvement tracking: show which aspects used AI | Should | Showcase AI-native workflow |
| BR-8 | Artifact gallery: screenshots, demos, deployment links | Should | Visual showcase |
| BR-9 | Repository adalah source of truth; landing-maloka visualization layer only | Must | No duplication |
| BR-10 | Public portfolio tidak perlu authentication | Must | Visitor access |
| BR-11 | Page load time < 2s home / < 1.5s project detail | Should | Good UX |
| BR-12 | Portfolio mobile-responsive (360px-2560px) | Should | All devices |

---

## 6. Asumsi & dependensi

### Asumsi

- ✅ GitHub repositories dengan docs/ folder + `project.config.yaml` siap disetup
- ✅ MinIO object storage available untuk artifact storage
- ✅ GitHub webhook endpoint reachable dari internet
- ✅ Engineer willing maintain metadata & docs/narrative per project
- ✅ Visitor traffic volume rendah (home server scale)

### Dependensi

- 🔗 GitHub webhook stability (untuk realtime doc sync)
- 🔗 GitHub API availability (untuk fetch docs)
- 🔗 MinIO availability (untuk artifact access)

---

## 7. Constraint

- **Timeline**: MVP Phase 1 < 2 minggu
- **Team**: Solo engineer (low operational overhead)
- **Stack**: Leverage existing Next.js
- **Storage**: Home server capacity acceptable
- **Security**: Personal ecosystem; GitHub OAuth acceptable

---

## 8. Metrik success

| Metrik | Baseline | Target | Cara ukur | Timeline |
|---|---|---|---|---|
| Project registry completeness | 0/7 | 7/7 projects in registry | manual audit | Week 2 |
| Portfolio narrative completeness | 0% | 100% projects have narrative | file audit | Week 2 |
| AI involvement tracking | 0% | 100% projects tracked | metadata check | Week 2 |
| Documentation sync latency | N/A | < 5s after push | log analysis | Week 2 |
| Home page load time | N/A | < 2 seconds | browser tools | Week 2 |
| Mobile responsiveness | 0% | Works 360px-2560px | browser testing | Week 2 |
| Artifact gallery functional | 0% | Screenshots rendering | QA check | Week 2 |

---

## 9. Risiko & mitigasi

| ID | Risiko | Probabilitas | Dampak | Mitigasi | Owner |
|---|---|---|---|---|---|
| R-1 | Webhook failure → doc sync gagal | Sedang | Sedang | Retry logic + manual retry button; sync status badge | Engineer |
| R-2 | GitHub API rate limit exceeded | Rendah | Sedang | Backoff + cache docs locally; UI notification | Engineer |
| R-3 | Project metadata inconsistent across repos | Sedang | Sedang | project.config.yaml template + validation script | Engineer |
| R-4 | Markdown parsing error | Rendah | Rendah | Fallback to raw markdown + error logging | Engineer |
| R-5 | Visitor confused about private vs public docs | Rendah | Rendah | Clear visual indicators + legend | Engineer |
| R-6 | Engineering time to maintain metadata/narrative | Sedang | Sedang | Simple template; batch updates with docs | Engineer |

---

## 10. Pendekatan / fase implementasi

### Phase 1 — MVP: Portfolio OS (Weeks 1-2) — **FOCUS HERE**

**Scope**: Project Registry + Portfolio Showcase + Documentation Viewer + Narrative

**Deliverables:**
- ✅ Project registry UI (grid/list, filterable by type & lifecycle)
- ✅ Public portfolio showcase (impressive project cards)
- ✅ GitHub webhook integration for realtime doc sync
- ✅ Markdown documentation viewer (PRD, ARCHITECTURE, ROADMAP, API, TASK)
- ✅ Per-document visibility control (public/private)
- ✅ Project lifecycle state display & badges
- ✅ Project type display (WEB_APP, MOBILE_APP, etc)
- ✅ Portfolio narrative (challenges, lessons learned, innovations)
- ✅ AI involvement tracking & display
- ✅ Artifact gallery (screenshots, demos, deployment links)
- ✅ Mobile responsive design

**NOT Phase 1**: Monitoring, alerts, private dashboard, Grafana, uptime tracking

**Success criteria**: 7/7 projects in registry, docs realtime syncing, portfolio storytelling complete, mobile working

**Timeline**: 2 weeks lean development


### Phase 2 — Deployment Hub (Future, not MVP)

**Scope**: Deployment status, uptime monitoring, health checks

**Deliverables** (indicative):
- Simple deployment status badges (online/offline/degraded)
- Uptime tracker via Uptime Kuma
- Health check endpoint display

**NOT Phase 2**: Full Grafana integration, complex monitoring, alerts


### Phase 3 — Engineering Intelligence (Future, not MVP)

**Scope**: AI analytics, project insights, engineering timeline

**Deliverables** (indicative):
- Project activity timeline
- AI-generated insights
- Tech stack trends

---

## 11. Asumsi teknis untuk arsitek

- **Repository structure**: Setiap repo: `project.config.yaml` (root) + `docs/` folder
- **Metadata standard**: `project.config.yaml` define: name, type, lifecycle_state, stack, documentation, ai_assisted, artifacts, portfolio_narrative, lessons_learned, challenges, innovations
- **Artifact storage**: Screenshots/APK/demos di MinIO; referenced dari metadata atau markdown
- **Documentation**: Rendered on-demand dari repo source, not cached DB (avoid duplication)
- **Source of truth**: Repository primary; landing-maloka visualizes only

---

## 12. Open questions

- [ ] project.config.yaml vs project.config.json? — @engineer — target Week 1
- [ ] AI involvement score: manual input atau auto-detect? — @engineer — target Week 1
- [ ] Portfolio narrative fields: hardcoded atau flexible? — @engineer — target Week 1
- [ ] Archived/experimental projects: separate tab or mixed? — @engineer — target Week 1

---

## 13. Approval

| Role | Nama | Status |
|---|---|---|
| Sponsor | Anissa Efuddin | ⏳ Awaiting approval |
| Engineering Owner | Anissa Efuddin | ⏳ Awaiting approval |

---

## Document history

| Versi | Tanggal | Change |
|---|---|---|
| 1.0 | 2026-05-21 | Initial draft — full system |
| 1.1 | 2026-05-21 | Revision 1: Added project taxonomy, deployment taxonomy, metadata standard |
| 1.2 | 2026-05-21 | Revision 2: **MVP Scope Refined** — removed monitoring/alerting/Phase 2+ items, focused Phase 1 on portfolio + docs only |
