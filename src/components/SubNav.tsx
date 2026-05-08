import { Link, useRouterState } from "@tanstack/react-router";

interface Item {
  label: string;
  to: string;
}

export function SubNav({ items }: { items: Item[] }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="sticky top-[80px] z-40 flex justify-center w-full px-4 pointer-events-none">
      <div className="pointer-events-auto rounded-full bg-[oklch(0.16_0.04_255/0.88)] backdrop-blur-2xl shadow-[0_12px_40px_-12px_oklch(0.20_0.10_255/0.6),inset_0_1px_0_oklch(1_0_0/0.1)] border border-white/10 p-1.5 flex gap-1 items-center overflow-x-auto no-scrollbar max-w-full sm:max-w-max">
        {items.map((it) => {
          const active = path === it.to || (it.to !== "/" && path.startsWith(it.to + "/"));
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
    </div>
  );
}
