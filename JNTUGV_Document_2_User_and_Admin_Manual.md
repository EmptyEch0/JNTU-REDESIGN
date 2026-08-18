# JNTU-GV COLLEGE OF ENGINEERING VIZIANAGARAM
## WEBSITE USER, ADMINISTRATION & OPERATIONAL HANDOVER MANUAL
**Project Official URL**: `jntugvcev.edu.in` | **System Version**: 2.0 (Production Release)  
**Classification**: Institutional Operational Manual (For College Management, Administration, HODs, Faculty & Staff)  

---

## 1. Document Control & Institutional Information

| Attribute | Specification Details |
| :--- | :--- |
| **Project Title** | Official Website Redesign & Content Management System Manual |
| **Institution** | Jawaharlal Nehru Technological University Gurajada Vizianagaram — College of Engineering Vizianagaram (JNTU-GV CEV) |
| **Official Website URL** | `https://jntugvcev.edu.in` |
| **Manual Version** | Version 2.0 (Institutional Production Release) |
| **Handover Date** | August 2026 |
| **Project Guidance & Direction** | **Sri / Dr. W. Anil Sir** (Assistant Professor / Faculty Coordinator) |
| **Prepared By (Developers)** | • **Likhith Kumar Mankala** (Developer)<br>• **Ch Sai Rupini** (Developer)<br>• **P Anitha** (Developer)<br>• **P Sai Vamsi** (Developer) |
| **Intended Audience** | College Principal, Vice-Principal, Heads of Departments (HODs), Faculty Members, Administrative Staff, Section In-Charges, Content Editors |
| **Document Purpose** | Non-Technical Operational Guide & Administrative Manual (Zero Financial Data) |

---

## 2. Introduction & Purpose

This manual serves as the official, comprehensive non-technical guide for the newly redesigned institutional web portal of **JNTU-GV College of Engineering Vizianagaram (JNTU-GV CEV)** (`jntugvcev.edu.in`).

The redesigned website replaces outdated, static web pages with a vibrant, modern, mobile-friendly digital campus hub. It provides an intuitive interface for students, parents, faculty, researchers, recruiters, and the general public to access official academic resources, news, notifications, departmental achievements, and facilities.

This document guides college administrators, HODs, faculty members, and operational staff on how to navigate the portal, publish circulars, manage departmental web pages, update faculty profiles, and maintain digital campus information seamlessly without any programming knowledge.

---

## 3. Institutional Objectives & Key Benefits

1. **Centralized Information Hub**: Consolidates circulars, syllabi, academic regulations, examination timetables, fee structures, and campus life into one unified digital portal.
2. **Instant Notice Dissemination**: Replaces physical paper notice boards with real-time digital circulars and an emergency notification ticker.
3. **Department Autonomy with Governance**: Empowers Heads of Departments (HODs) to customize their department's web presence, laboratories, and achievements via an intuitive visual editor while maintaining institutional brand consistency.
4. **Enhanced Student & Recruiter Experience**: Offers students instant downloads of academic documents and gives top corporate recruiters a transparent view of placement records, student demographics, and college infrastructure.
5. **Interactive AI Campus Assistant**: Integrates the "JNTU AI" assistant to provide students and parents with instant answers to common questions regarding admissions, exam circulars, syllabus details, and contact directories.
6. **Showcase of Research & Facilities**: High-visibility digital representation for research projects, Ph.D. scholars, campus hostels, central digital library, health dispensary, and student clubs.

---

## 4. High-Level Website Architecture & Sitemap

