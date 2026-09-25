import { createFileRoute, Link } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import {
  Compass,
  GraduationCap,
  Building2,
  Briefcase,
  Layers,
  FlaskConical,
  Users,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Mail,
  Search,
} from "lucide-react";
import { useState, useMemo } from "react";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — JNTU-GV College of Engineering Vizianagaram" },
      {
        name: "description",
        content:
          "Complete site index and hierarchical directory of all pages, academic branches, facilities, administration, and student resources across JNTU-GV CEV.",
      },
      { property: "og:title", content: "Sitemap — JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Explore every section and resource of the JNTU-GV CEV portal.",
      },
    ],
  }),
  component: SitemapPage,
});

interface SitemapSection {
  title: string;
  description: string;
  icon: any;
  color: string;
  links: {
    label: string;
    to: string;
    desc?: string;
    isExternal?: boolean;
    badge?: string;
  }[];
}

const SITEMAP_DATA: SitemapSection[] = [
  {
    title: "About & Administration",
    description: "Institutional background, leadership, governance, and quality assurance cells.",
    icon: Building2,
    color: "from-blue-600 to-indigo-700",
    links: [
      { label: "About Institution", to: "/about/institution", desc: "History, campus size, and legacy since 2007" },
      { label: "Vision & Mission", to: "/about/vision-mission", desc: "Guiding purpose and core values" },
      { label: "Norms & UGC Recognition", to: "/about/norms", desc: "UGC 2(f) & 12(B) compliance status" },
      { label: "Principal's Desk", to: "/administration/principal", desc: "Executive leadership & profile" },
      { label: "Vice Principal", to: "/administration/vice-principal", desc: "Academic administration & duties" },
      { label: "Principal's Office", to: "/administration/principals-office", desc: "Administrative staff & functions" },
      { label: "IQAC Quality Cell", to: "/administration/iqac", desc: "Internal Quality Assurance Cell overview" },
      { label: "IQAC Composition", to: "/administration/iqac/composition", desc: "Committee members & hierarchy" },
      { label: "IQAC Meetings", to: "/administration/iqac/meetings", desc: "Minutes & action taken reports" },
      { label: "AQAR Reports", to: "/administration/iqac/aqar", desc: "Annual Quality Assurance Reports" },
      { label: "IQAC MOUs", to: "/administration/iqac/mous", desc: "Strategic institutional agreements" },
      { label: "Airport Connectivity", to: "/about/airport-connectivity", desc: "Proximity to Bhogapuram Intl Airport" },
      { label: "About Vizianagaram", to: "/about/vizianagaram", desc: "City heritage and culture" },
      { label: "How to Reach", to: "/about/how-to-reach", desc: "Campus directions, road and train routes" },
    ],
  },
  {
    title: "Academics & Curricula",
    description: "Undergraduate, postgraduate programs, syllabus regulations, examinations and schedules.",
    icon: GraduationCap,
    color: "from-sky-600 to-cyan-700",
    links: [
      { label: "Academics Overview", to: "/academics", desc: "Academic structure and degrees overview" },
      { label: "Programs Offered", to: "/academics/programs", desc: "B.Tech, M.Tech, MCA, MBA & Ph.D details" },
      { label: "Admissions", to: "/academics/admissions", desc: "EAPCET, ECET, PGECET & ICET intakes" },
      { label: "Academic Regulations", to: "/academics/regulations", desc: "R20, R23 and credit frameworks" },
      { label: "Course Syllabus", to: "/academics/syllabus", desc: "Curriculum PDFs branch-wise and year-wise" },
      { label: "Academic Calendar", to: "/academics/academic-calendar", desc: "Semester dates, instruction periods and exams" },
      { label: "Examination Cell", to: "/academics/examination", desc: "Results, circulars, fees and exam timetables" },
      { label: "Faculty Directory", to: "/academics/faculty", desc: "Faculty profiles across all engineering wings" },
      { label: "Scholarships & Fee Support", to: "/academics/scholarships", desc: "JVD, national merit and state welfare schemes" },
      { label: "College Academic Committee (CAC)", to: "/academics/cac", desc: "Academic council rules and members" },
      { label: "Class Time Tables", to: "/academics/timetables", desc: "Current semester section timetables" },
      { label: "Academic Downloads", to: "/academics/downloads", desc: "Official forms, leave requests and certificates" },
    ],
  },
  {
    title: "Academic Departments",
    description: "9 specialized departments offering core and emerging engineering & management degrees.",
    icon: Layers,
    color: "from-violet-600 to-purple-700",
    links: [
      { label: "Computer Science & Engineering (CSE)", to: "/departments/cse", desc: "AI, ML, Software Systems & Data Labs", badge: "B.Tech & M.Tech" },
      { label: "Electronics & Communication (ECE)", to: "/departments/ece", desc: "VLSI, Embedded Systems, Signal Processing", badge: "B.Tech & M.Tech" },
      { label: "Electrical & Electronics (EEE)", to: "/departments/eee", desc: "Power Systems, Control & Electric Mobility", badge: "B.Tech & M.Tech" },
      { label: "Mechanical Engineering (MECH)", to: "/departments/mech", desc: "Robotics, Thermal, Design & CAD/CAM", badge: "B.Tech & M.Tech" },
      { label: "Civil Engineering (CIVIL)", to: "/departments/civil", desc: "Structural, Geotechnical & Environmental", badge: "B.Tech & M.Tech" },
      { label: "Information Technology (IT)", to: "/departments/it", desc: "Cloud, Networks & Cybersecurity", badge: "B.Tech" },
      { label: "Metallurgical Engineering (MET)", to: "/departments/met", desc: "Materials Science, Processing & Nano Alloys", badge: "B.Tech" },
      { label: "Master of Business Administration (MBA)", to: "/departments/mba", desc: "Finance, HR, Marketing & Operations", badge: "PG" },
      { label: "Basic Sciences & Humanities (BS&HSS)", to: "/departments/bshss", desc: "Physics, Chemistry, Maths & Humanities", badge: "Foundation" },
      { label: "All Departments Directory", to: "/departments", desc: "Department comparison and overview" },
    ],
  },
  {
    title: "Training & Placements",
    description: "Career development, corporate drives, recruiter partnerships and placement metrics.",
    icon: Briefcase,
    color: "from-emerald-600 to-teal-700",
    links: [
      { label: "Placements Overview", to: "/placements", desc: "Key salary packages and annual drive highlights" },
      { label: "Training & Placement Cell", to: "/placements/training", desc: "TPO message, training roadmap and CRT modules" },
      { label: "Major Recruiters", to: "/placements/recruiters", desc: "40+ visiting MNCs and top employers" },
      { label: "Placed Students Directory", to: "/placements/students", desc: "Searchable batch-wise student placement lists" },
      { label: "Placement Drive Gallery", to: "/placements/gallery", desc: "Campus recruitment events and felicitations" },
    ],
  },
  {
    title: "Research & Development (R&D)",
    description: "Innovation hub, sponsored projects, faculty publications, patents and doctoral scholars.",
    icon: FlaskConical,
    color: "from-amber-600 to-orange-700",
    links: [
      { label: "R&D Cell Overview", to: "/rd-cell", desc: "Research framework and state-of-the-art facilities" },
      { label: "About Research & Committee", to: "/rd-cell/about", desc: "R&D Coordinator and advisory council" },
      { label: "Research Focus Areas", to: "/rd-cell/areas", desc: "Domain-specific research thrusts" },
      { label: "Funded Research Projects", to: "/rd-cell/projects", desc: "DST, AICTE, UGC and sponsored grants" },
      { label: "Research Publications", to: "/rd-cell/publications", desc: "Indexed journals (SCI/Scopus) & conferences" },
      { label: "Ph.D Scholars", to: "/rd-cell/scholars", desc: "Registered research scholars under supervision" },
      { label: "Industrial MOUs", to: "/rd-cell/mous", desc: "Active research collaboration agreements" },
    ],
  },
  {
    title: "Campus Facilities & Infrastructure",
    description: "Modern student amenities across 80 acres of green campus.",
    icon: Compass,
    color: "from-rose-600 to-pink-700",
    links: [
      { label: "Student Hostels", to: "/hostels", desc: "UG & PG Boys and Girls hostel residences" },
      { label: "Central Library", to: "/library", desc: "Over 35,000 volumes, e-journals and digital reading" },
      { label: "Sports Complex", to: "/sports", desc: "Cricket stadium, indoor gym, courts and tourneys" },
      { label: "Health Dispensary", to: "/dispensary", desc: "Resident medical officer and emergency aid" },
      { label: "Campus Banking", to: "/banking", desc: "Union Bank on-campus branch & ATM" },
      { label: "Engineering Cell", to: "/engineering-cell", desc: "Campus infrastructure & maintenance division" },
      { label: "Staff Quarters", to: "/other-amenities/staff-quarters", desc: "Faculty and staff residential complex" },
      { label: "Guest House", to: "/other-amenities/guest-house", desc: "VIP and visiting examiner suites" },
    ],
  },
  {
    title: "Student Welfare & Campus Life",
    description: "Clubs, student cells, community service, and professional society chapters.",
    icon: Users,
    color: "from-teal-600 to-emerald-700",
    links: [
      { label: "Campus Life Hub", to: "/campus-life", desc: "Student culture, festivals and extracurriculars" },
      { label: "Music & Cultural Club", to: "/campus-life/music-club", desc: "Campus orchestra and performing arts" },
      { label: "Student Activity Club (SAC)", to: "/campus-life/student-activity-club", desc: "Event management and hackathons" },
      { label: "National Service Scheme (NSS)", to: "/nss", desc: "Community outreach and volunteer drives" },
      { label: "NSS Regular Activities", to: "/nss/activities", desc: "Blood donation, cleanliness and health camps" },
      { label: "NSS Special Camps", to: "/nss/special-camp", desc: "Rural community immersion programs" },
      { label: "Women Empowerment Cell", to: "/women-empowerment", desc: "Guidance, counseling, and gender safety" },
      { label: "Women Cell Activities", to: "/women-empowerment/activities", desc: "Workshops and self-defense training" },
      { label: "Women Cell Magazine", to: "/women-empowerment/magazine", desc: "Annual publication and articles" },
      { label: "Women Recreation Club", to: "/women-empowerment/recreation", desc: "Health, yoga and wellness initiatives" },
      { label: "Entrepreneurship Cell (EDC)", to: "/edc", desc: "Startup incubation and ideation bootcamps" },
      { label: "Professional Bodies", to: "/professional-bodies", desc: "IEEE, ACM, CSI and IETE student branches" },
      { label: "IIPC Industry Cell", to: "/iipc", desc: "Industry interaction & internship linkages" },
      { label: "Campus Photo Gallery", to: "/gallery", desc: "Photographic archive of campus memories" },
      { label: "Notices & Circulars", to: "/notices", desc: "Official college circulars & timely updates" },
    ],
  },
  {
    title: "Statutory, Legal & Portals",
    description: "Acts, statutory disclosures, institutional webmail, and central university portals.",
    icon: ShieldCheck,
    color: "from-blue-700 to-slate-800",
    links: [
      { label: "Anti-Ragging Committee", to: "/anti-ragging", desc: "Zero tolerance policy, squad and toll-free helpline" },
      { label: "Right to Information (RTI 2005)", to: "/rti", desc: "Public Information Officers (PIO) & statutory data" },
      {
        label: "UCEV Google Workspace Mail",
        to: "https://accounts.google.com/AccountChooser?service=mail&continue=https://mail.google.com/mail/&hd=jntugvcev.edu.in",
        desc: "Institutional @jntugvcev.edu.in faculty & student webmail",
        isExternal: true,
        badge: "Webmail",
      },
      {
        label: "Central Academic Portal (CAP)",
        to: "https://cap.jntugv.edu.in",
        desc: "JNTU-GV University attendance and examination records",
        isExternal: true,
        badge: "Portal",
      },
      {
        label: "Student Alumni Network",
        to: "https://alumni.jntugv.edu.in",
        desc: "Official alumni engagement & networking hub",
        isExternal: true,
        badge: "Portal",
      },
      {
        label: "JNTU Act 2008",
        to: "https://jntugvcev.edu.in//wp-content/uploads/2021/03/JNTUACT-compressed.pdf",
        desc: "Andhra Pradesh Act No. 30 of 2008 Gazetted document",
        isExternal: true,
      },
      {
        label: "Government Order MS No. 14",
        to: "https://jntugvcev.edu.in//wp-content/uploads/2021/03/13022019HE_MS14.pdf",
        desc: "Higher Education Department Order Document",
        isExternal: true,
      },
      { label: "Contact Us & Campus Map", to: "/contact", desc: "Address, official email, phone numbers & OSM location" },
      { label: "Developer Team Credits", to: "/team", desc: "Engineering team and faculty supervisors" },
    ],
  },
];

function SitemapPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return SITEMAP_DATA;
    const term = searchTerm.toLowerCase();

    return SITEMAP_DATA.map((section) => {
      const matchesSection =
        section.title.toLowerCase().includes(term) ||
        section.description.toLowerCase().includes(term);

      const matchingLinks = section.links.filter(
        (link) =>
          link.label.toLowerCase().includes(term) ||
          (link.desc && link.desc.toLowerCase().includes(term)) ||
          link.to.toLowerCase().includes(term)
      );

      if (matchesSection) {
        return section;
      }

      return {
        ...section,
        links: matchingLinks,
      };
    }).filter((section) => section.links.length > 0);
  }, [searchTerm]);

  const totalLinks = useMemo(() => {
    return SITEMAP_DATA.reduce((acc, sec) => acc + sec.links.length, 0);
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Directory & Index"
        title="Portal Sitemap"
        subtitle="A comprehensive directory of all pages, departments, academic links, research cells, and student resources across JNTU-GV College of Engineering."
        image={campusImg}
      />

      <section className="py-16 md:py-24 container-narrow">
        {/* Search & Statistics Filter Bar */}
        <RevealOnScroll>
          <div className="p-6 md:p-8 bg-card border border-border rounded-3xl shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-eyebrow text-accent">Navigation Index</div>
              <h2 className="text-xl md:text-2xl font-bold text-ink mt-1">
                Explore {totalLinks}+ Portal Resources
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Quickly locate any institutional page, syllabus, facility, or external university portal.
              </p>
            </div>

            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter pages, links, departments..."
                className="w-full bg-sand/60 dark:bg-slate-900 border border-border rounded-2xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-ink px-1.5 py-0.5 rounded bg-muted"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </RevealOnScroll>

        {/* Sitemap Grid Categories */}
        <div className="grid gap-10">
          {filteredSections.length === 0 ? (
            <div className="text-center py-16 p-8 bg-card border border-border rounded-3xl">
              <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40 animate-pulse" />
              <h3 className="text-lg font-bold text-ink">No pages found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No sitemap entries match your search query "{searchTerm}".
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 text-xs font-semibold text-accent bg-accent/10 rounded-xl hover:bg-accent/20 transition"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredSections.map((section, idx) => (
              <RevealOnScroll key={section.title} delay={idx * 50}>
                <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
                  {/* Category Header */}
                  <div className="flex items-start gap-4 pb-6 border-b border-border/70">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} text-white flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      <section.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg md:text-xl font-bold text-ink">{section.title}</h3>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                          {section.links.length} {section.links.length === 1 ? "page" : "links"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Links Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-6">
                    {section.links.map((link) => {
                      const isExt = link.isExternal || link.to.startsWith("http");

                      if (isExt) {
                        return (
                          <a
                            key={link.label}
                            href={link.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-3.5 rounded-2xl bg-sand/40 dark:bg-slate-900/50 hover:bg-accent/10 dark:hover:bg-accent/15 border border-border/60 hover:border-accent/40 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="font-semibold text-sm text-ink group-hover:text-accent transition-colors flex items-center gap-1.5">
                                  {link.label}
                                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-accent shrink-0" />
                                </span>
                                {link.badge && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/20 text-accent shrink-0">
                                    {link.badge}
                                  </span>
                                )}
                              </div>
                              {link.desc && (
                                <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                                  {link.desc}
                                </p>
                              )}
                            </div>
                            <div className="mt-3 pt-2 border-t border-border/40 text-[10.5px] text-muted-foreground font-mono truncate group-hover:text-accent">
                              {link.to}
                            </div>
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={link.label}
                          to={link.to}
                          className="group p-3.5 rounded-2xl bg-sand/40 dark:bg-slate-900/50 hover:bg-accent/10 dark:hover:bg-accent/15 border border-border/60 hover:border-accent/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="font-semibold text-sm text-ink group-hover:text-accent transition-colors flex items-center gap-1">
                                {link.label}
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-1 group-hover:text-accent transition-all shrink-0" />
                              </span>
                              {link.badge && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/20 text-accent shrink-0">
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            {link.desc && (
                              <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                                {link.desc}
                              </p>
                            )}
                          </div>
                          <div className="mt-3 pt-2 border-t border-border/40 text-[10.5px] text-muted-foreground font-mono truncate group-hover:text-accent">
                            {link.to}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </RevealOnScroll>
            ))
          )}
        </div>
      </section>
    </>
  );
}
