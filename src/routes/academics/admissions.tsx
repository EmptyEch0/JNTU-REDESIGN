import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { VerticalSubNav } from "@/components/VerticalSubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { imageUrl } from "@/lib/assets";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { 
  Users, 
  Download, 
  CheckCircle2, 
  IndianRupee, 
  FileText, 
  ChevronRight, 
  Save, 
  Trash2, 
  Plus, 
  Edit2, 
  X, 
  GraduationCap, 
  ArrowRight, 
  Building2, 
  HelpCircle,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicsAdmissions, 
  getAcademicsBrochures,
  upsertAcademicsAdmission,
  deleteAcademicsAdmission,
  upsertAcademicsBrochure,
  deleteAcademicsBrochure,
  getAcademicFeeStructures,
  upsertAcademicFeeStructure,
  deleteAcademicFeeStructure
} from "@/lib/academics";
import { getAssetUrl } from "@/lib/assets";

export const Route = createFileRoute("/academics/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions & Fee Structure — JNTU-GV CEV" },
      {
        name: "description",
        content: "Undergraduate and Postgraduate Admission Procedure, eligibility rank lists, and complete Fee Structure breakdowns at JNTU-GV CEV.",
      },
    ],
  }),
  component: AdmissionsPage,
});

const RANK_LINKS = [
  { title: "JNTU-GV Vizianagaram 2024-25 Ranks (EAMCET/ECET/PGCET/ICET)", url: "https://dhondi.jntugvcev.edu.in/" },
  { title: "JNTUK Vizianagaram 2020-21 Ranks (EAMCET)", url: "https://dhondi.jntugvcev.edu.in/" },
  { title: "JNTUK Vizianagaram 2019-20 Ranks (EAMCET)", url: "https://dhondi.jntugvcev.edu.in/" },
  { title: "JNTUK Vizianagaram 2019-20 Ranks (ECET)", url: "https://dhondi.jntugvcev.edu.in/" },
];

const EAMCET_RANKS = [
  { branch: "Computer Science & Engineering (CSE)", category: "OC-General", open: 1240, close: 3450 },
  { branch: "Computer Science & Engineering (CSE)", category: "BC-A", open: 2150, close: 5120 },
  { branch: "Computer Science & Engineering (CSE)", category: "SC", open: 6500, close: 12400 },
  { branch: "Computer Science & Engineering (CSE)", category: "ST", open: 8200, close: 18500 },
  { branch: "Electronics & Communication (ECE)", category: "OC-General", open: 3800, close: 6800 },
  { branch: "Electronics & Communication (ECE)", category: "BC-A", open: 5400, close: 9200 },
  { branch: "Electrical & Electronics (EEE)", category: "OC-General", open: 7200, close: 12500 },
  { branch: "Information Technology (IT)", category: "OC-General", open: 4200, close: 7100 },
];

const ECET_RANKS = [
  { branch: "Computer Science & Engineering (CSE)", category: "OC-General", open: 45, close: 120 },
  { branch: "Electronics & Communication (ECE)", category: "OC-General", open: 90, close: 240 },
  { branch: "Electrical & Electronics (EEE)", category: "OC-General", open: 110, close: 350 },
];

const PGECET_RANKS = [
  { branch: "M.Tech (Computer Science & Engineering)", category: "GATE Qualified", open: "Eligible", close: "Merit basis" },
  { branch: "M.Tech (Power Electronics)", category: "PGECET", open: 120, close: 850 },
  { branch: "M.Tech (Systems & Control)", category: "PGECET", open: 250, close: 1100 },
];

const PROGRAM_FEES = {
  "B.Tech": { tuition: "₹10,000 / Semester", special: "₹1,850 / Year", caution: "₹500 (One-time)", exam: "₹1,200 / Semester" },
  "M.Tech": { tuition: "₹15,000 / Semester", special: "₹2,200 / Year", caution: "₹1,000 (One-time)", exam: "₹1,500 / Semester" },
  "MCA": { tuition: "₹12,500 / Semester", special: "₹2,000 / Year", caution: "₹500 (One-time)", exam: "₹1,200 / Semester" },
  "B.Pharm": { tuition: "₹11,000 / Semester", special: "₹1,850 / Year", caution: "₹500 (One-time)", exam: "₹1,200 / Semester" },
};

function AdmissionsPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"B.Tech" | "M.Tech" | "PhD">("B.Tech");
  
  // Section toggle state: Admissions vs Fee Structure
  const [activeSection, setActiveSection] = useState<"admissions" | "fees">("admissions");
  
  // Horizontally swappable program level sub-tabs for Fee Structure
  const [feeProgramTab, setFeeProgramTab] = useState<"B.Tech" | "M.Tech" | "MCA" | "B.Pharm">("B.Tech");
  
  // Accordion toggle states
  const [sbiOpen, setSbiOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);

  // Query database-backed admissions, brochures, and fee structures
  const { data: admissions = [] } = useQuery({
    queryKey: ["academics-admissions"],
    queryFn: getAcademicsAdmissions,
  });

  const { data: brochures = [] } = useQuery({
    queryKey: ["academics-brochures"],
    queryFn: getAcademicsBrochures,
  });

  const { data: feeStructures = [] } = useQuery({
    queryKey: ["academic-fee-structures"],
    queryFn: getAcademicFeeStructures,
  });

  // Find active admissions data
  const currentAdmissions = admissions.find((a) => a.program === activeTab);

  // States for Editing Admissions
  const [editAdmissionId, setEditAdmissionId] = useState<number | null>(null);
  const [editProgram, setEditProgram] = useState("");
  const [editProcedure, setEditProcedure] = useState("");
  const [editTuitionFee, setEditTuitionFee] = useState("");
  const [editHostelFee, setEditHostelFee] = useState("");

  // States for Editing Brochures
  const [editBrochureId, setEditBrochureId] = useState<number | null>(null);
  const [brochureTitle, setBrochureTitle] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [brochureType, setBrochureType] = useState("B.Tech");

  // States for Editing Fee Structures
  const [editFeeId, setEditFeeId] = useState<number | null>(null);
  const [feeTitle, setFeeTitle] = useState("");
  const [feeUrl, setFeeUrl] = useState("");
  const [feeLevel, setFeeLevel] = useState("UG");
  const [feeProgramName, setFeeProgramName] = useState("B.Tech");

  // Mutations
  const saveAdmissionMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsAdmission({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-admissions"] });
      setEditAdmissionId(null);
      toast.success("Admission guidelines updated successfully!");
    },
  });

  const deleteAdmissionMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsAdmission({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-admissions"] });
      toast.success("Admission program deleted successfully!");
    },
  });

  const saveBrochureMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsBrochure({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-brochures"] });
      setEditBrochureId(null);
      setBrochureTitle("");
      setBrochureUrl("");
      toast.success("Admission brochure updated successfully!");
    },
  });

  const deleteBrochureMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsBrochure({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-brochures"] });
      toast.success("Brochure deleted successfully!");
    },
  });

  const saveFeeMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicFeeStructure({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-fee-structures"] });
      setEditFeeId(null);
      setFeeTitle("");
      setFeeUrl("");
      toast.success("Fee structure updated successfully!");
    },
  });

  const deleteFeeMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicFeeStructure({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-fee-structures"] });
      toast.success("Fee structure deleted successfully!");
    },
  });

  const startEditAdmission = (adm: any) => {
    setEditAdmissionId(adm.id);
    setEditProgram(adm.program);
    setEditProcedure(adm.procedure);
    setEditTuitionFee(adm.tuition_fee);
    setEditHostelFee(adm.hostel_fee);
  };

  return (
    <div className="space-y-12 pb-24">
      <PageHero
        eyebrow="Academics"
        title="Admissions & Fee Structure"
        subtitle="Transparent admission procedures, eligibility rank tables, and step-by-step tuition and payment guides."
        image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070"
      />
      <div className="container-narrow py-12 flex flex-col md:flex-row gap-8 items-start">
        <VerticalSubNav items={ACADEMICS_SUBNAV} />
        <div className="flex-1 min-w-0 space-y-8">

      {/* Premium Navigation Segment Slider */}
      <div className="flex items-center justify-center p-1.5 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl w-full max-w-md mx-auto shadow-sm border border-slate-200/20">
        <button
          onClick={() => setActiveSection("admissions")}
          className={`flex-1 py-3 px-6 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all duration-300 ${
            activeSection === "admissions"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md shadow-blue-500/5"
              : "text-slate-500 hover:text-blue-600"
          }`}
        >
          Admissions Info
        </button>
        <button
          onClick={() => setActiveSection("fees")}
          className={`flex-1 py-3 px-6 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all duration-300 ${
            activeSection === "fees"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md shadow-blue-500/5"
              : "text-slate-500 hover:text-blue-600"
          }`}
        >
          Fees & Payments
        </button>
      </div>

      {/* Admin Mode Header */}
      {isEditMode && (
        <GlassCard className="p-4 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-slate-900 shadow-md">
          <p className="text-amber-800 text-xs font-semibold">
            <strong>Admin Edit Mode:</strong> Manage dynamic procedures, brochure downloads, and official fee structures.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setEditAdmissionId(-1);
                setEditProgram("New Program");
                setEditProcedure("");
                setEditTuitionFee("₹0 / yr");
                setEditHostelFee("₹0 / yr");
              }}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-900/20"
            >
              <Plus size={12} /> Add Program
            </button>
            <button 
              onClick={() => {
                setEditFeeId(-1);
                setFeeTitle("");
                setFeeUrl("");
                setFeeLevel("UG");
                setFeeProgramName("B.Tech");
              }}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-900/20"
            >
              <Plus size={12} /> Add Fee PDF
            </button>
          </div>
        </GlassCard>
      )}

      {/* Main Editing Admission Program Form */}
      {isEditMode && editAdmissionId !== null && (
        <GlassCard className="p-6 border-2 border-amber-300 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-2">
            <span>{editAdmissionId === -1 ? "Add New Admission Program" : "Edit Admission & Fee Program"}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Program Name</label>
              <input 
                type="text" 
                value={editProgram} 
                onChange={(e) => setEditProgram(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Tuition Fee Structure</label>
              <input 
                type="text" 
                value={editTuitionFee} 
                onChange={(e) => setEditTuitionFee(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Hostel Fee Structure</label>
              <input 
                type="text" 
                value={editHostelFee} 
                onChange={(e) => setEditHostelFee(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 block mb-1">Admission Guidelines / Procedures</label>
              <textarea 
                rows={4}
                value={editProcedure} 
                onChange={(e) => setEditProcedure(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setEditAdmissionId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-350 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => saveAdmissionMutation.mutate({
                id: editAdmissionId === -1 ? undefined : editAdmissionId,
                program: editProgram,
                procedure: editProcedure,
                tuition_fee: editTuitionFee,
                hostel_fee: editHostelFee
              })}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </GlassCard>
      )}

      {/* Main Editing Fee Structure PDF Form */}
      {isEditMode && editFeeId !== null && (
        <GlassCard className="p-6 border-2 border-amber-300 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-2">
            <span>{editFeeId === -1 ? "Add Fee Structure PDF Record" : "Edit Fee Structure PDF Record"}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Document Title</label>
              <input 
                type="text" 
                value={feeTitle} 
                onChange={(e) => setFeeTitle(e.target.value)} 
                placeholder="e.g. B.Tech Fee Structure 2025-26"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Document PDF URL</label>
              <input 
                type="text" 
                value={feeUrl} 
                onChange={(e) => setFeeUrl(e.target.value)} 
                placeholder="https://example.com/file.pdf"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Category / Level</label>
              <select
                value={feeLevel}
                onChange={(e) => setFeeLevel(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="PhD">Research (PhD)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Program / Course Name</label>
              <input 
                type="text" 
                value={feeProgramName} 
                onChange={(e) => setFeeProgramName(e.target.value)} 
                placeholder="B.Tech, M.Tech, MBA, MCA, PhD"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setEditFeeId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-350 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => saveFeeMutation.mutate({
                id: editFeeId === -1 ? undefined : editFeeId,
                title: feeTitle,
                pdf_url: feeUrl,
                level: feeLevel,
                program_name: feeProgramName
              })}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow"
            >
              <Save size={14} /> Save Fee Document
            </button>
          </div>
        </GlassCard>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* ADMISSIONS SECTION                                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeSection === "admissions" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Row: Dynamic Guidelines Selector & brochures */}
          <div>
            
            {/* Detailed Guidelines for Active Tab */}
            <div className="space-y-6">
              <GlassCard className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {activeTab} Admission Requirements
                    </h3>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed mb-6">
                    {currentAdmissions?.procedure || "Select a program on the left to review its dynamic entrance procedures."}
                  </p>
                  
                  {activeTab === "B.Tech" && (
                    <div className="space-y-4 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">EAMCET Admissions</h4>
                      <p className="text-slate-600 leading-relaxed">
                        Admission is strictly based on the merit rank obtained in the **Andhra Pradesh EAPCET (Engineering, Agriculture and Pharmacy Common Entrance Test)** conducted by APSCHE. Ranks are allocated according to category boundaries under state government seat quota allocations.
                      </p>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">Lateral Entry ECET Admissions</h4>
                      <p className="text-slate-600 leading-relaxed">
                        Diploma holders seeking direct admission into the second year (3rd semester) must qualify in the **AP ECET** entrance evaluation.
                      </p>
                    </div>
                  )}

                  {activeTab === "M.Tech" && (
                    <div className="space-y-4 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">GATE / PGECET Rankings</h4>
                      <p className="text-slate-600 leading-relaxed">
                        M.Tech programs prioritize candidates with a valid national-level **GATE scorecard**. Remaining vacant seats are filled through state-level **AP PGECET counseling** strictly based on merit scores.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/35 rounded-2xl flex gap-3 text-xs text-slate-650">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-extrabold text-blue-700">Verification Requirement:</span> Keep clear scans of rank scorecards, provisional allotment orders, transfer credentials, and reservation documents ready for upload.
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Undergraduate EAMCET / ECET Rank Download Links */}
          <GlassCard className="p-6">
            <div className="mb-6">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Undergraduate Entrance Rank Matrices</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Download verified branch-wise cut-off rankings published by the college administration.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RANK_LINKS.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-900/30 hover:bg-blue-50/50 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all group font-sans"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Download className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate pr-2">{link.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>
          </GlassCard>

          {/* EAMCET, ECET, PGECET Opening & Closing Ranks Tables */}
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-blue-600"></span>
              Category-Wise Opening & Closing Ranks (Reference Matrices)
            </h3>

            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* EAMCET Table */}
              <GlassCard className="p-5 overflow-hidden flex flex-col h-full">
                <div className="mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">AP EAPCET</span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">B.Tech Regular Admissions</h4>
                </div>
                <div className="overflow-x-auto w-full flex-1">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                        <th className="py-2.5 px-3 rounded-l-lg">Branch</th>
                        <th className="py-2.5 px-2">Cat</th>
                        <th className="py-2.5 px-2">Open</th>
                        <th className="py-2.5 px-3 rounded-r-lg">Close</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {EAMCET_RANKS.slice(0, 6).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-650 truncate max-w-[120px]" title={r.branch}>
                            {r.branch.split(" ")[0]} ({r.branch.includes("CSE") ? "CSE" : r.branch.includes("ECE") ? "ECE" : "EEE"})
                          </td>
                          <td className="py-2.5 px-2 font-bold text-slate-500">{r.category}</td>
                          <td className="py-2.5 px-2 text-slate-600 font-mono">{r.open}</td>
                          <td className="py-2.5 px-3 text-slate-900 dark:text-white font-extrabold font-mono">{r.close}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

              {/* ECET Table */}
              <GlassCard className="p-5 overflow-hidden flex flex-col h-full">
                <div className="mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">AP ECET</span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">B.Tech Lateral Entry</h4>
                </div>
                <div className="overflow-x-auto w-full flex-1">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                        <th className="py-2.5 px-3 rounded-l-lg">Branch</th>
                        <th className="py-2.5 px-2">Cat</th>
                        <th className="py-2.5 px-2">Open</th>
                        <th className="py-2.5 px-3 rounded-r-lg">Close</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {ECET_RANKS.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-semibold text-slate-650 truncate max-w-[120px]" title={r.branch}>
                            {r.branch.split(" ")[0]} ({r.branch.includes("CSE") ? "CSE" : r.branch.includes("ECE") ? "ECE" : "EEE"})
                          </td>
                          <td className="py-3 px-2 font-bold text-slate-500">{r.category}</td>
                          <td className="py-3 px-2 text-slate-600 font-mono">{r.open}</td>
                          <td className="py-3 px-3 text-slate-900 dark:text-white font-extrabold font-mono">{r.close}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

              {/* PGECET Table */}
              <GlassCard className="p-5 overflow-hidden flex flex-col h-full">
                <div className="mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">AP PGECET</span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">Postgraduate M.Tech</h4>
                </div>
                <div className="overflow-x-auto w-full flex-1">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                        <th className="py-2.5 px-3 rounded-l-lg">Branch</th>
                        <th className="py-2.5 px-2">Basis</th>
                        <th className="py-2.5 px-2">Open</th>
                        <th className="py-2.5 px-3 rounded-r-lg">Close</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {PGECET_RANKS.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-semibold text-slate-650 truncate max-w-[120px]" title={r.branch}>
                            {r.branch.includes("Computer") ? "CSE" : r.branch.includes("Power") ? "Power Elec" : "Systems"}
                          </td>
                          <td className="py-3 px-2 font-bold text-slate-500">{r.category}</td>
                          <td className="py-3 px-2 text-slate-600 font-mono">{r.open}</td>
                          <td className="py-3 px-3 text-slate-900 dark:text-white font-extrabold font-mono">{r.close}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* FEE STRUCTURE SECTION                                                  */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeSection === "fees" && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Sub-tabs for B.Tech, M.Tech, MCA, B.Pharm */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-blue-600"></span>
                Structured Course Fee Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Select a curriculum category to preview specific charges.</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
              {(["B.Tech", "M.Tech", "MCA", "B.Pharm"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFeeProgramTab(tab)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    feeProgramTab === tab 
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm" 
                      : "text-slate-500 hover:text-blue-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Tuition Matrix Column */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <IndianRupee className="w-5 h-5 text-blue-600" />
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Annual Tuition Matrix ({feeProgramTab})</h4>
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">Govt Fixed</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <th className="py-3 px-2 font-bold text-[10px] uppercase">Charge Category</th>
                        <th className="py-3 px-2 font-bold text-[10px] uppercase text-right">Fee Rate</th>
                        <th className="py-3 px-2 font-bold text-[10px] uppercase text-right">Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="py-3 px-2 font-bold text-slate-700 dark:text-slate-350">Tuition Fee</td>
                        <td className="py-3 px-2 text-right font-extrabold text-slate-900 dark:text-white font-mono">{PROGRAM_FEES[feeProgramTab].tuition}</td>
                        <td className="py-3 px-2 text-right text-slate-500">Per Semester</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-bold text-slate-700 dark:text-slate-350">Special Fee (AP State Counsel)</td>
                        <td className="py-3 px-2 text-right font-extrabold text-slate-900 dark:text-white font-mono">{PROGRAM_FEES[feeProgramTab].special}</td>
                        <td className="py-3 px-2 text-right text-slate-500">Annual</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-bold text-slate-700 dark:text-slate-350">Caution Deposit (Refundable)</td>
                        <td className="py-3 px-2 text-right font-extrabold text-slate-900 dark:text-white font-mono">{PROGRAM_FEES[feeProgramTab].caution}</td>
                        <td className="py-3 px-2 text-right text-slate-500">One-time</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-bold text-slate-700 dark:text-slate-350">Examination & Evaluation Fee</td>
                        <td className="py-3 px-2 text-right font-extrabold text-slate-900 dark:text-white font-mono">{PROGRAM_FEES[feeProgramTab].exam}</td>
                        <td className="py-3 px-2 text-right text-slate-500">Per Semester</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </GlassCard>

              {/* Dynamic DB Fee structures */}
              <GlassCard className="p-6">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Official Dynamic Fee Structure Circulars
                </h4>
                <p className="text-[11px] text-slate-450 mb-4 leading-relaxed">
                  Refer directly to administrative orders and audited fee lists stored dynamically in our college archives.
                </p>

                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100/60 border-b border-slate-200 dark:bg-slate-900/40 dark:border-slate-800">
                        <th className="px-4 py-2.5 font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">Level</th>
                        <th className="px-4 py-2.5 font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">Program</th>
                        <th className="px-4 py-2.5 font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">Document Title</th>
                        <th className="px-4 py-2.5 font-extrabold text-[10px] text-slate-400 uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {feeStructures.map((fee) => (
                        <tr key={fee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25">
                          <td className="px-4 py-3 font-semibold text-slate-500">{fee.level}</td>
                          <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-350">{fee.program_name}</td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{fee.title}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => window.open(getAssetUrl(fee.pdf_url), "_blank")}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-red-950/20 rounded"
                                title="Download Official Fee Structure PDF"
                              >
                                <Download size={14} />
                              </button>
                              {isEditMode && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditFeeId(fee.id);
                                      setFeeTitle(fee.title);
                                      setFeeUrl(fee.pdf_url);
                                      setFeeLevel(fee.level);
                                      setFeeProgramName(fee.program_name);
                                    }}
                                    className="p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    onClick={() => { if(confirm("Delete fee structure record?")) deleteFeeMutation.mutate(fee.id); }}
                                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {feeStructures.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                            No official fee structure documents found in the database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>

            {/* Account Details Column */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-blue-600"></span>
                Official Payment Accounts
              </h3>

              <GlassCard className="p-6 relative overflow-hidden border-t-4 border-t-blue-600">
                <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Bank details
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">State Bank of India (SBI)</h4>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Account Name</span>
                    <span className="font-bold text-slate-900 dark:text-white">PRINCIPAL JNTUGV CEV</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Account Number</span>
                    <span className="font-extrabold text-slate-900 dark:text-white tracking-wider font-mono text-sm">30932145892</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">IFSC Code</span>
                    <span className="font-extrabold text-slate-900 dark:text-white tracking-wider font-mono text-sm">SBIN0002130</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Branch Code</span>
                    <span className="font-bold text-slate-900 dark:text-white">JNTU Campus Vizianagaram</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3 text-xs text-slate-650">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-blue-700">Need Payment Proof?</span> Students must submit their original SBI online challan receipt or banker draft counterfoil directly to the **College Accounts Branch** to generate official fee receipts.
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Interactive Payments Accordions */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-blue-600"></span>
              Interactive Payment Procedures
            </h3>

            {/* SBI Collect Accordion */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm bg-white/70">
              <button 
                onClick={() => setSbiOpen(!sbiOpen)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">SBI Collect Online Payment Procedure</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Detailed step-by-step procedure to pay college fees online using State Bank Collect portal.</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${sbiOpen ? "rotate-90" : ""}`} />
              </button>
              
              <AnimatePresence>
                {sbiOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-slate-100 dark:border-slate-850"
                  >
                    <div className="p-6 space-y-4 text-xs text-slate-650 leading-relaxed font-sans">
                      <div className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                        <p>Go to the official **State Bank Collect** website: `https://www.onlinesbi.sbi/sbicollect/`</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                        <p>Select **Educational Institutions** from the category list and search for **"PRINCIPAL JNTUGV CEV"**.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                        <p>Choose your specific **Payment Category** from the dropdown menu (e.g. *B.Tech Tuition Fee*, *M.Tech Special Fee*, etc.).</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                        <p>Enter your **Roll Number, Name, Branch, and Academic Year** correctly to fetch your record parameters.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">5</span>
                        <p>Complete the payment using **Net Banking, Debit/Credit Cards, or UPI**, then save the printable transaction receipt.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Demand Draft Accordion */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm bg-white/70">
              <button 
                onClick={() => setDdOpen(!ddOpen)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Demand Draft (DD) Payment Method (Offline)</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Instructions and drawing details for bank cheques and offline draft clearances.</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${ddOpen ? "rotate-90" : ""}`} />
              </button>
              
              <AnimatePresence>
                {ddOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-slate-100 dark:border-slate-850"
                  >
                    <div className="p-6 space-y-4 text-xs text-slate-650 leading-relaxed font-sans">
                      <div className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                        <p>Visit any nationalized bank and request a **Demand Draft (DD)** transaction application.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                        <p>Draw the Demand Draft strictly in favor of: **"THE PRINCIPAL, JNTUGV CEV, VIZIANAGARAM"**.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                        <p>Ensure the DD is **Payable at Vizianagaram** (preferably State Bank of India, JNTU Campus Branch Code 002130).</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                        <p>Write your **Full Name, Roll Number, Branch, and Mobile Number** on the reverse side of the physical Demand Draft before submission.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      )}
        </div>
      </div>
    </div>
  );
}
