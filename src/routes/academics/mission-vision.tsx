import { createFileRoute } from "@tanstack/react-router";
import { MissionVisionCard } from "@/components/academics/MissionVisionCard";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { getAcademicsMissionVision, updateAcademicsMissionVision } from "@/lib/academics";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { Save, Edit } from "lucide-react";

export const Route = createFileRoute("/academics/mission-vision")({
  component: MissionVisionPage,
});

function MissionVisionPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const { data: mv, isLoading } = useQuery({
    queryKey: ["academics-mission"],
    queryFn: getAcademicsMissionVision,
  });

  // Local state for editing form
  const [isEditing, setIsEditing] = useState(false);
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [coreValues, setCoreValues] = useState("");

  useEffect(() => {
    if (mv) {
      setVision(mv.vision || "");
      setMission(mv.mission || "");
      setCoreValues(mv.core_values || "");
    }
  }, [mv]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => updateAcademicsMissionVision({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-mission"] });
      setIsEditing(false);
      toast.success("Mission, Vision & Core Values updated successfully!");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const visionDesc = mv?.vision || "Our vision is to emerge as a premier technology hub of engineering education and research.";
  const missionDesc = mv?.mission || "We are committed to delivering rigorous academic programs, fostering a culture of innovation.";
  const coreValuesDesc = mv?.core_values || "Academic Integrity\nContinuous Research Excellence\nInclusivity & Student Welfare";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
          >
            Mission & <span className="text-[#A02021]">Vision</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light"
          >
            The guiding principles that drive JNTU-GV's pursuit of academic excellence, innovation, and societal impact.
          </motion.p>
        </div>

        {/* Admin Mode Toggler Banner */}
        {isEditMode && (
          <GlassCard className="p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between">
            <div className="text-amber-800 text-xs font-semibold">
              <strong>Admin Mode:</strong> Customize the official Vision statement, Mission values, and Core priorities.
            </div>
            {!isEditing ? (
              <button 
                onClick={() => {
                  setVision(visionDesc);
                  setMission(missionDesc);
                  setCoreValues(coreValuesDesc);
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 bg-[#A02021] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-800 transition-all shadow"
              >
                <Edit size={13} /> Edit Mission & Vision
              </button>
            ) : (
              <button 
                onClick={() => saveMutation.mutate({ vision, mission, core_values: coreValues })}
                className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow"
              >
                <Save size={13} /> Save Statement Changes
              </button>
            )}
          </GlassCard>
        )}

        {/* Interactive Editing Panel */}
        {isEditMode && isEditing && (
          <GlassCard className="p-6 border-2 border-amber-450 space-y-4 font-sans text-xs">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">University Vision Statement</label>
                <textarea 
                  rows={3} 
                  value={vision} 
                  onChange={(e) => setVision(e.target.value)} 
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">University Mission Statement</label>
                <textarea 
                  rows={3} 
                  value={mission} 
                  onChange={(e) => setMission(e.target.value)} 
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Core Values (enter one per line)</label>
                <textarea 
                  rows={4} 
                  value={coreValues} 
                  onChange={(e) => setCoreValues(e.target.value)} 
                  placeholder="e.g. Academic Integrity&#10;Student Welfare"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-205 text-slate-600 rounded-xl font-bold hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => saveMutation.mutate({ vision, mission, core_values: coreValues })}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow"
              >
                <Save size={13} /> Save Now
              </button>
            </div>
          </GlassCard>
        )}

        {/* Regular High Fidelity Vision cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <MissionVisionCard 
            type="Vision"
            title="To emerge as a premier technical education institution"
            description={visionDesc}
            delay={0.2}
          />
          
          <MissionVisionCard 
            type="Mission"
            title="Empowering minds through quality education and innovation"
            description={missionDesc}
            points={coreValuesDesc.split('\n').filter(p => p.trim())}
            delay={0.4}
          />
        </div>
      </div>
    </div>
  );
}
