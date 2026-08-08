import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import {
  FileSignature, BellRing, Award, FileText, Calendar, Search, ArrowRight, Download,
  CheckCircle, HelpCircle, Plus, Trash2, Edit2, Save, Users, Phone, Mail, ChevronRight,
  Sparkles, ExternalLink, CalendarDays, Bookmark, BookOpen, GraduationCap, MapPin
} from "lucide-react";
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
import { PageHero } from "@/components/PageHero";
import { VerticalSubNav } from "@/components/VerticalSubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { imageUrl } from "@/lib/assets";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/academics/examination")({
  component: ExaminationPage,
});

// Static Required Notifications
const STATIC_NOTIFICATIONS = [
  {
    id: "sn-1",
    title: "Notification for I-M.Tech I-Semester Regular (R25) / Supplementary (R19) Examinations, February-2026",
    date: "Feb 2026",
    description: "Official registration guidelines and fee schedules for regular and supplementary PG students.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-2",
    title: "Timetable for II-B.Tech II-Semester Regular/Supplementary Examinations, August-2021",
    date: "Aug 2021",
    description: "Branch-wise dates and exam slot assignments for 2nd year 2nd semester candidates.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-3",
    title: "Notification for II-B.Tech I-Semester Supplementary Examinations, August/September-2021",
    date: "Aug 2021",
    description: "Registration and payment deadlines for supplementary engineering examinations.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-4",
    title: "Revised Timetable for I-B.Tech I-Semester Supplementary Examinations, August-2021",
    date: "Aug 2021",
    description: "Updated dates and rescheduled slots for 1st year 1st semester supplementary candidates.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-5",
    title: "Revaluation/Recounting Notification for IV-B.Tech II-Semester Regular Examinations, July-2021",
    date: "Jul 2021",
    description: "Fee guidelines and step-by-step procedure for script revaluation requests.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-6",
    title: "Notification for I-B.Tech II-Semester Regular/Supplementary Examinations, August-2021",
    date: "Aug 2021",
    description: "Enrollment schedules and deadlines for 1st year 2nd semester candidates.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-7",
    title: "Revaluation/Recounting Notification for I-B.Tech, II-B.Tech, III-B.Tech & IV-B.Tech (R13, R16) Supplementary Examinations, March/April-2021",
    date: "Mar 2021",
    description: "Guidelines for multi-batch supplementary recounting and revaluation requests.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-8",
    title: "Timetable for IV-B.Tech I-Semester II-Mid Examinations, March-2021",
    date: "Mar 2021",
    description: "Schedule of second mid-semester tests for final year undergraduate students.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-9",
    title: "Timetable for III-B.Tech I-Semester II-Mid Examinations, March-2021",
    date: "Mar 2021",
    description: "Schedule of second mid-semester tests for 3rd year undergraduate students.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-10",
    title: "Timetable for II-B.Tech I-Semester II-Mid Examinations, March-2021",
    date: "Mar 2021",
    description: "Schedule of second mid-semester tests for 2nd year undergraduate students.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sn-11",
    title: "Timetable for M.Tech III-Semester (R19) End Examinations, March-2021",
    date: "Mar 2021",
    description: "Official end-semester schedule for 3rd semester M.Tech candidates.",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  }
];

