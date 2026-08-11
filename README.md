# JNTU-GV CEV Official Website
====================================================

> **Jawaharlal Nehru Technological University Gurajada Vizianagaram — College of Engineering Vizianagaram**  
> Comprehensive Modern Web Application, Content Management & AI Campus Assistant Platform.

---

## 1. Project Overview

The official web platform for **JNTU-GV College of Engineering Vizianagaram (JNTU-GV CEV)** is designed to deliver a modern, accessible, high-performance digital experience for students, faculty, researchers, recruiters, and administrative staff.

### Key Capabilities:
- **Full Academic & Institutional Coverage**: Interactive portals for all 8 Departments (CSE, ECE, EEE, MECH, MET, IT, BSH, MBA), Leadership, Faculty Directories, Examination Cell, R20/R23/R25 Regulations, Syllabi, Timetables, and Fee Structures.
- **R&D & Innovation Portal**: Detailed tracking for funded research projects, Ph.D. scholars, peer-reviewed publications, consultancy projects, and focus areas.
- **Placements & Career Center**: Real-time placement statistics, salary packages, top recruiter listings, placement highlights, and TPO portal.
- **Campus Facilities & Life**: Dedicated interfaces for Hostels, Central Library, Dispensary, Sports Complex, Union Bank & ATM, Guest House, Staff Quarters, WEC, EDC, NSS, and Student Clubs.
- **AI Campus Assistant (JNTU AI)**: Vector-embedded RAG Chatbot powered by PostgreSQL Vector search and BM25 hybrid term reranking for instant answers across the entire site.
- **Role-Based Management Portals**: Built-in `/admin` Dashboard for notices, leadership, faculty, departments, gallery, ticker notifications, and RAG chunk re-indexing.

---

## 2. Technology Stack

