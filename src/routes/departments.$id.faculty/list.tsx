import { createFileRoute, useLoaderData, useParams, Link } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import {
  DEPARTMENT_FACULTY_LIST,
  type DepartmentFacultyListItem,
  formatCleanDesignation,
  getCleanAssociationType,
} from "@/data/department-faculty-data";
import { useState, useMemo, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { syncFaculty, updateDepartment } from "@/lib/departments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  ArrowUp,
  ArrowDown,
  Crown,
} from "lucide-react";

export const Route = createFileRoute("/departments/$id/faculty/list")({
  head: ({ loaderData }) => {
    const data = loaderData as DepartmentData | undefined;
    const name = data?.name || "Department";
    return {
      meta: [
        { title: `Faculty List — Department of ${name} | JNTU-GV CEV` },
        {
          name: "description",
          content: `Official faculty directory, teaching staff roster, and academic qualifications for the Department of ${name} at JNTU-GV College of Engineering Vizianagaram.`,
        },
      ],
    };
  },
  component: FacultyListPage,
});

function getNormalizedFacultyName(raw: string): string {
  return (raw || "")
    .toLowerCase()
    .replace(/\b(dr|prof|mr|mrs|ms|assistant professor|associate professor|hod|head of department)\b\.?/gi, "")
    .replace(/[^a-z0-9]/g, "");
}

