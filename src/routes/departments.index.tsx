import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getDepartments, updateDepartment, STATIC_DEPARTMENTS } from "@/lib/departments";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { useAdmin } from "@/context/AdminContext";
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
  loader: async ({ context }) => {
    const depts = await context.queryClient.ensureQueryData({
      queryKey: ["departments"],
      queryFn: () => getDepartments(),
    });
    return { depts };
  },
  head: ({ loaderData }) => {
    const depts = (loaderData as any)?.depts || [];
    return {
      meta: [
        { title: "Departments — JNTU-GV CEV" },
        { name: "description", content: "Engineering and management departments at JNTU-GV CEV. Explore our programs, curriculum, faculty and infrastructure." },
        { property: "og:title", content: "Departments — JNTU-GV CEV" },
        { property: "og:description", content: "Explore the different engineering and management departments at JNTU-GV CEV." },
      ],
      links: [
        { rel: "canonical", href: "https://jntugvcev.edu.in/departments" }
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Departments at JNTU-GV CEV",
            "numberOfItems": depts.length,
            "itemListElement": depts.map((d: any, i: number) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": d.name,
              "url": `https://jntugvcev.edu.in/departments/${d.slug}`
            }))
          })
        }
      ]
    };
  },
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

  // Merge static fallbacks with live data for instant frame-0 rendering
  const sortedData = useMemo(() => {
    const map = new Map(STATIC_DEPARTMENTS.map((d) => [d.slug.toLowerCase(), { ...d }]));
    if (Array.isArray(data) && data.length > 0) {
      for (const live of data) {
        const slugKey = (live.slug || "").toLowerCase();
        if (slugKey) {
          const existing = map.get(slugKey);
          map.set(slugKey, {
            ...existing,
            ...live,
            id: live.id || existing?.id || slugKey,
            name: live.name || existing?.name || "",
            hod: live.hod || existing?.hod || "",
            description: live.description || existing?.description || "",
            image: live.image || existing?.image || "",
          });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

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

          {!isError && (
            <div className="mt-12 grid auto-rows-[280px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 dept-section-wrapper">
              {sortedData.map((dept, index) => (
                <DepartmentCard
                  key={dept.id || dept.slug}
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
            onChange={e => setTempData({ ...tempData, name: e.target.value })}
            placeholder="Department name"
          />

          <div className="flex items-center gap-2">
            <User size={14} className="text-primary flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm font-medium outline-none border-b border-primary/30"
              value={tempData.hod}
              onChange={e => setTempData({ ...tempData, hod: e.target.value })}
              placeholder="HOD name"
            />
          </div>

          <textarea
            className="w-full h-24 bg-transparent text-xs text-ink/70 outline-none border rounded p-2 border-primary/30 resize-none"
            value={tempData.description}
            onChange={e => setTempData({ ...tempData, description: e.target.value })}
            placeholder="Department description"
          />

          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
              <ImageIcon size={12} /> Image
            </div>
            <AdminUpload
              value={tempData.image}
              onChange={(newUrl) => setTempData({ ...tempData, image: newUrl || "" })}
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
        className={`dept-card group relative block h-full overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-md transition-all duration-300 hover:border-primary/40 ${spanClass}`}
      >
        <article className="h-full">
          <img
            src={getAssetUrl(dept.image || `uploads/departments/banners/${dept.slug}-banner.jpg`)}
            alt={dept.name}
            width="400"
            height="280"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            onError={(e) => {
              const fallbackMap: Record<string, string> = {
                cse: "/local-assets/uploads/photo-gallery/thumb/IMG_6868.JPG",
                ece: "/local-assets/uploads/photo-gallery/thumb/IMG_6840.JPG",
                eee: "/local-assets/uploads/photo-gallery/thumb/IMG_6929.JPG",
                it: "/local-assets/uploads/photo-gallery/thumb/IMG_6926.JPG",
                mech: "/local-assets/uploads/photo-gallery/thumb/IMG_6872.JPG",
                met: "/local-assets/uploads/photo-gallery/thumb/IMG_6946.JPG",
                sh: "/local-assets/uploads/photo-gallery/thumb/IMG_6844.JPG",
                mba: "/local-assets/uploads/photo-gallery/thumb/IMG_6972.JPG",
              };
              const slug = (dept.slug || "").toLowerCase();
              const target = e.currentTarget;
              const fallback = fallbackMap[slug] || "/assets/lab.webp";
              if (target.src !== fallback && !target.src.endsWith(fallback)) {
                target.src = fallback;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Admin edit button overlay - only visible in admin mode */}
          {isEditMode && !isEditing && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
              className="absolute top-3 right-3 z-10 rounded-lg bg-primary p-2 text-white transition-all hover:bg-primary/90 hover:scale-105"
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