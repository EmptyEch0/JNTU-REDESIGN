# 🚀 JNTU Website — Deployment Guide

## One-Time Setup (already done)
```bash
ssh root@89.116.134.182
cd /var/www/JNTU-REDESIGN
```

---

## Deploy (every time you push changes)

### Step 1: SSH into VPS
```
ssh root@89.116.134.182
```

### Step 2: Run deploy
```
cd /var/www/JNTU-REDESIGN && bash deploy.sh
```

That's it. The script handles everything automatically.

---

## What `deploy.sh` does behind the scenes
1. `git pull origin main` — pulls your latest code
2. `bun install` — installs any new packages
3. `rm -rf dist && npm run build` — rebuilds the app
4. `pm2 restart` — restarts the server
5. Health check — verifies it's working

---

## Quick Commands Reference

| Task | Command (run inside SSH) |
|------|--------------------------|
| Check if server is running | `pm2 status` |
| View server logs | `pm2 logs jntu-website` |
| Restart without rebuilding | `pm2 restart jntu-website` |
| Full redeploy | `bash deploy.sh` |
| Check what's using port 8081 | `lsof -i :8081` |

---

## Troubleshooting

**Server shows "errored"?**
```
pm2 logs jntu-website --lines 30
```

**502 Bad Gateway?**
→ Server isn't running. Run `bash deploy.sh`

**Images not showing?**
→ Upload images directly on VPS or SCP from local:
```
scp -r local-assets/uploads/ root@89.116.134.182:/var/www/JNTU-REDESIGN/local-assets/
```
