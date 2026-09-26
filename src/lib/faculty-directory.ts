import {
  DEPARTMENT_EXPLICIT_FACULTY_PROFILES,
  DEPARTMENT_FACULTY_LIST,
  formatCleanDesignation,
} from "@/data/department-faculty-data";

export interface FacultyAppointment {
  deptSlug: string;
  facultyId: string | number;
  name: string;
  designation: string;
  photo_url?: string | null;
}

export interface ResolvedFaculty {
  name: string;
  primaryAppointment: FacultyAppointment;
  allAppointments: FacultyAppointment[];
}

export function normalizeFacultySearchName(raw: string): string {
  if (!raw) return "";
  return raw
    .toLowerCase()
    .replace(/\b(dr|prof|professor|associate professor|assistant professor|asst|assoc|mr|mrs|ms|smt|sri|hod|head of department|head of the department)\b\.?/gi, "")
    .replace(/[^a-z0-9]/g, "");
}

// Global cached directory
let facultyDirectoryIndex: Map<string, FacultyAppointment[]> | null = null;

function buildFacultyDirectory(): Map<string, FacultyAppointment[]> {
  const index = new Map<string, FacultyAppointment[]>();

  const addEntry = (deptSlug: string, id: string | number, name: string, designation: string, photo_url?: string | null) => {
    if (!name || !id) return;
    const norm = normalizeFacultySearchName(name);
    if (!norm) return;

    const appointment: FacultyAppointment = {
      deptSlug,
      facultyId: id,
      name,
      designation: formatCleanDesignation(designation || "Assistant Professor"),
      photo_url: photo_url || null,
    };

    const existing = index.get(norm) || [];
    // Avoid duplicate entries for same dept and id
    if (!existing.some(e => e.deptSlug === deptSlug && String(e.facultyId) === String(id))) {
      existing.push(appointment);
      index.set(norm, existing);
    }
  };

  // 1. Index explicit profiles
  Object.entries(DEPARTMENT_EXPLICIT_FACULTY_PROFILES).forEach(([deptSlug, profiles]) => {
    // Avoid duplicate alias runs (e.g. ce, mechanical)
    if (["ce", "civil_engineering", "civil-engineering", "me", "mechanical", "mechanical-engineering", "mechanical_engineering", "metallurgy", "metallurgical", "metallurgical-engineering", "metallurgical_engineering", "computer-science", "computer-science-and-engineering", "information-technology", "electronics-and-communication-engineering", "electrical-and-electronics-engineering", "sh", "bsh", "basic-sciences", "basic-sciences-and-humanities", "humanities-and-basic-sciences"].includes(deptSlug)) {
      return;
    }
    profiles.forEach((p) => {
      addEntry(deptSlug, p.id, p.name, p.designation, p.photo_url);
    });
  });

  // 2. Index faculty list entries
  Object.entries(DEPARTMENT_FACULTY_LIST).forEach(([deptSlug, list]) => {
    if (["ce", "civil_engineering", "civil-engineering", "me", "mechanical", "mechanical-engineering", "mechanical_engineering", "metallurgy", "metallurgical", "metallurgical-engineering", "metallurgical_engineering", "computer-science", "computer-science-and-engineering", "information-technology", "electronics-and-communication-engineering", "electrical-and-electronics-engineering", "sh", "bsh", "basic-sciences", "basic-sciences-and-humanities", "humanities-and-basic-sciences"].includes(deptSlug)) {
      return;
    }
    list.forEach((item) => {
      addEntry(deptSlug, item.id || String(item.sNo), item.name, item.designation);
    });
  });

  return index;
}

export function resolveFacultyProfile(rawName: string, deptHint?: string): ResolvedFaculty | null {
  if (!rawName) return null;
  if (!facultyDirectoryIndex) {
    facultyDirectoryIndex = buildFacultyDirectory();
  }

  const norm = normalizeFacultySearchName(rawName);
  if (!norm) return null;

  // Direct normalized match
  let matches = facultyDirectoryIndex.get(norm);

  // Substring fallback if not exact match (e.g. initials like "G. Appala Naidu" matching "Gottapu Appala Naidu")
  if (!matches || matches.length === 0) {
    for (const [key, list] of facultyDirectoryIndex.entries()) {
      if (key.includes(norm) || norm.includes(key)) {
        matches = list;
        break;
      }
    }
  }

  if (!matches || matches.length === 0) return null;

  // If department hint provided, prioritize that department
  let primary = matches[0];
  if (deptHint) {
    const hintNorm = deptHint.toLowerCase().trim();
    const hintMatch = matches.find(m => m.deptSlug === hintNorm || hintNorm.includes(m.deptSlug));
    if (hintMatch) primary = hintMatch;
  }

  return {
    name: primary.name,
    primaryAppointment: primary,
    allAppointments: matches,
  };
}
