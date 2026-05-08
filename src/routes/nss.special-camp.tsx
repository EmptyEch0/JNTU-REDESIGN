import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNssSpecialCamp,
  addNssSpecialCamp,
  updateNssSpecialCamp,
  deleteNssSpecialCamp,
} from "@/funcs/nss";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { toast } from "sonner";
import { Edit2, Trash2, Check, X, Plus, Calendar, Star, MapPin } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/nss/special-camp")({
  component: NSSSpecialCampPage,
});

function NSSSpecialCampPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({ day: "", description: "" });

  // Adding state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<any>({ day: "", description: "" });

  const { data: campDays = [], isLoading } = useQuery({
    queryKey: ["nss-special-camp"],
    queryFn: () => getNssSpecialCamp(),
  });

  const addMutation = useMutation({
    mutationFn: addNssSpecialCamp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nss-special-camp"] });
      toast.success("Camp day added successfully!");
      setShowAddForm(false);
      setAddForm({ day: "", description: "" });
    },
    onError: () => toast.error("Failed to add camp day."),
  });

  const updateMutation = useMutation({
    mutationFn: updateNssSpecialCamp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nss-special-camp"] });
      toast.success("Camp day updated successfully!");
      setEditingId(null);
    },
    onError: () => toast.error("Failed to update camp day."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNssSpecialCamp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nss-special-camp"] });
      toast.success("Camp day deleted successfully!");
    },
    onError: () => toast.error("Failed to delete camp day."),
  });

  const handleEditClick = (dayRecord: any) => {
    setEditingId(dayRecord.id);
    setEditForm({ ...dayRecord });
  };

  const handleEditSave = () => {
    if (!editForm.day.trim() || !editForm.description.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }
    updateMutation.mutate({ data: editForm });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.day.trim() || !addForm.description.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }
    addMutation.mutate({ data: addForm });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this camp day?")) {
      deleteMutation.mutate({ data: id });
    }
  };

  return (
    <section className="py-12 container-narrow">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <SectionLabel eyebrow="Annual Special Camps" title="Dwarapudi Village Camp" />
            <p className="mt-2 text-sm text-muted-foreground max-w-xl font-medium">
              Conducted from{" "}
              <span className="text-primary font-bold">06-03-2020 to 12-03-2020</span> at Dwarapudi
              Village, Vizianagaram district to raise community health, environment, and social
              awareness.
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-xs shadow-lg hover:scale-105 transition-all shrink-0 self-start"
            >
              <Plus className="h-4 w-4" /> Add Camp Day
            </button>
          )}
        </div>
      </RevealOnScroll>

      {/* Add Camp Day Form */}
      {showAddForm && (
        <RevealOnScroll>
          <div className="mb-8 p-6 bg-card border border-border rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold text-ink mb-4">Add New Camp Day</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Day Header
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                  value={addForm.day}
                  onChange={(e) => setAddForm({ ...addForm, day: e.target.value })}
                  placeholder="e.g., Day 8 (13-03-2020)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Activities Description
                </label>
                <textarea
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary min-h-[100px]"
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  placeholder="Describe the activities conducted by volunteers on this day..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
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
                  Add Day
                </button>
              </div>
            </form>
          </div>
        </RevealOnScroll>
      )}

      {/* Vertical Timeline */}
      <div className="relative mt-16 max-w-4xl mx-auto">
        {/* Timeline central vertical guide line */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-[1px] hidden sm:block" />
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-border -translate-x-[1px] sm:hidden" />

        {isLoading ? (
          <div className="py-16 grid place-items-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : campDays.length === 0 ? (
          <p className="text-center text-xs font-medium text-muted-foreground py-12">
            No camp days seeded in the timeline.
          </p>
        ) : (
          <div className="space-y-12">
            {campDays.map((dayRecord: any, idx: number) => {
              const isEven = idx % 2 === 0;
              const isEditing = editingId === dayRecord.id;

              return (
                <RevealOnScroll key={dayRecord.id} delay={idx * 60}>
                  <div
                    className={`relative flex flex-col sm:flex-row items-stretch ${isEven ? "sm:flex-row-reverse" : ""}`}
                  >
                    {/* Circle Dot Indicator */}
                    <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-1.5 h-4 w-4 rounded-full border-[3px] border-primary bg-background shadow-elegant z-10" />

                    {/* Timeline Card content wrapper */}
                    <div className="w-full sm:w-[calc(50%-24px)] pl-12 sm:pl-0">
                      <div className="p-6 bg-card border border-border rounded-3xl hover-lift shadow-sm relative">
                        {/* Header Details */}
                        <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                          <Calendar className="h-3.5 w-3.5" />
                          {isEditing ? (
                            <input
                              type="text"
                              className="w-full bg-primary/5 border border-primary/20 rounded-md p-1 outline-none text-xs font-bold"
                              value={editForm.day}
                              onChange={(e) => setEditForm({ ...editForm, day: e.target.value })}
                            />
                          ) : (
                            dayRecord.day
                          )}
                        </div>

                        {/* Activities Text */}
                        {isEditing ? (
                          <textarea
                            className="w-full text-sm text-muted-foreground leading-relaxed bg-primary/5 border border-primary/20 rounded-md p-2 outline-none min-h-[80px]"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({ ...editForm, description: e.target.value })
                            }
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            {dayRecord.description}
                          </p>
                        )}

                        {/* Timeline Card Actions */}
                        {isEditMode && (
                          <div className="mt-4 pt-4 border-t border-border flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={handleEditSave}
                                  className="p-1.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                                  title="Save"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1.5 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                  title="Cancel"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditClick(dayRecord)}
                                  className="p-1.5 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                                  title="Edit Day"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(dayRecord.id)}
                                  className="p-1.5 rounded-full bg-red-500/5 text-red-600 hover:bg-red-500/10 transition-colors"
                                  title="Delete Day"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Empty block for layout alignment on desktop */}
                    <div className="hidden sm:block w-[calc(50%-24px)]" />
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
