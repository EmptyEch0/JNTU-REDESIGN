import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface Item {
  label: string;
  to: string;
}

export function SubNav({ items }: { items: Item[] }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on path change
  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  const isItemActive = (it: Item) => {
    const cleanPath = path.replace(/\/$/, "");
    const cleanTo = it.to.replace(/\/$/, "");

    if (cleanPath === cleanTo) return true;
    
    // Check if another item in the list is a more specific match (e.g. /women-empowerment/activities vs /women-empowerment)
    const hasMoreSpecificMatch = items.some(
      (other) => other.to !== it.to && other.to.length > it.to.length && (cleanPath === other.to.replace(/\/$/, "") || cleanPath.startsWith(other.to.replace(/\/$/, "") + "/"))
    );

    if (hasMoreSpecificMatch) return false;
    return cleanTo !== "" && cleanTo !== "/" && cleanPath.startsWith(cleanTo + "/");
  };

  const activeItem = items.find(isItemActive) || items[0];

  return (
    <div className="sticky top-[80px] z-40 flex justify-center w-full px-4 pointer-events-none">
      {/* Desktop View */}
      <div className="hidden md:flex pointer-events-auto rounded-full bg-[oklch(0.16_0.04_255/0.88)] backdrop-blur-2xl shadow-[0_12px_40px_-12px_oklch(0.20_0.10_255/0.6),inset_0_1px_0_oklch(1_0_0/0.1)] border border-white/10 p-1.5 gap-1 items-center max-w-max">
        {items.map((it) => {
          const active = isItemActive(it);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                active
                  ? "bg-white/10 text-white shadow-[0_2px_10px_-2px_oklch(0.20_0.10_255/0.3)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {it.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile View */}
      <div ref={menuRef} className="md:hidden pointer-events-auto relative w-full max-w-sm mx-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-2.5 rounded-2xl bg-[oklch(0.16_0.04_255/0.88)] backdrop-blur-2xl shadow-[0_12px_40px_-12px_oklch(0.20_0.10_255/0.6),inset_0_1px_0_oklch(1_0_0/0.1)] border border-white/10 text-white active:scale-[0.98] transition-transform"
        >
          <span className="text-[13px] font-semibold">{activeItem?.label || "Navigation"}</span>
          {isOpen ? <X className="h-4 w-4 text-white/70" /> : <Menu className="h-4 w-4 text-white/70" />}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-2xl bg-[oklch(0.16_0.04_255/0.95)] backdrop-blur-2xl border border-white/10 shadow-xl flex flex-col gap-1 z-50 max-h-[60vh] overflow-y-auto no-scrollbar animate-[fade-in_0.2s_ease-out]">
            {items.map((it) => {
              const active = isItemActive(it);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {it.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
