# Deployment Guide: Landing Maloka — Personal Engineering Portfolio OS

| Field | Nilai |
|---|---|
| Versi | 1.0 |
| Status | Implementation Draft |
| Tanggal | 2026-05-21 |
| Author | Claude Code Documentation Factory |
| Linked TechSpec | 03-TechSpec-landing-maloka-ecosystem-v3.0.md |

---

## 1. Ringkasan deployment

Landing Maloka MVP deploys ke **home server Docker**. Stack: Next.js 14 app + PostgreSQL 16 + Redis 7 + Nginx reverse proxy. Auto-deploy dari GitHub Actions on push to main. Downtime < 30s (graceful restart).

**Deployment targets:**
- Development: `http://localhost:3000`
- Production: `https://maloka.app` (home server)

---

## 2. Prerequisites

**Existing infrastructure (assumed present):**
- PostgreSQL 16 (local installation on home server)
- Redis 7 (local installation on home server)
- Nginx 1.24+ (reverse proxy already configured)
- DNS: `maloka.app` → home server IP

**New infrastructure (MVP):**
- Docker 24.0+ (for Next.js app container)
- Docker Compose 2.0+ (optional, for local dev only)

**Credentials:**
- GitHub Personal Access Token (repo:read scope)
- GitHub Webhook Secret
- Cloudflare Tunnel token (already configured)

**System:**
- 2GB RAM minimum (for Next.js app container)
- 5GB disk space (for app + logs)
- Internet access (GitHub webhooks)

---

## 3. Local development setup

### 3.1 Clone repository

```bash
git clone https://github.com/ansae/landing-maloka.git
cd landing-maloka
```

### 3.2 Install dependencies

```bash
# Node.js dependencies
npm install

# Dev dependencies (testing, linting)
npm install --save-dev eslint prettier jest @testing-library/react
```

### 3.3 Create `.env.local` (development)

```bash
# Database
DATABASE_URL=postgresql://landing_maloka_app:password@localhost:5432/landing_maloka_dev
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/landing_maloka_dev

# Redis
REDIS_URL=redis://localhost:6379

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Next.js
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
```

### 3.4 Start local stack

```bash
# Option 1: Docker Compose (recommended)
docker-compose -f docker-compose.dev.yml up -d

# Option 2: Manual (for debugging)
# Terminal 1: PostgreSQL
docker run --name landing_maloka_pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16

# Terminal 2: Redis
docker run --name landing_maloka_redis -p 6379:6379 redis:7

# Terminal 3: Next.js app
npm run dev
```

### 3.5 Initialize database

```bash
# Run migrations
npm run migrate

# Seed initial projects (from fixtures)
npm run seed

# Verify
npm run db:status
```

### 3.6 Verify development setup

```bash
# Check app running
curl http://localhost:3000

# Check API
curl http://localhost:3000/api/projects

# Check database connection
npm run db:check

# Run tests
npm test
```

**Expected output:**
- App loads at `http://localhost:3000`
- API responds with project list
- Database shows 7 projects
- All tests pass

---

## 4. Production deployment

### 4.1 Docker setup (production)

**File: `docker-compose.prod.yml`** (Next.js app only)

```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    container_name: landing_maloka_app
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://landing_maloka_app:${DB_PASSWORD}@host.docker.internal:5432/landing_maloka
      REDIS_URL: redis://host.docker.internal:6379
      GITHUB_TOKEN: ${GITHUB_TOKEN}
      GITHUB_WEBHOOK_SECRET: ${GITHUB_WEBHOOK_SECRET}
      NEXT_PUBLIC_API_BASE_URL: https://maloka.app/api
    ports:
      - "3000:3000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Note**: PostgreSQL & Redis are existing home server installations (not containerized). The app container connects via `host.docker.internal` (Docker networking on macOS/Linux host bridge).

### 4.1b Cloudflare Tunnel setup

**Note**: SSL/TLS is handled entirely by Cloudflare. No local certificate management needed.

```bash
# Cloudflare Tunnel configuration
# Dashboard → Networks → Tunnels → landing-maloka-tunnel

# Public Hostname:
# Domain: maloka.app
# Service: HTTP://localhost:3000

# This exposes your home server app via Cloudflare edge
# All HTTPS traffic is encrypted by Cloudflare
# Local traffic (Tunnel → Nginx → App) is plain HTTP
```

### 4.2 Nginx reverse proxy config (production)

**File: `nginx.prod.conf`** (simplified for Cloudflare Tunnel)

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for"';
  
  access_log /var/log/nginx/access.log main;

  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 65;
  types_hash_max_size 2048;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;

  upstream app_backend {
    server localhost:3000;
  }

  # HTTP reverse proxy (SSL handled by Cloudflare Tunnel)
  server {
    listen 80;
    server_name _;

    location / {
      proxy_pass http://app_backend;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto https;  # Tell app: HTTPS via tunnel
      proxy_connect_timeout 10s;
      proxy_send_timeout 10s;
      proxy_read_timeout 10s;
    }

    # Health check endpoint
    location /health {
      proxy_pass http://app_backend;
      access_log off;
    }
  }
}
```

**Note**: SSL/TLS handled entirely by Cloudflare Tunnel. Local Nginx is HTTP-only reverse proxy.

### 4.3 Environment variables (production)

**File: `.env.prod` (keep secrets, DO NOT commit)**

```bash
# Database
DATABASE_URL=postgresql://landing_maloka_app:strong_random_password@postgres:5432/landing_maloka

# Redis
REDIS_URL=redis://redis:6379

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://maloka.app/api

# Logging
LOG_LEVEL=info
```

