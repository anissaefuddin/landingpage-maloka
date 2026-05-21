# API Specification: Landing Maloka — Personal Engineering Portfolio OS

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Status | Implementation Draft |
| Tanggal | 2026-05-21 |
| Author | Claude Code Documentation Factory |
| Linked TechSpec | 03-TechSpec-landing-maloka-ecosystem-v3.0.md |

---

## 1. Ringkasan

Landing Maloka MVP exposes 5 REST API endpoints via Next.js API routes. Public endpoints (GET) serve portfolio data to visitors. Private webhook endpoint (POST) receives GitHub push events. All responses JSON. Base URL: `/api`

**Authentication**: No auth required for MVP (public portfolio). Webhook uses HMAC-SHA256 signature validation.

---

## 2. API endpoints overview

| Method | Path | Purpose | Auth | Cache |
|---|---|---|---|---|
| GET | `/api/projects` | List all projects | None | Redis 5m |
| GET | `/api/projects/{id}` | Single project detail | None | Redis 5m |
| GET | `/api/projects/{id}/docs/{type}` | Documentation content | None | Redis 10m |
| GET | `/api/projects/{id}/artifacts` | Artifact references | None | Redis 5m |
| POST | `/api/webhook` | GitHub webhook handler | HMAC-SHA256 | None |

---

## 3. Endpoint specifications

### 3.1 GET /api/projects

**Description**: List all projects with metadata. Supports filtering & sorting.

**Query parameters:**

| Param | Type | Optional | Description |
|---|---|---|---|
| `type` | string | Yes | Filter by type (WEB_APP, MOBILE_APP, etc). Multiple allowed: `?type=WEB_APP&type=MOBILE_APP` |
| `lifecycle` | string | Yes | Filter by state (idea, building, active, archived, experimental) |
| `sort` | string | Yes | Sort order: `updated` (default), `name`, `type` |

**Request example:**
```
GET /api/projects?type=WEB_APP&lifecycle=active&sort=updated
```

**Response (200 OK):**
```json
{
  "projects": [
    {
      "id": "rims",
      "name": "RIMS",
      "type": "WEB_APP",
      "lifecycle_state": "ACTIVE",
      "short_description": "Inventory management system",
      "stack": {
        "backend": ["Laravel"],
        "frontend": ["Vue"],
        "infrastructure": ["Docker"]
      },
      "github_repo_url": "https://github.com/ansae/rims",
      "deployment_url": "https://rims.maloka.dev",
      "last_synced_at": "2026-05-21T15:30:00Z",
      "sync_status": "SUCCESS",
      "created_at": "2026-03-15T10:00:00Z",
      "updated_at": "2026-05-21T15:30:00Z"
    },
    // ... more projects
  ],
  "total": 7,
  "timestamp": "2026-05-21T16:00:00Z"
}
```

**Error responses:**

| Status | Message | Reason |
|---|---|---|
| 400 | Invalid query parameter | Invalid type/lifecycle/sort value |
| 500 | Internal server error | Database connection failed |

**Caching:**
- Cache key: `projects:list:{type}:{lifecycle}:{sort}`
- TTL: 5 minutes
- Invalidated on webhook for any project

---

### 3.2 GET /api/projects/{id}

**Description**: Get single project with all metadata, narrative, AI involvement.

**Path parameters:**

| Param | Type | Description |
|---|---|---|
| `id` | string | Project ID (e.g., "rims") |

**Request example:**
```
GET /api/projects/rims
```

**Response (200 OK):**
```json
{
  "id": "rims",
  "name": "RIMS",
  "type": "WEB_APP",
  "lifecycle_state": "ACTIVE",
  "short_description": "Inventory management system",
  "github_repo_url": "https://github.com/ansae/rims",
  "deployment_url": "https://rims.maloka.dev",
  "stack": {
    "backend": ["Laravel", "PostgreSQL"],
    "frontend": ["Vue", "Tailwind"],
    "infrastructure": ["Docker", "Nginx"]
  },
  "portfolio_narrative": "RIMS was built to streamline inventory tracking...",
  "challenges": [
    "Real-time stock synchronization",
    "Multi-warehouse integration"
  ],
  "lessons_learned": [
    "PostgreSQL JSONB for flexible data models",
    "Vue composition API reduces complexity"
  ],
  "innovations": [
    "Custom webhook-based sync architecture",
    "Zero-downtime deployment strategy"
  ],
  "ai_assisted": ["documentation", "architecture", "testing"],
  "ai_involvement_score": 65,
  "ai_involvement_description": "Architecture designed with Claude; test suites generated; API docs auto-formatted",
  "documentation": {
    "prd": { "type": "prd", "github_path": "docs/PRD.md", "visibility": "PUBLIC" },
    "architecture": { "type": "architecture", "github_path": "docs/ARCHITECTURE.md", "visibility": "PUBLIC" },
    "roadmap": { "type": "roadmap", "github_path": "docs/ROADMAP.md", "visibility": "PRIVATE" }
  },
  "last_synced_at": "2026-05-21T15:30:00Z",
  "created_at": "2026-03-15T10:00:00Z",
  "updated_at": "2026-05-21T15:30:00Z"
}
```

