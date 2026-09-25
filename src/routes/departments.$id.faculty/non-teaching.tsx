import { createFileRoute, useLoaderData, useParams, Link } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { DEPARTMENT_NON_TEACHING_STAFF, type DepartmentNonTeachingStaffItem } from "@/data/department-faculty-data";
import { useState, useMemo, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  Briefcase,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight,
  Info,
  Search,
  Plus,
  Trash2,
  Save,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/departments/$id/faculty/non-teaching")({
  head: ({ loaderData }) => {
    const data = loaderData as DepartmentData | undefined;
    const name = data?.name || "Department";
    return {
      meta: [
        { title: `Non-Teaching Staff — Department of ${name} | JNTU-GV CEV` },
        {
          name: "description",
          content: `Directory of non-teaching, technical, and administrative support staff for the Department of ${name} at JNTU-GV College of Engineering Vizianagaram.`,
        },
      ],
    };
  },
  component: NonTeachingStaffPage,
});

function NonTeachingStaffPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const { id: deptId } = useParams({ from: "/departments/$id/faculty/non-teaching" });
  const deptKey = (deptId || "").toLowerCase();

  const { isDeptEditing } = useAdmin();
  const isEditMode = isDeptEditing(deptId || "");

  const [searchQuery, setSearchQuery] = useState("");

  const defaultList: DepartmentNonTeachingStaffItem[] = useMemo(() => {
    return DEPARTMENT_NON_TEACHING_STAFF[deptKey] || (data?.slug ? DEPARTMENT_NON_TEACHING_STAFF[data.slug.toLowerCase()] : undefined) || [];
  }, [deptKey, data?.slug]);

  const [staffList, setStaffList] = useState<DepartmentNonTeachingStaffItem[]>(defaultList);
  const [isSaving, setIsSaving] = useState(false);

  // Load custom stored staff from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`jntugv_non_teaching_${deptKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setStaffList(parsed);
          return;
        }
      }
    } catch {
      // fallback to default
    }
    setStaffList(defaultList);
  }, [deptKey, defaultList]);

  const handleUpdate = (index: number, field: keyof DepartmentNonTeachingStaffItem, value: any) => {
    setStaffList((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
  };

  const addStaffMember = () => {
    const newMember: DepartmentNonTeachingStaffItem = {
      sNo: staffList.length + 1,
      name: "New Staff Member",
      qualification: "B.Tech / Diploma / ITI",
      designation: "Lab Assistant",
      dateOfJoining: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-"),
      association: "Regular",
    };
    setStaffList([...staffList, newMember]);
    toast.info("Added new staff row. Fill details and click 'Save Staff Roster'.");
  };

  const removeStaffMember = (index: number) => {
    const updated = staffList.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      sNo: idx + 1,
    }));
    setStaffList(updated);
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem(`jntugv_non_teaching_${deptKey}`, JSON.stringify(staffList));
      toast.success("Non-teaching staff roster saved successfully!");
    } catch (err: any) {
      toast.error("Failed to save staff records.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetToOriginal = () => {
    localStorage.removeItem(`jntugv_non_teaching_${deptKey}`);
    setStaffList(defaultList);
    toast.info("Reset to default staff roster.");
  };

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim() || isEditMode) return staffList;
    const q = searchQuery.toLowerCase().trim();
    return staffList.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.designation || "").toLowerCase().includes(q) ||
        (s.qualification || "").toLowerCase().includes(q) ||
        (s.association || "").toLowerCase().includes(q)
    );
  }, [staffList, searchQuery, isEditMode]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Non-Teaching Staff
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Technical laboratory assistants, work inspectors, technicians, and support staff for the Department of {data?.name}.
          </p>
        </div>

        {/* Admin Controls */}
        {isEditMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={resetToOriginal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
              title="Reset to original list"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
            <button
              onClick={addStaffMember}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Staff</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            >
              <Save size={14} />
              <span>{isSaving ? "Saving..." : "Save Staff Roster"}</span>
            </button>
          </div>
        )}
      </div>

      {staffList.length > 0 && !isEditMode && (
        /* Search Bar when staff exists */
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search non-teaching staff by name, designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      )}

      {/* Non-Teaching Staff Table */}
      <div className={`bg-white rounded-3xl border shadow-xs overflow-hidden ${isEditMode ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200/80'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4 w-16 text-center">S.No</th>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Qualification</th>
                <th className="py-4 px-4">Designation</th>
                <th className="py-4 px-4">Date of Joining</th>
                <th className="py-4 px-4">Association</th>
                {isEditMode && <th className="py-4 px-4 text-center w-16">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((s, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={s.name}
                          onChange={(e) => handleUpdate(idx, "name", e.target.value)}
                          className="w-full p-1.5 text-xs font-bold text-slate-900 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {s.name}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={s.qualification}
                          onChange={(e) => handleUpdate(idx, "qualification", e.target.value)}
                          className="w-full p-1.5 text-xs font-semibold text-slate-700 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="text-slate-700 text-xs font-semibold">
                          {s.qualification}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={s.designation}
                          onChange={(e) => handleUpdate(idx, "designation", e.target.value)}
                          className="w-full p-1.5 text-xs font-semibold text-slate-800 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/60">
                          {s.designation}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={s.dateOfJoining}
                          onChange={(e) => handleUpdate(idx, "dateOfJoining", e.target.value)}
                          className="w-full p-1.5 text-xs text-slate-600 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="text-slate-600 text-xs font-medium">
                          {s.dateOfJoining}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {isEditMode ? (
                        <select
                          value={s.association || "Regular"}
                          onChange={(e) => handleUpdate(idx, "association", e.target.value)}
                          className="w-full p-1.5 text-xs font-semibold text-slate-800 border border-amber-300 bg-amber-50/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          <option value="Regular">Regular</option>
                          <option value="Contract">Contract</option>
                          <option value="Outsourcing">Outsourcing</option>
                          <option value="Ad-hoc">Ad-hoc</option>
                        </select>
                      ) : s.association && s.association.trim() ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                          {s.association}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">-</span>
                      )}
                    </td>
                    {isEditMode && (
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => removeStaffMember(idx)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete staff row"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isEditMode ? 7 : 6} className="py-14 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                        <Clock size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-base">
                          {searchQuery ? "No matching staff found" : "Staff Roster Verification in Progress"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {searchQuery
                            ? `No records matched "${searchQuery}". Please try another search term.`
                            : `The non-teaching and technical staff records for the Department of ${data?.name} are currently being updated and verified with the university administration.`}
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
                          onClick={addStaffMember}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Add First Staff Member</span>
                        </button>
                      ) : (
                        <div className="pt-2">
                          <Link
                            to="/departments/$id/faculty"
                            params={{ id: deptId }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                          >
                            <Users size={13} />
                            <span>View Teaching Faculty</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
