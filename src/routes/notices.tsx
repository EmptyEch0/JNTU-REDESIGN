import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Bell, ArrowRight, Plus, Trash2, Download, ExternalLink, Filter, Eye, X, Upload } from "lucide-react";
import libraryImg from "@/assets/library-interior.jpg";
import { SubNav } from "@/components/SubNav";
import { STUDENT_SUBNAV } from "@/lib/site";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { getNotices, addNotice, deleteNotice } from "@/funcs/site.server";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
} from "@/components/AdminEditPanel";

export const Route = createFileRoute("/notices")({
  loader: async () => await getNotices(),
  head: () => ({
    meta: [
      { title: "Notices — JNTU-GV CEV" },
      {
        name: "description",
        content: "Latest announcements, circulars and notices from JNTU-GV CEV.",
      },
      { property: "og:title", content: "Notices — JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Stay updated with academic, hostel and event notices.",
      },
    ],
  }),
  component: NoticesPage,
});

const DEFAULT_NOTICES = [
  {
    date: "June 18, 2026",
    tag: "Academic",
    title: "Academic Calendar for II B.Tech (2026-2027)",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/ii-b-tech-academic-calendar-june-2026.pdf",
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Timetable for I-MCA II-Semester (R25) End Examinations, June-2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-mca-ii-semester-r25-end-examinations-june-2026.pdf",
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Timetable for I-MBA II-Semester (R25) End Examinations, June-2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-mba-ii-semester-r25-end-examinations-june-2026.pdf",
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Timetable for I-MCA II-Semester (R20) Supply End Examinations, June-2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-mca-ii-semester-r20-supply-end-examinations-june-2026.pdf",
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Notification for M.Tech II-Semester (R25/R19) Regular/Supplementary Examinations, June-2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/mtech-ii-sem-r25-r19-examination-notification-june-2026.pdf",
  },
  {
    date: "June 12, 2026",
    tag: "Exams",
    title: "Timetable for I-II R23 End Examinations, June-2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-ii-r23-end-time-table-june-2026.pdf",
  },
  {
    date: "June 12, 2026",
    tag: "Exams",
    title: "Timetable for I-II R20 End Examinations, June-2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-ii-r20-end-time-table-june-2026.pdf",
  },
  {
    date: "June 5, 2026",
    tag: "Academic",
    title: "Academic Calendar for III B.Tech (2026-2027)",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/iii-b-tech-academic-calendar.pdf",
  },
  {
    date: "June 5, 2026",
    tag: "Academic",
    title: "Academic Calendar for IV B.Tech (2026-2027)",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/iv-b-tech-academic-calendar.pdf",
  },
  {
    date: "June 5, 2026",
    tag: "Exams",
    title: "Timetable for I-B.Tech II-Semester II-Mid Examinations, June-2026",
    url: "http://89.116.134.182:8080/local-assets/uploads/2026/06/i-btech-ii-mid-time-table-june-2026.pdf",
  },
  {
    date: "29 Apr 2026",
    tag: "Academic",
    title: "End-semester examinations schedule released for B.Tech IV-II.",
  },
  {
    date: "24 Apr 2026",
    tag: "Placements",
    title: "Pre-placement talks for Capgemini and Hexaware on 02 May.",
  },
  {
    date: "18 Apr 2026",
    tag: "Hostel",
    title: "Vacation guidelines for residents staying through summer.",
  },
  {
    date: "12 Apr 2026",
    tag: "R&D",
    title: "Call for proposals — UGC minor research grants 2026.",
  },
  {
    date: "05 Apr 2026",
    tag: "Event",
    title: "Annual cultural fest 'Spandana 2026' opens for registrations.",
  },
  {
    date: "28 Mar 2026",
    tag: "General",
    title: "Library timings extended during examination weeks.",
  },
];

