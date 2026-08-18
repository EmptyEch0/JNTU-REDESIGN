import { Link } from "@tanstack/react-router";

export function HeaderBanner() {
  return (
    <div className="w-full bg-white text-slate-900 border-b border-slate-200/80 shadow-xs relative z-40">
      {/* Top Navy Blue Stripe */}
      <div className="h-1 w-full bg-[#0F387A]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 sm:py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 text-center md:text-left">
          
          {/* Left: Official College Emblem */}
          <Link to="/" className="shrink-0 flex items-center justify-center group transition-transform duration-300 hover:scale-105">
            <img
              src="/logo.png"
              alt="JNTU-GV Logo"
              className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain drop-shadow-sm"
              decoding="async"
              fetchPriority="high"
            />
          </Link>

          {/* Center: College Name & Details (Compact Height) */}
          <div className="flex-1 flex flex-col items-center text-center">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-tight text-[#0F387A] leading-tight font-display">
              JNTU-GV COLLEGE OF ENGINEERING, VIZIANAGARAM
            </h1>
            
            <h2 className="text-[11px] sm:text-xs md:text-sm font-extrabold tracking-tight text-[#CE1126] leading-tight mt-0.5 uppercase">
              JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY-GURAJADA VIZIANAGARAM
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 mt-0.5">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 tracking-wide uppercase">
                DWARAPUDI, VIZIANAGARAM, ANDHRA PRADESH - 535 003.
              </p>
              <span className="hidden sm:inline text-slate-400 text-[10px]">•</span>
              <p className="text-[9px] sm:text-[10px] font-semibold text-emerald-800 italic">
                ( A constituent college of JNTU-GV & Approved by AICTE, New Delhi ) ( Recognised by UGC under section 2(f) & 12(B) of UGC Act 1956 )
              </p>
            </div>
          </div>

          {/* Right: NBA Accreditation Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <img
              src="/nba-logo.png"
              alt="NBA Accredited - National Board of Accreditation"
              className="h-14 sm:h-16 md:h-20 w-auto object-contain drop-shadow-sm"
              decoding="async"
            />
          </div>

        </div>
      </div>

      {/* Bottom Crimson Red Stripe */}
      <div className="h-0.5 w-full bg-[#CE1126]" />
    </div>
  );
}
