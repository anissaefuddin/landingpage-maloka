# Testing Scenario: Landing Maloka — Personal Engineering Portfolio OS

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Status | Implementation Draft |
| Tanggal | 2026-05-21 |
| Author | Claude Code Documentation Factory |
| Linked TechSpec | 03-TechSpec-landing-maloka-ecosystem-v3.0.md |

---

## 1. Ringkasan testing strategy

MVP testing fokus pada **critical paths**: webhook validation, documentation rendering, project fetching, visibility enforcement. Testing framework: Jest + React Testing Library (frontend) + Supertest (API).

**Priority-based approach:**
- P0: Webhook handler + signature validation (security-critical)
- P1: Documentation fetch + markdown rendering (user-facing)
- P1: Project visibility rules (privacy)
- P2: E2E critical user flows (happy path only)

---

## 2. Test scope & coverage

### 2.1 What to test (MVP)

| Component | Scope | Priority |
|---|---|---|
| API endpoints | All 5 endpoints (GET /projects, /projects/{id}, /projects/{id}/docs/{type}, /projects/{id}/artifacts, POST /webhook) | P0 |
| Webhook handler | Signature validation, payload parsing, DB sync, cache invalidation | P0 |
| Markdown renderer | Safe rendering, XSS prevention, syntax highlighting | P1 |
| Database layer | CRUD operations, constraints, indexes | P1 |
| Cache logic | Cache hit/miss, TTL expiration, invalidation | P1 |
| UI components | Project card, detail page, doc viewer, gallery | P1 |

### 2.2 What NOT to test (MVP)

| Item | Reason |
|---|---|
| Third-party libraries | Trust npm ecosystem |
| External APIs (GitHub) | Mock GitHub API calls; test separately |
| Infrastructure (Docker, Nginx) | Manual smoke test |
| Performance optimization | Add Phase 2+ |

---

## 3. Unit tests

### 3.1 API route tests (Supertest + Jest)

**File: `__tests__/api/projects.test.ts`**

```javascript
import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/projects';
import * as db from 'lib/db';

jest.mock('lib/db');

describe('GET /api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns all projects sorted by update date', async () => {
    const mockProjects = [
      {
        id: 'rims',
        name: 'RIMS',
        type: 'WEB_APP',
        lifecycle_state: 'ACTIVE',
        last_synced_at: new Date('2026-05-21T15:30:00Z'),
      },
    ];
    
    db.getProjects.mockResolvedValue(mockProjects);

    const { req, res } = createMocks({
      method: 'GET',
      query: { sort: 'updated' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      projects: mockProjects,
      total: 1,
      timestamp: expect.any(String),
    });
  });

  test('filters projects by type', async () => {
    const mockProjects = [
      { id: 'rims', type: 'WEB_APP', ... },
    ];
    
    db.getProjectsByType.mockResolvedValue(mockProjects);

    const { req, res } = createMocks({
      method: 'GET',
      query: { type: 'WEB_APP' },
    });

    await handler(req, res);

    expect(db.getProjectsByType).toHaveBeenCalledWith('WEB_APP');
    expect(res._getStatusCode()).toBe(200);
  });

  test('returns 500 on database error', async () => {
    db.getProjects.mockRejectedValue(new Error('DB connection failed'));

    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData()).error).toBeDefined();
  });
});
```

**File: `__tests__/api/webhook.test.ts`**

