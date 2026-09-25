import { createFileRoute } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { IQAC_SUBNAV } from "@/lib/site";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIqacReports,
  addIqacReport,
  updateIqacReport,
  deleteIqacReport,
} from "../funcs/leadership";
import { FileDown, ShieldCheck, ClipboardCheck, Plus, Trash2, Save, X, Edit3 } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

export const Route = createFileRoute("/administration/iqac/aqar")({
  head: () => ({
    meta: [
      { title: "AQAR & Academic Audit — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content: "Annual Quality Assurance Reports and Academic Audit Reports of JNTU-GV CEV.",
      },
    ],
  }),
  component: AqarPage,
});

function AqarPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();

  const [editedReports, setEditedReports] = useState<Record<number, any>>({});
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newReport, setNewReport] = useState({ title: "", year: "", link: "" });

  const { data: aqarReports = [], isLoading: isAqarLoading } = useQuery({
    queryKey: ["iqac", "reports", "AQAR"],
    queryFn: () => getIqacReports({ data: "AQAR" }),
  });

  const { data: auditReports = [], isLoading: isAuditLoading } = useQuery({
    queryKey: ["iqac", "reports", "Academic Audit"],
    queryFn: () => getIqacReports({ data: "Academic Audit" }),
  });

  const addReportMutation = useMutation({
    mutationFn: (data: { title: string; year: string; type: string; link: string }) =>
      addIqacReport({ data }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "reports", vars.type] });
      setNewReport({ title: "", year: "", link: "" });
      setAddingType(null);
      toast.success("Report added successfully!");
    },
    onError: () => {
      toast.error("Failed to add report.");
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: ({ id, type }: { id: number; type: string }) =>
      deleteIqacReport({ data: { id } }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "reports", vars.type] });
      toast.success("Report deleted!");
    },
    onError: () => {
      toast.error("Failed to delete report.");
    },
  });

  const handleSaveReport = async (id: number, type: string) => {
    const changes = editedReports[id];
    if (!changes) return;
    try {
      await updateIqacReport({ data: { id, ...changes } });
      queryClient.invalidateQueries({ queryKey: ["iqac", "reports", type] });
      setEditedReports((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      });
      toast.success("Report updated!");
    } catch {
      toast.error("Failed to update report.");
    }
  };

  const renderSection = (
    title: string,
    description: string,
    icon: any,
    type: "AQAR" | "Academic Audit",
    reports: any[],
    isLoading: boolean
  ) => {
    const IconComponent = icon;
    return (
      <RevealOnScroll>
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
                <IconComponent className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-ink">{title}</h3>
                <p className="text-muted-foreground mt-1 text-base">{description}</p>
              </div>
            </div>
            {isEditMode && (
              <button
                onClick={() => {
                  setAddingType(type);
                  setNewReport({ title: "", year: "", link: "" });
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary/90 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Report
              </button>
            )}
          </div>

          {isEditMode && addingType === type && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3 animate-in fade-in">
              <div className="text-xs font-bold text-amber-900">Add New {type}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  placeholder="Report Title (e.g. AQAR 2023-2024)"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  className="p-2.5 rounded-xl border border-amber-500/30 bg-white text-sm outline-none"
                />
                <input
                  placeholder="Year (e.g. 2023-24)"
                  value={newReport.year}
                  onChange={(e) => setNewReport({ ...newReport, year: e.target.value })}
                  className="p-2.5 rounded-xl border border-amber-500/30 bg-white text-sm outline-none"
                />
                <input
                  placeholder="PDF / Document Link URL"
                  value={newReport.link}
                  onChange={(e) => setNewReport({ ...newReport, link: e.target.value })}
                  className="p-2.5 rounded-xl border border-amber-500/30 bg-white text-sm outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddingType(null)}
                  className="px-3 py-1 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newReport.title || !newReport.link) {
                      toast.error("Please provide Title and Document Link.");
                      return;
                    }
                    addReportMutation.mutate({
                      ...newReport,
                      year: newReport.year || newReport.title,
                      type,
                    });
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
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Report Title
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                    {isEditMode ? "Document Link & Actions" : "Download"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-8 py-16 text-center text-muted-foreground animate-pulse"
                    >
                      Loading reports...
                    </td>
                  </tr>
                ) : reports?.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-8 py-12 text-center text-muted-foreground">
                      No reports uploaded yet.
                    </td>
                  </tr>
                ) : (
                  reports?.map((report: any) => {
                    const isEdited = !!editedReports[report.id];
                    const titleVal = editedReports[report.id]?.title ?? report.title;
                    const linkVal = editedReports[report.id]?.link ?? report.link;

                    return (
                      <tr
                        key={report.id}
                        className="group hover:bg-primary/[0.02] transition-colors"
                      >
                        <td className="px-8 py-6 text-base font-bold text-ink">
                          {isEditMode ? (
                            <input
                              value={titleVal}
                              onChange={(e) =>
                                setEditedReports((p) => ({
                                  ...p,
                                  [report.id]: {
                                    ...p[report.id],
                                    title: e.target.value,
                                    link: linkVal,
                                  },
                                }))
                              }
                              className="w-full p-2 rounded border border-amber-500/30 text-sm font-semibold bg-white"
                            />
                          ) : (
                            report.title
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          {isEditMode ? (
                            <div className="flex items-center justify-end gap-2">
                              <input
                                placeholder="Link URL"
                                value={linkVal}
                                onChange={(e) =>
                                  setEditedReports((p) => ({
                                    ...p,
                                    [report.id]: {
                                      ...p[report.id],
                                      link: e.target.value,
                                      title: titleVal,
                                    },
                                  }))
                                }
                                className="p-1.5 rounded border border-amber-500/30 text-xs w-64 bg-white"
                              />
                              {isEdited && (
                                <button
                                  onClick={() => handleSaveReport(report.id, type)}
                                  className="p-1.5 rounded bg-amber-500 text-white hover:bg-amber-600"
                                >
                                  <Save className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm("Delete this report?")) {
                                    deleteReportMutation.mutate({ id: report.id, type });
                                  }
                                }}
                                className="p-1.5 rounded text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <a
                              href={report.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300"
                            >
                              <FileDown className="h-4 w-4" />
                              View/Download
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </RevealOnScroll>
    );
  };

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto space-y-24 px-4 sm:px-6">
        {renderSection(
          "Annual Quality Assurance Report",
          "Annual self-appraisal reports submitted to NAAC.",
          ClipboardCheck,
          "AQAR",
          aqarReports,
          isAqarLoading
        )}

        {renderSection(
          "Academic Audit Report",
          "Periodic internal and external reviews of academic processes.",
          ShieldCheck,
          "Academic Audit",
          auditReports,
          isAuditLoading
        )}
      </div>
    </section>
  );
}
