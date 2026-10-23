import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show after scrolling 280px down
      setVisible(scrollY > 280);

      // Calculate scroll progress percentage (0 - 100)
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setProgress(pct);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG circular progress parameters for the inner badge
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-5 left-5 sm:bottom-7 sm:left-7 z-40 transition-all duration-300 ease-out select-none ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
          : "opacity-0 translate-y-4 pointer-events-none scale-90"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        title="Back to top"
        className="group flex items-center gap-2 sm:gap-2.5 pl-1.5 pr-4 sm:pr-5 py-1.5 rounded-full bg-[#FAF8F5]/95 hover:bg-[#F4EFE6] dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 backdrop-blur-xl border border-[#E5DFD4] dark:border-slate-700/60 shadow-[0_8px_24px_rgba(60,45,30,0.12)] hover:shadow-[0_12px_32px_rgba(60,45,30,0.18)] hover:border-[#D6CEBF] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Circular Progress Badge with Arrow */}
        <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded-full bg-white dark:bg-slate-800 border border-[#E8E2D8] dark:border-slate-700 shadow-2xs shrink-0">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
            viewBox="0 0 36 36"
          >
            {/* Background track circle */}
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-[#E8E2D8] dark:text-slate-700"
            />
            {/* Dynamic progress fill in College Royal Blue */}
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="transparent"
              stroke="url(#capsuleProgressGradient)"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-150 ease-out"
            />
            <defs>
              <linearGradient id="capsuleProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </svg>

          {/* Upward Arrow Icon with micro-animation */}
          <ArrowUp className="w-4 h-4 text-blue-700 dark:text-sky-400 group-hover:text-blue-900 dark:group-hover:text-sky-300 group-hover:-translate-y-0.5 transition-all duration-300" />
        </div>

        {/* Clean Capsule Label without numbers */}
        <span className="text-xs sm:text-[13px] font-bold tracking-wide text-slate-800 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors whitespace-nowrap">
          Back to Top
        </span>
      </button>
    </div>
  );
}
