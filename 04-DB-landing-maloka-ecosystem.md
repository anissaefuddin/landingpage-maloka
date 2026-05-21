# Database Schema: Landing Maloka — Personal Engineering Portfolio OS

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Status | Implementation Draft |
| Tanggal | 2026-05-21 |
| Author | Claude Code Documentation Factory |
| Linked TechSpec | 03-TechSpec-landing-maloka-ecosystem-v3.0.md |

---

## 1. Ringkasan

Database schema untuk landing-maloka MVP adalah minimal dan pragmatic — 3 tabel utama (projects, documentation, artifacts) dengan indexes untuk query performa. PostgreSQL 16 sebagai primary datastore; Redis untuk caching metadata. Source of truth untuk dokumentasi tetap di GitHub; landing-maloka hanya orchestrate metadata.

---

## 2. Desain database tingkat tinggi

```
projects (registry)
    ├─ config_json: Full project.config.yaml as JSONB
    ├─ name, type, lifecycle_state: Denormalized for quick query
    └─ sync_status, last_synced_at: Track webhook state

documentation (metadata only, no content storage)
    ├─ github_path: Path dalam repo (e.g., docs/PRD.md)
    ├─ content_hash: SHA256 untuk change detection
    └─ visibility: PUBLIC or PRIVATE

artifacts (references to MinIO storage)
    ├─ minio_path: Path dalam MinIO bucket
    ├─ artifact_type: screenshot, apk, demo
    └─ url: Direct accessible URL (if applicable)
```

---

## 3. Schema lengkap (SQL)

### 3.1 Projects table

```sql
CREATE TABLE projects (
  id VARCHAR(50) PRIMARY KEY,
  config_json JSONB NOT NULL,              -- Full project.config.yaml serialized
  name VARCHAR(255) NOT NULL,              -- Project name (denormalized from config)
  type VARCHAR(50) NOT NULL,               -- WEB_APP, MOBILE_APP, API_SERVICE, etc
  lifecycle_state VARCHAR(50) NOT NULL,    -- idea, building, active, archived, experimental
  short_description TEXT,                  -- One-liner (denormalized for UI)
  github_repo_url VARCHAR(255),            -- Full GitHub repo URL
  deployment_url VARCHAR(255),             -- Deployed app URL (if applicable)
  
  -- Sync metadata
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED, SYNC_WARNING
  last_sync_error TEXT,                    -- Error message if sync failed
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_type CHECK (type IN (
    'WEB_APP', 'MOBILE_APP', 'API_SERVICE', 'IOT_SYSTEM', 
    'AI_TOOL', 'AUTOMATION', 'INTERNAL_TOOL', 'EXPERIMENTAL'
  )),
  CONSTRAINT valid_lifecycle CHECK (lifecycle_state IN (
    'idea', 'building', 'active', 'archived', 'experimental'
  )),
  CONSTRAINT valid_sync_status CHECK (sync_status IN (
    'PENDING', 'SUCCESS', 'FAILED', 'SYNC_WARNING'
  ))

  -- Note: PostgreSQL ENUM types (CREATE TYPE ...) recommended for Phase 2+ for type-safety
  -- Current CHECK constraints sufficient for MVP
);

CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_lifecycle ON projects(lifecycle_state);
CREATE INDEX idx_projects_last_synced ON projects(last_synced_at DESC);
CREATE INDEX idx_projects_created ON projects(created_at DESC);
```

**Fields explanation:**
- `config_json JSONB`: Stores the entire `project.config.yaml` as-is. Allows schema flexibility for future fields (portfolio_narrative, ai_assisted, etc.)
- `name, type, lifecycle_state`: Denormalized from config for fast filtering without JSON parsing
- `sync_status`: Tracks webhook sync health. Used for "Documentation out of sync" badge in UI
- `last_sync_error`: Useful for debugging failed webhooks in logs

### 3.2 Documentation table

```sql
CREATE TABLE documentation (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  doc_type VARCHAR(50) NOT NULL,           -- prd, architecture, roadmap, api, task
  
  -- Metadata only (no content storage)
  github_path VARCHAR(255) NOT NULL,       -- docs/PRD.md path in repo
  content_hash VARCHAR(255),               -- SHA256(content) for change detection
  visibility VARCHAR(50) NOT NULL DEFAULT 'PUBLIC', -- PUBLIC, PRIVATE
  
  -- Sync metadata
  last_synced_at TIMESTAMP WITH TIME ZONE,
  last_fetch_attempt TIMESTAMP WITH TIME ZONE
  -- Note: last_sync_error deferred to Phase 2 (not exposed to public API)
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(project_id, doc_type),
  CONSTRAINT valid_doc_type CHECK (doc_type IN (
    'prd', 'architecture', 'roadmap', 'api', 'task'
  )),
  CONSTRAINT valid_visibility CHECK (visibility IN (
    'PUBLIC', 'PRIVATE'
  ))
);

CREATE INDEX idx_documentation_project ON documentation(project_id);
CREATE INDEX idx_documentation_visibility ON documentation(project_id, visibility);
CREATE INDEX idx_documentation_last_synced ON documentation(last_synced_at DESC);
```

