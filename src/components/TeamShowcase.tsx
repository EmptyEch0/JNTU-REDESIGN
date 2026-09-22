import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  GraduationCap,
  Linkedin,
  Code2,
  Heart,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Quote,
  MessageSquareQuote,
  CheckCircle2,
  X,
  BookOpen,
  UserCheck,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  fullName: string;
  role: string;
  department: string;
  image: string;
  portrait: string;
  linkedin?: string;
  badge: string;
  badgeColor: string;
  message: string;
  highlights: string[];
  skills: string[];
}

const SUPERVISOR = {
  name: "Mr. Anil Wurity",
  title: "Assistant Professor",
  department: "Department of Information Technology",
  institution: "JNTU-GV College of Engineering, Vizianagaram",
  role: "Faculty Guide & Project Supervisor",
  image: "/images/team/dr_w_anil_portrait.png",
  squareImage: "/images/team/dr_w_anil.png",
  message:
    "Providing visionary leadership, architectural mentorship, and continuous guidance to modernise the digital campus of JNTU-GV with student-led technological innovation.",
  credentials: [
    "Assistant Professor in IT",
    "Faculty Project Coordinator",
    "Campus Digital Transformation Mentor",
    "Research & Technical Advisor",
  ],
  quote:
    "Empowering young engineers to solve real-world problems creates institutional excellence that stands the test of time.",
};

// 4 student developers in the exact requested order:
// 1st: Likhith (last person in sketch - 4th person)
// 2nd: Sai Rupini (1st person in sketch)
// 3rd: Sai Vamsi (2nd person in sketch)
// 4th: Anitha (3rd person in sketch)
const DEVELOPERS: TeamMember[] = [
  {
    id: "likhith",
    name: "Likhith",
    fullName: "Likhith Kumar Mankala",
    role: "Lead Developer",
    department: "Information Technology · JNTU-GV CEV",
    image: "/images/team/likhith.png",
    portrait: "/images/team/likhith_portrait.png",
    linkedin: "https://www.linkedin.com/in/likhithmankala/",
    badge: "Lead Developer",
    badgeColor: "from-sky-500 to-blue-600 text-white shadow-sky-500/20",
    message:
      "This internship was a new and valuable experience for me, giving me the opportunity to work with a new team and contribute to our college website.\n\nIt was a great pleasure and an honour to work on something meaningful for my own college, and I sincerely thank Mr. Anil Wurity Sir for this opportunity.\n\nI learned many new things, faced challenges, and experienced several sleepless nights while completing our work.\n\nWorking with the team helped me improve my technical, communication, teamwork, and problem-solving skills.\n\nOverall, this journey gave me valuable experiences and lessons that I will carry forward in my academic and professional life.",
    highlights: [
      "System Architecture & SSR Pipeline",
      "Dynamic Routing & Department Portals",
      "Administrative Dashboard & Role Security",
      "Performance & Edge Caching Optimization",
    ],
    skills: [],
  },
  {
    id: "sai-rupini",
    name: "Sai Rupini",
    fullName: "Sai Rupini Chitikesi",
    role: "Full Stack Developer",
    department: "Information Technology · JNTU-GV CEV",
    image: "/images/team/sai_rupini.png",
    portrait: "/images/team/sai_rupini_portrait.png",
    linkedin: "https://www.linkedin.com/in/sairupini-chitikesi/",
    badge: "Full Stack Developer",
    badgeColor: "from-rose-500 to-pink-600 text-white shadow-pink-500/20",
    message:
      "Working on our college website with a team of four gave me an opportunity to step beyond academics and gain real experience in web development. I contributed to developing the Departments module and worked on login functionality for HODs and faculty members. I enjoyed collaborating with my teammates, sharing ideas, solving challenges, and seeing our work become a useful part of the college website. One of the most valuable new experiences for me was working with a VPS, which helped me understand how websites are deployed and managed beyond the local development environment. This experience taught me a lot about teamwork, responsibility, problem-solving, and applying my technical skills to a real-world project. I’m really glad I got to be part of this journey and contribute something meaningful to my college.",
    highlights: [
      "Departments Module & Academic Portals",
      "Faculty & HOD Login Functionality",
      "High-Fidelity Glassmorphism Design System",
      "VPS Deployment & Environment Management",
    ],
    skills: [],
  },
  {
    id: "sai-vamsi",
    name: "Sai Vamsi",
    fullName: "Sai Vamsi",
    role: "Full Stack Developer",
    department: "Information Technology · JNTU-GV CEV",
    image: "/images/team/sai_vamsi.png",
    portrait: "/images/team/sai_vamsi_portrait.png",
    badge: "Full Stack Developer",
    badgeColor: "from-emerald-500 to-teal-600 text-white shadow-emerald-500/20",
    message:
      "Being part of this work experience gave me an opportunity to step beyond academics and learn through practical involvement. I enjoyed working with my teammates, sharing ideas, taking responsibility, and contributing to the work we were doing. Every task helped me improve my communication, teamwork, and problem-solving skills while also giving me more confidence in my abilities. Seeing our efforts come together and contribute to something meaningful made the experience truly rewarding. I’m grateful for this opportunity, as it taught me valuable lessons that I can carry forward in both my academic and professional journey.",
    highlights: [
      "Database Schema & Relational Models",
      "Timetable & Syllabus Data Structures",
      "Campus Life & Hostels Module Integration",
      "Data Validation & State Management",
    ],
    skills: [],
  },
  {
    id: "anitha",
    name: "Anitha",
    fullName: "Anitha Palavalasa",
    role: "Full Stack Developer",
    department: "Information Technology · JNTU-GV CEV",
    image: "/images/team/anitha.png",
    portrait: "/images/team/anitha_portrait.png",
    linkedin: "https://www.linkedin.com/in/anitha-palavalasa/",
    badge: "Full Stack Developer",
    badgeColor: "from-amber-500 to-orange-600 text-white shadow-amber-500/20",
    message:
      "Working on this college website redesign provided me an invaluable platform to translate classroom knowledge into real-world application. I focused on developing accessible UI components, structured information flows, and ensuring statutory and compliance modules are easy to navigate for all campus visitors. I'm thankful for this opportunity to contribute to our college.",
    highlights: [
      "Statutory & Norms Compliance Modules",
      "Notices & Gallery Media Workflows",
      "Campus Life & Women Empowerment Sections",
      "Component Quality Assurance & Cross-Testing",
    ],
    skills: [],
  },
];