```text
                                [ jntugvcev.edu.in ]
                                         │
 ┌──────────────┬──────────────┬─────────┴────┬──────────────┬──────────────┬──────────────┐
 │              │              │              │              │              │              │
 ▼              ▼              ▼              ▼              ▼              ▼              ▼
[HOME]       [ABOUT]      [ACADEMICS]   [DEPARTMENTS]   [PLACEMENTS]   [R&D CELL]   [CAMPUS LIFE]
• Banner     • History    • Regulations • 8 Branches    • Highlights   • Projects   • Hostels
• Ticker     • Leadership • Syllabi       - CSE, ECE,   • Recruiters   • Scholars   • Library
• VC/Prin.   • How to     • Timetables      EEE, MECH,  • Training     • Papers     • Dispensary
• Highlights   Reach      • Exam Cell       MET, IT,    • Statistics   • MoUs       • Sports
• News       • RTI/Anti-  • Downloads       BSH, MBA                                • Bank/ATM
  Feed         Ragging    • CAC                                                     • Guest House
                                                                                    • Clubs / NSS
```

---

## 5. Target Stakeholders & User Roles

| Stakeholder Group | Primary Needs & Use Cases on the Website |
| :--- | :--- |
| **Students & Scholars** | Download syllabus/regulations, check exam circulars, view timetables, access hostel/library guidelines, talk to JNTU AI. |
| **Faculty Members** | Maintain official faculty profiles, update research publications, list teaching subjects, access academic calendars. |
| **Heads of Departments (HODs)** | Manage department web pages, update laboratory profiles, highlight student/faculty achievements, customize sidebar tabs. |
| **College Management / Principal Office** | Publish official notices, update leadership messages, broadcast urgent ticker announcements, oversee IQAC reports. |
| **Corporate Recruiters & Industry** | Review placement statistics, discover department specializations, contact the Training & Placement Officer (TPO). |
| **Parents & General Public** | Check admission procedures, explore campus facilities (hostels, healthcare, sports, banking), access transport details. |

---

## 6. Feature Walkthrough by Portal & Module

### 6.1 Home Page & Emergency Notice Ticker
- **Header Banner**: Prominently displays the official university crest, title, national accreditation badges, and primary contact links.
- **Urgent Notification Ticker**: A live, scrolling marquee at the very top of the screen that highlights crucial updates (e.g., examination results, holiday announcements, emergency notices).
- **Hero Slider**: High-resolution campus photographs with quick-action buttons for Admissions, Examinations, and Placements.
- **Leadership Corner**: Formal messages and vision statements from the Vice-Chancellor and College Principal.
- **Fast Statistics Counter**: Live numbers highlighting total students, faculty strength, campus acreage (100+ acres), and placement success rate.

### 6.2 Academic Affairs Module (`/academics/*`)
- **Academic Regulations**: Complete digital repository of R20, R23, and R25 regulations for B.Tech, M.Tech, and MCA programs.
- **Syllabi & Curriculum**: Structured by branch, regulation, and semester with one-click PDF downloads.
- **Examination Cell**: Dedicated section for examination circulars, fee notifications, hall ticket schedules, and results links.
- **Academic Calendars & Downloads**: Downloadable official academic calendars, application forms, and certificate request formats.

### 6.3 8 Academic Department Hubs (`/departments/*`)
Dedicated portals for **CSE, ECE, EEE, MECH, MET, IT, BSH (Basic Sciences & Humanities), and MBA**:
- **Department Home**: Overview, Major recent events, Vision and mission
- **HOD Desk**: Message, biography, and direct office contact of the Head of the Department.
- **Laboratories**: Full list of department labs with major equipment, software tools, and faculty in-charge.
- **Courses & Programs**: Curriculum details for UG (B.Tech) and PG (M.Tech/MCA/MBA) programs.
- **Achievements**: Recognition of student project prizes, faculty research awards, patents, and gate ranks.
- **Faculty Directory**: Photo gallery of all professors and assistant professors with links to individual detailed profiles.

### 6.4 Placements & Career Center (`/placements/*`)
- **Placement Highlights**: Annual placement records, salary packages, and placement percentages.
- **Top Recruiters**: Logos and profiles of major hiring partners (TCS, Infosys, Wipro, Cognizant, Amazon, Accenture, Tech Mahindra).
- **Training & Development**: Campus Recruitment Training (CRT) programs, mock interviews, and coding bootcamps.
- **TPO Contact**: Direct contact details for the Training and Placement Officer.

