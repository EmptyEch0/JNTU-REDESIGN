import { createFileRoute, useRouter } from "@tanstack/react-router";
import { DownloadCard } from "@/components/academics/DownloadCard";
import { PageHero } from "@/components/PageHero";
import { VerticalSubNav } from "@/components/VerticalSubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { imageUrl } from "@/lib/assets";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { Plus, Trash2, Search, BookOpen, GraduationCap, Award, FileText, CheckCircle2 } from "lucide-react";
import { getAcademicRegulations, addAcademicRegulation, deleteAcademicRegulation } from "@/funcs/site.server";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
} from "@/components/AdminEditPanel";
import { resolveRegulationPdf } from "@/lib/regulations-resolver";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/academics/regulations")({
  loader: async () => await getAcademicRegulations(),
  head: () => ({
    meta: [
      { title: "Academic Regulations — JNTU-GV CEV" },
      {
        name: "description",
        content: "Official academic regulations, curriculum frameworks, and credit rules for UG (B.Tech) and PG (M.Tech, MCA, MBA) programs at JNTU-GV College of Engineering Vizianagaram.",
      },
    ],
  }),
  component: RegulationsPage,
});

export interface RegulationItem {
  id?: number;
  title: string;
  category: "B.Tech" | "M.Tech" | "MCA" | "MBA";
  level?: "UG" | "PG";
  program_name?: string;
  regulation?: string;
  size?: string;
  date?: string;
  link: string;
  pdf_url?: string;
}

