import { createFileRoute, Link } from "@tanstack/react-router";
import { NotificationTicker } from "@/components/academics/ui/NotificationTicker";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { TICKER_NOTIFICATIONS } from "@/data/academics-events";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  getAcademicsDashboardStats,
  upsertAcademicsDashboardStat,
  deleteAcademicsDashboardStat,
  getAcademicsCalendar,
  getAcademicsExamData
} from "@/lib/academics";
import {
  GraduationCap,
  Users,
  Calendar,
  FileText,
  BookOpen,
  FileSignature,
  Briefcase,
  Download,
  Clock,
  Award,
  Users2,
  UserCheck,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Save
} from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/academics/")({
  component: AcademicsDashboard,
});

const iconMap: Record<string, any> = {
  GraduationCap: GraduationCap,
  Users: Users,
  BookOpen: BookOpen,
  TrendingUp: TrendingUp,
  Calendar: Calendar,
  Award: Award,
};

const MODULES = [
  {
    name: "Courses & Programs",
    desc: "Explore UG, PG, and PhD programs offered across all departments.",
    icon: GraduationCap,
    to: "/academics/programs",
    gradient: "from-transparent via-slate-900/40 to-blue-950/90",
    image:
      "https://cgoe.stanford.edu/sites/default/files/styles/highlight/public/2025-04/credit-bearing-course-class-cgoe.jpg.webp?h=fbf7a813&itok=QQOXBfjC",
  },
  {
    name: "Admissions",
    desc: "Application process, eligibility criteria, and seat matrix for 2026.",
    icon: Users,
    to: "/academics/admissions",
    gradient: "from-transparent via-slate-900/40 to-teal-950/90",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Academic Calendar",
    desc: "Important dates, holidays, examination schedule, and semester events.",
    icon: Calendar,
    to: "/academics/academic-calendar",
    gradient: "from-transparent via-slate-900/40 to-slate-900/90",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Regulations",
    desc: "University regulations, R23, R20, R16 and all amendment circulars.",
    icon: FileText,
    to: "/academics/regulations",
    gradient: "from-transparent via-slate-900/40 to-slate-950/90",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Syllabus",
    desc: "Download branch-wise syllabus for all years and all regulations.",
    icon: BookOpen,
    to: "/academics/syllabus",
    gradient: "from-transparent via-slate-900/40 to-indigo-950/90",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Examinations",
    desc: "Mid-sem, end-sem timetables, hall tickets, and results portal.",
    icon: FileSignature,
    to: "/academics/examination",
    gradient: "from-transparent via-slate-900/40 to-slate-900/90",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Downloads",
    desc: "Forms, certificates, templates, and official academic documents.",
    icon: Download,
    to: "/academics/downloads",
    gradient: "from-transparent via-slate-900/40 to-slate-900/90",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Time Tables",
    desc: "Class-wise and branch-wise timetables for the current semester.",
    icon: Clock,
    to: "/academics/timetables",
    gradient: "from-transparent via-slate-900/40 to-slate-900/90",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Scholarships",
    desc: "Government, university, and private scholarship listings and applications.",
    icon: Award,
    to: "/academics/scholarships",
    gradient: "from-transparent via-slate-900/40 to-amber-950/90",
    image:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Faculty Directory",
    desc: "Browse faculty profiles, research interests, and contact details.",
    icon: Users2,
    to: "/academics/faculty",
    gradient: "from-transparent via-slate-900/40 to-slate-900/90",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Leadership Desk",
    desc: "Messages and profiles from the Vice Chancellor, Principal, and HODs.",
    icon: UserCheck,
    to: "/academics/faculty",
    gradient: "from-transparent via-slate-900/40 to-slate-950/90",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "HOD Message Desk",
    desc: "Direct guidance and academic highlights from the Head of CSE.",
    icon: UserCheck,
    to: "/academics/faculty?tab=hods",
    gradient: "from-transparent via-slate-900/40 to-red-950/90",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80",
  },
];

