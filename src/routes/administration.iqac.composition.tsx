import { createFileRoute } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { IQAC_SUBNAV } from "@/lib/site";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIqacComposition,
  addIqacComposition,
  updateIqacComposition,
  deleteIqacComposition,
} from "../funcs/leadership";
import { Users, Plus, Trash2, Save, X, Edit3, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { FacultyProfileLink } from "@/components/FacultyProfileLink";

export const Route = createFileRoute("/administration/iqac/composition")({
  head: () => ({
    meta: [
      { title: "IQAC Composition — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content: "Members and composition of the Internal Quality Assurance Cell at JNTU-GV CEV.",
      },
    ],
  }),
  component: CompositionPage,
});

function CompositionPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedMembers, setEditedMembers] = useState<Record<number, any>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    designation: "",
    role: "Member",
  });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["iqac", "composition"],
    queryFn: () => getIqacComposition(),
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string; designation: string; role: string }) =>
      addIqacComposition({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "composition"] });
      setNewMember({ name: "", designation: "", role: "Member" });
      setIsAdding(false);
      toast.success("Committee member added successfully!");
    },
    onError: () => {
      toast.error("Failed to add committee member.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteIqacComposition({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "composition"] });
      toast.success("Member removed from IQAC committee.");
    },
    onError: () => {
      toast.error("Failed to remove member.");
    },
  });

  const handleMemberChange = (id: number, field: string, value: string) => {
    setEditedMembers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveRow = async (id: number) => {
    const changes = editedMembers[id];
    if (!changes) return;
    try {
      await updateIqacComposition({ data: { id, ...changes } });
      queryClient.invalidateQueries({ queryKey: ["iqac", "composition"] });
      setEditedMembers((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success("Member updated successfully!");
    } catch {
      toast.error("Failed to update member.");
    }
  };

  const handleSaveAll = async () => {
    const entries = Object.entries(editedMembers);
    if (entries.length === 0) return;

    try {
      await Promise.all(
        entries.map(([id, data]) =>
          updateIqacComposition({ data: { id: parseInt(id), ...data } })
        )
      );
      queryClient.invalidateQueries({ queryKey: ["iqac", "composition"] });
      setEditedMembers({});
      toast.success("All IQAC composition changes saved!");
    } catch {
      toast.error("Failed to save some changes.");
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the IQAC committee?`)) {
      deleteMutation.mutate(id);
    }
  };

  const hasUnsavedChanges = Object.keys(editedMembers).length > 0;

  return (
    <section className="py-12 md:py-20">
      <RevealOnScroll>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20 shrink-0">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-ink">Committee Members</h3>
                <p className="text-muted-foreground mt-1">
                  Institutional and external stakeholders ensuring academic excellence.
                </p>
              </div>
            </div>

            {isEditMode && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Committee Member
                </button>
              </div>
            )}
          </div>

          {/* Add Member Form Modal / Panel */}
          {isEditMode && isAdding && (
            <div className="mb-8 p-6 rounded-3xl bg-amber-500/5 border-2 border-amber-500/20 shadow-lg animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-500/10">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Edit3 className="h-4 w-4" /> Add New IQAC Committee Member
                </div>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-black/5 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMember.name || !newMember.designation) {
                    toast.error("Please provide both Name and Designation.");
                    return;
                  }
                  addMutation.mutate(newMember);
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                    Member Name *
                  </label>
                  <input
                    placeholder="e.g. Prof. V. S. Vakula"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                    Designation *
                  </label>
                  <input
                    placeholder="e.g. Principal, JNTU-GV CEV"
                    value={newMember.designation}
                    onChange={(e) =>
                      setNewMember({ ...newMember, designation: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                    Role in IQAC *
                  </label>
                  <input
                    placeholder="e.g. Chairperson / Member Secretary / Member"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-black/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addMutation.isPending}
                    className="px-6 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {addMutation.isPending ? "Adding..." : "Save Member"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-hidden rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-elegant">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-16 text-center">
                      S.No
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[220px]">
                      Name of the Member
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[280px]">
                      Designation
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[180px]">
                      Role in IQAC
                    </th>
                    {isEditMode && (
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right w-28">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={isEditMode ? 5 : 4}
                        className="px-8 py-20 text-center text-muted-foreground animate-pulse"
                      >
                        Loading committee details...
                      </td>
                    </tr>
                  ) : members?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isEditMode ? 5 : 4}
                        className="px-8 py-16 text-center text-muted-foreground"
                      >
                        No committee members configured.
                      </td>
                    </tr>
                  ) : (
                    members?.map((member: any, idx: number) => {
                      const currentName = editedMembers[member.id]?.name ?? member.name;
                      const currentDesignation =
                        editedMembers[member.id]?.designation ?? member.designation;
                      const currentRole = editedMembers[member.id]?.role ?? member.role;
                      const isRowEdited = !!editedMembers[member.id];

                      const isChair = (currentRole || "").toLowerCase().includes("chair");
                      const isSec = (currentRole || "").toLowerCase().includes("secretary");

                      return (
                        <tr
                          key={member.id}
                          className={`group transition-colors ${
                            isEditMode
                              ? isRowEdited
                                ? "bg-amber-50/40 dark:bg-amber-950/20"
                                : "hover:bg-amber-50/20"
                              : "hover:bg-primary/[0.02]"
                          }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-muted-foreground text-center">
                            {idx + 1}
                          </td>

                          <td className="px-6 py-4">
                            {isEditMode ? (
                              <input
                                value={currentName}
                                onChange={(e) =>
                                  handleMemberChange(member.id, "name", e.target.value)
                                }
                                className="w-full px-3 py-1.5 rounded-lg border border-amber-500/20 bg-white font-bold text-ink text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none transition"
                                placeholder="Member Name"
                              />
                            ) : (
                              <span className="text-sm font-bold text-ink group-hover:text-primary transition-colors">
                                <FacultyProfileLink name={member.name} />
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {isEditMode ? (
                              <input
                                value={currentDesignation}
                                onChange={(e) =>
                                  handleMemberChange(member.id, "designation", e.target.value)
                                }
                                className="w-full px-3 py-1.5 rounded-lg border border-amber-500/20 bg-white text-sm text-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none transition"
                                placeholder="Designation"
                              />
                            ) : (
                              <span className="text-sm text-muted-foreground leading-relaxed">
                                {member.designation}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {isEditMode ? (
                              <input
                                value={currentRole}
                                onChange={(e) =>
                                  handleMemberChange(member.id, "role", e.target.value)
                                }
                                className="w-full px-3 py-1.5 rounded-lg border border-amber-500/20 bg-white text-xs font-semibold text-primary focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none transition"
                                placeholder="Role (e.g. Chairperson)"
                              />
                            ) : (
                              <span
                                className={`inline-flex px-3.5 py-1 rounded-full text-xs font-bold tracking-tight ${
                                  isChair
                                    ? "bg-primary text-white shadow-xs"
                                    : isSec
                                    ? "bg-primary/15 text-primary border border-primary/30"
                                    : "bg-primary/5 text-primary"
                                }`}
                              >
                                {member.role}
                              </span>
                            )}
                          </td>

                          {isEditMode && (
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {isRowEdited && (
                                  <button
                                    onClick={() => handleSaveRow(member.id)}
                                    title="Save this row"
                                    className="p-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition shadow-xs cursor-pointer"
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(member.id, member.name)}
                                  title="Delete member"
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
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
        </div>
      </RevealOnScroll>

      {/* Floating Save All Changes Bar */}
      {isEditMode && hasUnsavedChanges && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-5">
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold text-sm tracking-wide border-2 border-white/20"
          >
            <Save className="h-5 w-5" /> Save All Committee Changes
          </button>
        </div>
      )}
    </section>
  );
}
