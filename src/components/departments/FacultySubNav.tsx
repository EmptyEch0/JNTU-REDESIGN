import { Link, useLocation } from "@tanstack/react-router";
import { UserCheck, List, Briefcase } from "lucide-react";

interface FacultySubNavProps {
  deptSlug: string;
}

export function FacultySubNav({ deptSlug }: FacultySubNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isListActive = currentPath.includes(`/departments/${deptSlug}/faculty/list`);
  const isNonTeachingActive = currentPath.includes(`/departments/${deptSlug}/faculty/non-teaching`);
  const isProfilesActive = !isListActive && !isNonTeachingActive && currentPath.includes(`/departments/${deptSlug}/faculty`);

  const tabs = [
    {
      label: "Faculty Profiles",
      to: `/departments/${deptSlug}/faculty`,
      icon: UserCheck,
      active: isProfilesActive,
    },
    {
      label: "Faculty List",
      to: `/departments/${deptSlug}/faculty/list`,
      icon: List,
      active: isListActive,
    },
    {
      label: "Non Teaching Staff",
      to: `/departments/${deptSlug}/faculty/non-teaching`,
      icon: Briefcase,
      active: isNonTeachingActive,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                tab.active
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-white/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60"
              }`}
            >
              <Icon size={16} className={tab.active ? "text-white" : "text-slate-500 dark:text-slate-400"} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
