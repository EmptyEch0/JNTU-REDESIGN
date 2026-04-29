import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, GraduationCap } from "lucide-react";
import { NAV, SITE } from "@/lib/site";

export function MegaMenu() {
  const [scrolled, setScrolled] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenIdx(null);
  }, [path]);

  const expanded = scrolled || openIdx !== null || mobileOpen;

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="flex justify-center px-3 sm:px-4">
        <div
          className={`pointer-events-auto mt-3 sm:mt-4 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
            expanded
              ? "w-full max-w-[1180px] rounded-[28px] bg-[oklch(0.18_0.04_255/0.82)] backdrop-blur-2xl shadow-[0_20px_60px_-20px_oklch(0.20_0.10_255/0.55),inset_0_1px_0_oklch(1_0_0/0.08)] border border-white/10"
              : "w-auto rounded-full bg-[oklch(0.16_0.04_255/0.88)] backdrop-blur-2xl shadow-[0_12px_40px_-12px_oklch(0.20_0.10_255/0.6),inset_0_1px_0_oklch(1_0_0/0.1)] border border-white/10"
          }`}
          onMouseLeave={() => setOpenIdx(null)}
        >
          <div className={`flex items-center gap-2 transition-all duration-500 ${expanded ? "px-4 sm:px-5 h-16" : "px-3 h-12"}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className={`rounded-full bg-gradient-to-br from-primary-glow to-primary text-primary-foreground grid place-items-center transition-all duration-500 ${expanded ? "h-9 w-9" : "h-7 w-7"}`}>
                <GraduationCap className={expanded ? "h-4 w-4" : "h-3.5 w-3.5"} />
              </div>
              <div className={`leading-tight overflow-hidden transition-all duration-500 ${expanded ? "max-w-[260px] opacity-100" : "max-w-0 opacity-0 lg:max-w-[120px] lg:opacity-100"}`}>
                <div className="text-sm font-semibold text-white whitespace-nowrap">{SITE.name}</div>
                {expanded && (
                  <div className="text-[9px] uppercase tracking-[0.18em] text-white/50 hidden sm:block whitespace-nowrap">
                    College of Engineering · Vizianagaram
                  </div>
                )}
              </div>
            </Link>

            {/* Divider */}
            <div className="hidden lg:block h-6 w-px bg-white/10 mx-1" />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {NAV.map((item, i) => {
                const active = item.to === path || (item.groups?.some((g) => g.items.some((it) => it.to === path)) ?? false);
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenIdx(item.groups ? i : null)}
                  >
                    {item.to ? (
                      <Link
                        to={item.to}
                        className={`px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all ${
                          active ? "bg-white/10 text-white" : "text-white/75 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        className={`flex items-center gap-1 px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all ${
                          active || openIdx === i ? "bg-white/10 text-white" : "text-white/75 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${openIdx === i ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* CTA */}
            <Link
              to="/admissions"
              className={`hidden lg:inline-flex items-center justify-center rounded-full bg-white text-ink font-medium transition-all hover:bg-white/90 shrink-0 ${
                expanded ? "px-4 py-1.5 text-[13px]" : "px-3 py-1 text-xs"
              }`}
            >
              Apply
            </Link>

            {/* Mobile toggle */}
            <button
              className="lg:hidden ml-auto p-1.5 text-white rounded-full hover:bg-white/10"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mega dropdown panel — morphs INSIDE the island */}
          {openIdx !== null && NAV[openIdx]?.groups && (
            <div className="hidden lg:block px-5 pb-5 animate-[fade-in_0.3s_ease-out]">
              <div className="border-t border-white/10 pt-5 grid grid-cols-2 gap-6">
                {NAV[openIdx].groups!.map((g) => (
                  <div key={g.title}>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary-glow mb-3">
                      {g.title}
                    </div>
                    <ul className="space-y-1">
                      {g.items.map((it) => (
                        <li key={it.label}>
                          <Link
                            to={it.to}
                            className="block rounded-xl p-2.5 hover:bg-white/5 transition-colors group"
                          >
                            <div className="text-sm font-medium text-white group-hover:text-primary-glow transition-colors">
                              {it.label}
                            </div>
                            {it.desc && (
                              <div className="text-xs text-white/50 mt-0.5">{it.desc}</div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile drawer — morphs INSIDE the island */}
          {mobileOpen && (
            <div className="lg:hidden px-4 pb-4 max-h-[75vh] overflow-y-auto animate-[fade-in_0.3s_ease-out]">
              <div className="border-t border-white/10 pt-3 space-y-1">
                {NAV.map((item) => (
                  <div key={item.label} className="py-1">
                    {item.to ? (
                      <Link to={item.to} className="block py-2 px-2 text-sm font-medium text-white rounded-lg hover:bg-white/5">
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary-glow py-2 px-2">
                          {item.label}
                        </div>
                        <div className="pl-2 space-y-0.5">
                          {item.groups?.flatMap((g) => g.items).map((it) => (
                            <Link key={it.label} to={it.to} className="block py-1.5 px-2 text-sm text-white/70 rounded-lg hover:bg-white/5 hover:text-white">
                              {it.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <Link to="/admissions" className="block text-center mt-3 px-4 py-2.5 rounded-full bg-white text-ink font-medium text-sm">
                  Apply Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
