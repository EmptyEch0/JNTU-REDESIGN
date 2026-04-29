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

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "glass-panel shadow-[0_4px_24px_-8px_oklch(0.3_0.1_250/0.12)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-elegant)] group-hover:rotate-6 transition-transform duration-500">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-display text-base md:text-lg text-ink">{SITE.name}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground hidden sm:block">
              College of Engineering · Vizianagaram
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpenIdx(null)}>
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
                    className="px-4 py-2 text-sm font-medium text-foreground story-link rounded-md hover:text-primary transition-colors"
                    data-active={active}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground story-link rounded-md hover:text-primary transition-colors"
                    data-active={active}
                  >
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
                  </button>
                )}

                {item.groups && openIdx === i && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3"
                    style={{ minWidth: 540 }}
                  >
                    <div className="glass-panel rounded-2xl p-6 shadow-[var(--shadow-card-hover)] grid grid-cols-2 gap-6 animate-[fade-up_0.3s_ease-out]">
                      {item.groups.map((g) => (
                        <div key={g.title}>
                          <div className="text-eyebrow mb-3">{g.title}</div>
                          <ul className="space-y-2">
                            {g.items.map((it) => (
                              <li key={it.label}>
                                <Link
                                  to={it.to}
                                  className="block rounded-lg p-2 -mx-2 hover:bg-sand transition-colors group"
                                >
                                  <div className="text-sm font-medium text-ink group-hover:text-primary transition-colors">
                                    {it.label}
                                  </div>
                                  {it.desc && (
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {it.desc}
                                    </div>
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
              </div>
            );
          })}
          <Link to="/admissions" className="ml-3 btn-primary text-sm py-2.5 px-5">
            Apply Now
          </Link>
        </nav>

        <button
          className="lg:hidden p-2 -mr-2 text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md max-h-[80vh] overflow-y-auto">
          <div className="container-narrow py-4 space-y-1">
            {NAV.map((item) => (
              <div key={item.label} className="py-1.5">
                {item.to ? (
                  <Link to={item.to} className="block py-2 font-medium text-ink">
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div className="text-eyebrow py-2">{item.label}</div>
                    <div className="pl-3 space-y-1">
                      {item.groups?.flatMap((g) => g.items).map((it) => (
                        <Link key={it.label} to={it.to} className="block py-1.5 text-sm text-foreground">
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
            <Link to="/admissions" className="btn-primary w-full mt-3">
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
