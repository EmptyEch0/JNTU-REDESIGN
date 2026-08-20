import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Download,
  ExternalLink,
  Search,
  Calendar,
  Layers,
  GraduationCap,
  Clock,
  Briefcase,
  Sparkles,
  Trophy,
  Home,
  ArrowRight,
  FileText,
  X,
  ChevronRight,
} from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useQuery } from "@tanstack/react-query";
import { getNotices } from "@/funcs/site.server";
import { getAssetUrl } from "@/lib/assets";

const CATEGORIES = [
  { id: "All", label: "All", icon: Layers },
  { id: "Academic", label: "Academic", icon: GraduationCap },
  { id: "Exams", label: "Exams", icon: Clock },
  { id: "Placements", label: "Placements", icon: Briefcase },
  { id: "Admissions", label: "Admissions", icon: Sparkles },
  { id: "Events", label: "Events", icon: Trophy },
  { id: "Tenders", label: "Tenders", icon: Home },
  { id: "Others", label: "Others", icon: Bell },
];

export function matchNoticeCategory(noticeTag: string, targetCategory: string): boolean {
  if (!targetCategory || targetCategory === "All") return true;

  const tag = (noticeTag || "").trim().toLowerCase();
  const cat = targetCategory.trim().toLowerCase();

  if (cat === "academic" || cat === "academics") {
    return tag.includes("academic");
  }
  if (cat === "exams" || cat === "exam") {
    return tag.includes("exam");
  }
  if (cat === "placements" || cat === "placement") {
    return tag.includes("placement");
  }
  if (cat === "admissions" || cat === "admission") {
    return tag.includes("admission");
  }
  if (cat === "events" || cat === "event") {
    return tag.includes("event");
  }
  if (cat === "tenders" || cat === "tender") {
    return tag.includes("tender");
  }
  if (cat === "others" || cat === "other") {
    const isPrimary =
      tag.includes("academic") ||
      tag.includes("exam") ||
      tag.includes("placement") ||
      tag.includes("admission") ||
      tag.includes("event") ||
      tag.includes("tender");
    return !isPrimary;
  }

  return tag === cat;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Academic: { bg: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300", text: "text-blue-600", border: "border-blue-200/80" },
  Exams: { bg: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300", text: "text-amber-600", border: "border-amber-200/80" },
  Placements: { bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300", text: "text-emerald-600", border: "border-emerald-200/80" },
  Admissions: { bg: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300", text: "text-violet-600", border: "border-violet-200/80" },
  Events: { bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300", text: "text-rose-600", border: "border-rose-200/80" },
  Tenders: { bg: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300", text: "text-cyan-600", border: "border-cyan-200/80" },
  Others: { bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", text: "text-slate-600", border: "border-slate-200" },
  General: { bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", text: "text-slate-600", border: "border-slate-200" },
};

function getNoticeTagStyle(tag: string) {
  for (const key of Object.keys(CATEGORY_STYLES)) {
    if (matchNoticeCategory(tag, key)) {
      return CATEGORY_STYLES[key];
    }
  }
  return CATEGORY_STYLES.Others;
}

export function HomeNotificationsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rawNotices = [], isLoading } = useQuery({
    queryKey: ["notices", "all"],
    queryFn: () => getNotices(),
  });

  const filteredNotices = useMemo(() => {
    return (rawNotices as any[]).filter((n) => {
      const matchesCat = matchNoticeCategory(n.tag, activeCategory);
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (n.title && n.title.toLowerCase().includes(query)) ||
        (n.tag && n.tag.toLowerCase().includes(query)) ||
        (n.date && n.date.toLowerCase().includes(query));

      return matchesCat && matchesSearch;
    });
  }, [rawNotices, activeCategory, searchQuery]);

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
    <section className="py-20 md:py-28 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container-narrow">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <RevealOnScroll>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-primary uppercase mb-2.5">
                <Bell className="w-3.5 h-3.5 animate-pulse text-primary" />
                <span>OFFICIAL UPDATES & NOTICES</span>
              </div>
              <h2 className="text-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink leading-tight">
                Campus <span className="text-primary italic">Notices</span> & Circulars
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
                Stay informed with the latest academic timetables, exam results, admission notifications, and tenders.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              <span>View All Notices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </RevealOnScroll>
        </div>

        {/* Filter Pills & Search Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-3xl p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full py-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md scale-[1.02]"
                        : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary dark:text-blue-600" : "text-slate-400"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-primary transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notices Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-3xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/60 dark:border-slate-700/50"
              />
            ))}
          </div>
        ) : filteredNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredNotices.slice(0, 8).map((n: any, index: number) => {
                const dateInfo = formatNoticeDate(n.date);
                const tagStyle = getNoticeTagStyle(n.tag);
                const isExternal = Boolean(n.url && n.url.startsWith("http"));
                const noticeUrl = n.url ? (isExternal ? n.url : getAssetUrl(n.url)) : "#";

                return (
                  <motion.div
                    key={n.id || index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="group relative bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 flex items-start gap-4 sm:gap-5"
                  >
                    {/* Date Block */}
                    <div className="shrink-0 flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-18 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 p-2 shadow-xs group-hover:scale-105 group-hover:bg-primary transition-all">
                      <span className="text-lg sm:text-xl font-extrabold leading-none tracking-tight">
                        {dateInfo.day}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1 leading-tight text-center">
                        {dateInfo.monthYear}
                      </span>
                    </div>

                    {/* Notice Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                      <div>
                        {/* Category Tag */}
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${tagStyle.bg} ${tagStyle.border}`}
                          >
                            {n.tag || "General"}
                          </span>
                          {index < 2 && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {n.title}
                        </h3>
                      </div>

                      {/* Action Link */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {n.date || "Recent"}
                        </span>

                        {n.url ? (
                          <a
                            href={noticeUrl}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Download / View</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <Link
                            to="/notices"
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No notices found
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No announcements matching "${searchQuery}" in the ${activeCategory} category.`
                : `There are currently no active announcements in the ${activeCategory} category.`}
            </p>
            {(searchQuery || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-4 text-xs font-bold text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* View All Footer Callout */}
        {filteredNotices.length > 8 && (
          <div className="mt-10 text-center">
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <span>View All {rawNotices.length} Notices & Circulars</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
