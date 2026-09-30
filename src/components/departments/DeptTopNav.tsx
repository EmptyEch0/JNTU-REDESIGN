import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Home, Menu, X } from "lucide-react";
import { getDepartmentNavItems } from "@/funcs/department-cms.server";
import { useAdmin } from "@/context/AdminContext";

const BSH_SLUGS = ["bshss", "sh", "bsh"];
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English", "Commerce"];

type Sub = { label: string; to: string; search?: Record<string, string> };

function facultySubs(slug: string): Sub[] {
  const base = `/departments/${slug}/faculty`;
  if (BSH_SLUGS.includes(slug.toLowerCase())) {
    return [
      { label: "Faculty List", to: `${base}/list` },
      ...SUBJECTS.map((s) => ({ label: s, to: `${base}/list`, search: { subject: s } })),
      { label: "Non Teaching Staff", to: `${base}/non-teaching` },
    ];
  }
  return [
    { label: "Faculty Profiles", to: base },
    { label: "Faculty List", to: `${base}/list` },
    { label: "Non Teaching Staff", to: `${base}/non-teaching` },
  ];
}

const PANEL_STYLE: React.CSSProperties = {
  background: "rgba(15, 30, 55, 0.95)",
  backdropFilter: "blur(24px) saturate(150%)",
  WebkitBackdropFilter: "blur(24px) saturate(150%)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
  overflow: "hidden",
};