export function TeamShowcase() {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [supervisorHovered, setSupervisorHovered] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="min-h-screen bg-sand text-foreground pt-6 pb-24 selection:bg-accent/30">
      {/* Breadcrumb Navigation */}
      <div className="container-narrow mb-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Development Team</span>
        </nav>
      </div>

      {/* Hero Header Section */}
      <section className="container-narrow mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-ink dark:text-accent text-xs font-semibold tracking-wide mb-4 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
          <span>JNTU-GV Digital Transformation Initiative</span>
        </div>

        <h1 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink font-bold tracking-tight mb-4 max-w-4xl mx-auto">
          Meet the Minds Behind <span className="text-accent underline decoration-accent/40 underline-offset-8">JNTU-GV Portal</span>
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Crafted with passion, modern engineering, and meticulous design to deliver an institutional web portal for tomorrow’s engineers and faculty.
        </p>
      </section>

      {/* SUPERVISOR SECTION */}
      <section className="container-narrow mb-16">
        <div className="text-center mb-6">
          <div className="text-eyebrow text-accent uppercase tracking-widest text-xs font-bold mb-1">
            Academic Mentorship & Guidance
          </div>
          <h2 className="text-display text-2xl sm:text-3xl text-ink font-bold">
            Under the Supervision of
          </h2>
        </div>

        <div
          onMouseEnter={() => setSupervisorHovered(true)}
          onMouseLeave={() => setSupervisorHovered(false)}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-sand-deep border border-border/80 shadow-xl transition-all duration-500 ${
            supervisorHovered
              ? "ring-2 ring-accent shadow-2xl -translate-y-1 shadow-accent/10"
              : "hover:shadow-xl"
          }`}
        >
          {/* Ambient decorative glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-6 sm:p-8 md:p-10 grid gap-8 md:grid-cols-12 items-center">
            {/* Supervisor Portrait */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="relative w-56 sm:w-64 h-64 sm:h-72 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-accent/30 p-1.5 transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src={SUPERVISOR.image}
                    alt={SUPERVISOR.name}
                    className="w-full h-full object-cover object-top rounded-xl transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center p-3">
                    <span className="text-xs font-semibold text-white bg-ink/80 px-3 py-1 rounded-full backdrop-blur-xs">
                      Faculty Project Guide
                    </span>
                  </div>
                </div>

                {/* Verified Guide Badge */}
                <div className="absolute -bottom-3 right-4 bg-ink text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Project Supervisor</span>
                </div>
              </div>
            </div>

            {/* Supervisor Details & Guidance Quote */}
            <div className="md:col-span-7 lg:col-span-8 space-y-4">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>{SUPERVISOR.title}</span>
                </div>
                <h3 className="text-display text-2xl sm:text-3xl lg:text-4xl text-ink font-bold">
                  {SUPERVISOR.name}
                </h3>
                <p className="text-sm font-medium text-accent">
                  {SUPERVISOR.department}
                </p>
                <p className="text-xs text-muted-foreground">
                  {SUPERVISOR.institution}
                </p>
              </div>

              {/* Dynamic Guidance Message Callout */}
              <div className="relative p-5 rounded-2xl bg-sand/60 border border-border/70 text-ink space-y-3">
                <div className="flex items-start gap-3">
                  <Quote className="h-6 w-6 text-accent shrink-0 rotate-180 opacity-80" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Faculty Guidance & Mentorship Message
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-ink/90 italic">
                      "{SUPERVISOR.message}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Credentials / Pillars */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUPERVISOR.credentials.map((cred, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs font-medium text-ink/80 bg-card/60 p-2.5 rounded-xl border border-border/50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>{cred}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE DEVELOPER TEAM SECTION */}
      <section className="container-narrow mb-16">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-eyebrow text-accent uppercase tracking-widest text-xs font-bold">
            <Code2 className="h-3.5 w-3.5" />
            <span>Core Engineering & Design</span>
          </div>
          <h2 className="text-display text-2xl sm:text-3xl md:text-4xl text-ink font-bold">
            The Student Developer Team
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Hover over each team member's portrait to view their personal reflection and contributions, or click to read their full message.
          </p>
        </div>

        {/* 4 DEVELOPER CARDS GRID (1x on mobile, 2x on tablet, 4x on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEVELOPERS.map((dev, idx) => {
            const isHovered = activeHoverId === dev.id;

            return (
              <div
                key={dev.id}
                onMouseEnter={() => setActiveHoverId(dev.id)}
                onMouseLeave={() => setActiveHoverId(null)}
                className={`group relative flex flex-col justify-between rounded-3xl bg-card border border-border/80 shadow-md transition-all duration-300 overflow-hidden ${
                  isHovered
                    ? "ring-2 ring-accent shadow-2xl -translate-y-2 bg-gradient-to-b from-card via-card to-sand-deep/40"
                    : "hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {/* Top Number & Role Pill */}
                <div className="p-4 pb-0 flex items-center justify-between">
                  <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-sand-deep text-muted-foreground">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                    {dev.name}
                  </span>
                </div>

                {/* Portrait Sketch Image with Dynamic Hover Message Overlay */}
                <div className="relative px-4 pt-3">
                  <div
                    onClick={() => setSelectedMember(dev)}
                    className="relative w-full aspect-4/5 rounded-2xl overflow-hidden bg-white shadow-inner border border-border/60 p-1 cursor-pointer"
                    title={`Click to read full message from ${dev.name}`}
                  >
                    <img
                      src={dev.portrait}
                      alt={dev.fullName}
                      className={`w-full h-full object-cover object-top rounded-xl transition-all duration-500 ${
                        isHovered ? "scale-105" : "scale-100"
                      }`}
                      loading="lazy"
                    />

                    {/* Floating Speech Bubble Message on Hover */}
                    <div
                      className={`absolute inset-2 rounded-xl bg-ink/95 text-white p-4 flex flex-col justify-between backdrop-blur-md transition-all duration-300 overflow-y-auto no-scrollbar ${
                        isHovered
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-1.5 text-accent text-xs font-bold uppercase tracking-wider">
                          <span className="inline-flex items-center gap-1">
                            <MessageSquareQuote className="h-3.5 w-3.5" />
                            <span>Message</span>
                          </span>
                          <span className="text-[9px] text-white/50 lowercase font-normal">click to expand</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-white/90 leading-relaxed italic line-clamp-6">
                          "{dev.message}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-white/60">
                        <span className="truncate max-w-[120px]">{dev.department}</span>
                        <span className="text-accent underline">Read full ↗</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-display text-lg font-bold text-ink group-hover:text-accent transition-colors">
                      {dev.fullName}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground line-clamp-2">
                      {dev.role}
                    </p>
                  </div>

                  {/* Read Message & LinkedIn */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMember(dev)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline cursor-pointer"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>Read Story</span>
                    </button>

                    {dev.linkedin ? (
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition-colors group/link"
                      >
                        <Linkedin className="h-3.5 w-3.5 text-primary group-hover/link:text-accent" />
                        <span>Connect</span>
                        <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <UserCheck className="h-3 w-3" />
                        <span>Core Dev</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FULL MESSAGE MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border/80 shadow-2xl p-6 sm:p-8 text-foreground space-y-6">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sand hover:bg-sand-deep text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close message"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-border/60 pb-5">
              <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-accent/40 shrink-0 p-1">
                <img
                  src={selectedMember.portrait}
                  alt={selectedMember.fullName}
                  className="w-full h-full object-cover object-top rounded-xl"
                />
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-bold">
                  {selectedMember.badge}
                </div>
                <h3 className="text-display text-2xl font-bold text-ink">
                  {selectedMember.fullName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedMember.role} · {selectedMember.department}
                </p>

                {selectedMember.linkedin && (
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition-colors pt-1"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>LinkedIn Profile ↗</span>
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                <Quote className="h-4 w-4 rotate-180" />
                <span>Personal Reflection & Experience</span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-ink/90 whitespace-pre-line italic bg-sand/60 p-5 rounded-2xl border border-border/60">
                "{selectedMember.message}"
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Key Contributions & Focus Areas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedMember.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-sand-deep/60 p-2.5 rounded-xl border border-border/40">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2 rounded-full bg-ink text-white hover:bg-ink/90 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COLLECTIVE ARTWORK BANNER SECTION */}
      <section className="container-narrow mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-ink text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="text-eyebrow text-accent uppercase tracking-widest text-xs font-bold mb-1">
                  Hand-Drawn Commemorative Artwork
                </div>
                <h3 className="text-display text-2xl sm:text-3xl font-bold text-white">
                  The Complete Development Team
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
                <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
                <span>Crafted by Student Engineers</span>
              </div>
            </div>

            {/* Sketch Panorama Display */}
            <div className="rounded-2xl overflow-hidden bg-white shadow-2xl p-2 sm:p-3 border-2 border-white/20">
              <img
                src="/images/team/team_sketch_all.png"
                alt="JNTU-GV Student Developer Team Sketch"
                className="w-full h-auto object-contain rounded-xl hover:scale-[1.01] transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
              <p>
                Left to Right: <strong className="text-white">Sai Rupini</strong> · <strong className="text-white">Sai Vamsi</strong> · <strong className="text-white">Anitha</strong> · <strong className="text-white">Likhith</strong>
              </p>
              <p className="italic">
                Department of Information Technology · JNTU-GV College of Engineering Vizianagaram
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RETURN TO PORTAL CTA */}
      <section className="container-narrow text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white hover:bg-ink/90 font-semibold text-xs tracking-wide shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>Back to Campus Homepage</span>
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border text-ink hover:bg-sand font-semibold text-xs tracking-wide shadow-xs transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>Explore About JNTU-GV</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
