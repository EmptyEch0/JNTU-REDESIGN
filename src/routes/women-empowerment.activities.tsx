import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWeActivities, addWeActivity, updateWeActivity, deleteWeActivity } from "@/funcs/we";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/women-empowerment/activities")({
  component: WEActivitiesPage,
});

function WEActivitiesPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({ sNo: 0, title: "", date: "" });

  // Adding state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<any>({ sNo: 0, title: "", date: "" });

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["we-activities"],
    queryFn: () => getWeActivities(),
  });

  const addMutation = useMutation({
    mutationFn: addWeActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-activities"] });
      toast.success("Activity added successfully!");
      setShowAddForm(false);
      setAddForm({ sNo: 0, title: "", date: "" });
    },
    onError: () => toast.error("Failed to add activity."),
  });

  const updateMutation = useMutation({
    mutationFn: updateWeActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-activities"] });
      toast.success("Activity updated successfully!");
      setEditingId(null);
    },
    onError: () => toast.error("Failed to update activity."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWeActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-activities"] });
      toast.success("Activity deleted successfully!");
    },
    onError: () => toast.error("Failed to delete activity."),
  });

  const handleEditClick = (act: any) => {
    setEditingId(act.id);
    setEditForm({ ...act });
  };

  const handleEditSave = () => {
    if (!editForm.title.trim() || !editForm.date.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    updateMutation.mutate({ data: editForm });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title.trim() || !addForm.date.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    const nextSNo = activities.length > 0 ? Math.max(...activities.map((a: any) => a.sNo)) + 1 : 1;
    addMutation.mutate({ data: { ...addForm, sNo: addForm.sNo || nextSNo } });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      deleteMutation.mutate({ data: id });
    }
  };

  // Filter items based on search term
  const filteredActivities = activities.filter((act: any) => {
    const term = searchTerm.toLowerCase();
    return act.title.toLowerCase().includes(term) || act.date.toLowerCase().includes(term);
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-12 container-narrow">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <SectionLabel eyebrow="Service History" title="WE&GC Activities" />

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full bg-card border border-border rounded-full pl-10 pr-4 py-2.5 text-xs text-ink outline-none focus:border-primary focus:shadow-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {isEditMode && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-xs shadow-lg hover:scale-105 transition-all shrink-0"
              >
                <Plus className="h-4 w-4" /> Add Activity
              </button>
            )}
          </div>
        </div>
      </RevealOnScroll>

      {/* Add Form Component */}
      {showAddForm && (
        <RevealOnScroll>
          <div className="mb-8 p-6 bg-card border border-border rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold text-ink mb-4">Add New WE&GC Activity</h3>
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  S.No
                </label>
                <input
                  type="number"
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                  value={addForm.sNo || ""}
                  onChange={(e) => setAddForm({ ...addForm, sNo: parseInt(e.target.value) || 0 })}
                  placeholder="Optional (Auto-calculated)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  placeholder="e.g., International Women's Day"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Date
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                  value={addForm.date}
                  onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                  placeholder="e.g., 08-03-2020"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </RevealOnScroll>
      )}

      {/* Activities Table */}
      <RevealOnScroll delay={100}>
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-16">
                    S.No
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-3/5">
                    Title of the Program
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  {isEditMode && (
                    <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-28 text-center">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={isEditMode ? 4 : 3}
                      className="px-6 py-16 text-center text-muted-foreground"
                    >
                      <div className="spinner mx-auto scale-75" />
                      <span className="block mt-2 text-xs">Loading activities...</span>
                    </td>
                  </tr>
                ) : filteredActivities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isEditMode ? 4 : 3}
                      className="px-6 py-12 text-center text-xs text-muted-foreground font-medium"
                    >
                      No activities found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedActivities.map((act: any) => {
                    const isEditing = editingId === act.id;
                    return (
                      <tr
                        key={act.id}
                        className="group hover:bg-primary/[0.01] transition-colors align-middle"
                      >
                        {/* S.No */}
                        <td className="px-6 py-4.5 text-xs font-semibold text-muted-foreground">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-full bg-primary/5 border border-primary/20 rounded-md p-1.5 text-xs font-semibold text-ink outline-none"
                              value={editForm.sNo}
                              onChange={(e) =>
                                setEditForm({ ...editForm, sNo: parseInt(e.target.value) || 0 })
                              }
                            />
                          ) : (
                            act.sNo
                          )}
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4.5 text-xs font-bold text-ink leading-relaxed">
                          {isEditing ? (
                            <input
                              type="text"
                              className="w-full bg-primary/5 border border-primary/20 rounded-md p-1.5 text-xs font-bold text-ink outline-none"
                              value={editForm.title}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            />
                          ) : (
                            act.title
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4.5 text-xs text-muted-foreground font-medium">
                          {isEditing ? (
                            <input
                              type="text"
                              className="w-full bg-primary/5 border border-primary/20 rounded-md p-1.5 text-xs text-muted-foreground outline-none"
                              value={editForm.date}
                              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-primary/60" /> {act.date}
                            </span>
                          )}
                        </td>

                        {/* Edit/Delete Actions */}
                        {isEditMode && (
                          <td className="px-6 py-4.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={handleEditSave}
                                    className="p-1.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                                    title="Save Changes"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="p-1.5 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                    title="Cancel"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditClick(act)}
                                    className="p-1.5 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                                    title="Edit Activity"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(act.id)}
                                    className="p-1.5 rounded-full bg-red-500/5 text-red-600 hover:bg-red-500/10 transition-colors"
                                    title="Delete Activity"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </RevealOnScroll>

      {/* Pagination component */}
      {!isLoading && totalPages > 1 && (
        <RevealOnScroll>
          <div className="mt-8 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              Showing <span className="font-semibold text-ink">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-ink">
                {Math.min(startIndex + itemsPerPage, filteredActivities.length)}
              </span>{" "}
              of <span className="font-semibold text-ink">{filteredActivities.length}</span>{" "}
              activities
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                className="h-9 w-9 rounded-full border border-border grid place-items-center hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none text-ink transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold px-3 text-ink">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                className="h-9 w-9 rounded-full border border-border grid place-items-center hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none text-ink transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </RevealOnScroll>
      )}
    </section>
  );
}