export function DeptTopNav({ slug }: { slug: string }) {
  const location = useLocation();
  const { isDeptEditing } = useAdmin();
  const isEditMode = isDeptEditing(slug);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { data: items = [] } = useQuery({
    queryKey: ["deptNav", slug, isEditMode],
    queryFn: () => getDepartmentNavItems({ data: { deptSlug: slug, isEditMode } }),
    enabled: Boolean(slug),
  });

  const base = `/departments/${slug}`;
  const rows = items.filter((item: any) => item.slug !== "hod").map((item: any) => {
    const isFaculty = item.slug === "faculty" || item.pageType === "faculty";
    const isHod = item.slug === "hod";
    const fullPath = `${base}${item.slug ? `/${item.slug}` : ""}`;
    const subs: Sub[] = isFaculty
      ? facultySubs(slug)
      : (item.children || []).map((c: any) => ({
          label: c.title,
          to: `${base}/${c.slug}`,
        }));
    const to = isHod
      ? base
      : isFaculty && BSH_SLUGS.includes(slug.toLowerCase())
        ? `${fullPath}/list`
        : fullPath;
    const active = isHod
      ? false
      : item.slug
        ? location.pathname.startsWith(fullPath)
        : location.pathname === fullPath;
    return { id: item.id, title: item.title, to, hash: isHod ? "hod" : undefined, subs, active };
  });

  const closeAll = () => {
    setOpenIdx(null);
    setMobileOpen(false);
  };

  // close on route change
  useEffect(() => {
    closeAll();
  }, [location.pathname]);

  // click outside + Escape
  useEffect(() => {
    if (openIdx === null && !mobileOpen) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!islandRef.current?.contains(t) && !drawerRef.current?.contains(t)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openIdx, mobileOpen]);

  // lock background scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="w-full bg-transparent relative z-40 py-2 sm:py-2.5 flex justify-center px-2 sm:px-4 pointer-events-none -mb-16 sm:-mb-20">
      <div className="flex justify-center px-3 sm:px-4 bg-transparent w-full">
        <div
          ref={islandRef}
          className="pointer-events-auto my-0.5 w-auto max-w-[1400px] rounded-full bg-slate-950/85 backdrop-blur-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] border border-white/20 px-4 sm:px-7 py-1.5 transition-all duration-300 flex items-center justify-between gap-1.5 sm:gap-2"
          onMouseLeave={() => setOpenIdx(null)}
        >
          <div className="flex items-center justify-between w-full h-12 sm:h-14">
            {/* Mobile label */}
            <div className="lg:hidden flex items-center gap-2 shrink-0">
              <div className="rounded-full bg-white/10 p-1 border border-white/20 text-white">
                <Home className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">Department Menu</span>
            </div>

            {/* Desktop items */}
            <nav className="hidden lg:flex items-center justify-center gap-1">
              {rows.map((r, i) => (
                <div
                  key={r.id}
                  className="relative"
                  onMouseEnter={() => setOpenIdx(r.subs.length > 0 ? i : null)}
                >
                  <Link
                    to={r.to as any}
                    hash={r.hash}
                    className={`px-3.5 py-2 text-[14.5px] font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                      r.active || openIdx === i
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{r.title}</span>
                    {r.subs.length > 0 && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          openIdx === i ? "rotate-180 text-cyan-300" : "text-white/50"
                        }`}
                      />
                    )}
                  </Link>

                  {openIdx === i && r.subs.length > 0 && (
                    <div
                      className={`absolute top-full pt-2.5 z-50 animate-[fade-in_0.2s_ease-out] ${
                        i < rows.length / 2 ? "left-0" : "right-0"
                      }`}
                    >
                      <div
                        className={`relative p-3 w-max max-w-[calc(100vw-2rem)] ${
                          r.subs.length > 4 ? "min-w-[440px]" : "min-w-[240px]"
                        }`}
                        style={PANEL_STYLE}
                      >
                        <ul className={`grid gap-1.5 ${r.subs.length > 4 ? "grid-cols-2" : "grid-cols-1"}`}>
                          {r.subs.map((s) => (
                            <li key={s.label}>
                              <Link
                                to={s.to as any}
                                search={s.search as any}
                                className="group flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 transition-all duration-200"
                              >
                                <span className="flex-1 text-xs font-semibold text-white group-hover:text-cyan-200 transition-colors">
                                  {s.label}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <a
                href="https://jntugvcev.edu.in"
                className="px-3.5 py-2 text-[14.5px] font-semibold rounded-full text-cyan-300 hover:bg-white/10 transition-all"
              >
                Main Website ↗
              </a>
            </nav>

            <div className="hidden lg:block w-1" />

            {/* Mobile toggle */}
            <div className="lg:hidden ml-auto flex items-center gap-1">
              <button
                className="p-2 text-white rounded-full hover:bg-white/10 active:scale-95 transition-transform"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile full-screen drawer */}
      {mobileOpen && (
        <div
          ref={drawerRef}
          className="lg:hidden fixed inset-0 z-[100] bg-slate-50 flex flex-col animate-[fade-in_0.15s_ease-out] pointer-events-auto h-screen h-[100dvh]"
          role="dialog"
          aria-modal="true"
          aria-label="Department navigation menu"
        >
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-blue-900/30 shrink-0 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-blue-600/30 p-1.5 border border-blue-400/40 text-cyan-300">
                <Home className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-extrabold text-white tracking-wide leading-tight">JNTU-GV CEV</span>
                <span className="text-[10px] text-blue-200/80 font-medium leading-tight mt-0.5">
                  Department Menu
                </span>
              </div>
            </div>
            <button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-transform border border-white/15"
              onClick={closeAll}
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 pt-3.5 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] space-y-2.5">
            {rows.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
                <Link
                  to={r.to as any}
                  hash={r.hash}
                  onClick={closeAll}
                  className={`flex items-center justify-between py-3.5 px-4 text-sm font-bold ${
                    r.active ? "text-blue-700 bg-blue-50/50" : "text-slate-800"
                  }`}
                >
                  <span>{r.title}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                </Link>
                {r.subs.length > 0 && (
                  <div className="px-3 pb-3 space-y-1 border-t border-slate-100 bg-slate-50/60 pt-2">
                    {r.subs.map((s) => (
                      <Link
                        key={s.label}
                        to={s.to as any}
                        search={s.search as any}
                        onClick={closeAll}
                        className="block py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href="https://jntugvcev.edu.in"
              className="block py-3.5 px-4 text-sm font-bold text-blue-700 rounded-2xl bg-white border border-slate-200/90"
            >
              Main Website ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
