import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { getDepartmentDetails, type DepartmentData } from "@/functions/departments";
import { updateDepartment } from "@/lib/departments"; 
import { useAdmin } from "@/context/AdminContext";
import { getAssetUrl } from "@/lib/assets";
import { AdminUpload } from "@/components/AdminEditPanel";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
  Menu, // New Icon
  X,    // New Icon
} from "lucide-react";

export const Route = createFileRoute("/departments/$id")({
  loader: async ({ params }) => {
    const data = await getDepartmentDetails({ data: params.id });
    if (!data) throw new Error("Department not found");
    return data;
  },
  component: DepartmentLayout,
});

function DepartmentLayout() {
  const loaderData = Route.useLoaderData() as unknown as DepartmentData;
  const location = useLocation();
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [headerEdit, setHeaderEdit] = useState({
    name: loaderData?.name,
    image: loaderData?.image,
  });

  useEffect(() => {
    setHeaderEdit({ name: loaderData?.name, image: loaderData?.image });
  }, [loaderData]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const mutation = useMutation({
    mutationFn: (updatedFields: any) => 
      updateDepartment({ data: { id: loaderData.id, ...updatedFields } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department", loaderData.slug] });
      toast.success("Header updated!");
    },
  });

  if (!loaderData || !loaderData.slug) return null;

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
                <input 
                  className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase bg-transparent border-b-2 border-amber-400 text-center outline-none w-full"
                  value={headerEdit.name}
                  onChange={(e) => setHeaderEdit({...headerEdit, name: e.target.value})}
                />
                <button 
                  onClick={() => mutation.mutate(headerEdit)}
                  className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-full font-bold text-sm mx-auto hover:bg-amber-400 transition-colors"
                >
                  <Save size={16} /> Save Header
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
                  Department of {loaderData.name}
                </h1>
                {/* FIXED NAVIGATION BREADCRUMBS */}
                <div className="mt-4 flex items-center justify-center gap-2 text-blue-300 font-medium text-sm md:text-base">
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                  <ChevronRight size={14} />
                  <Link to="/departments" className="hover:text-white transition-colors">Departments</Link>
                  <ChevronRight size={14} />
                  <span className="text-white">{loaderData.slug.toUpperCase()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 flex flex-col lg:flex-row gap-12 relative">
        
        {/* MOBILE MENU TOGGLE BUTTON */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* REACTIVE SIDEBAR */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white transform transition-transform duration-300 ease-in-out p-6 lg:relative lg:transform-none lg:p-0 lg:bg-transparent lg:z-0 lg:flex-shrink-0
          ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="sticky top-28 bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                Menu {isEditMode && <span className="text-amber-500">(Admin)</span>}
              </h3>
              {/* Close button inside sidebar for mobile */}
              <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400">
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-2">
              {navLinks.map((link) => {
                const fullPath = `/departments/${loaderData.slug}${link.path}`;
                const isActive = location.pathname === fullPath;

                return (
                  <Link
                    key={link.path}
                    to={fullPath}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-slate-600 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* OVERLAY FOR MOBILE (to close menu when clicking outside) */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Content Outlet */}
        <main className="flex-grow min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}