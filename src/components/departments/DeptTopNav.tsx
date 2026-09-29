import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Menu, X } from "lucide-react";
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

export function DeptTopNav({ slug }: { slug: string }) {
  const location = useLocation();
  const { isDeptEditing } = useAdmin();
  const isEditMode = isDeptEditing(slug);
  const [open, setOpen] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["deptNav", slug, isEditMode],
    queryFn: () => getDepartmentNavItems({ data: { deptSlug: slug, isEditMode } }),
    enabled: Boolean(slug),
  });

  const rows = items.map((item: any) => {
    const isFaculty = item.slug === "faculty" || item.pageType === "faculty";
    const fullPath = `/departments/${slug}${item.slug ? `/${item.slug}` : ""}`;
    const subs: Sub[] = isFaculty
      ? facultySubs(slug)
      : (item.children || []).map((c: any) => ({
          label: c.title,
          to: `/departments/${slug}/${c.slug}`,
        }));
    const to =
      isFaculty && BSH_SLUGS.includes(slug.toLowerCase()) ? `${fullPath}/list` : fullPath;
    const active = item.slug
      ? location.pathname.startsWith(fullPath)
      : location.pathname === fullPath;
    return { id: item.id, title: item.title, to, subs, active };
  });

  const linkBase =
    "px-3 py-2.5 text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1";

  return (
    <nav className="pointer-events-auto w-full bg-[#0B254E] text-white shadow-md">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile bar */}
        <div className="flex items-center justify-between lg:hidden py-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">Department Menu</span>
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop bar */}
        <div className="hidden lg:flex items-center justify-center gap-1 py-1">
          {rows.map((r) => (
            <div key={r.id} className="relative group">
              <Link
                to={r.to as any}
                className={`${linkBase} ${r.active ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10 hover:text-white"}`}
              >
                {r.title}
                {r.subs.length > 0 && <ChevronDown size={14} className="opacity-70" />}
              </Link>
              {r.subs.length > 0 && (
                <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block min-w-[210px] bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  {r.subs.map((s) => (
                    <Link
                      key={s.label}
                      to={s.to as any}
                      search={s.search as any}
                      className="block px-4 py-2 text-[13px] font-medium hover:bg-slate-100"
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
            className={`${linkBase} text-cyan-300 hover:bg-white/10`}
          >
            Main Website ↗
          </a>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="lg:hidden pb-3 space-y-1 max-h-[70vh] overflow-y-auto">
            {rows.map((r) => (
              <div key={r.id}>
                <Link
                  to={r.to as any}
                  onClick={() => setOpen(false)}
                  className={`block ${linkBase} ${r.active ? "bg-white/15" : "hover:bg-white/10"}`}
                >
                  {r.title}
                </Link>
                {r.subs.map((s) => (
                  <Link
                    key={s.label}
                    to={s.to as any}
                    search={s.search as any}
                    onClick={() => setOpen(false)}
                    className="block ml-5 px-3 py-1.5 text-xs text-white/75 hover:text-white"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            ))}
            <a href="https://jntugvcev.edu.in" className="block px-3 py-2 text-xs text-cyan-300">
              Main Website ↗
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
