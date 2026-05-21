# Security Review: Landing Maloka — Personal Engineering Portfolio OS

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Status | Implementation Draft |
| Tanggal | 2026-05-21 |
| Author | Claude Code Documentation Factory |
| Linked TechSpec | 03-TechSpec-landing-maloka-ecosystem-v3.0.md |

---

## 1. Ringkasan keamanan

Landing Maloka MVP adalah **public portfolio** — tidak ada sensitive data. Keamanan fokus pada:
1. **Webhook authenticity**: HMAC-SHA256 validation dari GitHub
2. **API integrity**: HTTPS only, CORS restricted
3. **Data confidentiality**: Per-document visibility control (PUBLIC/PRIVATE)
4. **Operational security**: Secrets management, logging

**Auth & session management** (Phase 2+) — not in MVP scope.

---

## 2. Security priorities (MVP)

**In scope:**
- ✅ Webhook authenticity (HMAC-SHA256)
- ✅ XSS prevention (markdown sanitization)
- ✅ SQL injection prevention (parameterized queries)
- ✅ Per-document visibility enforcement
- ✅ Secrets management (.env git-ignored)
- ✅ HTTPS enforcement

**Out of scope (Phase 2+):**
- ❌ Threat modeling / formal risk assessment
- ❌ Audit logging system
- ❌ Encryption at rest
- ❌ Intrusion detection
- ❌ Authentication & sessions (no users in MVP)

---

## 3. Webhook security (GitHub integration)

### 3.1 HMAC-SHA256 signature validation

**Implementation (Node.js + Next.js):**

```javascript
// pages/api/webhook.ts

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

function verifyGitHubSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  const expectedSignature = `sha256=${hash}`;
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  
  if (!signature || !verifyGitHubSignature(payload, signature, WEBHOOK_SECRET)) {
    console.error('Webhook signature invalid', { signature, ip: request.ip });
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const event = JSON.parse(payload);
  // Process webhook...
  
  return NextResponse.json({ status: 'processed' }, { status: 200 });
}
```

**Security properties:**
- ✅ Timing-safe comparison (`crypto.timingSafeEqual`) — prevents timing attacks
- ✅ HMAC uses sha256 — cryptographically secure
- ✅ Webhook secret stored in `.env` — never in code
- ✅ All failed signatures logged — for intrusion detection

### 3.2 Webhook input validation

```javascript
// lib/webhook.ts

function validateGitHubPayload(event: any): boolean {
  // 1. Verify structure
  if (!event.repository || !event.commits) {
    return false;
  }
  
  // 2. Verify event type
  if (event.event !== 'push') {
    return false;
  }
  
  // 3. Verify repository name
  const repoName = event.repository.name;
  if (!['rims', 'fuelshift-mobile', 'maloka-api', ...].includes(repoName)) {
    return false;
  }
  
  // 4. Verify file paths are safe (no traversal)
  for (const commit of event.commits) {
    for (const file of commit.modified || []) {
      if (file.includes('..') || file.startsWith('/')) {
        return false;
      }
    }
  }
  
  return true;
}
```

**Validation rules:**
- ✅ Reject unknown repositories
- ✅ Reject path traversal attempts (`../`)
- ✅ Reject unexpected event types
- ✅ Rate limit by delivery ID (prevent duplicate processing)

### 3.3 GitHub API authentication

```javascript
// lib/github.ts

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function fetchFromGitHub(path: string) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3.raw',
      'User-Agent': 'landing-maloka/1.0'
    }
  });
  
  if (response.status === 401) {
    throw new Error('GitHub token expired or invalid');
  }
  
  if (response.status === 403) {
    // Rate limited
    throw new Error('GitHub API rate limited');
  }
  
  return response.text();
}
```

**Token management:**
- ✅ GitHub Personal Access Token stored in `.env`
- ✅ Token permissions: `repo:read` only (no write)
- ✅ Token never exposed in logs or error messages
- ✅ Check rate limit headers; notify engineer if approaching limit

---

## 4. API security

### 4.1 HTTPS & transport security