// ── Complete & Verified Canonical Regulations Pool ──
export const CANONICAL_REGULATIONS: RegulationItem[] = [
  // ── UG Regulations (B.Tech) ──
  {
    id: 1,
    title: "R23 B.Tech Regulations",
    category: "B.Tech",
    level: "UG",
    program_name: "B.Tech",
    regulation: "R23",
    size: "743 KB",
    date: "2023",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2024/07/JNTUGVCEV-UG-B.Tech_.-R23-Regulations.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2024/07/JNTUGVCEV-UG-B.Tech_.-R23-Regulations.pdf",
  },
  {
    id: 2,
    title: "Regulations for Honors and Minors",
    category: "B.Tech",
    level: "UG",
    program_name: "B.Tech",
    regulation: "Honors & Minors",
    size: "408 KB",
    date: "2021",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2021/05/UCEV-HONORS-MINORS-GUIDELINES23-5-21.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2021/05/UCEV-HONORS-MINORS-GUIDELINES23-5-21.pdf",
  },
  {
    id: 3,
    title: "R20 B.Tech Regulations",
    category: "B.Tech",
    level: "UG",
    program_name: "B.Tech",
    regulation: "R20",
    size: "855 KB",
    date: "2020",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2021/04/R20-B.TECH-UCEV-REGULATIONS-FINAL.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2021/04/R20-B.TECH-UCEV-REGULATIONS-FINAL.pdf",
  },
  {
    id: 4,
    title: "R19 B.Tech Regulations",
    category: "B.Tech",
    level: "UG",
    program_name: "B.Tech",
    regulation: "R19",
    size: "776 KB",
    date: "2019",
    link: "http://jntugvcev.edu.in/wp-content/uploads/2019/12/R19_UCEV-JNTUK-B.Tech-R19-Regulations-FINAL.pdf",
    pdf_url: "http://jntugvcev.edu.in/wp-content/uploads/2019/12/R19_UCEV-JNTUK-B.Tech-R19-Regulations-FINAL.pdf",
  },
  {
    id: 5,
    title: "R16 B.Tech Regulations",
    category: "B.Tech",
    level: "UG",
    program_name: "B.Tech",
    regulation: "R16",
    size: "344 KB",
    date: "2016",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/B.Tech-R16-Regulations.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/B.Tech-R16-Regulations.pdf",
  },
  {
    id: 6,
    title: "R13 B.Tech Regulations",
    category: "B.Tech",
    level: "UG",
    program_name: "B.Tech",
    regulation: "R13",
    size: "269 KB",
    date: "2013",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/BTechR13-Regulation.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/BTechR13-Regulation.pdf",
  },

  // ── PG Regulations — M.Tech ──
  {
    id: 7,
    title: "R25 M.Tech Regulations",
    category: "M.Tech",
    level: "PG",
    program_name: "M.Tech",
    regulation: "R25",
    size: "394 KB",
    date: "2026",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2026/01/JNTU-GV-R25-M.Tech-Revised-Regulations-08-01-26.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2026/01/JNTU-GV-R25-M.Tech-Revised-Regulations-08-01-26.pdf",
  },
  {
    id: 8,
    title: "R19 M.Tech Regulations",
    category: "M.Tech",
    level: "PG",
    program_name: "M.Tech",
    regulation: "R19",
    size: "250 KB",
    date: "2019",
    link: "http://jntugvcev.edu.in/wp-content/uploads/2019/12/M.Tech-R19-revised-regulations.pdf",
    pdf_url: "http://jntugvcev.edu.in/wp-content/uploads/2019/12/M.Tech-R19-revised-regulations.pdf",
  },
  {
    id: 9,
    title: "R16 M.Tech Regulations",
    category: "M.Tech",
    level: "PG",
    program_name: "M.Tech",
    regulation: "R16",
    size: "743 KB",
    date: "2016",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/M.Tech-Regulation-modification-R16.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/M.Tech-Regulation-modification-R16.pdf",
  },
  {
    id: 10,
    title: "R13 M.Tech Regulations",
    category: "M.Tech",
    level: "PG",
    program_name: "M.Tech",
    regulation: "R13",
    size: "268 KB",
    date: "2013",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/M.Tech-R13-Regulation.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/M.Tech-R13-Regulation.pdf",
  },

  // ── PG Regulations — MCA ──
  {
    id: 11,
    title: "R25 MCA Regulations",
    category: "MCA",
    level: "PG",
    program_name: "MCA",
    regulation: "R25",
    size: "568 KB",
    date: "2025",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2025/12/JNTUGV-R-25-MCA-regulations.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2025/12/JNTUGV-R-25-MCA-regulations.pdf",
  },
  {
    id: 12,
    title: "R20 MCA Regulations",
    category: "MCA",
    level: "PG",
    program_name: "MCA",
    regulation: "R20",
    size: "1.10 MB",
    date: "2021",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2021/04/MCA-R20-Regulations-16-04-21.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2021/04/MCA-R20-Regulations-16-04-21.pdf",
  },
  {
    id: 13,
    title: "R19 MCA Regulations",
    category: "MCA",
    level: "PG",
    program_name: "MCA",
    regulation: "R19",
    size: "460 KB",
    date: "2019",
    link: "http://jntugvcev.edu.in/wp-content/uploads/2019/12/MCA-R19-Regulations-revised.pdf",
    pdf_url: "http://jntugvcev.edu.in/wp-content/uploads/2019/12/MCA-R19-Regulations-revised.pdf",
  },
  {
    id: 14,
    title: "R13 MCA Regulations",
    category: "MCA",
    level: "PG",
    program_name: "MCA",
    regulation: "R13",
    size: "165 KB",
    date: "2013",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/MCA-R13-Regulation.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/MCA-R13-Regulation.pdf",
  },

  // ── PG Regulations — MBA ──
  {
    id: 15,
    title: "R25 MBA Regulations",
    category: "MBA",
    level: "PG",
    program_name: "MBA",
    regulation: "R25",
    size: "438 KB",
    date: "2025",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2025/12/MBA-R25-Regulations-2.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2025/12/MBA-R25-Regulations-2.pdf",
  },
  {
    id: 16,
    title: "R19 MBA Regulations",
    category: "MBA",
    level: "PG",
    program_name: "MBA",
    regulation: "R19",
    size: "332 KB",
    date: "2025",
    link: "https://jntugvcev.edu.in/wp-content/uploads/2025/07/MBA-R19-REGULATIONS-1.pdf",
    pdf_url: "https://jntugvcev.edu.in/wp-content/uploads/2025/07/MBA-R19-REGULATIONS-1.pdf",
  },
];

type CategoryFilter = "All" | "B.Tech" | "M.Tech" | "MCA" | "MBA";

