import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { Users, Plus, Trash2, Edit2, Save, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicsCac,
  upsertAcademicsCac,
  deleteAcademicsCac
} from "@/lib/academics";
import { imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/academics/cac")({
  head: () => ({
    meta: [
      { title: "College Academic Committee (CAC) — JNTU-GV CEV" },
      {
        name: "description",
        content: "Composition and role of the College Academic Committee at JNTU-GV CEV.",
      },
    ],
  }),
  component: CACPage,
});

const DEFAULT_MEMBERS = [
  { role: "Chairman", name: "Principal", designation: "CEV Dean & Administrator" },
  { role: "Convener", name: "Vice Principal", designation: "Academic Coordinator" },
  { role: "Member", name: "Head, CSE", designation: "Computer Science Dept" },
  { role: "Member", name: "Head, ECE", designation: "Electronics & Communication" },
  { role: "Member", name: "Head, EEE", designation: "Electrical & Electronics" },
  { role: "Member", name: "Head, Mechanical", designation: "Mechanical Dept" },
  { role: "Member", name: "Head, Civil", designation: "Civil Dept" },
  { role: "Member", name: "Head, IT", designation: "Information Technology" },
  { role: "Member", name: "Head, BS & HSS", designation: "Basic Sciences Dept" },
  { role: "Member", name: "Examination Branch Officer", designation: "Evaluation Head" },
];

function CACPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  // States for Editing/Adding
  const [editMemberId, setEditMemberId] = useState<number | null>(null);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("Member");
  const [memberDesignation, setMemberDesignation] = useState("");

  const { data: cacMembers = [], isLoading } = useQuery({
    queryKey: ["academics-cac"],
    queryFn: getAcademicsCac,
  });

  // Mutations
  const saveMemberMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsCac({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-cac"] });
      setEditMemberId(null);
      toast.success("CAC Member saved successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to save: " + err.message);
    }
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsCac({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-cac"] });
      toast.success("CAC Member deleted successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to delete: " + err.message);
    }
  });

  const seedMembersMutation = useMutation({
    mutationFn: async () => {
      for (const m of DEFAULT_MEMBERS) {
        await upsertAcademicsCac({ data: { name: m.name, role: m.role, designation: m.designation } });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-cac"] });
      toast.success("College Academic Committee members seeded from template!");
    },
    onError: (err: any) => {
      toast.error("Failed to seed: " + err.message);
    }
  });

  const startEditMember = (item: any) => {
    setEditMemberId(item.id);
    setMemberName(item.name || "");
    setMemberRole(item.role || "Member");
    setMemberDesignation(item.designation || "");
  };

  const startAddMember = () => {
    setEditMemberId(-1);
    setMemberName("");
    setMemberRole("Member");
    setMemberDesignation("");
  };

  // If DB is empty, we'll display seeded default list statically for non-admins,
  // but prompt admins to seed them to DB.
  const displayMembers = cacMembers.length > 0 ? cacMembers : DEFAULT_MEMBERS.map((m, idx) => ({
    id: -(idx + 1), // temp mock negative IDs
    name: m.name,
    role: m.role,
    designation: m.designation
  }));

  return (
    <div className="space-y-12 pb-24">
      <PageHero
        eyebrow="Academics"
        title="College Academic Committee"
        subtitle="The CAC sets academic policy, monitors curriculum quality, and reviews program outcomes for JNTU-GV."
        image={campusImg}
      />
      
      <SubNav items={ACADEMICS_SUBNAV} />

      <div className="container-narrow space-y-6">

      {/* Admin Mode Controls */}
      {isEditMode && (
        <GlassCard className="p-4 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-900 shadow-lg backdrop-blur-md">
          <div>
            <p className="text-amber-800 text-xs font-semibold">
              <strong>Admin Edit Mode:</strong> Update the committee composition. If the list is empty, you can seed it using the template.
            </p>
          </div>
          <div className="flex gap-2">
            {cacMembers.length === 0 && (
              <button 
                onClick={() => { if(confirm("Seed initial members from default template?")) seedMembersMutation.mutate(); }}
                className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md"
              >
                <Sparkles size={14} /> Seed Template
              </button>
            )}
            <button 
              onClick={startAddMember}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-900/20"
            >
              <Plus size={14} /> Add Committee Member
            </button>
          </div>
        </GlassCard>
      )}

      {/* Main Editing CAC Form */}
      {isEditMode && editMemberId !== null && (
        <GlassCard className="p-6 border-2 border-amber-350 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800">
            {editMemberId === -1 ? "Add Committee Member" : "Edit Committee Member"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Committee Role</label>
              <select 
                value={memberRole} 
                onChange={(e) => setMemberRole(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer" 
              >
                <option value="Chairman">Chairman</option>
                <option value="Convener">Convener</option>
                <option value="Member">Member</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Member Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. K. Srinivasa Rao"
                value={memberName} 
                onChange={(e) => setMemberName(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Designation / Department</label>
              <input 
                type="text" 
                placeholder="e.g. Professor & Head, CSE"
                value={memberDesignation} 
                onChange={(e) => setMemberDesignation(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setEditMemberId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => saveMemberMutation.mutate({
                id: editMemberId === -1 ? undefined : editMemberId,
                name: memberName,
                role: memberRole,
                designation: memberDesignation
              })}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow shadow-blue-900/10"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </GlassCard>
      )}

      {/* Composition Section */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-blue-600 font-extrabold text-xs uppercase tracking-widest">Composition</div>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">Academic Committee Members</h2>
          </div>
          {cacMembers.length === 0 && (
            <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/10 px-3 py-1 rounded-full font-bold">
              Using local template values
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-medium">
            Loading committee records from Neon database...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {displayMembers.map((m, i) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <GlassCard className="p-6 relative group hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full bg-white/80 dark:bg-slate-900/40">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-600/10 transition-all duration-200 pointer-events-none"></div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                          {m.role}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors line-clamp-1">{m.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">{m.designation || "Committee Panelist"}</p>
                      </div>
                    </div>

                    {/* Admin Action Controls */}
                    {isEditMode && m.id > 0 && (
                      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 relative z-20">
                        <button 
                          onClick={() => startEditMember(m)}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors"
                          title="Edit Member"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => { if(confirm(`Delete ${m.name} from CAC committee?`)) deleteMemberMutation.mutate(m.id); }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Committee Role & Description section */}
      <GlassCard className="p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-base">Functions of the College Academic Committee</h3>
        <ul className="space-y-3.5 text-xs text-slate-650 dark:text-slate-300 leading-relaxed list-disc pl-5">
          <li>Review and recommend curriculum improvements and new course introductions to JNTU-GV.</li>
          <li>Establish strategies to ensure highest standard of pedagogical delivery and laboratory practice.</li>
          <li>Oversee absolute compliance of academic calendar, evaluation procedures, and exam scheduling.</li>
          <li>Formulate strategies to encourage research activities, conferences, and student projects.</li>
        </ul>
      </GlassCard>
      </div>
    </div>
  );
}
