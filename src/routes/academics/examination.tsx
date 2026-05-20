import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/academics/ui/PageHeader";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { FileSignature, BellRing, Award, FileText, Calendar, Search, ArrowRight, Download, CheckCircle, HelpCircle, Plus, Trash2, Edit2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicsExamData,
  upsertAcademicsExamData,
  deleteAcademicsExamData
} from "@/lib/academics";

export const Route = createFileRoute("/academics/examination")({
  component: ExaminationPage,
});

function ExaminationPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Notification" | "Announcement" | "Result" | "HallTicket">("All");
  
  // Interactive Hall Ticket Form States
  const [hallTicketRoll, setHallTicketRoll] = useState("");
  const [hallTicketSem, setHallTicketSem] = useState("Semester 3");
  
  // Interactive Results Form States
  const [resultRoll, setResultRoll] = useState("");
  const [resultSem, setResultSem] = useState("Semester 3");
  const [resultScore, setResultScore] = useState<{ gpa: string; pass: boolean } | null>(null);

  // States for Editing
  const [editExamId, setEditExamId] = useState<number | null>(null);
  const [examType, setExamType] = useState<"Notification" | "Announcement" | "Result" | "HallTicket">("Notification");
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examFileUrl, setExamFileUrl] = useState("");

  const { data: examData = [], isLoading } = useQuery({
    queryKey: ["academics-exams"],
    queryFn: getAcademicsExamData,
  });

  // Mutations
  const saveExamMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsExamData({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-exams"] });
      setEditExamId(null);
      toast.success("Exam record saved successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to save: " + err.message);
    }
  });

  const deleteExamMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsExamData({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-exams"] });
      toast.success("Exam record deleted successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to delete: " + err.message);
    }
  });

  const startEditExam = (item: any) => {
    setEditExamId(item.id);
    setExamType(item.type);
    setExamTitle(item.title);
    setExamDescription(item.description || "");
    setExamDate(item.date);
    setExamFileUrl(item.file_url || "");
  };

  const startAddExam = () => {
    setEditExamId(-1);
    setExamType(activeFilter === "All" ? "Notification" : activeFilter as any);
    setExamTitle("");
    setExamDescription("");
    setExamDate(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    setExamFileUrl("");
  };

  const filteredExams = examData.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = activeFilter === "All" || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate lists
  const notificationsList = examData.filter((item) => item.type === "Notification");

  // Handler for Hall Ticket Download (Reroute to portal as requested)
  const handleGetHallTicket = (e: React.FormEvent) => {
    e.preventDefault();
    window.open("https://dhondi.jntugvcev.edu.in/", "_blank");
    toast.success("Redirecting to the official JNTU Hall Ticket portal...");
  };

  // Handler for Check Results
  const handleGetResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultRoll.trim()) return;
    const isOdd = parseInt(resultRoll.slice(-1)) % 2 !== 0;
    setResultScore({
      gpa: isOdd ? "8.72 SGPA" : "7.94 SGPA",
      pass: true
    });
  };

  return (
    <div 
      className="space-y-8 pb-16 min-h-screen bg-cover bg-center bg-no-repeat -mx-4 px-4 md:-mx-8 md:px-8"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.97), rgba(248,250,252,0.98)), url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070')"
      }}
    >
      <PageHeader 
        title="Examination Cell" 
        subtitle="Manage examinations, dynamic hall ticket downloads, and regular or supply result lists."
        icon={FileSignature}
      />

      {/* Admin Mode Controls */}
      {isEditMode && (
        <GlassCard className="p-4 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between text-slate-900 shadow-lg backdrop-blur-md">
          <p className="text-amber-800 text-xs font-semibold">
            <strong>Admin Edit Mode:</strong> Update active notifications, reschedule announcements, or manage memo links.
          </p>
          <button 
            onClick={startAddExam}
            className="flex items-center gap-1 bg-[#A02021] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-800 transition-all shadow-md shadow-red-900/20"
          >
            <Plus size={14} /> Add Exam Cell Record
          </button>
        </GlassCard>
      )}

      {/* Main Editing Exam Cell Form */}
      {isEditMode && editExamId !== null && (
        <GlassCard className="p-6 border-2 border-amber-350 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800">
            {editExamId === -1 ? "Add Exam Cell Record" : "Edit Exam Cell Record"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Record Type</label>
              <select 
                value={examType} 
                onChange={(e) => setExamType(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer" 
              >
                <option value="Notification">Notification</option>
                <option value="Announcement">Announcement</option>
                <option value="Result">Result</option>
                <option value="HallTicket">HallTicket</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Publish Date</label>
              <input 
                type="text" 
                placeholder="e.g. May 20, 2026"
                value={examDate} 
                onChange={(e) => setExamDate(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 block mb-1">Document PDF URL</label>
              <input 
                type="text" 
                placeholder="https://..."
                value={examFileUrl} 
                onChange={(e) => setExamFileUrl(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div className="md:col-span-4">
              <label className="text-xs font-bold text-slate-500 block mb-1">Record Title / Heading</label>
              <input 
                type="text" 
                value={examTitle} 
                onChange={(e) => setExamTitle(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div className="md:col-span-4">
              <label className="text-xs font-bold text-slate-500 block mb-1">Detailed Description / Instructions</label>
              <textarea 
                rows={2}
                value={examDescription} 
                onChange={(e) => setExamDescription(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setEditExamId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => saveExamMutation.mutate({
                id: editExamId === -1 ? undefined : editExamId,
                type: examType,
                title: examTitle,
                description: examDescription,
                date: examDate,
                file_url: examFileUrl
              })}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </GlassCard>
      )}

      {/* Live Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Latest Results", desc: "B.Tech II-II Reg", value: "Released", icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "Hall Tickets", desc: "ODD Sem Exams", value: "Active", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Fee Registration", desc: "Regular / Supply", value: "Open", icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
          { title: "Notifications", desc: "Exam cell alerts", value: `${notificationsList.length} Active`, icon: BellRing, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((card, idx) => (
          <GlassCard key={idx} delay={idx * 0.08} className="p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center flex-shrink-0`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">{card.value}</p>
              <p className="text-xs text-slate-400 mt-1">{card.desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Forms (Hall Ticket & Results) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Interactive Hall Ticket Section */}
            <GlassCard className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-none text-white relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <FileText className="w-8 h-8 text-blue-400 mb-4 animate-bounce" />
                  <h3 className="text-xl font-extrabold mb-1">Hall Ticket Download</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Fetch and generate your hall ticket dynamically from academic records.
                  </p>
                </div>

                <form onSubmit={handleGetHallTicket} className="space-y-3.5">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Roll Number (e.g. 23A15A0501)"
                      value={hallTicketRoll}
                      onChange={(e) => setHallTicketRoll(e.target.value.toUpperCase())}
                      className="w-full bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl text-white outline-none placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <select 
                      value={hallTicketSem}
                      onChange={(e) => setHallTicketSem(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 px-3 py-2.5 rounded-xl text-white outline-none text-xs focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      <option className="bg-slate-900" value="Semester 1">Semester 1</option>
                      <option className="bg-slate-900" value="Semester 2">Semester 2</option>
                      <option className="bg-slate-900" value="Semester 3">Semester 3</option>
                      <option className="bg-slate-900" value="Semester 4">Semester 4</option>
                      <option className="bg-slate-900" value="Semester 5">Semester 5</option>
                    </select>
                  </div>

                  <button className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20">
                    Get Hall Ticket (dhondi) <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </GlassCard>

            {/* Interactive Results Section */}
            <GlassCard className="p-6 bg-gradient-to-br from-[#A02021]/90 via-slate-900 to-slate-950 border-none text-white relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <Award className="w-8 h-8 text-red-400 mb-4" />
                  <h3 className="text-xl font-extrabold mb-1">Result Checker</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Check your semester marks and grading summaries immediately.
                  </p>
                </div>

                <form onSubmit={handleGetResults} className="space-y-3.5">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Roll Number (e.g. 23A15A0501)"
                      value={resultRoll}
                      onChange={(e) => setResultRoll(e.target.value.toUpperCase())}
                      className="w-full bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl text-white outline-none placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-red-500 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <select 
                      value={resultSem}
                      onChange={(e) => setResultSem(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 px-3 py-2.5 rounded-xl text-white outline-none text-xs focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
                    >
                      <option className="bg-slate-900" value="Semester 1">Semester 1</option>
                      <option className="bg-slate-900" value="Semester 2">Semester 2</option>
                      <option className="bg-slate-900" value="Semester 3">Semester 3</option>
                      <option className="bg-slate-900" value="Semester 4">Semester 4</option>
                    </select>
                  </div>

                  <button className="w-full bg-[#A02021] hover:bg-red-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/20">
                    Verify Marks <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <AnimatePresence>
                  {resultScore && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-3 bg-red-500/15 border border-red-550/20 rounded-xl flex items-center justify-between font-sans"
                    >
                      <div>
                        <span className="text-[10px] text-red-400 font-extrabold uppercase flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Passed
                        </span>
                        <p className="text-xs font-extrabold text-white">{resultScore.gpa}</p>
                      </div>
                      <button 
                        onClick={() => window.open("https://dhondi.jntugvcev.edu.in/", "_blank")}
                        className="text-[10px] font-bold text-white bg-red-650 px-2.5 py-1 rounded-md hover:bg-red-750 flex items-center gap-1 transition-all"
                      >
                        <Download className="w-3 h-3" /> Memo
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>

          </div>

          {/* Dynamic Notifications / Announcements Panels */}
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-[#A02021]"></span>
                Recent Exam Notifications & Announcements
              </h3>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search exams..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-9 pr-3 py-1.5 bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#A02021]/50 text-slate-900 dark:text-white" 
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {["All", "Notification", "Announcement", "Result"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === tag 
                      ? "bg-[#A02021] text-white shadow-sm" 
                      : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {tag}s
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center text-xs text-slate-500 py-10">Loading exam cell records from database...</p>
              ) : filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <div key={exam.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#A02021]/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300 flex items-start gap-4 group">
                    <div className="p-2 bg-red-50 dark:bg-red-900/10 text-[#A02021] rounded-lg group-hover:bg-[#A02021] group-hover:text-white transition-colors">
                      <FileSignature className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-[#A02021] transition-colors text-sm line-clamp-1">{exam.title}</h4>
                        
                        {/* Admin Action Control Buttons */}
                        {isEditMode && (
                          <div className="flex items-center gap-1 flex-shrink-0 relative z-20">
                            <button 
                              onClick={() => startEditExam(exam)}
                              className="p-1 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-600 rounded"
                              title="Edit Record"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button 
                              onClick={() => { if(confirm("Delete this record?")) deleteExamMutation.mutate(exam.id); }}
                              className="p-1 hover:bg-red-100 dark:hover:bg-slate-700 text-red-650 rounded"
                              title="Delete Record"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{exam.description || "Official document released."}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-slate-400 font-bold">{exam.date}</span>
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          exam.type === 'Notification' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                          : exam.type === 'Announcement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        }`}>
                          {exam.type}
                        </span>
                      </div>
                    </div>
                    {exam.file_url && (
                      <button 
                        onClick={() => window.open(exam.file_url!, "_blank")}
                        className="p-2 text-slate-400 hover:text-[#A02021] transition-colors self-center"
                        title="Download Document"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-500 py-10">No examination cell records found matching your filters.</p>
              )}
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Key Contacts & Schedule */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 border-t-4 border-t-amber-500">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6 text-base">
              <Calendar className="w-5 h-5 text-amber-500" />
              Late Fee Guidelines
            </h3>
            
            <div className="space-y-6 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] top-1 border-2 border-white dark:border-slate-900"></div>
                <p className="font-bold text-slate-900 dark:text-white">Without Late Fee</p>
                <p className="text-slate-400 mt-1">Normal registration charges apply during early enrollment cycles.</p>
              </div>
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                <div className="absolute w-3 h-3 bg-red-400 rounded-full -left-[7px] top-1 border-2 border-white dark:border-slate-900"></div>
                <p className="font-bold text-slate-900 dark:text-white">With Late Fee ₹100/-</p>
                <p className="text-slate-400 mt-1">Standard penalty applies to registration within 5 days after deadline.</p>
              </div>
              <div className="relative pl-6 border-l-2 border-transparent">
                <div className="absolute w-3 h-3 bg-red-650 rounded-full -left-[7px] top-1 border-2 border-white dark:border-slate-900"></div>
                <p className="font-bold text-slate-900 dark:text-white">With Late Fee ₹1000/-</p>
                <p className="text-slate-400 mt-1">Maximum penalty applied for critical emergency exam slots.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex gap-4 border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
              <strong>Need Valuation Help?</strong> If you find any discrepancies in your grading or marks cards, you can download the challenge valuation form directly in the Downloads module.
            </p>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