### 6.5 Research & Development (R&D) Cell (`/rd-cell/*`)
- **Sponsored Research Projects**: Details of projects funded by DST, AICTE, UGC, SERB, and industry.
- **Ph.D. Scholars Directory**: Registered research scholars categorized by department and research supervisor.
- **Publications Showcase**: Peer-reviewed journal publications and conference proceedings.
- **Active MoUs**: Memorandums of Understanding with corporate and international research institutions.

### 6.6 Campus Facilities & Student Welfare (`/campus-life/*`)
- **Campus Hostels**: Boys and Girls hostel facilities, wardens roster, dining mess facilities, and 24/7 security info.
- **Central & Digital Library**: Established June 2008, 2,864 sq.m area, 45,000+ print volumes, IEEE Xplore/DELNET online subscriptions, working timings (09:00 AM – 06:00 PM).
- **University Dispensary & Healthcare**: Clinical consultation rooms, emergency beds, resident medical officer, 24/7 on-campus ambulance standby.
- **Sports & Athletics Complex**: 200m athletic ring, concrete floodlit basketball court, turf cricket pitch, soccer field, indoor sports hall (chess, carrom, table tennis), and multi-gymnasium.
- **Banking & ATM**: On-campus State Bank of India (SBI) branch and 24/7 ATM point.
- **Hospitality**: Fully-serviced staff quarters and executive guest house for visiting dignitaries.

### 6.7 Student Corner Units
- **National Service Scheme (NSS)**: Volunteer community outreach, annual 7-day residential village service camp schedule, blood donation camps.
- **Women Empowerment & Grievance Cell (WE&GC)**: Women safety, leadership workshops, self-defense training, annual *Yuthika* magazine.
- **Entrepreneurship Development Cell (EDC)**: Startup incubation, innovation challenges, EAC workshops.
- **Professional Society Chapters**: Active student branches of CSI, IEEE, IE(I), IETE, and IIM.
- **Industry-Institution Interaction Cell (IIPC)**: Student internships, industrial tours, and industry lectures.

### 6.8 AI Campus Assistant (JNTU AI)
- Floating digital assistant widget on the bottom-right corner of every page.
- Allows students and parents to type plain-language questions (e.g., *"What is the hostel fee procedure?"*, *"Who is the HOD of ECE?"*, *"When do mid exams start?"*).
- Delivers instant answers directly referencing official university circulars.

---

## 7. Website Navigation Guide

### 7.1 Desktop Navigation (MegaMenu)
The top navigation bar contains the main sections. Hovering over any item expands a multi-column visual MegaMenu:
- **Academics Dropdown**: Regulations, Syllabus, Timetables, Calendars, Exam Cell, CAC.
- **Departments Dropdown**: Direct links to all 8 departments (CSE, ECE, EEE, MECH, MET, IT, BSH, MBA).
- **Facilities Dropdown**: Hostels, Library, Dispensary, Sports, Banking, Amenities.
- **Student Corner Dropdown**: NSS, Women Empowerment, EDC, Professional Societies, Clubs.

### 7.2 Mobile Navigation Drawer
On smartphones and tablets, tap the **Menu (☰)** icon on the top-right corner to open the mobile navigation drawer. Tap any category to expand its sub-links.

### 7.3 Breadcrumb Trails
Every internal page displays a clickable breadcrumb path near the top (e.g., `Home > Departments > Computer Science > Laboratories`) allowing users to jump back up the page hierarchy with a single tap.

---

## 8. End-User How-To Guides (For Students & Public)

### 8.1 How to Find and Download an Exam Circular or Notice
1. Click **Notices** in the top navigation bar (or visit `/notices`).
2. Use the category filter buttons (**All**, **Academic**, **Examination**, **General**) or type in the search bar.
3. Locate the notice card and click **"Download Attachment (PDF)"** to view or save the official document.

### 8.2 How to Download B.Tech / M.Tech Syllabus & Regulations
1. Click **Academics** in the main menu and select **Regulations** or **Syllabus**.
2. Select your degree level (**UG / PG**), program (**B.Tech / M.Tech**), and regulation code (**R20 / R23 / R25**).
3. Choose your branch and semester.
4. Click **Download Syllabus PDF**.