function NoticesPage() {
  const dbNotices = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [previewNotice, setPreviewNotice] = useState<any | null>(null);
  const [newNotice, setNewNotice] = useState({
    date: "",
    tag: "Academic",
    title: "",
    url: "",
  });

  const activeNotices = dbNotices.length > 0 ? dbNotices : DEFAULT_NOTICES;

  const filteredNotices = activeTab === "All"
    ? activeNotices
    : activeNotices.filter((n) => (n.tag || "").toLowerCase() === activeTab.toLowerCase());

  const categories = ["All", "Academic", "Exams", "Placements", "Hostel", "R&D", "Event", "General"];

  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", "notices");
    formData.append("category", "date");

    const tId = toast.loading(`Uploading ${file.name}...`);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        // Construct full URL pointing to assets server
        const assetUrl = `http://89.116.134.182:8080/${json.path}`;
        setNewNotice((prev) => ({ ...prev, url: assetUrl }));
        toast.success(`Uploaded successfully to ${json.path}`, { id: tId });
      } else {
        toast.error(json.error || "Upload failed", { id: tId });
      }
    } catch (err: any) {
      toast.error("Failed to upload file", { id: tId });
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd() {
    if (!newNotice.title.trim()) return;
    const tId = toast.loading("Logging new notice...");
    try {
      await addNotice({
        data: {
          title: newNotice.title,
          tag: newNotice.tag,
          date: newNotice.date || new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
          url: newNotice.url || null,
        },
      });
      toast.success("Notice logged successfully!", { id: tId });
      setNewNotice({ date: "", tag: "Academic", title: "", url: "" });
      router.invalidate();
    } catch {
      toast.error("Failed to log notice.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Deleting notice...");
    try {
      await deleteNotice({ data: { id } });
      toast.success("Notice purged!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to delete notice.", { id: tId });
    }
  }

  return (
    <>
      {isEditMode && <AdminModeBanner label="Notices & Bulletins CMS Active" />}

      <PageHero
        eyebrow="Announcements"
        title="Notices, circulars & updates."
        subtitle="The latest from the office of the Principal, departments and student cells."
        image={libraryImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      <section className="py-20 container-narrow">
        {isEditMode && (
          <div className="mb-10">
            <AdminPanel>
              <AdminPanelHeader title="Publish New Announcement / Notice" />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <AdminField label="Announcement Title">
                  <AdminInput
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    placeholder="e.g. End-semester exam time tables released..."
                  />
                </AdminField>
                <AdminField label="Notice Group Tag">
                  <select
                    className="w-full border border-amber-200 bg-white rounded-lg p-2.5 text-sm outline-none font-semibold text-slate-800"
                    value={newNotice.tag}
                    onChange={(e) => setNewNotice({ ...newNotice, tag: e.target.value })}
                  >
                    {categories.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </AdminField>
                <AdminField label="Publish Date (Optional)">
                  <AdminInput
                    value={newNotice.date}
                    onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                    placeholder="e.g. 29 Apr 2026"
                  />
                </AdminField>
                <AdminField label="Upload PDF / Document">
                  <label className="flex items-center justify-center gap-2 p-2.5 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-[#0F4C81] rounded-lg font-bold text-xs cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? "Uploading..." : "Choose File (PDF/Image)"}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </AdminField>
              </div>

              {newNotice.url && (
                <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center justify-between">
                  <span className="truncate">Uploaded File: {newNotice.url}</span>
                  <button
                    onClick={() => setNewNotice((prev) => ({ ...prev, url: "" }))}
                    className="text-rose-600 hover:underline text-[11px] ml-2 shrink-0"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAdd}
                  className="bg-slate-900 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Publish Announcement
                </button>
              </div>
            </AdminPanel>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 [scrollbar-width:none]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === cat
                  ? "bg-[#0F4C81] text-white shadow-md shadow-[#0F4C81]/20 scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((n: any, i: number) => (
            <RevealOnScroll key={i} delay={i * 40}>
              <article className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 sm:p-6 bg-card border border-border rounded-2xl hover:border-[#0F4C81]/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <div className="flex items-start gap-4 flex-1 min-w-0 cursor-pointer" onClick={() => setPreviewNotice(n)}>
                  <div className="h-11 w-11 rounded-xl bg-sky-50 text-[#0F4C81] grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] font-bold text-[10px] uppercase tracking-wider">
                        {n.tag}
                      </span>
                      <span className="text-slate-400 font-semibold text-[11px]">{n.date}</span>
                    </div>
                    <h4 className="mt-2 text-slate-900 font-bold text-sm sm:text-base leading-snug group-hover:text-[#0F4C81] transition-colors">
                      {n.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setPreviewNotice(n)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white border border-sky-200/60 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  {n.url ? (
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  ) : null}

                  {isEditMode && n.id && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-xl transition shadow cursor-pointer ml-1"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </article>
            </RevealOnScroll>
          ))}

          {filteredNotices.length === 0 && (
            <div className="text-center py-16 bg-slate-50 border border-slate-200/60 rounded-3xl">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">No notices found in "{activeTab}" category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Notice Preview Modal */}
      {previewNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-reveal">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] font-bold text-[10px] uppercase tracking-wider">
                    {previewNotice.tag}
                  </span>
                  <span className="text-slate-400 font-semibold text-xs">{previewNotice.date}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                  {previewNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewNotice(null)}
                className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {previewNotice.url ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>PDF Document Preview</span>
                    <a
                      href={previewNotice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0F4C81] hover:underline flex items-center gap-1"
                    >
                      Open in New Tab <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative">
                    <iframe
                      src={previewNotice.url}
                      className="w-full h-full border-0"
                      title="Document Preview"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F4C81] uppercase tracking-wider">
                    <Bell className="w-4 h-4" /> Official Notice Announcement
                  </div>
                  <p className="text-slate-800 text-base leading-relaxed font-semibold">
                    {previewNotice.title}
                  </p>
                  <div className="pt-4 border-t border-slate-200/60 text-xs text-slate-400 font-medium">
                    Issued by JNTU-GV College of Engineering Vizianagaram Administration. Date: {previewNotice.date}.
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
              {previewNotice.url && (
                <a
                  href={previewNotice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
              )}
              <button
                onClick={() => setPreviewNotice(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

