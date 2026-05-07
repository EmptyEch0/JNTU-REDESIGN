import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { STUDENT_SUBNAV } from "@/lib/site";
import heroImg from "@/assets/hero-3.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEdcProfile,
  updateEdcProfile,
  getEdcCommittee,
  addEdcCommittee,
  updateEdcCommittee,
  deleteEdcCommittee,
  getEdcActivities,
  addEdcActivity,
  updateEdcActivity,
  deleteEdcActivity
} from "@/funcs/studentCorner";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit2, Trash2, Check, X, Calendar, Award, Shield, Users, Save } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/edc")({
  head: () => ({
    meta: [
      { title: "Entrepreneurship Development Cell — JNTU-GV CEV" },
      { name: "description", content: "Fostering startups, incubation, and entrepreneurial mindsets." },
    ],
  }),
  component: EdcPage,
});

function EdcPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();

  // Queries
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["edc-profile"],
    queryFn: () => getEdcProfile(),
  });

  const { data: committee = [], isLoading: committeeLoading } = useQuery({
    queryKey: ["edc-committee"],
    queryFn: () => getEdcCommittee(),
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ["edc-activities"],
    queryFn: () => getEdcActivities(),
  });

  // Local editing states
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [editingCommId, setEditingCommId] = useState<number | null>(null);
  const [editCommForm, setEditCommForm] = useState<any>({ sNo: 0, name: "", designation: "", role: "" });
  const [showAddComm, setShowAddComm] = useState(false);
  const [addCommForm, setAddCommForm] = useState<any>({ sNo: 0, name: "", designation: "", role: "" });

  const [editingActId, setEditingActId] = useState<number | null>(null);
  const [editActForm, setEditActForm] = useState<any>({ sNo: 0, activityEvent: "", academicYear: "", date: "", theme: "", studentParticipant: "" });
  const [showAddAct, setShowAddAct] = useState(false);
  const [addActForm, setAddActForm] = useState<any>({ sNo: 0, activityEvent: "", academicYear: "", date: "", theme: "", studentParticipant: "" });

  const [actSearch, setActSearch] = useState("");
  const [actPage, setActPage] = useState(1);
  const itemsPerPage = 5;

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: updateEdcProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edc-profile"] });
      setEditedProfile(null);
      toast.success("Profile updated successfully!");
    },
    onError: () => toast.error("Failed to update profile.")
  });

  const addCommMutation = useMutation({
    mutationFn: addEdcCommittee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edc-committee"] });
      setShowAddComm(false);
      setAddCommForm({ sNo: 0, name: "", designation: "", role: "" });
      toast.success("Committee member added successfully!");
    }
  });

  const updateCommMutation = useMutation({
    mutationFn: updateEdcCommittee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edc-committee"] });
      setEditingCommId(null);
      toast.success("Committee member updated!");
    }
  });

  const deleteCommMutation = useMutation({
    mutationFn: deleteEdcCommittee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edc-committee"] });
      toast.success("Committee member removed!");
    }
  });

  const addActMutation = useMutation({
    mutationFn: addEdcActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edc-activities"] });
      setShowAddAct(false);
      setAddActForm({ sNo: 0, activityEvent: "", academicYear: "", date: "", theme: "", studentParticipant: "" });
      toast.success("Activity added successfully!");
    }
  });

  const updateActMutation = useMutation({
    mutationFn: updateEdcActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edc-activities"] });
      setEditingActId(null);
      toast.success("Activity updated successfully!");
    }
  });

  const deleteActMutation = useMutation({
    mutationFn: deleteEdcActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edc-activities"] });
      toast.success("Activity deleted!");
    }
  });

  if (profileLoading || !profile) {
    return (
      <div className="py-20 grid place-items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const pData = editedProfile || profile;
  const visions = (pData.vision as string[]) || [];
  const missions = (pData.mission as string[]) || [];

  // Filter activities
  const filteredActivities = activities.filter((a) => {
    const term = actSearch.toLowerCase();
    return (
      a.activityEvent.toLowerCase().includes(term) ||
      a.theme.toLowerCase().includes(term) ||
      a.academicYear.toLowerCase().includes(term)
    );
  });

  const totalActPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice((actPage - 1) * itemsPerPage, actPage * itemsPerPage);

  return (
    <>
      <PageHero
        eyebrow="Student Corner — Professional Cells"
        title="Entrepreneurship Development Cell"
        subtitle="Bridging fervor and innovation, providing a sturdy platform to build robust student startups and tech-ventures."
        image={heroImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      <section className="py-16 container-narrow space-y-20">
        
        {/* Coordinator Message Section */}
        <RevealOnScroll>
          <div className="grid md:grid-cols-[240px_1fr] gap-8 items-center bg-sand p-8 rounded-[32px] border border-border">
            <div className="space-y-4 text-center md:text-left shrink-0">
              <div className="h-40 w-40 rounded-2xl overflow-hidden border border-border bg-card mx-auto md:mx-0 shadow-sm">
                <img
                  src={pData.coordinatorImage}
                  alt={pData.coordinatorName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                {isEditMode ? (
                  <div className="space-y-1.5">
                    <input
                      className="w-full bg-primary/5 border border-border p-1 rounded font-bold text-xs"
                      value={pData.coordinatorName}
                      onChange={(e) => setEditedProfile({ ...pData, coordinatorName: e.target.value })}
                    />
                    <input
                      className="w-full bg-primary/5 border border-border p-1 rounded text-[10px] text-muted-foreground"
                      value={pData.coordinatorRole}
                      onChange={(e) => setEditedProfile({ ...pData, coordinatorRole: e.target.value })}
                    />
                    <input
                      className="w-full bg-primary/5 border border-border p-1 rounded text-[9px] text-muted-foreground"
                      value={pData.coordinatorImage}
                      placeholder="Photo URL"
                      onChange={(e) => setEditedProfile({ ...pData, coordinatorImage: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <h4 className="font-bold text-ink text-sm leading-tight">{pData.coordinatorName}</h4>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-1 leading-tight">{pData.coordinatorRole}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <SectionLabel eyebrow="Coordinator's Message" title="EDC Message" />
              {isEditMode ? (
                <textarea
                  className="w-full text-base text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-xl border border-border outline-none min-h-[100px]"
                  value={pData.coordinatorQuote}
                  onChange={(e) => setEditedProfile({ ...pData, coordinatorQuote: e.target.value })}
                />
              ) : (
                <p className="text-base text-muted-foreground font-medium italic leading-relaxed">
                  "{pData.coordinatorQuote}"
                </p>
              )}
            </div>
          </div>
        </RevealOnScroll>

        {/* About CED */}
        <RevealOnScroll>
          <div className="space-y-6">
            <SectionLabel eyebrow="History & Genesis" title="About EDC" />
            {isEditMode ? (
              <textarea
                className="w-full text-base text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-2xl border border-border outline-none min-h-[120px] focus:border-primary"
                value={pData.about}
                onChange={(e) => setEditedProfile({ ...pData, about: e.target.value })}
              />
            ) : (
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {pData.about}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Vision & Mission Statements */}
        <div className="grid md:grid-cols-2 gap-12 pt-4">
          <RevealOnScroll>
            <div className="p-8 rounded-[32px] bg-sand border border-border space-y-6 h-full flex flex-col justify-between">
              <div>
                <SectionLabel eyebrow="Goalposts" title="Vision" />
                <ul className="space-y-4 mt-6">
                  {visions.map((v, i) => (
                    <li key={i} className="text-sm text-muted-foreground font-medium leading-relaxed flex gap-3.5 items-start">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      {isEditMode ? (
                        <textarea
                          className="w-full bg-primary/5 border border-border p-1.5 rounded text-xs outline-none focus:border-primary"
                          value={v}
                          onChange={(e) => {
                            const copy = [...visions];
                            copy[i] = e.target.value;
                            setEditedProfile({ ...pData, vision: copy });
                          }}
                        />
                      ) : (
                        <span>{v}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <div className="p-8 rounded-[32px] bg-sand border border-border space-y-6 h-full flex flex-col justify-between">
              <div>
                <SectionLabel eyebrow="Pathways" title="Mission" />
                <ul className="space-y-4 mt-6">
                  {missions.map((m, i) => (
                    <li key={i} className="text-sm text-muted-foreground font-medium leading-relaxed flex gap-3.5 items-start">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      {isEditMode ? (
                        <textarea
                          className="w-full bg-primary/5 border border-border p-1.5 rounded text-xs outline-none focus:border-primary"
                          value={m}
                          onChange={(e) => {
                            const copy = [...missions];
                            copy[i] = e.target.value;
                            setEditedProfile({ ...pData, mission: copy });
                          }}
                        />
                      ) : (
                        <span>{m}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Organizational Structure */}
        <div className="space-y-8 pt-8 border-t border-border">
          <RevealOnScroll>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <SectionLabel eyebrow="Leadership" title="Organizational Structure of EDC" />
              {isEditMode && (
                <button
                  onClick={() => setShowAddComm(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white font-semibold text-xs shadow-md hover:scale-105 transition-all shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Member
                </button>
              )}
            </div>
          </RevealOnScroll>

          {showAddComm && (
            <RevealOnScroll>
              <div className="p-6 bg-card border border-border rounded-3xl max-w-lg">
                <h4 className="font-bold text-ink mb-4 text-sm">Add Committee Member</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="S.No"
                    type="number"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none"
                    value={addCommForm.sNo || ""}
                    onChange={(e) => setAddCommForm({ ...addCommForm, sNo: parseInt(e.target.value) || 0 })}
                  />
                  <input
                    placeholder="Name"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none"
                    value={addCommForm.name}
                    onChange={(e) => setAddCommForm({ ...addCommForm, name: e.target.value })}
                  />
                  <input
                    placeholder="Designation"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none col-span-2"
                    value={addCommForm.designation}
                    onChange={(e) => setAddCommForm({ ...addCommForm, designation: e.target.value })}
                  />
                  <input
                    placeholder="Role in EDC"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none col-span-2"
                    value={addCommForm.role}
                    onChange={(e) => setAddCommForm({ ...addCommForm, role: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2.5 mt-4">
                  <button onClick={() => setShowAddComm(false)} className="px-4 py-2 border border-border rounded-xl text-xs text-muted-foreground font-medium">Cancel</button>
                  <button onClick={() => addCommMutation.mutate({ data: addCommForm })} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold">Add Member</button>
                </div>
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll delay={100}>
            <div className="overflow-hidden border border-border rounded-3xl bg-card shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-xs font-bold uppercase text-muted-foreground">
                    <th className="px-6 py-4 w-20">S.No</th>
                    <th className="px-6 py-4">Name of the Member</th>
                    <th className="px-6 py-4">Designation</th>
                    <th className="px-6 py-4">Role in EDC</th>
                    {isEditMode && <th className="px-6 py-4 w-28 text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs font-medium text-muted-foreground">
                  {committee.map((m: any) => {
                    const isEditing = editingCommId === m.id;
                    return (
                      <tr key={m.id} className="hover:bg-primary/[0.01] transition-colors align-middle text-ink">
                        <td className="px-6 py-4 font-semibold text-muted-foreground">
                          {isEditing ? (
                            <input
                              type="number"
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editCommForm.sNo}
                              onChange={(e) => setEditCommForm({ ...editCommForm, sNo: parseInt(e.target.value) || 0 })}
                            />
                          ) : (
                            m.sNo
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-ink">
                          {isEditing ? (
                            <input
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editCommForm.name}
                              onChange={(e) => setEditCommForm({ ...editCommForm, name: e.target.value })}
                            />
                          ) : (
                            m.name
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editCommForm.designation}
                              onChange={(e) => setEditCommForm({ ...editCommForm, designation: e.target.value })}
                            />
                          ) : (
                            m.designation
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-primary">
                          {isEditing ? (
                            <input
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editCommForm.role}
                              onChange={(e) => setEditCommForm({ ...editCommForm, role: e.target.value })}
                            />
                          ) : (
                            m.role
                          )}
                        </td>
                        {isEditMode && (
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-1.5">
                              {isEditing ? (
                                <>
                                  <button onClick={() => updateCommMutation.mutate({ data: editCommForm })} className="p-1 rounded bg-green-500/10 text-green-600 hover:bg-green-500/20"><Check className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => setEditingCommId(null)} className="p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20"><X className="h-3.5 w-3.5" /></button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => { setEditingCommId(m.id); setEditCommForm({ ...m }); }} className="p-1 rounded bg-primary/5 text-primary hover:bg-primary/10"><Edit2 className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => { if (confirm("Remove member?")) deleteCommMutation.mutate({ data: m.id }); }} className="p-1 rounded bg-red-500/5 text-red-600 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </RevealOnScroll>
        </div>

        {/* Activities & Events */}
        <div className="space-y-8 pt-8 border-t border-border">
          <RevealOnScroll>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <SectionLabel eyebrow="History" title="Organizational Activities & Events" />
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    placeholder="Search activities..."
                    className="w-full bg-card border border-border pl-9 pr-4 py-2 rounded-full text-xs text-ink outline-none"
                    value={actSearch}
                    onChange={(e) => { setActSearch(e.target.value); setActPage(1); }}
                  />
                </div>
                {isEditMode && (
                  <button
                    onClick={() => setShowAddAct(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-xs shadow-md hover:scale-105 transition-all shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Activity
                  </button>
                )}
              </div>
            </div>
          </RevealOnScroll>

          {showAddAct && (
            <RevealOnScroll>
              <div className="p-6 bg-card border border-border rounded-3xl max-w-lg space-y-4">
                <h4 className="font-bold text-ink text-sm">Add EDC Activity</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="S.No"
                    type="number"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none"
                    value={addActForm.sNo || ""}
                    onChange={(e) => setAddActForm({ ...addActForm, sNo: parseInt(e.target.value) || 0 })}
                  />
                  <input
                    placeholder="Academic Year"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none"
                    value={addActForm.academicYear}
                    onChange={(e) => setAddActForm({ ...addActForm, academicYear: e.target.value })}
                  />
                  <input
                    placeholder="Activity Event"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none col-span-2"
                    value={addActForm.activityEvent}
                    onChange={(e) => setAddActForm({ ...addActForm, activityEvent: e.target.value })}
                  />
                  <input
                    placeholder="Date"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none"
                    value={addActForm.date}
                    onChange={(e) => setAddActForm({ ...addActForm, date: e.target.value })}
                  />
                  <input
                    placeholder="Theme"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none"
                    value={addActForm.theme}
                    onChange={(e) => setAddActForm({ ...addActForm, theme: e.target.value })}
                  />
                  <input
                    placeholder="Student Participants"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none col-span-2"
                    value={addActForm.studentParticipant}
                    onChange={(e) => setAddActForm({ ...addActForm, studentParticipant: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2.5">
                  <button onClick={() => setShowAddAct(false)} className="px-4 py-2 border border-border rounded-xl text-xs text-muted-foreground font-medium">Cancel</button>
                  <button onClick={() => addActMutation.mutate({ data: addActForm })} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold">Add Activity</button>
                </div>
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll delay={100}>
            <div className="overflow-hidden border border-border rounded-3xl bg-card shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-xs font-bold uppercase text-muted-foreground">
                    <th className="px-6 py-4 w-20">S.No</th>
                    <th className="px-6 py-4 w-2/5">Activity Event</th>
                    <th className="px-6 py-4">Academic Year</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Theme</th>
                    <th className="px-6 py-4">Student Participant</th>
                    {isEditMode && <th className="px-6 py-4 w-28 text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs font-medium text-muted-foreground">
                  {paginatedActivities.map((a: any) => {
                    const isEditing = editingActId === a.id;
                    return (
                      <tr key={a.id} className="hover:bg-primary/[0.01] transition-colors align-middle text-ink">
                        <td className="px-6 py-4 font-semibold text-muted-foreground">
                          {isEditing ? (
                            <input
                              type="number"
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editActForm.sNo}
                              onChange={(e) => setEditActForm({ ...editActForm, sNo: parseInt(e.target.value) || 0 })}
                            />
                          ) : (
                            a.sNo
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-ink leading-relaxed">
                          {isEditing ? (
                            <input
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editActForm.activityEvent}
                              onChange={(e) => setEditActForm({ ...editActForm, activityEvent: e.target.value })}
                            />
                          ) : (
                            a.activityEvent
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editActForm.academicYear}
                              onChange={(e) => setEditActForm({ ...editActForm, academicYear: e.target.value })}
                            />
                          ) : (
                            a.academicYear
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-muted-foreground">
                          {isEditing ? (
                            <input
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editActForm.date}
                              onChange={(e) => setEditActForm({ ...editActForm, date: e.target.value })}
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-primary/40 mt-0.5" /> {a.date}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editActForm.theme}
                              onChange={(e) => setEditActForm({ ...editActForm, theme: e.target.value })}
                            />
                          ) : (
                            a.theme
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">
                          {isEditing ? (
                            <input
                              className="p-1 bg-primary/5 border border-primary/20 rounded w-full"
                              value={editActForm.studentParticipant}
                              onChange={(e) => setEditActForm({ ...editActForm, studentParticipant: e.target.value })}
                            />
                          ) : (
                            a.studentParticipant
                          )}
                        </td>
                        {isEditMode && (
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-1.5">
                              {isEditing ? (
                                <>
                                  <button onClick={() => updateActMutation.mutate({ data: editActForm })} className="p-1 rounded bg-green-500/10 text-green-600 hover:bg-green-500/20"><Check className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => setEditingActId(null)} className="p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20"><X className="h-3.5 w-3.5" /></button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => { setEditingActId(a.id); setEditActForm({ ...a }); }} className="p-1 rounded bg-primary/5 text-primary hover:bg-primary/10"><Edit2 className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => { if (confirm("Delete activity?")) deleteActMutation.mutate({ data: a.id }); }} className="p-1 rounded bg-red-500/5 text-red-600 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </RevealOnScroll>

          {/* Pagination */}
          {totalActPages > 1 && (
            <RevealOnScroll>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">Showing page <span className="font-semibold text-ink">{actPage}</span> of <span className="font-semibold text-ink">{totalActPages}</span></p>
                <div className="flex gap-1">
                  <button disabled={actPage === 1} onClick={() => setActPage(p => p - 1)} className="px-3 py-1 border border-border rounded text-xs hover:bg-muted disabled:opacity-40">Prev</button>
                  <button disabled={actPage === totalActPages} onClick={() => setActPage(p => p + 1)} className="px-3 py-1 border border-border rounded text-xs hover:bg-muted disabled:opacity-40">Next</button>
                </div>
              </div>
            </RevealOnScroll>
          )}
        </div>

      </section>

      {/* Persistent admin save */}
      {isEditMode && editedProfile && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 bg-card p-2 rounded-full border border-border shadow-2xl">
            <button
              onClick={() => setEditedProfile(null)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-muted-foreground hover:text-ink transition-colors font-medium text-xs"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button
              onClick={() => updateProfileMutation.mutate({ data: editedProfile })}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold text-xs"
            >
              <Save className="h-4 w-4" /> Save Content
            </button>
          </div>
        </div>
      )}
    </>
  );
}