**Error responses:**

| Status | Message | Reason |
|---|---|---|
| 404 | Project not found | ID doesn't exist in DB |
| 500 | Internal server error | Database error |

**Caching:**
- Cache key: `projects:{id}`
- TTL: 5 minutes
- Invalidated on webhook

---

### 3.3 GET /api/projects/{id}/docs/{type}

**Description**: Fetch documentation content (markdown). Returns HTML-rendered markdown.

**Path parameters:**

| Param | Type | Description |
|---|---|---|
| `id` | string | Project ID |
| `type` | string | Doc type (prd, architecture, roadmap, api, task) |

**Request example:**
```
GET /api/projects/rims/docs/prd
```

**Response (200 OK):**
```json
{
  "project_id": "rims",
  "doc_type": "prd",
  "github_path": "docs/PRD.md",
  "visibility": "PUBLIC",
  "content": "# Product Requirement: RIMS v1.0\n\nRIMS is an inventory...",
  "content_hash": "abc123def456",
  "fetched_at": "2026-05-21T15:30:00Z",
  "last_synced_at": "2026-05-21T15:30:00Z"
}
```

**Note**: API returns **raw markdown only**. Frontend uses `react-markdown` for safe HTML rendering. This approach:
- Simplifies sanitization (delegated to proven library)
- Improves caching (markdown is cacheable; HTML is presentation-specific)
- Reduces API payload

**Error responses:**

| Status | Message | Reason |
|---|---|---|
| 404 | Project not found | Project ID invalid |
| 404 | Documentation not found | Doc type doesn't exist or visibility='PRIVATE' |
| 502 | GitHub API error | Failed to fetch from GitHub; retry with manual button |
| 500 | Internal server error | DB error |

**Caching:**
- Cache key: `projects:{id}:docs:{type}`
- TTL: 10 minutes
- Content fetched from GitHub on cache miss
- Invalidated by webhook when hash changes

---

### 3.4 GET /api/projects/{id}/artifacts

**Description**: List all artifacts (screenshots, APKs, demos) for project.

**Path parameters:**

| Param | Type | Description |
|---|---|---|
| `id` | string | Project ID |

**Request example:**
```
GET /api/projects/rims/artifacts
```

**Response (200 OK):**
```json
{
  "project_id": "rims",
  "artifacts": [
    {
      "id": 1,
      "artifact_type": "screenshot",
      "title": "Dashboard overview",
      "minio_path": "s3://landing-maloka/rims/dashboard.png",
      "url": null,
      "display_order": 0,
      "created_at": "2026-05-20T10:00:00Z"
    },
    {
      "id": 2,
      "artifact_type": "apk",
      "title": "Mobile app APK",
      "minio_path": null,
      "url": "https://github.com/ansae/rims-mobile/releases/download/v1.0/app.apk",
      "display_order": 1,
      "created_at": "2026-05-19T14:30:00Z"
    }
  ],
  "total": 2
}
```

**Error responses:**

| Status | Message | Reason |
|---|---|---|
| 404 | Project not found | Project ID invalid |
| 500 | Internal server error | DB error |

**Caching:**
- Cache key: `projects:{id}:artifacts`
- TTL: 5 minutes
- Invalidated on webhook

---

### 3.5 POST /api/webhook

**Description**: Receive GitHub push events. Validate signature, sync project metadata & documentation.

**Request headers:**

| Header | Required | Description |
|---|---|---|
| `X-GitHub-Event` | Yes | Event type (must be `push`) |
| `X-GitHub-Delivery` | Yes | GitHub delivery ID (for idempotency) |
| `X-Hub-Signature-256` | Yes | HMAC-SHA256 signature: `sha256=...` |

