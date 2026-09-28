import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import {
  ExternalLink,
  Sparkles,
  Flame,
  Hammer,
  TrendingUp,
  Layers,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Database,
  Palette,
  ArrowUpRight,
  Smartphone,
  Globe,
  FileCheck,
  Users2,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/cap")({
  head: () => ({
    meta: [
      { title: "Centralized Academic Platform (CAP) | JNTU-GV CEV" },
      {
        name: "description",
        content:
          "What is CAP, why it exists, and how JNTU-GV students built the Centralized Academic Platform from the ground up.",
      },
      {
        name: "keywords",
        content:
          "CAP JNTUGV, Centralized Academic Platform, JNTU-GV CAP, CAP portal, student academic portal, Charan Teja, Leela Avinash, Prem Sagar",
      },
      { property: "og:title", content: "Centralized Academic Platform (CAP) — JNTU-GV" },
      {
        property: "og:description",
        content:
          "The one place your academic record lives. Built by students, trusted by the university.",
      },
    ],
    links: [{ rel: "canonical", href: "https://jntugvcev.edu.in/cap" }],
  }),
  component: CapPage,
});

const CONTRIBUTORS = [
  {
    name: "S.G. CHARAN TEJA",
    role: "Product Design Lead",
    tagline: "UI/UX & Frontend Development",
    icon: Palette,
    accentColor: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-900",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    description:
      "Led product design and frontend development, delivering a user-centered digital experience that streamlined academic workflows.",
    highlights: ["User Interface & Experience", "Frontend Systems", "Academic Workflow UX"],
  },
  {
    name: "B. LEELA AVINASH",
    role: "Backend & Integration Developer",
    tagline: "Server Architecture & Services",
    icon: Code2,
    accentColor: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-900",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    description:
      "Developed efficient backend services and system integrations to streamline academic workflows and enhance inter-system communication.",
    highlights: ["Backend Services", "System Integrations", "Workflow Automation"],
  },
  {
    name: "J. PREM SAGAR",
    role: "Database & API Architect",
    tagline: "Data Integrity & Secure APIs",
    icon: Database,
    accentColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-900",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    description:
      "Designed robust database architectures and secure APIs to ensure reliability and data integrity across the platform.",
    highlights: ["Database Architecture", "Secure REST APIs", "Data Integrity & Auth"],
  },
];

const MODULE_PILLARS = [
  {
    icon: Users2,
    title: "Role-Based Portals",
    desc: "Tailored environments for students, faculty members, and Heads of Departments (HODs).",
  },
  {
    icon: Layers,
    title: "Attendance & Marks",
    desc: "Real-time records transparently synced directly with university academic standards.",
  },
  {
    icon: FileCheck,
    title: "Verifiable Certificates",
    desc: "Instant public verification of certificates and letters without office queues.",
  },
  {
    icon: Smartphone,
    title: "Web & Mobile App",
    desc: "Seamless, unified experience across modern browsers and Android/iOS devices.",
  },
];

function CapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand/40 via-background to-background text-ink pb-24">
      {/* ─── HERO SECTION ─── */}
      <PageHero
        eyebrow="Start Here"
        title="Centralized Academic Platform"
        subtitle="The single source of truth for academic life at JNTU-GV — built by students, powered by open innovation."
      />

      <div className="container-narrow mt-10 md:mt-14 space-y-16">
        {/* ─── WHAT IS CAP (IN PLAIN LANGUAGE) ─── */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 md:p-10 shadow-lg"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/10 via-accent/5 to-transparent rounded-bl-full pointer-events-none" />

          <div className="space-y-6 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>In Plain Language</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight font-serif">
              What is CAP?
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed">
              <p>
                <strong className="text-ink font-bold">CAP</strong> stands for the{" "}
                <span className="font-semibold text-primary">Centralized Academic Platform</span>.
                It’s the web application and mobile app system JNTU-GV uses to run academics —
                attendance, marks, exams, results, certificates, and the back-and-forth between
                students, faculty, and the college administration.
              </p>
              <p className="p-4 sm:p-5 rounded-2xl bg-sand/60 border border-border/80 text-slate-800 font-medium">
                If you’re a student or faculty member, that’s really all you need to know: it’s the
                one place your academic record lives, and it’s built to be honest about what’s
                actually true right now — not what a spreadsheet said last week.
              </p>
            </div>

            {/* Portal Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://cap.jntugv.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Globe size={18} />
                <span>Launch CAP Portal</span>
                <ArrowUpRight size={16} />
              </a>

              <a
                href="https://cap.jntugv.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all"
              >
                <Smartphone size={17} className="text-primary" />
                <span>cap.jntugv.edu.in</span>
              </a>
            </div>
          </div>
        </motion.section>

        {/* ─── PILLARS / MODULE HIGHLIGHTS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-2xs hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-sm text-ink">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground leading-normal">{pillar.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── THE STORY OF CAP ─── */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              The Journey
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-ink font-serif tracking-tight">
              Why It Exists & How It Came to Life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Why It Exists */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                  <Layers size={14} />
                  <span>Why It Exists</span>
                </div>
                <h3 className="text-xl font-bold text-ink">
                  Academic life, scattered everywhere
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Attendance lived in paper registers. Results went up on a notice board. A
                  bonafide letter meant standing in a queue outside an office. Updates about
                  deadlines got lost somewhere in a WhatsApp group nobody could search later.
                </p>
                <p className="text-sm text-slate-700 font-medium bg-rose-50/50 border border-rose-100 p-3.5 rounded-2xl">
                  None of it lived in one place, and nobody — student, faculty, or the department —
                  had a single, trustworthy view of what was actually going on.
                </p>
              </div>
            </motion.div>

            {/* 2. The Spark */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                  <Flame size={14} />
                  <span>The Spark</span>
                </div>
                <h3 className="text-xl font-bold text-ink">
                  Started by students, not a company
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  CAP wasn’t commissioned. No vendor pitched it, no company was hired to build it.
                  It started as an idea among a small group of JNTU-GV students who were living
                  through the same broken processes as everyone else, and got tired of waiting for
                  someone else to fix them.
                </p>
                <p className="text-sm text-slate-700 font-medium bg-amber-50/50 border border-amber-100 p-3.5 rounded-2xl">
                  So they decided to build the fix themselves.
                </p>
              </div>
            </motion.div>

            {/* 3. The Build */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                  <Hammer size={14} />
                  <span>The Build</span>
                </div>
                <h3 className="text-xl font-bold text-ink">
                  From an idea to a real, working platform
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  What began as a class-adjacent side project grew into a full production system:
                  separate, role-based portals for students, faculty, and HODs; secure logins;
                  attendance and marks; exam and fee workflows; and certificates that can be verified
                  by anyone, anywhere, without a phone call to the college.
                </p>
              </div>
            </motion.div>

            {/* 4. Today */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <TrendingUp size={14} />
                  <span>Today</span>
                </div>
                <h3 className="text-xl font-bold text-ink">
                  Still growing, one real problem at a time
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  CAP isn’t frozen at the day it launched. It keeps growing — a public letter
                  generator, certificate verification, new academic modules — each one added
                  because someone on campus actually needed it, not because a roadmap said so.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CONTRIBUTORS & DEVELOPERS OF CAP ─── */}
        <section className="space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
              <Code2 size={14} />
              <span>Core Developers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink font-serif tracking-tight">
              Contributors & Developers of CAP
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              The student engineers and architects who conceived, built, and maintain the Centralized
              Academic Platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTRIBUTORS.map((c, idx) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-105 transition-transform">
                        <Icon size={24} />
                      </div>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${c.badgeColor}`}
                      >
                        {c.role}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-ink tracking-tight font-serif">
                        {c.name}
                      </h3>
                      <p className="text-xs font-semibold text-primary mt-0.5">{c.tagline}</p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex flex-wrap gap-1.5">
                    {c.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-[10px] font-semibold bg-sand/80 text-slate-700 px-2.5 py-1 rounded-lg border border-border/80"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── BOTTOM LAUNCH CARD ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-primary via-royal to-indigo-900 text-white p-8 sm:p-10 text-center space-y-5 shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative space-y-3 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold font-serif">
              Ready to access your academic records?
            </h3>
            <p className="text-sm sm:text-base text-white/80">
              Sign in with your institutional student or faculty credentials on the official CAP portal.
            </p>
            <div className="pt-3">
              <a
                href="https://cap.jntugv.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-white/90 text-primary font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <span>Open CAP Portal (cap.jntugv.edu.in)</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
