import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { STUDENT_SUBNAV } from "@/lib/site";
import heroImg from "@/assets/hero-.webp";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfChapters, updateProfChapter } from "@/funcs/studentCorner";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { toast } from "sonner";
import {
  Save,
  X,
  Cpu,
  Code,
  Terminal,
  Users,
  Calendar,
  Award,
  Shield,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
} from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/professional-bodies")({
  head: () => ({
    meta: [
      { title: "Professional Bodies Student Chapters — JNTU-GV CEV" },
      {
        name: "description",
        content: "CSI, IEEE, IE, IETE, IIM professional bodies run by students.",
      },
    ],
  }),
  component: ProfessionalBodiesPage,
});

function ProfessionalBodiesPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ["prof-chapters"],
    queryFn: () => getProfChapters(),
  });

  const [activeCode, setActiveCode] = useState("CSI");
  const [editedChapters, setEditedChapters] = useState<Record<string, any>>({});

  const [eventSearch, setEventSearch] = useState("");
  const [eventPage, setEventPage] = useState(1);
  const eventsPerPage = 5;

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventForm, setNewEventForm] = useState({ sNo: 0, title: "", date: "", details: "" });

  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [newFacultyForm, setNewFacultyForm] = useState({ name: "", membershipNo: "" });

  const updateMutation = useMutation({
    mutationFn: updateProfChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prof-chapters"] });
      setEditedChapters({});
      toast.success("Professional Chapter updated successfully!");
    },
    onError: () => toast.error("Failed to update professional chapter."),
  });

  if (isLoading || chapters.length === 0) {
    return (
      <div className="py-20 grid place-items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentChapter = chapters.find((c) => c.code === activeCode) || chapters[0];
  const data = editedChapters[currentChapter.code] || currentChapter;

  const events = (data.events as any[]) || [];
  const facultyMembers = (data.facultyMembers as any[]) || [];

  const handleFieldChange = (field: string, value: any) => {
    setEditedChapters({
      ...editedChapters,
      [currentChapter.code]: {
        ...data,
        [field]: value,
      },
    });
  };

  const handleSave = () => {
    updateMutation.mutate({ data });
  };

  const handleAddEvent = () => {
    const updatedEvents = [...events, { ...newEventForm }];
    handleFieldChange("events", updatedEvents);
    setShowAddEvent(false);
    setNewEventForm({ sNo: 0, title: "", date: "", details: "" });
    toast.success("Event added locally. Save content to persist!");
  };

  const handleDeleteEvent = (index: number) => {
    const updatedEvents = events.filter((_, idx) => idx !== index);
    handleFieldChange("events", updatedEvents);
    toast.success("Event removed locally. Save content to persist!");
  };

  const handleAddFaculty = () => {
    const updatedFaculty = [...facultyMembers, { ...newFacultyForm }];
    handleFieldChange("facultyMembers", updatedFaculty);
    setShowAddFaculty(false);
    setNewFacultyForm({ name: "", membershipNo: "" });
    toast.success("Faculty member added locally. Save content to persist!");
  };

  const handleDeleteFaculty = (index: number) => {
    const updatedFaculty = facultyMembers.filter((_, idx) => idx !== index);
    handleFieldChange("facultyMembers", updatedFaculty);
    toast.success("Faculty member removed locally. Save content to persist!");
  };

  const filteredEvents = events.filter((e) => {
    const term = eventSearch.toLowerCase();
    return e.title.toLowerCase().includes(term) || e.details.toLowerCase().includes(term);
  });

  const totalEventPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (eventPage - 1) * eventsPerPage,
    eventPage * eventsPerPage,
  );

  const iconsMap: Record<string, any> = {
    CSI: Code,
    IEEE: Cpu,
    IE: Terminal,
    IETE: Shield,
    IIM: Users,
  };

  const ActiveIcon = iconsMap[activeCode] || Shield;

  return (
    <>
      <PageHero
        eyebrow="Student Corner — Professional Chapters"
        title="Professional Bodies"
        subtitle="Empowering technical discovery, global networking, and student leadership through active technical chapters."
        image={heroImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      <section className="py-16 container-narrow space-y-12">
        {/* Horizontal Navigation Tabs */}
        <RevealOnScroll>
          <div className="flex flex-wrap gap-2 border-b border-border pb-4 justify-center md:justify-start">
            {chapters.map((c) => {
              const Icon = iconsMap[c.code] || Shield;
              const isActive = activeCode === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    setActiveCode(c.code);
                    setEventPage(1);
                    setEventSearch("");
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-md scale-105"
                      : "bg-sand hover:bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {c.code}
                </button>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* Selected Chapter Details */}
        <div className="grid md:grid-cols-[1fr_320px] gap-12 items-start pt-4">
          <RevealOnScroll>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                  <ActiveIcon className="h-5 w-5" />
                </div>
                <div>
                  {isEditMode ? (
                    <input
                      className="w-full bg-primary/5 border border-primary/20 rounded p-1.5 font-bold text-lg text-ink"
                      value={data.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-ink">{data.name}</h3>
                  )}
                </div>
              </div>

              {isEditMode ? (
                <textarea
                  className="w-full text-base text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-2xl border border-border outline-none min-h-[160px]"
                  value={data.about}
                  onChange={(e) => handleFieldChange("about", e.target.value)}
                />
              ) : (
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {data.about}
                </p>
              )}
            </div>
          </RevealOnScroll>

          {/* Sidebar Coordinators Info */}
          <RevealOnScroll delay={50}>
            <div className="p-6 bg-sand border border-border rounded-3xl space-y-6">
              <div>
                <h4 className="font-bold text-ink text-xs uppercase tracking-wider mb-2">
                  Coordinator
                </h4>
                {isEditMode ? (
                  <input
                    className="w-full bg-primary/5 border border-border p-1.5 rounded text-xs"
                    value={data.coordinator || ""}
                    onChange={(e) => handleFieldChange("coordinator", e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-bold text-primary">
                    {data.coordinator || "Department Chair"}
                  </p>
                )}
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-bold text-ink text-xs uppercase tracking-wider mb-2">
                  Registered Members
                </h4>
                <p className="text-sm font-semibold text-muted-foreground">
                  Active Campus Student Branch
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Faculty Members List (For IE/Other Chapters that has them) */}
        {facultyMembers.length > 0 && (
          <div className="pt-8 border-t border-border space-y-6">
            <RevealOnScroll>
              <div className="flex items-center justify-between">
                <SectionLabel eyebrow="Faculty Leadership" title="Active Life Members & Fellows" />
                {isEditMode && (
                  <button
                    onClick={() => setShowAddFaculty(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white font-semibold text-xs shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Member
                  </button>
                )}
              </div>
            </RevealOnScroll>

            {showAddFaculty && (
              <RevealOnScroll>
                <div className="p-5 bg-card border border-border rounded-2xl max-w-sm space-y-3">
                  <h4 className="font-bold text-ink text-xs">Add Faculty Member</h4>
                  <input
                    placeholder="Faculty Name"
                    className="w-full p-2.5 bg-muted/50 rounded-lg border border-border text-xs outline-none"
                    value={newFacultyForm.name}
                    onChange={(e) => setNewFacultyForm({ ...newFacultyForm, name: e.target.value })}
                  />
                  <input
                    placeholder="Membership Number"
                    className="w-full p-2.5 bg-muted/50 rounded-lg border border-border text-xs outline-none"
                    value={newFacultyForm.membershipNo}
                    onChange={(e) =>
                      setNewFacultyForm({ ...newFacultyForm, membershipNo: e.target.value })
                    }
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddFaculty(false)}
                      className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddFaculty}
                      className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold"
                    >
                      Add Member
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            )}

            <RevealOnScroll delay={50}>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {facultyMembers.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-card border border-border rounded-2xl relative flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-ink text-sm">{fac.name}</h4>
                      <p className="text-xs text-primary font-semibold mt-1.5">
                        {fac.membershipNo}
                      </p>
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => handleDeleteFaculty(idx)}
                        className="absolute top-4 right-4 p-1.5 rounded bg-red-500/5 text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        )}

        {/* Organized Events Section */}
        <div className="pt-8 border-t border-border space-y-6">
          <RevealOnScroll>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <SectionLabel eyebrow="Event Log" title="Events Organized" />
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    placeholder="Search events..."
                    className="w-full bg-card border border-border pl-9 pr-4 py-2 rounded-full text-xs text-ink outline-none"
                    value={eventSearch}
                    onChange={(e) => {
                      setEventSearch(e.target.value);
                      setEventPage(1);
                    }}
                  />
                </div>
                {isEditMode && (
                  <button
                    onClick={() => setShowAddEvent(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-xs shadow-md shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Event
                  </button>
                )}
              </div>
            </div>
          </RevealOnScroll>

          {showAddEvent && (
            <RevealOnScroll>
              <div className="p-6 bg-card border border-border rounded-3xl max-w-lg space-y-4">
                <h4 className="font-bold text-ink text-xs">Add Organized Event</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="S.No"
                    type="number"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none"
                    value={newEventForm.sNo || ""}
                    onChange={(e) =>
                      setNewEventForm({ ...newEventForm, sNo: parseInt(e.target.value) || 0 })
                    }
                  />
                  <input
                    placeholder="Date / Duration"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none"
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                  />
                  <input
                    placeholder="Event Title"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none col-span-2"
                    value={newEventForm.title}
                    onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Event Details / Participants"
                    className="p-3 bg-muted/50 rounded-xl border border-border text-xs outline-none col-span-2 min-h-[60px]"
                    value={newEventForm.details}
                    onChange={(e) => setNewEventForm({ ...newEventForm, details: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2.5">
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="px-4 py-2 border border-border rounded-xl text-xs text-muted-foreground font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold"
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll delay={50}>
            <div className="overflow-hidden border border-border rounded-3xl bg-card shadow-sm">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-xs font-bold uppercase text-muted-foreground">
                    <th className="px-6 py-4 w-20">S.No</th>
                    <th className="px-6 py-4">Name of the Event</th>
                    <th className="px-6 py-4 w-1/4">Date</th>
                    <th className="px-6 py-4 w-1/3">No. of Participants / Details</th>
                    {isEditMode && <th className="px-6 py-4 w-20 text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs font-medium text-muted-foreground">
                  {paginatedEvents.map((e, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-primary/[0.01] transition-colors align-middle text-ink"
                    >
                      <td className="px-6 py-4 font-semibold text-muted-foreground">
                        {e.sNo || idx + 1}
                      </td>
                      <td className="px-6 py-4 font-bold text-ink leading-relaxed">{e.title}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary/40 mt-0.5" /> {e.date}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-semibold leading-relaxed">
                        {e.details}
                      </td>
                      {isEditMode && (
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteEvent(idx)}
                            className="p-1.5 rounded bg-red-500/5 text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RevealOnScroll>

          {/* Pagination */}
          {totalEventPages > 1 && (
            <RevealOnScroll>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Showing page <span className="font-semibold text-ink">{eventPage}</span> of{" "}
                  <span className="font-semibold text-ink">{totalEventPages}</span>
                </p>
                <div className="flex gap-1">
                  <button
                    disabled={eventPage === 1}
                    onClick={() => setEventPage((p) => p - 1)}
                    className="px-3 py-1 border border-border rounded text-xs hover:bg-muted disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    disabled={eventPage === totalEventPages}
                    onClick={() => setEventPage((p) => p + 1)}
                    className="px-3 py-1 border border-border rounded text-xs hover:bg-muted disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* Persistent admin controls */}
      {isEditMode && Object.keys(editedChapters).length > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 bg-card p-2 rounded-full border border-border shadow-2xl">
            <button
              onClick={() => setEditedChapters({})}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-muted-foreground hover:text-ink transition-colors font-medium text-xs"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold text-xs"
            >
              <Save className="h-4 w-4" /> Save Chapter
            </button>
          </div>
        </div>
      )}
    </>
  );
}