**Fields explanation:**
- `github_path`: Used by webhook to fetch fresh content from GitHub when needed
- `content_hash`: Change detector. Webhook compares new hash vs stored hash to decide if docs updated
- `visibility`: Filters which docs show to public visitors. Webhook respects this during fetch
- `fetch_error`: If GitHub API call fails, log error here for troubleshooting
- **NO content field**: Content fetched on-demand from GitHub, cached in Redis. Keeps DB lean.

### 3.3 Artifacts table

```sql
CREATE TABLE artifacts (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  artifact_type VARCHAR(50) NOT NULL,      -- screenshot, apk, demo, other
  title VARCHAR(255),                      -- Display label (e.g., "Demo video", "APK download")
  minio_path VARCHAR(255),                 -- s3://bucket/path/file (MinIO storage path)
  url VARCHAR(255),                        -- Direct accessible URL (e.g., Play Store link)
  display_order INT DEFAULT 0,             -- Sort order in gallery
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_artifact_type CHECK (artifact_type IN (
    'screenshot', 'apk', 'demo', 'other'
  ))
);

CREATE INDEX idx_artifacts_project ON artifacts(project_id, display_order);
```

**Fields explanation:**
- `minio_path`: Reference to MinIO storage. Frontend constructs presigned URL via MinIO API
- `url`: Direct link for external resources (Play Store, App Store, demo site)
- `display_order`: Controls gallery order in UI
- Simple flat structure — no nesting. Artifacts are listed per project.

**Note**: Sync events logging deferred to Phase 2+. MVP uses structured JSON logging to stdout (Docker handles rotation & aggregation). No audit table needed.

---

## 4. Data model & relationships

```
┌─────────────────────┐
│    projects         │
├─────────────────────┤
│ id (PK)             │
│ config_json JSONB   │◄──── Full metadata from webhook
│ name, type, state   │
│ sync_status         │
│ last_synced_at      │
└──────────┬──────────┘
           │ 1:N
           │
    ┌──────▼──────────────────┐
    │  documentation          │
    ├─────────────────────────┤
    │ id (PK)                 │
    │ project_id (FK)         │
    │ doc_type                │
    │ github_path             │  ◄──── Points to GitHub
    │ content_hash            │
    │ visibility              │
    │ last_synced_at          │
    └────────────────────────┘

           │ 1:N
           │
    ┌──────▼──────────────────┐
    │    artifacts            │
    ├─────────────────────────┤
    │ id (PK)                 │
    │ project_id (FK)         │
    │ artifact_type           │
    │ minio_path              │  ◄──── Points to MinIO
    │ url                     │
    └────────────────────────┘
```

---

## 5. Consistency & constraints

### 5.1 Referential integrity
- `documentation.project_id` → `projects.id` (ON DELETE CASCADE)
  - If project deleted, all docs deleted
- `artifacts.project_id` → `projects.id` (ON DELETE CASCADE)
  - If project deleted, all artifacts deleted

### 5.2 Business constraints
- `projects.id`: Immutable primary key (from GitHub repo name slug)
- `documentation` UNIQUE on `(project_id, doc_type)`: Only one PRD per project
- `visibility` in {PUBLIC, PRIVATE}: Enforced at DB level
- `type` in enum: Only valid project types allowed
- `lifecycle_state` in enum: Only valid states allowed

### 5.3 Eventual consistency
- **config_json**: Updated by webhook within 5s of GitHub push
- **documentation metadata**: Updated by webhook. Content fetched on-demand from GitHub
- **artifacts**: Updated by webhook or manual engineer update
- **If webhook fails**: stale data acceptable for MVP; "out of sync" badge shown

---

## 6. Indexes & query patterns

### Common queries (indexed for performance)

