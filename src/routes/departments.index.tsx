import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDepartments, updateDepartment } from "@/lib/departments";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { 
  Save, 
  Image as ImageIcon, 
  User, 
  Eye, 
  Edit2, 
  X, 
  Check,
  ExternalLink 
} from "lucide-react";
import { toast } from "sonner";
import labImg from "@/assets/lab.jpg";
import { getAssetUrl } from "@/lib/assets";
import { AdminUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/departments/")({
  head: () => ({
    meta: [
      { title: "Departments — JNTU-GV CEV" },
      { name: "description", content: "Engineering and management departments at JNTU-GV CEV." },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getDepartments(),
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: string; payload: any }) =>
      updateDepartment({ data: { id: vars.id, ...vars.payload } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department updated successfully!");
    },
  });

  // Sort departments alphabetically by name
  const sortedData = data ? [...data].sort((a, b) => a.name.localeCompare(b.name)) : [];

  return (
    <>
      <PageHero
        eyebrow="Departments"
        title="Eight departments. One academic culture."
        subtitle="Each department is led by faculty who teach with conviction, mentor with care and research with rigour."
        image={labImg}
      />
      <section className="bg-sand/40 py-24">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Academic Units"
              title="Explore Our Departments"
              subtitle={isEditMode ? "✏️ ADMIN MODE: Click on any department card to edit its details" : "Each department blends rigorous academics, practical exposure, and dedicated faculty mentoring."}
            />
          </RevealOnScroll>

          {isPending && (
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-80 animate-pulse rounded-3xl border border-border bg-muted/30" />
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
              Error: {error instanceof Error ? error.message : "Failed to load"}
            </div>
          )}

          {!isPending && !isError && (
            <div className="mt-12 grid auto-rows-[280px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sortedData?.map((dept, index) => (
                <DepartmentCard 
                  key={dept.id} 
                  dept={dept} 
                  index={index} 
                  isEditMode={isEditMode} 
                  onSave={(payload) => mutation.mutate({ id: dept.id, payload })}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Outlet />
    </>
  );
}

function DepartmentCard({ dept, index, isEditMode, onSave }: { dept: any, index: number, isEditMode: boolean, onSave: (p: any) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(dept);

  const spanClass =
    index % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : 
    index % 5 === 3 ? "sm:col-span-2 lg:col-span-2" : "";

  const handleSave = () => {
    onSave(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(dept);
    setIsEditing(false);
  };

  // Edit Mode UI - With consistent dimensions
  if (isEditMode && isEditing) {
    return (
      <div className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 border-primary/30 bg-white shadow-xl transition-all ${spanClass}`}>
        <div className="relative flex-1 overflow-y-auto p-5 space-y-3" style={{ height: '280px' }}>
          <input 
            className="w-full bg-transparent text-xl font-bold text-ink outline-none border-b border-primary/30" 
            value={tempData.name} 
            onChange={e => setTempData({...tempData, name: e.target.value})}
            placeholder="Department name"
          />

          <div className="flex items-center gap-2">
            <User size={14} className="text-primary flex-shrink-0" />
            <input 
              className="flex-1 bg-transparent text-sm font-medium outline-none border-b border-primary/30" 
              value={tempData.hod} 
              onChange={e => setTempData({...tempData, hod: e.target.value})}
              placeholder="HOD name"
            />
          </div>

          <textarea 
            className="w-full h-24 bg-transparent text-xs text-ink/70 outline-none border rounded p-2 border-primary/30 resize-none"
            value={tempData.description}
            onChange={e => setTempData({...tempData, description: e.target.value})}
            placeholder="Department description"
          />

          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
              <ImageIcon size={12} /> Image
            </div>
            <AdminUpload
              value={tempData.image}
              onChange={(newUrl) => setTempData({...tempData, image: newUrl || ""})}
              module="departments"
              category="banners"
              className="w-full"
            />
          </div>

          <div className="flex gap-2 pt-2 sticky bottom-0 bg-white py-2">
            <button 
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-bold text-white hover:bg-primary/90"
            >
              <Save size={14} /> Save
            </button>
            <button 
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Same bento grid for both admin view mode and normal mode
  return (
    <RevealOnScroll delay={index * 60}>
      <Link
        to="/departments/$id"
        params={{ id: dept.slug }}
        className={`group relative block h-full overflow-hidden rounded-3xl border border-white/20 bg-card shadow-[var(--shadow-soft)] ring-1 ring-black/5 transition-all duration-300 hover:ring-2 hover:ring-primary/20 ${spanClass}`}
      >
        <article className="h-full">
          <img
            src={getAssetUrl(dept.image)}
            alt={dept.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Admin edit button overlay - only visible in admin mode */}
          {isEditMode && !isEditing && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
              className="absolute top-3 right-3 z-10 rounded-lg bg-primary/90 p-2 text-white backdrop-blur-sm transition-all hover:bg-primary hover:scale-105"
              title="Edit Department"
            >
              <Edit2 size={16} />
            </button>
          )}

          <div className="relative flex h-full flex-col justify-between p-5 text-white md:p-6">
            <div>
              <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                View Dept
              </span>
            </div>

            <div>
              <h3 className="max-w-[20ch] text-2xl font-bold leading-tight drop-shadow-md">
                {dept.name}
              </h3>
              <p className="mt-2 text-sm font-medium text-white/90">
                HOD: <span className="font-bold text-white">{dept.hod}</span>
              </p>
              <p className="mt-3 line-clamp-2 max-w-[52ch] text-xs leading-relaxed text-white/80">
                {dept.description}
              </p>
            </div>
          </div>
        </article>
      </Link>
    </RevealOnScroll>
  );
}