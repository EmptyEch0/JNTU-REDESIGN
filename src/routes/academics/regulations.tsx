import { createFileRoute, useRouter } from "@tanstack/react-router";
import { DownloadCard } from "@/components/academics/DownloadCard";
import { PageHero } from "@/components/PageHero";
import { VerticalSubNav } from "@/components/VerticalSubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { imageUrl } from "@/lib/assets";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { getRegulations, addRegulation, deleteRegulation } from "@/funcs/site.server";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
} from "@/components/AdminEditPanel";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/academics/regulations")({
  loader: async () => await getRegulations(),
  component: RegulationsPage,
});

const DEFAULT_BTECH = [
  { title: "R23 Academic Regulations (B.Tech)", category: "B.Tech", size: "1.2 MB", date: "Sep 2023", link: "#" },
  { title: "R20 Academic Regulations (B.Tech)", category: "B.Tech", size: "1.5 MB", date: "Aug 2020", link: "#" },
  { title: "R19 Academic Regulations (B.Tech)", category: "B.Tech", size: "2.1 MB", date: "Jul 2019", link: "#" },
];

const DEFAULT_MTECH = [
  { title: "R23 Academic Regulations (M.Tech)", category: "M.Tech", size: "900 KB", date: "Sep 2023", link: "#" },
  { title: "R20 Academic Regulations (M.Tech)", category: "M.Tech", size: "1.1 MB", date: "Aug 2020", link: "#" },
];

function RegulationsPage() {
  const dbData = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const [newReg, setNewReg] = useState({
    title: "",
    category: "B.Tech",
    size: "",
    date: "",
    link: "",
  });

  const btechRegs = dbData.length > 0 ? dbData.filter((r) => r.category === "B.Tech") : DEFAULT_BTECH;
  const mtechRegs = dbData.length > 0 ? dbData.filter((r) => r.category === "M.Tech") : DEFAULT_MTECH;

  async function handleAdd() {
    if (!newReg.title.trim()) return;
    const tId = toast.loading("Adding new academic regulation...");
    try {
      await addRegulation({
        data: {
          title: newReg.title,
          category: newReg.category,
          size: newReg.size || "1.0 MB",
          date: newReg.date || new Date().toLocaleString("en-US", { month: "short", year: "numeric" }),
          link: newReg.link || "#",
        },
      });
      toast.success("Regulation added successfully!", { id: tId });
      setNewReg({ title: "", category: "B.Tech", size: "", date: "", link: "" });
      router.invalidate();
    } catch {
      toast.error("Failed to add regulation.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging regulation record...");
    try {
      await deleteRegulation({ data: { id } });
      toast.success("Regulation deleted!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to delete regulation.", { id: tId });
    }
  }

  return (
    <div className="space-y-12 pb-24">
      {isEditMode && <AdminModeBanner label="Academic Regulations CMS Mode Active" />}

      <PageHero
        eyebrow="Academics"
        title="Academic Regulations"
        subtitle="Rules, guidelines, and procedures governing academic programs."
        image={campusImg}
      />
      <div className="container-narrow py-12 flex flex-col md:flex-row gap-8 items-start">
        <VerticalSubNav items={ACADEMICS_SUBNAV} />
        <div className="flex-1 min-w-0 space-y-12">

        {isEditMode && (
          <section className="mb-12">
            <AdminPanel>
              <AdminPanelHeader title="Log New Academic Regulation" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminField label="Regulation Title">
                  <AdminInput
                    value={newReg.title}
                    onChange={(e) => setNewReg({ ...newReg, title: e.target.value })}
                    placeholder="e.g. R23 Academic Regulations (B.Tech)"
                  />
                </AdminField>
                <AdminField label="Category / Level">
                  <select
                    className="w-full border border-amber-200 bg-white rounded-lg p-2 text-sm outline-none"
                    value={newReg.category}
                    onChange={(e) => setNewReg({ ...newReg, category: e.target.value })}
                  >
                    <option value="B.Tech">B.Tech (Undergraduate)</option>
                    <option value="M.Tech">M.Tech / MBA (Postgraduate)</option>
                  </select>
                </AdminField>
                <AdminField label="File Size">
                  <AdminInput
                    value={newReg.size}
                    onChange={(e) => setNewReg({ ...newReg, size: e.target.value })}
                    placeholder="e.g. 1.2 MB"
                  />
                </AdminField>
                <AdminField label="Release Date">
                  <AdminInput
                    value={newReg.date}
                    onChange={(e) => setNewReg({ ...newReg, date: e.target.value })}
                    placeholder="e.g. Sep 2023"
                  />
                </AdminField>
                <div className="sm:col-span-2">
                  <AdminField label="PDF Link / Attachment URL">
                    <AdminInput
                      value={newReg.link}
                      onChange={(e) => setNewReg({ ...newReg, link: e.target.value })}
                      placeholder="Paste PDF link here..."
                    />
                  </AdminField>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAdd}
                  className="bg-slate-900 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Regulation
                </button>
              </div>
            </AdminPanel>
          </section>
        )}

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm">UG</span>
              B.Tech Regulations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {btechRegs.map((reg, idx) => (
                <div key={idx} className="relative group">
                  <DownloadCard {...reg} delay={idx * 0.1} />
                  {isEditMode && reg.id && (
                    <button
                      onClick={() => handleDelete(reg.id)}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-2 rounded-full hover:bg-rose-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">PG</span>
              M.Tech & MBA Regulations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mtechRegs.map((reg, idx) => (
                <div key={idx} className="relative group">
                  <DownloadCard {...reg} delay={idx * 0.1} />
                  {isEditMode && reg.id && (
                    <button
                      onClick={() => handleDelete(reg.id)}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-2 rounded-full hover:bg-rose-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        </div>
      </div>
    </div>
  );
}

