import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  Bell,
  ArrowRight,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  Filter,
  Eye,
  X,
  Upload,
  Search,
  Calendar,
  FileText,
  GraduationCap,
  Briefcase,
  Home,
  Sparkles,
  Trophy,
  Layers,
  CheckCircle2,
  Clock,
  RotateCcw
} from "lucide-react";
import libraryImg from "@/assets/library-interior.webp";
import { SubNav } from "@/components/SubNav";
import { STUDENT_SUBNAV } from "@/lib/site";
import { useState, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { getNotices, addNotice, deleteNotice } from "@/funcs/site.server";
import { getAssetUrl } from "@/lib/assets";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
} from "@/components/AdminEditPanel";

export const Route = createFileRoute("/notices")({
  loader: async () => await getNotices(),
  head: () => ({
    meta: [
      { title: "Notices & Announcements — JNTU-GV CEV" },
      {
        name: "description",
        content: "Official notices, academic circulars, exam timetables and announcements from JNTU-GV CEV.",
      },
      { property: "og:title", content: "Notices & Announcements — JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Stay updated with academic schedules, examinations, hostel and placement notices.",
      },
    ],
  }),
  component: NoticesPage,
});

const DEFAULT_NOTICES = [
  {
    date: "August 12, 2026",
    tag: "Academic",
    title: "Academic Calendar for II B.Tech (2026–2027)",
    url: "https://jntugvcev.edu.in/wp-content/uploads/2026/08/ii-b-tech-academic-calendar-2026-2027.pdf",
  },
  {
    date: "August 6, 2026",
    tag: "Academic",
    title: "SCCI Semiconductor Design – Parikalpak Technical Program at JNTU-GV Vizianagaram (August 6, 2026)",
    url: "https://jntugvcev.edu.in/wp-content/uploads/2026/08/scci-semiconductor-design-parikalpak-2026.pdf",
  },
  {
    date: "August 4, 2026",
    tag: "Academic",
    title: "Academic Calendar for II M.Tech (2026–2027)",
    url: "https://jntugvcev.edu.in/wp-content/uploads/2026/08/academic-calendar-for-ii-m-tech-2026-27.pdf",
  },
  {
    date: "July 20, 2026",
    tag: "Exams",
    title: "Timetable for M.Tech II-Semester (R19) Supplementary End Examinations, July/August-2026",
    url: getAssetUrl("uploads/2026/07/m-tech-ii-sem-r19-supplementary-end-time-table-july-august-2026.pdf"),
  },
  {
    date: "July 20, 2026",
    tag: "Exams",
    title: "Timetable for M.Tech II-Semester (R25) End Examinations, July/August-2026",
    url: getAssetUrl("uploads/2026/07/m-tech-ii-sem-r25-end-time-table-july-august-2026.pdf"),
  },
  {
    date: "July 20, 2026",
    tag: "Exams",
    title: "Revised Timetable for M.Tech II-Semester (R25) II-Mid Examinations, July-2026",
    url: getAssetUrl("uploads/2026/07/revised-m-tech-ii-sem-r25-ii-mid-time-table-july-2026.pdf"),
  },
  {
    date: "July 20, 2026",
    tag: "Exams",
    title: "Timetable for M.Tech II-Semester (R23) II-Mid Examinations, July-2026",
    url: getAssetUrl("uploads/2026/07/m-tech-ii-sem-r23-ii-mid-time-table-july-2026.pdf"),
  },
  {
    date: "July 7, 2026",
    tag: "Academic",
    title: "Academic Calendar for II MCA (2026-2027)",
    url: getAssetUrl("uploads/2026/07/ii-mca-academic-calendar-2026-2027.pdf"),
  },
  {
    date: "July 7, 2026",
    tag: "Academic",
    title: "Academic Calendar for II MBA (2026-2027)",
    url: getAssetUrl("uploads/2026/07/ii-mba-academic-calendar-2026-2027.pdf"),
  },
  {
    date: "June 18, 2026",
    tag: "Academic",
    title: "Academic Calendar for II B.Tech (2026-2027)",
    url: getAssetUrl("uploads/2026/06/ii-b-tech-academic-calendar-june-2026.pdf"),
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Timetable for I-MCA II-Semester (R25) End Examinations, June-2026",
    url: getAssetUrl("uploads/2026/06/i-mca-ii-semester-r25-end-examinations-june-2026.pdf"),
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Timetable for I-MBA II-Semester (R25) End Examinations, June-2026",
    url: getAssetUrl("uploads/2026/06/i-mba-ii-semester-r25-end-examinations-june-2026.pdf"),
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Timetable for I-MCA II-Semester (R20) Supply End Examinations, June-2026",
    url: getAssetUrl("uploads/2026/06/i-mca-ii-semester-r20-supply-end-examinations-june-2026.pdf"),
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Notification for M.Tech II-Semester (R25/R19) Regular/Supplementary Examinations, June-2026",
    url: getAssetUrl("uploads/2026/06/mtech-ii-sem-r25-r19-examination-notification-june-2026.pdf"),
  },
  {
    date: "June 12, 2026",
    tag: "Exams",
    title: "Timetable for I-II R23 End Examinations, June-2026",
    url: getAssetUrl("uploads/2026/06/i-ii-r23-end-time-table-june-2026.pdf"),
  },
  {
    date: "June 12, 2026",
    tag: "Exams",
    title: "Timetable for I-II R20 End Examinations, June-2026",
    url: getAssetUrl("uploads/2026/06/i-ii-r20-end-time-table-june-2026.pdf"),
  },
  {
    date: "June 5, 2026",
    tag: "Academic",
    title: "Academic Calendar for III B.Tech (2026-2027)",
    url: getAssetUrl("uploads/2026/06/iii-b-tech-academic-calendar.pdf"),
  },
  {
    date: "June 5, 2026",
    tag: "Academic",
    title: "Academic Calendar for IV B.Tech (2026-2027)",
    url: getAssetUrl("uploads/2026/06/iv-b-tech-academic-calendar.pdf"),
  },
  {
    date: "June 5, 2026",
    tag: "Exams",
    title: "Timetable for I-B.Tech II-Semester II-Mid Examinations, June-2026",
    url: getAssetUrl("uploads/2026/06/i-btech-ii-mid-time-table-june-2026.pdf"),
  },
  {
    date: "May 18, 2026",
    tag: "Exams",
    title: "I-II II Mid Postponement Circular, June-2026",
    url: getAssetUrl("uploads/2026/05/i-ii-ii-mid-postponement-circular-june-2026.pdf"),
  },
  {
    date: "May 18, 2026",
    tag: "Exams",
    title: "Notification for I-II (R23) Regular & Supplementary Examinations, June-2026",
    url: getAssetUrl("uploads/2026/05/i-ii-r23-regular-supplementary-notification-june-2026.pdf"),
  },
  {
    date: "May 17, 2026",
    tag: "Exams",
    title: "Notification for MCA & MBA II-Semester Regular & Supply Examinations, May-2026",
    url: getAssetUrl("uploads/2026/05/mca-mba-ii-semester-regular-supply-notification-may-2026.pdf"),
  },
  {
    date: "April 25, 2026",
    tag: "Exams",
    title: "Timetable for I-M.Tech II-Semester (R25) I-Mid Examinations, April-2026",
    url: getAssetUrl("uploads/2026/04/I-M.TECH-II-SEM-R25-I-MID-TIME-TABLE-APRIL-2026.pdf"),
  },
  {
    date: "April 24, 2026",
    tag: "Placements",
    title: "Pre-placement talks for Capgemini and Hexaware on 02 May 2026.",
  },
  {
    date: "April 18, 2026",
    tag: "Hostel",
    title: "Summer Vacation guidelines for resident students staying in campus hostels.",
  },
  {
    date: "April 12, 2026",
    tag: "R&D",
    title: "Call for Research Proposals — UGC & AICTE Minor Research Grants 2026.",
  },
  {
    date: "April 5, 2026",
    tag: "Event",
    title: "Annual University Cultural Fest 'Spandana 2026' Registrations Open.",
  },
  {
    date: "March 28, 2026",
    tag: "General",
    title: "Central Library Extended Reading Hall Timings during End-Semester Examinations.",
  },
];

