"""
Content generator for Document 1: Technical System Handover & Maintenance Documentation
JNTU-GV College of Engineering Vizianagaram (jntugvcev.edu.in)
"""

def get_doc1_markdown():
    return """# JNTU-GV COLLEGE OF ENGINEERING VIZIANAGARAM
## TECHNICAL SYSTEM HANDOVER & MAINTENANCE DOCUMENTATION
**Project Official URL**: `jntugvcev.edu.in` | **System Version**: 2.0 (Production Release)  
**Classification**: Institutional Technical Documentation (Developer & IT Team Manual)  

---

## 1. Document Control & Metadata

| Attribute | Specification Details |
| :--- | :--- |
| **Project Name** | JNTU-GV CEV Official Institutional Web Portal & CMS Redesign |
| **Application Name** | JNTU-GV CEV Web Platform & AI Campus Assistant |
| **Institution / College** | Jawaharlal Nehru Technological University Gurajada Vizianagaram — College of Engineering Vizianagaram (JNTU-GV CEV) |
| **Official Domain / URL** | `https://jntugvcev.edu.in` (Staging IP: `http://89.116.134.182`) |
| **Software Version** | Version 2.0 (SSR + Dynamic Block CMS + Vector RAG Integration) |
| **Handover Date** | August 2026 |
| **Project Guidance & Direction** | **Sri / Dr. W. Anil Sir** (Assistant Professor / Faculty Coordinator) |
| **Development Team** | • **Likhith Kumar Mankala** (Developer)<br>• **Ch Sai Rupini** (Developer)<br>• **P Anitha** (Developer)<br>• **P Sai Vamsi** (Developer) |
| **Technical Support Contact** | `support@jntugvcev.edu.in` / `principal@jntugvcev.edu.in` |
| **Repository URL** | `https://github.com/Likhith32/JNTU-REDESIGN.git` |
| **Document Classification** | Strictly Confidential — Technical Handover (Zero Financial Data) |

### Document Revision History
| Version | Date | Authors | Primary Changes & Milestones |
| :--- | :--- | :--- | :--- |
| **1.0-alpha** | Nov 2025 | Dev Team | Initial React 19 + TanStack Router migration & static UI prototypes. |
| **1.5-beta** | Mar 2026 | Dev Team | PostgreSQL integration via Drizzle ORM, 99 database schemas, `/admin` portal. |
| **2.0-rc** | Jun 2026 | Dev Team | HuggingFace vector embedding RAG engine (`rag_chunks`), dynamic Department Block Builder. |
| **2.0-final** | Aug 2026 | Dev Team | Production release, full SSR hardening, security audit, and formal institutional handover. |

---

## 2. Project Overview & Scope

### 2.1 Purpose of the System
The redesigned official web portal of **JNTU-GV College of Engineering Vizianagaram (JNTU-GV CEV)** replaces legacy fragmented interfaces with a unified, high-performance, accessible, and secure digital platform. It centralizes all academic resources, departmental governance, research output, campus life management, placement tracking, and administrative workflows into a single institutional system.

### 2.2 Scope of the Platform
1. **Academic & Governance Portals**: Full cataloging of Academic Regulations (R20, R23, R25), Syllabi, Timetables, Academic Calendars, Exam Cell circulars, CAC records, IQAC reports, RTI, and Anti-Ragging documentation.
2. **8 Academic Department Hubs**: Dedicated interactive portals for CSE, ECE, EEE, MECH, MET, IT, BSH (Basic Sciences & Humanities), and MBA with dynamic lab profiles, course curricula, faculty listings, HOD desks, achievements, and gallery showcases.
3. **Placements & Career Center**: Comprehensive repository for placement statistics, salary packages, top tier-1 recruiter showcases, student success highlights, and TPO team governance.
4. **Research & Development (R&D) Cell**: Tracking of externally funded research projects, active Ph.D. scholars, peer-reviewed publications, industrial consultancy, and active institutional MoUs.
5. **Campus Facilities & Life**: Complete digital representations for Campus Hostels (Boys & Girls), Central & Digital Library (DELNET/IEEE access, 45,000+ volumes), Health Dispensary, Sports Complexes, State Bank of India Campus Branch & 24/7 ATM, Staff Quarters, and Guest House.
6. **Student Corner Units**: Dynamic platforms for National Service Scheme (NSS), Women Empowerment & Grievance Cell (WE&GC), Entrepreneurship Development Cell (EDC), Industry-Institution Interaction Cell (IIPC), and Professional Society Chapters (CSI, IEEE, IE, IETE, IIM).
7. **AI Campus Assistant (JNTU AI)**: In-house vector retrieval-augmented generation (RAG) assistant leveraging PostgreSQL `pgvector` and `@xenova/transformers` (`all-MiniLM-L6-v2`) for instant queries on college circulars, syllabus, regulations, and contacts.
8. **Multi-Tiered Content Management System (CMS)**: Super Admin Dashboard (`/admin`), Department HOD Visual CMS (`/hod-login`), and Faculty Profile Editor (`/faculty-login`).

---

## 3. System Architecture & High-Level Design

### 3.1 Architecture Diagram
```text
                       [ End Users: Students / Faculty / Admin / Public ]
                                              │
                                              ▼
                                 [ Modern Web Browser / Mobile ]
                                              │ (HTTPS / HTTP/2)
                                              ▼
                             [ Edge CDN / Vercel / Nginx Reverse Proxy ]
                                              │
                                              ▼
                      ┌─────────────────────────────────────────────────┐
                      │            TanStack Start SSR Engine            │
                      │ ─────────────────────────────────────────────── │
                      │  • React 19 Server & Client Components          │
                      │  • TanStack Router (File-based dynamic routing) │
                      │  • Glassmorphic Design System (Tailwind v4/CSS) │
                      │  • Client Cache & Optimistic UI Updates         │
                      └───────────────────────┬─────────────────────────┘
                                              │
                     Server Functions (`createServerFn` / RPC Layer)
                                              │
                                              ▼
                      ┌─────────────────────────────────────────────────┐
                      │             Node.js Backend Services            │
                      │ ─────────────────────────────────────────────── │
                      │  • Authentication (SuperAdmin / HOD / Faculty)  │
                      │  • Department Visual CMS & Block Engine         │
                      │  • Dynamic File Uploads (`/api.upload.ts`)      │
                      │  • Local Transformer Pipeline (`all-MiniLM-L6`) │
                      │  • Audit Logging & Session Management           │
                      └───────────────────────┬─────────────────────────┘
                                              │
                                   Drizzle ORM Query Layer
                                              │
                                              ▼
                      ┌─────────────────────────────────────────────────┐
                      │              PostgreSQL Database                │
                      │ ─────────────────────────────────────────────── │
                      │  • 99 Relational Tables (ACID Compliant)        │
                      │  • `pgvector` Extension (384-dim Vector Chunks) │
                      │  • TSVector Full-Text Search Indexes            │
                      │  • Secure Bcrypt Hashes & RBAC Permissions      │
                      └─────────────────────────────────────────────────┘
```

### 3.2 Key Architectural Pillars
- **Server-Side Rendering (SSR)**: Zero-lag first paint with full search engine indexing via TanStack Start.
- **Isomorphic Type-Safe RPCs**: Backend logic is authored with `createServerFn` providing compile-time type safety across client and server.
- **Embedded AI RAG**: Vector chunks with cosine distance matching eliminate hallucination and provide direct citation of college circulars.
- **Local Dynamic Media Engine**: Uploads are processed, validated by MIME type, and routed through dedicated asset controllers.

---

## 4. Technology Stack Matrix

| Layer | Technology | Version | Purpose & Implementation |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.0` | Core declarative user interface library utilizing concurrent rendering. |
| **Frontend DOM** | React DOM | `^19.2.0` | React renderer for the web browser. |
| **Application Framework** | TanStack Start | `^1.167.14` | Full-stack SSR framework providing server functions and hydration. |
| **Routing Engine** | TanStack Router | `^1.168.0` | 100% type-safe, file-based routing architecture with nested routes. |
| **Build Tool & Bundler** | Vite | `^7.3.1` | Ultra-fast development server and optimized rollup production bundler. |
| **Styling & Design System** | TailwindCSS | `^4.2.1` | Utility-first CSS framework supplemented with custom glassmorphic tokens. |
| **Icons & Visuals** | Lucide React | `^0.575.0` | Comprehensive institutional icon library. |
| **Animation Engine** | Framer Motion | `^12.38.0` | Micro-interactions, slide transitions, and scroll animations. |
| **Lottie Animations** | DotLottie React | `^0.19.4` | Vector animations for the AI Chatbot avatar and loading indicators. |
| **UI Component Primitives** | Radix UI | Latest (`^1.1` - `^2.2`) | Accessible primitives for dialogs, dropdowns, tooltips, accordions, tabs. |
| **Database Engine** | PostgreSQL | `15+` / `16+` | Enterprise relational database with ACID compliance. |
| **ORM / Data Mapper** | Drizzle ORM | `^0.45.2` | High-performance TypeScript ORM with schema migrations. |
| **Database Migrations** | Drizzle Kit | `^0.31.10` | Database schema push and migration manager. |
| **Database Driver** | Postgres.js | `^3.4.9` | Fastest full-featured PostgreSQL client for Node.js. |
| **Vector Search Extension** | `pgvector` | `0.5.0+` | 384-dimensional dense vector embeddings in PostgreSQL. |
| **Local AI Embeddings** | `@xenova/transformers`| `^2.17.2` | Hugging Face Transformers ONNX runtime running `all-MiniLM-L6-v2`. |
| **Password Security** | BcryptJS | `^3.0.3` | Salted SHA-512 password hashing with 10 salt rounds. |
| **Form Management** | React Hook Form & Zod | `^7.71` / `^3.25` | Schema validation and high-performance uncontrolled forms. |
| **Date & Time Utilities** | Date-Fns | `^4.1.0` | Modern, immutable date formatting for academic circulars. |
| **Runtime & Execution** | Node.js / Bun | `Node v20+` / `Bun 1.3+` | Asynchronous JavaScript/TypeScript execution runtime. |
| **Package Manager** | Bun / NPM | `Bun 1.3.12` / `NPM 10+` | High-speed dependency management and script execution. |

---

## 5. Development Environment Setup & Tooling

### 5.1 System Prerequisites
- **Operating System**: Windows 10/11, Ubuntu 22.04+ LTS, or macOS Sonoma+.
- **Node.js Runtime**: Version `20.12.0` LTS or `22.x` (or Bun `1.3.12+`).
- **PostgreSQL Database**: PostgreSQL 15 or 16 with `pgvector` extension installed.
- **Git Version Control**: Git `2.40+`.

### 5.2 Step-by-Step Installation Procedure

```bash
# Step 1: Clone the institutional repository
git clone https://github.com/Likhith32/JNTU-REDESIGN.git
cd JNTU-REDESIGN

# Step 2: Install project dependencies
npm install
# (Alternative: bun install)

# Step 3: Configure Environment Variables
# Copy the template and edit with actual credentials
cp .env.example .env
```

### 5.3 Environment Configuration (`.env`)
```env
# Database Connection URL (PostgreSQL instance with pgvector support)
DATABASE_URL="postgres://postgres:your_secure_password@localhost:5432/jntugv_db"

# Web Server Port
PORT=8081

# Node Runtime Environment
NODE_ENV="development"

# Super Admin Secret Key
ADMIN_SECRET="institutional_admin_secret_passcode"
```

### 5.4 Database Initialization & Seeding
```bash
# Step 4: Enable pgvector in PostgreSQL (Run in psql console)
# CREATE EXTENSION IF NOT EXISTS vector;

# Step 5: Push Drizzle schemas to PostgreSQL database
npx drizzle-kit push

# Step 6: Seed initial database tables and credentials
npx tsx src/db/seed.ts
npx tsx src/db/seed-hod-passwords.ts
npx tsx src/db/seedFacultyPasswords.ts

# Step 7: Ingest and generate vector embeddings for JNTU AI RAG
npx tsx scratch/run_ingest.ts

# Step 8: Start the local development server
npm run dev
# The application will be accessible at http://localhost:8081
```

---

## 6. Project & Repository File Structure

```text
JNTU-REDESIGN/
├── .env                              # Environment variable configuration (Ignored in Git)
├── .env.example                      # Template for environment configuration
├── drizzle.config.ts                 # Drizzle Kit ORM migration configuration
├── package.json                      # Project dependencies, scripts, and metadata
├── tsconfig.json                     # TypeScript compiler configuration
├── vercel.json                       # Vercel deployment and routing rules
├── vite.config.ts                    # Vite bundler, TanStack plugins, and asset config
│
├── public/                           # Static assets served at root
│   ├── CHATBOT.lottie                # DotLottie vector animation for JNTU AI
│   ├── favicon.ico / favicon.png     # Official university favicon files
│   ├── logo-circle.png               # High-resolution circular JNTU-GV crest
│   ├── robots.txt                    # Search crawler indexation rules
│   └── sitemap.xml                   # XML sitemap for SEO discovery
│
├── local-assets/                     # Dynamic media storage directory
│   └── uploads/                      # Admin & HOD uploaded images, PDFs, brochures
│
├── scratch/                          # Operational scripts and testing utilities
│   ├── run_ingest.ts                 # Script to re-index database records into pgvector
│   └── inspect_schema.py             # Database inspection utility
│
├── scripts/                          # Build and documentation generation scripts
│   └── generate_handover_docs.py     # Institutional documentation compiler
│
└── src/                              # Core Application Source Code
    ├── router.tsx                    # TanStack Router instance & global provider setup
    ├── routeTree.gen.ts              # Automatically generated type-safe route tree
    ├── styles.css                    # Global CSS variables, glassmorphism tokens, Tailwind
    │
    ├── assets/                       # Bundled static images and iconography
    │
    ├── auth/                         # Authentication & RBAC Layer
    │   ├── auth.repository.ts        # Database queries for admin & user authentication
    │   ├── auth.server.ts            # Server functions for Super Admin & Faculty login
    │   ├── auth.service.ts           # Bcrypt hashing, token validation, audit logging
    │   └── hodAuth.server.ts         # Scoped authentication logic for Department HODs
    │
    ├── components/                   # Reusable UI & Layout Components
    │   ├── HeaderBanner.tsx          # University header with official seal and contact bar
    │   ├── MegaMenu.tsx              # Full multi-level institutional desktop navigation
    │   ├── NoticeTicker.tsx          # Emergency notification ticker bar
    │   ├── Footer.tsx                # Universal footer with quick links, contacts, credits
    │   ├── PageHero.tsx              # Reusable page banner with breadcrumbs
    │   ├── Breadcrumbs.tsx           # Accessible hierarchical path navigation
    │   ├── SubNav.tsx                # Horizontal secondary section navigation
    │   ├── VerticalSubNav.tsx        # Vertical secondary section navigation
    │   ├── LocalSubNav.tsx           # Contextual internal page sub-navigation
    │   ├── Chatbot.tsx               # Floating JNTU AI RAG assistant modal
    │   ├── AdminEditPanel.tsx        # Floating live-edit panel for authorized admins
    │   │
    │   ├── academics/                # Academic module-specific components
    │   │   ├── AcademicTabs.tsx      # Regulations, syllabus, timetable tab switcher
    │   │   └── RegulationCard.tsx    # Regulation download card component
    │   │
    │   ├── cms/                      # Department Visual Page Builder components
    │   │   ├── BlockRenderer.tsx     # Dynamic renderer for JSON layout blocks
    │   │   ├── VisualPageBuilder.tsx # Drag-and-drop page editor for HODs
    │   │   ├── MediaLibraryModal.tsx # Upload modal for images and documents
    │   │   └── SidebarManagerModal.tsx# Custom navigation sidebar manager
    │   │
    │   └── ui/                       # Atomic Radix UI styled primitives
    │       ├── button.tsx, dialog.tsx, dropdown-menu.tsx, tabs.tsx, table.tsx ...
    │
    ├── db/                           # Database Schema & Connection Layer
    │   ├── index.ts                  # PostgreSQL connection pool & Drizzle ORM client
    │   ├── schema.ts                 # 99 complete table schemas with types & relations
    │   ├── seed.ts                   # Initial data seeding for departments, leadership
    │   ├── seed-hod-passwords.ts     # Initial password seeding for 8 HOD accounts
    │   └── seedFacultyPasswords.ts   # Initial password seeding for 91 Faculty accounts
    │
    ├── funcs/                        # Server Functions (`createServerFn` / RPCs)
    │   ├── department-cms.server.ts  # HOD CMS CRUD, page blocks, versioning, navigation
    │   ├── site.server.ts            # Public notices, ticker, leadership, gallery RPCs
    │   ├── ingest.server.ts          # Vector RAG embedding & similarity search engine
    │   ├── hostel.server.ts          # Hostel residential data and warden RPCs
    │   ├── library.server.ts         # Digital library collections and timings RPCs
    │   ├── dispensary.server.ts      # Health center staff and emergency RPCs
    │   ├── sports.server.ts          # Physical education arenas and equipment RPCs
    │   ├── nss.ts                    # NSS activities, special camp, gallery RPCs
    │   ├── we.ts                     # Women Empowerment Cell committee and magazine RPCs
    │   ├── rd.ts                     # R&D projects, scholars, publications, MoUs RPCs
    │   └── students.ts               # Placements student records and statistics RPCs
    │
    ├── lib/                          # Core Utilities & Helpers
    │   ├── db.ts                     # Direct SQL tagged-template connection wrapper
    │   ├── assets.ts                 # Asset URL resolution (`uploadUrl()`)
    │   ├── server-cache.ts           # In-memory LRU cache for high-frequency RPCs
    │   └── utils.ts                  # Tailwind class merge (`cn()`) helper
    │
    └── routes/                       # File-Based Application Routes (85+ Routes)
        ├── __root.tsx                # Universal HTML document root & error boundaries
        ├── index.tsx                 # Official Home Page
        ├── notices.tsx               # Centralized Notifications & Circulars Portal
        ├── contact.tsx               # Institutional Contacts & Location Directory
        ├── anti-ragging.tsx          # Anti-Ragging Committee & Policies
        ├── rti.tsx                   # Right to Information (RTI) Cell Directory
        │
        ├── about.*.tsx               # Institution, Vision-Mission, How-to-Reach, Norms
        ├── academics.*.tsx           # Regulations, Syllabus, Timetables, Exam Cell, CAC
        ├── administration.*.tsx      # Principal, Vice-Principal, Office, IQAC Portal
        ├── departments.*.tsx         # 8 Department Portals, Labs, Faculty, Gallery, HOD
        ├── placements.*.tsx          # Placement Highlights, Recruiters, Statistics, TPO
        ├── rd-cell.*.tsx             # R&D About, Areas, Projects, Scholars, Publications
        ├── campus-life.*.tsx         # Hostels, Dispensary, Library, Sports, Bank, Clubs
        ├── nss.*.tsx                 # NSS Units, Activities, 7-Day Special Camp
        ├── women-empowerment.*.tsx   # WE&GC Activities, Committee, Yuthika Magazine
        ├── admin.index.tsx           # Super Admin Portal Dashboard (`/admin`)
        ├── hod-login.tsx             # Centralized Department HOD Login (`/hod-login`)
        ├── faculty-login.tsx         # Faculty Profile Management Portal (`/faculty-login`)
        └── api.upload.ts             # Secure Multipart File Upload Controller
```

---

## 7. Modules & Applications Breakdown

### 7.1 Core Public Web Portal
The primary entry point (`/`) presents the institutional identity, emergency notification ticker, vice-chancellor/principal messages, quick statistics counter, featured announcements, latest news carousel, and department access cards.

### 7.2 Academic Affairs Portal (`/academics/*`)
Houses the official academic repository:
- **Regulations**: Complete curriculum regulations (R20, R23, R25) for B.Tech, M.Tech, and MCA.
- **Syllabi & Timetables**: Categorized down to semester and branch with PDF download capabilities.
- **Examination Cell**: Circulars, hall ticket releases, revaluation notifications, and fee schedules.
- **College Academic Council (CAC)**: Committee members and resolutions.

### 7.3 Department Portals (`/departments/$id/*`)
Supports the 8 academic departments (`cse`, `ece`, `eee`, `mech`, `met`, `it`, `sh`, `mba`) through a structured hierarchy:
1. `/departments/$id` — Department Home, Mission, Vision, and Intake.
2. `/departments/$id/labs` — Laboratory equipment, lab manuals, and faculty in-charge.
3. `/departments/$id/hod` — HOD Desk, leadership message, and administrative contact.
4. `/departments/$id/gallery` — Department workshops, symposia, and lab photo gallery.
5. `/departments/$id/courses` — Undergraduate & Postgraduate programs offered.
6. `/departments/$id/achievements` — Student and faculty awards, gate ranks, patents.
7. `/departments/$id/faculty/` — Faculty directory with designations and qualifications.
8. `/departments/$id/faculty/$facultyId` — In-depth profile with research, publications, and teaching subjects.

### 7.4 Placements & Training Center (`/placements/*`)
- **Placement Highlights**: Year-wise placement records, package statistics, and major recruitment milestones.
- **Major Recruiters**: Tier-1 recruiters (TCS, Infosys, Wipro, Cognizant, Amazon, Accenture, Tech Mahindra).
- **Training & Development**: Soft skills, competitive coding, and placement cell contact directory.

### 7.5 Research & Development Cell (`/rd-cell/*`)
- **Funded Projects**: Government (DST, AICTE, UGC, SERB) and industry-sponsored projects.
- **Research Scholars**: Active and awarded Ph.D. scholars categorized by supervisor and department.
- **Publications Repository**: Indexed international journal and conference papers.
- **Institutional MoUs**: Active collaborations with academic and corporate institutions.

### 7.6 Campus Facilities & Student Welfare
1. **Campus Hostels (`/campus-life/hostels`)**: Housing facilities for Boys and Girls, wardens roster, mess facilities, and 24/7 security.
2. **Central & Digital Library (`/campus-life/library`)**: Established 2008, 2,864 sq.m area, 45,000+ volumes, IEEE/DELNET subscriptions, digital search catalog.
3. **Dispensary & Healthcare (`/campus-life/dispensary`)**: Campus clinical facilities, emergency ward, resident medical officer, 24/7 ambulance dispatch.
4. **Sports & Athletics (`/campus-life/sports`)**: 200m track, concrete basketball court with floodlights, turf cricket ground, badminton, gymnasium.
5. **Banking & ATM (`/campus-life/banking`)**: State Bank of India (SBI) on-campus branch and 24/7 ATM kiosk.
6. **Hospitality (`/campus-life/other-amenities`)**: Guest house VIP suites and residential staff quarters.

### 7.7 Student Corner Units
- **National Service Scheme (NSS)**: Community outreach, annual 7-day residential village service camp, blood donation drives.
- **Women Empowerment & Grievance Cell (WE&GC)**: Gender sensitization, student safety, annual *Yuthika* magazine.
- **Entrepreneurship Development Cell (EDC)**: Startup incubation, awareness camps, industry guest lectures.
- **Professional Societies**: Student branches of CSI, IEEE, IE(I), IETE, and IIM.
- **Industry-Institution Interaction Cell (IIPC)**: Student internships, industrial tours, and industry lectures.

### 7.8 AI Campus Assistant (JNTU AI)
- Floating widget accessible from any page.
- Direct vector similarity matching against `rag_chunks` database table.
- Provides immediate answers with references to circulars, syllabus, regulations, and contacts without external API latency.

---

## 8. Database Architecture & ER Design

### 8.1 Database Engine & Configuration
- **Engine**: PostgreSQL 15 / 16 (Drizzle ORM abstraction).
- **Extensions**: `pgvector` (Vector database extension for embeddings).
- **Connection Strategy**: Pooled connections via `postgres` driver with automatic reconnection and SSL verification in production.

### 8.2 Entity Relationship Conceptual Diagram
```text
┌────────────────────────┐         1:N          ┌────────────────────────┐
│      departments       │─────────────────────<│        faculty         │
│ ────────────────────── │                      │ ────────────────────── │
│ id (PK)                │                      │ id (PK)                │
│ name, slug, code       │                      │ dept_id (FK), name     │
│ intake, hod_password   │                      │ designation, email     │
└───────────┬────────────┘                      └────────────────────────┘
            │ 1:N
            ├──────────────────────────────────<┌────────────────────────┐
            │ 1:N                               │      laboratories      │
            ├──────────────────────────────────<│      achievements      │
            │ 1:N                               │        courses         │
            ├──────────────────────────────────<│   department_gallery   │
            │ 1:N                               └────────────────────────┘
            ├──────────────────────────────────<┌────────────────────────┐
            │                                   │  department_nav_items  │
            │ 1:N                               └────────────────────────┘
            └──────────────────────────────────<┌────────────────────────┐
                                                │    department_pages    │
                                                │ ────────────────────── │
                                                │ id (PK), dept_slug     │
                                                │ draft_blocks (JSONB)   │
                                                │ published_blocks(JSONB)│
                                                └───────────┬────────────┘
                                                            │ 1:N
                                                            ▼
                                                ┌────────────────────────┐
                                                │department_page_versions│
                                                └────────────────────────┘

┌────────────────────────┐         1:N          ┌────────────────────────┐
│         admins         │─────────────────────<│     admin_sessions     │
│ ────────────────────── │                      │ ────────────────────── │
│ admin_id (PK, UUID)    │                      │ id (PK, Token)         │
│ email, password_hash   │                      │ admin_id (FK, UUID)    │
│ role, authorized_depts │                      │ expires_at, ip_address │
└───────────┬────────────┘                      └────────────────────────┘
            │ 1:N
            ▼
┌────────────────────────┐
│    admin_audit_logs    │
│ ────────────────────── │
│ id (PK), admin_id (FK) │
│ action, details, ip    │
└────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                               rag_chunks                               │
│ ────────────────────────────────────────────────────────────────────── │
│ id (PK, Serial)                                                        │
│ source_type (text), source_id (text), title (text), content (text)     │
│ embedding (vector(384)) ───> HNSW / IVFFlat Cosine Similarity Index    │
│ tsv (tsvector)          ───> GIN Index for BM25 Keyword Hybrid Search  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Exhaustive Database Tables & Data Dictionary

The JNTU-GV CEV platform includes **99 PostgreSQL relational tables**. The complete data dictionary for core functional groups is detailed below:

### 9.1 Authentication & System Administration
#### 1. `admins` (Administrator Accounts)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `admin_id` | `uuid` | NO | `gen_random_uuid()` | Primary Key. Unique identifier for the administrator. |
| `name` | `text` | NO | — | Full name of the administrative user. |
| `email` | `text` | NO | — | Unique institutional email address (Login identity). |
| `password_hash`| `text` | NO | — | Salted Bcrypt SHA-512 password hash. |
| `role` | `text` | NO | `'super_admin'` | Access role (`'super_admin'`, `'editor'`, `'hod'`). |
| `auth_provider`| `text` | NO | `'email'` | Provider (`'email'`, `'google'`). |
| `authorized_depts`| `jsonb`| YES | `'[]'` | JSON array of department slugs user is authorized to edit. |
| `created_at` | `timestamp`| NO | `now()` | Timestamp of account creation. |

#### 2. `admin_sessions` (Active Administrator Sessions)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `text` | NO | — | Primary Key. Cryptographically secure session token. |
| `admin_id` | `uuid` | NO | — | Foreign Key referencing `admins.admin_id`. |
| `expires_at` | `timestamp`| NO | — | Session expiration timestamp (7-day rolling window). |
| `created_at` | `timestamp`| NO | `now()` | Session creation timestamp. |
| `ip_address` | `text` | YES | — | Client IP address at authentication time. |
| `user_agent` | `text` | YES | — | Browser user agent string. |

#### 3. `admin_audit_logs` (System Security & Audit Trail)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `admin_id` | `uuid` | YES | — | Foreign Key referencing `admins.admin_id`. |
| `action` | `text` | NO | — | Action tag (`'LOGIN_SUCCESS'`, `'UPDATE_NOTICE'`, `'PAGE_PUBLISH'`). |
| `ip_address` | `text` | YES | — | Originating IP address. |
| `user_agent` | `text` | YES | — | Originating browser client. |
| `details` | `text` | YES | — | Verbose description or JSON change payload. |
| `created_at` | `timestamp`| NO | `now()` | Audit event timestamp. |

### 9.2 Academic Departments & Faculty
#### 4. `departments` (Academic Branches)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `name` | `text` | NO | — | Full department name (e.g., "Computer Science & Engineering"). |
| `slug` | `text` | NO | — | Unique URL slug (`'cse'`, `'ece'`, `'eee'`, `'mech'`, `'met'`, `'it'`, `'sh'`, `'mba'`). |
| `code` | `text` | NO | — | Official department code (e.g., "05", "04"). |
| `description` | `text` | YES | — | Comprehensive department profile. |
| `intake` | `integer` | YES | `60` | Annual sanctioned student intake. |
| `established` | `integer` | YES | `2007` | Year department was established. |
| `hod_name` | `text` | YES | — | Current Head of Department name. |
| `hod_email` | `text` | YES | — | HOD institutional contact email. |
| `hod_phone` | `text` | YES | — | HOD office contact telephone. |
| `hod_message` | `text` | YES | — | Formal message from the HOD Desk. |
| `hod_photo` | `text` | YES | — | URL path to HOD portrait photograph. |
| `hod_password` | `text` | YES | — | Bcrypt hash for department HOD portal authentication. |
| `vision` | `text` | YES | — | Departmental vision statement. |
| `mission` | `text` | YES | — | Departmental mission points. |

#### 5. `faculty` (Department Faculty Profiles)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `dept_id` | `integer` | YES | — | Foreign Key referencing `departments.id`. |
| `name` | `text` | NO | — | Full name and title of faculty member. |
| `designation` | `text` | NO | — | Academic title (Professor, Associate Professor, Asst. Professor). |
| `qualification`| `text` | YES | — | Highest degrees earned (e.g., "Ph.D., M.Tech"). |
| `specialization`|`text` | YES | — | Research domain specialization. |
| `email` | `text` | YES | — | Official institutional email address. |
| `phone` | `text` | YES | — | Office extension or contact number. |
| `photo_url` | `text` | YES | — | URL path to faculty portrait image. |
| `experience` | `text` | YES | — | Years of teaching / research experience. |
| `bio` | `text` | YES | — | Professional biography and research summary. |
| `publications` | `text` | YES | — | Overview or count of published papers. |
| `password_hash`| `text` | YES | — | Bcrypt hash for individual faculty login. |

#### 6. `laboratories` (Department Laboratories)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `dept_id` | `integer` | YES | — | Foreign Key referencing `departments.id`. |
| `name` | `text` | NO | — | Name of the laboratory facility. |
| `description` | `text` | YES | — | Lab objective, major equipment, and experimental scope. |
| `faculty_incharge`|`text`| YES | — | Faculty coordinator assigned to lab. |
| `technician` | `text` | YES | — | Technical supporting staff name. |
| `image_url` | `text` | YES | — | Photograph of laboratory setup. |

#### 7. `achievements` (Department Accolades)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `dept_id` | `integer` | YES | — | Foreign Key referencing `departments.id`. |
| `title` | `text` | NO | — | Achievement title. |
| `description` | `text` | YES | — | Detailed explanation of honor or prize. |
| `category` | `text` | YES | `'Student'` | Category (`'Student'`, `'Faculty'`, `'Department'`). |
| `year` | `integer` | YES | — | Academic year achieved. |
| `image_url` | `text` | YES | — | Certificate or award photograph. |

### 9.3 Dynamic Department CMS & Versioning
#### 8. `department_pages` (Custom Pages & Block Layouts)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `dept_slug` | `text` | NO | — | Target department slug. |
| `title` | `text` | NO | — | Page title displayed in header and navigation. |
| `slug` | `text` | NO | — | URL path slug within department (Unique per department). |
| `page_type` | `text` | NO | `'standard'` | Template type (`'standard'`, `'faculty'`, `'labs'`, `'custom'`). |
| `status` | `text` | NO | `'draft'` | Publication status (`'published'`, `'draft'`). |
| `draft_blocks` | `jsonb` | YES | `'[]'` | JSON array of unpublished page layout blocks. |
| `published_blocks`|`jsonb`| YES | `'[]'` | JSON array of live published layout blocks. |
| `updated_at` | `timestamp`| NO | `now()` | Timestamp of last modification. |

#### 9. `department_nav_items` (Custom Department Navigation Hierarchy)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `dept_slug` | `text` | NO | — | Associated department slug. |
| `title` | `text` | NO | — | Display label on sidebar. |
| `slug` | `text` | NO | — | Target route slug. |
| `icon` | `text` | YES | `'BookOpen'` | Lucide icon identifier. |
| `position` | `integer` | NO | `0` | Numerical sorting index. |
| `parent_id` | `integer` | YES | `null` | Self-referencing Foreign Key for nested sub-menus. |
| `show_in_sidebar`|`boolean`| NO | `true` | Visibility toggle. |
| `status` | `text` | NO | `'published'` | Visibility state. |

### 9.4 Institutional Announcements & Academic Resources
#### 10. `notices` (Circulars & Notifications)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `title` | `text` | NO | — | Notice headline / title. |
| `category` | `text` | NO | `'General'` | Category (`'Academic'`, `'Examination'`, `'Admission'`, `'General'`). |
| `date` | `text` | NO | — | Notice publication date (`DD-MM-YYYY`). |
| `content` | `text` | YES | — | Body text or summary. |
| `file_url` | `text` | YES | — | URL path to official PDF document. |
| `urgent` | `boolean` | YES | `false` | Highlight toggle for critical notices. |
| `archived` | `boolean` | YES | `false` | Archive toggle. |

#### 11. `ticker_notifications` (Top Header Live Ticker)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `label` | `text` | NO | — | Badge label (e.g., "ADMISSIONS 2026", "RESULTS"). |
| `text` | `text` | NO | — | Scrolling announcement headline text. |
| `to` | `text` | YES | — | Hyperlink target URL when clicked. |
| `urgent` | `boolean` | YES | `false` | Red flash animation toggle for emergency announcements. |
| `created_at` | `timestamp`| NO | `now()` | Creation timestamp. |

#### 12. `academic_regulations` (B.Tech / M.Tech Regulations)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `level` | `text` | NO | — | Degree level (`'UG'`, `'PG'`). |
| `program_name` | `text` | NO | — | Program (`'B.Tech'`, `'M.Tech'`, `'MCA'`). |
| `regulation` | `text` | NO | — | Regulation code (`'R20'`, `'R23'`, `'R25'`). |
| `title` | `text` | NO | — | Document title (e.g., "Academic Regulations R23 for B.Tech"). |
| `pdf_url` | `text` | NO | — | Secure path to official curriculum PDF. |

### 9.5 AI Campus Assistant (Vector RAG)
#### 13. `rag_chunks` (Vector Embedding Knowledge Base)
| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | NO | Auto | Primary Key. |
| `source_type` | `text` | NO | — | Originating table (`'notices'`, `'regulations'`, `'faculty'`). |
| `source_id` | `text` | NO | — | Identifier in originating table. |
| `title` | `text` | NO | — | Semantic title of indexed knowledge chunk. |
| `content` | `text` | NO | — | Normalized plain text payload used for LLM synthesis. |
| `embedding` | `vector(384)`| NO | — | 384-dimensional dense vector embedding (`all-MiniLM-L6-v2`). |
| `tsv` | `tsvector` | YES | — | Full-text search token vector for BM25 hybrid ranking. |
| `created_at` | `timestamp`| NO | `now()` | Timestamp of embedding calculation. |

*(Note: Data dictionary continues across all 99 tables including `rd_projects`, `tpo`, `nss_activities`, `library_content`, `hostel_content`, `sports_content`, `we_activities`, and `dispensary_content`.)*

---

## 10. API & Server Functions (`createServerFn`) Reference

The backend operates on type-safe server functions (`createServerFn`) executed over RPC:

### 10.1 Authentication Functions
```typescript
// Location: src/auth/auth.server.ts
POST loginWithEmail({ email, password })
- Description: Authenticates Super Admin via Bcrypt comparison against admins table.
- Input: { email: string, password: string }
- Response: { adminId: string, name: string, email: string, role: string }
- Sets Cookie: admin_session_token (HTTP-Only, Secure, 7 days)

GET getCurrentAdmin()
- Description: Validates session token and returns active administrator context.
- Response: AdminSessionContext | null

POST logoutAdmin()
- Description: Invalidates active session in admin_sessions and clears cookie.
- Response: { success: true }
```

### 10.2 HOD Department Authentication
```typescript
// Location: src/auth/hodAuth.server.ts
POST changeHodCredentials({ currentPassword, newPassword })
- Description: Verifies existing department password and updates to new Bcrypt hash.
- Input: { currentPassword: string, newPassword: string (min 12 chars, upper/lower/digit/symbol) }
- Response: { success: true }
```

### 10.3 Department CMS Server Functions
```typescript
// Location: src/funcs/department-cms.server.ts
GET getDepartmentPage({ deptSlug, pageSlug })
- Description: Fetches published or draft page blocks for a department route.
- Response: DepartmentPageData

POST saveDepartmentPageDraft({ deptSlug, pageSlug, blocks, title })
- Description: Saves modified layout blocks into draft_blocks.
- Response: { success: true, pageId: number }

POST publishDepartmentPage({ deptSlug, pageSlug })
- Description: Copies draft_blocks into published_blocks and creates a version entry.
- Response: { success: true, versionNumber: number }

GET getDepartmentNav({ deptSlug })
- Description: Retrieves ordered sidebar navigation hierarchy for a department.
- Response: DepartmentNavItem[]

POST saveDepartmentNav({ deptSlug, items })
- Description: Persists reordered and updated navigation tree for a department.
- Response: { success: true }
```

### 10.4 AI Campus Assistant (RAG Search)
```typescript
// Location: src/funcs/ingest.server.ts
POST queryCampusAI({ query, topK = 5 })
- Description: Generates query vector embedding locally and computes cosine distance in pgvector.
- SQL: SELECT id, title, content, 1 - (embedding <=> $1) AS similarity FROM rag_chunks ORDER BY similarity DESC LIMIT $2;
- Response: { answer: string, sources: Array<{ title: string, source_type: string }> }
```

### 10.5 Media Upload API Endpoint
```typescript
// Location: src/routes/api.upload.ts
POST /api/upload
- Description: Handles multipart/form-data image and PDF uploads.
- Constraints: Max File Size: 15MB. Allowed: image/jpeg, image/png, image/webp, application/pdf.
- Storage: Writes to /local-assets/uploads/[timestamp]-[hash].[ext]
- Response: { success: true, url: "/local-assets/uploads/filename.webp" }
```

---

## 11. URL & Routing Structure

The application features **85+ distinct routes** organized into logical namespaces:

| Route Path | File Location | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `src/routes/index.tsx` | Public | Main Institutional Landing Page. |
| `/notices` | `src/routes/notices.tsx` | Public | University Circulars, Notifications & Archive. |
| `/contact` | `src/routes/contact.tsx` | Public | Institutional Phone Directory & Address. |
| `/anti-ragging` | `src/routes/anti-ragging.tsx` | Public | Anti-Ragging Policies, Committee & Helplines. |
| `/rti` | `src/routes/rti.tsx` | Public | Right to Information Act Officers & Rules. |
| `/about/institution`| `src/routes/about.institution.tsx` | Public | College History, Campus Profile & Accreditation. |
| `/about/vision-mission`|`src/routes/about.vision-mission.tsx`| Public | University Vision, Mission & Core Values. |
| `/about/how-to-reach`|`src/routes/about.how-to-reach.tsx` | Public | Transport, Roadways, Railway Stations & Maps. |
| `/academics/cac` | `src/routes/academics.cac.tsx` | Public | College Academic Council Composition & Minutes. |
| `/administration/principal`|`src/routes/administration.principal.tsx`| Public | Principal Profile & Official Address. |
| `/administration/iqac`|`src/routes/administration.iqac.index.tsx`| Public | Internal Quality Assurance Cell Overview. |
| `/administration/iqac/aqar`|`src/routes/administration.iqac.aqar.tsx`| Public | Annual Quality Assurance Reports. |
| `/departments/` | `src/routes/departments.index.tsx` | Public | 8 Academic Departments Directory. |
| `/departments/$id` | `src/routes/departments.$id.index.tsx` | Public | Department Home Page (`$id` = `cse`, `ece`, etc.). |
| `/departments/$id/labs`|`src/routes/departments.$id.labs.tsx`| Public | Department Laboratories & Equipment. |
| `/departments/$id/hod`|`src/routes/departments.$id.hod.tsx` | Public | HOD Desk & Leadership Message. |
| `/departments/$id/gallery`|`src/routes/departments.$id.gallery.tsx`| Public | Department Photo Showcase. |
| `/departments/$id/courses`|`src/routes/departments.$id.courses.tsx`| Public | Courses Offered & Program Outcomes. |
| `/departments/$id/achievements`|`src/routes/departments.$id.achievements.tsx`| Public | Student & Faculty Honors. |
| `/departments/$id/faculty/`|`src/routes/departments.$id.faculty/index.tsx`| Public | Department Faculty Roster. |
| `/departments/$id/faculty/$facultyId`|`src/routes/departments.$id.faculty/$id.tsx`| Public | Detailed Faculty Profile. |
| `/placements` | `src/routes/placements.index.tsx` | Public | Placement Highlights & Statistics. |
| `/placements/recruiters`|`src/routes/placements.recruiters.tsx`| Public | Tier-1 Recruiters & Corporate Partners. |
| `/placements/training`|`src/routes/placements.training.tsx` | Public | Training Programs & CRT Schedules. |
| `/rd-cell` | `src/routes/rd-cell.index.tsx` | Public | Research & Development Overview. |
| `/rd-cell/projects` | `src/routes/rd-cell.projects.tsx` | Public | Externally Sponsored Research Projects. |
| `/rd-cell/scholars` | `src/routes/rd-cell.scholars.tsx` | Public | Ph.D. Scholars Registry. |
| `/rd-cell/publications`|`src/routes/rd-cell.publications.tsx`| Public | International Journal & Conference Papers. |
| `/campus-life/hostels`|`src/routes/hostels.tsx` | Public | Boys & Girls Hostels & Wardens Roster. |
| `/campus-life/library`|`src/routes/library.tsx` | Public | Central & Digital Library Catalog. |
| `/campus-life/dispensary`|`src/routes/dispensary.index.tsx`| Public | Health Center & Emergency Healthcare. |
| `/campus-life/sports` | `src/routes/sports.tsx` | Public | Athletic Grounds, Courts & Gymnasium. |
| `/campus-life/banking`|`src/routes/banking.tsx` | Public | State Bank of India Branch & ATM. |
| `/nss` | `src/routes/nss.index.tsx` | Public | National Service Scheme Activities. |
| `/nss/special-camp` | `src/routes/nss.special-camp.tsx` | Public | 7-Day Residential Village Special Camp. |
| `/women-empowerment`|`src/routes/women-empowerment.index.tsx`| Public | WE&GC Cell, Programs & Objectives. |
| `/women-empowerment/magazine`|`src/routes/women-empowerment.magazine.tsx`| Public | *Yuthika* Annual Women's Magazine. |
| `/edc` | `src/routes/edc.tsx` | Public | Entrepreneurship Cell & Startup Hub. |
| `/professional-bodies`|`src/routes/professional-bodies.tsx`| Public | CSI, IEEE, IE, IETE, IIM Student Chapters. |
| `/iipc` | `src/routes/iipc.tsx` | Public | Industry-Institution Interaction Cell. |
| `/admin` | `src/routes/admin.index.tsx` | Protected | Super Admin Dashboard (Notices, Ticker, RAG). |
| `/hod-login` | `src/routes/hod-login.tsx` | Protected | Department HOD Visual CMS & Block Editor. |
| `/faculty-login` | `src/routes/faculty-login.tsx` | Protected | Individual Faculty Profile Editor. |

---

## 12. Backend Architecture

### 12.1 Server-Side Execution Flow
1. **Request Ingestion**: Requests arrive at the Node.js server via HTTP/2.
2. **SSR Page Rendering**: TanStack Start initializes the router, parses dynamic params (`$id`, `$facultyId`), fetches required server functions, executes DB queries in parallel, and returns hydrated HTML.
3. **RPC Handling**: When client invokes a `createServerFn`, TanStack automatically sends a serialized POST request to `/_server/` endpoint, validating inputs via Zod before DB execution.
4. **Connection Pooling**: Postgres.js client maintains an active connection pool with automatic health checks and parameterized queries preventing SQL injection.

---

## 13. Frontend Architecture

### 13.1 Component Hierarchy
```text
__root.tsx (Root HTML Document, Global Styles, Head Metadata, Toaster)
 ├── HeaderBanner (University Title, Circular Crest, Emergency Contacts)
 ├── NoticeTicker (Live Marquee for Urgent Circulars)
 ├── MegaMenu (Desktop Cascading Navigation / Mobile Responsive Drawer)
 ├── PageProgressBar (Top-loaded navigation loading bar)
 ├── [ Dynamic Route Component (e.g., Department Home / Hostels / Placements) ]
 │    ├── PageHero (Standardized Header Banner with Breadcrumbs)
 │    ├── LocalSubNav / VerticalSubNav (Section-specific tab switcher)
 │    └── BlockRenderer (Dynamic CMS JSON block builder)
 ├── Chatbot (Persistent Floating JNTU AI RAG Assistant)
 ├── AdminEditPanel (Floating quick-edit widget for logged-in admins)
 └── Footer (University Address, Map, Accreditation, Quick Links, Credits)
```

### 13.2 Design System & Aesthetics
- **Color Tokens**: Primary Navy (`#0f2b48`), Accent Gold (`#d97706`), Surface Translucent Glass (`rgba(255,255,255,0.85)`), Dark Slate Ink (`#0f172a`).
- **Glassmorphism**: Micro-blur backdrops (`backdrop-blur-md`) with crisp sub-pixel border highlights (`1px solid rgba(255,255,255,0.2)`).
- **Responsive Viewports**: Tested across Mobile (375px+), Tablet (768px+), Desktop (1280px+), and 4K Displays.

---

## 14. Authentication & Role-Based Access Control (RBAC)

### 14.1 RBAC Matrix
| Role | Identity Table | Login URL | Access Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admins` | `/admin` | Unrestricted global access: Notices, Tickers, Leadership, Gallery, RAG Re-indexing, System Logs. |
| **Department HOD**| `departments` | `/hod-login` | Scoped to assigned department slug: HOD message, Labs, Achievements, Gallery, Sidebar Nav, Block Pages. |
| **Faculty Member**| `faculty` | `/faculty-login` | Scoped to individual profile: Bio, Publications, Qualifications, Contact, Profile Avatar. |
| **Public Visitor**| None | Public Routes | Read-only access to all published institutional content. |

### 14.2 Session Security Implementation
- **Password Hashes**: Hashed using `bcryptjs` with 10 salt rounds.
- **Session Tokens**: 256-bit cryptographically secure strings stored in `admin_sessions`.
- **Cookie Security**: Flags `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` (7 days).

---

## 15. Admin & CMS Architecture

### 15.1 Super Admin Dashboard (`/admin`)
- **Notices Management**: Post, categorize, upload PDF attachments, and archive university circulars.
- **Ticker Management**: Add urgent scrolling banners with hyperlink targets.
- **Campus Gallery**: Upload and curate high-resolution photographs into categorized albums.
- **RAG Vector Synchronizer**: One-click execution of `ingest.server.ts` to re-embed modified circulars into `rag_chunks`.

### 15.2 Department Visual Page Builder
- HODs construct custom pages using structured UI blocks:
  1. `HeroBlock`: Full-width banner with background image and call-to-action.
  2. `RichTextBlock`: WYSIWYG formatted text with headings and lists.
  3. `FacultyGridBlock`: Auto-rendered grid of department faculty cards.
  4. `LabShowcaseBlock`: Grid of laboratory facilities with equipment lists.
  5. `DocumentTableBlock`: Downloadable list of PDF circulars and syllabus files.
  6. `GalleryGridBlock`: High-resolution photo masonry layout.
  7. `AccordionBlock`: Collapsible FAQ or syllabus modules.

---

## 16. File & Media Management

### 16.1 Storage Directories
- **Static Assets**: Stored in `/public` (Logos, favicons, Lottie animations).
- **Uploaded Media**: Processed via `/api.upload.ts` and stored in `/local-assets/uploads/`.

### 16.2 Upload Constraints & Validation
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `application/pdf`.
- **Maximum File Size**: 15 Megabytes per upload.
- **Optimization**: Automated conversion and compression via `vite-plugin-imagemin` for production builds.

---

## 17. Security Architecture & Threat Mitigation

| Threat Vector | Mitigation Strategy & Implementation |
| :--- | :--- |
| **SQL Injection** | 100% Parameterized queries via Drizzle ORM and Postgres.js tagged template literals. No raw string interpolation. |
| **Cross-Site Scripting (XSS)** | React automatic output encoding + sanitization of rich-text HTML via DOMPurify before rendering. |
| **Cross-Site Request Forgery (CSRF)**| SameSite Lax / Strict cookies combined with custom header validation on all POST RPCs. |
| **Brute Force Attacks** | Bcrypt work factor 10 + automatic IP audit logging in `admin_audit_logs`. |
| **Data Leakage** | All credentials, database connection strings, and secret keys reside strictly in server environment variables. Zero credentials in client bundles. |

---

## 18. Deployment Architecture

### 18.1 Deployment Options
#### Option A: Vercel Cloud Serverless Deployment (Configured)
1. Commit code to GitHub repository (`Likhith32/JNTU-REDESIGN`).
2. Link repository in Vercel Dashboard.
3. Inject Environment Variables (`DATABASE_URL`, `ADMIN_SECRET`, `NODE_ENV`).
4. Vercel utilizes `vercel.json` to build SSR output via `@cloudflare/vite-plugin` / TanStack Nitro.

#### Option B: Self-Hosted Linux VPS (Ubuntu 22.04 LTS / Node.js + PM2 + Nginx)
```bash
# Build the production bundle
npm run build

# Start process using PM2 process manager
pm2 start .vercel/output/functions/__server.func/index.mjs --name "jntugv-web"
pm2 save
pm2 startup
```

### 18.2 Nginx Reverse Proxy Configuration
```nginx
server {
    listen 80;
    server_name jntugvcev.edu.in www.jntugvcev.edu.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name jntugvcev.edu.in www.jntugvcev.edu.in;

    ssl_certificate /etc/letsencrypt/live/jntugvcev.edu.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jntugvcev.edu.in/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 19. Backup & Disaster Recovery

### 19.1 Automated PostgreSQL Database Backup
```bash
# Full compressed PostgreSQL backup command
pg_dump -U postgres -h localhost -d jntugv_db -F c -b -v -f /var/backups/jntugv_db_$(date +%Y%m%d_%H%M%S).dump

# Restoration command in disaster scenario
pg_restore -U postgres -h localhost -d jntugv_db -v -c /var/backups/jntugv_db_YYYYMMDD_HHMMSS.dump
```

### 19.2 Backup Schedule Recommendation
- **Database Dump**: Daily at 02:00 AM (Retain last 30 daily backups).
- **Uploaded Media (`/local-assets/uploads/`)**: Weekly incremental rsync backup to secondary storage server.
- **Git Source Code**: Mirrored to institutional GitHub/GitLab repository.

---

## 20. Logging & Monitoring

- **Application Logs**: Console output captured via PM2 / Vercel Runtime Logs.
- **Security Audit Logs**: Stored persistently in PostgreSQL `admin_audit_logs` table (Tracks IP, user agent, timestamp, action type).
- **Database Metrics**: Monitored via PostgreSQL active connection counts and query execution times.

---

## 21. Testing & Quality Assurance

- **Static Type Checking**: `npx tsc --noEmit` validates all TypeScript types across routes and components.
- **Linting & Code Style**: `npm run lint` executes ESLint rules and Prettier formatting checks.
- **Responsive Viewport Testing**: Validated across Chrome DevTools responsive presets (Mobile, Tablet, Desktop).
- **Cross-Browser Verification**: Tested on Google Chrome 120+, Microsoft Edge 120+, Mozilla Firefox 122+, Apple Safari 17+.

---

## 22. Known Issues, Technical Debt & Limitations

1. **pgvector Cold-Start Latency**: Initial vector model download (`@xenova/transformers`) requires ~25MB ONNX model caching on server first run. Subsequent queries execute in <20ms.
2. **Dynamic Upload Directory in Ephemeral Serverless**: When hosting on stateless serverless platforms (like Vercel), uploaded media in `/local-assets/uploads` should be mapped to an S3-compatible bucket (e.g., Cloudflare R2 / AWS S3) for permanent object retention.
3. **Browser PDF In-Line Previews**: Mobile Safari forces download of large PDF circulars instead of inline rendering.

---

## 23. Maintenance & Developer Operations Manual

### 23.1 How to Add a New Academic Department
1. Insert new row in `departments` table via `src/db/schema.ts` or psql (`slug`, `name`, `code`, `intake`).
2. Generate initial HOD password hash using Bcrypt and save in `hod_password`.
3. Add department slug to MegaMenu and Department Index lists in `src/components/MegaMenu.tsx`.

### 23.2 How to Re-Index AI Chatbot Knowledge Base
```bash
# Run the local RAG ingestion worker
npx tsx scratch/run_ingest.ts
# This reads all notices, regulations, and departmental data, computes 384-dim embeddings, and updates rag_chunks.
```

### 23.3 How to Add a New CMS Block Type
1. Define TypeScript block interface in `src/funcs/department-cms.server.ts`.
2. Add block renderer component in `src/components/cms/BlockRenderer.tsx`.
3. Register block editor controls in `src/components/cms/VisualPageBuilder.tsx`.

---

## 24. Developer Troubleshooting Matrix

| Problem / Symptom | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| `500 Internal Server Error` on API call | Database connection string missing or database unreachable | Verify `DATABASE_URL` in `.env` and verify PostgreSQL service is running (`sudo systemctl status postgresql`). |
| `ERROR: type "vector" does not exist` | `pgvector` extension not activated in database | Execute `CREATE EXTENSION IF NOT EXISTS vector;` in PostgreSQL database. |
| Chatbot returns outdated or empty responses | New circulars not yet ingested into vector table | Run `npx tsx scratch/run_ingest.ts` to refresh `rag_chunks` embeddings. |
| HOD Login fails with "Not Authenticated" | Missing or expired `hod_session_dept` cookie | Clear browser cookies, re-enter department credentials at `/hod-login`. |
| Image upload fails with `413 Payload Too Large` | Upload exceeds 15MB limit or Nginx proxy limit | Adjust `client_max_body_size 20M;` in `nginx.conf`. |

---

## 25. Technical Handover Sign-Off Checklist

- [x] Complete source code delivered and verified on `main` branch.
- [x] All 99 PostgreSQL database tables mapped, seeded, and verified.
- [x] Vector embedding pipeline (`pgvector` + `@xenova/transformers`) active and tested.
- [x] Super Admin (`/admin`), HOD (`/hod-login`), and Faculty (`/faculty-login`) portals operational.
- [x] All 85+ public and dynamic department routes verified without broken links.
- [x] Security policies (Bcrypt password hashing, SQL injection prevention, RBAC) validated.
- [x] File upload pipeline with MIME type verification tested.
- [x] Backup and restore scripts tested and documented.
- [x] Strictly zero financial data included in documentation.

---
**Handover Completed & Certified by Developers**:  
• *Likhith Kumar Mankala*  
• *Ch Sai Rupini*  
• *P Anitha*  
• *P Sai Vamsi*  

**Project Guidance & Academic Supervision**:  
• *Sri / Dr. W. Anil Sir* (Faculty Coordinator / Assistant Professor)  
**Institution**: Jawaharlal Nehru Technological University Gurajada Vizianagaram — College of Engineering Vizianagaram  
**Website**: `https://jntugvcev.edu.in`
"""
