import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/academics/ui/PageHeader";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { Users, Download, CheckCircle2, IndianRupee, FileText, ChevronRight, Save, Trash2, Plus, Edit2, X, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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

export const Route = createFileRoute("/academics/admissions")({
  component: AdmissionsPage,
});

function AdmissionsPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"B.Tech" | "M.Tech" | "PhD">("B.Tech");

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

  // Mutation for saving/updating admissions
  const saveAdmissionMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsAdmission({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-admissions"] });
      setEditAdmissionId(null);
      toast.success("Admission guidelines updated successfully!");
    },
  });

  // Mutation for deleting an admission program
  const deleteAdmissionMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsAdmission({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-admissions"] });
      toast.success("Admission program deleted successfully!");
    },
  });

  // Mutation for saving/updating brochures
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

  // Mutation for deleting brochures
  const deleteBrochureMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsBrochure({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-brochures"] });
      toast.success("Brochure deleted successfully!");
    },
  });

  // Mutation for saving/updating fee structures
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

  // Mutation for deleting fee structures
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
    <div 
      className="space-y-8 pb-16 min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(248,250,252,0.95), rgba(248,250,252,0.98)), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070')"
      }}
    >
      <PageHeader 
        title="Admissions & Fee Structure" 
        subtitle="Transparent admission procedure and detailed fee breakdowns for B.Tech, M.Tech, and Ph.D. programs."
        icon={Users}
      />

      {/* Admin Mode Header */}
      {isEditMode && (
        <GlassCard className="p-4 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-slate-900">
          <p className="text-amber-800 text-xs font-semibold">
            <strong>Admin Edit Mode:</strong> Use editing controls below to manage procedures, fees, brochures, and dynamic structures.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setEditAdmissionId(-1); // code for adding new
                setEditProgram("New Program");
                setEditProcedure("");
                setEditTuitionFee("₹0 / yr");
                setEditHostelFee("₹0 / yr");
              }}
              className="flex items-center gap-1 bg-[#A02021] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-800 transition-all shadow-md shadow-red-900/20"
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
              className="flex items-center gap-1 bg-blue-650 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-850 transition-all shadow-md"
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
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
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
        <GlassCard className="p-6 border-2 border-blue-400 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-800 flex items-center gap-2">
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
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Document PDF URL</label>
              <input 
                type="text" 
                value={feeUrl} 
                onChange={(e) => setFeeUrl(e.target.value)} 
                placeholder="https://example.com/file.pdf"
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Category / Level</label>
              <select
                value={feeLevel}
                onChange={(e) => setFeeLevel(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setEditFeeId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
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

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Admission Procedures (B.Tech, M.Tech, PhD) */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#A02021]"></span>
            Admission Procedures
          </h3>
          
          <div className="space-y-4">
            {admissions.map((item) => (
              <div key={item.id} className="relative group">
                <GlassCard 
                  className={`p-5 border-l-4 transition-all duration-300 cursor-pointer ${
                    activeTab === item.program 
                      ? "border-l-[#A02021] bg-red-50/20 dark:bg-red-950/10" 
                      : "border-l-slate-300 dark:border-l-slate-700 hover:border-l-[#A02021]/50"
                  }`}
                  onClick={() => setActiveTab(item.program as any)}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors ${
                      activeTab === item.program ? "text-[#A02021] dark:text-red-400" : "text-slate-400"
                    }`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.program} Program</h4>
                        {isEditMode && (
                          <div className="flex items-center gap-1 relative z-20">
                            <button 
                              onClick={(e) => { e.stopPropagation(); startEditAdmission(item); }}
                              className="p-1 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-600 rounded"
                            >
                              <Edit2 size={10} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); if(confirm("Delete this program?")) deleteAdmissionMutation.mutate(item.id); }}
                              className="p-1 hover:bg-red-100 dark:hover:bg-slate-700 text-red-650 rounded"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.procedure}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>

          {/* Dynamic Brochure Download Section */}
          <GlassCard className={`p-6 bg-gradient-to-br from-[#1E293B] via-slate-900 to-slate-950 text-white border relative overflow-hidden group ${
            isEditMode ? "border-amber-300" : "border-none"
          }`}>
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#A02021]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <FileText className="w-8 h-8 text-red-400 mb-4 animate-pulse" />
            
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-extrabold text-base">Admission Brochures</h4>
              {isEditMode && (
                <button
                  onClick={() => {
                    setEditBrochureId(-1);
                    setBrochureTitle("");
                    setBrochureUrl("");
                    setBrochureType("B.Tech");
                  }}
                  className="p-1.5 bg-amber-500 text-slate-950 hover:bg-amber-600 rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition-colors"
                >
                  <Plus size={8} /> Add Brochure
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-300 mb-6 leading-relaxed">
              Download the complete, official guidelines, eligibility criteria, and instructions dynamically fetched from our academic archives.
            </p>

            {/* Editing Brochure Sub-Form */}
            {isEditMode && editBrochureId !== null && (
              <div className="p-4 bg-white/5 border border-amber-350/30 rounded-xl mb-4 space-y-2.5">
                <p className="text-[9px] font-bold text-amber-400 uppercase">
                  {editBrochureId === -1 ? "Add Brochure Record" : "Edit Brochure Record"}
                </p>
                <input 
                  type="text" 
                  placeholder="Brochure Title..." 
                  value={brochureTitle} 
                  onChange={(e) => setBrochureTitle(e.target.value)} 
                  className="w-full bg-white/10 border border-white/15 rounded-lg text-xs px-2.5 py-1.5 text-white" 
                />
                <input 
                  type="text" 
                  placeholder="Brochure PDF URL..." 
                  value={brochureUrl} 
                  onChange={(e) => setBrochureUrl(e.target.value)} 
                  className="w-full bg-white/10 border border-white/15 rounded-lg text-xs px-2.5 py-1.5 text-white" 
                />
                <select
                  value={brochureType}
                  onChange={(e) => setBrochureType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-lg text-xs px-2.5 py-1.5 text-white cursor-pointer"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="PhD">PhD</option>
                  <option value="General">General</option>
                </select>
                <div className="flex justify-end gap-1.5 pt-1">
                  <button onClick={() => setEditBrochureId(null)} className="px-2 py-1 bg-white/10 text-white rounded text-[9px] font-bold">Cancel</button>
                  <button 
                    onClick={() => saveBrochureMutation.mutate({
                      id: editBrochureId === -1 ? undefined : editBrochureId,
                      title: brochureTitle,
                      file_url: brochureUrl,
                      type: brochureType
                    })} 
                    className="px-2.5 py-1 bg-amber-500 text-slate-950 hover:bg-amber-600 rounded text-[9px] font-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {brochures.map((brochure) => (
                <div key={brochure.id} className="relative group/brochure">
                  <button
                    onClick={() => window.open(brochure.file_url, "_blank")}
                    className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl font-bold text-xs flex items-center justify-between transition-all duration-300 group/btn"
                  >
                    <span className="flex items-center gap-2 text-left truncate pr-4">
                      <Download className="w-4 h-4 text-red-400 group-hover/btn:scale-110 transition-transform flex-shrink-0" />
                      <span className="truncate">{brochure.title}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:translate-x-1 transition-transform flex-shrink-0" />
                  </button>

                  {isEditMode && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/brochure:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditBrochureId(brochure.id);
                          setBrochureTitle(brochure.title);
                          setBrochureUrl(brochure.file_url);
                          setBrochureType(brochure.type);
                        }}
                        className="p-1 bg-amber-500 text-slate-950 hover:bg-amber-600 rounded"
                      >
                        <Edit2 size={10} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); if(confirm("Delete this brochure?")) deleteBrochureMutation.mutate(brochure.id); }}
                        className="p-1 bg-red-650 text-white hover:bg-red-700 rounded"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Fee Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-[#A02021]"></span>
              Fee Details for {activeTab}
            </h3>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
              {admissions.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.program as any)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === tab.program 
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab.program}
                </button>
              ))}
            </div>
          </div>

          {currentAdmissions ? (
            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Card 1: Tuition Fee */}
              <motion.div
                key={`${activeTab}-tuition`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden border-t-4 border-t-[#A02021]">
                  <div className="absolute -top-3 right-6 bg-[#A02021] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    Mandatory
                  </div>

                  <p className="text-xs font-semibold text-slate-450 uppercase tracking-widest mb-1">Academic Charge</p>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Tuition Fee</h3>
                  
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <IndianRupee className="w-5 h-5 text-slate-900 dark:text-white" />
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {currentAdmissions.tuition_fee.split(" ")[0] || "Details inside"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {currentAdmissions.tuition_fee}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Payment Period</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Annual</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">JVD Eligible</span>
                      <span className="font-semibold text-emerald-600">Yes (100% Reimbursement)</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Card 2: Hostel Fee */}
              <motion.div
                key={`${activeTab}-hostel`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden border-t-4 border-t-blue-600">
                  <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    Optional
                  </div>

                  <p className="text-xs font-semibold text-slate-450 uppercase tracking-widest mb-1">Residential Charge</p>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Hostel Fee</h3>
                  
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <IndianRupee className="w-5 h-5 text-slate-900 dark:text-white" />
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {currentAdmissions.hostel_fee.split(" ")[0] || "Details inside"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {currentAdmissions.hostel_fee}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Inclusions</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Mess & Accommodation</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Refundable Deposit</span>
                      <span className="font-semibold text-slate-900 dark:text-white">₹5,000 (One-time)</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          ) : (
            <p className="text-slate-500">Loading fee details...</p>
          )}

          {/* Admission Procedure Detail Text */}
          <GlassCard className="p-6">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-3">Admission Guidelines & Registration</h4>
            <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed mb-4">
              {currentAdmissions?.procedure}
            </p>
            <div className="p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex gap-3 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-5 h-5 text-[#A02021] shrink-0" />
              <div>
                <span className="font-bold text-[#A02021]">Mandatory Biometrics Check:</span> Standard JNTU biometric attendance guidelines apply. Please keep copies of all academic transcripts, entrance scorecard (EAPCET/PGECET/GATE/RCET), and caste/income certificates handy during the online allocation round.
              </div>
            </div>
          </GlassCard>

          {/* REAL DATABASE-DRIVEN FEE STRUCTURE TABLE & DOWNLOADS */}
          <GlassCard className="p-6 border-slate-200/60">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#A02021]" />
              Official Fee Structure Circulars (Real-Time DB)
            </h4>
            <p className="text-[11px] text-slate-450 mb-4 leading-relaxed">
              Official circulars detailing complete fee structure breakdowns ratified by the academic counsel.
            </p>

            <div className="overflow-x-auto">
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
                            onClick={() => window.open(fee.pdf_url, "_blank")}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
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
                                className="p-1 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
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

      </div>
    </div>
  );
}
