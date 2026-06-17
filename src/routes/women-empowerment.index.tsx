import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWeProfile,
  updateWeProfile,
  getWeCommittee,
  addWeCommitteeMember,
  updateWeCommitteeMember,
  deleteWeCommitteeMember,
} from "@/funcs/we";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { toast } from "sonner";
import {
  Quote,
  Save,
  X,
  Mail,
  Plus,
  Edit2,
  Trash2,
  Check,
  Target,
  Heart,
  Award,
  Shield,
} from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/women-empowerment/")({
  component: WEAboutPage,
});

function WEAboutPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();
  const [editedProfile, setEditedProfile] = useState<any>(null);

  // Committee Editing States
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editMemberForm, setEditMemberForm] = useState<any>({ name: "", role: "", email: "" });

  // Committee Adding States
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberForm, setAddMemberForm] = useState<any>({ name: "", role: "", email: "" });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["we-profile"],
    queryFn: () => getWeProfile(),
  });

  const { data: committee = [], isLoading: isCommitteeLoading } = useQuery({
    queryKey: ["we-committee"],
    queryFn: () => getWeCommittee(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateWeProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-profile"] });
      setEditedProfile(null);
      toast.success("Profile information updated successfully!");
    },
    onError: () => toast.error("Failed to update profile information."),
  });

  const addMemberMutation = useMutation({
    mutationFn: addWeCommitteeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-committee"] });
      setShowAddMember(false);
      setAddMemberForm({ name: "", role: "", email: "" });
      toast.success("Committee member added successfully!");
    },
    onError: () => toast.error("Failed to add committee member."),
  });

  const updateMemberMutation = useMutation({
    mutationFn: updateWeCommitteeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-committee"] });
      setEditingMemberId(null);
      toast.success("Committee member updated successfully!");
    },
    onError: () => toast.error("Failed to update committee member."),
  });

  const deleteMemberMutation = useMutation({
    mutationFn: deleteWeCommitteeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-committee"] });
      toast.success("Committee member deleted successfully!");
    },
    onError: () => toast.error("Failed to delete committee member."),
  });

  const handleProfileSave = () => {
    if (!editedProfile) return;
    updateProfileMutation.mutate({ data: editedProfile });
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMemberForm.name.trim() || !addMemberForm.role.trim()) {
      toast.error("Please fill in name and role.");
      return;
    }
    addMemberMutation.mutate({ data: addMemberForm });
  };

  const handleEditMemberClick = (m: any) => {
    setEditingMemberId(m.id);
    setEditMemberForm({ ...m });
  };

  const handleEditMemberSave = () => {
    if (!editMemberForm.name.trim() || !editMemberForm.role.trim()) {
      toast.error("Please fill in name and role.");
      return;
    }
    updateMemberMutation.mutate({ data: editMemberForm });
  };

  const handleDeleteMember = (id: number) => {
    if (confirm("Are you sure you want to delete this committee member?")) {
      deleteMemberMutation.mutate({ data: id });
    }
  };

  if (isProfileLoading || !profile) {
    return (
      <div className="py-20 grid place-items-center">
        <div className="spinner" />
      </div>
    );
  }

  const pData = editedProfile || profile;

  return (
    <>
      <section className="py-16 container-narrow">
        <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
          {/* Main About & Vision/Mission/Objectives Section */}
          <div className="space-y-12">
            {/* About Text */}
            <RevealOnScroll>
              <div className="space-y-6">
                <SectionLabel eyebrow="History & Purpose" title="About WE&GC" />

                {isEditMode ? (
                  <textarea
                    className="w-full text-base text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-2xl border border-border outline-none min-h-[300px] focus:border-primary"
                    value={pData.aboutText}
                    onChange={(e) => setEditedProfile({ ...pData, aboutText: e.target.value })}
                  />
                ) : (
                  <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {pData.aboutText}
                  </p>
                )}
              </div>
            </RevealOnScroll>

            {/* Quote banner */}
            <RevealOnScroll delay={100}>
              <div className="p-8 bg-primary/5 border border-primary/10 rounded-3xl relative">
                <Quote className="h-10 w-10 text-primary/10 absolute -top-5 -left-2" />
                {isEditMode ? (
                  <input
                    className="w-full bg-transparent text-xl md:text-2xl font-bold font-display italic text-primary outline-none"
                    value={pData.quote}
                    onChange={(e) => setEditedProfile({ ...pData, quote: e.target.value })}
                  />
                ) : (
                  <h3 className="text-xl md:text-2xl font-bold font-display italic text-primary leading-tight">
                    "{pData.quote}"
                  </h3>
                )}
              </div>
            </RevealOnScroll>

            {/* Vision & Mission */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <RevealOnScroll delay={120}>
                <div className="p-6 bg-card border border-border rounded-2xl h-full shadow-sm hover-lift">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4">
                    <Target className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-ink text-base mb-2">Our Vision</h4>
                  {isEditMode ? (
                    <textarea
                      className="w-full text-xs text-muted-foreground bg-primary/5 p-2 rounded outline-none"
                      value={pData.vision}
                      onChange={(e) => setEditedProfile({ ...pData, vision: e.target.value })}
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {pData.vision}
                    </p>
                  )}
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={150}>
                <div className="p-6 bg-card border border-border rounded-2xl h-full shadow-sm hover-lift">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4">
                    <Award className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-ink text-base mb-2">Our Mission</h4>
                  {isEditMode ? (
                    <textarea
                      className="w-full text-xs text-muted-foreground bg-primary/5 p-2 rounded outline-none"
                      value={pData.mission}
                      onChange={(e) => setEditedProfile({ ...pData, mission: e.target.value })}
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {pData.mission}
                    </p>
                  )}
                </div>
              </RevealOnScroll>
            </div>

            {/* Objectives */}
            <RevealOnScroll delay={200}>
              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-bold text-ink">Objectives</h3>
                <ul className="grid gap-3.5">
                  {(pData.objectives as string[])?.map((obj: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex gap-3 items-start text-sm text-muted-foreground font-medium leading-relaxed"
                    >
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {isEditMode ? (
                        <input
                          className="w-full bg-primary/5 p-1 rounded text-xs outline-none"
                          value={obj}
                          onChange={(e) => {
                            const updatedObj = [...(pData.objectives as string[])];
                            updatedObj[idx] = e.target.value;
                            setEditedProfile({ ...pData, objectives: updatedObj });
                          }}
                        />
                      ) : (
                        <span>{obj}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          </div>

          {/* Convener Desk Column */}
          <RevealOnScroll delay={200}>
            <div className="space-y-8 bg-card border border-border rounded-[32px] p-6 shadow-sm lg:sticky lg:top-32">
              <div className="text-eyebrow">Convener Desk</div>

              {/* Photo */}
              <div className="relative group">
                <div className="absolute -inset-2 rounded-[24px] bg-primary/10 blur-xl group-hover:bg-primary/20 transition-colors duration-200" />
                <div className="relative aspect-square rounded-[20px] overflow-hidden border border-border bg-muted">
                  <img
                    src={pData.convenerImage}
                    alt={pData.convenerName}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                      <p className="text-white text-xs font-medium">Convener Image URL</p>
                      <input
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-xs text-white outline-none focus:border-primary"
                        value={pData.convenerImage}
                        onChange={(e) =>
                          setEditedProfile({ ...pData, convenerImage: e.target.value })
                        }
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile details */}
              <div className="space-y-4">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      className="w-full text-lg font-bold text-ink bg-primary/5 p-2 rounded outline-none border border-border"
                      value={pData.convenerName}
                      onChange={(e) => setEditedProfile({ ...pData, convenerName: e.target.value })}
                    />
                    <textarea
                      className="w-full text-xs text-muted-foreground bg-primary/5 p-2 rounded outline-none border border-border min-h-[60px]"
                      value={pData.convenerMessage}
                      onChange={(e) =>
                        setEditedProfile({ ...pData, convenerMessage: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-bold text-ink">{pData.convenerName}</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">
                      Convener WE&GC
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-border relative">
                  <Quote className="h-8 w-8 text-primary/10 absolute -top-4 -left-2" />
                  <p className="text-sm italic text-muted-foreground leading-relaxed pl-6">
                    "{pData.convenerMessage}"
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Executive Committee Section */}
        <div className="mt-24 pt-16 border-t border-border">
          <RevealOnScroll>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
              <div>
                <SectionLabel eyebrow="Organization" title="Executive Committee Members" />
                <p className="mt-2 text-sm text-muted-foreground font-medium">
                  Leading, organizing, and maintaining the dynamic initiatives of WE&GC across the
                  campus.
                </p>
              </div>

              {isEditMode && (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-xs shadow-lg hover:scale-105 transition-all self-start shrink-0"
                >
                  <Plus className="h-4 w-4" /> Add Committee Member
                </button>
              )}
            </div>
          </RevealOnScroll>

          {/* Add Committee Member Form */}
          {showAddMember && (
            <RevealOnScroll>
              <div className="mb-10 p-6 bg-card border border-border rounded-3xl shadow-sm max-w-lg">
                <h3 className="text-lg font-bold text-ink mb-4">Add Committee Member</h3>
                <form onSubmit={handleAddMemberSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                      value={addMemberForm.name}
                      onChange={(e) => setAddMemberForm({ ...addMemberForm, name: e.target.value })}
                      placeholder="e.g., Dr. G. Swami Naidu"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      Role / Designation
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                      value={addMemberForm.role}
                      onChange={(e) => setAddMemberForm({ ...addMemberForm, role: e.target.value })}
                      placeholder="e.g., Principal & Chairman"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs outline-none focus:border-primary"
                      value={addMemberForm.email}
                      onChange={(e) =>
                        setAddMemberForm({ ...addMemberForm, email: e.target.value })
                      }
                      placeholder="e.g., principal@jntugvcev.edu.in"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMember(false)}
                      className="px-5 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-ink transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
            </RevealOnScroll>
          )}

          {/* Committee Members Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isCommitteeLoading ? (
              <div className="col-span-full py-12 text-center text-xs text-muted-foreground animate-pulse">
                Loading committee members...
              </div>
            ) : (
              committee.map((member: any, idx: number) => {
                const isEditing = editingMemberId === member.id;
                return (
                  <RevealOnScroll key={member.id} delay={idx * 50}>
                    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm hover-lift flex flex-col justify-between h-full relative group/member">
                      {/* Header Dot */}
                      <div className="absolute top-6 right-6 flex gap-1.5 opacity-0 group-hover/member:opacity-100 transition-opacity">
                        {isEditMode && !isEditing && (
                          <>
                            <button
                              onClick={() => handleEditMemberClick(member)}
                              className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id)}
                              className="p-1 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary grid place-items-center">
                          <Shield className="h-5 w-5 text-primary/60" />
                        </div>

                        {isEditing ? (
                          <div className="space-y-2 pt-2">
                            <input
                              className="w-full bg-primary/5 border border-primary/20 rounded p-1 text-xs font-bold outline-none text-ink"
                              value={editMemberForm.name}
                              onChange={(e) =>
                                setEditMemberForm({ ...editMemberForm, name: e.target.value })
                              }
                            />
                            <input
                              className="w-full bg-primary/5 border border-primary/20 rounded p-1 text-xs outline-none text-muted-foreground"
                              value={editMemberForm.role}
                              onChange={(e) =>
                                setEditMemberForm({ ...editMemberForm, role: e.target.value })
                              }
                            />
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-bold text-ink text-sm leading-tight">
                              {member.name}
                            </h4>
                            <p className="text-xs text-primary font-bold mt-1 tracking-tight leading-snug">
                              {member.role}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Email and controls footer */}
                      <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                        {isEditing ? (
                          <div className="flex items-center justify-between w-full">
                            <input
                              className="bg-primary/5 border border-primary/20 rounded p-1 text-xs outline-none text-muted-foreground w-[120px]"
                              value={editMemberForm.email}
                              placeholder="Email address"
                              onChange={(e) =>
                                setEditMemberForm({ ...editMemberForm, email: e.target.value })
                              }
                            />
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                onClick={handleEditMemberSave}
                                className="p-1 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => setEditingMemberId(null)}
                                className="p-1 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-medium transition-colors"
                            >
                              <Mail className="h-3.5 w-3.5" /> Mail Profile
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Persistent Profile save action bar */}
      {isEditMode && editedProfile && (
        <div className="fixed top-24 right-8 z-50 animate-in fade-in zoom-in slide-in-from-top-4">
          <div className="flex items-center gap-3 bg-card p-2 rounded-full border border-border shadow-2xl">
            <button
              onClick={() => setEditedProfile(null)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-muted-foreground hover:text-ink transition-colors font-medium text-xs"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button
              onClick={handleProfileSave}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold text-xs"
            >
              <Save className="h-4 w-4" /> Save Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}
