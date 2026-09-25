import { createFileRoute } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { IQAC_SUBNAV } from "@/lib/site";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIqacEvents,
  getIqacOutcomes,
  addIqacOutcome,
  updateIqacOutcome,
  deleteIqacOutcome,
  addIqacEvent,
  updateIqacEvent,
  deleteIqacEvent,
} from "../funcs/leadership";
import { Calendar, CheckCircle2, Presentation, ArrowRight, Plus, Trash2, Save, X, Edit3 } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

export const Route = createFileRoute("/administration/iqac/meetings")({
  head: () => ({
    meta: [
      { title: "IQAC Meetings & Events — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Outcomes, workshops, and faculty development programs organized by IQAC at JNTU-GV CEV.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();

  const [editedOutcomes, setEditedOutcomes] = useState<Record<number, string>>({});
  const [editedEvents, setEditedEvents] = useState<Record<number, any>>({});
  const [isAddingOutcome, setIsAddingOutcome] = useState(false);
  const [newOutcomeText, setNewOutcomeText] = useState("");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });

  const { data: outcomes = [], isLoading: isOutcomesLoading } = useQuery({
    queryKey: ["iqac", "outcomes"],
    queryFn: () => getIqacOutcomes(),
  });

  const { data: events = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ["iqac", "events"],
    queryFn: () => getIqacEvents(),
  });

  const addOutcomeMutation = useMutation({
    mutationFn: (text: string) => addIqacOutcome({ data: { text } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "outcomes"] });
      setNewOutcomeText("");
      setIsAddingOutcome(false);
      toast.success("Outcome added!");
    },
  });

  const deleteOutcomeMutation = useMutation({
    mutationFn: (id: number) => deleteIqacOutcome({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "outcomes"] });
      toast.success("Outcome deleted!");
    },
  });

  const addEventMutation = useMutation({
    mutationFn: (data: { title: string; date: string }) => addIqacEvent({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "events"] });
      setNewEvent({ title: "", date: "" });
      setIsAddingEvent(false);
      toast.success("Workshop/Event added!");
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => deleteIqacEvent({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "events"] });
      toast.success("Event deleted!");
    },
  });

  const handleSaveOutcome = async (id: number) => {
    const text = editedOutcomes[id];
    if (text === undefined) return;
    try {
      await updateIqacOutcome({ data: { id, text } });
      queryClient.invalidateQueries({ queryKey: ["iqac", "outcomes"] });
      setEditedOutcomes((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      });
      toast.success("Outcome updated!");
    } catch {
      toast.error("Failed to update outcome.");
    }
  };

  const handleSaveEvent = async (id: number) => {
    const changes = editedEvents[id];
    if (!changes) return;
    try {
      await updateIqacEvent({ data: { id, ...changes } });
      queryClient.invalidateQueries({ queryKey: ["iqac", "events"] });
      setEditedEvents((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      });
      toast.success("Event updated!");
    } catch {
      toast.error("Failed to update event.");
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto space-y-32 px-4 sm:px-6">
        {/* Outcomes Section */}
        <RevealOnScroll>
          <div className="grid lg:grid-cols-[1fr_450px] gap-16 items-start">
            <div>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-ink">Outcomes of IQAC</h3>
                    <p className="text-muted-foreground mt-1 text-base">
                      Measurable impacts on institutional quality and performance.
                    </p>
                  </div>
                </div>
                {isEditMode && (
                  <button
                    onClick={() => setIsAddingOutcome(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary/90 transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Outcome
                  </button>
                )}
              </div>

              {isEditMode && isAddingOutcome && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                  <div className="text-xs font-bold text-amber-900">Add New Outcome</div>
                  <textarea
                    rows={2}
                    placeholder="Enter measurable IQAC outcome..."
                    value={newOutcomeText}
                    onChange={(e) => setNewOutcomeText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-amber-500/30 bg-white text-sm outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingOutcome(false)}
                      className="px-3 py-1 text-xs text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newOutcomeText.trim()) return;
                        addOutcomeMutation.mutate(newOutcomeText);
                      }}
                      className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                {isOutcomesLoading ? (
                  <div className="col-span-2 py-10 text-center text-muted-foreground animate-pulse">
                    Loading outcomes...
                  </div>
                ) : (
                  outcomes?.map((outcome: any) => {
                    const isEdited = editedOutcomes[outcome.id] !== undefined;
                    const textVal = isEdited ? editedOutcomes[outcome.id] : outcome.text;

                    return (
                      <div key={outcome.id} className="flex gap-3 group relative">
                        <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                          <ArrowRight className="h-3 w-3" />
                        </div>
                        <div className="flex-1 space-y-1">
                          {isEditMode ? (
                            <div className="flex items-start gap-2">
                              <textarea
                                value={textVal}
                                onChange={(e) =>
                                  setEditedOutcomes((p) => ({
                                    ...p,
                                    [outcome.id]: e.target.value,
                                  }))
                                }
                                rows={2}
                                className="w-full p-1.5 rounded border border-amber-500/30 text-xs bg-white"
                              />
                              {isEdited && (
                                <button
                                  onClick={() => handleSaveOutcome(outcome.id)}
                                  className="p-1 rounded bg-amber-500 text-white hover:bg-amber-600"
                                >
                                  <Save className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm("Delete outcome?"))
                                    deleteOutcomeMutation.mutate(outcome.id);
                                }}
                                className="p-1 rounded text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-muted-foreground leading-snug">{outcome.text}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-sand rounded-[40px] p-10 border border-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110 duration-300">
                <CheckCircle2 className="h-48 w-48 text-primary" />
              </div>
              <div className="relative z-10 space-y-6">
                <h4 className="text-2xl font-bold text-ink">Institutional Impact</h4>
                <p className="text-muted-foreground leading-relaxed italic">
                  "The IQAC serves as a catalyst for excellence, ensuring that our academic and
                  administrative processes are continuously evolving to meet global standards."
                </p>
                <div className="pt-6 border-t border-border/50">
                  <div className="text-sm font-bold text-primary uppercase tracking-widest">
                    Quality Assurance
                  </div>
                  <div className="text-ink font-medium mt-1">
                    JNTU-GV College of Engineering Vizianagaram
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Events/Workshops Section */}
        <RevealOnScroll delay={100}>
          <div>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
                  <Presentation className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-ink">Workshops & FDPs</h3>
                  <p className="text-muted-foreground mt-1 text-base">
                    Empowering faculty and staff through continuous learning initiatives.
                  </p>
                </div>
              </div>
              {isEditMode && (
                <button
                  onClick={() => setIsAddingEvent(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary/90 transition"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Workshop / FDP
                </button>
              )}
            </div>

            {isEditMode && isAddingEvent && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="text-xs font-bold text-amber-900">Add New Workshop / FDP</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    placeholder="Name of Workshop / FDP"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="p-2.5 rounded-xl border border-amber-500/30 bg-white text-sm outline-none"
                  />
                  <input
                    placeholder="Date (e.g. 15th-19th July 2024)"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="p-2.5 rounded-xl border border-amber-500/30 bg-white text-sm outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingEvent(false)}
                    className="px-3 py-1 text-xs text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newEvent.title || !newEvent.date) {
                        toast.error("Please provide both Title and Date.");
                        return;
                      }
                      addEventMutation.mutate(newEvent);
                    }}
                    className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-elegant">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-16">
                      S.No
                    </th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Name of the Workshop/FDP
                    </th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right w-44">
                      Date
                    </th>
                    {isEditMode && (
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right w-24">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isEventsLoading ? (
                    <tr>
                      <td
                        colSpan={isEditMode ? 4 : 3}
                        className="px-8 py-16 text-center text-muted-foreground animate-pulse"
                      >
                        Loading events...
                      </td>
                    </tr>
                  ) : (
                    events?.map((event: any, idx: number) => {
                      const isEdited = !!editedEvents[event.id];
                      const titleVal = editedEvents[event.id]?.title ?? event.title;
                      const dateVal = editedEvents[event.id]?.date ?? event.date;

                      return (
                        <tr
                          key={event.id}
                          className="group hover:bg-primary/[0.02] transition-colors"
                        >
                          <td className="px-8 py-5 text-sm font-medium text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-8 py-5 text-base font-bold text-ink">
                            {isEditMode ? (
                              <input
                                value={titleVal}
                                onChange={(e) =>
                                  setEditedEvents((p) => ({
                                    ...p,
                                    [event.id]: {
                                      ...p[event.id],
                                      title: e.target.value,
                                      date: dateVal,
                                    },
                                  }))
                                }
                                className="w-full p-1.5 rounded border border-amber-500/30 text-sm font-semibold bg-white"
                              />
                            ) : (
                              <span className="group-hover:text-primary transition-colors leading-relaxed">
                                {event.title}
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-right">
                            {isEditMode ? (
                              <input
                                value={dateVal}
                                onChange={(e) =>
                                  setEditedEvents((p) => ({
                                    ...p,
                                    [event.id]: {
                                      ...p[event.id],
                                      date: e.target.value,
                                      title: titleVal,
                                    },
                                  }))
                                }
                                className="w-full p-1.5 rounded border border-amber-500/30 text-xs text-right bg-white"
                              />
                            ) : (
                              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                                <Calendar className="h-3.5 w-3.5" />
                                {event.date}
                              </div>
                            )}
                          </td>
                          {isEditMode && (
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {isEdited && (
                                  <button
                                    onClick={() => handleSaveEvent(event.id)}
                                    className="p-1.5 rounded bg-amber-500 text-white hover:bg-amber-600"
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    if (confirm("Delete event?"))
                                      deleteEventMutation.mutate(event.id);
                                  }}
                                  className="p-1.5 rounded text-red-500 hover:bg-red-50"
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
        </RevealOnScroll>
      </div>
    </section>
  );
}
