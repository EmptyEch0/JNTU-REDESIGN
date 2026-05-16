import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface LocalSubNavProps {
  items: { label: string; icon?: any }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function LocalSubNav({ items, activeTab, setActiveTab }: LocalSubNavProps) {
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

  const activeItem = items.find((it) => it.label === activeTab) || items[0];

  return (
    <div className="flex justify-center w-full px-4 mb-8 md:mb-10">

      {/* ── Desktop: identical pill bar to SubNav (Student Corner) ── */}
      <div className="hidden md:flex rounded-full bg-[oklch(0.16_0.04_255/0.88)] backdrop-blur-2xl shadow-[0_12px_40px_-12px_oklch(0.20_0.10_255/0.6),inset_0_1px_0_oklch(1_0_0/0.1)] border border-white/10 p-1.5 gap-1 items-center max-w-max">
        {items.map((it) => {
          const active = activeTab === it.label;
          return (
            <button
              key={it.label}
              onClick={() => setActiveTab(it.label)}
              className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                active
                  ? "bg-white/10 text-white shadow-[0_2px_10px_-2px_oklch(0.20_0.10_255/0.3)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {it.icon && <it.icon className="w-3.5 h-3.5 shrink-0" />}
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Mobile: identical dropdown to SubNav (Student Corner) ── */}
      <div ref={menuRef} className="md:hidden relative w-full max-w-sm mx-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-2.5 rounded-2xl bg-[oklch(0.16_0.04_255/0.88)] backdrop-blur-2xl shadow-[0_12px_40px_-12px_oklch(0.20_0.10_255/0.6),inset_0_1px_0_oklch(1_0_0/0.1)] border border-white/10 text-white active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2">
            {activeItem?.icon && <activeItem.icon className="w-4 h-4 text-white/70" />}
            <span className="text-[13px] font-semibold">{activeItem?.label || "Navigation"}</span>
          </div>
          {isOpen ? <X className="h-4 w-4 text-white/70" /> : <Menu className="h-4 w-4 text-white/70" />}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-2xl bg-[oklch(0.16_0.04_255/0.95)] backdrop-blur-2xl border border-white/10 shadow-xl flex flex-col gap-1 z-50 max-h-[60vh] overflow-y-auto no-scrollbar animate-[fade-in_0.2s_ease-out]">
            {items.map((it) => {
              const active = activeTab === it.label;
              return (
                <button
                  key={it.label}
                  onClick={() => {
                    setActiveTab(it.label);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {it.icon && <it.icon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{it.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
