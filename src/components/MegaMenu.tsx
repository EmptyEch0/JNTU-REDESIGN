import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu, X, ChevronDown, ChevronRight, GraduationCap, Search, CornerDownLeft, FileText, ArrowRight,
  Users, ShieldCheck, BookOpen, Building2, Landmark, Award, Globe, Compass,
  Sparkles, Clock, Download, Home, HeartPulse, Library, Trophy, Briefcase,
  Microscope, Heart, Info, MapPin, Layers, Scale, Lightbulb, Users2, FileCode, Activity
} from "lucide-react";
import { NAV, SEARCH_INDEX, SITE } from "@/lib/site";
import { uploadUrl } from "@/lib/assets";
import { useAdmin } from "@/context/AdminContext";
import { NoticeTicker } from "@/components/NoticeTicker";

function getItemIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("principal") && !l.includes("vice")) return Landmark;
  if (l.includes("vice principal")) return Users;
  if (l.includes("iqac")) return ShieldCheck;
  if (l.includes("institution") || l.includes("about")) return Info;
  if (l.includes("vision")) return Compass;
  if (l.includes("norms") || l.includes("recognition")) return Award;
  if (l.includes("jntuk")) return Globe;
  if (l.includes("vizianagaram")) return MapPin;
  if (l.includes("reach")) return Compass;
  if (l.includes("program")) return GraduationCap;
  if (l.includes("regulation")) return Scale;
  if (l.includes("syllabus")) return FileText;
  if (l.includes("scholarship")) return Sparkles;
  if (l.includes("cac") || l.includes("board") || l.includes("governing")) return Users2;
  if (l.includes("time") || l.includes("table")) return Clock;
  if (l.includes("download")) return Download;
  if (l.includes("computer") || l.includes("cse")) return FileCode;
  if (l.includes("electronic") || l.includes("ece")) return Activity;
  if (l.includes("electrical") || l.includes("eee")) return Lightbulb;
  if (l.includes("mechanical")) return Building2;
  if (l.includes("metallurg")) return Layers;
  if (l.includes("information") || l.includes("it")) return Globe;
  if (l.includes("mba")) return Briefcase;
  if (l.includes("sciences") || l.includes("humanities")) return Microscope;
  if (l.includes("hostel")) return Home;
  if (l.includes("dispensary")) return HeartPulse;
  if (l.includes("bank")) return Landmark;
  if (l.includes("library")) return Library;
  if (l.includes("sport")) return Trophy;
  if (l.includes("music") || l.includes("club")) return Sparkles;
  if (l.includes("nss") || l.includes("women")) return Heart;
  if (l.includes("edc") || l.includes("placement")) return Briefcase;
  return BookOpen;
}