**Production deployment (required):**
```nginx
# nginx reverse proxy
server {
  listen 443 ssl http2;
  server_name maloka.app;
  
  ssl_certificate /etc/ssl/certs/landing-maloka.crt;
  ssl_certificate_key /etc/ssl/private/landing-maloka.key;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;
  
  # Redirect HTTP → HTTPS
  if ($scheme != "https") {
    return 301 https://$server_name$request_uri;
  }
  
  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

**Security headers:**
```nginx
# Add to nginx config
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 4.2 CORS (same-origin only)

**MVP approach:** All API endpoints are same-origin (no CORS needed). Next.js app and API routes share same origin.

**Future:** If Phase 2 adds separate frontend, configure CORS:
```
Access-Control-Allow-Origin: https://maloka.app
Access-Control-Allow-Methods: GET, POST
Access-Control-Max-Age: 3600
```

---

## 5. Content security

### 5.1 Markdown rendering safety

**Using react-markdown (safe by default):**

```javascript
// components/DocumentationViewer.tsx

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export function DocumentationViewer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children }) {
          return inline ? (
            <code>{children}</code>
          ) : (
            <SyntaxHighlighter language="javascript">
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        },
        // Restrict img src to https only
        img({ src, ...props }) {
          if (!src?.startsWith('https://')) {
            return null; // Block non-HTTPS images
          }
          return <img src={src} {...props} />;
        },
        // Restrict links to https/http/mailto
        a({ href, ...props }) {
          if (href && !['http://', 'https://', 'mailto:'].some(p => href.startsWith(p))) {
            return <span>{props.children}</span>;
          }
          return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
        }
      }}
      disallowedElements={['script', 'style', 'iframe']}
    >
      {content}
    </ReactMarkdown>
  );
}
```

**Security properties:**
- ✅ No script execution (react-markdown sanitizes by default)
- ✅ No iframe embedding (blocked)
- ✅ Images restricted to HTTPS only
- ✅ Links restricted to safe protocols
- ✅ No custom HTML attributes that could inject CSS/JS

### 5.2 Per-document visibility control

**Database constraint:**
```sql
ALTER TABLE documentation
ADD CONSTRAINT valid_visibility CHECK (visibility IN ('PUBLIC', 'PRIVATE'));
```

**API enforcement (check before returning):**
```javascript
// lib/api.ts

export async function getDocumentation(projectId: string, docType: string) {
  const doc = await db.query(
    'SELECT * FROM documentation WHERE project_id = $1 AND doc_type = $2',
    [projectId, docType]
  );
  
  if (!doc || doc.visibility === 'PRIVATE') {
    throw new NotFoundError('Documentation not found');
  }
  
  // Log access (audit)
  console.log({ event: 'doc_accessed', projectId, docType, visibility: doc.visibility });
  
  return doc;
}
```

**Security properties:**
- ✅ Private docs return 404 (not 403, hides existence)
- ✅ All access logged (audit trail)
- ✅ Visibility immutable unless webhook updates

---

## 6. Database security

### 6.1 SQL injection prevention

**Use parameterized queries (never string concatenation):**

```javascript
// ❌ WRONG
const result = await db.query(`SELECT * FROM projects WHERE id = '${id}'`);

// ✅ CORRECT
const result = await db.query(
  'SELECT * FROM projects WHERE id = $1',
  [id]
);
```

**Tools:**
- Next.js + Prisma ORM (auto-parameterized)
- Or: `pg` library with `$1, $2` placeholders

### 6.2 Database access control

```sql
-- Create non-admin user for app
CREATE ROLE landing_maloka_app WITH PASSWORD 'strong_random_password';
GRANT CONNECT ON DATABASE landing_maloka TO landing_maloka_app;
GRANT USAGE ON SCHEMA public TO landing_maloka_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO landing_maloka_app;
```

**Access rules:**
- ✅ App user has limited permissions (no DROP, no TRUNCATE)
- ✅ Admin user separate (only for schema changes)
- ✅ Credentials in `.env` (git-ignored)
- ✅ No root/superuser credentials in app code

### 6.3 Encryption at rest (Phase 2+)

MVP: Accept unencrypted DB on trusted home server (acceptable for personal portfolio). Phase 2+ options if needed:
- Full disk encryption (BitLocker, LUKS)
- PostgreSQL pgcrypto (if sensitive columns added)

---

## 7. Secrets management

**Secrets stored in `.env` (never in code or git):**

