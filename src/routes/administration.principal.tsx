import { createFileRoute } from "@tanstack/react-router";
import { imageUrl, getAssetUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ADMINISTRATION_SUBNAV } from "@/lib/site";
import { Quote, Mail, MapPin, Save, X, Users, Plus, Edit2, Trash2, Check } from "lucide-react";
const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  getLeadershipData,
  getLeadershipStaff,
  updateLeadershipData,
  addLeadershipStaff,
  updateLeadershipStaff,
  deleteLeadershipStaff,
} from "@/funcs/leadership";
import { AdminUpload } from "@/components/AdminEditPanel";
import { ProfileRenderer } from "@/components/ProfileRenderer";

export const Route = createFileRoute("/administration/principal")({
  head: () => ({
    meta: [
      { title: "Principal — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content: "Principal's message and profile of JNTU-GV College of Engineering Vizianagaram.",
      },
    ],
  }),
  component: PrincipalPage,
});

function PrincipalPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedData, setEditedData] = useState<any>(null);

  // Supporting Staff state
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", section: "", role: "" });
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [editingStaffData, setEditingStaffData] = useState({ name: "", section: "", role: "" });

  const { data: principal, isLoading: isPrincipalLoading } = useQuery({
    queryKey: ["leadership", "principal"],
    queryFn: () => getLeadershipData({ data: "principal" }),
  });

  const { data: staff, isLoading: isStaffLoading } = useQuery({
    queryKey: ["leadership-staff", "principal"],
    queryFn: () => getLeadershipStaff({ data: "principal" }),
  });

  const updateMutation = useMutation({
    mutationFn: updateLeadershipData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership", "principal"] });
      setEditedData(null);
      toast.success("Principal's information updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update Principal's information.");
    },
  });

  const addStaffMut = useMutation({
    mutationFn: addLeadershipStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership-staff", "principal"] });
      setIsAddingStaff(false);
      setNewStaff({ name: "", section: "", role: "" });
      toast.success("Supporting staff member added successfully!");
    },
    onError: () => toast.error("Failed to add supporting staff member."),
  });

  const updateStaffMut = useMutation({
    mutationFn: updateLeadershipStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership-staff", "principal"] });
      setEditingStaffId(null);
      toast.success("Supporting staff record updated!");
    },
    onError: () => toast.error("Failed to update supporting staff record."),
  });

  const deleteStaffMut = useMutation({
    mutationFn: deleteLeadershipStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership-staff", "principal"] });
      toast.success("Supporting staff record deleted.");
    },
    onError: () => toast.error("Failed to delete supporting staff record."),
  });

  const handleSave = () => {
    if (!editedData) return;
    updateMutation.mutate({ data: { id: principal.id, ...editedData } });
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.section.trim() || !newStaff.role.trim()) {
      toast.error("Please fill in all fields (Name, Section, Designation)");
      return;
    }
    addStaffMut.mutate({
      data: {
        leadershipSlug: "principal",
        name: newStaff.name.trim(),
        section: newStaff.section.trim(),
        role: newStaff.role.trim(),
      },
    });
  };

  const startEditStaff = (member: any) => {
    setEditingStaffId(member.id);
    setEditingStaffData({ name: member.name, section: member.section, role: member.role });
  };

  const saveEditStaff = (id: number) => {
    if (!editingStaffData.name.trim() || !editingStaffData.section.trim() || !editingStaffData.role.trim()) {
      toast.error("All fields are required.");
      return;
    }
    updateStaffMut.mutate({
      data: {
        id,
        name: editingStaffData.name.trim(),
        section: editingStaffData.section.trim(),
        role: editingStaffData.role.trim(),
      },
    });
  };

  if (isPrincipalLoading || !principal)
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="spinner" />
      </div>
    );

  const data = editedData || principal;

  return (
    <>
      <PageHero
        eyebrow="Administration"
        title="Principal's Desk"
        subtitle="Leading the pursuit of excellence in engineering education and research."
        image={campusImg}
      />
      <SubNav items={ADMINISTRATION_SUBNAV} />

      <section className="py-24 md:py-32 container-narrow">
        <div className="grid lg:grid-cols-[400px_1fr] gap-16 items-start max-w-6xl mx-auto">
          {/* Profile Sidebar */}
          <RevealOnScroll>
            <div className="space-y-8 lg:sticky lg:top-32">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-[40px] bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors duration-200" />
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white shadow-elegant bg-card">
                  {isEditMode ? (
                    <AdminUpload
                      value={data.image}
                      onChange={(newUrl) => setEditedData({ ...data, image: newUrl })}
                      module="administration"
                      category="leadership"
                      className="w-full h-full"
                    />
                  ) : (
                    <img decoding="async" loading="lazy"
                      src={getAssetUrl(data.image)}
                      alt={data.name}
                      className="h-full w-full object-cover transition-all duration-700"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      className="w-full text-2xl font-bold text-ink bg-primary/5 p-2 rounded outline-none"
                      value={data.name}
                      onChange={(e) => setEditedData({ ...data, name: e.target.value })}
                    />
                    <input
                      className="w-full text-primary font-medium bg-primary/5 p-2 rounded outline-none"
                      value={data.designation}
                      onChange={(e) => setEditedData({ ...data, designation: e.target.value })}
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-ink">{data.name}</h2>
                    <p className="text-primary font-medium">{data.designation}</p>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    {isEditMode ? (
                      <input
                        className="flex-1 bg-primary/5 p-1 rounded outline-none text-sm"
                        value={data.email}
                        onChange={(e) => setEditedData({ ...data, email: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm">{data.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Principal's Office, Admin Block</span>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Message Content */}
          <div className="space-y-12">
            <RevealOnScroll delay={100}>
              <div className="relative">
                <Quote className="h-12 w-12 text-primary/10 absolute -top-6 -left-6" />
                {isEditMode ? (
                  <textarea
                    className="w-full text-display text-2xl md:text-3xl text-ink leading-tight italic bg-primary/5 p-4 rounded outline-none min-h-[120px]"
                    value={data.quote}
                    onChange={(e) => setEditedData({ ...data, quote: e.target.value })}
                  />
                ) : (
                  <p className="text-display text-2xl md:text-3xl text-ink leading-tight italic">
                    "{data.quote}"
                  </p>
                )}
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="space-y-6">
                <div className="text-eyebrow">Message</div>
                {isEditMode ? (
                  <textarea
                    className="w-full text-lg text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded outline-none min-h-[300px]"
                    value={data.message}
                    onChange={(e) => setEditedData({ ...data, message: e.target.value })}
                  />
                ) : (
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {data.message}
                  </p>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Supporting Staff Section */}
        <RevealOnScroll delay={250}>
          <div className="mt-20 pt-16 border-t border-border max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center text-primary shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-ink">Supporting Staff</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The Principal’s Office plays a key role in supporting the academic activities and
                    the overall management of CEV.
                  </p>
                </div>
              </div>

              {isEditMode && (
                <button
                  onClick={() => setIsAddingStaff(!isAddingStaff)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-all self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" /> {isAddingStaff ? "Close Form" : "Add Staff Member"}
                </button>
              )}
            </div>

            {/* Add Staff Form when in Edit Mode */}
            {isEditMode && isAddingStaff && (
              <form
                onSubmit={handleAddStaffSubmit}
                className="mb-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 animate-in fade-in slide-in-from-top-2"
              >
                <div className="text-sm font-bold text-primary flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New Supporting Staff Member
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Name of the Employee *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sri. M. Umamaheswara Rao"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      className="w-full bg-white px-3.5 py-2 rounded-xl border border-border text-sm outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Section *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Principal's Office / Administration"
                      value={newStaff.section}
                      onChange={(e) => setNewStaff({ ...newStaff, section: e.target.value })}
                      className="w-full bg-white px-3.5 py-2 rounded-xl border border-border text-sm outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Designation *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SUPERINTENDENT / PA to Principal"
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      className="w-full bg-white px-3.5 py-2 rounded-xl border border-border text-sm outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingStaff(false);
                      setNewStaff({ name: "", section: "", role: "" });
                    }}
                    className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addStaffMut.isPending}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {addStaffMut.isPending ? "Adding..." : "Save Member"}
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-hidden rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Name of the Employee
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Section
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Designation
                    </th>
                    {isEditMode && (
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isStaffLoading ? (
                    <tr>
                      <td
                        colSpan={isEditMode ? 5 : 4}
                        className="px-6 py-12 text-center text-muted-foreground animate-pulse"
                      >
                        Loading staff records...
                      </td>
                    </tr>
                  ) : (
                    staff?.map((member: any, idx: number) => {
                      const isEditingThis = editingStaffId === member.id;
                      return (
                        <tr
                          key={member.id}
                          className="group hover:bg-primary/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-ink">
                            {isEditingThis ? (
                              <input
                                type="text"
                                value={editingStaffData.name}
                                onChange={(e) =>
                                  setEditingStaffData({ ...editingStaffData, name: e.target.value })
                                }
                                className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-primary text-sm font-semibold outline-none"
                              />
                            ) : (
                              <span className="group-hover:text-primary transition-colors">
                                {member.name}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                            {isEditingThis ? (
                              <input
                                type="text"
                                value={editingStaffData.section}
                                onChange={(e) =>
                                  setEditingStaffData({
                                    ...editingStaffData,
                                    section: e.target.value,
                                  })
                                }
                                className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-primary text-sm outline-none"
                              />
                            ) : (
                              member.section
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditingThis ? (
                              <input
                                type="text"
                                value={editingStaffData.role}
                                onChange={(e) =>
                                  setEditingStaffData({ ...editingStaffData, role: e.target.value })
                                }
                                className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-primary text-xs font-bold outline-none uppercase"
                              />
                            ) : (
                              <span className="inline-flex px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-tight">
                                {member.role}
                              </span>
                            )}
                          </td>
                          {isEditMode && (
                            <td className="px-6 py-4 text-right">
                              {isEditingThis ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => saveEditStaff(member.id)}
                                    disabled={updateStaffMut.isPending}
                                    title="Save"
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingStaffId(null)}
                                    title="Cancel"
                                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => startEditStaff(member)}
                                    title="Edit"
                                    className="p-1.5 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `Are you sure you want to remove ${member.name} from Supporting Staff?`
                                        )
                                      ) {
                                        deleteStaffMut.mutate({ data: { id: member.id } });
                                      }
                                    }}
                                    title="Delete"
                                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
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


        {/* Professional Profile */}
        <RevealOnScroll delay={300}>
          <div className="mt-20 pt-16 border-t border-border max-w-6xl mx-auto">
            <div className="text-eyebrow mb-8">Professional Profile</div>
            {isEditMode ? (
              <textarea
                className="w-full font-mono text-sm text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded outline-none min-h-[600px]"
                value={data.profile}
                onChange={(e) => setEditedData({ ...data, profile: e.target.value })}
              />
            ) : (
              <div className="max-w-none">
                <ProfileRenderer content={data.profile} />
              </div>
            )}
          </div>
        </RevealOnScroll>
      </section>

      {isEditMode && editedData && (
        <div className="fixed top-24 right-8 z-50 animate-in fade-in zoom-in slide-in-from-top-4">
          <div className="flex items-center gap-3 bg-card p-2 rounded-full border border-border shadow-2xl">
            <button
              onClick={() => setEditedData(null)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-muted-foreground hover:text-ink transition-colors font-medium"
            >
              <X className="h-5 w-5" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold"
            >
              <Save className="h-5 w-5" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
