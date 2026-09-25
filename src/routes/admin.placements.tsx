import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPlacementYears,
  getPlacementHighlights,
  addPlacementYear,
  updatePlacementYear,
  deletePlacementYear,
  addPlacementHighlight,
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
import { PageHero } from "@/components/PageHero";
import { useAdmin } from "../context/AdminContext";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  Users,
  Briefcase,
  TrendingUp,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/placements")({
  component: AdminPlacementsPage,
});

function AdminPlacementsPage() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAdmin) navigate({ to: "/" });
  }, [isAdmin, navigate]);

  const [activeTab, setActiveTab] = useState<"students" | "stats" | "highlights">("students");

  // State for Year Statistics Form
  const [yearForm, setYearForm] = useState({ year: "", offers: 0, top: "", recruiters: 0 });
  const [editingYearId, setEditingYearId] = useState<number | null>(null);
  const [editingYearData, setEditingYearData] = useState<any>({});

  // State for Highlight Form
  const [highlightForm, setHighlightForm] = useState({
    name: "",
    branch: "",
    company: "",
    package: "",
  });
  const [editingHighlightId, setEditingHighlightId] = useState<number | null>(null);
  const [editingHighlightData, setEditingHighlightData] = useState<any>({});

  // State for Students Placed By Year / Batch Management
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNewBatch, setIsAddingNewBatch] = useState(false);
  const [newBatchYear, setNewBatchYear] = useState("");
  const [studentForm, setStudentForm] = useState({
    name: "",
    rollNo: "",
    branch: "CSE",
    company: "",
    campusType: "On Campus",
  });
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editingStudentData, setEditingStudentData] = useState<any>({});

  const { data: years = [] } = useQuery({
    queryKey: ["placementYears"],
    queryFn: () => getPlacementYears(),
  });

  const { data: highlights = [] } = useQuery({
    queryKey: ["placementHighlights"],
    queryFn: () => getPlacementHighlights(),
  });

  const { data: students = [], isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents(),
  });

  // Collect all unique batches from both placementYears and students table
  const allBatches = useMemo(() => {
    const set = new Set<string>();
    years.forEach((y: any) => {
      if (y.year) set.add(y.year);
    });
    students.forEach((s: any) => {
      if (s.year) set.add(s.year);
    });
    // Add default popular academic years if empty
    if (set.size === 0) {
      set.add("2025-2026");
      set.add("2024-2025");
      set.add("2023-2024");
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [years, students]);

  // Set initial selected batch once batches are computed
  useEffect(() => {
    if (!selectedBatch && allBatches.length > 0) {
      setSelectedBatch(allBatches[0]);
    }
  }, [allBatches, selectedBatch]);

  // Filter students by selected batch and search term
  const batchStudents = useMemo(() => {
    if (!selectedBatch) return [];
    return students.filter((s: any) => {
      const matchesBatch = s.year === selectedBatch;
      if (!matchesBatch) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (s.name || "").toLowerCase().includes(q) ||
        (s.rollNo || "").toLowerCase().includes(q) ||
        (s.branch || "").toLowerCase().includes(q) ||
        (s.company || "").toLowerCase().includes(q)
      );
    });
  }, [students, selectedBatch, searchQuery]);

  // Mutations
  const addYearMutation = useMutation({
    mutationFn: (data: any) => addPlacementYear({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placementYears"] });
      setYearForm({ year: "", offers: 0, top: "", recruiters: 0 });
      toast.success("Placement yearly statistics added successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to add placement year statistics.");
    },
  });

  const updateYearMutation = useMutation({
    mutationFn: (data: any) => updatePlacementYear({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placementYears"] });
      setEditingYearId(null);
      toast.success("Year statistics updated!");
    },
  });

  const deleteYearMutation = useMutation({
    mutationFn: (id: number) => deletePlacementYear({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placementYears"] });
      toast.success("Year statistics deleted!");
    },
  });

  const addHighlightMutation = useMutation({
    mutationFn: (data: any) => addPlacementHighlight({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placementHighlights"] });
      setHighlightForm({ name: "", branch: "", company: "", package: "" });
      toast.success("Student placement highlight added!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to add student highlight.");
    },
  });

  const deleteHighlightMutation = useMutation({
    mutationFn: (id: number) => deletePlacementHighlight({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placementHighlights"] });
      toast.success("Highlight deleted!");
    },
  });

  // Student Mutations
  const addStudentMutation = useMutation({
    mutationFn: (data: any) => addStudent({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setStudentForm({
        name: "",
        rollNo: "",
        branch: studentForm.branch || "CSE",
        company: "",
        campusType: "On Campus",
      });
      toast.success(`Student added to batch ${selectedBatch}!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to add student.");
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: (data: any) => updateStudent({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setEditingStudentId(null);
      toast.success("Student updated successfully!");
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: number) => deleteStudent({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student removed!");
    },
  });

  const deleteBatchMutation = useMutation({
    mutationFn: async (batchYear: string) => {
      await deleteStudentsByYear({ data: { year: batchYear } });
      const matchingYear = years.find((y: any) => y.year === batchYear);
      if (matchingYear) {
        await deletePlacementYear({ data: { id: matchingYear.id } });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["placementYears"] });
      setSelectedBatch(allBatches.find((b) => b !== selectedBatch) || "");
      toast.success("Batch removed successfully!");
    },
  });

  const handleCreateNewBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchYear.trim()) {
      toast.error("Please enter a batch year (e.g. 2025-2026 or 2025-26)");
      return;
    }
    const formatted = newBatchYear.trim();
    // Add to placementYears table so it's formally persisted as a year
    await addPlacementYear({
      data: { year: formatted, offers: 0, top: "0 LPA", recruiters: 0 },
    });
    queryClient.invalidateQueries({ queryKey: ["placementYears"] });
    setSelectedBatch(formatted);
    setNewBatchYear("");
    setIsAddingNewBatch(false);
    toast.success(`New batch "${formatted}" created! You can now add students.`);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) {
      toast.error("Please select or create an academic batch first.");
      return;
    }
    if (!studentForm.name || !studentForm.company) {
      toast.error("Student Name and Company are required.");
      return;
    }
    const roll = studentForm.rollNo.trim() || `GEN-${Date.now().toString().slice(-6)}`;
    addStudentMutation.mutate({
      name: studentForm.name.trim(),
      rollNo: roll,
      branch: studentForm.branch.trim() || "CSE",
      year: selectedBatch,
      campusType: studentForm.campusType || "On Campus",
      company: studentForm.company.trim(),
    });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-sand/30 pb-28">
      <PageHero
        eyebrow="Admin Portal"
        title="Placements Management"
        subtitle="Full administrative control over student placements, yearly statistics, batches, and star highlights."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/80 backdrop-blur rounded-2xl border border-border shadow-xs">
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "students"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users className="h-4 w-4" /> Students Placed by Year & Batches
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "stats"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="h-4 w-4" /> Yearly Placement Statistics
          </button>
          <button
            onClick={() => setActiveTab("highlights")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "highlights"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Briefcase className="h-4 w-4" /> Student Star Highlights
          </button>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 1: STUDENTS PLACED BY YEAR & BATCHES                      */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === "students" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Batch Selector & Add Batch Action */}
            <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <div className="text-[11px] font-bold text-primary uppercase tracking-widest">
                    Academic Year / Batch Selector
                  </div>
                  <h2 className="text-2xl font-bold text-ink mt-1">
                    Managing Batch: <span className="text-primary">{selectedBatch || "None"}</span>
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-500">Select Batch:</label>
                    <select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className="px-4 py-2 rounded-xl border border-border bg-white font-bold text-sm text-ink outline-none focus:ring-2 focus:ring-primary shadow-xs"
                    >
                      {allBatches.map((b) => (
                        <option key={b} value={b}>
                          Academic Year {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setIsAddingNewBatch(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 shadow-sm transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Create New Batch / Year
                  </button>

                  {selectedBatch && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete batch "${selectedBatch}" and all ${batchStudents.length} student records in this batch?`
                          )
                        ) {
                          deleteBatchMutation.mutate(selectedBatch);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                      title="Delete this batch and its students"
                    >
                      <Trash2 className="h-4 w-4" /> Delete Batch
                    </button>
                  )}
                </div>
              </div>

              {/* Create New Batch Dialog */}
              {isAddingNewBatch && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 animate-in fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-sm text-amber-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Add New Academic Year / Batch
                    </div>
                    <button
                      onClick={() => setIsAddingNewBatch(false)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateNewBatch} className="flex flex-wrap items-center gap-3">
                    <input
                      placeholder="e.g. 2025-2026 or 2025-26"
                      value={newBatchYear}
                      onChange={(e) => setNewBatchYear(e.target.value)}
                      required
                      className="px-4 py-2 rounded-xl border border-amber-500/30 bg-white font-semibold text-sm outline-none focus:ring-2 focus:ring-amber-500 w-64"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primary/90 transition"
                    >
                      Create Batch
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewBatch(false)}
                      className="px-4 py-2 text-xs text-slate-500 hover:bg-black/5 rounded-xl"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              {/* Add Student Form */}
              <div>
                <h3 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" /> Add Placed Student to Batch: {selectedBatch}
                </h3>
                <form
                  onSubmit={handleAddStudentSubmit}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-50 border border-border"
                >
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Student Name *
                    </label>
                    <input
                      placeholder="e.g. K. Sai Kumar"
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Roll Number
                    </label>
                    <input
                      placeholder="e.g. 21VV1A0501"
                      value={studentForm.rollNo}
                      onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-mono outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Branch / Discipline
                    </label>
                    <select
                      value={studentForm.branch}
                      onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
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
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Company Placed In *
                    </label>
                    <input
                      placeholder="e.g. TCS / Amazon"
                      value={studentForm.company}
                      onChange={(e) => setStudentForm({ ...studentForm, company: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Campus Type
                    </label>
                    <select
                      value={studentForm.campusType}
                      onChange={(e) => setStudentForm({ ...studentForm, campusType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="On Campus">On Campus</option>
                      <option value="Off Campus">Off Campus</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-5 flex justify-end mt-1">
                    <button
                      type="submit"
                      disabled={addStudentMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      {addStudentMutation.isPending ? "Adding Student..." : "Add Student to Batch"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Students List in Selected Batch */}
            <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-ink">
                    Students Placed in {selectedBatch} ({batchStudents.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Records displayed publicly under Placements → Students Placed
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    placeholder="Search by name, roll no, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-white text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-14">
                        S.No
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Student Name
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Roll No
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Branch
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Company
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Type
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right w-28">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isStudentsLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground animate-pulse">
                          Loading batch students...
                        </td>
                      </tr>
                    ) : batchStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          {searchQuery
                            ? "No students match your search."
                            : `No students recorded for batch ${selectedBatch} yet. Use the form above to add students.`}
                        </td>
                      </tr>
                    ) : (
                      batchStudents.map((student: any, idx: number) => {
                        const isEditing = editingStudentId === student.id;

                        return (
                          <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-3.5 text-xs font-mono text-muted-foreground">
                              {idx + 1}
                            </td>

                            <td className="px-6 py-3.5 font-bold text-ink text-sm">
                              {isEditing ? (
                                <input
                                  value={editingStudentData.name}
                                  onChange={(e) =>
                                    setEditingStudentData({
                                      ...editingStudentData,
                                      name: e.target.value,
                                    })
                                  }
                                  className="px-2 py-1 rounded border border-primary text-xs w-full bg-white"
                                />
                              ) : (
                                student.name
                              )}
                            </td>

                            <td className="px-6 py-3.5 text-xs font-mono text-slate-600">
                              {isEditing ? (
                                <input
                                  value={editingStudentData.rollNo}
                                  onChange={(e) =>
                                    setEditingStudentData({
                                      ...editingStudentData,
                                      rollNo: e.target.value,
                                    })
                                  }
                                  className="px-2 py-1 rounded border border-primary text-xs w-full bg-white font-mono"
                                />
                              ) : (
                                student.rollNo
                              )}
                            </td>

                            <td className="px-6 py-3.5 text-xs font-semibold">
                              {isEditing ? (
                                <input
                                  value={editingStudentData.branch}
                                  onChange={(e) =>
                                    setEditingStudentData({
                                      ...editingStudentData,
                                      branch: e.target.value,
                                    })
                                  }
                                  className="px-2 py-1 rounded border border-primary text-xs w-20 bg-white"
                                />
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-bold">
                                  {student.branch}
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-3.5 text-xs font-bold text-slate-800">
                              {isEditing ? (
                                <input
                                  value={editingStudentData.company}
                                  onChange={(e) =>
                                    setEditingStudentData({
                                      ...editingStudentData,
                                      company: e.target.value,
                                    })
                                  }
                                  className="px-2 py-1 rounded border border-primary text-xs w-full bg-white"
                                />
                              ) : (
                                student.company
                              )}
                            </td>

                            <td className="px-6 py-3.5 text-xs text-slate-500">
                              {isEditing ? (
                                <select
                                  value={editingStudentData.campusType}
                                  onChange={(e) =>
                                    setEditingStudentData({
                                      ...editingStudentData,
                                      campusType: e.target.value,
                                    })
                                  }
                                  className="px-2 py-1 rounded border border-primary text-xs bg-white"
                                >
                                  <option value="On Campus">On Campus</option>
                                  <option value="Off Campus">Off Campus</option>
                                </select>
                              ) : (
                                student.campusType
                              )}
                            </td>

                            <td className="px-6 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        updateStudentMutation.mutate({
                                          id: student.id,
                                          ...editingStudentData,
                                        })
                                      }
                                      className="p-1 rounded bg-green-600 text-white hover:bg-green-700"
                                      title="Save"
                                    >
                                      <Save className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setEditingStudentId(null)}
                                      className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                                      title="Cancel"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingStudentId(student.id);
                                        setEditingStudentData({
                                          name: student.name,
                                          rollNo: student.rollNo,
                                          branch: student.branch,
                                          company: student.company,
                                          campusType: student.campusType,
                                        });
                                      }}
                                      className="p-1 rounded text-slate-500 hover:text-primary hover:bg-primary/10"
                                      title="Edit student"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Remove student "${student.name}"?`)) {
                                          deleteStudentMutation.mutate(student.id);
                                        }
                                      }}
                                      className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50"
                                      title="Delete student"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: YEARLY PLACEMENT STATISTICS                            */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === "stats" && (
          <section className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold text-ink">Yearly Statistics</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Overview stats shown on the main placements dashboard.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addYearMutation.mutate(yearForm);
              }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-border"
            >
              <input
                className="p-3 rounded-xl border border-border bg-white text-sm"
                placeholder="Year (e.g. 2025-26)"
                value={yearForm.year}
                onChange={(e) => setYearForm({ ...yearForm, year: e.target.value })}
                required
              />
              <input
                type="number"
                className="p-3 rounded-xl border border-border bg-white text-sm"
                placeholder="Offers (e.g. 350)"
                value={yearForm.offers || ""}
                onChange={(e) => setYearForm({ ...yearForm, offers: parseInt(e.target.value) || 0 })}
                required
              />
              <input
                className="p-3 rounded-xl border border-border bg-white text-sm"
                placeholder="Top Package (e.g. 45 LPA)"
                value={yearForm.top}
                onChange={(e) => setYearForm({ ...yearForm, top: e.target.value })}
                required
              />
              <input
                type="number"
                className="p-3 rounded-xl border border-border bg-white text-sm"
                placeholder="Recruiters (e.g. 95)"
                value={yearForm.recruiters || ""}
                onChange={(e) => setYearForm({ ...yearForm, recruiters: parseInt(e.target.value) || 0 })}
                required
              />
              <button
                type="submit"
                className="md:col-span-4 bg-primary text-white p-3 rounded-xl font-bold hover:bg-primary/90 transition-colors cursor-pointer shadow"
                disabled={addYearMutation.isPending}
              >
                {addYearMutation.isPending ? "Adding..." : "+ Add Year Statistic"}
              </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-sand-deep/20">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase">
                      Year
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase">
                      Offers
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase">
                      Top Package
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase">
                      Recruiters
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {years?.map((y: any) => {
                    const isEditing = editingYearId === y.id;

                    return (
                      <tr key={y.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-ink">
                          {isEditing ? (
                            <input
                              value={editingYearData.year}
                              onChange={(e) =>
                                setEditingYearData({ ...editingYearData, year: e.target.value })
                              }
                              className="p-1 rounded border border-primary text-xs w-28 bg-white"
                            />
                          ) : (
                            y.year
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editingYearData.offers}
                              onChange={(e) =>
                                setEditingYearData({
                                  ...editingYearData,
                                  offers: parseInt(e.target.value) || 0,
                                })
                              }
                              className="p-1 rounded border border-primary text-xs w-20 bg-white"
                            />
                          ) : (
                            y.offers
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">
                          {isEditing ? (
                            <input
                              value={editingYearData.top}
                              onChange={(e) =>
                                setEditingYearData({ ...editingYearData, top: e.target.value })
                              }
                              className="p-1 rounded border border-primary text-xs w-24 bg-white"
                            />
                          ) : (
                            y.top
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editingYearData.recruiters}
                              onChange={(e) =>
                                setEditingYearData({
                                  ...editingYearData,
                                  recruiters: parseInt(e.target.value) || 0,
                                })
                              }
                              className="p-1 rounded border border-primary text-xs w-20 bg-white"
                            />
                          ) : (
                            y.recruiters
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() =>
                                    updateYearMutation.mutate({
                                      id: y.id,
                                      ...editingYearData,
                                    })
                                  }
                                  className="p-1.5 rounded bg-green-600 text-white"
                                >
                                  <Save className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingYearId(null)}
                                  className="p-1.5 rounded bg-slate-200 text-slate-700"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingYearId(y.id);
                                    setEditingYearData({
                                      year: y.year,
                                      offers: y.offers,
                                      top: y.top,
                                      recruiters: y.recruiters,
                                    });
                                  }}
                                  className="p-1.5 rounded text-slate-500 hover:text-primary hover:bg-primary/10"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete year "${y.year}"?`)) {
                                      deleteYearMutation.mutate(y.id);
                                    }
                                  }}
                                  className="p-1.5 rounded text-slate-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 3: STUDENT STAR HIGHLIGHTS                                */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === "highlights" && (
          <section className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold text-ink">Student Star Highlights</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Key placement achievements and marquee job offers.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addHighlightMutation.mutate(highlightForm);
              }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-border"
            >
              <input
                className="p-3 rounded-xl border border-border bg-white text-sm"
                placeholder="Student Name"
                value={highlightForm.name}
                onChange={(e) => setHighlightForm({ ...highlightForm, name: e.target.value })}
                required
              />
              <input
                className="p-3 rounded-xl border border-border bg-white text-sm"
                placeholder="Branch (e.g. CSE)"
                value={highlightForm.branch}
                onChange={(e) => setHighlightForm({ ...highlightForm, branch: e.target.value })}
                required
              />
              <input
                className="p-3 rounded-xl border border-border bg-white text-sm"
                placeholder="Company (e.g. Google / Microsoft)"
                value={highlightForm.company}
                onChange={(e) => setHighlightForm({ ...highlightForm, company: e.target.value })}
                required
              />
              <input
                className="p-3 rounded-xl border border-border bg-white text-sm"
                placeholder="Package (e.g. 44 LPA)"
                value={highlightForm.package}
                onChange={(e) => setHighlightForm({ ...highlightForm, package: e.target.value })}
                required
              />
              <button
                type="submit"
                className="md:col-span-4 bg-primary text-white p-3 rounded-xl font-bold hover:bg-primary/90 transition-colors cursor-pointer shadow"
                disabled={addHighlightMutation.isPending}
              >
                {addHighlightMutation.isPending ? "Adding..." : "+ Add Highlight"}
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlights?.map((h: any) => (
                <div key={h.id} className="p-5 rounded-2xl border border-border bg-white shadow-xs relative group">
                  <button
                    onClick={() => {
                      if (confirm(`Remove highlight for "${h.name}"?`)) {
                        deleteHighlightMutation.mutate(h.id);
                      }
                    }}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-80 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="font-bold text-ink text-base">{h.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {h.branch} • {h.company}
                  </div>
                  <div className="text-primary font-bold text-sm mt-2">{h.package}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