// Static Required Results
const STATIC_RESULTS = [
  {
    id: "sr-1",
    title: "Results for II-B.Tech I-Semester (R17) Supplementary Examinations, December-2024",
    date: "Dec 2024",
    type: "Supplementary",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-2",
    title: "Results for II-B.Tech I-Semester (R17) Supplementary Examinations, July-2024",
    date: "Jul 2024",
    type: "Supplementary",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-3",
    title: "Results for IV-B.Tech II-Semester (R17 Re-admitted) Regular Examinations, April-2024",
    date: "Apr 2024",
    type: "Regular",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-4",
    title: "Revaluation/Recounting Results for I-B.Tech I-Semester (R23) Regular Examinations, April-2024",
    date: "Apr 2024",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-5",
    title: "Revaluation/Recounting Results for I-B.Tech II-Semester (R20) Supplementary Examinations, January-2024",
    date: "Jan 2024",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-6",
    title: "Revaluation/Recounting Results for I-B.Tech I-Semester (R20) Supplementary Examinations, January-2024",
    date: "Jan 2024",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-7",
    title: "Revaluation/Recounting Results for I-B.Tech I-Semester (R19) Supplementary Examinations, January-2024",
    date: "Jan 2024",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-8",
    title: "Revaluation/Recounting Results for IV-B.Tech I-Semester (R20) Regular Examinations, December-2023",
    date: "Dec 2023",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-9",
    title: "Revaluation/Recounting Results for III-B.Tech I-Semester (R20) Regular Examinations, December-2023",
    date: "Dec 2023",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-10",
    title: "Revaluation/Recounting Results for II-B.Tech II-Semester (R20) Supplementary Examinations, February-2024",
    date: "Feb 2024",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-11",
    title: "Revaluation/Recounting Results for II-B.Tech I-Semester (R19) Supplementary Examinations, February-2024",
    date: "Feb 2024",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-12",
    title: "Revaluation/Recounting Results for II-B.Tech II-Semester (R19) Supplementary Examinations, February-2024",
    date: "Feb 2024",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-13",
    title: "Revaluation/Recounting Results for II-B.Tech I-Semester (R20) Supplementary Examinations, February-2024",
    date: "Feb 2024",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-14",
    title: "Results for II-B.Tech I-Semester (R17) Supplementary Examinations, December-2023",
    date: "Dec 2023",
    type: "Supplementary",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-15",
    title: "Results for IV-B.Tech I-Semester (R17 Re-admitted) Regular Examinations, December-2023",
    date: "Dec 2023",
    type: "Regular",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-16",
    title: "Results for III-B.Tech I-Semester (R17) Supplementary Examinations, December-2023",
    date: "Dec 2023",
    type: "Supplementary",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-17",
    title: "Revaluation/Recounting Results for I-B.Tech I-Semester (R20) Supplementary Examinations, August-2023",
    date: "Aug 2023",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-18",
    title: "Revaluation/Recounting Results for I-B.Tech II-Semester (R20) Supplementary Examinations, July/August-2023",
    date: "Jul 2023",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-19",
    title: "Revaluation/Recounting Results for I-B.Tech I-Semester (R19) Supplementary Examinations, August-2023",
    date: "Aug 2023",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  },
  {
    id: "sr-20",
    title: "Revaluation/Recounting Results for I-B.Tech II-Semester (R19) Supplementary Examinations, July/August-2023",
    date: "Jul 2023",
    type: "Revaluation",
    file_url: "https://dhondi.jntugvcev.edu.in/"
  }
];

// Official Examination Team Data
const EXAMINATION_OFFICERS = [
  {
    name: "Dr. M. Hema",
    designation: "Officer In-charge of Examinations – I (III-B.Tech & PG)",
    email: "oie1@jntugvcev.edu.in",
    mobile: "8374033855",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    role: "OIE-I"
  },
  {
    name: "Dr. P. Aruna Kumari",
    designation: "Officer In-charge of Examinations – II (II-B.Tech & SDC)",
    email: "oie2@jntugvcev.edu.in",
    email2: "oie3@jntugvcev.edu.in",
    mobile: "Contact via Email",
    photo: "http://89.116.134.182/local-assets/uploads/departments/hod_photos/cse-hod.jpg",
    role: "OIE-II"
  },
  {
    name: "Dr. M. Sowbhagya Lakshmi",
    designation: "Officer In-charge of Examinations – IV (I-B.Tech & IV-B.Tech)",
    email: "oie4@jntugvcev.edu.in",
    mobile: "Contact via Email",
    photo: "http://89.116.134.182/local-assets/uploads/departments/hod_photos/sh-hod.jpg",
    role: "OIE-IV"
  }
];

// Supporting Staff Data
const SUPPORTING_STAFF = [
  { sno: 1, name: "Mr. S. Vamsidhar", designation: "Typist", mobile: "8121461375" },
  { sno: 2, name: "Mr. E. Rama Krishna", designation: "Technician", mobile: "9030671658" },
  { sno: sno => 3, name: "Mr. CH Srinivasa Rao", designation: "Mechanic", mobile: "9440852724" },
  { sno: 4, name: "Mr. K Satya Rao", designation: "Attender", mobile: "9966862042" },
  { sno: 5, name: "Mrs. CH Aruna Jyothi", designation: "Helper", mobile: "7386739431" }
];

function ExaminationPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"notifications" | "results" | "staff">("notifications");
  const [searchTerm, setSearchTerm] = useState("");

  // Interactive Hall Ticket Form States
  const [hallTicketRoll, setHallTicketRoll] = useState("");
  const [hallTicketSem, setHallTicketSem] = useState("Semester 3");

  // Interactive Results Form States
  const [resultRoll, setResultRoll] = useState("");
  const [resultSem, setResultSem] = useState("Semester 3");
  const [resultScore, setResultScore] = useState<{ gpa: string; pass: boolean } | null>(null);

  // States for Editing dynamic database records
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

  // Dynamic Drizzle Mutations
  const saveExamMutation = useMutation({
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
    setExamType("Notification");
    setExamTitle("");
    setExamDescription("");
    setExamDate(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    setExamFileUrl("");
  };

  // Hall Ticket Redirection (Dhondi Portal)
  const handleGetHallTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hallTicketRoll.trim()) {
      toast.warning("Please enter your roll number first.");
      return;
    }
    window.open("https://dhondi.jntugvcev.edu.in/", "_blank");
    toast.success("Redirecting to JNTU-GV official hall ticket portal...");
  };

  // Interactive Result Checking Simulation
  const handleGetResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultRoll.trim()) {
      toast.warning("Please enter your roll number first.");
      return;
    }
    const isOdd = parseInt(resultRoll.slice(-1)) % 2 !== 0;
    setResultScore({
      gpa: isOdd ? "8.72 SGPA" : "7.94 SGPA",
      pass: true
    });
    toast.success("Result fetched successfully!");
  };

  // Dynamic Drizzle DB notifications
  const dbNotifications = examData.filter(item => item.type === "Notification" || item.type === "Announcement");
  const dbResults = examData.filter(item => item.type === "Result");

  // Merge static notifications + database dynamic notifications
  const allNotifications = [
    ...dbNotifications,
    ...STATIC_NOTIFICATIONS
  ];

  // Merge static results + database dynamic results
  const allResults = [
    ...dbResults,
    ...STATIC_RESULTS
  ];

  return (
    <div className="space-y-12 pb-24">
      <PageHero
        eyebrow="Academics"
        title="Examination Cell"
        subtitle="Access official notifications, check live results, fetch hall tickets, and meet the exam administration team."
        image={campusImg}
      />

      <div className="container-narrow py-12 flex flex-col md:flex-row gap-8 items-start">
        <VerticalSubNav items={ACADEMICS_SUBNAV} />
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex justify-end">
            <a
              href="https://dhondi.jntugvcev.edu.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-650 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              Go to Dhondi Portal <ExternalLink size={12} />
            </a>
          </div>

          {/* Admin Mode Controls */}
          {isEditMode && (
            <GlassCard className="p-4 bg-amber-50/95 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between text-slate-900 shadow-md backdrop-blur-md mb-6 z-10 relative">
              <p className="text-amber-800 text-xs font-semibold">
                <strong>Admin Edit Mode:</strong> Update active notifications, reschedule announcements, or manage memo links.
              </p>
              <button
                onClick={startAddExam}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/25"
              >
                <Plus size={14} /> Add Exam Cell Record
              </button>
            </GlassCard>
          )}

          {/* Admin Form */}
          {isEditMode && editExamId !== null && (
            <GlassCard className="p-6 border border-amber-300 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl space-y-4 mb-6 z-10 relative">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800">
                {editExamId === -1 ? "Add Exam Cell Record" : "Edit Exam Cell Record"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Record Type</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Document PDF URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={examFileUrl}
                    onChange={(e) => setExamFileUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Record Title / Heading</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Detailed Description / Instructions</label>
                  <textarea
                    rows={2}
                    value={examDescription}
                    onChange={(e) => setExamDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditExamId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
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
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-650 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </GlassCard>
          )}

          {/* Submodule Premium Tab Switcher */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[22px] border border-slate-250/30 shadow-inner">
              {[
                { id: "notifications", label: "Notifications / Timetables", icon: BellRing },
                { id: "results", label: "Results Submodule", icon: Award },
                { id: "staff", label: "Examination Staff", icon: Users }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSearchTerm("");
                    }}
                    className={`relative flex items-center gap-2 px-6 py-3 rounded-[16px] text-xs font-extrabold transition-all duration-200 cursor-pointer ${isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-exam-tab"
                        className="absolute inset-0 bg-white dark:bg-slate-800 border border-slate-200/50 shadow-md shadow-slate-200/10 rounded-[16px]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <tab.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Active Content Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8 z-10 relative"
            >

              {/* TAB 1: NOTIFICATIONS / TIMETABLES SUBMODULE */}
              {activeTab === "notifications" && (
                <div>
                  {/* Right Side: Notifications List */}
                  <div>
                    <GlassCard className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-1 h-6 rounded-full bg-blue-600"></span>
                            Official Notifications & Timetables Listing
                          </h3>
                          <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-200/50">
                            {allNotifications.filter(x => x.title.toLowerCase().includes(searchTerm.toLowerCase())).length} items
                          </span>
                        </div>

                        <div className="space-y-4">
                          {allNotifications
                            .filter(x => x.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((exam) => {
                              const isStatic = exam.id.toString().startsWith("sn-");
                              return (
                                <div
                                  key={exam.id}
                                  className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                      <BellRing className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1 max-w-xl">
                                      <h4 className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                                        {exam.title}
                                      </h4>
                                      <p className="text-xs text-slate-400 leading-normal">
                                        {exam.description || "Official examination board circular and detailed guidelines."}
                                      </p>
                                      <div className="flex items-center gap-2.5 pt-1">
                                        <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                          <CalendarDays size={10} /> {exam.date}
                                        </span>
                                        <span className="text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                          {exam.title.toLowerCase().includes("timetable") ? "Timetable" : "Circular"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 self-end sm:self-center">
                                    {/* If dynamic, add admin operations */}
                                    {!isStatic && isEditMode && (
                                      <div className="flex items-center gap-1 mr-2 border-r border-slate-100 pr-2">
                                        <button
                                          onClick={() => startEditExam(exam)}
                                          className="p-2 hover:bg-slate-50 text-amber-600 rounded-lg"
                                          title="Edit Record"
                                        >
                                          <Edit2 size={13} />
                                        </button>
                                        <button
                                          onClick={() => { if (confirm("Delete this record?")) deleteExamMutation.mutate(exam.id as any); }}
                                          className="p-2 hover:bg-slate-50 text-red-650 rounded-lg"
                                          title="Delete Record"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    )}

                                    <a
                                      href={exam.file_url || "#"}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/50 px-3 py-2 rounded-xl transition-all"
                                    >
                                      View <ExternalLink size={10} />
                                    </a>
                                    <a
                                      href={exam.file_url || "#"}
                                      download
                                      className="flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-all"
                                      title="Download PDF Document"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {/* TAB 2: RESULTS SUBMODULE */}
              {activeTab === "results" && (
                <div>
                  {/* Right Side: Results List */}
                  <div>
                    <GlassCard className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-1 h-6 rounded-full bg-blue-600"></span>
                            Official Semester Results Archive
                          </h3>
                          <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-200/50">
                            {allResults.filter(x => x.title.toLowerCase().includes(searchTerm.toLowerCase())).length} items
                          </span>
                        </div>

                        <div className="space-y-3.5">
                          {allResults
                            .filter(x => x.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((res) => {
                              const isStatic = res.id.toString().startsWith("sr-");
                              return (
                                <div
                                  key={res.id}
                                  className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                      <Award className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                                        {res.title}
                                      </h4>
                                      <div className="flex items-center gap-2.5 pt-1">
                                        <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                          <CalendarDays size={10} /> Published: {res.date}
                                        </span>
                                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${res.title.toLowerCase().includes("revaluation")
                                          ? "bg-amber-50 text-amber-700"
                                          : "bg-emerald-50 text-emerald-700"
                                          }`}>
                                          {res.title.toLowerCase().includes("revaluation") ? "Revaluation" : "Semester Marks"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 self-end sm:self-center">
                                    {/* If dynamic, add admin operations */}
                                    {!isStatic && isEditMode && (
                                      <div className="flex items-center gap-1 mr-2 border-r border-slate-100 pr-2">
                                        <button
                                          onClick={() => startEditExam(res)}
                                          className="p-2 hover:bg-slate-50 text-amber-600 rounded-lg"
                                          title="Edit Record"
                                        >
                                          <Edit2 size={13} />
                                        </button>
                                        <button
                                          onClick={() => { if (confirm("Delete this record?")) deleteExamMutation.mutate(res.id as any); }}
                                          className="p-2 hover:bg-slate-50 text-red-650 rounded-lg"
                                          title="Delete Record"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    )}

                                    <a
                                      href={res.file_url || "#"}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                                    >
                                      View Result <ChevronRight size={14} />
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {/* TAB 3: EXAMINATION STAFF SUBMODULE */}
              {activeTab === "staff" && (
                <div className="space-y-8">
                  {/* Premium Faculty cards */}
                  <div>
                    <div className="border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-1 h-6 rounded-full bg-blue-600"></span>
                        Officer In-Charge Team of Examinations
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {EXAMINATION_OFFICERS.map((officer) => (
                        <GlassCard
                          key={officer.name}
                          className="p-6 relative overflow-hidden group hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-900/5 bg-white border border-slate-200/80 transition-all duration-300"
                        >
                          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-200"></div>

                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-blue-200/50 shadow-md flex-shrink-0 relative">
                              <img
                                src={officer.photo}
                                alt={officer.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                              />
                              <div className="absolute bottom-1 right-1 bg-blue-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded-md">
                                {officer.role}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-base font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {officer.name}
                              </h4>
                              <p className="text-xs font-bold text-slate-500 leading-tight">
                                {officer.designation}
                              </p>

                              <div className="space-y-1 pt-3 text-[11px] font-semibold text-slate-600">
                                <a
                                  href={`mailto:${officer.email}`}
                                  className="flex items-center gap-1.5 hover:text-blue-650 transition-colors"
                                >
                                  <Mail size={12} className="text-blue-500" /> {officer.email}
                                </a>
                                {officer.email2 && (
                                  <a
                                    href={`mailto:${officer.email2}`}
                                    className="flex items-center gap-1.5 hover:text-blue-650 transition-colors pl-4.5"
                                  >
                                    <Mail size={12} className="text-blue-500" /> {officer.email2}
                                  </a>
                                )}
                                <a
                                  href={officer.mobile !== "Contact via Email" ? `tel:${officer.mobile}` : undefined}
                                  className="flex items-center gap-1.5 hover:text-blue-650 transition-colors"
                                >
                                  <Phone size={12} className="text-blue-500" /> {officer.mobile}
                                </a>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  </div>

                  {/* Supporting staff matrix table */}
                  <div>
                    <div className="border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-1 h-6 rounded-full bg-blue-600"></span>
                        Supporting Staff Directory
                      </h3>
                    </div>

                    <GlassCard className="overflow-hidden bg-white border border-slate-200/80 shadow-md rounded-2xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-blue-50/80 border-b border-blue-100 text-slate-700">
                              <th className="p-4 font-extrabold uppercase tracking-wider text-[10px]">S.No</th>
                              <th className="p-4 font-extrabold uppercase tracking-wider text-[10px]">Staff Name</th>
                              <th className="p-4 font-extrabold uppercase tracking-wider text-[10px]">Designation</th>
                              <th className="p-4 font-extrabold uppercase tracking-wider text-[10px]">Mobile Contact</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {SUPPORTING_STAFF.map((staff, idx) => {
                              const realSno = idx + 1;
                              return (
                                <tr
                                  key={staff.name}
                                  className="hover:bg-blue-50/20 transition-colors duration-200"
                                >
                                  <td className="p-4">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-extrabold">
                                      {realSno}
                                    </span>
                                  </td>
                                  <td className="p-4 font-extrabold text-slate-800">{staff.name}</td>
                                  <td className="p-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-semibold">
                                      {staff.designation}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono font-bold text-slate-700">
                                    <a
                                      href={`tel:${staff.mobile}`}
                                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline transition-all"
                                    >
                                      <Phone size={12} className="text-blue-500" />
                                      {staff.mobile}
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </GlassCard>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
