import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { VerticalSubNav } from "@/components/VerticalSubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { imageUrl } from "@/lib/assets";
import { StatCounter } from "@/components/StatCounter";
import { SectionLabel } from "@/components/SectionLabel";
import { RevealOnScroll } from "@/components/RevealOnScroll";
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

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

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

  return (
    <div className="space-y-12 pb-24">
      <PageHero
        eyebrow="Academics"
        title="Shape Your Future with Academic Excellence"
        subtitle="Access every academic resource — curriculum, regulations, schedules, admissions, scholarships, and more."
        image={campusImg}
      />
      <div className="py-12 max-w-[1280px] mx-auto px-5 md:px-8 flex flex-col md:flex-row gap-8 items-start">
        <VerticalSubNav items={ACADEMICS_SUBNAV} />
        <div className="flex-1 min-w-0 space-y-12 overflow-hidden">


      {/* Stats Counter Section */}
      <section className="container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]">
          {dbStats.map((s: any) => {
            const numValue = parseInt(String(s.value).replace(/\D/g, "")) || 0;
            const suffix = String(s.value).includes("+") ? "+" : (String(s.value).match(/[a-zA-Z+%]+/) || [""])[0];
            return (
              <div className="bg-card p-6 md:p-8 flex flex-col justify-between" key={s.id}>
                <StatCounter value={numValue} label={s.label} suffix={suffix} />
                {s.trend && <p className="text-xs text-muted-foreground mt-2 font-medium">{s.trend}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Admin Mode Stat Actions */}
      {isEditMode && (
        <section className="container-narrow space-y-6">
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

          {/* Admin Editing Quick Stat Form */}
          {editStatId !== null && (
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

          {/* Admin quick editor items list for Stats cards */}
          {dbStats.length > 0 && (
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
                        className="p-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
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
        </section>
      )}

      {/* Admin Mode Ticker Notification Actions */}
      {isEditMode && (
        <section className="container-narrow space-y-6">
          <GlassCard className="p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between text-slate-900">
            <p className="text-amber-800 text-xs font-semibold">
              <strong>Admin Notifications Mode:</strong> Manage ticker scroll notifications (add custom notifications, dates, target paths).
            </p>
            <button
              onClick={startAddNotif}
              className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
            >
              <Plus size={13} /> Add Ticker Notification
            </button>
          </GlassCard>

          {/* Admin Editing Ticker Notification Form */}
          {editNotifId !== null && (
            <GlassCard className="p-6 border-2 border-amber-350 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                {editNotifId === -1 ? "Add Custom Ticker Notification" : "Edit Ticker Notification"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                <div>
                  <label className="text-slate-500 font-bold block mb-1">Source / Type</label>
                  <select
                    value={nSource}
                    onChange={(e) => {
                      setNSource(e.target.value);
                      const labelMap: Record<string, string> = {
                        calendar: "Calendar",
                        holiday: "Holiday",
                        "exam-sched": "Exam Schedule",
                        "exam-notif": "Exam Notice",
                        "hall-ticket": "Hall Ticket",
                        results: "Results",
                        timetable: "Timetable",
                        fee: "Fee"
                      };
                      if (labelMap[e.target.value]) {
                        setNLabel(labelMap[e.target.value]);
                      }
                    }}
                    className="w-full border border-amber-200 bg-white rounded-lg p-2.5 text-xs outline-none cursor-pointer"
                  >
                    <option value="calendar">Academic Calendar</option>
                    <option value="holiday">Holiday</option>
                    <option value="exam-sched">Exam Schedule</option>
                    <option value="exam-notif">Exam Notice</option>
                    <option value="hall-ticket">Hall Ticket</option>
                    <option value="results">Results</option>
                    <option value="timetable">Timetable</option>
                    <option value="fee">Fee Payment</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 font-bold block mb-1">Badge Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Results, Calendar"
                    value={nLabel}
                    onChange={(e) => setNLabel(e.target.value)}
                    className="w-full border border-amber-200 bg-white rounded-lg p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-bold block mb-1">Date Display</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Jun, 2026 or Available Now"
                    value={nDate}
                    onChange={(e) => setNDate(e.target.value)}
                    className="w-full border border-amber-200 bg-white rounded-lg p-2.5 text-xs outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-500 font-bold block mb-1">Notification Text</label>
                  <input
                    type="text"
                    placeholder="Enter ticker description headline..."
                    value={nText}
                    onChange={(e) => setNText(e.target.value)}
                    className="w-full border border-amber-200 bg-white rounded-lg p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-bold block mb-1">Target Link / Path</label>
                  <input
                    type="text"
                    placeholder="e.g. /academics/examination or PDF url"
                    value={nTo}
                    onChange={(e) => setNTo(e.target.value)}
                    className="w-full border border-amber-200 bg-white rounded-lg p-2.5 text-xs outline-none"
                  />
                </div>
                <div className="md:col-span-3 flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="urgent-check"
                    checked={nUrgent}
                    onChange={(e) => setNUrgent(e.target.checked)}
                    className="rounded border-amber-200 text-amber-600 focus:ring-amber-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="urgent-check" className="text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer select-none">
                    Mark as Urgent (Adds red pulsing dot in ticker scroller)
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 font-sans">
                <button
                  onClick={() => setEditNotifId(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!nText.trim()) {
                      toast.error("Notification text cannot be empty!");
                      return;
                    }
                    saveNotifMutation.mutate({
                      id: editNotifId === -1 ? undefined : editNotifId,
                      source: nSource,
                      label: nLabel,
                      text: nText,
                      date: nDate,
                      to: nTo,
                      urgent: nUrgent
                    });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow cursor-pointer"
                >
                  <Save size={13} /> Save Notification
                </button>
              </div>
            </GlassCard>
          )}

          {/* Admin custom notification items editor list */}
          {tickerNotifsList.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Custom Notifications Repository ({tickerNotifsList.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tickerNotifsList.map((n: any) => (
                  <GlassCard key={n.id} className="p-4 border border-amber-200 bg-white/40 dark:bg-slate-900/40 flex items-center justify-between relative">
                    <div className="flex flex-col gap-1 pr-16 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase">{n.source}</span>
                        {n.urgent && <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase">Urgent</span>}
                        <span className="text-[10px] text-slate-400 font-semibold">{n.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 mt-1">{n.text}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Link: <span className="underline">{n.to}</span></p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditNotif(n)}
                        className="p-1.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-700 transition cursor-pointer"
                        title="Edit notification"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => { if (confirm("Delete this notification from scroller?")) deleteNotifMutation.mutate(n.id); }}
                        className="p-1.5 rounded bg-red-100 hover:bg-red-200 text-red-700 transition cursor-pointer"
                        title="Delete notification"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Module Navigator Section */}
      <section className="py-12 bg-slate-50/50 dark:bg-slate-900/20 border-t border-border">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <SectionLabel>Academic Modules</SectionLabel>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                Explore JNTU Academics
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Navigate to any academic section or resource below
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground border border-border rounded-full px-3 py-1">
              {MODULES.length} modules
            </span>
          </div>

          <div className="grid auto-rows-[260px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MODULES.map((mod, index) => (
            <ModuleCard key={mod.name} mod={mod} index={index} />
          ))}
          </div>
        </div>
      </section>
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
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
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
