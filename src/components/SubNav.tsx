import { Link, useRouterState } from "@tanstack/react-router";

interface Item {
  label: string;
  to: string;
}

export function SubNav({ items }: { items: Item[] }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="border-b border-border bg-card/60 backdrop-blur sticky top-[88px] z-30">
      <div className="container-narrow">
        <div className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
          {items.map((it) => {
            const active = path === it.to || (it.to !== "/" && path.startsWith(it.to + "/"));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-[var(--gradient-royal)] text-white shadow-[var(--shadow-card)]"
                    : "text-muted-foreground hover:text-ink hover:bg-sand"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