function getInitialDeletedList(deptKey: string, data: DepartmentData | undefined): DepartmentFacultyListItem[] {
  const deletedMap = new Map<string, DepartmentFacultyListItem>();
  const restoredSet = new Set<string>();

  // Check restored set from localStorage
  try {
    const restoredStored = localStorage.getItem(`jntugv_restored_faculty_${deptKey}`);
    if (restoredStored) {
      const parsed = JSON.parse(restoredStored);
      if (Array.isArray(parsed)) {
        parsed.forEach((id: string) => restoredSet.add(String(id)));
      }
    }
  } catch {}

  // 1. Load from shared jntugv_deleted_faculty_${deptKey}
  try {
    const stored = localStorage.getItem(`jntugv_deleted_faculty_${deptKey}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          const norm = getNormalizedFacultyName(item.name || "");
          const key = item.id ? String(item.id) : norm;
          if (key && !restoredSet.has(key) && !restoredSet.has(norm)) {
            deletedMap.set(key, {
              sNo: deletedMap.size + 1,
              id: item.id,
              name: item.name || "Faculty Member",
              designation: formatCleanDesignation(item.designation || "Assistant Professor"),
              qualification: item.qualification || (Array.isArray(item.qualifications) ? item.qualifications.join(", ") : "Ph.D / M.Tech"),
              studiedUniversity: item.studiedUniversity || item.studied_university || "—",
              graduationYear: item.graduationYear || item.year_of_graduation || "—",
              dateOfJoining: item.dateOfJoining || item.date_of_joining || "—",
              subject: item.subject || item.specialization || "—",
              associationType: getCleanAssociationType(item.associationType || item.employment_type || "Regular", item.designation),
              totalExperience: item.totalExperience || (item.experience_years ? `${item.experience_years} Years` : "—"),
            });
          }
        });
      }
    }
  } catch {}

  // 2. Load from jntugv_deleted_faculty_rows_${deptKey}
  try {
    const storedRows = localStorage.getItem(`jntugv_deleted_faculty_rows_${deptKey}`);
    if (storedRows) {
      const parsed = JSON.parse(storedRows);
      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          const norm = getNormalizedFacultyName(item.name || "");
          const key = item.id ? String(item.id) : norm;
          if (key && !deletedMap.has(key) && !restoredSet.has(key) && !restoredSet.has(norm)) {
            deletedMap.set(key, item);
          }
        });
      }
    }
  } catch {}

  return Array.from(deletedMap.values());
}

function FacultyListPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const { id: deptId } = useParams({ from: "/departments/$id/faculty/list" });
  const deptKey = (deptId || "").toLowerCase();
  const queryClient = useQueryClient();

  const { isDeptEditing } = useAdmin();
  const isEditMode = isDeptEditing(deptId || "");

  const [searchQuery, setSearchQuery] = useState("");

  // Deleted / Archived Faculty Table Rows (Admin & HOD only)
  const [deletedRowsList, setDeletedRowsList] = useState<DepartmentFacultyListItem[]>(() => {
    return getInitialDeletedList(deptKey, data);
  });

  // Construct initial dynamic faculty list matching exact sequence of Faculty Profiles
  const defaultList: DepartmentFacultyListItem[] = useMemo(() => {
    const directList =
      DEPARTMENT_FACULTY_LIST[deptKey] ||
      (data?.slug ? DEPARTMENT_FACULTY_LIST[data.slug.toLowerCase()] : undefined) ||
      [];

    const dbFaculty = data?.faculty || [];
    const currentDeleted = deletedRowsList.length > 0 ? deletedRowsList : getInitialDeletedList(deptKey, data);

    const isItemDeleted = (item: any) => {
      const itemNorm = getNormalizedFacultyName(item.name || "");
      return currentDeleted.some((d) => {
        if (item.id && d.id && String(item.id) === String(d.id)) return true;
        const dNorm = getNormalizedFacultyName(d.name || "");
        return dNorm && itemNorm && dNorm === itemNorm;
      });
    };

    if (dbFaculty && dbFaculty.length > 0) {
      // 1. Filter active dbFaculty in their EXACT profile card sequence
      const activeDb = dbFaculty.filter((dbF: any) => !isItemDeleted(dbF));

      // 2. Map every active dbFaculty member to a table row in exact order
      const result: DepartmentFacultyListItem[] = activeDb.map((dbF: any) => {
        const dbNorm = getNormalizedFacultyName(dbF.name || "");

        // Find matching static item to inherit background columns if available
        const staticMatch = directList.find((s) => {
          if (dbF.id && s.id && String(dbF.id) === String(s.id)) return true;
          const sNorm = getNormalizedFacultyName(s.name || "");
          return sNorm && dbNorm && sNorm === dbNorm;
        });

        const qual = dbF.qualifications && Array.isArray(dbF.qualifications) && dbF.qualifications.length > 0
          ? dbF.qualifications.join(", ")
          : (dbF.qualification || staticMatch?.qualification || "—");

        const univ = dbF.studied_university || dbF.university || staticMatch?.studiedUniversity || "—";
        const gradYr = dbF.year_of_graduation || dbF.graduation_year || staticMatch?.graduationYear || "—";
        const doj = dbF.date_of_joining || dbF.joining_date || staticMatch?.dateOfJoining || "—";
        const subj = dbF.subject || dbF.specialization || staticMatch?.subject || "—";
        const assoc = getCleanAssociationType(dbF.employment_type || dbF.association_type || staticMatch?.associationType || "Regular", dbF.designation);
        const exp = dbF.experience_years ? `${dbF.experience_years} Years` : (dbF.total_experience || staticMatch?.totalExperience || "—");

        return {
          sNo: 0,
          id: dbF.id,
          name: dbF.name || staticMatch?.name || "Faculty Member",
          qualification: qual,
          studiedUniversity: univ,
          graduationYear: gradYr,
          designation: formatCleanDesignation(dbF.designation || staticMatch?.designation || "Assistant Professor"),
          dateOfJoining: doj,
          subject: subj,
          associationType: assoc,
          totalExperience: exp,
        };
      });

      // Preserve exact index sequence without re-sorting
      return result.map((item, idx) => ({ ...item, sNo: idx + 1 }));
    }

    // Fallback if DB has no faculty seeded yet: directList in original sequence excluding deleted items
    const nonDeletedDirect = directList.filter((item) => !isItemDeleted(item));
    return nonDeletedDirect.map((item, idx) => ({ ...item, sNo: idx + 1 }));
  }, [deptKey, data, deletedRowsList]);

  const [facultyList, setFacultyList] = useState<DepartmentFacultyListItem[]>(defaultList);
  const [facultyRowToDelete, setFacultyRowToDelete] = useState<{ index: number; name: string } | null>(null);

  // Synchronize dynamic updates and preserve exact profile sequence
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`jntugv_faculty_list_${deptKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const dbFaculty = data?.faculty || [];
          const currentDeleted = deletedRowsList.length > 0 ? deletedRowsList : getInitialDeletedList(deptKey, data);

          // If dbFaculty exists, order strictly according to the live dbFaculty sequence!
          if (dbFaculty.length > 0) {
            const activeDb = dbFaculty.filter((dbF: any) => {
              const itemNorm = getNormalizedFacultyName(dbF.name || "");
              return !currentDeleted.some((d) => {
                if (dbF.id && d.id && String(dbF.id) === String(d.id)) return true;
                const dNorm = getNormalizedFacultyName(d.name || "");
                return dNorm && itemNorm && dNorm === itemNorm;
              });
            });

            const directList =
              DEPARTMENT_FACULTY_LIST[deptKey] ||
              (data?.slug ? DEPARTMENT_FACULTY_LIST[data.slug.toLowerCase()] : undefined) ||
              [];

            const orderedWithDb = activeDb.map((dbF: any) => {
              const dbNorm = getNormalizedFacultyName(dbF.name || "");

              // Find any custom saved cell values in parsed
              const storedMatch = parsed.find((st: any) => {
                if (dbF.id && st.id && String(dbF.id) === String(st.id)) return true;
                const stNorm = getNormalizedFacultyName(st.name || "");
                return stNorm && dbNorm && stNorm === dbNorm;
              });

              // Find static defaults
              const staticMatch = directList.find((s) => {
                if (dbF.id && s.id && String(dbF.id) === String(s.id)) return true;
                const sNorm = getNormalizedFacultyName(s.name || "");
                return sNorm && dbNorm && sNorm === dbNorm;
              });

              const qual = dbF.qualifications && Array.isArray(dbF.qualifications) && dbF.qualifications.length > 0
                ? dbF.qualifications.join(", ")
                : (dbF.qualification || storedMatch?.qualification || staticMatch?.qualification || "—");

              const univ = dbF.studied_university || dbF.university || storedMatch?.studiedUniversity || staticMatch?.studiedUniversity || "—";
              const gradYr = dbF.year_of_graduation || dbF.graduation_year || storedMatch?.graduationYear || staticMatch?.graduationYear || "—";
              const doj = dbF.date_of_joining || dbF.joining_date || storedMatch?.dateOfJoining || staticMatch?.dateOfJoining || "—";
              const subj = dbF.subject || dbF.specialization || storedMatch?.subject || staticMatch?.subject || "—";
              const assoc = getCleanAssociationType(dbF.employment_type || dbF.association_type || storedMatch?.associationType || staticMatch?.associationType || "Regular", dbF.designation);
              const exp = dbF.experience_years ? `${dbF.experience_years} Years` : (dbF.total_experience || storedMatch?.totalExperience || staticMatch?.totalExperience || "—");

              return {
                sNo: 0,
                id: dbF.id,
                name: dbF.name || storedMatch?.name || staticMatch?.name || "Faculty Member",
                qualification: qual,
                studiedUniversity: univ,
                graduationYear: gradYr,
                designation: formatCleanDesignation(dbF.designation || storedMatch?.designation || staticMatch?.designation || "Assistant Professor"),
                dateOfJoining: doj,
                subject: subj,
                associationType: assoc,
                totalExperience: exp,
              };
            });

            setFacultyList(orderedWithDb.map((it, idx) => ({ ...it, sNo: idx + 1 })));
            return;
          }
        }
      }
    } catch {}
    setFacultyList(defaultList);
  }, [deptKey, defaultList, data, deletedRowsList]);

  const mutation = useMutation({
    mutationFn: async (updatedList: DepartmentFacultyListItem[]) => {
      // Persist in localStorage
      localStorage.setItem(`jntugv_faculty_list_${deptKey}`, JSON.stringify(updatedList));
      localStorage.setItem(`jntugv_deleted_faculty_${deptKey}`, JSON.stringify(deletedRowsList));
      localStorage.setItem(`jntugv_deleted_faculty_rows_${deptKey}`, JSON.stringify(deletedRowsList));

      // Sync active faculty roster to PostgreSQL backend in exact list order
      const backendPayload = updatedList.map((item) => {
        const existingF = (data?.faculty || []).find((f: any) => String(f.id) === String(item.id));
        return {
          id: item.id || `fac_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: item.name,
          designation: item.designation,
          photo_url: existingF?.photo_url || "",
          qualification: item.qualification,
          subject: item.subject,
          association_type: item.associationType,
          studied_university: item.studiedUniversity !== "—" ? item.studiedUniversity : undefined,
          year_of_graduation: item.graduationYear !== "—" ? item.graduationYear : undefined,
          date_of_joining: item.dateOfJoining !== "—" ? item.dateOfJoining : undefined,
          total_experience: item.totalExperience !== "—" ? item.totalExperience : undefined,
        };
      });

      if (data?.id) {
        await syncFaculty({ data: { deptId: data.id, facultyList: backendPayload } });

        // Also sync department HOD metadata to match the designated HOD
        const designatedHod = updatedList.find((f) => /hod|head of (the )?department/i.test(f.designation || "")) || updatedList[0];
        if (designatedHod && designatedHod.name) {
          await updateDepartment({
            data: {
              id: data.id,
              hod: designatedHod.name,
            },
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", data.slug] });
      toast.success("Faculty list & HOD leadership updated successfully!");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to save faculty list."),
  });

  const handleUpdate = (index: number, field: keyof DepartmentFacultyListItem, value: any) => {
    setFacultyList((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
  };

  const moveRow = (index: number, direction: "up" | "down") => {
    setFacultyList((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((item, idx) => ({ ...item, sNo: idx + 1 }));
    });
  };

  const makeHodRow = (index: number) => {
    const targetMember = facultyList[index];
    if (!targetMember) return;

    let baseRank = targetMember.designation || "Assistant Professor";
    baseRank = baseRank.replace(/\s*&\s*(hod|head of (the )?department)/gi, "").trim();
    if (!baseRank || /^hod$/i.test(baseRank)) baseRank = "Assistant Professor";
    const newHodDesignation = `${baseRank} & HOD`;

    const updatedList = facultyList.map((f, i) => {
      if (i === index) {
        return { ...f, designation: newHodDesignation };
      }
      if (/hod|head of (the )?department/i.test(f.designation || "")) {
        const cleanPrevRank = (f.designation || "")
          .replace(/\s*&\s*(hod|head of (the )?department)/gi, "")
          .trim() || "Professor";
        return { ...f, designation: cleanPrevRank };
      }
      return f;
    });

    const newHod = updatedList[index];
    const others = updatedList.filter((_, i) => i !== index);

    const reordered = [newHod, ...others].map((item, idx) => ({ ...item, sNo: idx + 1 }));
    setFacultyList(reordered);
    toast.success(`Set "${targetMember.name}" as Head of Department (${newHodDesignation}). Click 'Save Faculty List' to save.`);
  };

  const addFacultyRow = () => {
    const newId = `fac_${Date.now()}`;
    const newRow: DepartmentFacultyListItem = {
      sNo: 1,
      id: newId,
      name: "New Faculty Member",
      qualification: "Ph.D / M.Tech",
      studiedUniversity: "—",
      graduationYear: "—",
      designation: "Assistant Professor",
      dateOfJoining: "—",
      subject: "—",
      associationType: "Regular",
      totalExperience: "—",
    };
    setFacultyList((prev) => [newRow, ...prev].map((item, idx) => ({ ...item, sNo: idx + 1 })));
    toast.info("Added new faculty row at the top. Fill details and click 'Save Faculty List'.");
  };

  const removeFacultyRow = (index: number) => {
    const itemToDelete = facultyList[index];
    if (itemToDelete) {
      const updatedDeleted = [itemToDelete, ...deletedRowsList.filter((d) => String(d.id) !== String(itemToDelete.id))];
      setDeletedRowsList(updatedDeleted);
      try {
        localStorage.setItem(`jntugv_deleted_faculty_${deptKey}`, JSON.stringify(updatedDeleted));
        localStorage.setItem(`jntugv_deleted_faculty_rows_${deptKey}`, JSON.stringify(updatedDeleted));
        // Remove from restored set if deleted again
        const restoredKey = `jntugv_restored_faculty_${deptKey}`;
        const prevRestored: string[] = JSON.parse(localStorage.getItem(restoredKey) || "[]");
        const itemNorm = getNormalizedFacultyName(itemToDelete.name || "");
        localStorage.setItem(
          restoredKey,
          JSON.stringify(prevRestored.filter((k) => k !== String(itemToDelete.id) && k !== itemNorm))
        );
      } catch {}
    }

    const updated = facultyList.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      sNo: idx + 1,
    }));
    setFacultyList(updated);
  };

  const confirmDeleteFacultyRow = () => {
    if (facultyRowToDelete !== null) {
      removeFacultyRow(facultyRowToDelete.index);
      toast.success(`Removed "${facultyRowToDelete.name}" to Deleted Faculty Archive below.`);
      setFacultyRowToDelete(null);
    }
  };

  const restoreFacultyRow = (item: DepartmentFacultyListItem, archiveIdx: number) => {
    const restored = { ...item, sNo: facultyList.length + 1 };
    setFacultyList((prev) => [...prev, restored].map((it, idx) => ({ ...it, sNo: idx + 1 })));

    const updatedDeleted = deletedRowsList.filter((_, i) => i !== archiveIdx);
    setDeletedRowsList(updatedDeleted);
    try {
      localStorage.setItem(`jntugv_deleted_faculty_${deptKey}`, JSON.stringify(updatedDeleted));
      localStorage.setItem(`jntugv_deleted_faculty_rows_${deptKey}`, JSON.stringify(updatedDeleted));
      const restoredKey = `jntugv_restored_faculty_${deptKey}`;
      const prevRestored = JSON.parse(localStorage.getItem(restoredKey) || "[]");
      const itemNorm = getNormalizedFacultyName(item.name || "");
      localStorage.setItem(restoredKey, JSON.stringify([...new Set([...prevRestored, String(item.id), itemNorm])]));
    } catch {}

    toast.success(`Restored "${item.name}". Click 'Save Faculty List' to save changes.`);
  };

  const purgeDeletedRow = (archiveIdx: number) => {
    const updatedDeleted = deletedRowsList.filter((_, i) => i !== archiveIdx);
    setDeletedRowsList(updatedDeleted);
    try {
      localStorage.setItem(`jntugv_deleted_faculty_${deptKey}`, JSON.stringify(updatedDeleted));
      localStorage.setItem(`jntugv_deleted_faculty_rows_${deptKey}`, JSON.stringify(updatedDeleted));
    } catch {}
    toast.info("Permanently removed from archive.");
  };

  const clearAllDeletedRows = () => {
    setDeletedRowsList([]);
    try {
      localStorage.removeItem(`jntugv_deleted_faculty_${deptKey}`);
      localStorage.removeItem(`jntugv_deleted_faculty_rows_${deptKey}`);
    } catch {}
    toast.info("Cleared all archived faculty rows.");
  };

  const resetToOriginal = () => {
    try {
      localStorage.removeItem(`jntugv_faculty_list_${deptKey}`);
      localStorage.removeItem(`jntugv_deleted_faculty_${deptKey}`);
      localStorage.removeItem(`jntugv_deleted_faculty_rows_${deptKey}`);
    } catch {}
    setDeletedRowsList([]);
    setFacultyList(defaultList);
    toast.info("Reset to original faculty list.");
  };

  const hasExperienceColumn = useMemo(() => {
    return facultyList.some((f) => Boolean(f.totalExperience));
  }, [facultyList]);

  // Filtered roster (search only applied in public view or view mode)
  const filteredFaculty = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query || isEditMode) return facultyList;
    return facultyList.filter((f) => {
      return (
        (f.name || "").toLowerCase().includes(query) ||
        (f.designation || "").toLowerCase().includes(query) ||
        (f.qualification || "").toLowerCase().includes(query) ||
        (f.studiedUniversity || "").toLowerCase().includes(query) ||
        (f.subject || "").toLowerCase().includes(query) ||
        (f.associationType || "").toLowerCase().includes(query) ||
        (f.totalExperience || "").toLowerCase().includes(query)
      );
    });
  }, [facultyList, searchQuery, isEditMode]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner & Admin Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Faculty List</span>
            {isEditMode && (
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Editing Mode
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {isEditMode
              ? "Edit academic qualifications, designations, joining dates, and employment status. Click 'Save Faculty List' to apply."
              : `Detailed academic qualifications, graduation background, and association details of faculty members in the Department of ${data?.name}.`}
          </p>
        </div>

        {/* Admin Action Buttons */}
        {isEditMode && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToOriginal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
              title="Reset to default roster"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={addFacultyRow}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Faculty Row</span>
            </button>

            <button
              type="button"
              onClick={() => mutation.mutate(facultyList)}
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            >
              <Save size={14} />
              <span>{mutation.isPending ? "Saving..." : "Save Faculty List"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar (Public View) */}
      {!isEditMode && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, qualification, designation or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Faculty Table View */}
      {filteredFaculty.length > 0 ? (
        <div className={`bg-white rounded-3xl border shadow-xs overflow-hidden ${isEditMode ? "border-amber-300 ring-2 ring-amber-400/20" : "border-slate-200/80"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-3 w-14 text-center">S.No</th>
                  <th className="py-4 px-3 min-w-[200px]">Name of the faculty Member</th>
                  <th className="py-4 px-3 min-w-[140px]">Qualification</th>
                  <th className="py-4 px-3 min-w-[150px]">Studied University</th>
                  <th className="py-4 px-3 min-w-[110px]">Year of grad.</th>
                  <th className="py-4 px-3 min-w-[160px]">Current Designation</th>
                  <th className="py-4 px-3 min-w-[120px]">Date of joining</th>
                  <th className="py-4 px-3 min-w-[130px]">Subject</th>
                  <th className="py-4 px-3 min-w-[130px]">Regular/contract</th>
                  <th className="py-4 px-3 min-w-[110px]">Total Experience</th>
                  {isEditMode && <th className="py-4 px-3 w-16 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredFaculty.map((f, idx) => (
                  <tr
                    key={f.id ? String(f.id) : `row_${idx}`}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-3 px-3 text-center font-bold text-slate-400 text-xs">
                      {f.sNo || idx + 1}
                    </td>

                    {/* Faculty Name */}
                    <td className="py-3 px-3">
                      {isEditMode ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={f.name}
                            onChange={(e) => handleUpdate(idx, "name", e.target.value)}
                            className="w-full p-1.5 text-xs font-bold text-slate-900 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          {f.id && (
                            <Link
                              to="/departments/$id/faculty/$facultyId"
                              params={{ id: deptId, facultyId: String(f.id) }}
                              className="text-[10px] text-amber-800 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <UserCheck size={10} />
                              <span>Deep Edit Profile</span>
                            </Link>
                          )}
                        </div>
                      ) : f.id ? (
                        <Link
                          to="/departments/$id/faculty/$facultyId"
                          params={{ id: deptId, facultyId: String(f.id) }}
                          className="font-bold text-slate-900 group-hover:text-blue-700 hover:underline transition-colors block"
                        >
                          {f.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors block">
                          {f.name}
                        </span>
                      )}
                    </td>

                    {/* Qualification */}
                    <td className="py-3 px-3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={f.qualification || ""}
                          onChange={(e) => handleUpdate(idx, "qualification", e.target.value)}
                          className="w-full p-1.5 text-xs font-semibold text-slate-700 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="text-slate-700 text-xs font-semibold">
                          {f.qualification}
                        </span>
                      )}
                    </td>

                    {/* Studied University */}
                    <td className="py-3 px-3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={f.studiedUniversity || ""}
                          onChange={(e) => handleUpdate(idx, "studiedUniversity", e.target.value)}
                          className="w-full p-1.5 text-xs text-slate-700 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="text-slate-600 text-xs">
                          {f.studiedUniversity}
                        </span>
                      )}
                    </td>

                    {/* Year of Graduation */}
                    <td className="py-3 px-3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={f.graduationYear || ""}
                          onChange={(e) => handleUpdate(idx, "graduationYear", e.target.value)}
                          className="w-full p-1.5 text-xs text-slate-700 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="text-slate-600 text-xs font-medium">
                          {f.graduationYear}
                        </span>
                      )}
                    </td>

                    {/* Designation */}
                    <td className="py-3 px-3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={f.designation || ""}
                          onChange={(e) => handleUpdate(idx, "designation", e.target.value)}
                          className="w-full p-1.5 text-xs font-semibold text-slate-800 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/60">
                          {f.designation}
                        </span>
                      )}
                    </td>

                    {/* Date of Joining */}
                    <td className="py-3 px-3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={f.dateOfJoining || ""}
                          onChange={(e) => handleUpdate(idx, "dateOfJoining", e.target.value)}
                          className="w-full p-1.5 text-xs text-slate-700 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="text-slate-600 text-xs">
                          {f.dateOfJoining}
                        </span>
                      )}
                    </td>

                    {/* Subject */}
                    <td className="py-3 px-3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={f.subject || ""}
                          onChange={(e) => handleUpdate(idx, "subject", e.target.value)}
                          className="w-full p-1.5 text-xs text-slate-700 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="text-slate-700 text-xs font-medium">
                          {f.subject}
                        </span>
                      )}
                    </td>

                    {/* Regular / Contract / Adjunct */}
                    <td className="py-3 px-3 text-xs">
                      {isEditMode ? (
                        <select
                          value={f.associationType || "Regular"}
                          onChange={(e) => handleUpdate(idx, "associationType", e.target.value)}
                          className="w-full p-1.5 text-xs font-semibold text-slate-800 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          <option value="Regular">Regular</option>
                          <option value="Contract">Contract</option>
                          <option value="Adjunct">Adjunct</option>
                          <option value="Ad-hoc">Ad-hoc</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold border ${
                            (f.associationType || "").toLowerCase() === "regular"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                              : "bg-blue-50 text-blue-700 border-blue-200/60"
                          }`}
                        >
                          {f.associationType}
                        </span>
                      )}
                    </td>

                    {/* Total Experience */}
                    <td className="py-3 px-3 text-xs">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={f.totalExperience || ""}
                          placeholder="e.g. 5 Years"
                          onChange={(e) => handleUpdate(idx, "totalExperience", e.target.value)}
                          className="w-full p-1.5 text-xs text-slate-700 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="text-slate-700 font-semibold whitespace-nowrap">
                          {f.totalExperience || "—"}
                        </span>
                      )}
                    </td>

                    {/* Action Column for Admin Edit Mode */}
                    {isEditMode && (
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/hod|head of (the )?department/i.test(f.designation || "") ? (
                            <span title="Current HOD" className="p-1 text-amber-500 bg-amber-50 rounded-lg">
                              <Crown size={14} className="fill-amber-400 text-amber-600" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => makeHodRow(idx)}
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                              title="Make as Head of Department"
                            >
                              <Crown size={13} />
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveRow(idx, "up")}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            title="Move Row Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === facultyList.length - 1}
                            onClick={() => moveRow(idx, "down")}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            title="Move Row Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setFacultyRowToDelete({ index: idx, name: f.name || `Faculty Member #${idx + 1}` })}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete faculty row"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-6 bg-slate-50 border border-dashed border-slate-300 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Users size={28} />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {searchQuery ? "No matching faculty found" : "Faculty list under compilation"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {searchQuery
                ? `No faculty members matched "${searchQuery}". Please check the spelling or clear the search query.`
                : `The tabular faculty roster for the Department of ${data?.name} is currently being verified. You can view individual faculty member cards under the Faculty Profiles tab.`}
            </p>
          </div>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Clear Search Filter
            </button>
          ) : isEditMode ? (
            <button
              onClick={addFacultyRow}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add First Faculty Member</span>
            </button>
          ) : (
            <Link
              to="/departments/$id/faculty"
              params={{ id: deptId }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>Switch to Faculty Profiles</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}

      {/* ─── DELETED / ARCHIVED FACULTY ROWS SECTION (ADMIN & HOD ONLY) ─── */}
      {isEditMode && deletedRowsList.length > 0 && (
        <div className="pt-8 border-t-2 border-dashed border-rose-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-300 flex-shrink-0">
                <Trash2 size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Deleted Faculty Rows Archive</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-200 text-rose-900">
                    {deletedRowsList.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visible <strong>only to Admin & HOD</strong>. Click <strong>"Restore"</strong> to add any faculty row back to the active table.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearAllDeletedRows}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Clear Archive
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deletedRowsList.map((df, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-rose-200 bg-rose-50/30 flex items-center justify-between gap-4 transition-all hover:bg-rose-50/60"
              >
                <div className="min-w-0 space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate line-through decoration-rose-400">
                    {df.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">{df.designation}</span>
                    <span>•</span>
                    <span>{df.qualification}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => restoreFacultyRow(df, idx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                    title="Restore to Active Faculty Table"
                  >
                    <RotateCcw size={13} />
                    <span>Restore</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => purgeDeletedRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                    title="Permanently remove from archive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Row Confirmation Modal */}
      <AnimatePresence>
        {facultyRowToDelete !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setFacultyRowToDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    Delete Faculty Table Row?
                  </h3>
                  <p className="text-sm text-slate-600">
                    Are you sure you want to remove <span className="font-bold text-slate-900">"{facultyRowToDelete.name}"</span> from the tabular faculty list?
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-800 leading-relaxed">
                <strong>Notice:</strong> The row will be moved to the Deleted Archive below. Click <strong>"Save Faculty List"</strong> to save changes permanently.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFacultyRowToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteFacultyRow}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Yes, Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