### 4.4 Deploy to home server

```bash
# 1. SSH into home server
ssh user@home-server-ip

# 2. Clone/pull latest code
cd /opt/landing-maloka
git pull origin main

# 3. Copy .env.prod (kept secure outside git)
# Skip — .env.prod should already exist on server

# 4. Build and deploy
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# 5. Verify deployment
docker-compose -f docker-compose.prod.yml ps
curl https://maloka.app/api/projects

# 6. Check logs
docker-compose -f docker-compose.prod.yml logs -f app
```

---

## 5. Database migrations

### 5.1 Initial schema setup

```bash
# Run Prisma migrations (if using Prisma ORM)
npm run prisma:migrate:deploy

# Or manual SQL migrations
psql -h localhost -U landing_maloka_app -d landing_maloka < migrations/001_initial_schema.sql
```

### 5.2 Backup & restore

```bash
# Daily automated backup (cron: 02:00 UTC)
0 2 * * * pg_dump -h localhost -U postgres landing_maloka | gzip > /backups/landing_maloka-$(date +\%Y\%m\%d).sql.gz

# Restore from backup
gunzip < /backups/landing_maloka-20260521.sql.gz | psql -h localhost -U postgres landing_maloka
```

---

## 6. CI/CD Pipeline (GitHub Actions)

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch: # Manual trigger

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage

      - name: Build Next.js app
        run: npm run build

      - name: Build Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          tags: landing-maloka:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to home server
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_USER: ${{ secrets.SSH_USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H $SSH_HOST >> ~/.ssh/known_hosts

          ssh $SSH_USER@$SSH_HOST << 'DEPLOY_SCRIPT'
            cd /opt/landing-maloka
            git pull origin main
            docker-compose -f docker-compose.prod.yml build
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d
            sleep 5
            curl -f https://maloka.app/health || exit 1
          DEPLOY_SCRIPT
```

---

## 7. Monitoring & health checks

### 7.1 Health endpoint

```javascript
// pages/api/health.ts

export async function GET(request: NextRequest) {
  const checks = {
    app: 'ok',
    database: 'checking...',
  };

  try {
    // Database health check
    await db.query('SELECT 1');
    checks.database = 'ok';
  } catch (err) {
    checks.database = `error: ${err.message}`;
  }

  // Note: Redis check optional (Phase 2 if enabled)
  // GitHub API not checked (external dependency, let it fail gracefully)

  const status = Object.values(checks).every(c => c === 'ok') ? 200 : 503;

  return NextResponse.json({ timestamp: new Date(), checks }, { status });
}
```

### 7.2 Monitoring command

```bash
# Check application health
watch -n 5 'curl -s https://maloka.app/health | jq .'

# Check Docker container status
docker-compose -f docker-compose.prod.yml ps

# Check disk space
df -h /opt/landing-maloka

# Check database
psql -h localhost -U landing_maloka_app -d landing_maloka -c "SELECT COUNT(*) FROM projects;"

# Check Redis
redis-cli INFO stats

# Check logs
docker-compose -f docker-compose.prod.yml logs -f app | grep -i error
```

---

## 8. Rollback procedure

```bash
# If deployment fails or bugs detected:

# 1. Identify last good commit
git log --oneline | head -5

# 2. Revert to previous commit
git revert HEAD -m 1
git push origin main

# 3. CI/CD automatically redeploys previous version

# 4. If CI/CD fails, manual rollback
ssh user@home-server
cd /opt/landing-maloka
git checkout <commit-sha>
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# 5. Verify
curl https://maloka.app/health
```

---

## 9. Maintenance tasks

| Task | Frequency | Command |
|---|---|---|
| Database backup | Daily (02:00 UTC) | `pg_dump ... \| gzip` |
| Dependency updates | Monthly | `npm audit --fix` |
| Log rotation | Weekly | Docker handles automatically |
| SSL cert renewal | Quarterly | `certbot renew` (if using Let's Encrypt) |
| Security scan | Monthly | `npm audit`, `docker scout cves` |

---

## 10. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| App won't start | Docker build error | `docker-compose logs app` check error |
| Database connection failed | PostgreSQL not running | `docker-compose up -d postgres && docker-compose ps` |
| Webhook 502 error | GitHub API rate limited | Check rate limit: `curl https://api.github.com/rate_limit` |
| Cache missing | Redis key expired | Invalidate cache: `redis-cli DEL projects:*` |
| Nginx SSL error | Certificate expired | Renew cert: `certbot renew --force-renewal` |

---

## 11. Deployment checklist (pre-launch)

- [ ] `.env.prod` secured (not in git)
- [ ] Cloudflare Tunnel configured & active
- [ ] Nginx reverse proxy running (HTTP on port 80)
- [ ] Database backups configured (cron job)
- [ ] GitHub Actions secrets configured (SSH key, host, user)
- [ ] GitHub webhook secret matches `.env.prod`
- [ ] Firewall rules: 80 open locally; 5432, 6379 internal only
- [ ] Cloudflare Tunnel pointing to `localhost:3000`
- [ ] Health endpoint responds: `curl https://maloka.app/health`
- [ ] Manual smoke test: browse home, view project, open docs, test webhook
- [ ] Logs monitored (no critical errors): `docker-compose logs -f app`
- [ ] Rollback procedure tested (git revert + redeploy)

---

## Document history

| Versi | Tanggal | Change |
|---|---|---|
| 1.0 | 2026-05-21 | Initial deployment guide — dev setup, prod Docker, CI/CD, monitoring |