### 8.3 How to Search for a Faculty Member
1. Click **Departments** and select the relevant department.
2. Click the **Faculty** tab on the department navigation bar.
3. Browse the faculty cards or click on any faculty member's name to view their complete profile, research areas, and contact email.

### 8.4 How to Use the JNTU AI Chatbot
1. Click the circular **Chatbot Icon** located in the bottom-right corner of the screen.
2. Type your question in the text box (e.g., *"Show me the library timings"* or *"Who is the Warden for Girls Hostel?"*).
3. Press **Enter** or tap **Send**. The AI assistant will provide the response along with source references.

---

## 9. Administrative Portals Overview

The JNTU-GV CEV platform features **three dedicated administrative access portals**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   JNTU-GV CEV ADMINISTRATIVE TIERS                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. SUPER ADMIN PORTAL (`/admin`)                                      │
│     • Used by: Central College Web Administration / Principal Office    │
│     • Manages: College-wide Notices, Top Ticker, Gallery, RAG Sync     │
│                                                                        │
│  2. DEPARTMENT HOD PORTAL (`/hod-login`)                               │
│     • Used by: Heads of 8 Academic Departments                         │
│     • Manages: HOD Message, Labs, Achievements, Custom Block Pages     │
│                                                                        │
│  3. FACULTY PORTAL (`/faculty-login`)                                  │
│     • Used by: Individual Teaching Faculty Members                     │
│     • Manages: Personal Bio, Research Publications, Profile Photo      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Security Reminder**: Passwords and login credentials are confidential institutional assets. Never share your password via email, SMS, or post it on public notice boards.

---

## 10. Step-by-Step Notice & Circular Publishing Guide (For Super Admin)

Authorized college administrators can publish circulars via the Super Admin Dashboard:

```text
[ Step 1: Login to `/admin` ]
             │
             ▼
[ Step 2: Navigate to "Notices Management" ]
             │
             ▼
[ Step 3: Click "+ Add New Notice" ]
             │
             ▼
[ Step 4: Fill Notice Title, Date (DD-MM-YYYY), & Category ]
             │
             ▼
[ Step 5: Upload Official Signed PDF Attachment ]
             │
             ▼
[ Step 6: Toggle "Urgent Announcement" (Optional) ]
             │
             ▼
[ Step 7: Click "Publish Notice" ]
             │
             ▼
[ Step 8: Notice appears instantly on `/notices` and Home Page ]
```

---

## 11. Step-by-Step Event & Campus Life Management Guide

### 11.1 Updating the Top Header Notice Ticker
1. Login to `/admin`.
2. Select **"Ticker Notifications"**.
3. Click **"Add Ticker Item"**.
4. Enter the **Badge Label** (e.g., `ADMISSIONS 2026`), the **Announcement Text**, and the optional **Target Link**.
5. Toggle **Urgent** if the item should display a red highlight.
6. Click **Save**. The live marquee updates immediately on all pages.

### 11.2 Adding Photos to the Campus Gallery
1. Login to `/admin` and click **"Campus Gallery"**.
2. Select the target album (e.g., *Campus Infrastructure*, *Convocation*, *Sports Day*, *Technical Symposia*).
3. Click **"Upload Photos"** and select optimized JPG/PNG images from your computer.
4. Add a short caption for each photograph.
5. Click **"Publish to Gallery"**.

---

## 12. Step-by-Step Department & HOD Content Management Guide

Heads of Departments can independently manage their department's online presence:

### 12.1 Logging in as HOD
1. Open your browser and visit: `https://jntugvcev.edu.in/hod-login`
2. Select your Department from the dropdown menu (e.g., *Mechanical Engineering*, *Computer Science & Engineering*).
3. Enter your assigned Department HOD Password and click **"Sign In"**.

### 12.2 Updating the HOD Message & Profile
1. In the HOD Console, click **"HOD Desk & Profile"**.
2. Update the HOD Message text in the editor.
3. Update official contact phone extension and email.
4. Upload a recent professional passport-style photograph.
5. Click **"Save Changes"**.

