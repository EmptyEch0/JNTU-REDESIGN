import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

const labels: Record<string, string> = {
  about: "About",
  academics: "Academics",
  departments: "Departments",
  hostels: "Hostels",
  library: "Library",
  sports: "Sports",
  dispensary: "Dispensary",
  "rd-cell": "R&D Cell",
  placements: "Placements",
  nss: "NSS",
  "women-empowerment": "Women Empowerment",
  "campus-life": "Campus Life",
  gallery: "Gallery",
  notices: "Notices",
  admissions: "Admissions",
  contact: "Contact",
};

export function Breadcrumbs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-white/75">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link to="/" className="inline-flex items-center gap-1 hover:text-white">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
        </li>
        {parts.map((p, i) => (
          <li key={p} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <span
              className={i === parts.length - 1 ? "text-white font-medium" : "hover:text-white"}
            >
              {labels[p] ?? p}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