**Request body (example push event):**
```json
{
  "ref": "refs/heads/main",
  "repository": {
    "name": "rims",
    "owner": {
      "name": "ansae"
    },
    "full_name": "ansae/rims"
  },
  "pusher": {
    "name": "ansae"
  },
  "commits": [
    {
      "id": "abc123def456",
      "message": "Update PRD documentation",
      "modified": [
        "docs/PRD.md",
        "project.config.yaml"
      ]
    }
  ]
}
```

**Webhook processing logic:**

1. Validate `X-Hub-Signature-256` against GitHub webhook secret
2. Extract repo name → map to project ID
3. Check if `project.config.yaml` modified → fetch, parse, update DB
4. Check if any `docs/*` modified → fetch each, calculate hash, update metadata
5. Invalidate Redis cache for affected project
6. Return 200 OK
7. Log event to structured JSON logger

**Response (200 OK):**
```json
{
  "status": "processed",
  "project_id": "rims",
  "timestamp": "2026-05-21T15:30:00Z",
  "sync_status": "SUCCESS",
  "message": "project.config.yaml synced; 1 doc updated"
}
```

**Error responses:**

| Status | Message | Reason |
|---|---|---|
| 401 | Unauthorized | Invalid HMAC signature |
| 400 | Bad request | Malformed GitHub payload |
| 404 | Project not found | Repo doesn't map to known project |
| 502 | GitHub API error | Failed to fetch files from GitHub (retry later) |
| 500 | Internal server error | DB write failed |

**Webhook retry policy:**
- GitHub retries automatically if response != 2xx (retry: 10s, 1m, 5m)
- Engineer can manual retry via "Sync now" button in UI
- Webhook timeout: 30 seconds (GitHub default)

**Idempotency:**
- Use `X-GitHub-Delivery` header as idempotency key
- If same delivery ID seen twice, skip processing (prevent duplicates)

**Signature validation (Node.js example):**
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${hash}`)
  );
}
```

---

## 4. Response format standards

### Success response (2xx)
```json
{
  "data": { /* response payload */ },
  "timestamp": "2026-05-21T16:00:00Z",
  "status": "success"
}
```

### Error response (4xx, 5xx)
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Project with ID 'unknown' not found",
    "details": {
      "project_id": "unknown"
    }
  },
  "timestamp": "2026-05-21T16:00:00Z"
}
```

**Error codes:**
- `RESOURCE_NOT_FOUND` (404)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `BAD_REQUEST` (400)
- `INTERNAL_ERROR` (500)
- `SERVICE_UNAVAILABLE` (502)

---

## 5. Rate limiting & quotas (MVP)

| Endpoint | Limit | Window | Reason |
|---|---|---|---|
| GET /api/projects | None | — | Public, cacheable |
| GET /api/projects/{id} | None | — | Public, cacheable |
| GET /api/projects/{id}/docs/{type} | None | — | Public, cacheable |
| GET /api/projects/{id}/artifacts | None | — | Public, cacheable |
| POST /api/webhook | 1 per push | Per GitHub event | GitHub handles retry; no abuse possible |

**Note**: Rate limiting not needed for MVP (home server, low traffic). Add in Phase 2 if needed.

---

## 6. Pagination (future consideration)

MVP doesn't paginate — only 7 projects, fits in single response. If projects grow:
```
GET /api/projects?page=1&limit=10

Response:
{
  "projects": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## 7. CORS policy

**Allowed origins** (same-origin only):
```
Access-Control-Allow-Origin: https://maloka.app
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600
```

**Rationale**: All endpoints are public or webhook-only. Restrict to prevent abuse.

---

## 8. Versioning & deprecation (future)

API version not in URL (v1 implicit in MVP). If major changes needed:
- New endpoint: `/api/v2/projects`
- Old endpoint deprecated: redirect with 301 + deprecation header
- Sunset window: 6 months notice

---

## 9. Monitoring & observability

**Request logging (structured JSON):**
```json
{
  "timestamp": "2026-05-21T16:00:00Z",
  "level": "info",
  "event": "api_request",
  "method": "GET",
  "path": "/api/projects/rims",
  "status": 200,
  "duration_ms": 45,
  "cache_hit": true,
  "user_agent": "Mozilla/5.0..."
}
```

**Key metrics:**
- Request latency (p50, p95, p99)
- Cache hit rate
- Error rate by endpoint
- GitHub API call latency
- Webhook success rate

---

## Document history

| Versi | Tanggal | Change |
|---|---|---|
| 1.0 | 2026-05-21 | Initial API spec — 5 endpoints, webhook handler, caching strategy |

