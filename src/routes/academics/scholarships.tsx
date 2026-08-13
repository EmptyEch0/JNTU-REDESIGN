import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { 
  GraduationCap, 
  Award, 
  HelpCircle, 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Calendar, 
  Search, 
  ChevronRight, 
  Home, 
  CheckCircle2, 
  Globe, 
  ExternalLink,
  ChevronDown,
  Info,
  ShieldAlert,
  FileBadge,
  Sparkles,
  DollarSign,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicsScholarshipsList,
  upsertAcademicsScholarship,
  deleteAcademicsScholarship
} from "@/lib/academics";
import { getAssetUrl, imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { VerticalSubNav } from "@/components/VerticalSubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/academics/scholarships")({
  head: () => ({
    meta: [
      { title: "Scholarships & Financial Assistance — JNTU-GV CEV" },
      {
        name: "description",
        content: "Explore active government scholarship programs (Vidya Deevena, Vasathi Deevena, NSP, Post Matric) and institutional financial support for students.",
      },
    ],
  }),
  component: ScholarshipsPage,
});

// Default 5 scholarship schemes as robust database seed fallbacks if database is empty
const DEFAULT_SCHOLARSHIPS = [
  {
    id: 901,
    title: "Jagananna Vidya Deevena (JVD)",
    amount: "Full tuition fee reimbursement (Approx ₹10,300/year for B.Tech)",
    description: "Complete tuition fee support directly credited to the mother's bank account in quarterly installments to eliminate student financial barriers.",
    eligibility: "SC, ST, BC, EBC, Minority, Kapu, and EWS students. Family annual income must be below ₹2.5 Lakh.",
    last_date: "Dec 30, 2026",
    status: "Active",
    apply_url: "https://jnanabhumi.ap.gov.in"
  },
  {
    id: 902,
    title: "Jagananna Vasathi Deevena (JVD hostel support)",
    amount: "₹20,000/year",
    description: "Financial assistance tailored to cover student hostel board and lodging expenditures, paid in two equal installments annually.",
    eligibility: "Economically weaker undergraduate and postgraduate students of Andhra Pradesh residing in campus hostels or private lodgings.",
    last_date: "Dec 30, 2026",
    status: "Active",
    apply_url: "https://jnanabhumi.ap.gov.in"
  },
  {
    id: 903,
    title: "National Scholarship Portal (NSP)",
    amount: "₹10,000 – ₹20,000/year",
    description: "Central government academic schemes covering maintenance allowances and tuition support for meritorious and minority student clusters.",
    eligibility: "Meritorious Indian students with score > 80th percentile in relevant classes, matching central ministry criteria.",
    last_date: "Nov 15, 2026",
    status: "Active",
    apply_url: "https://scholarships.gov.in"
  },
  {
    id: 904,
    title: "Post Matric Scholarship",
    amount: "Varies (Tuition Fee & Maintenance Allowance)",
    description: "State-sponsored post-matric financial support for marginalized students pursuing higher professional degrees in state colleges.",
    eligibility: "SC, ST, OBC, and Minority students pursuing post-matric courses. Subject to state government guidelines.",
    last_date: "Jan 15, 2027",
    status: "Active",
    apply_url: "https://jnanabhumi.ap.gov.in"
  },
  {
    id: 905,
    title: "Jagananna Videshi Vidya Deevena",
    amount: "Up to ₹50 Lakh",
    description: "Prestigious financial grant covering full tuition, travel, and living expenses for meritorious students admitted to Top 200 QS ranked global universities.",
    eligibility: "Meritorious Andhra Pradesh students securing admission in designated foreign universities. Age limit and income caps apply.",
    last_date: "Oct 31, 2026",
    status: "Active",
    apply_url: "https://jnanabhumi.ap.gov.in"
  }
];

// Document Checklist Data
const CHECKLIST_DOCUMENTS = [
  { name: "Aadhaar Card", desc: "Linked with student's active mobile number and bank account." },
  { name: "Income Certificate", desc: "Recent certificate issued by competent authority (annual income cap limits)." },
  { name: "Caste Certificate", desc: "Mandatory for SC, ST, BC, Kapu, and Minority reservation quotas." },
  { name: "Bonafide Certificate", desc: "Official academic proof of active study issued by JNTU-GV college registrar." },
  { name: "Bank Passbook", desc: "Aadhaar-mapped bank account details (preferably mother's account for JVD schemes)." },
  { name: "Marks Memo", desc: "Previous semester marks cards or intermediate/SSC marks memo for merit review." }
];

