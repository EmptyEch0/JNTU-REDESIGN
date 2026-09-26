import { createFileRoute, useLoaderData, Link, useParams, useRouter } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { syncFaculty, updateDepartment } from "@/lib/departments";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserPlus,
  Trash2,
  Save,
  ImageIcon,
  Eye,
  UserCheck,
  GripVertical,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { SafeImage } from "@/components/SafeImage";
import { PersonAvatarUpload } from "@/components/AdminEditPanel";
import {
  DEPARTMENT_EXPLICIT_FACULTY_PROFILES,
  sortFacultyList,
  formatCleanDesignation,
} from "@/data/department-faculty-data";

export const Route = createFileRoute("/departments/$id/faculty/")({
  head: ({ loaderData }) => {
    const data = loaderData as DepartmentData | undefined;
    const name = data?.name || "Department";
    return {
      meta: [
        { title: `Faculty Profiles — Department of ${name} | JNTU-GV CEV` },
        {
          name: "description",
          content: `Distinguished faculty members, professors, and researchers in the Department of ${name} at JNTU-GV College of Engineering Vizianagaram.`,
        },
      ],
    };
  },
  component: FacultyPage,
});

interface FacultyCardProps {
  f: {
    id: string | number;
    name: string;
    designation: string;
    photo_url?: string | null;
  };
  index: number;
  totalCount: number;
  isEditMode: boolean;
  deptId: string;
  isDragging?: boolean;
  isHod?: boolean;
  handleUpdate: (id: string | number, field: string, value: string) => void;
  onRequestDelete: (target: { id: string | number; name: string }) => void;
  onMakeHod?: (targetId: string | number) => void;
  moveFaculty: (index: number, direction: "up" | "down") => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnter: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

function FacultyCard({
  f,
  index,
  totalCount,
  isEditMode,
  deptId,
  isDragging,
  isHod,
  handleUpdate,
  onRequestDelete,
  onMakeHod,
  moveFaculty,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDragOver,
}: FacultyCardProps) {
  const cardId = String(f.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      draggable={isEditMode}
      onDragStart={(e: any) => onDragStart(e, index)}
      onDragEnter={(e: any) => onDragEnter(e, index)}
      onDragEnd={(e: any) => onDragEnd(e)}
      onDragOver={(e: any) => onDragOver(e)}
      className={`p-6 border rounded-3xl bg-white flex gap-5 items-center relative transition-all h-full select-none ${
        isDragging
          ? "opacity-40 border-dashed border-amber-500 bg-amber-50/40 scale-[0.98] shadow-inner"
          : isEditMode
          ? isHod
            ? "border-amber-400 bg-amber-50/20 ring-2 ring-amber-300 shadow-sm cursor-grab active:cursor-grabbing"
            : "border-amber-200 hover:border-amber-400 ring-2 ring-amber-50 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
          : isHod
          ? "border-amber-300/80 bg-gradient-to-br from-amber-50/30 via-white to-amber-50/10 shadow-md ring-2 ring-amber-100"
          : "border-slate-100 shadow-sm hover:border-blue-500/20 hover:shadow-md"
      }`}
    >
      {/* Edit Mode Top Action Toolbar */}
      {isEditMode && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20 bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-amber-200/80 shadow-xs">
          {/* Move Up / Previous Position */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              moveFaculty(index, "up");
            }}
            disabled={index === 0}
            className="p-1 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Move Position Up"
          >
            <ArrowUp size={14} />
          </button>

          {/* Move Down / Next Position */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              moveFaculty(index, "down");
            }}
            disabled={index === totalCount - 1}
            className="p-1 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Move Position Down"
          >
            <ArrowDown size={14} />
          </button>

          {/* Drag Handle Icon */}
          <div
            className="p-1 text-slate-400 hover:text-amber-600 cursor-grab active:cursor-grabbing"
            title="Hold & Drag to reorder"
          >
            <GripVertical size={14} />
          </div>

          <span className="w-px h-3.5 bg-slate-200" />

          {/* Delete Faculty Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete({ id: cardId, name: f.name || "Faculty Member" });
            }}
            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Faculty Member"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Avatar / Photo */}
      {isEditMode ? (
        <div className="flex-shrink-0 relative group">
          <PersonAvatarUpload
            value={f.photo_url || ""}
            onChange={(newUrl) => handleUpdate(cardId, "photo_url", newUrl)}
            module="departments"
            category="faculty"
            size={88}
            fallbackName={f.name}
          />
        </div>
      ) : (
        <div className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 bg-slate-100 shadow-xs ${isHod ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-50'}`}>
          <SafeImage
            src={f.photo_url}
            alt={f.name}
            decoding="async"
            loading="lazy"
            fallbackName={f.name}
            className="h-full w-full object-cover object-top"
          />
        </div>
      )}

      {/* Text Details & Inputs */}
      <div className="flex-grow space-y-2 min-w-0">
        {isEditMode ? (
          <div className="space-y-2 pr-12">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-amber-700/80">
                Faculty Name
              </label>
              <input
                className="w-full font-bold text-blue-900 bg-amber-50/30 border border-amber-200 rounded-lg px-2.5 py-1 text-sm outline-none focus:ring-2 focus:ring-amber-400/40 focus:bg-white transition-all"
                value={f.name}
                placeholder="Faculty Name (e.g. Dr. John Doe)"
                onChange={(e) => handleUpdate(cardId, "name", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-amber-700/80">
                Designation
              </label>
              <input
                className="w-full text-xs font-semibold text-slate-700 bg-amber-50/30 border border-amber-200 rounded-lg px-2.5 py-1 outline-none focus:ring-2 focus:ring-amber-400/40 focus:bg-white transition-all"
                value={f.designation}
                placeholder="Designation (e.g. Assistant Professor & HOD)"
                onChange={(e) => handleUpdate(cardId, "designation", e.target.value)}
              />
            </div>

            {/* Actions: Make as HOD + Deep Link Edit Profile */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              {isHod ? (
                <span className="inline-flex items-center text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                  <span>Current HOD</span>
                </span>
              ) : onMakeHod ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMakeHod(cardId);
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-100/90 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300/80 transition-colors shadow-2xs cursor-pointer"
                  title="Designate this member as Head of Department and move to top"
                >
                  <UserCheck size={12} className="text-amber-700" />
                  <span>Make as HOD</span>
                </button>
              ) : null}

              <Link
                to="/departments/$id/faculty/$facultyId"
                params={{ id: deptId, facultyId: cardId }}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors border border-slate-200 shadow-2xs"
              >
                <UserCheck size={12} />
                <span>Edit Full Profile</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <div>
              {isHod && (
                <div className="mb-1">
                  <span className="inline-flex items-center text-[11px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <span>Head of Department</span>
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-blue-900 leading-snug truncate" title={f.name}>
                {f.name}
              </h3>
              <p className="text-slate-600 font-medium text-sm mt-0.5">
                {formatCleanDesignation(f.designation)}
              </p>
            </div>

            {/* Public View Profile Button */}
            <div className="pt-3">
              <Link
                to="/departments/$id/faculty/$facultyId"
                params={{ id: deptId, facultyId: cardId }}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs ${
                  isHod
                    ? 'text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-200'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <Eye size={14} />
                <span>View Profile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getNormalizedFacultyName(raw: string): string {
  return (raw || "")
    .toLowerCase()
    .replace(/\b(dr|prof|mr|mrs|ms|assistant professor|associate professor|hod|head of department)\b\.?/gi, "")
    .replace(/[^a-z0-9]/g, "");
}

function getInitialDeletedCards(deptKey: string, data: DepartmentData | undefined): any[] {
  const deletedMap = new Map<string, any>();
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

  // 1. From jntugv_deleted_faculty_${deptKey}
  try {
    const stored = localStorage.getItem(`jntugv_deleted_faculty_${deptKey}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          const norm = getNormalizedFacultyName(item.name || "");
          const key = item.id ? String(item.id) : norm;
          if (key && !restoredSet.has(key) && !restoredSet.has(norm)) {
            deletedMap.set(key, item);
          }
        });
      }
    }
  } catch {}

  // 2. From jntugv_deleted_faculty_rows_${deptKey}
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

function FacultyPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { id: deptId } = useParams({ from: "/departments/$id/faculty/" });
  const deptKey = (deptId || "").toLowerCase();

  const { isDeptEditing } = useAdmin();
  const isEditMode = isDeptEditing(deptId || "");

  // Deleted/Archived faculty list (Admin & HOD only)
  const [deletedFacultyList, setDeletedFacultyList] = useState<any[]>(() => {
    return getInitialDeletedCards(deptKey, data);
  });

  const explicitList =
    DEPARTMENT_EXPLICIT_FACULTY_PROFILES[deptKey] ||
    (data?.slug ? DEPARTMENT_EXPLICIT_FACULTY_PROFILES[data.slug.toLowerCase()] : undefined);

  const [facultyList, setFacultyList] = useState<any[]>(() => {
    const currentDeleted = getInitialDeletedCards(deptKey, data);
    const isDeleted = (item: any) => {
      const itemNorm = getNormalizedFacultyName(item.name || "");
      return currentDeleted.some((d) => {
        if (item.id && d.id && String(item.id) === String(d.id)) return true;
        const dNorm = getNormalizedFacultyName(d.name || "");
        return dNorm && itemNorm && dNorm === itemNorm;
      });
    };

    if (data?.faculty && data.faculty.length > 0) {
      return data.faculty.filter((f: any) => !isDeleted(f));
    }
    if (explicitList) {
      return explicitList.filter((f: any) => !isDeleted(f));
    }
    return [];
  });

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragItemNode = useRef<number | null>(null);
  const lastDeptRef = useRef<string>(deptKey);

  useEffect(() => {
    // Only re-sync when department or server data genuinely changes
    if (lastDeptRef.current !== deptKey) {
      lastDeptRef.current = deptKey;
      setDeletedFacultyList(getInitialDeletedCards(deptKey, data));
    }

    const currentDeleted = getInitialDeletedCards(deptKey, data);
    const isDeleted = (item: any) => {
      const itemNorm = getNormalizedFacultyName(item.name || "");
      return currentDeleted.some((d) => {
        if (item.id && d.id && String(item.id) === String(d.id)) return true;
        const dNorm = getNormalizedFacultyName(d.name || "");
        return dNorm && itemNorm && dNorm === itemNorm;
      });
    };

    const activeExplicit =
      DEPARTMENT_EXPLICIT_FACULTY_PROFILES[deptKey] ||
      (data?.slug ? DEPARTMENT_EXPLICIT_FACULTY_PROFILES[data.slug.toLowerCase()] : undefined);

    if (data?.faculty && data.faculty.length > 0) {
      const activeDb = data.faculty.filter((f: any) => !isDeleted(f));
      // Enrich with explicit photos if needed
      const enriched = activeDb.map((dbF: any) => {
        if (dbF.photo_url) return dbF;
        const dbNorm = getNormalizedFacultyName(dbF.name || "");
        const expMatch = (activeExplicit || []).find((exp: any) => {
          if (exp.id && dbF.id && String(exp.id) === String(dbF.id)) return true;
          const expNorm = getNormalizedFacultyName(exp.name || "");
          return expNorm && dbNorm && expNorm === dbNorm;
        });
        return {
          ...dbF,
          photo_url: expMatch?.photo_url || dbF.photo_url || "",
        };
      });
      setFacultyList(enriched);
    } else if (activeExplicit) {
      setFacultyList(activeExplicit.filter((f: any) => !isDeleted(f)));
    }
  }, [data?.id, data?.slug, deptKey]);

  const mutation = useMutation({
    mutationFn: async (newList: any[]) => {
      // 1. Save faculty list in database
      await syncFaculty({ data: { deptId: data.id, facultyList: newList } });

      // 2. Also sync department HOD metadata to match the designated HOD.
      // No HOD on the roster means an additional-charge HOD, so leave departments.hod alone.
      const designatedHod = newList.find((f) => /hod|head of (the )?department/i.test(f.designation || ""));
      if (designatedHod && designatedHod.name) {
        await updateDepartment({
          data: {
            id: data.id,
            hod: designatedHod.name,
            hod_photo: designatedHod.photo_url || data.hod_photo,
          },
        });
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", data.slug] });
      await router.invalidate();
      toast.success("Faculty roster, positions, and HOD saved successfully!");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to save changes."),
  });

  // Handle updates to specific fields
  const handleUpdate = (id: string | number, field: string, value: string) => {
    const targetId = String(id);
    setFacultyList((prev) =>
      prev.map((f) => (String(f.id) === targetId ? { ...f, [field]: value } : f))
    );
  };

  // Add new faculty member with immediate animated entrance
  const addFaculty = () => {
    const newId = `fac_${Date.now()}`;
    const newMember = {
      id: newId,
      name: "New Faculty Member",
      designation: "Assistant Professor",
      photo_url: "",
    };
    setFacultyList((prev) => [newMember, ...prev]);
    toast.info("Added new faculty card at the top. Fill in details and click 'Save Roster'.");
  };

  // Designate a faculty member as HOD with automatic designation formatting and top repositioning
  const makeHod = (targetId: string | number) => {
    const tId = String(targetId);
    const targetMember = facultyList.find((f) => String(f.id) === tId);
    if (!targetMember) return;

    // Determine base academic title
    let baseRank = targetMember.designation || "Assistant Professor";
    baseRank = baseRank.replace(/\s*&\s*(hod|head of (the )?department)/gi, "").trim();
    if (!baseRank || /^hod$/i.test(baseRank)) baseRank = "Assistant Professor";

    // Standardized combined HOD title (shows in the input box immediately!)
    const newHodDesignation = `${baseRank} & HOD`;

    // Revert previous HOD's designation back to their base academic rank
    const updatedList = facultyList.map((f) => {
      if (String(f.id) === tId) {
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

    // Move target to index 0 (Top), followed by the rest sorted by hierarchy
    const newHod = updatedList.find((f) => String(f.id) === tId)!;
    const others = updatedList.filter((f) => String(f.id) !== tId);
    const sortedOthers = sortFacultyList(others);

    setFacultyList([newHod, ...sortedOthers]);
    toast.success(`Set "${targetMember.name}" as Head of Department (${newHodDesignation}). Click 'Save Roster' to save.`);
  };

  const [facultyToDelete, setFacultyToDelete] = useState<{ id: string | number; name: string } | null>(null);

  // Direct remove faculty implementation and move to Deleted Faculty archive
  const confirmDeleteFaculty = () => {
    if (facultyToDelete) {
      const targetId = String(facultyToDelete.id);
      const itemToDelete = facultyList.find((f) => String(f.id) === targetId);

      if (itemToDelete) {
        const updatedDeleted = [itemToDelete, ...deletedFacultyList.filter((f) => String(f.id) !== targetId)];
        setDeletedFacultyList(updatedDeleted);
        try {
          localStorage.setItem(`jntugv_deleted_faculty_${deptKey}`, JSON.stringify(updatedDeleted));
          localStorage.setItem(`jntugv_deleted_faculty_rows_${deptKey}`, JSON.stringify(updatedDeleted));
          // Remove from restored set if deleted again
          const restoredKey = `jntugv_restored_faculty_${deptKey}`;
          const prevRestored: string[] = JSON.parse(localStorage.getItem(restoredKey) || "[]");
          const itemNorm = getNormalizedFacultyName(itemToDelete.name || "");
          localStorage.setItem(
            restoredKey,
            JSON.stringify(prevRestored.filter((k) => k !== targetId && k !== itemNorm))
          );
        } catch {}
      }

      setFacultyList((prev) => prev.filter((f) => String(f.id) !== targetId));
      toast.success(`Removed "${facultyToDelete.name}" to Deleted/Archived archive below.`);
      setFacultyToDelete(null);
    }
  };

  // Restore deleted faculty member back into active roster
  const restoreFaculty = (item: any) => {
    const targetId = String(item.id);
    const targetNorm = getNormalizedFacultyName(item.name || "");

    // 1. Remove from deletedFacultyList state
    const updatedDeleted = deletedFacultyList.filter((f) => {
      if (f.id && item.id && String(f.id) === targetId) return false;
      const fNorm = getNormalizedFacultyName(f.name || "");
      return !(fNorm && targetNorm && fNorm === targetNorm);
    });
    setDeletedFacultyList(updatedDeleted);

    // 2. Add to active facultyList state (avoid duplicates)
    setFacultyList((prev) => {
      const exists = prev.some((f) => {
        if (f.id && item.id && String(f.id) === targetId) return true;
        const fNorm = getNormalizedFacultyName(f.name || "");
        return fNorm && targetNorm && fNorm === targetNorm;
      });
      if (exists) return prev;
      return [item, ...prev];
    });

    // 3. Update localStorage
    try {
      localStorage.setItem(`jntugv_deleted_faculty_${deptKey}`, JSON.stringify(updatedDeleted));
      localStorage.setItem(`jntugv_deleted_faculty_rows_${deptKey}`, JSON.stringify(updatedDeleted));
      const restoredKey = `jntugv_restored_faculty_${deptKey}`;
      const prevRestored = JSON.parse(localStorage.getItem(restoredKey) || "[]");
      localStorage.setItem(restoredKey, JSON.stringify([...new Set([...prevRestored, targetId, targetNorm])]));
    } catch {}

    toast.success(`Restored "${item.name}" to active roster. Click 'Save Roster' to save.`);
  };

  // Permanently purge a deleted faculty item from the archive
  const purgeDeletedFaculty = (id: string | number) => {
    const targetId = String(id);
    const updatedDeleted = deletedFacultyList.filter((f) => String(f.id) !== targetId);
    setDeletedFacultyList(updatedDeleted);
    try {
      localStorage.setItem(`jntugv_deleted_faculty_${deptKey}`, JSON.stringify(updatedDeleted));
      localStorage.setItem(`jntugv_deleted_faculty_rows_${deptKey}`, JSON.stringify(updatedDeleted));
    } catch {}
    toast.info("Removed permanently from archive.");
  };

  // Clear all archived faculty items
  const clearAllDeletedFaculty = () => {
    setDeletedFacultyList([]);
    try {
      localStorage.removeItem(`jntugv_deleted_faculty_${deptKey}`);
      localStorage.removeItem(`jntugv_deleted_faculty_rows_${deptKey}`);
    } catch {}
    toast.info("Cleared all archived faculty records.");
  };

  // Move faculty card up/down with 1 click
  const moveFaculty = (index: number, direction: "up" | "down") => {
    setFacultyList((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;

      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Drag & Drop Reordering Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItemNode.current = index;
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(index));
    } catch {
      // ignore
    }
  };

  const handleDragEnter = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragItemNode.current === null || dragItemNode.current === targetIndex) return;

    const sourceIndex = dragItemNode.current;
    setFacultyList((prev) => {
      const copy = [...prev];
      const [draggedItem] = copy.splice(sourceIndex, 1);
      copy.splice(targetIndex, 0, draggedItem);
      return copy;
    });
    dragItemNode.current = targetIndex;
    setDraggingIndex(targetIndex);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    dragItemNode.current = null;
    setDraggingIndex(null);
  };

  // In non-edit mode, display HOD at top and rest sorted. In edit mode, display full reorderable list.
  const rosterHod = !isEditMode
    ? facultyList.find((f) => /hod|head of (the )?department/i.test(f.designation || ""))
    : null;
  // Fall back to an additional-charge HOD from another department's roster; their profile lives there
  const hodMember = rosterHod || (!isEditMode ? data?.hod_member : null) || null;
  const hodProfileDeptId = rosterHod ? deptId : data?.hod_member?.dept_slug || deptId;

  const displayList = !isEditMode
    ? sortFacultyList(
        facultyList.filter(
          (f) => !/hod|head of (the )?department/i.test(f.designation || "")
        )
      )
    : facultyList;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner & Admin Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Faculty Profiles</span>
            {isEditMode && (
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Drag & Drop Mode
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {isEditMode
              ? "Hold and drag cards, or use arrow buttons to rearrange positions. Click 'Make as HOD' to change leadership. Add, edit, or remove faculty members and click 'Save Roster'."
              : "Detailed profiles, research domains, and academic credentials of department faculty."}
          </p>
        </div>

        {isEditMode && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addFaculty}
              className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-slate-900 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <UserPlus size={15} />
              <span>+ Add Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => mutation.mutate(facultyList)}
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Roster</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Isolated Centered Row for HOD in Public View */}
        {hodMember && (
          <div className="flex justify-center w-full mb-2">
            <div className="w-full md:w-1/2">
              <FacultyCard
                f={hodMember}
                index={0}
                totalCount={1}
                isEditMode={false}
                deptId={hodProfileDeptId}
                isHod={true}
                handleUpdate={handleUpdate}
                onRequestDelete={(target) => setFacultyToDelete(target)}
                onMakeHod={makeHod}
                moveFaculty={moveFaculty}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
              />
            </div>
          </div>
        )}

        {/* Animated Auto-Adjustable 2-Column Grid Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayList.map((f, idx) => {
              const cardIsHod = /hod|head of (the )?department/i.test(f.designation || "");
              return (
                <FacultyCard
                  key={f.id ? String(f.id) : `idx_${idx}`}
                  f={f}
                  index={idx}
                  totalCount={displayList.length}
                  isEditMode={isEditMode}
                  deptId={deptId}
                  isDragging={draggingIndex === idx}
                  isHod={cardIsHod}
                  handleUpdate={handleUpdate}
                  onRequestDelete={(target) => setFacultyToDelete(target)}
                  onMakeHod={makeHod}
                  moveFaculty={moveFaculty}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* ─── DELETED / ARCHIVED FACULTY SECTION (ADMIN & HOD ONLY) ─── */}
        {isEditMode && deletedFacultyList.length > 0 && (
          <div className="pt-8 border-t-2 border-dashed border-rose-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-300 flex-shrink-0">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>Deleted Faculty Archive</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-200 text-rose-900">
                      {deletedFacultyList.length}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Visible <strong>only to Admin & HOD</strong>. Click <strong>"Restore"</strong> to add any faculty back to the active roster.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearAllDeletedFaculty}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors self-start sm:self-auto cursor-pointer"
              >
                Clear Archive
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deletedFacultyList.map((df) => (
                <div
                  key={String(df.id)}
                  className="p-4 rounded-2xl border border-rose-200 bg-rose-50/30 flex items-center justify-between gap-4 transition-all hover:bg-rose-50/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      <SafeImage
                        src={df.photo_url}
                        alt={df.name}
                        fallbackName={df.name}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate line-through decoration-rose-400">
                        {df.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {formatCleanDesignation(df.designation) || "Assistant Professor"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => restoreFaculty(df)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                      title="Restore to Active Roster"
                    >
                      <RotateCcw size={13} />
                      <span>Restore</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => purgeDeletedFaculty(df.id)}
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
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {facultyToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setFacultyToDelete(null)}
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
                    Delete Faculty Member?
                  </h3>
                  <p className="text-sm text-slate-600">
                    Are you sure you want to remove <span className="font-bold text-slate-900">"{facultyToDelete.name}"</span> from the faculty roster?
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-800 leading-relaxed">
                <strong>Notice:</strong> The card will be removed from your view. Click <strong>"Save Roster"</strong> to apply changes permanently, or reload the page to undo.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFacultyToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteFaculty}
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