export function MegaMenu() {
  const { isAdmin } = useAdmin() || {};
  const [scrolled, setScrolled] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeResult, setActiveResult] = useState(0);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const islandRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenIdx(null);
    setSearchOpen(false);
    setQuery("");
  }, [path]);

  const closeAll = () => {
    setOpenIdx(null);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  // Click outside + Escape
  useEffect(() => {
    if (openIdx === null && !mobileOpen && !searchOpen) return;
    const onClick = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openIdx, mobileOpen, searchOpen]);

  // Focus the input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    } else {
      setQuery("");
      setActiveResult(0);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_INDEX.slice(0, 8);
    return SEARCH_INDEX.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.group.toLowerCase().includes(q) ||
        (r.keywords ?? "").toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  const expanded = scrolled || openIdx !== null || mobileOpen || searchOpen;

  const handleResultSelect = (to: string) => {
    closeAll();
    navigate({ to });
  };

  return (
    <header className={`fixed inset-x-0 z-50 pointer-events-none transition-all duration-300 ${isAdmin ? "top-12" : "top-0"}`}>
      {path === "/" && (
        <div className="w-full flex justify-center px-4 sm:px-8 pt-4 sm:pt-6 pointer-events-auto">
          <NoticeTicker />
        </div>
      )}
      <div className="flex justify-center px-3 sm:px-4">
        <div
          ref={islandRef}
          className={`pointer-events-auto ${path === "/" ? "mt-3 sm:mt-4" : "mt-6 sm:mt-8"} transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
            expanded
              ? "w-full max-w-[1400px] rounded-[32px] bg-[oklch(0.18_0.04_255/0.85)] backdrop-blur-2xl shadow-[0_20px_60px_-20px_oklch(0.20_0.10_255/0.55),inset_0_1px_0_oklch(1_0_0/0.08)] border border-white/10"
              : "w-auto rounded-full bg-[oklch(0.16_0.04_255/0.88)] backdrop-blur-2xl shadow-[0_12px_40px_-12px_oklch(0.20_0.10_255/0.6),inset_0_1px_0_oklch(1_0_0/0.1)] border border-white/10"
          }`}
          onMouseLeave={() => setOpenIdx(null)}
        >
          <div
            className={`flex items-center justify-between transition-all duration-200 ${expanded ? "px-6 sm:px-8 h-[72px]" : "px-4 h-14"}`}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={closeAll}>
              <div
                className={`rounded-full bg-white grid place-items-center transition-all duration-200 overflow-hidden border border-white/20 ${expanded ? "h-11 w-11" : "h-9 w-9"}`}
              >
                <img src="/logo-circle.png" alt="JNTU-GV Logo" className="h-full w-full object-cover" />
              </div>
              <div
                className={`leading-tight overflow-hidden transition-all duration-200 ${expanded ? "max-w-[260px] opacity-100" : "max-w-0 opacity-0 lg:max-w-[120px] lg:opacity-100"}`}
              >
                <div className="text-base font-bold text-white whitespace-nowrap">
                  {SITE.name}
                </div>
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
            <nav className={`hidden lg:flex items-center flex-1 justify-center transition-all duration-200 ${expanded ? "gap-1" : "gap-0.5"}`}>
              {NAV.map((item, i) => {
                const active =
                  item.to === path ||
                  (item.groups?.some((g) => g.items.some((it) => it.to === path)) ?? false);
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenIdx(item.groups || item.simpleItems ? i : null)}
                  >
                    {item.to ? (
                      <Link
                        to={item.to}
                        className={`px-3.5 py-2 text-[14px] font-semibold rounded-full transition-all ${
                          active
                            ? "bg-white/15 text-white shadow-sm"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-semibold rounded-full transition-all ${
                          active || openIdx === i
                            ? "bg-white/15 text-white shadow-sm"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${openIdx === i ? "rotate-180 text-blue-300" : "text-white/50"}`}
                        />
                      </button>
                    )}
                    {/* Groups dropdown — glassmorphic popover */}
                    {openIdx === i && item.groups && !searchOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 animate-[fade-in_0.2s_ease-out]">
                        {/* Top Caret Arrow Notch */}
                        <div
                          className="absolute top-[4px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 z-10 pointer-events-none"
                          style={{
                            background: "rgba(15, 30, 55, 0.75)",
                            borderTop: "1px solid rgba(255, 255, 255, 0.18)",
                            borderLeft: "1px solid rgba(255, 255, 255, 0.18)",
                          }}
                        />

                        <div
                          className={`relative p-3.5 w-max ${
                            item.groups.length === 1 ? "min-w-[270px] max-w-[310px]" :
                            item.groups.length === 2 ? "min-w-[480px]" :
                            item.groups.length === 3 ? "min-w-[700px]" :
                            "min-w-[860px]"
                          }`}
                          style={{
                            background: "rgba(15, 30, 55, 0.95)",
                            backdropFilter: "blur(24px) saturate(150%)",
                            WebkitBackdropFilter: "blur(24px) saturate(150%)",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            borderRadius: "24px",
                            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                            overflow: "hidden",
                          }}
                        >
                          <div className={`grid gap-3.5 ${
                            item.groups.length === 1 ? "grid-cols-1" :
                            item.groups.length === 2 ? "grid-cols-2" :
                            item.groups.length === 3 ? "grid-cols-3" :
                            "grid-cols-4"
                          }`}>
                            {item.groups.map((g) => (
                              <div key={g.title}>
                                <div className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-blue-300 px-2 mb-1.5">
                                  {g.title}
                                </div>
                                <ul className="space-y-1">
                                  {g.items.map((it) => {
                                    const ItemIcon = getItemIcon(it.label);
                                    return (
                                      <li key={it.label}>
                                        <Link
                                          to={it.to}
                                          className="group flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 transition-all duration-200 cursor-pointer"
                                        >
                                          <div className="w-8.5 h-8.5 shrink-0 rounded-xl bg-white/10 border border-white/20 text-blue-200 flex items-center justify-center group-hover:bg-blue-600/40 group-hover:text-white transition-all shadow-inner">
                                            <ItemIcon className="w-4 h-4" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold text-white group-hover:text-cyan-200 transition-colors leading-tight">
                                              {it.label}
                                            </div>
                                            {it.desc && (
                                              <div className="text-[10px] text-white/60 group-hover:text-white/85 transition-colors leading-tight mt-0.5 line-clamp-1">
                                                {it.desc}
                                              </div>
                                            )}
                                          </div>
                                          <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all ml-auto shrink-0" />
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Simple nested list dropdown — glassmorphic popover */}
                    {openIdx === i && item.simpleItems && !searchOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 animate-[fade-in_0.2s_ease-out]">
                        {/* Top Caret Arrow Notch */}
                        <div
                          className="absolute top-[4px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 z-10 pointer-events-none"
                          style={{
                            background: "rgba(15, 30, 55, 0.75)",
                            borderTop: "1px solid rgba(255, 255, 255, 0.18)",
                            borderLeft: "1px solid rgba(255, 255, 255, 0.18)",
                          }}
                        />

                        <div
                          className="relative p-3.5 w-max min-w-[440px] max-w-[580px]"
                          style={{
                            background: "rgba(15, 30, 55, 0.95)",
                            backdropFilter: "blur(24px) saturate(150%)",
                            WebkitBackdropFilter: "blur(24px) saturate(150%)",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            borderRadius: "24px",
                            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                            overflow: "hidden",
                          }}
                        >
                          <ul className="grid grid-cols-2 gap-2.5">
                            {item.simpleItems.map((it) => {
                              const ItemIcon = getItemIcon(it.label);
                              return (
                                <li key={it.label} className="group/item relative">
                                  {it.children ? (
                                    <div className="bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-xl p-1 transition-all">
                                      <div className="flex items-center justify-between rounded-lg p-2 hover:bg-white/[0.1] transition-colors cursor-pointer group/trigger">
                                        <Link to={it.to} className="flex items-center gap-2.5 flex-1 min-w-0">
                                          <div className="w-8 h-8 shrink-0 rounded-lg bg-white/10 border border-white/20 text-blue-200 flex items-center justify-center">
                                            <ItemIcon className="w-4 h-4" />
                                          </div>
                                          <div className="min-w-0">
                                            <div className="text-xs font-semibold text-white group-hover/trigger:text-cyan-200 transition-colors">
                                              {it.label}
                                            </div>
                                            {it.desc && (
                                              <div className="text-[10px] text-white/60 line-clamp-1">{it.desc}</div>
                                            )}
                                          </div>
                                        </Link>
                                        <ChevronDown className="h-3.5 w-3.5 text-white/40 group-hover/item:rotate-180 transition-transform duration-300" />
                                      </div>
                                      <div className="max-h-0 group-hover/item:max-h-96 overflow-hidden transition-all duration-200 ease-in-out">
                                        <ul className="px-2 pb-1.5 pt-1 space-y-0.5">
                                          {it.children.map((child) => (
                                            <li key={child.label}>
                                              <Link
                                                to={child.to}
                                                className="block px-2.5 py-1 rounded-md text-[11px] text-white/70 hover:text-white hover:bg-white/10 transition-colors border-l border-white/15"
                                              >
                                                {child.label}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  ) : (
                                    <Link
                                      to={it.to}
                                      className="group flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 transition-all duration-200 cursor-pointer h-full"
                                    >
                                      <div className="w-8.5 h-8.5 shrink-0 rounded-xl bg-white/10 border border-white/20 text-blue-200 flex items-center justify-center group-hover:bg-blue-600/40 group-hover:text-white transition-all shadow-inner">
                                        <ItemIcon className="w-4 h-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-white group-hover:text-cyan-200 transition-colors leading-tight">
                                          {it.label}
                                        </div>
                                        {it.desc && (
                                          <div className="text-[10px] text-white/60 group-hover:text-white/85 transition-colors leading-tight mt-0.5 line-clamp-1">
                                            {it.desc}
                                          </div>
                                        )}
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all ml-auto shrink-0" />
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* UGC & Search */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              <a
                href={uploadUrl("2020/08/UGC-1-747x1024-1.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all ${
                  expanded ? "px-4 py-2 text-sm font-semibold" : "px-3 py-1.5 text-[11px] font-bold"
                }`}
                aria-label="UGC Certificate"
              >
                <FileText className="h-3 w-3" />
                {expanded && <span>UGC 2(f) & 12(B)</span>}
              </a>

            </div>

            {/* Spacer for balance */}
            <div className="hidden lg:block w-1" />

            {/* Mobile actions */}
            <div className="lg:hidden ml-auto flex items-center gap-1">

              <button
                className="p-2 text-white rounded-full hover:bg-white/10 active:scale-95 transition-transform"
                onClick={() => {
                  setMobileOpen((v) => !v);
                  setSearchOpen(false);
                }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile pill drawer */}
          {mobileOpen && (
            <div className="lg:hidden px-3 pb-3 max-h-[78vh] overflow-y-auto animate-[fade-in_0.15s_ease-out]">
              <div className="border-t border-white/10 pt-3 space-y-1.5">
                {/* UGC Link Mobile */}
                <a
                  href={uploadUrl("2020/08/UGC-1-747x1024-1.pdf")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3.5 px-4 text-[14px] font-bold text-primary-glow rounded-2xl bg-white/5 border border-white/10 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    UGC 2(f) & 12(B) Certificate
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </a>

                {NAV.map((item) => (
                  <div key={item.label}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="flex items-center justify-between py-3.5 px-4 text-[15px] font-medium text-white rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all"
                      >
                        {item.label}
                        <ChevronDown className="h-4 w-4 -rotate-90 text-white/40" />
                      </Link>
                    ) : (
                      <div className="rounded-2xl bg-white/5 overflow-hidden">
                        <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary-glow py-2.5 px-4 border-b border-white/5">
                          {item.label}
                        </div>
                        <div className="py-1">
                          {item.groups
                            ?.flatMap((g) => g.items)
                            .map((it) => (
                              <Link
                                key={it.label}
                                to={it.to}
                                className="block py-3 px-4 text-[14px] text-white/80 hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all"
                              >
                                {it.label}
                              </Link>
                            ))}
                          {item.simpleItems?.flatMap((it) => [
                            it,
                            ...(it.children?.map(c => ({ ...c, label: `└ ${c.label}` })) || [])
                          ]).map((sub) => (
                            <Link
                              key={sub.label + sub.to}
                              to={sub.to}
                              className={`block py-2.5 px-5 text-[13px] transition-all hover:bg-white/5 ${
                                sub.label.startsWith('└') ? 'text-white/50 pl-8' : 'text-white/80 mt-1 font-medium border-t border-white/5 pt-3'
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
