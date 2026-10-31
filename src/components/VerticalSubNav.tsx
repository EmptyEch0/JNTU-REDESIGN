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
      <aside className="hidden md:block w-56 lg:w-60 flex-shrink-0 self-start sticky top-28 z-20">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar space-y-1">
          <div className="px-3 py-2 mb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Academics
            </h3>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          </div>
          {items.map((it) => {
            const active = isActive(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold"
                    : "text-slate-650 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <span>{it.label}</span>
                {active ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                ) : (
                  <span className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity text-[11px]">→</span>
                )}
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
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm text-slate-800 dark:text-slate-200 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Academics:</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {activeItem?.label || "Navigation"}
            </span>
          </div>
          {isOpen ? (
            <X className="h-4 w-4 text-slate-500" />
          ) : (
            <Menu className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-1 z-50 max-h-[60vh] overflow-y-auto no-scrollbar animate-[fade-in_0.2s_ease-out]">
            {items.map((it) => {
              const active = isActive(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <span>{it.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
