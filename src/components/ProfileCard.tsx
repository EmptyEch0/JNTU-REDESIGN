import { User } from "lucide-react";

interface Props {
  name: string;
  role: string;
  detail?: string;
  badge?: string;
}

export function ProfileCard({ name, role, detail, badge }: Props) {
  const initials = name
    .replace(/^(Dr\.|Sri|Smt\.|Ms\.|Mr\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <article className="group relative bg-card rounded-2xl p-6 border border-border hover-lift overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-2xl"
        style={{ background: "var(--primary)" }}
      />
      <div className="relative flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center font-medium text-lg shrink-0 shadow-[var(--shadow-elegant)]">
          {initials || <User className="h-6 w-6" />}
        </div>
        <div className="min-w-0">
          {badge && <div className="text-eyebrow mb-1">{badge}</div>}
          <h3 className="text-base font-semibold text-ink leading-tight">{name}</h3>
          <p className="text-sm text-primary mt-0.5 font-medium">{role}</p>
          {detail && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{detail}</p>}
        </div>
      </div>
    </article>
  );
}
