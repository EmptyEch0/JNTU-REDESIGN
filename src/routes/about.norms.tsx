import { createFileRoute, useRouter } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import {
  FileText,
  Download,
  Eye,
  ShieldCheck,
  Building2,
  ExternalLink,
  Plus,
  Trash2,
  Award,
  CheckCircle2,
  Search,
} from "lucide-react";
import { downloadFile, previewFile } from "@/lib/download";
const heroImg = imageUrl("hero-carousal/hero-campus.jpg");
import {
  getPageContent,
  updatePageSection,
  getAcademicRegulations,
  addAcademicRegulation,
  deleteAcademicRegulation,
} from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSaveButton,
} from "@/components/AdminEditPanel";

export const Route = createFileRoute("/about/norms")({
  loader: async () => {
    const [pageContent, regulations] = await Promise.all([
      getPageContent({ data: "norms" }),
      getAcademicRegulations(),
    ]);
    return { pageContent, regulations };
  },
  head: () => ({
    meta: [
      { title: "Norms, Recognition, AICTE & NIRF — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Official accreditation, AICTE Extension of Approval (EOA), NIRF rankings, and UGC 2(f) & 12(B) recognition norms of JNTU-GV College of Engineering Vizianagaram.",
      },
    ],
  }),
  component: NormsPage,
});

const DEFAULTS = {
  heroTitle: "Norms & Recognition",
  heroSubtitle:
    "Official certifications, AICTE Approvals, NIRF Ranking Reports, and government mandates that define our institutional framework.",
  recTitle: "Institutional Accreditations & Compliance",
  recSubtitle:
    "As a premier state-funded university college, we adhere to the statutory compliance of UGC, AICTE, and national ranking benchmarks (NIRF).",
  ugcTitle: "UGC 12(B) and 2(f) Recognition",
  ugcDesc:
    "JNTU-GV College of Engineering Vizianagaram is recognized by the University Grants Commission (UGC) under Section 2(f) and 12(B) of the UGC Act, 1956. This recognition makes the college eligible for central assistance and grants for research and development activities.",
  ugcStat1: "2(f)",
  ugcStat1Label: "UGC Recognized",
  ugcStat2: "12(B)",
  ugcStat2Label: "Grant Eligible",
};

