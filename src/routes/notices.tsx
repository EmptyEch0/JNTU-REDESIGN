import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Bell, ArrowRight, Plus, Trash2 } from "lucide-react";
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

  const [newNotice, setNewNotice] = useState({
    date: "",
    tag: "Academic",
    title: "",
  });

  const activeNotices = dbNotices.length > 0 ? dbNotices : DEFAULT_NOTICES;

  async function handleAdd() {
    if (!newNotice.title.trim()) return;
    const tId = toast.loading("Logging new notice...");
    try {
      await addNotice({
        data: {
          title: newNotice.title,
          tag: newNotice.tag,
          date: newNotice.date || new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
        },
      });
      toast.success("Notice logged successfully!", { id: tId });
      setNewNotice({ date: "", tag: "Academic", title: "" });
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
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
                    <option value="Academic">Academic</option>
                    <option value="Placements">Placements</option>
                    <option value="Hostel">Hostel</option>
                    <option value="R&D">R&D</option>
                    <option value="Event">Event</option>
                    <option value="General">General</option>
                  </select>
                </AdminField>
                <AdminField label="Publish Date (Optional)">
                  <AdminInput
                    value={newNotice.date}
                    onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                    placeholder="e.g. 29 Apr 2026"
                  />
                </AdminField>
              </div>
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

        <div className="space-y-3">
          {activeNotices.map((n, i) => (
            <RevealOnScroll key={i} delay={i * 50}>
              <article className="group flex items-start sm:items-center gap-5 p-5 sm:p-6 bg-card border border-border rounded-2xl hover-lift relative overflow-hidden">
                <div className="h-12 w-12 rounded-xl bg-sand text-primary grid place-items-center shrink-0">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-eyebrow">{n.tag}</span>
                    <span className="text-muted-foreground">{n.date}</span>
                  </div>
                  <p className="mt-2 text-ink font-medium pr-12">{n.title}</p>
                </div>

                {isEditMode && n.id ? (
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-full transition shadow cursor-pointer z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                )}
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}

