#!/bin/bash
# ─── JNTU Website — VPS Deploy Script ───
# Usage: ssh into VPS, cd /var/www/JNTU-REDESIGN, then: bash deploy.sh
set -e

echo "═══ JNTU Website Deploy ═══"

# 1. Pull latest code
echo "→ Pulling latest code…"
git pull origin main

# 2. Install dependencies (only if package.json changed)
echo "→ Installing dependencies…"
bun install --frozen-lockfile 2>/dev/null || bun install

# 3. Build
echo "→ Building production bundle…"
rm -rf dist
npm run build

# 4. Restart PM2
echo "→ Restarting server…"
pm2 delete jntu-website 2>/dev/null || true
pm2 start prod-server.js --name "jntu-website"
pm2 save

echo ""
echo "✓ Deploy complete! Checking status…"
sleep 2
pm2 status

# Quick health check
echo ""
echo "→ Health check…"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/ || echo "FAIL")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✓ Server responding with HTTP 200"
else
  echo "✗ Server returned HTTP $HTTP_CODE — check logs with: pm2 logs jntu-website"
fi
