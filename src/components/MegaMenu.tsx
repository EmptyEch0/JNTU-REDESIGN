import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu, X, ChevronDown, ChevronRight, GraduationCap, Search, CornerDownLeft, FileText, ArrowRight,
  Users, ShieldCheck, BookOpen, Building2, Landmark, Award, Globe, Compass, Plane,
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
  if (l.includes("airport") || l.includes("aviation") || l.includes("connectivity") || l.includes("bhogapuram")) return Plane;
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
  if (l.includes("ragging")) return ShieldCheck;
  if (l.includes("rti")) return FileText;
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
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const islandRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scroll completely on mobile web when mobile menu or search is open
  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileOpen, searchOpen]);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenIdx(null);
    setSearchOpen(false);
    setQuery("");
    setExpandedMobileCategory(null);
  }, [path]);

  const closeAll = () => {
    setOpenIdx(null);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  // Click outside + Escape
  // NOTE: the mobile drawer is now rendered as a fixed, full-screen overlay that
  // lives OUTSIDE the `islandRef` pill (so it is never clipped/squashed by the
  // pill's own width/flex layout). Because of that we also need to check clicks
  // against `mobileDrawerRef` here, otherwise every click inside the drawer would
  // be treated as an "outside click" and immediately close the menu.
  useEffect(() => {
    if (openIdx === null && !mobileOpen && !searchOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideIsland = islandRef.current?.contains(target);
      const insideDrawer = mobileDrawerRef.current?.contains(target);
      if (!insideIsland && !insideDrawer) closeAll();
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
    <header className="w-full bg-transparent relative z-40 py-2 sm:py-2.5 flex justify-center px-2 sm:px-4 pointer-events-none -mb-14 sm:-mb-16">
      <div className="flex justify-center px-3 sm:px-4 bg-transparent w-full">
        <div
          ref={islandRef}
          className="pointer-events-auto my-0.5 w-auto max-w-[1400px] rounded-full bg-slate-950/85 backdrop-blur-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] border border-white/20 px-3 sm:px-5 py-1 transition-all duration-300 flex items-center justify-between gap-1.5 sm:gap-2"
          onMouseLeave={() => setOpenIdx(null)}
        >
          <div className="flex items-center justify-between w-full h-10 sm:h-10.5">
            {/* Mobile Header indicator */}
            <Link to="/" className="lg:hidden flex items-center gap-2 group shrink-0" onClick={closeAll}>
              <div className="rounded-full bg-white/10 p-1 border border-white/20 text-white">
                <Home className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">JNTU-GV CEV</span>
            </Link>

            {/* Desktop nav - Dynamic Island Menu Items */}
            <nav className="hidden lg:flex items-center justify-center gap-1">
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
                        className={`px-3 py-1.5 text-[13.5px] font-semibold rounded-full transition-all flex items-center gap-1.5 ${active || openIdx === i
                            ? "bg-white/20 text-white shadow-sm"
                            : "text-white/85 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        {item.label === "Home" && <Home className="h-3.5 w-3.5 text-cyan-300" />}
                        <span>{item.label}</span>
                        {(item.groups || item.simpleItems) && (
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${openIdx === i ? "rotate-180 text-cyan-300" : "text-white/50"}`}
                          />
                        )}
                      </Link>
                    ) : (
                      <button
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[13.5px] font-semibold rounded-full transition-all cursor-pointer ${active || openIdx === i
                            ? "bg-white/20 text-white shadow-sm"
                            : "text-white/85 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${openIdx === i ? "rotate-180 text-cyan-300" : "text-white/50"}`}
                        />
                      </button>
                    )}

                    {/* Groups dropdown — glassmorphic popover */}
                    {openIdx === i && item.groups && !searchOpen && (
                      <div className={`absolute top-full pt-2.5 z-50 animate-[fade-in_0.2s_ease-out] ${i <= 1 ? "left-0" : i >= NAV.length - 2 ? "right-0" : "left-1/2 -translate-x-1/2"
                        }`}>
                        {/* Top Caret Arrow Notch */}
                        <div
                          className={`absolute top-[4px] w-3.5 h-3.5 rotate-45 z-10 pointer-events-none ${i <= 1 ? "left-8" : i >= NAV.length - 2 ? "right-8" : "left-1/2 -translate-x-1/2"
                            }`}
                          style={{
                            background: "rgba(15, 30, 55, 0.75)",
                            borderTop: "1px solid rgba(255, 255, 255, 0.18)",
                            borderLeft: "1px solid rgba(255, 255, 255, 0.18)",
                          }}
                        />

                        <div
                          className={`relative p-3.5 w-max ${item.groups.length === 1 && item.groups[0].items.length > 4 ? "min-w-[480px]" :
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
                          {item.groups && item.groups.length > 0 && (
                            <div className={`grid gap-3.5 ${item.groups.length === 1 && item.groups[0]?.items.length > 4 ? "grid-cols-1" :
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
                                  <ul className={`space-y-1 ${item.groups?.length === 1 && g.items.length > 4 ? "grid grid-cols-2 gap-x-3 gap-y-1 space-y-0" : ""
                                    }`}>
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
                          )}
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
                className={`inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all ${expanded ? "px-4 py-2 text-sm font-semibold" : "px-3 py-1.5 text-[11px] font-bold"
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
        </div>
      </div>

      {/*
        MOBILE FULL-SCREEN DRAWER
        ------------------------------------------------------------------
        This is intentionally rendered OUTSIDE the `islandRef` pill and uses
        `fixed inset-0`, so it:
          1) Always covers the full viewport, wherever the user scrolled to
             when they tapped the menu button (fixes "opens at top of page").
          2) Is never squeezed by the pill's own auto width/flex layout, so
             labels and descriptions no longer get cut off mid-word.
          3) Gets its own sticky header (logo + close button) so the user
             always has an obvious, reachable way to close it.
      */}
      {mobileOpen && (
        <div
          ref={mobileDrawerRef}
          className="lg:hidden fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-xl flex flex-col animate-[fade-in_0.15s_ease-out] pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Drawer header — always visible, always at the top of the screen */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0 bg-slate-900/60">
            <Link to="/" className="flex items-center gap-2" onClick={closeAll}>
              <div className="rounded-full bg-white/10 p-1.5 border border-white/20 text-cyan-300">
                <Home className="h-4 w-4" />
              </div>
              <span className="text-sm font-extrabold text-white tracking-wide">JNTU-GV CEV</span>
            </Link>
            <button
              className="p-2 text-white rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-transform cursor-pointer"
              onClick={closeAll}
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-cyan-300" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-3 pt-3 pb-8 pointer-events-auto touch-pan-y">
            <div className="space-y-3">
              {/* 1. Quick Category Chips Scroll Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5 px-0.5 pointer-events-auto touch-pan-x flex-nowrap">
                {NAV.filter((item) => item.label !== "Home").map((item) => {
                  const isActive = expandedMobileCategory === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        const nextState = isActive ? null : item.label;
                        setExpandedMobileCategory(nextState);
                        if (nextState) {
                          setTimeout(() => {
                            document.getElementById(`mobile-cat-${item.label}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 60);
                        }
                      }}
                      className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 border cursor-pointer ${isActive
                          ? "bg-primary text-white border-primary-glow shadow-md"
                          : "bg-white/10 text-white/90 border-white/15 hover:bg-white/20"
                        }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 2. UGC Certificate Pill */}
              <a
                href={uploadUrl("2020/08/UGC-1-747x1024-1.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAll}
                className="flex items-center justify-between py-3 px-4 text-xs font-bold text-primary-glow rounded-xl bg-white/5 border border-white/10 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-300 shrink-0" />
                  <span>UGC 2(f) & 12(B) Certificate</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </a>

              {/* 3. Dynamic NAV Categories */}
              <div className="space-y-2.5">
                {NAV.map((item) => {
                  if (item.to) {
                    // Single Link Item (Home)
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={closeAll}
                        className="flex items-center justify-between py-3.5 px-4 text-sm font-bold text-white rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all border border-white/10"
                      >
                        <div className="flex items-center gap-2.5">
                          <Home className="h-4.5 w-4.5 text-cyan-300 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/40 shrink-0" />
                      </Link>
                    );
                  }

                  const isExpanded = expandedMobileCategory === item.label;
                  const allItemsCount =
                    (item.groups?.reduce((acc, g) => acc + g.items.length, 0) || 0) +
                    (item.simpleItems?.length || 0);

                  return (
                    <div
                      id={`mobile-cat-${item.label}`}
                      key={item.label}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isExpanded
                          ? "bg-white/[0.08] border-primary-glow/40 shadow-xl"
                          : "bg-white/5 border-white/10"
                        }`}
                    >
                      {/* Category Accordion Header */}
                      <button
                        onClick={() =>
                          setExpandedMobileCategory(isExpanded ? null : item.label)
                        }
                        className="w-full flex items-center justify-between py-3.5 px-4 text-sm font-bold text-white transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-primary-glow font-black text-base">{item.label}</span>
                          {allItemsCount > 0 && (
                            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-white/15 text-white/90 shrink-0">
                              {allItemsCount} items
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={`h-4.5 w-4.5 text-white/70 transition-transform duration-300 shrink-0 ${isExpanded ? "rotate-180 text-primary-glow" : ""
                            }`}
                        />
                      </button>

                      {/* Collapsible Content */}
                      {isExpanded && (
                        <div className="px-3 pb-4 pt-1 space-y-3 border-t border-white/10 animate-[fade-in_0.15s_ease-out]">
                          {/* Groups */}
                          {item.groups?.map((g) => (
                            <div key={g.title} className="space-y-1.5">
                              <div className="text-[10px] uppercase tracking-[0.2em] font-black text-cyan-300 px-2 pt-2">
                                {g.title}
                              </div>
                              <div className="grid grid-cols-1 gap-1.5">
                                {g.items.map((it) => {
                                  const ItemIcon = getItemIcon(it.label);
                                  return (
                                    <Link
                                      key={it.label}
                                      to={it.to}
                                      onClick={closeAll}
                                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/15 active:scale-[0.98] transition-all border border-white/5"
                                    >
                                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-cyan-200 shrink-0">
                                        <ItemIcon className="w-4 h-4" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="text-xs font-bold text-white leading-tight break-words">
                                          {it.label}
                                        </div>
                                        {it.desc && (
                                          <div className="text-[10px] text-white/60 leading-tight mt-0.5 break-words">
                                            {it.desc}
                                          </div>
                                        )}
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                          {/* Simple Items */}
                          {item.simpleItems && (
                            <div className="grid grid-cols-1 gap-1.5 pt-1">
                              {item.simpleItems.map((it) => {
                                const ItemIcon = getItemIcon(it.label);
                                return (
                                  <div key={it.label} className="space-y-1.5">
                                    <Link
                                      to={it.to}
                                      onClick={closeAll}
                                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/15 active:scale-[0.98] transition-all border border-white/5"
                                    >
                                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-cyan-200 shrink-0">
                                        <ItemIcon className="w-4 h-4" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="text-xs font-bold text-white leading-tight break-words">
                                          {it.label}
                                        </div>
                                        {it.desc && (
                                          <div className="text-[10px] text-white/60 leading-tight mt-0.5 break-words">
                                            {it.desc}
                                          </div>
                                        )}
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                                    </Link>
                                    {it.children && (
                                      <div className="pl-6 space-y-1 border-l-2 border-white/15 ml-3">
                                        {it.children.map((child) => (
                                          <Link
                                            key={child.label}
                                            to={child.to}
                                            onClick={closeAll}
                                            className="block py-2 px-3 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                          >
                                            {child.label}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}