import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  Bell,
  Download,
  ExternalLink,
  Filter,
  Eye,
  X,
  Search,
  Calendar,
  FileText,
  GraduationCap,
  Briefcase,
  Home,
  Sparkles,
  Trophy,
  Layers,
  Clock,
  RotateCcw
} from "lucide-react";
import libraryImg from "@/assets/library-interior.webp";
import { SubNav } from "@/components/SubNav";
import { STUDENT_SUBNAV } from "@/lib/site";
import { useState, useMemo } from "react";
import { getNotices } from "@/funcs/site.server";
import { getAssetUrl } from "@/lib/assets";
import { NoticesPushBanner } from "@/components/PushNotificationBanner";

export const Route = createFileRoute("/notices")({
  loader: async () => await getNotices(),
  head: () => ({
    meta: [
      { title: "Notices & Announcements — JNTU-GV CEV" },
      { name: "description", content: "Official announcements and circulars from JNTU-GV Vizianagaram." },
      { property: "og:title", content: "Notices & Announcements — JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Stay updated with recent examination notifications, schedules, and college circulars.",
      },
      { property: "og:image", content: libraryImg },
    ],
  }),
  component: NoticesPage,
});

const categories = ["All", "Academic", "Exams", "Placements", "Admissions", "Events", "Tenders", "Others"];

const CATEGORY_META: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  All: { icon: Layers, color: "text-slate-650", bg: "bg-slate-50", border: "border-slate-200" },
  Academic: { icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50/70", border: "border-blue-100" },
  Exams: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50/70", border: "border-amber-100" },
  Placements: { icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50/70", border: "border-emerald-100" },
  Admissions: { icon: Sparkles, color: "text-violet-600", bg: "bg-violet-50/70", border: "border-violet-100" },
  Events: { icon: Trophy, color: "text-rose-600", bg: "bg-rose-50/70", border: "border-rose-100" },
  Tenders: { icon: Home, color: "text-cyan-600", bg: "bg-cyan-50/70", border: "border-cyan-100" },
  Others: { icon: Bell, color: "text-slate-600", bg: "bg-slate-50/70", border: "border-slate-100" },
  General: { icon: Bell, color: "text-slate-600", bg: "bg-slate-50/70", border: "border-slate-100" },
};

import { matchNoticeCategory } from "@/components/HomeNotificationsSection";

function NoticesPage() {
  const sortedNotices = Route.useLoaderData() as any[];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewNotice, setPreviewNotice] = useState<any | null>(null);

  // Search and Category filtering
  const filteredNotices = useMemo(() => {
    return (sortedNotices || []).filter((n) => {
      const matchesCat = matchNoticeCategory(n.tag, activeCategory);
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (n.title && n.title.toLowerCase().includes(query)) ||
        (n.tag && n.tag.toLowerCase().includes(query)) ||
        (n.date && n.date.toLowerCase().includes(query));

      return matchesCat && matchesSearch;
    });
  }, [sortedNotices, activeCategory, searchQuery]);

  const formatNoticeDate = (dStr: string) => {
    if (!dStr) return { day: "10", monthYear: "Aug 2026" };
    const dateObj = new Date(dStr);
    if (!isNaN(dateObj.getTime())) {
      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = dateObj.toLocaleDateString("en-US", { month: "short" });
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
      <PageHero
        eyebrow="Announcements & Bulletins"
        title="Official Circulars & Notices"
        subtitle="Live announcements, exam timetables, academic calendars and circulars issued by the Principal's Office and University Departments."
        image={libraryImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      <main className="py-12 md:py-16 container-narrow">
        {/* Instant Web Push Notification Callout */}
        <NoticesPushBanner />

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm mb-8 space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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

            {(searchQuery || activeCategory !== "All") && (
              <div className="flex items-center justify-end w-full md:w-auto">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-200/60 dark:border-blue-800/40"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Filter
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat] || { icon: Layers, color: "text-slate-650", bg: "bg-slate-50", border: "border-slate-200" };
              const Icon = meta.icon;
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
                </button>
              );
            })}
          </div>
        </div>

        {/* Notices Cards Grid */}
        <div className="space-y-3.5">
          {filteredNotices.map((n: any, i: number) => {
            const meta = CATEGORY_META[n.tag] || CATEGORY_META.General;
            const Icon = meta.icon;
            const { day, monthYear } = formatNoticeDate(n.date);

            return (
              <RevealOnScroll key={n.id || n.title + i} delay={Math.min(i * 30, 300)}>
                <article className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-lg transition-all duration-300 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/70 dark:from-slate-800 dark:to-slate-850 border border-slate-200/70 dark:border-slate-700 flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <span className="text-base font-black text-slate-900 dark:text-white leading-none font-mono">
                        {day}
                      </span>
                      <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-0.5">
                        {monthYear}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5 cursor-pointer" onClick={() => setPreviewNotice(n)}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider border ${meta.bg} ${meta.color} ${meta.border}`}
                        >
                          <Icon className="w-3 h-3" />
                          {n.tag}
                        </span>

                        {i < 3 && activeCategory === "All" && !searchQuery && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 font-bold text-[9.5px] uppercase tracking-wider">
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
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}

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
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-850/60 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 font-bold text-xs transition cursor-pointer"
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
