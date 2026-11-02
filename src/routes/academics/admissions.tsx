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
  CreditCard,
  Eye,
  Share2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Clock,
  ShieldCheck,
  FileCheck,
  Award
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
  deleteAcademicFeeStructure,
  DEFAULT_ACADEMIC_FEE_STRUCTURES
} from "@/lib/academics";
import { getAssetUrl } from "@/lib/assets";
import { downloadFile, previewFile, shareFile } from "@/lib/download";

export const Route = createFileRoute("/academics/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions & Fee Structure — JNTU-GV CEV" },
      {
        name: "description",
        content: "Official Course Fee Structures, Examination Fees, State Bank Collect payment guides, and Admission Procedures at JNTU-GV CEV.",
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

// Official University Fee Orders & Circulars Data
const OFFICIAL_FEE_ORDERS = [
  {
    id: "fee-order-2025-26",
    title: "Course Fee Structure Order 2025–26 (UG & PG)",
    orderNo: "Proc. No. 99/E1/JNTUGV/CEV & CPS/Fee Structure/2025-2026",
    date: "July 1, 2026",
    authority: "Registrar, JNTU-GV",
    description:
      "Official approved annual fee schedule for B.Tech (Regular), M.Tech (Self-Finance), MCA, MBA, and B.Pharmacy covering Tuition, Special, and Examination Fees by branch and year.",
    pdfUrl: "/documents/fees/JNTUGV_Course_Fee_Structure_2025-26_Order_2026-07-01.pdf",
    filename: "JNTUGV_Course_Fee_Structure_2025-26_Order_2026-07-01.pdf",
    badge: "Course Fee Schedule 2025–26",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    level: "UG & PG",
  },
  {
    id: "ug-tuition-revision-2025",
    title: "UG Engineering Tuition Fee Revision Order",
    orderNo: "Univ. Order No. JNTUGV/EC(Spl)/Fee/2025",
    date: "July 11, 2025",
    authority: "Registrar, JNTU-GV",
    description:
      "Special Executive Council resolution enhancing annual tuition fee for UG Engineering programmes from ₹10,000/- to ₹45,000/- effective from Academic Year 2025–26 onward.",
    pdfUrl: "/documents/fees/JNTUGV_UG_Engineering_Tuition_Fee_Revision_Order_2025-26.pdf",
    filename: "JNTUGV_UG_Engineering_Tuition_Fee_Revision_Order_2025-26.pdf",
    badge: "Tuition Revision Order",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    level: "UG B.Tech",
  },
  {
    id: "exam-fee-revision-2026",
    title: "Revised Examination Fee Structure 2026",
    orderNo: "Procs. No. 92/E1/JNTU-GV/USE/Revision of Examinations Fee Structure/2026",
    date: "June 12, 2026 (Effective 01.06.2026)",
    authority: "Registrar, JNTU-GV",
    description:
      "Revised fee schedule for Regular & Supplementary Examinations across B.Tech, M.Tech, MCA, MBA, B.Pharm, Pharm.D, Project Viva-Voce (₹5,000), and Pre-PhD papers.",
    pdfUrl: "/documents/fees/JNTUGV_UG_PG_Examination_Fee_Revision_Order_2026-06-12.pdf",
    filename: "JNTUGV_UG_PG_Examination_Fee_Revision_Order_2026-06-12.pdf",
    badge: "Exam Fee Revision",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    level: "All UG/PG/Ph.D",
  },
  {
    id: "pg-fee-circular-2024-25",
    title: "M.Tech, MCA & MBA Fee Payment Circular",
    orderNo: "Cir. No. A2/ I M.Tech, I MCA & I MBA/2024-25",
    date: "November 29, 2024",
    authority: "Principal, JNTUGV CEV",
    description:
      "Guidelines for I Year regular M.Tech, MCA, and MBA students for online fee remittance via SBI Collect, specifying Tuition Fee Account vs Special Fee Account routes and late penalty slabs.",
    pdfUrl: "/documents/fees/JNTUGV_MTech_MCA_MBA_Fee_Circular_2024-25.pdf",
    filename: "JNTUGV_MTech_MCA_MBA_Fee_Circular_2024-25.pdf",
    badge: "SBI Collect Circular",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    level: "PG Courses",
  },
];

// Structured Course Fee Schedules by Programme
interface CourseFeeRow {
  year: string;
  branches: string;
  status: "Regular" | "Self-Finance";
  tuition: number;
  special: number;
  exam: number;
  total: number;
  notes?: string;
}

const OFFICIAL_COURSE_FEES: Record<string, {
  title: string;
  orderRef: string;
  orderDate: string;
  degree: string;
  schedule: CourseFeeRow[];
  notes: string[];
}> = {
  "B.Tech": {
    title: "Bachelor of Technology (B.Tech Regular)",
    orderRef: "Proc. No. 99/E1/JNTUGV/CEV & CPS/Fee Structure/2025-2026 & Univ. Order No. JNTUGV/EC(Spl)/Fee/2025",
    orderDate: "01.07.2026 & 11.07.2025",
    degree: "Undergraduate (UG)",
    schedule: [
      {
        year: "Year I",
        branches: "Civil, EEE, ME, ECE, CSE, IT, Metallurgy",
        status: "Regular",
        tuition: 45000,
        special: 5000,
        exam: 770,
        total: 50770,
        notes: "Enhanced from ₹10,000 to ₹45,000 p.a. vide Special EC Meeting Order dt. 11.07.2025 effective from AY 2025–26 onward.",
      },
      {
        year: "Year II",
        branches: "Civil, EEE, ME, ECE, CSE, IT, Metallurgy",
        status: "Regular",
        tuition: 10000,
        special: 300,
        exam: 770,
        total: 11070,
        notes: "Batches admitted prior to 2025–26 continue at ₹10,000 annual tuition.",
      },
      {
        year: "Year III",
        branches: "Civil, EEE, ME, ECE, CSE, IT, Metallurgy",
        status: "Regular",
        tuition: 10000,
        special: 300,
        exam: 770,
        total: 11070,
        notes: "Regular state quota fee structure.",
      },
      {
        year: "Year IV",
        branches: "Civil, EEE, ME, ECE, CSE, IT, Metallurgy",
        status: "Regular",
        tuition: 10000,
        special: 300,
        exam: 770,
        total: 11070,
        notes: "Final year regular tuition + annual special and exam fees.",
      },
    ],
    notes: [
      "Annual tuition fee for UG Engineering has been revised from ₹10,000 to ₹45,000 per annum for fresh admissions starting from Academic Year 2025–26 onward pursuant to the Special Executive Council resolution.",
      "Eligible students admitted under government convenor quota receive fee reimbursement under the Andhra Pradesh Jagananna Vidya Deevena (JVD) scheme.",
      "Examination fee of ₹770 is applicable per semester/annual examination as approved in the university schedule.",
    ],
  },
  "M.Tech": {
    title: "Master of Technology (M.Tech Self-Finance)",
    orderRef: "Proc. No. 99/E1/JNTUGV/CEV & CPS/Fee Structure/2025-2026 & Cir. No. A2/ I M.Tech/2024-25",
    orderDate: "01.07.2026 & 29.11.2024",
    degree: "Postgraduate (PG)",
    schedule: [
      {
        year: "Year I",
        branches: "APS, TE, VLSID & ES, CSE, DS, MS&T",
        status: "Self-Finance",
        tuition: 50000,
        special: 5200,
        exam: 950,
        total: 56150,
        notes: "Tuition ₹50,000 paid to 'Tuition Fee Account'; Special/Admission fee ₹5,200 paid to 'Special Fee Account'.",
      },
      {
        year: "Year II",
        branches: "APS, TE, VLSID & ES, CSE, DS, MS&T",
        status: "Self-Finance",
        tuition: 50000,
        special: 3300,
        exam: 950,
        total: 54250,
        notes: "Special fee reduced to ₹3,300 in the second year.",
      },
    ],
    notes: [
      "All M.Tech programmes are offered under Self-Finance status across 6 advanced specializations: Advanced Power Systems (APS), Thermal Engineering (TE), VLSI Design & Embedded Systems (VLSID&ES), Computer Science & Engineering (CSE), Data Science (DS), and Material Science & Technology (MS&T).",
      "Tuition Fee and Special Fee must be remitted through their respective dedicated payment routes on SBI Collect.",
      "Project Viva-Voce examination fee of ₹5,000/- is payable at the time of final thesis submission.",
    ],
  },
  "MCA": {
    title: "Master of Computer Applications (MCA Self-Finance)",
    orderRef: "Proc. No. 99/E1/JNTUGV/CEV & CPS/Fee Structure/2025-2026 & Cir. dt. 29.11.2024",
    orderDate: "01.07.2026 & 29.11.2024",
    degree: "Postgraduate (PG)",
    schedule: [
      {
        year: "Year I",
        branches: "Computer Applications",
        status: "Self-Finance",
        tuition: 27000,
        special: 5200,
        exam: 950,
        total: 33150,
        notes: "Tuition ₹27,000 + Special/Admission fee ₹5,200 paid online via SBI Collect.",
      },
      {
        year: "Year II",
        branches: "Computer Applications",
        status: "Self-Finance",
        tuition: 27000,
        special: 3300,
        exam: 950,
        total: 31250,
        notes: "Year II tuition remains ₹27,000; special fee is ₹3,300.",
      },
    ],
    notes: [
      "Admissions conducted via AP ICET state counseling merit rank.",
      "Fees are to be deposited through SBI Collect under the 'Principal JNTUK College of Engineering Vizianagaram' institution portal.",
      "Project Viva-Voce evaluation fee of ₹5,000/- is charged in the final semester.",
    ],
  },
  "MBA": {
    title: "Master of Business Administration (MBA Self-Finance)",
    orderRef: "Proc. No. 99/E1/JNTUGV/CEV & CPS/Fee Structure/2025-2026 & Cir. dt. 29.11.2024",
    orderDate: "01.07.2026 & 29.11.2024",
    degree: "Postgraduate (PG)",
    schedule: [
      {
        year: "Year I",
        branches: "Business Administration (HR, Finance, Marketing, Systems)",
        status: "Self-Finance",
        tuition: 27000,
        special: 5200,
        exam: 950,
        total: 33150,
        notes: "Annual Tuition ₹27,000 + Special/Admission fee ₹5,200.",
      },
      {
        year: "Year II",
        branches: "Business Administration",
        status: "Self-Finance",
        tuition: 27000,
        special: 3300,
        exam: 950,
        total: 31250,
        notes: "Year II Tuition ₹27,000 + Special fee ₹3,300.",
      },
    ],
    notes: [
      "Department of Management Studies (MBA) offers dual specializations across Human Resources, Financial Management, Marketing, and Systems.",
      "Payment receipts must be preserved throughout the programme to secure the final No-Dues clearance certificate.",
      "Final Project Viva-Voce examination fee is ₹5,000/-.",
    ],
  },
  "B.Pharm": {
    title: "Bachelor of Pharmacy (B.Pharmacy Self-Finance - CPS)",
    orderRef: "Proc. No. 99/E1/JNTUGV/CEV & CPS/Fee Structure/2025-2026",
    orderDate: "01.07.2026",
    degree: "Undergraduate (UG)",
    schedule: [
      {
        year: "All Years (I, II, III & IV)",
        branches: "Pharmaceutical Sciences",
        status: "Self-Finance",
        tuition: 45000,
        special: 6500,
        exam: 770,
        total: 52270,
        notes: "Applicable across all 4 academic years at JNTUGV College of Pharmaceutical Sciences.",
      },
    ],
    notes: [
      "Applies to undergraduate students enrolled in the JNTUGV College of Pharmaceutical Sciences, Vizianagaram.",
      "Annual tuition is ₹45,000 with a special institutional fee of ₹6,500 and exam fee of ₹770 per year/semester.",
    ],
  },
};

// Examination Fee Schedule from Order dt. 12-06-2026
const EXAMINATION_FEE_SCHEDULE = {
  orderRef: "Procs. No. 92/E1/JNTU-GV/USE/Revision of Examinations Fee Structure/2026",
  date: "12-06-2026 (Effective from 01.06.2026)",
  regular: [
    { course: "B.Tech / BBA / BCA", fee: 1000, collegeShare: 275, univShare: 725 },
    { course: "B.Pharmacy", fee: 1000, collegeShare: 275, univShare: 725 },
    { course: "Pharm D", fee: 1300, collegeShare: 250, univShare: 1050 },
    { course: "MBA / MCA / M.Tech / M.Pharmacy", fee: 1500, collegeShare: 325, univShare: 1175 },
  ],
  supplementary: [
    {
      courseGroup: "B.Tech / BBA / BCA & B.Pharmacy",
      sub1: { fee: 400, college: 175, univ: 225 },
      sub2: { fee: 700, college: 200, univ: 500 },
      sub3: { fee: 900, college: 250, univ: 650 },
      sub4Plus: { fee: 1000, college: 275, univ: 725 },
    },
    {
      courseGroup: "MBA / MCA / M.Tech / M.Pharmacy",
      sub1: { fee: 400, college: 175, univ: 225 },
      sub2: { fee: 700, college: 200, univ: 500 },
      sub3: { fee: 900, college: 250, univ: 650 },
      sub4Plus: { fee: 1300, college: 275, univ: 1075 },
    },
    {
      courseGroup: "Pharm D",
      sub1: { fee: 400, college: 175, univ: 225 },
      sub2: { fee: 700, college: 200, univ: 500 },
      sub3: { fee: 900, college: 250, univ: 650 },
      sub4: { fee: 1000, college: 275, univ: 725 },
      sub5Plus: { fee: 1200, college: 300, univ: 900 },
    },
  ],
  special: [
    {
      title: "Project Viva-Voce Examination (M.Tech / M.Pharmacy / MBA / MCA)",
      fee: 5000,
      details: "₹3,500 allocated for External/Internal/HOD and TA/DA expenses + ₹1,500 payable to University (Regular & Supplementary).",
    },
    {
      title: "Pre-PhD Examination Fee",
      fee: 1500,
      details: "₹1,500 per theory / research paper.",
    },
  ],
};

// SBI Collect Penalty Slabs from Circular dt. 29.11.2024
const LATE_FINE_SLABS = [
  { period: "Payment within normal schedule", fine: "No Fine (₹0)" },
  { period: "Payment with first fine slab", fine: "₹100 Fine" },
  { period: "Payment with second fine slab", fine: "₹500 Fine (Till end of academic year)" },
  { period: "Defaulted payment after academic year", fine: "₹1,000 Fine per year or part thereof" },
];

function AdmissionsPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"B.Tech" | "M.Tech" | "PhD">("B.Tech");
  
  // Section toggle state: Admissions vs Fee Structure
  const [activeSection, setActiveSection] = useState<"admissions" | "fees">("fees");
  
  // Horizontally swappable program level sub-tabs for Fee Structure
  const [feeProgramTab, setFeeProgramTab] = useState<"B.Tech" | "M.Tech" | "MCA" | "MBA" | "B.Pharm" | "Exam Fees">("B.Tech");
  
  // Accordion toggle states
  const [sbiOpen, setSbiOpen] = useState(true);
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

  return (
    <div className="space-y-12 pb-24">
      <PageHero
        eyebrow="Academics"
        title="Admissions & Fee Structure"
        subtitle="Transparent admission procedures, eligibility rank tables, and officially approved university fee schedules and payment guidelines."
        image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070"
      />
      <div className="container-narrow py-12 flex flex-col md:flex-row gap-8 items-start">
        <VerticalSubNav items={ACADEMICS_SUBNAV} />
        <div className="flex-1 min-w-0 space-y-8">

      {/* Navigation Segment Slider */}
      <div className="flex items-center justify-center p-1.5 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl w-full max-w-md mx-auto shadow-sm border border-slate-200/20">
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
      {/* FEE STRUCTURE & PAYMENT SECTION                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeSection === "fees" && (
        <div className="space-y-10 animate-fadeIn">

          {/* 1. Official Government & University Orders Card Showcase */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-800">
                  Official Notifications & Government Orders
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Official Course Fee & Examination Orders
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OFFICIAL_FEE_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${order.badgeColor}`}>
                        {order.badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar size={12} /> {order.date}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 transition-colors">
                        {order.title}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        {order.orderNo}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                      {order.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {order.level}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => previewFile(order.pdfUrl, order.title)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                        title="Preview PDF"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => downloadFile(order.pdfUrl, order.filename, order.title)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm cursor-pointer"
                        title="Download PDF"
                      >
                        <Download size={13} /> Download
                      </button>
                      <button
                        onClick={() => shareFile(order.pdfUrl, order.title)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors cursor-pointer"
                        title="Share link"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Structured Course & Examination Fee Breakdown Tabs */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-blue-600"></span>
                  Structured Fee Schedule (Approved 2025–26)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a course category below to inspect year-by-year fee components and examination charges.
                </p>
              </div>

              {/* Subtabs */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl w-fit">
                {(["B.Tech", "M.Tech", "MCA", "MBA", "B.Pharm", "Exam Fees"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFeeProgramTab(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
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

            {/* Course Tab View (B.Tech, M.Tech, MCA, MBA, B.Pharm) */}
            {feeProgramTab !== "Exam Fees" && OFFICIAL_COURSE_FEES[feeProgramTab] && (
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-blue-600" />
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {OFFICIAL_COURSE_FEES[feeProgramTab].title}
                        </h4>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                        Order Ref: {OFFICIAL_COURSE_FEES[feeProgramTab].orderRef} (Dated {OFFICIAL_COURSE_FEES[feeProgramTab].orderDate})
                      </p>
                    </div>
                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 px-3 py-1 rounded-full uppercase self-start md:self-auto">
                      {OFFICIAL_COURSE_FEES[feeProgramTab].degree}
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-slate-100/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-3 rounded-l-lg">Year</th>
                          <th className="py-3 px-3">Branches / Disciplines</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-3 text-right">Tuition Fee</th>
                          <th className="py-3 px-3 text-right">Special Fee</th>
                          <th className="py-3 px-3 text-right">Exam Fee</th>
                          <th className="py-3 px-3 text-right font-bold text-blue-700 dark:text-blue-400 rounded-r-lg">Total Annual</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {OFFICIAL_COURSE_FEES[feeProgramTab].schedule.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25">
                            <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              {row.year}
                            </td>
                            <td className="py-3.5 px-3 text-slate-650 dark:text-slate-350 max-w-[260px]">
                              <div className="font-medium">{row.branches}</div>
                              {row.notes && (
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug italic">{row.notes}</p>
                              )}
                            </td>
                            <td className="py-3.5 px-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                row.status === "Regular" ? "bg-emerald-50 text-emerald-700" : "bg-purple-50 text-purple-700"
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                              ₹{row.tuition.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-3 text-right font-mono text-slate-650 dark:text-slate-400">
                              ₹{row.special.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-3 text-right font-mono text-slate-650 dark:text-slate-400">
                              ₹{row.exam.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-3 text-right font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                              ₹{row.total.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Highlights / Notes */}
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Official Schedule Notes:</h5>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-350 list-disc list-inside">
                      {OFFICIAL_COURSE_FEES[feeProgramTab].notes.map((note, idx) => (
                        <li key={idx} className="leading-relaxed">{note}</li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Examination Fees Tab View */}
            {feeProgramTab === "Exam Fees" && (
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          Revised Examination Fee Schedule (All Courses)
                        </h4>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                        Order Ref: {EXAMINATION_FEE_SCHEDULE.orderRef} ({EXAMINATION_FEE_SCHEDULE.date})
                      </p>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 px-3 py-1 rounded-full uppercase self-start md:self-auto">
                      Effective June 1, 2026
                    </span>
                  </div>

                  {/* Regular Exam Fee Table */}
                  <div className="space-y-3 mb-8">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      1. Regular Examination Fee Rates
                    </h5>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left text-xs border-collapse font-sans">
                        <thead>
                          <tr className="bg-slate-100/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 px-3 rounded-l-lg">Programme / Degree</th>
                            <th className="py-2.5 px-3 text-right">Candidate Fee</th>
                            <th className="py-2.5 px-3 text-right">Retained by College</th>
                            <th className="py-2.5 px-3 text-right rounded-r-lg">Payable to University</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {EXAMINATION_FEE_SCHEDULE.regular.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{r.course}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-extrabold text-blue-600">₹{r.fee.toLocaleString("en-IN")}</td>
                              <td className="py-2.5 px-3 text-right font-mono text-slate-600">₹{r.collegeShare.toLocaleString("en-IN")}</td>
                              <td className="py-2.5 px-3 text-right font-mono text-slate-600">₹{r.univShare.toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Supplementary Exam Fee Table */}
                  <div className="space-y-3 mb-8">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      2. Supplementary Examination Fee Slabs
                    </h5>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left text-xs border-collapse font-sans">
                        <thead>
                          <tr className="bg-slate-100/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 px-3 rounded-l-lg">Course Group</th>
                            <th className="py-2.5 px-3 text-right">1 Subject</th>
                            <th className="py-2.5 px-3 text-right">2 Subjects</th>
                            <th className="py-2.5 px-3 text-right">3 Subjects</th>
                            <th className="py-2.5 px-3 text-right rounded-r-lg">4 & Above Subjects</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {EXAMINATION_FEE_SCHEDULE.supplementary.map((s, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{s.courseGroup}</td>
                              <td className="py-3 px-3 text-right font-mono text-slate-800">
                                <span className="font-bold">₹{s.sub1.fee}</span>
                                <span className="block text-[9px] text-slate-400">Coll: ₹{s.sub1.college} | Univ: ₹{s.sub1.univ}</span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-slate-800">
                                <span className="font-bold">₹{s.sub2.fee}</span>
                                <span className="block text-[9px] text-slate-400">Coll: ₹{s.sub2.college} | Univ: ₹{s.sub2.univ}</span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-slate-800">
                                <span className="font-bold">₹{s.sub3.fee}</span>
                                <span className="block text-[9px] text-slate-400">Coll: ₹{s.sub3.college} | Univ: ₹{s.sub3.univ}</span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-slate-800">
                                <span className="font-bold text-blue-600">₹{(s as any).sub4Plus ? (s as any).sub4Plus.fee : (s as any).sub4?.fee}</span>
                                <span className="block text-[9px] text-slate-400">
                                  Coll: ₹{(s as any).sub4Plus ? (s as any).sub4Plus.college : (s as any).sub4?.college} | Univ: ₹{(s as any).sub4Plus ? (s as any).sub4Plus.univ : (s as any).sub4?.univ}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Special Viva-Voce & Pre-PhD Charges */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      3. Project Viva-Voce & Pre-PhD Evaluations
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {EXAMINATION_FEE_SCHEDULE.special.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                          <div className="flex items-center justify-between mb-1.5">
                            <h6 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h6>
                            <span className="font-mono font-extrabold text-blue-700 dark:text-blue-400 text-sm">
                              ₹{item.fee.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            {item.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </section>

          {/* 3. Official Bank Accounts & Payment Methods */}
          <section className="grid lg:grid-cols-3 gap-8">
            
            {/* Payment Details Accordions */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-blue-600"></span>
                Official Payment Portals & Procedures
              </h3>

              {/* SBI Collect Accordion */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm bg-white/80 dark:bg-slate-900/60">
                <button 
                  onClick={() => setSbiOpen(!sbiOpen)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                        State Bank Collect (SBI Collect) Online Payment Steps
                      </h4>
                      <p className="text-[10px] text-slate-450 mt-0.5">
                        Approved online route for Tuition Fee and Special/Admission Fee remittance.
                      </p>
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
                      <div className="p-6 space-y-5 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
                        
                        {/* Two separate routes explained as per circular */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-600 text-white rounded-full">
                              Account Route A
                            </span>
                            <h5 className="font-bold text-slate-900 dark:text-white text-xs">Tuition Fee Account (Online)</h5>
                            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                              <li>Go to <strong>SBI Collect</strong> (<code>www.onlinesbi.sbi</code>)</li>
                              <li>Category ➔ <strong>Educational Institutions</strong></li>
                              <li>State ➔ <strong>Andhra Pradesh</strong></li>
                              <li>Institution ➔ <strong>Principal JNTUK College of Engineering Vizianagaram</strong></li>
                              <li>Payment Category ➔ <strong>Tuition fee</strong></li>
                            </ol>
                          </div>

                          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-purple-600 text-white rounded-full">
                              Account Route B
                            </span>
                            <h5 className="font-bold text-slate-900 dark:text-white text-xs">Special Fee Account (Admission Fee)</h5>
                            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                              <li>Go to <strong>SBI Collect</strong> (<code>www.onlinesbi.sbi</code>)</li>
                              <li>Category ➔ <strong>Educational Institutions</strong></li>
                              <li>State ➔ <strong>Andhra Pradesh</strong></li>
                              <li>Institution ➔ <strong>Principal JNTUK College of Engineering Vizianagaram</strong></li>
                              <li>Payment Category ➔ <strong>Special Fee</strong></li>
                            </ol>
                          </div>
                        </div>

                        {/* Late fine slabs table */}
                        <div className="pt-2">
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-2 flex items-center gap-1.5">
                            <Clock size={14} className="text-amber-600" />
                            Official Late Payment Penalty Slabs
                          </h5>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                                  <th className="py-2 px-3 rounded-l-lg">Payment Period</th>
                                  <th className="py-2 px-3 text-right rounded-r-lg">Penalty Rate</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {LATE_FINE_SLABS.map((slab, i) => (
                                  <tr key={i} className="hover:bg-slate-50/40">
                                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{slab.period}</td>
                                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">{slab.fine}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Critical advisories */}
                        <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-1.5 text-[11px] text-amber-900 dark:text-amber-200">
                          <p className="font-bold flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-amber-600 shrink-0" />
                            Mandatory Regulations from College Administration:
                          </p>
                          <ul className="list-disc list-inside space-y-1 pl-1">
                            <li><strong>Defaulter Exclusion:</strong> Defaulters who fail to clear prescribed fee dues will strictly not be permitted to take Semester End Examinations.</li>
                            <li><strong>Preserve Receipts:</strong> Students are strictly advised to retain one printed copy of every Fee Receipt with them until the completion of their course to obtain their <strong>No Dues Certificate</strong>.</li>
                            <li><strong>JVD Scholarship Students:</strong> Students eligible for the AP State Government Scholarship (JVD - Jagananna Vidya Deevena) must remit their fee obligations in prompt coordination with state scholarship disbursements.</li>
                          </ul>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <a
                            href="https://www.onlinesbi.sbi/sbicollect/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/10"
                          >
                            Proceed to SBI Collect Portal <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Demand Draft Accordion */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm bg-white/80 dark:bg-slate-900/60">
                <button 
                  onClick={() => setDdOpen(!ddOpen)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
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
                      <div className="p-6 space-y-4 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
                        <div className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                          <p>Visit any nationalized bank and request a <strong>Demand Draft (DD)</strong> transaction application.</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                          <p>Draw the Demand Draft strictly in favor of: <strong>"THE PRINCIPAL, JNTUGV CEV, VIZIANAGARAM"</strong>.</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                          <p>Ensure the DD is <strong>Payable at Vizianagaram</strong> (preferably State Bank of India, JNTU Campus Branch Code 002130).</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                          <p>Write your <strong>Full Name, Roll Number, Branch, and Mobile Number</strong> on the reverse side of the physical Demand Draft before submission.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Account Details Column */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-blue-600"></span>
                Official College Bank Account
              </h3>

              <GlassCard className="p-6 relative overflow-hidden border-t-4 border-t-blue-600">
                <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Verified Account
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

              <GlassCard className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/35 rounded-2xl flex gap-3 text-xs text-slate-650 dark:text-slate-350">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-blue-700 dark:text-blue-400">Need Payment Proof?</span> Submit your original SBI online challan receipt or banker draft counterfoil directly to the <strong>College Accounts Branch</strong> to generate official fee receipts.
                </div>
              </GlassCard>
            </div>
          </section>

          {/* 4. Complete Dynamic DB Fee Structure Circulars Archive */}
          <section className="space-y-4">
            <GlassCard className="p-6">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                University Circulars & Fee Archives
              </h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
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
                          <div className="flex justify-center items-center gap-1.5">
                            <button
                              onClick={() => previewFile(fee.pdf_url, fee.title)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                              title="Preview Official Fee Structure PDF"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => downloadFile(fee.pdf_url, `${fee.program_name || fee.level}_Fee_Structure_${fee.title || ''}.pdf`, fee.title)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded transition-colors cursor-pointer"
                              title="Download Official Fee Structure PDF to Device"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => shareFile(fee.pdf_url, fee.title)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 rounded transition-colors cursor-pointer"
                              title="Share document link"
                            >
                              <Share2 size={14} />
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
                                  className="p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded cursor-pointer"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => { if(confirm("Delete fee structure record?")) deleteFeeMutation.mutate(fee.id); }}
                                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
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
          </section>

        </div>
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
                        Admission is strictly based on the merit rank obtained in the <strong>Andhra Pradesh EAPCET (Engineering, Agriculture and Pharmacy Common Entrance Test)</strong> conducted by APSCHE. Ranks are allocated according to category boundaries under state government seat quota allocations.
                      </p>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">Lateral Entry ECET Admissions</h4>
                      <p className="text-slate-600 leading-relaxed">
                        Diploma holders seeking direct admission into the second year (3rd semester) must qualify in the <strong>AP ECET</strong> entrance evaluation.
                      </p>
                    </div>
                  )}

                  {activeTab === "M.Tech" && (
                    <div className="space-y-4 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">GATE / PGECET Rankings</h4>
                      <p className="text-slate-600 leading-relaxed">
                        M.Tech programs prioritize candidates with a valid national-level <strong>GATE scorecard</strong>. Remaining vacant seats are filled through state-level <strong>AP PGECET counseling</strong> strictly based on merit scores.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/35 rounded-2xl flex gap-3 text-xs text-slate-650 dark:text-slate-350">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-extrabold text-blue-700 dark:text-blue-400">Verification Requirement:</span> Keep clear scans of rank scorecards, provisional allotment orders, transfer credentials, and reservation documents ready for upload.
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
        </div>
      </div>
    </div>
  );
}
