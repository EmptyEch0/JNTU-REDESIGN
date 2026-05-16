import { motion } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const NOTICES = [
  "End-semester examinations schedule released for B.Tech IV-II.",
  "Pre-placement talks for Capgemini and Hexaware on 02 May.",
  "Vacation guidelines for residents staying through summer.",
  "Annual cultural fest 'Spandana 2026' opens for registrations.",
  "Library timings extended during examination weeks.",
];

export function NoticeTicker() {
  return (
    <div className="w-full max-w-[1500px] mx-auto mt-4 animate-in fade-in slide-in-from-top-4 duration-700 delay-500 pointer-events-auto">
      <div className="relative h-9 bg-[oklch(0.16_0.04_255/0.8)] backdrop-blur-xl border border-white/10 rounded-full overflow-hidden flex items-center group shadow-2xl">
        {/* Label */}
        <div className="h-full px-4 bg-primary text-white flex items-center gap-2 shrink-0 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">
          <Bell className="h-3.5 w-3.5 animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Updates</span>
        </div>

        {/* Marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center whitespace-nowrap gap-12 h-full">
            <div className="flex items-center gap-12 animate-marquee hover:[animation-play-state:paused]">
              {[...NOTICES, ...NOTICES, ...NOTICES].map((text, i) => (
                <Link
                  key={i}
                  to="/notices"
                  className="flex items-center gap-3 shrink-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-glow shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                  <span className="text-[12px] font-medium text-white/70 hover:text-white transition-colors">
                    {text}
                  </span>
                  <ArrowRight className="h-3 w-3 text-primary-glow opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
