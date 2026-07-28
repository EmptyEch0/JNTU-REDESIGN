import { motion } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const NOTICES = [
  {
    title: "Academic Calendar for II B.Tech (2026-2027)",
    date: "June 18, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/ii-b-tech-academic-calendar-june-2026.pdf"
  },
  {
    title: "Timetable for I-MCA II-Semester (R25) End Examinations, June-2026",
    date: "June 16, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-mca-ii-semester-r25-end-examinations-june-2026.pdf"
  },
  {
    title: "Timetable for I-MBA II-Semester (R25) End Examinations, June-2026",
    date: "June 16, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-mba-ii-semester-r25-end-examinations-june-2026.pdf"
  },
  {
    title: "Timetable for I-MCA II-Semester (R20) Supply End Examinations, June-2026",
    date: "June 16, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-mca-ii-semester-r20-supply-end-examinations-june-2026.pdf"
  },
  {
    title: "Notification for M.Tech II-Semester (R25/R19) Regular/Supplementary Examinations, June-2026",
    date: "June 16, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/mtech-ii-sem-r25-r19-examination-notification-june-2026.pdf"
  },
  {
    title: "Timetable for I-II R23 End Examinations, June-2026",
    date: "June 12, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-ii-r23-end-time-table-june-2026.pdf"
  },
  {
    title: "Timetable for I-II R20 End Examinations, June-2026",
    date: "June 12, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-ii-r20-end-time-table-june-2026.pdf"
  },
  {
    title: "Academic Calendar for III B.Tech (2026-2027)",
    date: "June 5, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/iii-b-tech-academic-calendar.pdf"
  },
  {
    title: "Academic Calendar for IV B.Tech (2026-2027)",
    date: "June 5, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/iv-b-tech-academic-calendar.pdf"
  },
  {
    title: "Timetable for I-B.Tech II-Semester II-Mid Examinations, June-2026",
    date: "June 5, 2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-btech-ii-mid-time-table-june-2026.pdf"
  }
];

export function NoticeTicker() {
  return (
    <div className="w-full max-w-[1500px] mx-auto mt-4 animate-in fade-in slide-in-from-top-4 duration-300 delay-100 pointer-events-auto">
      <div className="relative h-9 bg-[oklch(0.16_0.04_255/0.8)] backdrop-blur-xl border border-white/10 rounded-full overflow-hidden flex items-center group shadow-2xl marquee-container">
        {/* Label */}
        <Link
          to="/notices"
          className="h-full px-4 bg-primary hover:bg-primary/90 text-white flex items-center gap-2 shrink-0 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.3)] transition-colors cursor-pointer"
        >
          <Bell className="h-3.5 w-3.5 animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Updates</span>
        </Link>

        {/* Marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center whitespace-nowrap gap-12 h-full">
            <div className="flex items-center gap-12 animate-marquee">
              {[...NOTICES, ...NOTICES, ...NOTICES].map((notice, i) => (
                <Link
                  key={i}
                  to="/notices"
                  className="flex items-center gap-3 shrink-0 group/item cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-glow shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                  <span className="text-[12px] font-medium text-white/70 group-hover/item:text-white group-hover/item:underline transition-colors">
                    {notice.title} <span className="text-white/40 text-[10px] ml-1">({notice.date})</span>
                  </span>
                  <ArrowRight className="h-3 w-3 text-primary-glow opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Fades */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-zinc-900/40 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-zinc-900/40 to-transparent pointer-events-none z-10" />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 85s linear infinite;
        }
        .marquee-container:hover .animate-marquee,
        .animate-marquee:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}