### Frontend & UI Architecture:
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing & SSR**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **Styling & Aesthetics**: Modern Vanilla CSS + TailwindCSS (v4) with custom glassmorphism design tokens, translucent backdrop filters, and HSL palettes.
- **Icons & Animations**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/), [DotLottie Web](https://dotlottie.io/)

### Backend & Database Infrastructure:
- **Server Runtime**: Node.js v20+ / v22+ SSR with TanStack `createServerFn`
- **Database**: PostgreSQL (Neon / Supabase / Self-Hosted PostgreSQL)
- **ORM & Schema**: [Drizzle ORM](https://orm.drizzle.team/)
- **Vector Search Engine**: PostgreSQL `pgvector` extension for 384-dimensional vector embeddings
- **Local AI Embedding Engine**: HuggingFace `@xenova/transformers` (`all-MiniLM-L6-v2`)

---

## 3. Installation & Local Development

### Prerequisites:
- **Node.js**: `v20.x` or `v22.x`
- **Package Manager**: `npm` (v10+)
- **Database**: PostgreSQL database instance with `pgvector` extension enabled.

### Setup Steps:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/Likhith32/JNTU-REDESIGN.git
   cd JNTU-REDESIGN
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and configure your credentials (see Section 4).

4. **Initialize Database Schema**:
   ```bash
   npx drizzle-kit push
   ```

5. **Seed & Ingest Vector RAG Chunks**:
   ```bash
   npx tsx scratch/run_ingest.ts
   ```

6. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   Access the web app at `http://localhost:8081` (or indicated port).

---

## 4. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Connection (PostgreSQL with pgvector support)
DATABASE_URL="postgres://postgres:your_password@localhost:5432/jntugv_db"

# Server Port
PORT=8081

# Node Environment
NODE_ENV="development"

# Admin Authentication Secret / Passcode
ADMIN_SECRET="your_admin_secret_key"
```

---

## 5. Database Architecture

The database is built on PostgreSQL using **Drizzle ORM** with **pgvector** vector search support.

### Key Schema Tables (`src/db/schema.ts`):
- `departments`: Branch details, intake seats, and HOD assignments.
- `academic_faculty` / `faculty`: Faculty profiles, designations, specializations, and emails.
- `leadership`: Principal, Vice Principal, VC, and administrative profiles.
- `notices`: Official circulars, notifications, and dates.
- `academic_regulations`, `academic_syllabus`, `academic_timetables`, `academic_calendars`, `academic_downloads`, `academic_fee_structure`: Academic resources and documents.
- `tpo`, `placement_highlights`, `placement_goals`, `major_recruiters`, `recruiters`, `students`: Placements database.
- `rd_projects`, `rd_scholars`, `rd_publications`, `rd_focus_areas`, `rd_consultancy`: Research & Development records.
- `rag_chunks`: Stores 384-dimensional vector embeddings and fulltext TSVector indexes for the AI Chatbot.

---

## 6. Static & Asset Files

All public static assets are located in `/public`:
- `/public/favicon.png`: Circular 256x256 web icon.
- `/public/favicon.ico`: 64x64 legacy favicon.
- `/public/favicon.svg`: Vector SVG favicon.
- `/public/logo-circle.png`: High-resolution circular JNTU-GV logo.
- `/public/CHATBOT.lottie`: DotLottie animation binary for JNTU AI avatar.
- `/public/sitemap.xml`: XML Sitemap for search engines.
- `/public/robots.txt`: Search crawler instructions.

---

## 7. Media & Upload Handling

Dynamic media files uploaded via Admin Panel or scripts are stored in `/public/assets` or cloud storage buckets:
- Dynamic uploads resolve via `uploadUrl()` helper in `src/lib/assets.ts`.
- Image compression and optimization are automatically handled during production builds via `vite-plugin-imagemin`.

---

## 8. Administrative Dashboard (/admin)

Authorized administrative personnel can manage site content by navigating to `/admin`:

### Administrative Features:
- **Notices Management**: Post, update, or remove circular notices.
- **Leadership & Faculty Directory**: Update Principal, HOD, and faculty profiles.
- **Department Controls**: Edit branch intake, description, and HOD contacts.
- **Campus Gallery**: Upload and curate high-resolution campus photos.
- **Notification Tickers**: Edit live announcements in top header ticker.
- **RAG Re-Indexer**: One-click database re-indexing to ensure JNTU AI answers reflect recent updates.

---

## 9. Production Deployment

### Option A: Vercel Deployment (Recommended)
1. Push repository to GitHub/GitLab.
2. Import project into Vercel Dashboard.
3. Set Framework Preset to **Vite** or **TanStack Start**.
4. Add `DATABASE_URL` and `ADMIN_SECRET` in Environment Variables.
5. Deploy. Build output will automatically utilize `.vercel/output`.

### Option B: Node.js Server Deployment (Self-Hosted VPS / Linux)
1. Build production bundle:
   ```bash
   npm run build
   ```
2. Start Nitro production web server:
   ```bash
   node .vercel/output/functions/__server.func/index.mjs
   ```
   Or use PM2 to manage process:
   ```bash
   pm2 start .vercel/output/functions/__server.func/index.mjs --name "jntu-website"
   ```

---

## 10. Database Backup & Restore

### Backup Database:
```bash
pg_dump -U postgres -h localhost -d jntugv_db -F c -b -v -f jntugv_backup.dump
```

### Restore Database:
```bash
pg_restore -U postgres -h localhost -d jntugv_db -v jntugv_backup.dump
```

---

## 11. Domain Configuration

1. In your DNS Provider (Cloudflare, GoDaddy, Namecheap), create the following records:
   - **A Record**: `@` → Points to Server IP Address or Vercel CNAME (`cname.vercel-dns.com`).
   - **CNAME Record**: `www` → `jntugvcev.edu.in`.

---

## 12. SSL / HTTPS Setup

If self-hosting on Nginx / Ubuntu server, issue a free SSL certificate via Certbot:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d jntugvcev.edu.in -d www.jntugvcev.edu.in
```

---

## 13. Updating Website Content

- **Via Admin Panel**: Navigate to `https://jntugvcev.edu.in/admin` to make instant content edits.
- **Via Database RAG Sync**: After inserting new database rows manually or via scripts, trigger re-ingestion:
  ```bash
  npx tsx scratch/run_ingest.ts
  ```

---

## 14. Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **500 Server Error on API / Functions** | Ensure `DATABASE_URL` is set in `.env` and PostgreSQL server is reachable. |
| **Vector Extension Error (`pgvector`)** | Run `CREATE EXTENSION IF NOT EXISTS vector;` in your PostgreSQL database query tool. |
| **Favicon not updating in browser** | Clear browser cache or force reload (`Ctrl + Shift + R`). |
| **Chatbot missing new notice data** | Run `npx tsx scratch/run_ingest.ts` to re-embed latest database records into `rag_chunks`. |

---

## 15. Contact & Developer Support

- **Institution**: JNTU-GV College of Engineering Vizianagaram  
- **Location**: Dwarapudi, Vizianagaram – 535003, Andhra Pradesh, India  
- **Official Website**: [https://jntugvcev.edu.in](https://jntugvcev.edu.in)  
- **Principal Email**: [principal@jntugvcev.edu.in](mailto:principal@jntugvcev.edu.in)  
- **Helpline Phone**: +91 8922 244 100  
