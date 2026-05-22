import { Link } from "@tanstack/react-router";
import { Calendar, Award, FileText, Clock, Bell, Palmtree, GraduationCap, IndianRupee } from "lucide-react";
import type { TickerNotification, TickerSource } from "@/data/academics-events";

interface NotificationTickerProps {
  items: TickerNotification[];
  speedSeconds?: number; // default 40s — matches global marquee speed
}

const SOURCE_CONFIG: Record<
  TickerSource,
  { label: string; bg: string; text: string; Icon: React.ElementType }
> = {
  calendar: {
    label: "Calendar",
    bg: "bg-blue-600 dark:bg-blue-700",
    text: "text-white",
    Icon: Calendar,
  },
  holiday: {
    label: "Holiday",
    bg: "bg-emerald-600 dark:bg-emerald-700",
    text: "text-white",
    Icon: Palmtree,
  },
  "exam-sched": {
    label: "Exam Schedule",
    bg: "bg-indigo-600 dark:bg-indigo-700",
    text: "text-white",
    Icon: GraduationCap,
  },
  "exam-notif": {
    label: "Exam Notice",
    bg: "bg-blue-500 dark:bg-blue-600",
    text: "text-white",
    Icon: Bell,
  },
  "hall-ticket": {
    label: "Hall Ticket",
    bg: "bg-amber-500 dark:bg-amber-600",
    text: "text-white",
    Icon: FileText,
  },
  results: {
    label: "Results",
    bg: "bg-teal-600 dark:bg-teal-700",
    text: "text-white",
    Icon: Award,
  },
  timetable: {
    label: "Timetable",
    bg: "bg-violet-600 dark:bg-violet-750",
    text: "text-white",
    Icon: Clock,
  },
  fee: {
    label: "Fee",
    bg: "bg-indigo-650 dark:bg-indigo-850",
    text: "text-white",
    Icon: IndianRupee,
  },
};

export function NotificationTicker({
  items,
  speedSeconds = 40,
}: NotificationTickerProps) {
  if (items.length === 0) return null;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 dark:from-slate-900/60 dark:to-slate-800/40 border border-blue-100 dark:border-slate-800/80 shadow-sm">
      {/* Left label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 bg-gradient-to-r from-blue-50 via-blue-50/95 to-transparent dark:from-slate-900 dark:via-slate-900/95">
        <div className="flex items-center gap-2 pr-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-900 dark:text-blue-200 whitespace-nowrap">
            Live Updates
          </span>
        </div>
      </div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-indigo-50/40 to-transparent dark:from-slate-900 pointer-events-none" />

      {/* Scrolling track */}
      <div className="overflow-hidden py-3.5 pl-36">
        <div
          className="marquee-track group animate-marquee"
          style={{ animationDuration: `${speedSeconds}s` }}
        >
          {doubled.map((item, idx) => {
            const cfg = SOURCE_CONFIG[item.source];
            const isExternal = item.to.startsWith("http://") || item.to.startsWith("https://") || item.to.endsWith(".pdf");
            const className = "inline-flex items-center gap-2.5 mx-6 whitespace-nowrap group/item";

            const linkContent = (
              <>
                {/* Source badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text} flex-shrink-0 shadow-sm`}
                >
                  <cfg.Icon className="w-2.5 h-2.5" />
                  {cfg.label}
                </span>

                {/* Urgent dot */}
                {item.urgent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
                )}

                {/* Text */}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                  {item.text}
                </span>

                {/* Date */}
                <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-bold flex-shrink-0 bg-blue-100/40 dark:bg-blue-950/20 px-2 py-0.5 rounded-md">
                  {item.date}
                </span>

                {/* Separator */}
                <span className="text-blue-200 dark:text-slate-700 text-lg font-light flex-shrink-0 ml-2">
                  ·
                </span>
              </>
            );

            if (isExternal) {
              return (
                <a
                  key={`${item.id}-${idx}`}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {linkContent}
                </a>
              );
            }

            return (
              <Link
                key={`${item.id}-${idx}`}
                to={item.to}
                className={className}
              >
                {linkContent}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

