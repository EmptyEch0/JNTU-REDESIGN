import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface Item {
  label: string;
  to: string;
}

/**
 * VerticalSubNav – sidebar-style nav used by the Academics section.
 *
 * Desktop: sticky left column with vertically stacked pill links.
 * Mobile:  same collapsible dropdown pill as SubNav.
 *
 * Active state: exact path match (`path === it.to`) or child path
 * (`path.startsWith(it.to + "/")`). No fallback to items[0].
 */
export function VerticalSubNav({ items }: { items: Item[] }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  // Find the most specific (longest) matching path
  const activeItem = [...items]
    .sort((a, b) => b.to.length - a.to.length)
    .find((it) => path === it.to || (it.to !== "/" && path.startsWith(it.to + "/")));

  const isActive = (to: string) => activeItem?.to === to;

  return (
    <>
      {/* ── Desktop: sticky vertical sidebar ── */}
      <aside className="hidden md:block w-56 flex-shrink-0 self-start sticky top-28 z-20">
        <div className="bg-white lg:bg-slate-50 rounded-3xl p-6 lg:border border-slate-100 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 px-4 mb-4">
            Navigation
          </h3>
          {items.map((it) => {
            const active = isActive(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/20"
                    : "text-slate-600 hover:bg-slate-100 lg:hover:bg-white"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* ── Mobile: collapsible dropdown pill ── */}
      <div
        ref={menuRef}
        className="md:hidden sticky top-24 z-30 w-full max-w-sm mx-auto mb-6 pointer-events-auto"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-md text-slate-800 active:scale-[0.98] transition-transform"
        >
          <span className="text-sm font-bold">
            {activeItem?.label || "Navigation"}
          </span>
          {isOpen ? (
            <X className="h-4 w-4 text-slate-500" />
          ) : (
            <Menu className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col gap-1 z-50 max-h-[60vh] overflow-y-auto no-scrollbar animate-[fade-in_0.2s_ease-out]">
            {items.map((it) => {
              const active = isActive(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {it.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