```javascript
import crypto from 'crypto';
import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/webhook';
import * as db from 'lib/db';
import * as github from 'lib/github';

jest.mock('lib/db');
jest.mock('lib/github');

describe('POST /api/webhook', () => {
  const secret = 'test-webhook-secret';
  process.env.GITHUB_WEBHOOK_SECRET = secret;

  test('validates HMAC signature correctly', async () => {
    const payload = JSON.stringify({
      repository: { name: 'rims' },
      commits: [{ modified: ['docs/PRD.md'] }],
    });

    const signature = `sha256=${crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')}`;

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'x-hub-signature-256': signature,
        'x-github-event': 'push',
      },
      body: payload,
    });

    db.updateProject.mockResolvedValue({});
    github.fetchFromGitHub.mockResolvedValue('# PRD Content');

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  test('rejects invalid signature', async () => {
    const payload = JSON.stringify({
      repository: { name: 'rims' },
    });

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'x-hub-signature-256': 'sha256=invalid_signature',
        'x-github-event': 'push',
      },
      body: payload,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  test('syncs project config on webhook', async () => {
    // ... setup valid signature ...
    
    github.fetchFromGitHub.mockResolvedValue(
      JSON.stringify({
        name: 'RIMS Updated',
        type: 'WEB_APP',
      })
    );

    db.updateProject.mockResolvedValue({ id: 'rims' });
    db.invalidateCache.mockResolvedValue({});

    await handler(req, res);

    expect(db.updateProject).toHaveBeenCalled();
    expect(db.invalidateCache).toHaveBeenCalledWith('projects:rims');
  });

  test('handles GitHub API failures gracefully', async () => {
    // ... setup valid signature ...
    
    github.fetchFromGitHub.mockRejectedValue(new Error('GitHub API rate limited'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(502);
    expect(JSON.parse(res._getData()).error).toContain('GitHub');
  });
});
```

### 3.2 Utility function tests

**File: `__tests__/lib/markdown.test.ts`**

```javascript
import { renderMarkdown, sanitizeMarkdownContent } from 'lib/markdown';

describe('Markdown utilities', () => {
  test('renders valid markdown to HTML', () => {
    const md = '# Hello\n\nThis is **bold** text.';
    const html = renderMarkdown(md);
    
    expect(html).toContain('<h1>Hello</h1>');
    expect(html).toContain('<strong>bold</strong>');
  });

  test('sanitizes script tags', () => {
    const malicious = '# Title\n\n<script>alert("xss")</script>';
    const html = renderMarkdown(malicious);
    
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('alert');
  });

  test('blocks iframe tags', () => {
    const iframe = '<iframe src="http://evil.com"></iframe>';
    const html = renderMarkdown(iframe);
    
    expect(html).not.toContain('<iframe>');
  });

  test('restricts image sources to HTTPS', () => {
    const imgHttp = '![alt](http://example.com/image.jpg)';
    const imgHttps = '![alt](https://example.com/image.jpg)';
    
    const htmlHttp = renderMarkdown(imgHttp);
    const htmlHttps = renderMarkdown(imgHttps);
    
    expect(htmlHttp).not.toContain('<img');
    expect(htmlHttps).toContain('<img');
  });
});
```

**File: `__tests__/lib/github.test.ts`**

```javascript
import { fetchFromGitHub, verifyWebhookSignature } from 'lib/github';
import crypto from 'crypto';

describe('GitHub utilities', () => {
  test('verifies valid webhook signature', () => {
    const secret = 'test-secret';
    const payload = 'test payload';
    const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const signature = `sha256=${hash}`;
    
    expect(verifyWebhookSignature(payload, signature, secret)).toBe(true);
  });

  test('rejects invalid webhook signature', () => {
    const result = verifyWebhookSignature(
      'test payload',
      'sha256=invalid_hash',
      'test-secret'
    );
    
    expect(result).toBe(false);
  });

  test('handles GitHub API errors', async () => {
    // Mock fetch to return 403
    global.fetch = jest.fn().mockResolvedValue({
      status: 403,
      text: () => Promise.resolve('Rate limited'),
    });

    expect(async () => {
      await fetchFromGitHub('/repos/ansae/rims/contents/docs/PRD.md');
    }).rejects.toThrow('GitHub API rate limited');
  });
});
```

---

## 4. Integration tests

### 4.1 API + Database integration

**File: `__tests__/integration/api-db.test.ts`**

```javascript
import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/projects';
import db from 'lib/db';

describe('API + Database integration', () => {
  beforeAll(async () => {
    // Connect to test database
    await db.connect(process.env.TEST_DATABASE_URL);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    // Clear tables before each test
    await db.clearTables();
    // Seed test data
    await db.seedProjects([
      {
        id: 'test-project',
        name: 'Test Project',
        type: 'WEB_APP',
        lifecycle_state: 'ACTIVE',
      },
    ]);
  });

  test('fetches projects from database and returns via API', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    
    expect(data.projects.length).toBe(1);
    expect(data.projects[0].id).toBe('test-project');
  });

  test('filters projects correctly', async () => {
    await db.seedProjects([
      {
        id: 'mobile-app',
        type: 'MOBILE_APP',
        lifecycle_state: 'ACTIVE',
      },
    ]);

    const { req, res } = createMocks({
      method: 'GET',
      query: { type: 'MOBILE_APP' },
    });
    await handler(req, res);

    const data = JSON.parse(res._getData());
    expect(data.projects).toHaveLength(1);
    expect(data.projects[0].type).toBe('MOBILE_APP');
  });

  test('webhook syncs project config to database', async () => {
    const payload = JSON.stringify({
      repository: { name: 'test-project' },
      commits: [{ modified: ['project.config.yaml'] }],
    });

    // Mock GitHub API response
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        name: 'Test Project Updated',
        type: 'WEB_APP',
      })),
    });

    const signature = computeSignature(payload);
    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'x-hub-signature-256': signature },
      body: payload,
    });

    await webhookHandler(req, res);

    const updated = await db.getProject('test-project');
    expect(updated.name).toBe('Test Project Updated');
  });
});
```

### 4.2 Webhook + Cache integration

**File: `__tests__/integration/webhook-cache.test.ts`**

```javascript
import * as redis from 'lib/redis';
import * as webhook from 'lib/webhook';

