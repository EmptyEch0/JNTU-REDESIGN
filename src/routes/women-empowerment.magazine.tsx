import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWeMagazines, addWeMagazine, updateWeMagazine, deleteWeMagazine } from "@/funcs/we";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Download, Plus, Edit2, Trash2, Check, X, FileText } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/women-empowerment/magazine")({
  component: WEMagazinePage,
});

function WEMagazinePage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({ title: "", url: "" });

  // Adding state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<any>({ title: "", url: "" });

  const { data: magazines = [], isLoading } = useQuery({
    queryKey: ["we-magazines"],
    queryFn: () => getWeMagazines(),
  });

  const addMutation = useMutation({
    mutationFn: addWeMagazine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-magazines"] });
      toast.success("Magazine issue added successfully!");
      setShowAddForm(false);
      setAddForm({ title: "", url: "" });
    },
    onError: () => toast.error("Failed to add magazine issue."),
  });

  const updateMutation = useMutation({
    mutationFn: updateWeMagazine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-magazines"] });
      toast.success("Magazine issue updated successfully!");
      setEditingId(null);
    },
    onError: () => toast.error("Failed to update magazine issue."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWeMagazine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-magazines"] });
      toast.success("Magazine issue deleted successfully!");
    },
    onError: () => toast.error("Failed to delete magazine issue."),
  });

  const handleEditClick = (mag: any) => {
    setEditingId(mag.id);
    setEditForm({ ...mag });
  };

  const handleEditSave = () => {
    if (!editForm.title.trim() || !editForm.url.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    updateMutation.mutate({ data: editForm });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title.trim() || !addForm.url.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    addMutation.mutate({ data: addForm });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this magazine issue?")) {
      deleteMutation.mutate({ data: id });
    }
  };

  return (
    <section className="py-12 container-narrow">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <SectionLabel eyebrow="Publications" title="Magazine - Yuthika" />

          {isEditMode && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-xs shadow-lg hover:scale-105 transition-all shrink-0 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" /> Add Magazine Issue
            </button>
          )}
        </div>
      </RevealOnScroll>

      {/* Add New Issue Form */}
      {showAddForm && (
        <RevealOnScroll>
          <div className="mb-8 p-6 bg-card border border-border rounded-3xl shadow-sm max-w-lg">
            <h3 className="text-lg font-bold text-ink mb-4">Add New Yuthika Issue</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Issue Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  placeholder="e.g., Yuthika - Issue 3"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Document/Drive Link
                </label>
                <input
                  type="url"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                  value={addForm.url}
                  onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                  placeholder="https://example.com/magazine.pdf"
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
                  Add Issue
                </button>
              </div>
            </form>
          </div>
        </RevealOnScroll>
      )}

      {/* Magazines Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-xs text-muted-foreground animate-pulse">
            Loading magazines...
          </div>
        ) : magazines.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-muted-foreground font-medium border border-dashed border-border rounded-3xl bg-card">
            No magazine issues available at the moment.
          </div>
        ) : (
          magazines.map((mag: any, idx: number) => {
            const isEditing = editingId === mag.id;
            return (
              <RevealOnScroll key={mag.id} delay={idx * 50}>
                <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm hover-lift flex flex-col justify-between h-full relative group/mag">
                  {/* Inline admin controls */}
                  {isEditMode && !isEditing && (
                    <div className="absolute top-6 right-6 flex gap-1.5 opacity-0 group-hover/mag:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(mag)}
                        className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(mag.id)}
                        className="p-1 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary grid place-items-center mb-2">
                      <BookOpen className="h-6 w-6 text-primary/70" />
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 pt-2">
                        <input
                          className="w-full bg-primary/5 border border-primary/20 rounded p-2 text-xs font-bold outline-none text-ink"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        />
                        <input
                          className="w-full bg-primary/5 border border-primary/20 rounded p-2 text-xs outline-none text-muted-foreground"
                          value={editForm.url}
                          onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-ink text-base leading-tight">{mag.title}</h4>
                        <p className="text-xs text-muted-foreground font-medium mt-1.5">
                          Women's Day Special Magazine
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
                    {isEditing ? (
                      <div className="flex gap-2 justify-end w-full">
                        <button
                          onClick={handleEditSave}
                          className="p-1.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <a
                          href={mag.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                        >
                          <FileText className="h-4 w-4" /> Read Online
                        </a>
                        <a
                          href={mag.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full bg-muted border border-border grid place-items-center hover:bg-muted-foreground/10 text-ink transition-colors"
                          title="Download PDF"
                        >
                          <Download className="h-3.5 w-3.5 text-muted-foreground" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })
        )}
      </div>
    </section>
  );
}
