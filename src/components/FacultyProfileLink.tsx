import React from "react";
import { Link } from "@tanstack/react-router";
import { resolveFacultyProfile } from "@/lib/faculty-directory";
import { ExternalLink, UserCheck } from "lucide-react";

interface FacultyProfileLinkProps {
  name: string;
  designation?: string;
  deptHint?: string;
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function FacultyProfileLink({
  name,
  designation,
  deptHint,
  className = "",
  showIcon = false,
  children,
}: FacultyProfileLinkProps) {
  if (!name) return null;

  const resolved = resolveFacultyProfile(name, deptHint);

  if (!resolved || !resolved.primaryAppointment) {
    return <span className={className}>{children || name}</span>;
  }

  const { deptSlug, facultyId } = resolved.primaryAppointment;
  const isMultiDept = resolved.allAppointments.length > 1;

  return (
    <Link
      to="/departments/$id/faculty/$facultyId"
      params={{ id: deptSlug, facultyId: String(facultyId) }}
      className={`inline-flex items-center gap-1 group font-semibold text-blue-900 hover:text-blue-700 hover:underline transition-colors ${className}`}
      title={
        isMultiDept
          ? `View ${resolved.name}'s Profile (${resolved.allAppointments.map(a => `${a.deptSlug.toUpperCase()}: ${a.designation}`).join(" | ")})`
          : `View ${resolved.name}'s Faculty Profile (${deptSlug.toUpperCase()})`
      }
    >
      <span>{children || name}</span>
      {showIcon && (
        <ExternalLink
          size={11}
          className="text-blue-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0"
        />
      )}
    </Link>
  );
}
