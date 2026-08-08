import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { getDepartmentDetails, type DepartmentData } from "@/functions/departments";
import { getAssetUrl, updateDepartment } from "@/lib/departments";
import { useAdmin } from "@/context/AdminContext";
import { AdminUpload } from "@/components/AdminEditPanel";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DepartmentStrictLockModal } from "@/components/DepartmentStrictLockModal";
import {
  BookOpen,
  Users,
  GraduationCap,
  FlaskConical,
  Trophy,
  Image as ImageIcon,
  ChevronRight,
  Save,
  Camera,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/departments/$id")({
  loader: async ({ params }) => {
    const data = await getDepartmentDetails({ data: params.id });
    if (!data) throw new Error("Department not found");
    return data;
  },
  head: ({ loaderData }) => {
    const data = loaderData as DepartmentData | undefined;
    const name = data?.name || "Department";
    const desc = data?.description || `Department details, syllabus, courses, faculty and laboratories at JNTU-GV College of Engineering Vizianagaram.`;
    return {
      meta: [
        { title: `${name} — JNTU-GV CEV` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} — JNTU-GV CEV` },
        { property: "og:description", content: desc },
      ],
      links: [
        { rel: "canonical", href: `https://jntugvcev.edu.in/departments/${data?.slug || ""}` }
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": `${name} - JNTU-GV CEV`,
            "description": desc,
            "url": `https://jntugvcev.edu.in/departments/${data?.slug || ""}`,
            "parentOrganization": {
              "@type": "EducationalOrganization",
              "name": "JNTU-GV College of Engineering Vizianagaram",
              "url": "https://jntugvcev.edu.in/"
            }
          })
        }
      ]
    };
  },
  component: DepartmentLayout,
});

function DepartmentLayout() {
  const loaderData = Route.useLoaderData() as unknown as DepartmentData;
  const location = useLocation();
  const { isAdmin, hasEditPermission, isDeptEditing, setDeptEditing } = useAdmin();
  const queryClient = useQueryClient();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isUnlocked = hasEditPermission(loaderData?.slug || "");
  const isEditMode = isDeptEditing(loaderData?.slug || "");

  const [headerEdit, setHeaderEdit] = useState({
    name: loaderData?.name || "",
    image: loaderData?.image || "",
  });

  useEffect(() => {
    if (loaderData?.slug && hasEditPermission(loaderData.slug)) {
      if (isDeptEditing(loaderData.slug) === undefined) {
        setDeptEditing(loaderData.slug, true);
      }
    }
  }, [loaderData?.slug, hasEditPermission]);

  useEffect(() => {
    if (loaderData) {
      setHeaderEdit({ name: loaderData.name, image: loaderData.image });
    }
  }, [loaderData]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const mutation = useMutation({
    mutationFn: (updatedFields: any) =>
      updateDepartment({ data: { id: loaderData.id, ...updatedFields } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department", loaderData.slug] });
      toast.success("Header updated successfully!");
    },
  });

  if (!loaderData || !loaderData.slug) return null;

  const needsLockScreen = isAdmin && !isUnlocked;

  if (needsLockScreen) {
    return (
      <DepartmentStrictLockModal
        deptId={loaderData.id}
        deptSlug={loaderData.slug}
        isOpen={true}
        onSuccess={() => {
          setDeptEditing(loaderData.slug, true);
        }}
      />
    );
  }

  const navLinks = [
    { name: "About & Vision", path: "", icon: <BookOpen size={18} /> },
    { name: "HOD's Desk", path: "/hod", icon: <Users size={18} /> },
    { name: "Programmes", path: "/courses", icon: <GraduationCap size={18} /> },
    { name: "Faculty", path: "/faculty", icon: <Users size={18} /> },
    { name: "Laboratories", path: "/labs", icon: <FlaskConical size={18} /> },
    { name: "Achievements", path: "/achievements", icon: <Trophy size={18} /> },
    { name: "Gallery", path: "/gallery", icon: <ImageIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className={`relative h-[350px] w-full overflow-hidden transition-all ${isEditMode ? "ring-4 ring-inset ring-amber-400" : "bg-slate-900"}`}>
        <img 
          src={getAssetUrl(headerEdit.image)} 
          className="h-full w-full object-cover opacity-40" 
          alt={headerEdit.name} 
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center w-full max-w-4xl px-4">
            {isEditMode ? (
              <div className="space-y-4 bg-black/20 p-6 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 w-full max-w-md mx-auto">
                   <label className="text-amber-400 text-xs font-bold uppercase flex items-center gap-2">
                    <Camera size={14} /> Background Image
                  </label>
                  <AdminUpload
                    value={headerEdit.image}
                    onChange={(newUrl) => setHeaderEdit({...headerEdit, image: newUrl})}
                    module="departments"
                    category="banners"
                    placeholder="Upload banner image"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <input
                    className="text-2xl md:text-4xl font-bold text-white tracking-tight uppercase bg-transparent border-b-2 border-amber-400/30 focus:border-amber-400 text-center outline-none w-full"
                    value={headerEdit.name}
                    onChange={(e) => setHeaderEdit({ ...headerEdit, name: e.target.value })}
                  />
                </div>
                <button onClick={() => mutation.mutate(headerEdit)} className="flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider mx-auto">
                  <Save size={14} /> Save Header
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">Department of {loaderData.name}</h1>
                <div className="mt-4 flex items-center justify-center gap-2 text-blue-300 font-medium text-sm">
                  <Link to="/" className="hover:text-white">Home</Link>
                  <ChevronRight size={14} />
                  <Link to="/departments" className="hover:text-white">Departments</Link>
                  <ChevronRight size={14} />
                  <span className="text-white font-semibold">{loaderData.slug.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 flex flex-col lg:flex-row gap-12 relative">
        
        {/* Floating Toggle Button for Mobile Screen - MOVED TO LEFT */}
<button 
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
  className="lg:hidden fixed bottom-6 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-200 active:scale-95"
  aria-label="Toggle Menu"
>
  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
</button>

        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-slate-50 p-6 shadow-2xl transition-transform duration-300 ease-in-out
          lg:relative lg:transform-none lg:p-0 lg:bg-transparent lg:z-0 lg:shadow-none lg:w-64 flex-shrink-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="sticky top-28 bg-white lg:bg-slate-50 rounded-3xl p-6 lg:border border-slate-100 h-fit space-y-6">
            
            {/* Header Title Inside Mobile Menu */}
            <div className="flex items-center justify-between lg:hidden border-b pb-4 mb-2 border-slate-200">
              <span className="font-bold text-slate-800 text-lg uppercase tracking-wider">Navigation</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              {navLinks.map((link) => {
                const fullPath = `/departments/${loaderData.slug}${link.path}`;
                const isActive = link.path === "" 
                  ? location.pathname === fullPath
                  : location.pathname.startsWith(fullPath);
                
                return (
                  <Link
                    key={link.path}
                    to={fullPath}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-600 hover:bg-slate-100 lg:hover:bg-white"
                    }`}
                  >
                    {link.icon} {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Transparent Backdrop Layer Overlay when Drawer is Open on Mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}

        {/* Main Workspace Content Stream Component wrapper */}
        <main className="flex-grow min-w-0 space-y-6">
          <div className="mt-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}