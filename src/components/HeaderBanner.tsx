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
              src="/logo-circle.png"
              alt="JNTU-GV Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain drop-shadow-sm"
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

          {/* Right: Exact NBA Accreditation Logo & Text */}
          <div className="shrink-0 flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-slate-50 border border-slate-200/60 max-w-[150px] sm:max-w-[170px]">
            <span className="text-[9px] sm:text-[10px] font-bold text-[#CE1126] tracking-tight">
              Accredited by
            </span>
            
            {/* Exact NBA Stencil Vector Logo */}
            <div className="my-0.5 flex items-center justify-center">
              <svg
                viewBox="0 0 200 90"
                className="h-7 sm:h-8 w-auto"
                aria-label="NBA Logo"
              >
                <defs>
                  <linearGradient id="nbaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00C4CC" />
                    <stop offset="100%" stopColor="#0091EA" />
                  </linearGradient>
                </defs>

                {/* Letter N */}
                <path
                  d="M 10,10 L 25,10 L 25,60 L 60,60 L 60,10 L 75,10 L 75,80 L 55,80 L 25,35 L 25,80 L 10,80 Z"
                  fill="url(#nbaGrad)"
                />
                <path
                  d="M 28,15 L 28,32 L 52,68 L 52,15 Z"
                  fill="#ffffff"
                  opacity="0.2"
                />

                {/* Letter B */}
                <path
                  d="M 85,10 L 125,10 C 140,10 148,17 148,27 C 148,34 142,40 134,42 C 144,45 150,52 150,62 C 150,73 140,80 123,80 L 85,80 Z M 103,23 L 103,37 L 122,37 C 128,37 132,34 132,30 C 132,26 128,23 122,23 Z M 103,50 L 103,67 L 124,67 C 130,67 134,64 134,58 C 134,53 130,50 124,50 Z"
                  fill="url(#nbaGrad)"
                />

                {/* Letter A */}
                <path
                  d="M 158,80 L 173,10 C 175,10 195,10 200,30 C 200,55 200,80 200,80 L 184,80 L 184,65 L 173,65 L 173,80 Z M 174,27 L 174,52 L 185,52 C 185,42 185,32 184,27 Z"
                  fill="url(#nbaGrad)"
                />
              </svg>
            </div>

            <span className="text-[8px] sm:text-[9px] font-black text-[#00A8B5] tracking-wider uppercase text-center leading-none">
              NATIONAL BOARD OF ACCREDITATION
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold text-[#00838F] text-center mt-0.5">
              For B.Tech CSE, ECE.
            </span>
          </div>

        </div>
      </div>

      {/* Bottom Crimson Red Stripe */}
      <div className="h-0.5 w-full bg-[#CE1126]" />
    </div>
  );
}