describe('Webhook + Cache integration', () => {
  beforeEach(async () => {
    await redis.connect();
    await redis.flushAll();
  });

  test('webhook invalidates cache after sync', async () => {
    // Set cache
    await redis.set('projects:rims', JSON.stringify({ id: 'rims', name: 'RIMS' }), 300);
    
    // Webhook triggers
    await webhook.handleGitHubPush({
      repository: { name: 'rims' },
      commits: [{ modified: ['project.config.yaml'] }],
    });

    // Cache should be invalidated
    const cached = await redis.get('projects:rims');
    expect(cached).toBeNull();
  });

  test('next API call after webhook refills cache', async () => {
    // Webhook invalidates cache
    await redis.del('projects:rims');

    // API call fetches from DB and refills cache
    const project = await getProject('rims');
    const cached = await redis.get('projects:rims');

    expect(cached).not.toBeNull();
    expect(JSON.parse(cached).id).toBe('rims');
  });
});
```

---

## 5. E2E tests (Playwright) — critical paths only

**File: `e2e/critical-flows.spec.ts`**

MVP focuses on happy paths. Advanced scenarios (edge cases, responsive testing) deferred to Phase 2.

```javascript
import { test, expect } from '@playwright/test';

test.describe('Critical user flows', () => {
  test('home page loads and displays projects', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle('Landing Maloka - Portfolio');
    
    const cards = await page.locator('[data-testid="project-card"]');
    expect(await cards.count()).toBeGreaterThanOrEqual(5);
  });

  test('click project opens detail page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('[data-testid="project-card"]:first-child');
    
    await expect(page).toHaveURL(/\/projects\/\w+/);
    const projectName = await page.locator('[data-testid="project-name"]');
    await expect(projectName).toBeVisible();
  });

  test('documentation tab renders markdown', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('[data-testid="project-card"]:first-child');
    
    await page.click('[data-testid="doc-tab-prd"]');
    const docContent = await page.locator('[data-testid="doc-content"]');
    await expect(docContent).toBeVisible();
    await expect(docContent).not.toContainText('<script');  // XSS check
  });

  test('filter projects by type', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('[data-testid="filter-type"]');
    await page.click('text=Web App');
    
    const cards = await page.locator('[data-testid="project-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
```

**Note:** Responsive testing, gallery lightbox, advanced edge cases deferred to Phase 2+.

---

## 6. Test execution & CI/CD

### 6.1 Local testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- api/projects.test.ts

# Watch mode (auto-rerun on save)
npm test -- --watch

# Coverage report
npm test -- --coverage

# E2E tests
npm run test:e2e
```

### 6.2 Pre-commit hooks

**File: `.husky/pre-commit`**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linter
npm run lint --max-warnings=0

# Run tests (fail if any test fails)
npm test -- --bail

# Check for secrets
npm run secrets:scan
```

### 6.3 GitHub Actions CI

**File: `.github/workflows/test.yml`**

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: landing_maloka_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run test:e2e

      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

---

## 7. Test data & fixtures

**File: `__tests__/fixtures/projects.json`**

```json
[
  {
    "id": "rims",
    "name": "RIMS",
    "type": "WEB_APP",
    "lifecycle_state": "ACTIVE",
    "short_description": "Inventory management system",
    "github_repo_url": "https://github.com/ansae/rims",
    "deployment_url": "https://rims.example.com"
  },
  {
    "id": "fuelshift-mobile",
    "type": "MOBILE_APP",
    "lifecycle_state": "BUILDING"
  }
]
```

**File: `__tests__/fixtures/webhooks.json`**

```json
{
  "valid_push_event": {
    "ref": "refs/heads/main",
    "repository": { "name": "rims" },
    "commits": [{ "modified": ["docs/PRD.md", "project.config.yaml"] }]
  },
  "malicious_traversal": {
    "commits": [{ "modified": ["../../../etc/passwd"] }]
  }
}
```

---

## 8. Performance testing (Phase 2+)

```bash
# Load test with k6
k6 run load-test.js

# Lighthouse CI for frontend
npm run lighthouse:ci
```

---

## 9. Test metrics & targets (MVP)

| Metric | Target | Notes |
|---|---|---|
| Webhook validation | 100% | Security-critical, must test all cases |
| Doc rendering | 100% | User-facing, XSS prevention |
| Visibility enforcement | 100% | Privacy-critical |
| Project fetch API | 80%+ | Happy path + error cases |
| Unit test coverage | 50%+ | Focus on critical paths, not comprehensive |
| E2E critical flows | 4 tests | Happy path only (home, detail, docs, filter) |
| Test execution time | < 3 min | Acceptable for MVP |
| Flaky tests | 0 | Investigate any intermittent failures |

---

## Document history

| Versi | Tanggal | Change |
|---|---|---|
| 1.0 | 2026-05-21 | Initial test scenario — unit, integration, E2E, CI/CD |