```sql
-- 1. List all active projects (home page)
SELECT id, name, type, lifecycle_state, short_description
FROM projects
WHERE lifecycle_state = 'active'
ORDER BY last_synced_at DESC;
-- Uses: idx_projects_lifecycle

-- 2. Filter by type (user browsing portfolio)
SELECT id, name, type, lifecycle_state
FROM projects
WHERE type = 'WEB_APP'
ORDER BY last_synced_at DESC;
-- Uses: idx_projects_type

-- 3. Get project with public docs only
SELECT d.id, d.doc_type, d.github_path
FROM documentation d
WHERE d.project_id = $1
  AND d.visibility = 'PUBLIC';
-- Uses: idx_documentation_visibility

-- 4. Check sync health (find stale projects)
SELECT id, name, sync_status, last_synced_at
FROM projects
WHERE sync_status != 'SUCCESS'
  OR last_synced_at < NOW() - INTERVAL '1 day';
-- Uses: idx_projects_last_synced

-- 5. Get artifacts for project (gallery view)
SELECT id, artifact_type, title, minio_path, url
FROM artifacts
WHERE project_id = $1
ORDER BY display_order;
-- Uses: idx_artifacts_project
```

**Query performance targets:**
- Queries 1-3: < 50ms (cache miss)
- Queries 4-5: < 100ms (admin/debug queries)
- With Redis cache hit: < 5ms

---

## 7. Migration strategy

### Initial setup (Week 1)

```bash
# 1. Create all tables
psql -U postgres landing_maloka < schema.sql

# 2. Seed initial 7 projects (from project.config.yaml files)
node scripts/seed-projects.js

# 3. Verify indexes created
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';
```

### Rolling updates (Phase 2+)

If schema changes needed:
```sql
-- Add new column (backward compatible)
ALTER TABLE projects ADD COLUMN new_field VARCHAR(255);

-- Add new documentation type
-- Update CHECK constraint:
ALTER TABLE documentation DROP CONSTRAINT valid_doc_type;
ALTER TABLE documentation ADD CONSTRAINT valid_doc_type 
  CHECK (doc_type IN ('prd', 'architecture', 'roadmap', 'api', 'task', 'deployment'));
```

**Rule**: Always add new columns with default values, never remove columns mid-Phase. Schema changes coordinated with application deployment.

---

## 8. Backup & recovery

### Daily backup strategy
```bash
# Automated backup (cron: 02:00 UTC daily)
pg_dump -h localhost -U postgres -F c landing_maloka > backup-$(date +%Y%m%d).sql

# Keep last 7 days of backups
find backups/ -mtime +7 -delete
```

### Recovery procedure
```bash
# Restore from backup
pg_restore -h localhost -U postgres -d landing_maloka backup-20260521.sql
```

**Storage**: Backups stored on home server NAS (daily rotation, 7-day retention).

---

## 9. Performance tuning

### Connection pooling
```
# docker-compose.yml
services:
  postgres:
    environment:
      POSTGRES_INITDB_ARGS: "-c max_connections=200"
      POSTGRES_COMMAND: "postgres -c shared_buffers=256MB -c effective_cache_size=1GB"
```

### Planned indexes (Phase 2+)
- Partial index on `sync_events(status)` filtered to 'failed' (for admin dashboard)
- JSONB path index on `config_json->>'stack'` if tech-stack search added

### Query optimization
- N+1 query prevention: Batch fetch projects with their docs/artifacts
- JSONB extraction: Use `config_json->>'ai_involvement_score'` if frequent filtering needed

---

## 10. Data retention policy

| Data | Retention | Rule |
|---|---|---|
| projects | ∞ | Never delete project, archive instead (lifecycle_state='archived') |
| documentation | ∞ | Metadata (github_path, hash) kept; content fetched on-demand from GitHub |
| artifacts | ∞ | MinIO URLs kept; cleanup old screenshots manually |
| sync_events | 30 days | Optional debug log, auto-purge after 30 days |

---

## 11. Security & data protection

**Sensitive data in DB:**
- ❌ No private documentation content (fetched on-demand from GitHub)
- ❌ No user credentials, tokens, or secrets
- ✅ GitHub webhook HMAC validation logged (not stored)

**Database access:**
- PostgreSQL user: `landing_maloka_app` (read/write)
- No direct internet exposure; behind Docker network only
- Credentials stored in `.env` (git-ignored)

**Audit trail:**
- `created_at`, `updated_at`, `last_synced_at` timestamps on all tables
- `sync_events` table (optional) for webhook debug logging

---

## 12. Assumptions

- ✅ PostgreSQL 16 running locally (docker container)
- ✅ Default PostgreSQL admin user available for setup
- ✅ Disk space: ~1GB sufficient for MVP scale (7 projects + metadata)
- ✅ Backup storage on NAS available
- ✅ No need for replication or HA in MVP phase

---

## Document history

| Versi | Tanggal | Change |
|---|---|---|
| 1.0 | 2026-05-21 | Initial implementation schema — 3 tables, metadata-only design, on-demand doc fetching |