const CATEGORY_META: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  Academic: { icon: GraduationCap, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-800/40" },
  Exams: { icon: FileText, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/40", border: "border-purple-200 dark:border-purple-800/40" },
  Placements: { icon: Briefcase, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800/40" },
  Hostel: { icon: Home, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-800/40" },
  "R&D": { icon: Sparkles, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/40", border: "border-pink-200 dark:border-pink-800/40" },
  Event: { icon: Trophy, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/40", border: "border-orange-200 dark:border-orange-800/40" },
  General: { icon: Bell, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/60", border: "border-slate-200 dark:border-slate-700/40" },
};

function NoticesPage() {
  const dbNotices = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [previewNotice, setPreviewNotice] = useState<any | null>(null);
  const [showAdminAdd, setShowAdminAdd] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newNotice, setNewNotice] = useState({
    date: "",
    tag: "Academic",
    title: "",
    url: "",
  });

  const rawNotices = dbNotices && dbNotices.length > 0 ? dbNotices : DEFAULT_NOTICES;

  const parseDate = (dStr: string) => {
    if (!dStr) return 0;
    const t = Date.parse(dStr);
    return isNaN(t) ? 0 : t;
  };

  const sortedNotices = useMemo(() => {
    return [...rawNotices].sort((a, b) => {
      const timeA = parseDate(a.date);
      const timeB = parseDate(b.date);
      if (timeA && timeB && timeA !== timeB) return timeB - timeA;
      return (b.id || 0) - (a.id || 0);
    });
  }, [rawNotices]);

  const categories = ["All", "Academic", "Exams", "Placements", "Hostel", "R&D", "Event", "General"];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: sortedNotices.length };
    for (const n of sortedNotices) {
      const tag = n.tag || "General";
      counts[tag] = (counts[tag] || 0) + 1;
    }
    return counts;
  }, [sortedNotices]);

  const filteredNotices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedNotices.filter((n) => {
      const matchesCat =
        activeCategory === "All" ||
        (n.tag || "").toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        !q ||
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.tag && n.tag.toLowerCase().includes(q)) ||
        (n.date && n.date.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [sortedNotices, activeCategory, searchQuery]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", "notices");
    formData.append("category", "date");

    const tId = toast.loading(`Uploading ${file.name}...`);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        const assetUrl = `http://89.116.134.182/${json.path}`;
        setNewNotice((prev) => ({ ...prev, url: assetUrl }));
        toast.success(`Uploaded successfully!`, { id: tId });
      } else {
        toast.error(json.error || "Upload failed", { id: tId });
      }
    } catch (err: any) {
      toast.error("Failed to upload file", { id: tId });
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd() {
    if (!newNotice.title.trim()) {
      toast.error("Please enter a notice title.");
      return;
    }
    const tId = toast.loading("Publishing notice...");
    try {
      await addNotice({
        data: {
          title: newNotice.title,
          tag: newNotice.tag,
          date: newNotice.date || new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
          link: newNotice.url || undefined,
        },
      });
      toast.success("Notice published successfully!", { id: tId });
      setNewNotice({ date: "", tag: "Academic", title: "", url: "" });
      setShowAdminAdd(false);
      router.invalidate();
    } catch {
      toast.error("Failed to publish notice.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Deleting notice...");
    try {
      await deleteNotice({ data: { id } });
      toast.success("Notice removed!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to delete notice.", { id: tId });
    }
  }

  // Format date helper: returns { day, monthYear }
  const formatNoticeDate = (dStr: string) => {
    if (!dStr) return { day: "--", monthYear: "Recent" };
    const dateObj = new Date(dStr);
    if (!isNaN(dateObj.getTime())) {
      const day = dateObj.toLocaleDateString("en-US", { day: "2-digit" });
      const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
      const year = dateObj.getFullYear();
      return { day, monthYear: `${month} ${year}` };
    }
    const parts = dStr.split(" ");
    if (parts.length >= 2) {
      return { day: parts[0], monthYear: parts.slice(1).join(" ") };
    }
    return { day: "10", monthYear: dStr };
  };

  return (
    <div className="bg-slate-50/60 dark:bg-slate-950 min-h-screen">
      {isEditMode && <AdminModeBanner label="Notices & Bulletins CMS Active" />}

      <PageHero
        eyebrow="Announcements & Bulletins"
        title="Official Circulars & Notices"
        subtitle="Live announcements, exam timetables, academic calendars and circulars issued by the Principal's Office and University Departments."
        image={libraryImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      <main className="py-12 md:py-16 container-narrow">
        {/* Admin Publish Section */}
        {isEditMode && (
          <div className="mb-10">
            <div className="p-6 bg-amber-50/90 dark:bg-amber-950/30 border-2 border-dashed border-amber-300 dark:border-amber-700/60 rounded-3xl shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-600" />
                    Publish New Notice / Circular
                  </h3>
                  <p className="text-xs text-amber-800/80 dark:text-amber-400 mt-0.5">
                    Upload official PDF circulars or announce general updates to the entire student & faculty portal.
                  </p>
                </div>
                <button
                  onClick={() => setShowAdminAdd((v) => !v)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {showAdminAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {showAdminAdd ? "Cancel" : "New Notice"}
                </button>
              </div>

              {showAdminAdd && (
                <div className="pt-4 border-t border-amber-200 dark:border-amber-800/40 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5">
                        Notice Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        placeholder="e.g. Timetable for B.Tech End Examinations released..."
                        className="w-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5">
                        Category Tag
                      </label>
                      <select
                        className="w-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        value={newNotice.tag}
                        onChange={(e) => setNewNotice({ ...newNotice, tag: e.target.value })}
                      >
                        {categories.filter((c) => c !== "All").map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5">
                        Upload Document (PDF)
                      </label>
                      <label className="flex items-center justify-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl font-bold text-xs cursor-pointer transition">
                        <Upload className="w-4 h-4" />
                        <span>{uploading ? "Uploading..." : "Choose File"}</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>

                  {newNotice.url && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
                      <span className="truncate">Uploaded File: {newNotice.url}</span>
                      <button
                        onClick={() => setNewNotice((prev) => ({ ...prev, url: "" }))}
                        className="text-rose-600 hover:underline text-[11px] ml-2 shrink-0 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={handleAdd}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-xs cursor-pointer shadow-md transition"
                    >
                      <Plus className="w-4 h-4" /> Publish Announcement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm mb-8 space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search bar with real-time clear */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search circulars, exam timetables, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/40 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Results Counter & Reset */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>
                Showing <strong className="text-blue-600 dark:text-blue-400">{filteredNotices.length}</strong> of{" "}
                {sortedNotices.length} notices
              </span>
              {(searchQuery || activeCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat] || { icon: Layers, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" };
              const Icon = meta.icon;
              const count = categoryCounts[cat] || 0;
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    isActive
                      ? "bg-slate-950 text-white dark:bg-blue-600 border-slate-950 dark:border-blue-600 shadow-md scale-[1.02]"
                      : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-300" : meta.color}`} />
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-extrabold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notices Cards Grid / List */}
        <div className="space-y-3.5">
          {filteredNotices.map((n: any, i: number) => {
            const meta = CATEGORY_META[n.tag] || CATEGORY_META.General;
            const Icon = meta.icon;
            const { day, monthYear } = formatNoticeDate(n.date);

            return (
              <RevealOnScroll key={n.id || n.title + i} delay={Math.min(i * 30, 300)}>
                <article className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-lg transition-all duration-300 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left block: Date badge + Category + Title */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Visual Date Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/70 dark:from-slate-800 dark:to-slate-850 border border-slate-200/70 dark:border-slate-700 flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <span className="text-base font-black text-slate-900 dark:text-white leading-none font-mono">
                        {day}
                      </span>
                      <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-0.5">
                        {monthYear}
                      </span>
                    </div>

                    {/* Notice Info */}
                    <div className="flex-1 min-w-0 space-y-1.5 cursor-pointer" onClick={() => setPreviewNotice(n)}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider border ${meta.bg} ${meta.color} ${meta.border}`}
                        >
                          <Icon className="w-3 h-3" />
                          {n.tag}
                        </span>

                        {i < 3 && activeCategory === "All" && !searchQuery && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9.5px] uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Latest
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {n.title}
                      </h4>
                    </div>
                  </div>

                  {/* Right actions: Preview & Download */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setPreviewNotice(n)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-200/70 dark:border-blue-800/60 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    {n.url ? (
                      <a
                        href={getAssetUrl(n.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    ) : null}

                    {isEditMode && n.id && (
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 dark:border-rose-800/60 rounded-xl transition cursor-pointer active:scale-95 ml-1"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}

          {/* Empty State */}
          {filteredNotices.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 grid place-items-center mx-auto mb-4">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No matching notices found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
                We couldn't find any announcements matching "{searchQuery}" in the {activeCategory} category. Try searching another keyword or clear filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Interactive Notice Preview Modal */}
      {previewNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-reveal">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/70 dark:bg-slate-850/60">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-[10.5px] uppercase tracking-wider border border-blue-200 dark:border-blue-800/60">
                    {previewNotice.tag}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {previewNotice.date}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {previewNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewNotice(null)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {previewNotice.url ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Document Viewer
                    </span>
                    <a
                      href={getAssetUrl(previewNotice.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      Open in New Window <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-950 relative">
                    <iframe
                      src={getAssetUrl(previewNotice.url)}
                      className="w-full h-full border-0"
                      title="Notice Document Preview"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <Bell className="w-4 h-4" /> Official Notice Announcement
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 text-base leading-relaxed font-semibold">
                    {previewNotice.title}
                  </p>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-400 font-medium">
                    Issued by JNTU-GV College of Engineering Vizianagaram Administration. Date: {previewNotice.date}.
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center justify-end gap-3">
              {previewNotice.url && (
                <a
                  href={getAssetUrl(previewNotice.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Document
                </a>
              )}
              <button
                onClick={() => setPreviewNotice(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