function AcademicsDashboard() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  // local editing state
  const [editStatId, setEditStatId] = useState<number | null>(null);
  const [sLabel, setSLabel] = useState("");
  const [sValue, setSValue] = useState("");
  const [sIcon, setSIcon] = useState("GraduationCap");
  const [sColor, setSColor] = useState("text-blue-400");
  const [sTrend, setSTrend] = useState("");

  const { data: dbStats = [], isLoading: isLoadingStats } = useQuery({
    queryKey: ["academics-dashboard-stats"],
    queryFn: getAcademicsDashboardStats,
  });

  const { data: calendarList = [] } = useQuery({
    queryKey: ["academics-calendar"],
    queryFn: getAcademicsCalendar,
  });

  const { data: examList = [] } = useQuery({
    queryKey: ["academics-exams"],
    queryFn: getAcademicsExamData,
  });

  // mutations
  const saveStatMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsDashboardStat({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-dashboard-stats"] });
      setEditStatId(null);
      toast.success("Dashboard statistic updated!");
    }
  });

  const deleteStatMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsDashboardStat({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-dashboard-stats"] });
      toast.success("Dashboard statistic deleted!");
    }
  });

  const startEditStat = (stat: any) => {
    setEditStatId(stat.id);
    setSLabel(stat.label);
    setSValue(stat.value);
    setSIcon(stat.icon);
    setSColor(stat.color);
    setSTrend(stat.trend);
  };

  const startAddStat = () => {
    setEditStatId(-1);
    setSLabel("");
    setSValue("");
    setSIcon("GraduationCap");
    setSColor("text-blue-400");
    setSTrend("");
  };

  // Compile Dynamic Notifications from DB
  const dynamicTickerNotifications = useMemo(() => {
    const calendarAlerts = calendarList
      .filter((c: any) => c.pdf_url && c.pdf_url.trim() !== "")
      .map((c: any) => {
        let source: "calendar" | "holiday" | "exam-sched" = "calendar";
        let label = "Academic Calendar";
        let text = `Academic Calendar — ${c.program_name} (${c.regulation}) A.Y. ${c.academic_year}`;

        if (c.calendar_type === "Holidays") {
          source = "holiday";
          label = "Holiday List";
          text = `Holiday Notification — ${c.program_name} (${c.regulation}) A.Y. ${c.academic_year}`;
        } else if (c.calendar_type === "Examinations") {
          source = "exam-sched";
          label = "Exam Schedule";
          text = `Examination Schedule Update — ${c.program_name} (${c.regulation}) A.Y. ${c.academic_year}`;
        }

        return {
          id: `cal-${c.id}`,
          source,
          label,
          text,
          date: c.created_at
            ? new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : c.academic_year,
          to: c.pdf_url,
          urgent: c.calendar_type === "Examinations",
        };
      });

    const examAlerts = examList
      .filter((e: any) => e.file_url && e.file_url.trim() !== "")
      .map((e: any) => {
        let source: "exam-notif" | "hall-ticket" | "results" | "timetable" = "exam-notif";
        let label = e.type;

        if (e.type === "Result") {
          source = "results";
          label = "Result Link";
        } else if (e.type === "HallTicket") {
          source = "hall-ticket";
          label = "Hall Ticket Link";
        } else if (e.type === "Timetable") {
          source = "timetable";
          label = "Timetable Link";
        } else {
          source = "exam-notif";
          label = "Exam Notice";
        }

        return {
          id: `exam-${e.id}`,
          source,
          label,
          text: `${e.title}${e.description ? ` — ${e.description}` : ""}`,
          date: e.date,
          to: e.file_url,
          urgent: e.type === "Result" || e.type === "HallTicket"
        };
      });

    return [...calendarAlerts, ...examAlerts];
  }, [calendarList, examList]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-2">

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-blue-800 to-blue-950 text-white shadow-2xl shadow-blue-900/30"
      >
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <GraduationCap className="w-3.5 h-3.5" />
              JNTU-GV Academics Portal · 2026–27
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
              Shape Your Future with <br />
              <span className="text-yellow-300">Academic Excellence</span>
            </h1>
            <p className="text-blue-100 leading-relaxed text-sm md:text-base max-w-md">
              Access every academic resource — curriculum, timetables, results,
              scholarships, and more — all from one place.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to="/academics/programs"
                className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-50 transition-colors shadow-lg"
              >
                Explore Programs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/academics/admissions"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </div>

          {/* Stats grid inside hero (md+) */}
          <div className="hidden md:grid grid-cols-2 gap-3 flex-shrink-0">
            {dbStats.map((s: any) => {
              const Icon = iconMap[s.icon] || GraduationCap;
              return (
                <div
                  key={s.id}
                  className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-1 min-w-[140px]"
                >
                  <Icon className={`w-5 h-5 ${s.color}`} />
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="text-[11px] font-semibold text-blue-100">
                    {s.label}
                  </p>
                  <p className="text-[10px] text-white/50">{s.trend}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Notification Ticker (Loaded directly from database and slowed down to 75s) ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <NotificationTicker items={dynamicTickerNotifications} speedSeconds={75} />
      </motion.div>

      {/* Admin Mode Stat Actions */}
      {isEditMode && (
        <GlassCard className="p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between text-slate-900">
          <p className="text-amber-800 text-xs font-semibold">
            <strong>Admin Dashboard Mode:</strong> Adjust quick statistics metrics, colors, trends, or add new stats cards.
          </p>
          <button
            onClick={startAddStat}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-900/10"
          >
            <Plus size={13} /> Add Stat Card
          </button>
        </GlassCard>
      )}

      {/* Admin Editing Quick Stat Form */}
      {isEditMode && editStatId !== null && (
        <GlassCard className="p-6 border-2 border-amber-350 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
            {editStatId === -1 ? "Add Quick Stat Card" : "Edit Quick Stat Card"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-sans text-xs">
            <div>
              <label className="text-slate-500 font-bold block mb-1">Metric Label</label>
              <input
                type="text"
                placeholder="e.g. Total Departments"
                value={sLabel}
                onChange={(e) => setSLabel(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-500 font-bold block mb-1">Metric Value</label>
              <input
                type="text"
                placeholder="e.g. 14, 45+"
                value={sValue}
                onChange={(e) => setSValue(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-500 font-bold block mb-1">Lucide Icon name</label>
              <select
                value={sIcon}
                onChange={(e) => setSIcon(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="GraduationCap">GraduationCap</option>
                <option value="Users">Users</option>
                <option value="BookOpen">BookOpen</option>
                <option value="TrendingUp">TrendingUp</option>
                <option value="Calendar">Calendar</option>
                <option value="Award">Award</option>
              </select>
            </div>
            <div>
              <label className="text-slate-500 font-bold block mb-1">Text Color Class</label>
              <select
                value={sColor}
                onChange={(e) => setSColor(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="text-blue-500">Royal Blue Accent</option>
                <option value="text-blue-400">Light Blue Accent</option>
                <option value="text-emerald-400">Emerald Accent</option>
                <option value="text-violet-400">Violet Accent</option>
                <option value="text-amber-400">Amber Accent</option>
              </select>
            </div>
            <div>
              <label className="text-slate-500 font-bold block mb-1">Trend / Footnote</label>
              <input
                type="text"
                placeholder="e.g. Accredited, +5% this semester"
                value={sTrend}
                onChange={(e) => setSTrend(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 font-sans">
            <button
              onClick={() => setEditStatId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => saveStatMutation.mutate({
                id: editStatId === -1 ? undefined : editStatId,
                label: sLabel,
                value: sValue,
                icon: sIcon,
                color: sColor,
                trend: sTrend
              })}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
            >
              <Save size={13} /> Save Stat Card
            </button>
          </div>
        </GlassCard>
      )}

      {/* Admin quick editor items list for Stats cards (visible strictly when isEditMode) */}
      {isEditMode && dbStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {dbStats.map((s: any) => {
            const Icon = iconMap[s.icon] || GraduationCap;
            return (
              <GlassCard key={s.id} className="p-4 border border-amber-200 bg-white/40 dark:bg-slate-900/40 relative">
                <div className="absolute right-2 top-2 flex gap-1 z-10">
                  <button
                    onClick={() => startEditStat(s)}
                    className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-700"
                    title="Edit card"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this metric card?")) deleteStatMutation.mutate(s.id); }}
                    className="p-1 rounded bg-red-105 hover:bg-red-200 text-red-650"
                    title="Delete card"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{s.value}</h4>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">{s.label}</p>
                    <p className="text-[9px] text-slate-400">{s.trend}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* ── Mobile Stats Row ── */}
      {!isEditMode && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:hidden">
          {dbStats.map((stat: any, idx: number) => {
            const Icon = iconMap[stat.icon] || GraduationCap;
            return (
              <GlassCard
                key={idx}
                delay={idx * 0.05}
                className="p-4 flex flex-col items-center text-center gap-1.5"
              >
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-[10px] font-medium text-slate-500 leading-tight">
                  {stat.label}
                </p>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* ── Module Navigator ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Academic Modules
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Navigate to any academic section below
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1">
            {MODULES.length} modules
          </span>
        </div>

        {/* Standardized all cards to uniform layout (height 260px, 4-column layout on desktop) without bento spanning */}
        <div className="grid auto-rows-[260px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MODULES.map((mod, index) => (
            <ModuleCard key={mod.name} mod={mod} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Module Card (Standardized uniform cards without bento spanning logic) ───
function ModuleCard({
  mod,
  index,
}: {
  mod: (typeof MODULES)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
      className="h-full"
    >
      <Link
        to={mod.to}
        className="group relative block h-full overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/10 hover:ring-2 hover:ring-white/40 transition-all duration-300"
      >
        {/* Background image — primary visual */}
        <img
          src={mod.image}
          alt={mod.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />

        {/* Bottom-weighted gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${mod.gradient} transition-opacity duration-300`}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-5 md:p-6 text-white">
          {/* Top: icon + view badge */}
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <mod.icon className="w-5 h-5 text-white drop-shadow" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/80 shadow">
              View <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Bottom: title + desc + arrow */}
          <div>
            <h3 className="text-xl font-extrabold leading-tight drop-shadow-sm mb-1.5 group-hover:text-yellow-200 transition-colors duration-300">
              {mod.name}
            </h3>
            <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
              {mod.desc}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-white/50 group-hover:text-yellow-300 transition-colors duration-300">
              <span className="text-[11px] font-semibold">Open module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