### 12.3 Managing Department Laboratories
1. Click **"Laboratories"** in the HOD menu.
2. To add a new lab, click **"+ Add Laboratory"**.
3. Enter Lab Name, Major Equipment List, and Experimental Software.
4. Upload a high-resolution photo of the laboratory.
5. Click **"Save Laboratory"**.

### 12.4 Managing Student & Faculty Achievements
1. Click **"Achievements"** in the HOD menu.
2. Click **"+ Add Achievement"**.
3. Enter Title, Year, Grade of Study (for e.g, M.Tech, B.Tech or UG, PG), Description of the Achievement.
4. Click **"Save Achievement"**.

### 12.5 Using the Visual Block Page Builder
The HOD portal includes a drag-and-drop Visual Page Builder allowing HODs to create custom departmental pages (e.g., *Specialized Workshops*, *Industry Projects*):
1. Click **"Custom Pages"** -> **"+ Create New Page"**.
2. Enter the Page Title and URL Slug.
3. Click **"+ Add Block"** and choose from:
   - **Rich Text Block**: Add formatted paragraphs and bullet points.
   - **Faculty Grid Block**: Displays all department faculty cards automatically.
   - **Document Table Block**: Create a table of downloadable PDF resources.
   - **Photo Gallery Block**: Display photos of department events.
4. Click **"Save as Draft"** to preview, or click **"Publish Page"** to make it live.

---

## 13. Step-by-Step Faculty Profile Management Guide

Individual faculty members can maintain their professional profiles:

### 13.1 Faculty Login Procedure
1. Visit: `https://jntugvcev.edu.in/faculty-login`
2. Enter your official institutional email (e.g., `name@jntugv.edu.in`) and password.
3. Click **"Sign In"**.

### 13.2 Faculty Updating Profile Info

1. **Personal Info**:
   - Name, Designation, and Photo
2. **Personal Overview**:
   - Edit Educational Qualifications
   - Area of Specialization
   - Experience
3. **Achievements**:
   - Awards Received
   - Fellowships
   - Professional Memberships
4. **Exchange & Sabbaticals**:
   - Faculty Exchanges
   - Sabbaticals (Faculty leaves)
5. **Consultancy Assignments**:
   - Project Title
   - Organization Partner
   - Status
6. **Professional Dev**:
   - FDPs & Workshops Completed
   - Conferences Attended

---

## 14. Step-by-Step Media & Document Management Guide

### 14.1 Recommended File Specifications
| Asset Type | Recommended Format | Maximum File Size | Ideal Dimensions / Quality |
| :--- | :--- | :--- | :--- |
| **Official Circulars & Forms** | PDF (`.pdf`) | 5 MB | Clean digital text PDF (avoid blurry mobile camera scans). |
| **Faculty & Leadership Photos**| JPG / PNG / WebP | 1 MB | Square aspect ratio (500 x 500 px), plain background. |
| **Gallery & Event Photos** | JPG / WebP | 3 MB | Landscape (1920 x 1080 px or 1280 x 720 px). |
| **Brochures & Curricula** | PDF (`.pdf`) | 10 MB | Multi-page optimized PDF document. |

### 14.2 File Naming Conventions
Always use clean, descriptive file names without spaces or special symbols:
- **Good**: `jntugv_btech_r23_cse_syllabus.pdf`, `circular_mid2_exams_aug2026.pdf`
- **Avoid**: `Scan_12345.pdf`, `IMG_20260815_WA0001.jpg`, `doc 1 (1).pdf`

---

## 15. Institutional Content Publishing Guidelines

1. **Official Tone & Clarity**: All published notices must maintain a formal, authoritative, and polite institutional tone.
2. **Date Format Standard**: Always write dates in the standard university format: `DD-MM-YYYY` (e.g., `15-08-2026`) or `15th August 2026`.
3. **No Duplicate Circulars**: Before posting a new notice, verify that the same circular was not previously published.
4. **Archiving Outdated Content**: Circulars older than 6 months should be marked as archived to keep active notice boards clear.
5. **Mandatory Sign-Off**: No academic or examination notice should be posted without formal authorization from the College Principal or Controller of Examinations.

