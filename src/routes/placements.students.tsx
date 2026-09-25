import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { SectionLabel } from "@/components/SectionLabel";
import { PLACEMENTS_SUBNAV } from "@/lib/site";
import placementsImg from "@/assets/placements-bg.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  getPlacementYears,
  getPlacementHighlights,
  addPlacementYear,
  addPlacementHighlight,
  updatePlacementYear,
  deletePlacementYear,
  updatePlacementHighlight,
  deletePlacementHighlight,
} from "../lib/placements";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  deleteStudentsByYear,
} from "../funcs/students";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  User,
  Calendar,
  X,
  Edit3,
  Briefcase,
  Search,
} from "lucide-react";

import { Pagination } from "@/components/Pagination";

export const Route = createFileRoute("/placements/students")({
  head: () => ({
    meta: [
      { title: "Students Placed — Placements — JNTU-GV CEV" },
      {
        name: "description",
        content: "Year-wise placement statistics and detailed student placement list.",
      },
    ],
  }),
  component: StudentsPlacedPage,
});

function StudentsPlacedPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode, setGlobalEditMode } = useAdmin();

  // Local state for tracking changes
  const [editedYears, setEditedYears] = useState<Record<number, any>>({});
  const [editedHighlights, setEditedHighlights] = useState<Record<number, any>>({});
  const [editedStudents, setEditedStudents] = useState<Record<number, any>>({});
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});
  const [pages, setPages] = useState<Record<string, number>>({});

  // Modals / Dialog state
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [newBatchYear, setNewBatchYear] = useState("");
  const [targetBatchForStudent, setTargetBatchForStudent] = useState<string | null>(null);
  const [newStudentData, setNewStudentData] = useState({
    name: "",
    rollNo: "",
    branch: "CSE",
    company: "",
    campusType: "On Campus",
  });

  const { data: years = [] } = useQuery({
    queryKey: ["placementYears"],
    queryFn: () => getPlacementYears(),
  });
  const { data: highlights = [] } = useQuery({
    queryKey: ["placementHighlights"],
    queryFn: () => getPlacementHighlights(),
  });
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents(),
  });

  // Group students by academic year
  const groupedStudents = useMemo(() => {
    const groups: Record<string, any[]> = {};
    students.forEach((s) => {
      if (!groups[s.year]) groups[s.year] = [];
      groups[s.year].push(s);
    });
    return groups;
  }, [students]);

  // Combined list of all academic years (from placementYears AND students)
  const allDisplayYears = useMemo(() => {
    const set = new Set<string>();
    years.forEach((y: any) => {
      if (y.year) set.add(y.year);
    });
    students.forEach((s: any) => {
      if (s.year) set.add(s.year);
    });
    if (set.size === 0) {
      set.add("2025-2026");
      set.add("2024-2025");
      set.add("2023-2024");
      set.add("2022-2023");
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [years, students]);

  const toggleYear = (year: string) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const handleStudentChange = (id: number, field: string, value: any) => {
    setEditedStudents((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleHighlightChange = (id: number, field: string, value: any) => {
    setEditedHighlights((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveAllChanges = async () => {
    const promises = [
      ...Object.entries(editedYears).map(([id, data]) =>
        updatePlacementYear({ data: { id: parseInt(id), ...data } }),
      ),
      ...Object.entries(editedHighlights).map(([id, data]) =>
        updatePlacementHighlight({ data: { id: parseInt(id), ...data } }),
      ),
      ...Object.entries(editedStudents).map(([id, data]) =>
        updateStudent({ data: { id: parseInt(id), ...data } }),
      ),
    ];

    if (promises.length === 0) return;

    toast.promise(Promise.all(promises), {
      loading: "Saving all updates...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["placementYears"] });
        queryClient.invalidateQueries({ queryKey: ["placementHighlights"] });
        queryClient.invalidateQueries({ queryKey: ["students"] });
        setEditedYears({});
        setEditedHighlights({});
        setEditedStudents({});
        return "All changes saved successfully!";
      },
      error: "Failed to save changes.",
    });
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchYear.trim()) {
      toast.error("Please enter a valid batch year.");
      return;
    }
    const formatted = newBatchYear.trim();
    await addPlacementYear({
      data: { year: formatted, offers: 0, top: "0 LPA", recruiters: 0 },
    });
    queryClient.invalidateQueries({ queryKey: ["placementYears"] });
    setExpandedYears((p) => ({ ...p, [formatted]: true }));
    setNewBatchYear("");
    setIsAddingBatch(false);
    toast.success(`Academic batch "${formatted}" added!`);
  };

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBatchForStudent) return;
    if (!newStudentData.name.trim() || !newStudentData.company.trim()) {
      toast.error("Please enter Student Name and Company.");
      return;
    }

    const roll = newStudentData.rollNo.trim() || `GEN-${Date.now().toString().slice(-6)}`;
    await addStudent({
      data: {
        name: newStudentData.name.trim(),
        rollNo: roll,
        branch: newStudentData.branch.trim() || "CSE",
        year: targetBatchForStudent,
        campusType: newStudentData.campusType || "On Campus",
        company: newStudentData.company.trim(),
      },
    });

    queryClient.invalidateQueries({ queryKey: ["students"] });
    setNewStudentData({
      name: "",
      rollNo: "",
      branch: "CSE",
      company: "",
      campusType: "On Campus",
    });
    setTargetBatchForStudent(null);
    toast.success(`Student added to ${targetBatchForStudent}!`);
  };

  const handleDeleteStudent = async (id: number) => {
    if (confirm("Remove this student record?")) {
      await deleteStudent({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Record deleted");
    }
  };

  const handleDeleteBatch = async (year: string) => {
    const studentCount = groupedStudents[year]?.length || 0;
    if (
      confirm(
        `Are you sure you want to delete batch "${year}" and remove its ${studentCount} students?`
      )
    ) {
      await deleteStudentsByYear({ data: { year } });
      const matching = years.find((y: any) => y.year === year);
      if (matching) {
        await deletePlacementYear({ data: { id: matching.id } });
      }
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["placementYears"] });
      toast.success(`Batch "${year}" deleted`);
    }
  };

  const handleAddHighlight = async () => {
    const name = prompt("Enter student name:");
    if (name) {
      await addPlacementHighlight({
        data: { name, branch: "CSE", company: "TBD", package: "0 LPA" },
      });
      queryClient.invalidateQueries({ queryKey: ["placementHighlights"] });
      toast.success("Highlight added");
    }
  };

  const hasUnsavedChanges =
    Object.keys(editedYears).length > 0 ||
    Object.keys(editedHighlights).length > 0 ||
    Object.keys(editedStudents).length > 0;

  // Dynamic Stats
  const totalOffers = years.reduce((acc, y) => acc + (y.offers || 0), 0);
  const maxLPA = years.reduce((max, y) => {
    const match = String(y.top || "").match(/[\d.]+/);
    const val = match ? parseFloat(match[0]) : 0;
    return val > max ? val : max;
  }, 0);
  const totalRecruiters = years[0]?.recruiters || 92;

  return (
    <>
      <PageHero
        eyebrow="Placements"
        title="Students Placed"
        subtitle="Detailed records of student achievements and placement outcomes."
        image={placementsImg}
      />
      <SubNav items={PLACEMENTS_SUBNAV} />

      {/* Admin Mode Toggle Bar */}
      {isAdmin && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 sticky top-12 z-40 shadow-sm">
          <div className="container-narrow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm font-bold text-amber-900 uppercase tracking-wider">
                Administrator Mode
              </span>
            </div>
            <button
              onClick={() => setGlobalEditMode(!isEditMode)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                isEditMode
                  ? "bg-amber-600 text-white border-amber-600 shadow-md"
                  : "bg-white text-amber-700 border-amber-200 hover:border-amber-300"
              }`}
            >
              {isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
            </button>
          </div>
        </div>
      )}

      {/* Stat Counters */}
      <section className="py-20 container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-elegant">
          <div className="bg-card p-8">
            <StatCounter value={students.length || 232} label="Total Students" suffix="+" />
          </div>
          <div className="bg-card p-8">
            <StatCounter value={maxLPA || 45} label="LPA Top Package" suffix="L" />
          </div>
          <div className="bg-card p-8">
            <StatCounter value={totalRecruiters || 92} label="Recruiters" suffix="+" />
          </div>
          <div className="bg-card p-8">
            <StatCounter value={92} label="Placement %" suffix="%" />
          </div>
        </div>
      </section>

      {/* Placement Trend (Yearly Statistics) */}
      <section className="py-16 bg-sand">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-8">
            <RevealOnScroll>
              <SectionLabel eyebrow="History" title="Placement Trend" />
            </RevealOnScroll>
            {isEditMode && (
              <button
                onClick={() => setIsAddingBatch(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow"
              >
                <Plus size={14} /> Add Year Stat
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="min-w-full text-left">
              <thead className="bg-sand-deep/40 text-eyebrow text-[10px]">
                <tr>
                  <th className="px-6 py-4">Academic Year</th>
                  <th className="px-6 py-4">Offers</th>
                  <th className="px-6 py-4">Top Package</th>
                  <th className="px-6 py-4">Recruiters</th>
                  {isEditMode && <th className="px-6 py-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {years?.map((y: any) => (
                  <tr
                    key={y.id}
                    className={`transition-all ${
                      isEditMode ? "bg-amber-50/30" : "hover:bg-sand/30"
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-ink">
                      {isEditMode ? (
                        <input
                          className="bg-white border border-amber-200 rounded px-2 py-1 text-sm w-full"
                          value={editedYears[y.id]?.year ?? y.year}
                          onChange={(e) =>
                            setEditedYears({
                              ...editedYears,
                              [y.id]: { ...editedYears[y.id], year: e.target.value },
                            })
                          }
                        />
                      ) : (
                        y.year
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditMode ? (
                        <input
                          type="number"
                          className="bg-white border border-amber-200 rounded px-2 py-1 text-sm w-24"
                          value={editedYears[y.id]?.offers ?? y.offers}
                          onChange={(e) =>
                            setEditedYears({
                              ...editedYears,
                              [y.id]: { ...editedYears[y.id], offers: parseInt(e.target.value) },
                            })
                          }
                        />
                      ) : (
                        y.offers
                      )}
                    </td>
                    <td className="px-6 py-4 text-primary font-bold">
                      {isEditMode ? (
                        <input
                          className="bg-white border border-amber-200 rounded px-2 py-1 text-sm w-24"
                          value={editedYears[y.id]?.top ?? y.top}
                          onChange={(e) =>
                            setEditedYears({
                              ...editedYears,
                              [y.id]: { ...editedYears[y.id], top: e.target.value },
                            })
                          }
                        />
                      ) : (
                        y.top
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditMode ? (
                        <input
                          type="number"
                          className="bg-white border border-amber-200 rounded px-2 py-1 text-sm w-20"
                          value={editedYears[y.id]?.recruiters ?? y.recruiters}
                          onChange={(e) =>
                            setEditedYears({
                              ...editedYears,
                              [y.id]: {
                                ...editedYears[y.id],
                                recruiters: parseInt(e.target.value),
                              },
                            })
                          }
                        />
                      ) : (
                        y.recruiters
                      )}
                    </td>
                    {isEditMode && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            if (confirm(`Delete year "${y.year}"?`)) {
                              await deletePlacementYear({ data: { id: y.id } });
                              queryClient.invalidateQueries({ queryKey: ["placementYears"] });
                              toast.success("Year deleted");
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Student Highlights Section */}
      <section className="py-16">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-8">
            <RevealOnScroll>
              <SectionLabel eyebrow="Star Placements" title="Key Highlights" />
            </RevealOnScroll>
            {isEditMode && (
              <button
                onClick={handleAddHighlight}
                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <Plus size={14} /> Add Highlight
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h: any) => (
              <RevealOnScroll key={h.id}>
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative group hover:border-primary/40 transition-colors">
                  {isEditMode && (
                    <button
                      onClick={async () => {
                        if (confirm(`Delete highlight for "${h.name}"?`)) {
                          await deletePlacementHighlight({ data: { id: h.id } });
                          queryClient.invalidateQueries({ queryKey: ["placementHighlights"] });
                          toast.success("Highlight removed");
                        }
                      }}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div>
                    {isEditMode ? (
                      <div className="space-y-2 mb-4">
                        <input
                          className="font-bold text-ink text-base w-full border-b border-amber-200 outline-none"
                          value={editedHighlights[h.id]?.name ?? h.name}
                          onChange={(e) => handleHighlightChange(h.id, "name", e.target.value)}
                        />
                        <input
                          className="text-xs text-muted-foreground w-full border-b border-amber-200 outline-none"
                          value={editedHighlights[h.id]?.branch ?? h.branch}
                          onChange={(e) => handleHighlightChange(h.id, "branch", e.target.value)}
                        />
                        <input
                          className="text-xs text-muted-foreground w-full border-b border-amber-200 outline-none"
                          value={editedHighlights[h.id]?.company ?? h.company}
                          onChange={(e) => handleHighlightChange(h.id, "company", e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-ink text-lg">{h.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{h.branch}</p>
                        <div className="text-sm font-semibold text-slate-700 mt-2">{h.company}</div>
                      </>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Package</span>
                    {isEditMode ? (
                      <input
                        className="font-bold text-primary text-sm text-right w-20 border-b border-amber-200 outline-none"
                        value={editedHighlights[h.id]?.package ?? h.package}
                        onChange={(e) => handleHighlightChange(h.id, "package", e.target.value)}
                      />
                    ) : (
                      <span className="font-bold text-primary text-base">{h.package}</span>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DETAILED LIST: STUDENTS PLACED BY YEAR                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-sand/30">
        <div className="container-narrow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <RevealOnScroll>
              <div>
                <div className="text-eyebrow text-xs uppercase font-bold text-primary tracking-widest mb-1">
                  Detailed List
                </div>
                <h2 className="text-3xl font-bold text-ink">Students Placed by Year</h2>
              </div>
            </RevealOnScroll>

            {isEditMode && (
              <button
                onClick={() => setIsAddingBatch(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/90 transition cursor-pointer"
              >
                <Plus size={16} /> + Add Academic Year / Batch (e.g. 2025-26)
              </button>
            )}
          </div>

          {/* Add New Batch Modal / Dropdown Dialog */}
          {isEditMode && isAddingBatch && (
            <div className="mb-8 p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 shadow-lg animate-in fade-in">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-500/10">
                <div className="font-bold text-sm text-amber-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Add New Academic Year / Batch
                </div>
                <button
                  onClick={() => setIsAddingBatch(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-black/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleCreateBatch} className="flex flex-wrap items-center gap-3">
                <input
                  placeholder="e.g. 2025-2026 or 2025-26"
                  value={newBatchYear}
                  onChange={(e) => setNewBatchYear(e.target.value)}
                  required
                  className="px-4 py-2.5 rounded-xl border border-amber-500/30 bg-white font-bold text-sm outline-none focus:ring-2 focus:ring-amber-500 w-72"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primary/90 transition cursor-pointer"
                >
                  Create Batch Accordion
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingBatch(false)}
                  className="px-4 py-2.5 text-xs text-slate-600 hover:bg-black/5 rounded-xl"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Add Student Form Modal */}
          {isEditMode && targetBatchForStudent && (
            <div className="mb-8 p-6 rounded-3xl bg-primary/5 border-2 border-primary/20 shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary/10">
                <div className="font-bold text-base text-ink flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Add Placed Student to Batch:{" "}
                  <span className="text-primary font-black">{targetBatchForStudent}</span>
                </div>
                <button
                  onClick={() => setTargetBatchForStudent(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-black/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={handleAddStudentSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                    Student Name *
                  </label>
                  <input
                    placeholder="e.g. K. Sai Kumar"
                    value={newStudentData.name}
                    onChange={(e) =>
                      setNewStudentData({ ...newStudentData, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                    Roll Number
                  </label>
                  <input
                    placeholder="e.g. 21VV1A0501"
                    value={newStudentData.rollNo}
                    onChange={(e) =>
                      setNewStudentData({ ...newStudentData, rollNo: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-xs font-mono outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                    Branch / Dept
                  </label>
                  <select
                    value={newStudentData.branch}
                    onChange={(e) =>
                      setNewStudentData({ ...newStudentData, branch: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="IT">IT</option>
                    <option value="MET">MET</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                    Company *
                  </label>
                  <input
                    placeholder="e.g. TCS / Amazon"
                    value={newStudentData.company}
                    onChange={(e) =>
                      setNewStudentData({ ...newStudentData, company: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                    Campus Type
                  </label>
                  <select
                    value={newStudentData.campusType}
                    onChange={(e) =>
                      setNewStudentData({ ...newStudentData, campusType: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="On Campus">On Campus</option>
                    <option value="Off Campus">Off Campus</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-5 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setTargetBatchForStudent(null)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-black/5 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primary/90 transition cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Student Record
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Batches Accordions */}
          <div className="space-y-6">
            {allDisplayYears.map((year) => {
              const yearStudents = groupedStudents[year] || [];
              const isExpanded = expandedYears[year] || isEditMode;

              return (
                <div
                  key={year}
                  className="border border-border rounded-3xl overflow-hidden shadow-elegant bg-card transition-all"
                >
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center justify-between p-6 bg-sand/20 hover:bg-sand/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {expandedYears[year] ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ink">{year}</h3>
                        <p className="text-xs text-muted-foreground">
                          {yearStudents.length} Students Placed
                        </p>
                      </div>
                    </div>

                    {isEditMode && (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setTargetBatchForStudent(year)}
                          className="flex items-center gap-1.5 bg-primary text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
                        >
                          <Plus size={14} /> Add Student
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(year)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title={`Delete batch ${year}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </button>

                  {isExpanded && (() => {
                    const currentPage = pages[year] || 1;
                    const pageSize = 15;
                    const totalPages = Math.ceil(yearStudents.length / pageSize);
                    const paginatedStudents = isEditMode
                      ? yearStudents
                      : yearStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

                    if (yearStudents.length === 0) {
                      return (
                        <div className="p-8 text-center text-muted-foreground border-t border-border text-sm">
                          No students listed in batch {year} yet.
                          {isEditMode && (
                            <div className="mt-2">
                              <button
                                onClick={() => setTargetBatchForStudent(year)}
                                className="text-xs text-primary font-bold hover:underline"
                              >
                                + Add the first student now
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="overflow-x-auto border-t border-border">
                        <table className="min-w-full text-left">
                          <thead className="bg-sand/10 text-eyebrow text-[9px]">
                            <tr>
                              <th className="px-6 py-3">Student Name</th>
                              <th className="px-6 py-3">Roll No</th>
                              <th className="px-6 py-3">Branch</th>
                              <th className="px-6 py-3">Campus</th>
                              <th className="px-6 py-3">Company</th>
                              {isEditMode && <th className="px-6 py-3 text-right">Action</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {paginatedStudents.map((s) => (
                              <tr
                                key={s.id}
                                className={`transition-colors ${
                                  isEditMode ? "bg-amber-50/20" : "hover:bg-sand/5"
                                }`}
                              >
                                <td className="px-6 py-4">
                                  {isEditMode ? (
                                    <input
                                      className="bg-white border border-amber-200 rounded p-1 text-xs w-full font-bold"
                                      value={editedStudents[s.id]?.name ?? s.name}
                                      onChange={(e) =>
                                        handleStudentChange(s.id, "name", e.target.value)
                                      }
                                    />
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-muted-foreground shrink-0">
                                        <User size={14} />
                                      </div>
                                      <span className="font-medium text-ink text-sm">{s.name}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                                  {isEditMode ? (
                                    <input
                                      className="bg-white border border-amber-200 rounded p-1 text-xs w-full font-mono"
                                      value={editedStudents[s.id]?.rollNo ?? s.rollNo}
                                      onChange={(e) =>
                                        handleStudentChange(s.id, "rollNo", e.target.value)
                                      }
                                    />
                                  ) : (
                                    s.rollNo
                                  )}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                  {isEditMode ? (
                                    <input
                                      className="bg-white border border-amber-200 rounded p-1 text-xs w-20"
                                      value={editedStudents[s.id]?.branch ?? s.branch}
                                      onChange={(e) =>
                                        handleStudentChange(s.id, "branch", e.target.value)
                                      }
                                    />
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-bold">
                                      {s.branch}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-[11px]">
                                  {isEditMode ? (
                                    <select
                                      className="bg-white border border-amber-200 rounded p-1 text-xs"
                                      value={editedStudents[s.id]?.campusType ?? s.campusType}
                                      onChange={(e) =>
                                        handleStudentChange(s.id, "campusType", e.target.value)
                                      }
                                    >
                                      <option value="On Campus">On Campus</option>
                                      <option value="Off Campus">Off Campus</option>
                                      <option value="On Campus (Virtual)">
                                        On Campus (Virtual)
                                      </option>
                                    </select>
                                  ) : (
                                    s.campusType
                                  )}
                                </td>
                                <td className="px-6 py-4 text-primary font-bold text-xs">
                                  {isEditMode ? (
                                    <input
                                      className="bg-white border border-amber-200 rounded p-1 text-xs w-full"
                                      value={editedStudents[s.id]?.company ?? s.company}
                                      onChange={(e) =>
                                        handleStudentChange(s.id, "company", e.target.value)
                                      }
                                    />
                                  ) : (
                                    s.company
                                  )}
                                </td>
                                {isEditMode && (
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => handleDeleteStudent(s.id)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                      title="Delete student"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {!isEditMode && totalPages > 1 && (
                          <div className="p-4 border-t border-border flex justify-end">
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={(page) =>
                                setPages((prev) => ({ ...prev, [year]: page }))
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating Save All Changes Bar */}
      {isEditMode && hasUnsavedChanges && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-5">
          <button
            onClick={saveAllChanges}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold text-sm tracking-wide border-2 border-white/20"
          >
            <Save className="h-5 w-5" /> Save All Placement Changes
          </button>
        </div>
      )}
    </>
  );
}
