# VPS GitHub SSH Deploy Key Setup (Private Repository)

Use this guide to connect your private GitHub repository to your VPS. This allows `git pull` and `deploy.sh` to run securely without asking for passwords or personal tokens.

---

### Step 1: Generate an SSH Key on the VPS

1. SSH into your VPS:
   ```bash
   ssh root@89.116.134.182
   ```

2. Generate a dedicated deploy key (press **Enter** to accept default path and empty passphrase):
   ```bash
   ssh-keygen -t ed25519 -C "vps-jntu-deploy" -f ~/.ssh/id_ed25519 -N ""
   ```

3. Display and copy the public key output:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   *(The output will look like `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... vps-jntu-deploy`)*

---

### Step 2: Add the Deploy Key to GitHub

1. Open your repository on GitHub: [https://github.com/EmptyEch0/JNTU-REDESIGN](https://github.com/EmptyEch0/JNTU-REDESIGN)
2. Click **Settings** (tab at the top right of the repo).
3. In the left sidebar under *Security*, click **Deploy keys**.
4. Click the green **Add deploy key** button.
5. Fill in the fields:
   - **Title**: `VPS Production Server`
   - **Key**: Paste the public key string copied from Step 1.
   - *Leave "Allow write access" unchecked (read-only is safest).*
6. Click **Add key**.

---

### Step 3: Switch the VPS Git Remote to SSH

On your VPS SSH terminal, run:

```bash
cd /var/www/JNTU-REDESIGN
git remote set-url origin git@github.com:EmptyEch0/JNTU-REDESIGN.git
```

Test the connection:
```bash
git fetch origin
```

---

### Step 4: Make the Repository Private & Deploy

1. In GitHub Repository **Settings** $\rightarrow$ Scroll to **Danger Zone** $\rightarrow$ Click **Change visibility** $\rightarrow$ Select **Make private**.
2. On your VPS, run your normal deploy script:
   ```bash
   cd /var/www/JNTU-REDESIGN
   bash deploy.sh
   ```

`git pull origin main` and PM2 restarts will now work automatically without ever asking for authentication.