export const DEFAULT_DOCUMENTS = [
  // ── UGC & Statutory Institutional Norms ───────────────────────────────
  {
    id: -1,
    title: "UGC 2(f) & 12(B) Recognition",
    size: "Official certificate recognizing the institution under Section 2(f) and 12(B) of the UGC Act, 1956.",
    link: "/local-assets/uploads/2020/08/UGC-1-747x1024-1.pdf",
    date: "UGC Recognition",
    section: "Institutional",
  },
  {
    id: -2,
    title: "University Establishment Order (GO MS. No. 14)",
    size: "Government of Andhra Pradesh Higher Education Department Order regarding the establishment of the university.",
    link: "/local-assets/uploads/2021/03/13022019HE_MS14.pdf",
    date: "Government Order",
    section: "Institutional",
  },
  {
    id: -3,
    title: "JNTU Act (Act No. 30 of 2008)",
    size: "Legislative act establishing Jawaharlal Nehru Technological University.",
    link: "/local-assets/uploads/2021/03/JNTUACT-compressed.pdf",
    date: "University Act",
    section: "Institutional",
  },
  {
    id: -4,
    title: "Right to Information (RTI) Act, 2005",
    size: "Statutory information disclosure rules and designated Public Information Officers (PIO).",
    link: "/local-assets/uploads/2021/02/rti-act.pdf",
    date: "Statutory Act",
    section: "Institutional",
  },

  // ── NIRF Ranking Reports & DCS Submissions ────────────────────────────
  {
    id: -101,
    title: "NIRF DCS Report 2026",
    size: "Official National Institutional Ranking Framework (NIRF) Data Capturing System (DCS) Report 2026.",
    link: "/local-assets/uploads/2026/04/NIRF-DCS-REPORT-JNTU-GV-COLLEGE-OF-ENGINEERING-VIZIANAGARAM-A-2026.pdf",
    date: "NIRF 2026 DCS",
    section: "NIRF",
  },
  {
    id: -102,
    title: "NIRF Ranking Report 2022",
    size: "MHRD National Institutional Ranking Framework institutional data submission and score report 2022.",
    link: "/local-assets/uploads/2022/03/NIRF2022_JNTUK-University-College-of-Engineering-Vizianagaram.pdf",
    date: "NIRF 2022",
    section: "NIRF",
  },
  {
    id: -103,
    title: "NIRF Ranking Report 2021",
    size: "Official NIRF institutional evaluation documentation and ranking metrics 2021.",
    link: "/local-assets/uploads/2021/02/NIRF2021_JNTUK-University-College-of-Engineering-Vizianagaram.pdf",
    date: "NIRF 2021",
    section: "NIRF",
  },
  {
    id: -104,
    title: "NIRF Report 2020 (DCS Submission)",
    size: "NIRF Data Capturing System submission report submitted to MHRD for University College of Engineering.",
    link: "/local-assets/uploads/2016/12/University-College-of-Engineering20200214-.pdf",
    date: "NIRF 2020 DCS",
    section: "NIRF",
  },
  {
    id: -105,
    title: "NIRF MHRD Overall Ranking Report",
    size: "Ministry of Human Resource Development (MHRD) NIRF Overall institutional category report.",
    link: "/local-assets/uploads/2016/12/All-Report-MHRD-National-Institutional-Ranking-Framework-NIRF-O.pdf",
    date: "NIRF Overall",
    section: "NIRF",
  },
  {
    id: -106,
    title: "NIRF MHRD Engineering Ranking Report",
    size: "Ministry of Human Resource Development (MHRD) NIRF Engineering category assessment report.",
    link: "/local-assets/uploads/2016/12/All-Report-MHRD-National-Institutional-Ranking-Framework-NIRF.pdf",
    date: "NIRF Engineering",
    section: "NIRF",
  },
  {
    id: -107,
    title: "NIRF 2017 Documentation Set Archive",
    size: "Consolidated archive of NIRF 2017 submission documents, faculty data, and institutional metrics (.zip).",
    link: "/local-assets/uploads/2017/01/NIRF-2017-Documents-Set-Final.zip",
    date: "NIRF Archive",
    section: "NIRF",
  },

  // ── AICTE Norms & Extension of Approval (EOA) Reports ─────────────────
  {
    id: -201,
    title: "AICTE Three-Year Extension of Approval (2024–2027)",
    size: "Official AICTE Extension of Approval (EOA) granted for 3 consecutive academic years (2024-25, 2025-26, and 2026-27).",
    link: "/local-assets/uploads/2024/07/Three-Year-Approval-Letter-2024-2025.pdf",
    date: "AICTE 3-Year EOA",
    section: "AICTE",
  },
  {
    id: -202,
    title: "AICTE EOA Report (2024–2025)",
    size: "Extension of Approval notification and sanctioned course intake for Academic Year 2024-25.",
    link: "/local-assets/uploads/2024/06/EOA-Report-2024-2025.pdf",
    date: "AICTE EOA 2024-25",
    section: "AICTE",
  },
  {
    id: -203,
    title: "AICTE EOA Report (2023–2024)",
    size: "Extension of Approval notification and technical program renewals for Academic Year 2023-24.",
    link: "/local-assets/uploads/2023/05/EOA-Report-2023-24.pdf",
    date: "AICTE EOA 2023-24",
    section: "AICTE",
  },
  {
    id: -204,
    title: "AICTE EOA Report (2022–2023)",
    size: "Extension of Approval notification for technical courses and intake capacity for Academic Year 2022-23.",
    link: "/local-assets/uploads/2022/07/EOA-Report-22-23.pdf",
    date: "AICTE EOA 2022-23",
    section: "AICTE",
  },
  {
    id: -205,
    title: "AICTE EOA Report (2021–2022)",
    size: "Extension of Approval notification for technical courses for Academic Year 2021-22.",
    link: "/local-assets/uploads/2021/07/EOA-Report_21-22.pdf",
    date: "AICTE EOA 2021-22",
    section: "AICTE",
  },
  {
    id: -206,
    title: "AICTE EOA Report (2020–2021)",
    size: "Extension of Approval notification for technical courses for Academic Year 2020-21.",
    link: "/local-assets/uploads/2017/02/EOA_Report-2020-21.pdf",
    date: "AICTE EOA 2020-21",
    section: "AICTE",
  },
  {
    id: -207,
    title: "AICTE EOA Report (2019–2020)",
    size: "Extension of Approval notification for technical courses for Academic Year 2019-20.",
    link: "/local-assets/uploads/2017/02/EOA-Report-2019-20.pdf",
    date: "AICTE EOA 2019-20",
    section: "AICTE",
  },
  {
    id: -208,
    title: "AICTE EOA Report (2018–2019)",
    size: "Extension of Approval notification for technical courses for Academic Year 2018-19.",
    link: "/local-assets/uploads/2017/02/EOA-Report-2018-19.pdf",
    date: "AICTE EOA 2018-19",
    section: "AICTE",
  },
  {
    id: -209,
    title: "AICTE EOA Report (2017–2018)",
    size: "Extension of Approval notification for technical courses for Academic Year 2017-18.",
    link: "/local-assets/uploads/2017/02/EOA-Report-2017-18.pdf",
    date: "AICTE EOA 2017-18",
    section: "AICTE",
  },
  {
    id: -210,
    title: "AICTE EOA Report (2016–2017)",
    size: "Extension of Approval notification for technical courses for Academic Year 2016-17.",
    link: "/local-assets/uploads/2017/02/EOA-Report-2016-17-1.pdf",
    date: "AICTE EOA 2016-17",
    section: "AICTE",
  },
  {
    id: -211,
    title: "AICTE EOA Report (2015–2016)",
    size: "Extension of Approval notification for technical courses for Academic Year 2015-16.",
    link: "/local-assets/uploads/2017/02/EOA-Report-2015-16-1.pdf",
    date: "AICTE EOA 2015-16",
    section: "AICTE",
  },
  {
    id: -212,
    title: "AICTE Letter of Approval (LOA 2014–2015)",
    size: "Initial AICTE Letter of Approval (LOA) for technical undergraduate and postgraduate programs.",
    link: "/local-assets/uploads/2017/02/Letter-Of-Approval-2014-15-1.pdf",
    date: "AICTE LOA",
    section: "AICTE",
  },
  {
    id: -213,
    title: "Students Grievance Appeal & Monitoring Cell",
    size: "AICTE mandatory grievance redressal and student appeal monitoring cell establishment order.",
    link: "/local-assets/uploads/2017/02/Students-Grievance-Appeal-Monitoring-Cell.pdf",
    date: "AICTE Grievance",
    section: "AICTE",
  },
  {
    id: -214,
    title: "AICTE Anti-Ragging Notification (2009)",
    size: "AICTE statutory regulations on prevention and prohibition of ragging in technical institutions.",
    link: "/local-assets/uploads/2026/08/AICTE_Antiragging_2009.pdf",
    date: "AICTE Anti-Ragging",
    section: "AICTE",
  },
];

