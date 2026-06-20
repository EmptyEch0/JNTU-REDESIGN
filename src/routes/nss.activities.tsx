import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNssActivities,
  addNssActivity,
  updateNssActivity,
  deleteNssActivity,
} from "@/funcs/nss";
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
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/nss/activities")({
  component: NSSActivitiesPage,
});

function NSSActivitiesPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({
    sNo: 0,
    activity: "",
    dateConducted: "",
    venue: "",
    description: "",
  });

  // Adding state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<any>({
    sNo: 0,
    activity: "",
    dateConducted: "",
    venue: "",
    description: "",
  });

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["nss-activities"],
    queryFn: () => getNssActivities(),
  });

  const addMutation = useMutation({
    mutationFn: addNssActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nss-activities"] });
      toast.success("Activity added successfully!");
      setShowAddForm(false);
      setAddForm({ sNo: 0, activity: "", dateConducted: "", venue: "", description: "" });
    },
    onError: () => toast.error("Failed to add activity."),
  });

  const updateMutation = useMutation({
    mutationFn: updateNssActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nss-activities"] });
      toast.success("Activity updated successfully!");
      setEditingId(null);
    },
    onError: () => toast.error("Failed to update activity."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNssActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nss-activities"] });
      toast.success("Activity deleted successfully!");
    },
    onError: () => toast.error("Failed to delete activity."),
  });

  const handleEditClick = (act: any) => {
    setEditingId(act.id);
    setEditForm({ ...act });
  };

  const handleEditSave = () => {
    if (!editForm.activity.trim() || !editForm.dateConducted.trim() || !editForm.venue.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    updateMutation.mutate({ data: editForm });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.activity.trim() || !addForm.dateConducted.trim() || !addForm.venue.trim()) {
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
    return (
      act.activity.toLowerCase().includes(term) ||
      act.venue.toLowerCase().includes(term) ||
      act.description.toLowerCase().includes(term) ||
      act.dateConducted.toLowerCase().includes(term)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-12 container-narrow">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <SectionLabel eyebrow="Service History" title="NSS Activities" />

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
            <h3 className="text-lg font-bold text-ink mb-4">Add New NSS Activity</h3>
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
                  Activity Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                  value={addForm.activity}
                  onChange={(e) => setAddForm({ ...addForm, activity: e.target.value })}
                  placeholder="Blood Donation Drive"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Date Conducted
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                  value={addForm.dateConducted}
                  onChange={(e) => setAddForm({ ...addForm, dateConducted: e.target.value })}
                  placeholder="e.g., 22-07-2014"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                  value={addForm.venue}
                  onChange={(e) => setAddForm({ ...addForm, venue: e.target.value })}
                  placeholder="e.g., JNTUK UCEV campus"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Description / Theme
                </label>
                <textarea
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary min-h-[80px]"
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  placeholder="Provide brief details about the volunteers, outcomes, or impact..."
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
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-16">
                    S.No
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/4">
                    Activity
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-40">
                    Date
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-48">
                    Venue
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Description
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
                      colSpan={isEditMode ? 6 : 5}
                      className="px-6 py-16 text-center text-muted-foreground"
                    >
                      <div className="spinner mx-auto scale-75" />
                      <span className="block mt-2 text-xs">Loading activities...</span>
                    </td>
                  </tr>
                ) : filteredActivities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isEditMode ? 6 : 5}
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
                        className="group hover:bg-primary/[0.01] transition-colors align-top"
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

                        {/* Activity */}
                        <td className="px-6 py-4.5 text-xs font-bold text-ink">
                          {isEditing ? (
                            <input
                              type="text"
                              className="w-full bg-primary/5 border border-primary/20 rounded-md p-1.5 text-xs font-bold text-ink outline-none"
                              value={editForm.activity}
                              onChange={(e) =>
                                setEditForm({ ...editForm, activity: e.target.value })
                              }
                            />
                          ) : (
                            act.activity
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4.5 text-xs text-muted-foreground font-medium">
                          {isEditing ? (
                            <input
                              type="text"
                              className="w-full bg-primary/5 border border-primary/20 rounded-md p-1.5 text-xs text-muted-foreground outline-none"
                              value={editForm.dateConducted}
                              onChange={(e) =>
                                setEditForm({ ...editForm, dateConducted: e.target.value })
                              }
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-primary/60" />{" "}
                              {act.dateConducted}
                            </span>
                          )}
                        </td>

                        {/* Venue */}
                        <td className="px-6 py-4.5 text-xs text-muted-foreground font-medium">
                          {isEditing ? (
                            <input
                              type="text"
                              className="w-full bg-primary/5 border border-primary/20 rounded-md p-1.5 text-xs text-muted-foreground outline-none"
                              value={editForm.venue}
                              onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-primary/60 shrink-0" />{" "}
                              {act.venue}
                            </span>
                          )}
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4.5 text-xs text-muted-foreground leading-relaxed font-medium">
                          {isEditing ? (
                            <textarea
                              className="w-full bg-primary/5 border border-primary/20 rounded-md p-1.5 text-xs text-muted-foreground outline-none min-h-[60px]"
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm({ ...editForm, description: e.target.value })
                              }
                            />
                          ) : (
                            act.description
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