function RegulationsPage() {
  const dbData = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [newReg, setNewReg] = useState({
    title: "",
    category: "B.Tech" as "B.Tech" | "M.Tech" | "MCA" | "MBA",
    size: "",
    date: "",
    link: "",
  });

  // Source list: use database records if available (with fallback resolution), otherwise use complete canonical pool
  const allRegulations: RegulationItem[] = useMemo(() => {
    if (Array.isArray(dbData) && dbData.length > 0) {
      return dbData.map((r: any) => ({
        ...r,
        link: resolveRegulationPdf(r.link || r.pdf_url, r.title, r.category),
        pdf_url: resolveRegulationPdf(r.pdf_url || r.link, r.title, r.category),
      }));
    }
    return CANONICAL_REGULATIONS.map((r) => ({
      ...r,
      link: resolveRegulationPdf(r.link, r.title, r.category),
      pdf_url: resolveRegulationPdf(r.pdf_url, r.title, r.category),
    }));
  }, [dbData]);

  // Filter by category and search term
  const filteredRegs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allRegulations.filter((item) => {
      const matchesCategory = activeTab === "All" || item.category === activeTab;
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.regulation && item.regulation.toLowerCase().includes(q)) ||
        (item.date && item.date.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [allRegulations, activeTab, searchQuery]);

  // Grouped datasets
  const btechList = useMemo(
    () => filteredRegs.filter((r) => r.category === "B.Tech"),
    [filteredRegs]
  );
  const mtechList = useMemo(
    () => filteredRegs.filter((r) => r.category === "M.Tech"),
    [filteredRegs]
  );
  const mcaList = useMemo(
    () => filteredRegs.filter((r) => r.category === "MCA"),
    [filteredRegs]
  );
  const mbaList = useMemo(
    () => filteredRegs.filter((r) => r.category === "MBA"),
    [filteredRegs]
  );

  async function handleAdd() {
    if (!newReg.title.trim()) {
      toast.error("Please provide a title for the regulation.");
      return;
    }
    const tId = toast.loading("Adding new academic regulation...");
    try {
      await addAcademicRegulation({
        data: {
          title: newReg.title.trim(),
          category: newReg.category,
          level: newReg.category === "B.Tech" ? "UG" : "PG",
          program_name: newReg.category,
          size: newReg.size.trim() || "PDF",
          date: newReg.date.trim() || new Date().getFullYear().toString(),
          link: newReg.link.trim() || "#",
          pdf_url: newReg.link.trim() || "#",
        },
      });
      toast.success("Regulation added successfully!", { id: tId });
      setNewReg({ title: "", category: "B.Tech", size: "", date: "", link: "" });
      router.invalidate();
    } catch {
      toast.error("Failed to add regulation.", { id: tId });
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    const tId = toast.loading("Purging regulation record...");
    try {
      await deleteAcademicRegulation({ data: { id } });
      toast.success("Regulation deleted!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to delete regulation.", { id: tId });
    }
  }

  return (
    <div className="space-y-12 pb-24 bg-stone-50/50 dark:bg-zinc-950 min-h-screen">
      {isEditMode && <AdminModeBanner label="Academic Regulations CMS Mode Active" />}

      <PageHero
        eyebrow="Academics & Curriculums"
        title="Academic Regulations"
        subtitle="Official curricula, credit frameworks, and evaluation guidelines governing undergraduate and postgraduate programs."
        image={campusImg}
      />

      <div className="container-narrow py-8 flex flex-col md:flex-row gap-8 items-start">
        <VerticalSubNav items={ACADEMICS_SUBNAV} />

        <div className="flex-1 min-w-0 space-y-8">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs tracking-wider uppercase">
                <GraduationCap className="w-4 h-4" /> UG B.Tech
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">6 Sets</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">R23 to R13 & Honors</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase">
                <BookOpen className="w-4 h-4" /> PG M.Tech
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4 Sets</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">R25 to R13 Schemes</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
                <FileText className="w-4 h-4" /> PG MCA
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4 Sets</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">R25 to R13 Curricula</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs tracking-wider uppercase">
                <Award className="w-4 h-4" /> PG MBA
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2 Sets</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">R25 & R19 Frameworks</div>
            </div>
          </div>

          {/* Search & Filter Tabs */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Category Tab Pills */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {(
                  [
                    { key: "All", label: "All Regulations", count: allRegulations.length },
                    { key: "B.Tech", label: "UG (B.Tech)", count: 6 },
                    { key: "M.Tech", label: "PG (M.Tech)", count: 4 },
                    { key: "MCA", label: "PG (MCA)", count: 4 },
                    { key: "MBA", label: "PG (MBA)", count: 2 },
                  ] as const
                ).map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm dark:bg-rose-600 dark:text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-200"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search regulation, year, code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Admin Mode Panel */}
          {isEditMode && (
            <section className="mb-8">
              <AdminPanel>
                <AdminPanelHeader title="Add New Academic Regulation" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AdminField label="Regulation Title">
                    <AdminInput
                      value={newReg.title}
                      onChange={(e) => setNewReg({ ...newReg, title: e.target.value })}
                      placeholder="e.g. R23 B.Tech Regulations"
                    />
                  </AdminField>
                  <AdminField label="Category / Program">
                    <select
                      className="w-full border border-amber-200 bg-white rounded-lg p-2 text-sm outline-none"
                      value={newReg.category}
                      onChange={(e) =>
                        setNewReg({
                          ...newReg,
                          category: e.target.value as "B.Tech" | "M.Tech" | "MCA" | "MBA",
                        })
                      }
                    >
                      <option value="B.Tech">UG — B.Tech (Undergraduate)</option>
                      <option value="M.Tech">PG — M.Tech (Postgraduate)</option>
                      <option value="MCA">PG — MCA (Computer Applications)</option>
                      <option value="MBA">PG — MBA (Business Administration)</option>
                    </select>
                  </AdminField>
                  <AdminField label="File Size (e.g. 743 KB / 1.2 MB)">
                    <AdminInput
                      value={newReg.size}
                      onChange={(e) => setNewReg({ ...newReg, size: e.target.value })}
                      placeholder="e.g. 743 KB"
                    />
                  </AdminField>
                  <AdminField label="Release Year / Date">
                    <AdminInput
                      value={newReg.date}
                      onChange={(e) => setNewReg({ ...newReg, date: e.target.value })}
                      placeholder="e.g. 2023"
                    />
                  </AdminField>
                  <div className="sm:col-span-2">
                    <AdminField label="PDF Link / Document URL">
                      <AdminInput
                        value={newReg.link}
                        onChange={(e) => setNewReg({ ...newReg, link: e.target.value })}
                        placeholder="https://jntugvcev.edu.in/wp-content/uploads/..."
                      />
                    </AdminField>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleAdd}
                    className="bg-slate-900 hover:bg-rose-600 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Save Regulation
                  </button>
                </div>
              </AdminPanel>
            </section>
          )}

          {/* Section 1: UG Regulations (B.Tech) */}
          {(activeTab === "All" || activeTab === "B.Tech") && btechList.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold ring-1 ring-rose-300 dark:ring-rose-800">
                    UG
                  </span>
                  <span>UG Regulations — B.Tech</span>
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {btechList.length} Curricula
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {btechList.map((reg, idx) => (
                  <div key={reg.id || idx} className="relative group">
                    <DownloadCard
                      title={reg.title}
                      category={reg.category}
                      size={reg.size || "PDF"}
                      date={reg.date}
                      link={reg.link}
                      pdf_url={reg.pdf_url}
                      delay={idx * 0.05}
                    />
                    {isEditMode && reg.id && (
                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-700 transition cursor-pointer shadow-md z-10"
                        title="Delete Regulation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 2: PG Regulations — M.Tech */}
          {(activeTab === "All" || activeTab === "M.Tech") && mtechList.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="space-y-4 pt-2"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold ring-1 ring-indigo-300 dark:ring-indigo-800">
                    PG
                  </span>
                  <span>PG Regulations — M.Tech</span>
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {mtechList.length} Curricula
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mtechList.map((reg, idx) => (
                  <div key={reg.id || idx} className="relative group">
                    <DownloadCard
                      title={reg.title}
                      category={reg.category}
                      size={reg.size || "PDF"}
                      date={reg.date}
                      link={reg.link}
                      pdf_url={reg.pdf_url}
                      delay={idx * 0.05}
                    />
                    {isEditMode && reg.id && (
                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-700 transition cursor-pointer shadow-md z-10"
                        title="Delete Regulation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 3: PG Regulations — MCA */}
          {(activeTab === "All" || activeTab === "MCA") && mcaList.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-4 pt-2"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold ring-1 ring-emerald-300 dark:ring-emerald-800">
                    PG
                  </span>
                  <span>PG Regulations — MCA</span>
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {mcaList.length} Curricula
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mcaList.map((reg, idx) => (
                  <div key={reg.id || idx} className="relative group">
                    <DownloadCard
                      title={reg.title}
                      category={reg.category}
                      size={reg.size || "PDF"}
                      date={reg.date}
                      link={reg.link}
                      pdf_url={reg.pdf_url}
                      delay={idx * 0.05}
                    />
                    {isEditMode && reg.id && (
                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-700 transition cursor-pointer shadow-md z-10"
                        title="Delete Regulation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 4: PG Regulations — MBA */}
          {(activeTab === "All" || activeTab === "MBA") && mbaList.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="space-y-4 pt-2"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold ring-1 ring-amber-300 dark:ring-amber-800">
                    PG
                  </span>
                  <span>PG Regulations — MBA</span>
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {mbaList.length} Curricula
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mbaList.map((reg, idx) => (
                  <div key={reg.id || idx} className="relative group">
                    <DownloadCard
                      title={reg.title}
                      category={reg.category}
                      size={reg.size || "PDF"}
                      date={reg.date}
                      link={reg.link}
                      pdf_url={reg.pdf_url}
                      delay={idx * 0.05}
                    />
                    {isEditMode && reg.id && (
                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-700 transition cursor-pointer shadow-md z-10"
                        title="Delete Regulation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Empty Search Fallback */}
          {filteredRegs.length === 0 && (
            <div className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-zinc-900 border border-dashed border-slate-200 dark:border-zinc-800 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No matching academic regulations found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No regulation records match &ldquo;{searchQuery}&rdquo;. Try clearing your search query or selecting &ldquo;All Regulations&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("All");
                }}
                className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