// FAQ Data
const SCHOLARSHIP_FAQS = [
  {
    q: "How do I apply for Jagananna Vidya Deevena (JVD)?",
    a: "Eligible students must apply online through the AP Jnanabhumi Portal (jnanabhumi.ap.gov.in) at the start of the academic year. Physical documents must be submitted to the college desk for bio-metric validation."
  },
  {
    q: "Is it possible to receive multiple scholarships concurrently?",
    a: "Generally, students cannot benefit from two government-funded scholarships simultaneously. You must declare and choose the most beneficial scheme (e.g. JVD or Central NSP)."
  },
  {
    q: "What is Aadhaar-seeding and why is it mandatory?",
    a: "Aadhaar-seeding links your bank account to your Aadhaar card, enabling Direct Benefit Transfer (DBT). DBT transactions will fail if the bank account is not mapped correctly. You can check seeding status at your local bank branch."
  },
  {
    q: "Are PG students eligible for Jagananna Vasathi Deevena?",
    a: "Yes, postgraduate professional course students (M.Tech, MCA, MBA) are eligible for the Vasathi Deevena food and accommodation support, subject to standard family income guidelines."
  }
];

function ScholarshipsPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Government" | "Merit" | "Abroad">("All");

  // State for Accordion FAQs
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // State for Editing
  const [editSchId, setEditSchId] = useState<number | null>(null);
  const [sTitle, setSTitle] = useState("");
  const [sAmount, setSAmount] = useState("");
  const [sDescription, setSDescription] = useState("");
  const [sEligibility, setSEligibility] = useState("");
  const [sLastDate, setSLastDate] = useState("");
  const [sStatus, setSStatus] = useState("Active");
  const [sApplyUrl, setSApplyUrl] = useState("");

  const { data: dbScholarships = [], isLoading } = useQuery({
    queryKey: ["academics-scholarships"],
    queryFn: getAcademicsScholarshipsList,
  });

  // Combine database records with default list to guarantee robust coverage
  const scholarships = useMemo(() => {
    if (dbScholarships.length > 0) {
      return dbScholarships;
    }
    return DEFAULT_SCHOLARSHIPS;
  }, [dbScholarships]);

  // Mutations
  const saveScholarshipMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsScholarship({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-scholarships"] });
      setEditSchId(null);
      toast.success("Scholarship details saved successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to save: " + err.message);
    }
  });

  const deleteScholarshipMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsScholarship({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-scholarships"] });
      toast.success("Scholarship card deleted successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to delete: " + err.message);
    }
  });

  const startEditSch = (item: any) => {
    setEditSchId(item.id);
    setSTitle(item.title);
    setSAmount(item.amount);
    setSDescription(item.description || "");
    setSEligibility(item.eligibility || "");
    setSLastDate(item.last_date || "");
    setSStatus(item.status || "Active");
    setSApplyUrl(item.apply_url || "");
  };

  const startAddSch = () => {
    setEditSchId(-1);
    setSTitle("");
    setSAmount("");
    setSDescription("");
    setSEligibility("");
    setSLastDate("");
    setSStatus("Active");
    setSApplyUrl("");
  };

  // Seeding tool for administrators to push the 5 defaults into PostgreSQL easily
  const seedDefaultsMutation = useMutation({
    mutationFn: async () => {
      for (const sch of DEFAULT_SCHOLARSHIPS) {
        const payload = {
          title: sch.title,
          amount: sch.amount,
          description: sch.description,
          eligibility: sch.eligibility,
          last_date: sch.last_date,
          status: sch.status,
          apply_url: sch.apply_url
        };
        await upsertAcademicsScholarship({ data: payload });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-scholarships"] });
      toast.success("Successfully seeded 5 academic scholarship templates in database!");
    },
    onError: (err: any) => {
      toast.error("Failed to seed: " + err.message);
    }
  });

  // Official Portal Matcher based on name
  const getOfficialWebsiteUrl = (title: string, applyUrl: string) => {
    if (title.toLowerCase().includes("videshi")) {
      return "https://apgovmu.ap.gov.in";
    }
    if (title.toLowerCase().includes("jagananna") || title.toLowerCase().includes("post matric")) {
      return "https://jnanabhumi.ap.gov.in";
    }
    if (title.toLowerCase().includes("national")) {
      return "https://scholarships.gov.in";
    }
    return applyUrl || "https://scholarships.gov.in";
  };

  // Category & search filtering
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (item.eligibility && item.eligibility.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeCategory === "Merit") {
        return item.title.toLowerCase().includes("national") || item.title.toLowerCase().includes("merit");
      }
      if (activeCategory === "Abroad") {
        return item.title.toLowerCase().includes("videshi") || item.title.toLowerCase().includes("foreign") || item.title.toLowerCase().includes("abroad");
      }
      if (activeCategory === "Government") {
        return item.title.toLowerCase().includes("jagananna") || item.title.toLowerCase().includes("portal") || item.title.toLowerCase().includes("post matric");
      }

      return true;
    });
  }, [scholarships, searchTerm, activeCategory]);

  return (
    <div className="space-y-12 pb-24">
      <PageHero
        eyebrow="Academics"
        title="Scholarships & Financial Assistance"
        subtitle="Explore government portals, tuition fee reimbursement initiatives, and international fellowships structured to fund your academic aspirations at JNTU-GV."
        image={campusImg}
      />
      
      <div className="container-narrow py-12 flex flex-col md:flex-row gap-8 items-start">
        <VerticalSubNav items={ACADEMICS_SUBNAV} />
        <div className="flex-1 min-w-0 space-y-6">

        {/* Admin Desk Panel */}
        {isEditMode && (
          <GlassCard className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between text-slate-800 backdrop-blur-md shadow-sm" hoverEffect={false}>
            <div className="space-y-0.5">
              <p className="text-amber-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Admin Control Desk
              </p>
              <p className="text-slate-600 text-[11px] font-medium">
                Add new financial aid listings, edit existing grants, or seed default template cards dynamically in the database.
              </p>
            </div>
            <div className="flex gap-2">
              {dbScholarships.length === 0 && (
                <button 
                  onClick={() => seedDefaultsMutation.mutate()}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow"
                >
                  Seed Default 5 Schemes
                </button>
              )}
              <button 
                onClick={startAddSch}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" /> Add Scholarship Card
              </button>
            </div>
          </GlassCard>
        )}

        {/* Admin Editing Scholarship Form */}
        <AnimatePresence>
          {isEditMode && editSchId !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <GlassCard className="p-6 border border-amber-405 bg-white/95 backdrop-blur-xl shadow-lg space-y-4" hoverEffect={false}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-655 flex items-center gap-1.5 text-amber-700 font-extrabold">
                    <Edit2 className="w-3.5 h-3.5" />
                    {editSchId === -1 ? "Add Scholarship Details" : "Edit Scholarship Details"}
                  </h3>
                  <button 
                    onClick={() => setEditSchId(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-850">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Scholarship Name</label>
                    <input 
                      type="text" 
                      value={sTitle} 
                      onChange={(e) => setSTitle(e.target.value)} 
                      placeholder="e.g. National Scholarship Portal (NSP)"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Grant Amount / Benefits</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ₹20,000 / year"
                      value={sAmount} 
                      onChange={(e) => setSAmount(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Application Last Date</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dec 31, 2026"
                      value={sLastDate} 
                      onChange={(e) => setSLastDate(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Online Application / Portal URL</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={sApplyUrl} 
                      onChange={(e) => setSApplyUrl(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Status</label>
                    <select 
                      value={sStatus} 
                      onChange={(e) => setSStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    >
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Scholarship Benefits Description</label>
                    <textarea 
                      rows={2}
                      value={sDescription} 
                      onChange={(e) => setSDescription(e.target.value)} 
                      placeholder="Benefits e.g. Full tuition fee reimbursement..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Eligibility Criteria Details</label>
                    <textarea 
                      rows={2}
                      value={sEligibility} 
                      onChange={(e) => setSEligibility(e.target.value)} 
                      placeholder="Eligibility e.g. Income below 2.5 Lakh, AP resident..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setEditSchId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!sTitle.trim() || !sAmount.trim() || !sDescription.trim()) {
                        toast.error("Please fill Scholarship Name, Amount, and Benefits.");
                        return;
                      }
                      saveScholarshipMutation.mutate({
                        id: editSchId === -1 ? undefined : editSchId,
                        title: sTitle,
                        amount: sAmount,
                        description: sDescription,
                        eligibility: sEligibility,
                        last_date: sLastDate,
                        status: sStatus,
                        apply_url: sApplyUrl
                      });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2-Column Responsive Layout: Sticky Sidebar left & Content right */}
        <div className="grid lg:grid-cols-4 gap-8 relative items-start">
          
          {/* 1. STICKY SIDEBAR NAVIGATION */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6 z-20">
            <GlassCard className="p-4 bg-white border border-slate-200/80 shadow-md space-y-4" hoverEffect={false}>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 pb-2 border-b border-slate-100">
                Quick Navigation
              </h3>
              <nav className="space-y-1">
                <a 
                  href="#schemes" 
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-55/10 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <Award className="w-4 h-4 text-blue-600" /> Active Schemes
                </a>
                <a 
                  href="#documents" 
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-55/10 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <FileBadge className="w-4 h-4 text-blue-600" /> Document Checklist
                </a>
                <a 
                  href="#faqs" 
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-55/10 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-blue-600" /> FAQ Help Center
                </a>
              </nav>
            </GlassCard>

            {/* Category Filters */}
            <GlassCard className="p-4 bg-white border border-slate-200/80 shadow-md space-y-3" hoverEffect={false}>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 pb-2 border-b border-slate-100">
                Portal Categories
              </h3>
              <div className="space-y-1">
                {(["All", "Government", "Merit", "Abroad"] as const).map((cat) => {
                  const isSelected = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        isSelected 
                          ? "bg-blue-50 text-blue-700 font-extrabold border border-blue-200" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{cat === "All" ? "All Categories" : `${cat} Schemes`}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Helpdesk Contacts */}
            <GlassCard className="p-4 bg-gradient-to-br from-white to-blue-50/30 border border-slate-200/85 rounded-2xl shadow-md" hoverEffect={false}>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1.5">Campus Helpdesk</p>
              <div className="text-[11px] text-slate-600 space-y-1.5 leading-relaxed font-semibold">
                <p>📍 Academics Desk, Administrative Block</p>
                <p>📧 scholarships@jntugv.edu.in</p>
                <p>🕒 Mon – Sat (10:00 AM – 5:00 PM)</p>
              </div>
            </GlassCard>
          </div>

          {/* 2. MAIN CONTENT AREA */}
          <div className="lg:col-span-3 space-y-10">
            
            {/* Section A: Active Schemes */}
            <div id="schemes" className="space-y-6">
              
              {/* Search Header */}
              <GlassCard className="p-4 bg-white border border-slate-200/80 shadow-md flex flex-col sm:flex-row gap-4 items-center justify-between" hoverEffect={false}>
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search scholarship name, eligibility keywords..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-sans shadow-sm"
                  />
                </div>
                <div className="text-[10px] font-extrabold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200/80 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {filteredScholarships.length} Schemes Found
                </div>
              </GlassCard>

              {/* Scholarships Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {filteredScholarships.map((sch, idx) => {
                  const isClosed = sch.status === "Closed";
                  const officialWeb = getOfficialWebsiteUrl(sch.title, sch.apply_url || "");

                  return (
                    <motion.div
                      key={sch.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <GlassCard className="p-6 h-full flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 bg-white border border-slate-200/80 transition-all duration-300">
                        {/* Decorative top-right graphic */}
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-blue-500/5 to-indigo-500/3 rounded-full blur-xl group-hover:scale-110 transition-transform pointer-events-none" />

                        <div className="space-y-4">
                          {/* Top Tag & status */}
                          <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                              isClosed 
                                ? "bg-red-50 border-red-200 text-red-650 text-red-600" 
                                : "bg-emerald-50 border-emerald-200 text-emerald-700"
                            }`}>
                              {sch.status}
                            </span>
                            
                            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-550 text-blue-500" /> Deadline: {sch.last_date}
                            </span>
                          </div>

                          {/* Scholarship Icon + Name */}
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-650 border border-blue-400/20 flex flex-shrink-0 items-center justify-center text-white font-bold shadow-md shadow-blue-500/10">
                              <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-800 text-xs md:text-sm leading-snug group-hover:text-blue-650 group-hover:text-blue-600 transition-colors">
                                {sch.title}
                              </h3>
                              <span className="inline-block text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 tracking-wide mt-1 uppercase">
                                Grant: {sch.amount}
                              </span>
                            </div>
                          </div>

                          {/* Key info specs */}
                          <div className="space-y-2 pt-2 text-[11px] leading-relaxed font-semibold">
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Benefits</p>
                              <p className="text-slate-600">{sch.description}</p>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                              <p className="text-[8px] font-black text-blue-700 uppercase tracking-widest mb-0.5">Eligibility</p>
                              <p className="text-slate-600 font-semibold">{sch.eligibility}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions Desk */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-100 mt-5">
                          {/* Admin actions (visible strictly inside Edit Mode) */}
                          {isEditMode && (
                            <div className="flex items-center gap-1 justify-end sm:justify-start w-full sm:w-auto relative z-20 pb-2 sm:pb-0">
                              <button
                                onClick={() => startEditSch(sch)}
                                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 transition-colors"
                                title="Edit card details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if(confirm(`Confirm delete card for "${sch.title}"?`)) {
                                    deleteScholarshipMutation.mutate(sch.id);
                                  }
                                }}
                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-colors"
                                title="Delete card"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <div className="flex gap-2 w-full justify-end">
                            <button
                              onClick={() => window.open(officialWeb, "_blank")}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold uppercase transition-all shadow"
                            >
                              <Globe className="w-3.5 h-3.5 text-blue-600" /> Official Portal
                            </button>
                            <button
                              onClick={() => window.open(sch.apply_url || "https://jnanabhumi.ap.gov.in", "_blank")}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-md"
                            >
                              Apply Online <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Section B: Important Documents Section */}
            <div id="documents" className="space-y-6 pt-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-805 text-slate-800 flex items-center gap-2">
                  <FileBadge className="w-6 h-6 text-blue-600" /> Required Checklist Documents
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xl font-medium">
                  Ensure you have high-quality scanned copies of these six essential student documents ready before starting any scholarship portal applications.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CHECKLIST_DOCUMENTS.map((doc, idx) => (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <GlassCard 
                      className="p-4 h-full bg-white border border-slate-200/80 hover:border-blue-300 transition-all duration-300 flex flex-col justify-between shadow-sm"
                      hoverEffect={true}
                    >
                      <div className="space-y-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">{doc.name}</h4>
                        <p className="text-[11px] text-slate-655 text-slate-600 leading-relaxed font-semibold">{doc.desc}</p>
                      </div>
                      <span className="inline-block text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3">
                        Status: Required
                      </span>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Section C: FAQ Help Center */}
            <div id="faqs" className="space-y-6 pt-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-805 text-slate-800 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-blue-600" /> Frequently Asked Questions
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xl font-medium">
                  Have questions about verification schedules, deadlines, or eligibilities? Review standard institutional financial assistance resolutions below.
                </p>
              </div>

              <GlassCard className="p-4 bg-white border border-slate-200/80 shadow-md space-y-2" hoverEffect={false}>
                {SCHOLARSHIP_FAQS.map((faq, idx) => {
                  const isExpanded = expandedFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="border-b border-slate-100 last:border-none pb-3 last:pb-0 pt-2 first:pt-0"
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                        className="w-full flex items-center justify-between text-left py-2 hover:text-blue-650 hover:text-blue-600 text-xs font-black transition-colors"
                      >
                        <span className="flex items-center gap-2.5 text-slate-800 pr-4">
                          <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                          {faq.q}
                        </span>
                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 mt-1">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </GlassCard>
            </div>

            {/* Assistance notice */}
            <GlassCard className="p-5 flex gap-4 border border-blue-200 bg-blue-50/80 backdrop-blur-md" hoverEffect={false}>
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs text-blue-900 font-extrabold uppercase tracking-wider">Verification Timelines</p>
                <p className="text-xs text-blue-700 leading-relaxed font-semibold">
                  After completing any scholarship registration online, always carry your original income certificates, caste declarations, Aadhaar records, and bonafide memos to the institutional administrative office desk for biometric finger-print validation within five business days.
                </p>
              </div>
            </GlassCard>

          </div>

        </div>
        </div>
      </div>
    </div>
  );
}
