import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, ChevronDown, GraduationCap, Search, CornerDownLeft } from "lucide-react";
import { NAV, SEARCH_INDEX, SITE } from "@/lib/site";
import { useAdmin } from "@/context/AdminContext";

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
      // Cmd/Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openIdx, mobileOpen, searchOpen]);

  // Global Cmd+K (always available)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

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
      <div className="flex justify-center px-3 sm:px-4">
        <div
          ref={islandRef}
          className={`pointer-events-auto mt-3 sm:mt-4 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
            expanded
              ? "w-full max-w-[1180px] rounded-[28px] bg-[oklch(0.18_0.04_255/0.85)] backdrop-blur-2xl shadow-[0_20px_60px_-20px_oklch(0.20_0.10_255/0.55),inset_0_1px_0_oklch(1_0_0/0.08)] border border-white/10"
              : "w-auto rounded-full bg-[oklch(0.16_0.04_255/0.88)] backdrop-blur-2xl shadow-[0_12px_40px_-12px_oklch(0.20_0.10_255/0.6),inset_0_1px_0_oklch(1_0_0/0.1)] border border-white/10"
          }`}
          onMouseLeave={() => setOpenIdx(null)}
        >
          <div
            className={`flex items-center gap-2 transition-all duration-500 ${expanded ? "px-4 sm:px-5 h-16" : "px-3 h-12"}`}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={closeAll}>
              <div
                className={`rounded-full bg-white grid place-items-center transition-all duration-500 overflow-hidden border border-white/20 ${expanded ? "h-9 w-9" : "h-7 w-7"}`}
              >
                <img src="/logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
              </div>
              <div
                className={`leading-tight overflow-hidden transition-all duration-500 ${expanded ? "max-w-[260px] opacity-100" : "max-w-0 opacity-0 lg:max-w-[120px] lg:opacity-100"}`}
              >
                <div className="text-sm font-semibold text-white whitespace-nowrap">
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
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
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
                        className={`px-2.5 py-1.5 text-[13px] font-medium rounded-full transition-all ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/75 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        className={`flex items-center gap-1 px-2.5 py-1.5 text-[13px] font-medium rounded-full transition-all ${
                          active || openIdx === i
                            ? "bg-white/10 text-white"
                            : "text-white/75 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-300 ${openIdx === i ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className={`hidden md:inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all shrink-0 ${
                expanded ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]"
              }`}
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              {expanded && <span className="hidden xl:inline">Search</span>}
              {expanded && (
                <kbd className="hidden xl:inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  ⌘K
                </kbd>
              )}
            </button>

            {/* Spacer for balance */}
            <div className="hidden lg:block w-1" />

            {/* Mobile actions */}
            <div className="lg:hidden ml-auto flex items-center gap-1">
              <button
                className="p-2 text-white rounded-full hover:bg-white/10 active:scale-95 transition-transform"
                onClick={() => {
                  setSearchOpen((v) => !v);
                  setMobileOpen(false);
                }}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
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

          {/* SEARCH PANEL */}
          {searchOpen && (
            <div className="px-4 sm:px-5 pb-5 animate-[fade-in_0.25s_ease-out]">
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-primary-glow/60 focus-within:bg-white/10 transition-colors">
                  <Search className="h-4 w-4 text-white/50 shrink-0" />
                  <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveResult(0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActiveResult((i) => Math.min(i + 1, results.length - 1));
                      }
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActiveResult((i) => Math.max(i - 1, 0));
                      }
                      if (e.key === "Enter" && results[activeResult]) {
                        e.preventDefault();
                        handleResultSelect(results[activeResult].to);
                      }
                    }}
                    placeholder="Search departments, facilities, pages…"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-white/40 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Results */}
                <div className="mt-3 max-h-[55vh] overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="text-center py-10 text-white/50 text-sm">
                      No results for "{query}"
                    </div>
                  ) : (
                    <ul className="space-y-0.5">
                      {results.map((r, i) => (
                        <li key={`${r.to}-${r.label}`}>
                          <button
                            onMouseEnter={() => setActiveResult(i)}
                            onClick={() => handleResultSelect(r.to)}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                              i === activeResult ? "bg-white/10" : "hover:bg-white/5"
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-white truncate">
                                {r.label}
                              </div>
                              <div className="text-[11px] uppercase tracking-[0.16em] text-primary-glow mt-0.5">
                                {r.group}
                              </div>
                            </div>
                            {i === activeResult && (
                              <CornerDownLeft className="h-3.5 w-3.5 text-white/50 shrink-0" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                  <div className="flex items-center gap-3">
                    <span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">↑↓</kbd>{" "}
                      navigate
                    </span>
                    <span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">↵</kbd>{" "}
                      select
                    </span>
                  </div>
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">esc</kbd> close
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mega dropdown panel */}
          {openIdx !== null && NAV[openIdx]?.groups && !searchOpen && (
            <div className="hidden lg:block px-5 pb-5 animate-[fade-in_0.3s_ease-out]">
              <div
                className={`border-t border-white/10 pt-5 grid gap-6 ${
                  NAV[openIdx].groups!.length === 1
                    ? "grid-cols-1 max-w-xs mx-auto"
                    : NAV[openIdx].groups!.length === 2
                    ? "grid-cols-2 max-w-2xl mx-auto"
                    : NAV[openIdx].groups!.length === 3
                    ? "grid-cols-3 max-w-4xl mx-auto"
                    : "grid-cols-2 lg:grid-cols-4"
                }`}
              >
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

          {/* Simple nested list dropdown */}
          {openIdx !== null && NAV[openIdx]?.simpleItems && !searchOpen && (
            <div className="hidden lg:block px-5 pb-5 animate-[fade-in_0.3s_ease-out]">
              <div className="border-t border-white/10 pt-5 max-w-xs mx-auto">
                <ul className="space-y-0.5">
                  {NAV[openIdx].simpleItems!.map((it) => (
                    <li key={it.label} className="group/item relative">
                      {it.children ? (
                        <div>
                          <div className="flex items-center justify-between rounded-xl p-2.5 hover:bg-white/5 transition-colors cursor-pointer group/trigger">
                            <Link to={it.to} className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white group-hover/trigger:text-primary-glow transition-colors">
                                {it.label}
                              </div>
                              {it.desc && (
                                <div className="text-[11px] text-white/50 mt-0.5">{it.desc}</div>
                              )}
                            </Link>
                            <ChevronDown className="h-3.5 w-3.5 text-white/40 group-hover/item:rotate-180 transition-transform duration-300" />
                          </div>
                          {/* Nested flyout list on hover */}
                          <div className="max-h-0 group-hover/item:max-h-96 overflow-hidden transition-all duration-500 ease-in-out">
                            <ul className="pl-4 pr-2 pb-2 pt-1 space-y-0.5 border-l border-white/10 ml-3 mt-1">
                              {it.children.map((child) => (
                                <li key={child.label}>
                                  <Link
                                    to={child.to}
                                    className="block px-3 py-1.5 rounded-lg text-[13px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
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
                          className="block rounded-xl p-2.5 hover:bg-white/5 transition-colors"
                        >
                          <div className="text-sm font-medium text-white hover:text-primary-glow transition-colors">
                            {it.label}
                          </div>
                          {it.desc && (
                            <div className="text-[11px] text-white/50 mt-0.5">{it.desc}</div>
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Mobile pill drawer */}
          {mobileOpen && (
            <div className="lg:hidden px-3 pb-3 max-h-[78vh] overflow-y-auto animate-[fade-in_0.3s_ease-out]">
              <div className="border-t border-white/10 pt-3 space-y-1.5">
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
