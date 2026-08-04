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
import { getStudents, addStudent, updateStudent, deleteStudent } from "../funcs/students";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { Plus, Trash2, Save, ChevronDown, ChevronRight, User } from "lucide-react";

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
  const { isAdmin, isEditMode, toggleEditMode } = useAdmin();

  // Local state for tracking changes
  const [editedYears, setEditedYears] = useState<Record<number, any>>({});
  const [editedHighlights, setEditedHighlights] = useState<Record<number, any>>({});
  const [editedStudents, setEditedStudents] = useState<Record<number, any>>({});
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});
  const [pages, setPages] = useState<Record<string, number>>({});

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

  const groupedStudents = useMemo(() => {
    const groups: Record<string, any[]> = {};
    students.forEach((s) => {
      if (!groups[s.year]) groups[s.year] = [];
      groups[s.year].push(s);
    });
    return groups;
  }, [students]);

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

  const handleAddStudent = async (year: string) => {
    const name = prompt("Enter student name:");
    if (name) {
      await addStudent({
        data: {
          name,
          rollNo: "Pending-" + Math.random().toString(36).substring(7),
          branch: "N/A",
          year,
          campusType: "On Campus",
          company: "Pending",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added to " + year);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (confirm("Remove this student record?")) {
      await deleteStudent({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Record deleted");
    }
  };

  const handleAddYear = async () => {
    const year = prompt("Enter Academic Year (e.g., 2024-2025):");
    if (year) {
      await addPlacementYear({ data: { year, offers: 0, top: "0 LPA", recruiters: 0 } });
      queryClient.invalidateQueries({ queryKey: ["placementYears"] });
      toast.success("Academic year added");
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
        <div className="bg-amber-50 border-b border-amber-200 py-3 sticky top-0 z-50 shadow-sm">
          <div className="container-narrow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm font-bold text-amber-900 uppercase tracking-wider">
                Administrator Mode
              </span>
            </div>
            <button
              onClick={toggleEditMode}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${isEditMode ? "bg-amber-600 text-white border-amber-600 shadow-md" : "bg-white text-amber-700 border-amber-200 hover:border-amber-300"}`}
            >
              {isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
            </button>
          </div>
        </div>
      )}

      <section className="py-20 container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-elegant">
          <div className="bg-card p-8">
            <StatCounter value={students.length} label="Total Students" suffix="+" />
          </div>
          <div className="bg-card p-8">
            <StatCounter value={maxLPA} label="LPA Top Package" suffix="L" />
          </div>
          <div className="bg-card p-8">
            <StatCounter value={totalRecruiters} label="Recruiters" suffix="+" />
          </div>
          <div className="bg-card p-8">
            <StatCounter value={92} label="Placement %" suffix="%" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-sand">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-8">
            <RevealOnScroll>
              <SectionLabel eyebrow="History" title="Placement Trend" />
            </RevealOnScroll>
            {isEditMode && (
              <button
                onClick={handleAddYear}
                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all"
              >
                <Plus size={14} /> Add Year
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
                  {isEditMode && <th className="px-6 py-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {years?.map((y) => (
                  <tr
                    key={y.id}
                    className={`transition-all ${isEditMode ? "bg-amber-50/30" : "hover:bg-sand/30"}`}
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
                          className="bg-white border border-amber-200 rounded px-2 py-1 text-sm w-24 text-right"
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
                    {isEditMode && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm("Delete trend?"))
                              deletePlacementYear({ data: { id: y.id } }).then(() =>
                                queryClient.invalidateQueries({ queryKey: ["placementYears"] }),
                              );
                          }}
                          className="text-red-400 hover:text-red-600"
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

      <section className="py-20 bg-white border-y border-border">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-12">
            <RevealOnScroll>
              <SectionLabel eyebrow="Excellence" title="Student Highlights" />
            </RevealOnScroll>
            {isEditMode && (
              <button
                onClick={handleAddHighlight}
                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all"
              >
                <Plus size={14} /> Add Highlight
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights?.map((h) => (
              <RevealOnScroll key={h.id}>
                <div
                  className={`p-6 rounded-3xl border transition-all ${isEditMode ? "bg-amber-50/50 border-amber-200" : "bg-card border-border hover:shadow-elegant"}`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <User size={24} />
                    </div>
                    <div>
                      {isEditMode ? (
                        <input
                          className="font-bold text-ink bg-white border border-amber-100 rounded px-2 py-1 w-full mb-2"
                          value={editedHighlights[h.id]?.name ?? h.name}
                          onChange={(e) => handleHighlightChange(h.id, "name", e.target.value)}
                        />
                      ) : (
                        <h4 className="font-bold text-ink text-lg">{h.name}</h4>
                      )}

                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Branch:</span>
                          {isEditMode ? (
                            <input
                              className="bg-white border border-amber-100 rounded px-1 w-24 text-right"
                              value={editedHighlights[h.id]?.branch ?? h.branch}
                              onChange={(e) =>
                                handleHighlightChange(h.id, "branch", e.target.value)
                              }
                            />
                          ) : (
                            <span className="font-medium">{h.branch}</span>
                          )}
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Company:</span>
                          {isEditMode ? (
                            <input
                              className="bg-white border border-amber-100 rounded px-1 w-24 text-right"
                              value={editedHighlights[h.id]?.company ?? h.company}
                              onChange={(e) =>
                                handleHighlightChange(h.id, "company", e.target.value)
                              }
                            />
                          ) : (
                            <span className="font-medium">{h.company}</span>
                          )}
                        </div>
                        <div className="flex justify-between text-sm mt-3 pt-3 border-t border-border/50">
                          <span className="text-muted-foreground font-medium">Package:</span>
                          {isEditMode ? (
                            <input
                              className="font-bold text-primary bg-white border border-amber-100 rounded px-1 w-24 text-right"
                              value={editedHighlights[h.id]?.package ?? h.package}
                              onChange={(e) =>
                                handleHighlightChange(h.id, "package", e.target.value)
                              }
                            />
                          ) : (
                            <span className="font-bold text-primary">{h.package}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => {
                          if (confirm("Remove highlight?"))
                            deletePlacementHighlight({ data: { id: h.id } }).then(() =>
                              queryClient.invalidateQueries({ queryKey: ["placementHighlights"] }),
                            );
                        }}
                        className="text-red-400 hover:text-red-600 mt-4 self-end"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-sand/30">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Detailed List" title="Students Placed by Year" align="center" />
          </RevealOnScroll>

          <div className="mt-12 space-y-6">
            {Object.keys(groupedStudents)
              .sort((a, b) => b.localeCompare(a))
              .map((year) => (
                <div
                  key={year}
                  className="border border-border rounded-3xl overflow-hidden shadow-elegant bg-card transition-all"
                >
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center justify-between p-6 bg-sand/20 hover:bg-sand/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {expandedYears[year] ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ink">{year}</h3>
                        <p className="text-xs text-muted-foreground">
                          {groupedStudents[year].length} Students Placed
                        </p>
                      </div>
                    </div>
                    {isEditMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddStudent(year);
                        }}
                        className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all"
                      >
                        <Plus size={14} /> Add Student
                      </button>
                    )}
                  </button>

                  {(expandedYears[year] || isEditMode) && (() => {
                    const yearStudents = groupedStudents[year] || [];
                    const currentPage = pages[year] || 1;
                    const pageSize = 15;
                    const totalPages = Math.ceil(yearStudents.length / pageSize);
                    const paginatedStudents = isEditMode
                      ? yearStudents
                      : yearStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                                className={`transition-colors ${isEditMode ? "bg-amber-50/20" : "hover:bg-sand/5"}`}
                              >
                                <td className="px-6 py-4">
                                  {isEditMode ? (
                                    <input
                                      className="bg-white border border-amber-100 rounded p-1 text-xs w-full"
                                      value={editedStudents[s.id]?.name ?? s.name}
                                      onChange={(e) =>
                                        handleStudentChange(s.id, "name", e.target.value)
                                      }
                                    />
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-muted-foreground">
                                        <User size={14} />
                                      </div>
                                      <span className="font-medium text-ink text-sm">{s.name}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                                  {isEditMode ? (
                                    <input
                                      className="bg-white border border-amber-100 rounded p-1 text-xs w-full"
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
                                      className="bg-white border border-amber-100 rounded p-1 text-xs w-full"
                                      value={editedStudents[s.id]?.branch ?? s.branch}
                                      onChange={(e) =>
                                        handleStudentChange(s.id, "branch", e.target.value)
                                      }
                                    />
                                  ) : (
                                    s.branch
                                  )}
                                </td>
                                <td className="px-6 py-4 text-[10px]">
                                  {isEditMode ? (
                                    <select
                                      className="bg-white border border-amber-100 rounded p-1 text-xs w-full"
                                      value={editedStudents[s.id]?.campusType ?? s.campusType}
                                      onChange={(e) =>
                                        handleStudentChange(s.id, "campusType", e.target.value)
                                      }
                                    >
                                      <option value="On Campus">On Campus</option>
                                      <option value="Off Campus">Off Campus</option>
                                      <option value="On Campus (Virtual)">On Campus (Virtual)</option>
                                    </select>
                                  ) : (
                                    s.campusType
                                  )}
                                </td>
                                <td className="px-6 py-4 text-primary font-bold text-xs">
                                  {isEditMode ? (
                                    <input
                                      className="bg-white border border-amber-100 rounded p-1 text-xs w-full"
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
                                      className="text-red-300 hover:text-red-500"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {!isEditMode && yearStudents.length > 15 && (
                          <div className="border-t border-border px-4 py-2 bg-sand/5">
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              totalItems={yearStudents.length}
                              pageSize={pageSize}
                              onPageChange={(p) => setPages((prev) => ({ ...prev, [year]: p }))}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Floating Save Button */}
      {isAdmin && isEditMode && hasUnsavedChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[bounce_2s_infinite]">
          <button
            onClick={saveAllChanges}
            className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-primary/90 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 border-2 border-white/20 backdrop-blur-sm"
          >
            <Save size={20} />
            Save All Updates
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
              {Object.keys(editedYears).length +
                Object.keys(editedHighlights).length +
                Object.keys(editedStudents).length}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
