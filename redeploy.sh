#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_DIR="$(dirname "$(dirname "$REPO_DIR")")"  # /homeserver
SERVICE="landing-maloka"

echo "==> [1/4] Pull latest changes from main..."
cd "$REPO_DIR"
git fetch origin
git checkout main
git pull origin main

echo "==> [2/4] Build Docker image..."
cd "$COMPOSE_DIR"
docker compose build "$SERVICE"

echo "==> [3/4] Restart container..."
docker compose up -d --force-recreate "$SERVICE"

echo "==> [4/4] Verify..."
sleep 3
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$STATUS" = "200" ]; then
  echo "✓ Deploy sukses! $SERVICE berjalan (HTTP $STATUS)"
else
  echo "✗ Deploy mungkin bermasalah, HTTP status: $STATUS"
  docker compose logs --tail=30 "$SERVICE"
  exit 1
fi