function getDocIcon(category: string, title: string = "") {
  const text = (category + " " + title).toLowerCase();
  if (text.includes("nirf") || text.includes("ranking") || text.includes("mhrd") || text.includes("dcs")) {
    return Award;
  }
  if (text.includes("aicte") || text.includes("eoa") || text.includes("approval") || text.includes("grievance")) {
    return CheckCircle2;
  }
  if (text.includes("recognition") || text.includes("ugc") || text.includes("shield")) {
    return ShieldCheck;
  }
  if (text.includes("order") || text.includes("govt") || text.includes("establishment") || text.includes("act")) {
    return Building2;
  }
  return FileText;
}

function NormsPage() {
  const { pageContent, regulations } = Route.useLoaderData();
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"All" | "Institutional" | "AICTE" | "NIRF">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const heroRec = (pageContent as any[]).find((r: any) => r.sectionKey === "hero") as any;
  const recRec = (pageContent as any[]).find((r: any) => r.sectionKey === "rec") as any;
  const ugcRec = (pageContent as any[]).find((r: any) => r.sectionKey === "ugc") as any;

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    recTitle: recRec?.title || DEFAULTS.recTitle,
    recSubtitle: recRec?.content || DEFAULTS.recSubtitle,
    ugcTitle: ugcRec?.title || DEFAULTS.ugcTitle,
    ugcDesc: ugcRec?.content || DEFAULTS.ugcDesc,
    ugcStat1: ugcRec?.extras || DEFAULTS.ugcStat1,
    ugcStat1Label: ugcRec?.subtag || DEFAULTS.ugcStat1Label,
    ugcStat2: ugcRec?.date || DEFAULTS.ugcStat2,
    ugcStat2Label: ugcRec?.tag || DEFAULTS.ugcStat2Label,
  });

  const [newDoc, setNewDoc] = useState({
    title: "",
    category: "AICTE EOA", // maps to date in DB
    desc: "", // maps to size in DB
    link: "",
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      recTitle: recRec?.title || DEFAULTS.recTitle,
      recSubtitle: recRec?.content || DEFAULTS.recSubtitle,
      ugcTitle: ugcRec?.title || DEFAULTS.ugcTitle,
      ugcDesc: ugcRec?.content || DEFAULTS.ugcDesc,
      ugcStat1: ugcRec?.extras || DEFAULTS.ugcStat1,
      ugcStat1Label: ugcRec?.subtag || DEFAULTS.ugcStat1Label,
      ugcStat2: ugcRec?.date || DEFAULTS.ugcStat2,
      ugcStat2Label: ugcRec?.tag || DEFAULTS.ugcStat2Label,
    });
  }, [pageContent]);

  async function handleSaveSection(section: string) {
    const tId = toast.loading("Saving content section...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "norms",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "rec") {
        await updatePageSection({
          data: {
            page: "norms",
            sectionKey: "rec",
            title: editTexts.recTitle,
            content: editTexts.recSubtitle,
          },
        });
      } else if (section === "ugc") {
        await updatePageSection({
          data: {
            page: "norms",
            sectionKey: "ugc",
            title: editTexts.ugcTitle,
            content: editTexts.ugcDesc,
            extras: editTexts.ugcStat1,
            subtag: editTexts.ugcStat1Label,
            date: editTexts.ugcStat2,
            tag: editTexts.ugcStat2Label,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save section.", { id: tId });
    }
  }

  async function handleAddDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!newDoc.title || !newDoc.link) {
      toast.error("Please fill in the title and PDF link.");
      return;
    }
    const tId = toast.loading("Adding document...");
    try {
      await addAcademicRegulation({
        data: {
          title: newDoc.title,
          category: "Norms",
          link: newDoc.link,
        },
      });
      toast.success("Document added successfully!", { id: tId });
      setNewDoc({ title: "", category: "AICTE EOA", desc: "", link: "" });
      router.invalidate();
    } catch {
      toast.error("Failed to add document.", { id: tId });
    }
  }

  async function handleDeleteDocument(id: number) {
    if (id < 0) {
      toast.error("Default documents cannot be deleted.");
      return;
    }
    if (!confirm("Are you sure you want to delete this document?")) return;
    const tId = toast.loading("Deleting document...");
    try {
      await deleteAcademicRegulation({ data: { id } });
      toast.success("Document deleted successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to delete document.", { id: tId });
    }
  }

  const dbDocs = (regulations as any[]).filter((r: any) => r.category === "Norms");
  const rawDocs = dbDocs.length > 0 ? dbDocs : DEFAULT_DOCUMENTS;

  // Augment database docs or default docs with a clean section tag
  const normalizedDocs = rawDocs.map((doc: any) => {
    let section = doc.section;
    if (!section) {
      const lower = ((doc.date || "") + " " + (doc.title || "")).toLowerCase();
      if (lower.includes("nirf") || lower.includes("mhrd") || lower.includes("dcs")) {
        section = "NIRF";
      } else if (lower.includes("aicte") || lower.includes("eoa") || lower.includes("approval") || lower.includes("grievance")) {
        section = "AICTE";
      } else {
        section = "Institutional";
      }
    }
    return { ...doc, section };
  });

  const filteredDocs = normalizedDocs.filter((doc: any) => {
    const matchesTab = activeTab === "All" || doc.section === activeTab;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (doc.title && doc.title.toLowerCase().includes(query)) ||
      (doc.size && doc.size.toLowerCase().includes(query)) ||
      (doc.date && doc.date.toLowerCase().includes(query));
    return matchesTab && matchesSearch;
  });

  const countAll = normalizedDocs.length;
  const countInstitutional = normalizedDocs.filter((d: any) => d.section === "Institutional").length;
  const countAICTE = normalizedDocs.filter((d: any) => d.section === "AICTE").length;
  const countNIRF = normalizedDocs.filter((d: any) => d.section === "NIRF").length;

  return (
    <>
      {isEditMode && <AdminModeBanner label="Norms & Recognition Editor Active" />}

      <PageHero
        eyebrow="Compliance & Accreditation"
        title={editTexts.heroTitle}
        subtitle={editTexts.heroSubtitle}
        image={heroImg}
      />

      {isEditMode && (
        <section className="container-narrow py-6">
          <AdminPanel>
            <AdminPanelHeader title="Edit Hero Headers">
              <AdminSaveButton onClick={() => handleSaveSection("hero")} label="Save Hero" />
            </AdminPanelHeader>
            <div className="space-y-4">
              <AdminField label="Hero Title">
                <AdminInput
                  value={editTexts.heroTitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroTitle: e.target.value })}
                />
              </AdminField>
              <AdminField label="Hero Subtitle">
                <AdminTextarea
                  value={editTexts.heroSubtitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroSubtitle: e.target.value })}
                  rows={2}
                />
              </AdminField>
            </div>
          </AdminPanel>
        </section>
      )}

      <section className="py-20 md:py-28 container-narrow">
        <RevealOnScroll>
          {isEditMode ? (
            <div className="mb-8 max-w-4xl mx-auto">
              <AdminPanel>
                <AdminPanelHeader title="Edit Recognition Description">
                  <AdminSaveButton onClick={() => handleSaveSection("rec")} label="Save Section" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="Section Title">
                    <AdminInput
                      value={editTexts.recTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, recTitle: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Section Subtitle">
                    <AdminTextarea
                      value={editTexts.recSubtitle}
                      onChange={(e) => setEditTexts({ ...editTexts, recSubtitle: e.target.value })}
                      rows={3}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <SectionLabel
                eyebrow="Accreditation & Approvals"
                title={editTexts.recTitle}
                subtitle={editTexts.recSubtitle}
              />
            </div>
          )}
        </RevealOnScroll>

        {isEditMode && (
          <div className="mb-10 bg-slate-50 border border-slate-200 rounded-[32px] p-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add Compliance Document
            </h3>
            <form onSubmit={handleAddDocument} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AICTE EOA 2024-25"
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Sub-category / Label
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AICTE EOA, NIRF Report, Recognition"
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Brief Description
                </label>
                <input
                  type="text"
                  placeholder="Official certificate or annual report for..."
                  className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                  value={newDoc.desc}
                  onChange={(e) => setNewDoc({ ...newDoc, desc: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  PDF Download URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="/local-assets/uploads/..."
                  className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                  value={newDoc.link}
                  onChange={(e) => setNewDoc({ ...newDoc, link: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-xs uppercase tracking-widest font-bold">
                Publish Document
              </button>
            </form>
          </div>
        )}

        {/* ── Category Filter Tabs & Search Bar ────────────────────────────── */}
        <div className="mt-12 max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("All")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "All"
                    ? "bg-white text-ink shadow-sm font-extrabold"
                    : "text-slate-600 hover:text-ink hover:bg-white/60"
                }`}
              >
                All Norms ({countAll})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("Institutional")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "Institutional"
                    ? "bg-white text-ink shadow-sm font-extrabold"
                    : "text-slate-600 hover:text-ink hover:bg-white/60"
                }`}
              >
                UGC & Statutory ({countInstitutional})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("AICTE")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "AICTE"
                    ? "bg-white text-ink shadow-sm font-extrabold"
                    : "text-slate-600 hover:text-ink hover:bg-white/60"
                }`}
              >
                AICTE Approvals ({countAICTE})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("NIRF")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "NIRF"
                    ? "bg-white text-ink shadow-sm font-extrabold"
                    : "text-slate-600 hover:text-ink hover:bg-white/60"
                }`}
              >
                NIRF Rankings ({countNIRF})
              </button>
            </div>

            {/* Real-time Document Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Document List ─────────────────────────────────────────────────── */}
        {filteredDocs.length === 0 ? (
          <div className="mt-12 max-w-4xl mx-auto p-12 text-center bg-slate-50 border border-slate-200 rounded-[32px]">
            <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-ink mb-1">No documents found</h4>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search query or switching to another category.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 max-w-4xl mx-auto">
            {filteredDocs.map((doc: any, i: number) => {
              const Icon = getDocIcon(doc.date, doc.title);
              return (
                <RevealOnScroll key={doc.id} delay={Math.min(i * 40, 300)}>
                  <div className="group relative flex flex-col md:flex-row items-center gap-6 p-7 rounded-[28px] bg-white border border-border hover:border-primary/20 hover:shadow-elegant transition-all duration-200">
                    <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
                      <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                        <Icon className="h-7 w-7" />
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                          <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/5">
                            {doc.date}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                            • {doc.section}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-ink mb-1.5 group-hover:text-primary transition-colors">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{doc.size}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => previewFile(doc.link, doc.title)}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer"
                          title="Preview Document Online"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </button>
                        <button
                          onClick={() => downloadFile(doc.link, `${doc.title}.pdf`, doc.title)}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 shadow transition-all cursor-pointer"
                          title="Download Document to Device"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </button>
                      </div>
                    </div>

                    {isEditMode && doc.id > 0 && (
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2.5 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition ml-3 shrink-0 cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <ExternalLink className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        )}

        {/* ── UGC Details Strip ────────────────────────────────────────────── */}
        <RevealOnScroll delay={200} className="mt-20">
          {isEditMode ? (
            <div className="max-w-4xl mx-auto">
              <AdminPanel>
                <AdminPanelHeader title="Edit UGC Strip Content">
                  <AdminSaveButton onClick={() => handleSaveSection("ugc")} label="Save Strip" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="UGC Strip Title">
                    <AdminInput
                      value={editTexts.ugcTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, ugcTitle: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="UGC Strip Body Description">
                    <AdminTextarea
                      value={editTexts.ugcDesc}
                      onChange={(e) => setEditTexts({ ...editTexts, ugcDesc: e.target.value })}
                      rows={4}
                    />
                  </AdminField>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <AdminField label="Stat 1 Value">
                        <AdminInput
                          value={editTexts.ugcStat1}
                          onChange={(e) => setEditTexts({ ...editTexts, ugcStat1: e.target.value })}
                        />
                      </AdminField>
                      <AdminField label="Stat 1 Label">
                        <AdminInput
                          value={editTexts.ugcStat1Label}
                          onChange={(e) => setEditTexts({ ...editTexts, ugcStat1Label: e.target.value })}
                        />
                      </AdminField>
                    </div>
                    <div>
                      <AdminField label="Stat 2 Value">
                        <AdminInput
                          value={editTexts.ugcStat2}
                          onChange={(e) => setEditTexts({ ...editTexts, ugcStat2: e.target.value })}
                        />
                      </AdminField>
                      <AdminField label="Stat 2 Label">
                        <AdminInput
                          value={editTexts.ugcStat2Label}
                          onChange={(e) => setEditTexts({ ...editTexts, ugcStat2Label: e.target.value })}
                        />
                      </AdminField>
                    </div>
                  </div>
                </div>
              </AdminPanel>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto rounded-[40px] bg-slate-900 p-10 md:p-14 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight">{editTexts.ugcTitle}</h2>
                  <p className="mt-5 text-white/60 leading-relaxed text-sm md:text-base">{editTexts.ugcDesc}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-primary-glow">{editTexts.ugcStat1}</div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mt-2">
                      {editTexts.ugcStat1Label}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-primary-glow">{editTexts.ugcStat2}</div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mt-2">
                      {editTexts.ugcStat2Label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </RevealOnScroll>
      </section>
    </>
  );
}