---

## 16. Stakeholder Roles & RACI Responsibility Matrix

| Operational Task | College Management | Principal Office | HODs | Faculty | TPO / Cells | Web Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Publishing University Circulars** | I | A | C | I | I | **R** |
| **Top Ticker Emergency Updates** | I | A | I | I | I | **R** |
| **Department Web Pages & Labs** | I | I | **A / R** | C | I | I |
| **Faculty Profile Information** | I | I | C | **R** | I | I |
| **Placement Records & Stats** | I | I | I | I | **A / R** | C |
| **R&D Projects & Publications** | I | I | C | C | **A / R** | C |
| **Hostel & Facility Updates** | I | I | I | I | **A / R** | C |
| **AI Chatbot Knowledge Sync** | I | I | I | I | I | **A / R** |

*Legend: **R** = Responsible (Does the work), **A** = Accountable (Approves), **C** = Consulted, **I** = Informed.*

---

## 17. Content Approval & Publishing Workflow

```text
┌────────────────────────┐
│ 1. Content Preparation │ Faculty / Coordinator drafts notice or creates document.
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ 2. Section Head Review │ HOD / TPO / Warden verifies accuracy and attachments.
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ 3. Principal Approval  │ Formal approval / signature obtained for publication.
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ 4. Admin / HOD Publish │ Uploaded to `/admin` or `/hod-login` portal.
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ 5. Public Visibility   │ Live instantly on `jntugvcev.edu.in` and indexed in JNTU AI.
└────────────────────────┘
```

---

## 18. Institutional Guidelines on Terminology, Naming & Branding

- **Official College Name**: *JNTU-GV College of Engineering Vizianagaram* (Abbreviated: *JNTU-GV CEV*).
- **Parent University**: *Jawaharlal Nehru Technological University Gurajada Vizianagaram*.
- **Department Names**: Always use full formal names on official pages (*Department of Computer Science & Engineering*, *Department of Mechanical Engineering*, etc.).
- **Official Crest & Colors**: Use official Navy Blue (`#0f2b48`) and Gold accents. Do not stretch, distort, or recolor the university crest.

---

## 19. Frequently Asked Questions (FAQ)

### For Students & Parents
**Q1: How do I find out if college is closed due to weather or emergency?**  
A: Check the top emergency scrolling banner on the home page (`jntugvcev.edu.in`).

**Q2: Can I download old semester syllabi?**  
A: Yes. Navigate to **Academics > Syllabus** and choose your regulation (R20, R23, R25).

**Q3: How do I contact the hostel warden?**  
A: Go to **Campus Life > Hostels** to view the warden names and office contact numbers.

### For Faculty & HODs
**Q4: How do I reset my faculty password if I forget it?**  
A: Contact the College Web Administrator (`admin@jntugv.edu.in`) from your official institutional email to receive a password reset link.

**Q5: Can an HOD create a new sub-menu on their department page?**  
A: Yes. Login to `/hod-login`, open **"Sidebar Navigation Manager"**, and add or reorder items.

**Q6: Why is the AI chatbot not answering questions about a notice I just uploaded?**  
A: The AI assistant database is re-indexed periodically. You can ask the Web Administrator to trigger a one-click RAG sync.

---

## 20. Common Operational Troubleshooting (For Non-Technical Users)

| Issue | Probable Reason | Immediate Solution |
| :--- | :--- | :--- |
| **Page looks old / Changes not visible** | Browser cached old version | Perform a hard refresh: Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac). |
| **Cannot login to HOD Portal** | Incorrect password or wrong department selected | Ensure correct department is selected in dropdown. Passwords are case-sensitive. |
| **PDF document won't upload** | File size exceeds 15 MB limit | Compress the PDF using standard compression tools before uploading. |
| **Faculty photo appears sideways/stretched** | Image contains incorrect orientation metadata | Crop the photo to a square format (1:1 aspect ratio) in any basic image editor before uploading. |
| **Notice attachment gives 404 error** | PDF was not selected during notice creation | Edit the notice in `/admin` and re-attach the PDF file. |

