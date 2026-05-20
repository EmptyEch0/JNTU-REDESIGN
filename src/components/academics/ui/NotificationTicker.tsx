import { Link } from "@tanstack/react-router";
import { Calendar, Award, FileText, IndianRupee } from "lucide-react";
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
    bg: "bg-blue-500",
    text: "text-white",
    Icon: Calendar,
  },
  results: {
    label: "Results",
    bg: "bg-emerald-500",
    text: "text-white",
    Icon: Award,
  },
  "hall-ticket": {
    label: "Hall Ticket",
    bg: "bg-amber-400",
    text: "text-amber-900",
    Icon: FileText,
  },
  fee: {
    label: "Fee",
    bg: "bg-red-500",
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
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/50 shadow-lg">
      {/* Left label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 bg-gradient-to-r from-slate-900 via-slate-900/95 to-transparent">
        <div className="flex items-center gap-2 pr-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white whitespace-nowrap">
            Live Updates
          </span>
        </div>
      </div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none" />

      {/* Scrolling track */}
      <div className="overflow-hidden py-3 pl-36">
        <div
          className="marquee-track group"
          style={{ animationDuration: `${speedSeconds}s` }}
        >
          {doubled.map((item, idx) => {
            const cfg = SOURCE_CONFIG[item.source];
            return (
              <Link
                key={`${item.id}-${idx}`}
                to={item.to}
                className="inline-flex items-center gap-2.5 mx-6 whitespace-nowrap group/item"
              >
                {/* Source badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text} flex-shrink-0`}
                >
                  <cfg.Icon className="w-2.5 h-2.5" />
                  {cfg.label}
                </span>

                {/* Urgent dot */}
                {item.urgent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                )}

                {/* Text */}
                <span className="text-sm text-slate-300 group-hover/item:text-white transition-colors">
                  {item.text}
                </span>

                {/* Date */}
                <span className="text-xs text-slate-500 font-medium flex-shrink-0">
                  {item.date}
                </span>

                {/* Separator */}
                <span className="text-slate-700 text-lg font-light flex-shrink-0 ml-2">
                  ·
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