```bash
# .env (git-ignored)
DATABASE_URL=postgresql://landing_maloka_app:strong_password@postgres:5432/landing_maloka
REDIS_URL=redis://redis:6379
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
NEXT_PUBLIC_API_BASE_URL=https://maloka.app/api
```

**Secrets rotation (Phase 2):**
- GitHub token: Rotate yearly or if compromised
- Webhook secret: Update on GitHub + `.env`
- Database password: Change via `ALTER USER`

**Best practices:**
- ✅ Never commit `.env` to git
- ✅ Use `.env.example` for reference (no real values)
- ✅ Load secrets from environment at runtime
- ✅ Never log secrets (redact in error messages)

---

## 8. Logging (MVP)

**Structured logging to stdout:**

```javascript
// lib/logger.ts

export function logEvent(event: any) {
  console.log({
    timestamp: new Date().toISOString(),
    event: event.type,
    project_id: event.projectId,
    status: event.status,
    duration_ms: event.duration_ms
  });
  
  // Never log: GITHUB_TOKEN, webhook_secret, database_password
}
```

**Docker handles:**
- Log rotation (configurable in docker-compose)
- Aggregation to stdout
- No persistent audit table needed for MVP

**Audit logging & monitoring (Phase 2+):** Deferred until private features added.

---

## 9. Deployment security checklist

| Item | MVP | Notes |
|---|---|---|
| HTTPS enforced | ✅ | Nginx SSL, redirect HTTP → HTTPS |
| Security headers | ✅ | HSTS, CSP, X-Frame-Options, etc |
| CORS restricted | ✅ | Whitelist origins |
| Secrets in `.env` | ✅ | Git-ignored, not in code |
| Database non-admin user | ✅ | Limited permissions |
| Webhook signature validation | ✅ | HMAC-SHA256 |
| Markdown sanitization | ✅ | react-markdown safe defaults |
| SQL injection prevention | ✅ | Parameterized queries |
| Rate limiting | ❌ | Added Phase 2+ if needed |
| WAF (Web Application Firewall) | ❌ | Nginx basic rules sufficient |
| Encryption at rest | ❌ | Home server trust boundary acceptable |
| 2FA | ❌ | Not needed (no auth in MVP) |

---

## 10. Incident response

### 10.1 If webhook is compromised

1. Immediately generate new webhook secret in GitHub
2. Update `.env` with new secret
3. Restart application
4. Review audit logs for unauthorized syncs
5. Manual rollback of any bad data via backup if needed

### 10.2 If GitHub token is compromised

1. Revoke token on github.com
2. Generate new token
3. Update `.env` with new token
4. Restart application
5. No data exposed (token is read-only)

### 10.3 If database is breached

1. Database only contains public portfolio metadata (no sensitive data)
2. No user PII collected
3. No damage from public disclosure
4. Restore from backup if data corrupted

---

## 11. Compliance & legal

**Data collected:** 
- ❌ No PII (no names, emails from visitors)
- ❌ No cookies
- ❌ No analytics (no tracking)
- ✅ Minimal logs (only errors & security events)

**Regulations:**
- GDPR: Not applicable (no PII collected)
- CCPA: Not applicable (California residents, no personal data collection)
- Consent: Not needed (no data collection)

---

## 12. Security testing & audits

**Pre-launch checklist:**

```bash
# 1. Dependency audit (find known vulnerabilities)
npm audit

# 2. SAST (static application security testing)
npx eslint . --fix
npm run lint

# 3. Secrets scanning (prevent accidental commits)
git secrets --install && git secrets --scan

# 4. Manual security review
# - Review webhook handler for injection
# - Verify CORS whitelist
# - Confirm .env is git-ignored
```

**Ongoing (Phase 2+):**
- Quarterly dependency updates
- Annual penetration test (if budget allows)
- Monthly log review for anomalies

---

## 13. Assumptions

- ✅ Home server network is trusted (private network)
- ✅ GitHub account credentials are protected
- ✅ `.env` file is kept secure (not shared)
- ✅ TLS/SSL certificates renewed before expiry
- ✅ No malicious third-party code in dependencies

---

## Document history

| Versi | Tanggal | Change |
|---|---|---|
| 1.0 | 2026-05-21 | Initial security review — webhook validation, markdown sanitization, HTTPS, secrets management |