---

## 21. Accessibility & Multi-Device Usage Guidelines

- **Desktop & Laptop**: Optimal resolution `1920x1080` or `1366x768`. Supports all modern browsers (Chrome, Edge, Firefox, Safari).
- **Smartphones**: Fully responsive on iOS and Android devices. Tap the top-right menu icon for full navigation.
- **Tablets**: Touch-enabled navigation and optimized reading view for academic regulations.
- **Font Readability**: Use high-contrast settings and browser zoom (`Ctrl + +`) without layout breakage.

---

## 22. Daily, Weekly & Monthly Operational Maintenance Schedule

```text
DAILY OPERATIONS (Web Administrator / Office Desk)
├── Check for urgent examination / administrative circulars to publish.
├── Update top ticker banner for immediate university announcements.
└── Verify website uptime and contact form inquiries.

WEEKLY OPERATIONS (Department HODs & Coordinators)
├── Update departmental achievements and laboratory notices.
├── Review and approve submitted faculty profile updates.
└── Clean up expired temporary notices.

MONTHLY OPERATIONS (College Management & IT Team)
├── Execute database backup dump.
├── Review placement statistics and recruiter additions with TPO.
├── Sync AI Chatbot knowledge base with new circulars.
└── Audit login activity logs for security compliance.
```

---

## 23. Support Escalation & Helpdesk Directory

If an administrative user or department encounters an issue that cannot be resolved via this manual, follow this escalation pathway:

```text
[ Step 1: Department Coordinator / Faculty ]
                     │
                     ▼
[ Step 2: Department HOD / Section In-Charge ]
                     │
                     ▼
[ Step 3: College Web Administrator (`admin@jntugv.edu.in`) ]
                     │
                     ▼
[ Step 4: Core Development & IT Engineering Team ]
```

### Institutional Contact Points
- **College Web Portal Desk**: `admin@jntugv.edu.in`
- **Principal's Office**: `principal@jntugvcev.edu.in` | Phone: +91 8922 244 100
- **Examination Cell**: `examcell@jntugvcev.edu.in`
- **Training & Placement Cell**: `tpo@jntugvcev.edu.in`

---

## 24. Operational Handover & Acceptance Checklist

- [x] Full operational manual delivered to College Management, Principal Office, and HODs.
- [x] Public portal navigation, emergency notification ticker, and academic search verified.
- [x] All 8 Academic Department portals verified with HOD login access.
- [x] Faculty profile editing workflows demonstrated and tested.
- [x] Campus facilities (Hostels, Library, Dispensary, Sports, Banking) verified.
- [x] Student Corner (NSS, Women Empowerment Cell, EDC, Professional Bodies) verified.
- [x] AI Campus Assistant (JNTU AI) verified for student question handling.
- [x] Operational maintenance schedule and escalation channels established.
- [x] Strictly zero financial data included in manual.

---

## 25. Conclusion & Forward Roadmap

The redesigned **JNTU-GV College of Engineering Vizianagaram** web platform provides a robust, state-of-the-art digital infrastructure for the university community. By adhering to the operational workflows and publishing guidelines outlined in this manual, the college administration, department heads, and faculty will maintain an accurate, vibrant, and prestigious web presence that serves scholars and stakeholders for years to come.

---
**Handover Certified & Presented by Development Team**:  
• *Likhith Kumar Mankala*  
• *Ch Sai Rupini*  
• *P Anitha*  
• *P Sai Vamsi*  

**Project Guidance & Academic Supervision**:  
• *Sri / Dr. W. Anil Sir* (Assistant Professor / Faculty Coordinator)  
**Institution**: Jawaharlal Nehru Technological University Gurajada Vizianagaram — College of Engineering Vizianagaram  
**Website**: `https://jntugvcev.edu.in`
