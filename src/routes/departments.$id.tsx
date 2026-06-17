import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { getDepartmentDetails, type DepartmentData } from "@/functions/departments";
import { getAssetUrl, updateDepartment } from "@/lib/departments";
import { useAdmin } from "@/context/AdminContext";
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
  component: DepartmentLayout,
});

function DepartmentLayout() {
  const loaderData = Route.useLoaderData() as unknown as DepartmentData;
  const location = useLocation();
  const { isAdmin, hasEditPermission, isDeptEditing, setDeptEditing } = useAdmin();
  const queryClient = useQueryClient();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // FIXED: Now uses loaderData.slug instead of id to prevent state de-sync with global navbar
  const isUnlocked = hasEditPermission(loaderData?.slug || "");
  const isEditMode = isDeptEditing(loaderData?.slug || "");

  const [headerEdit, setHeaderEdit] = useState({
    name: loaderData?.name || "",
    image: loaderData?.image || "",
  });

  // Automatically configure edit mode on initial authentication entry
  useEffect(() => {
    if (loaderData?.slug && hasEditPermission(loaderData.slug)) {
      // FIXED: Uses slug for structural initialization matching
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

  // CRITICAL CHECKPOINT TRIGGER: Stop layout render if permission token does not exist
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
      <div className={`relative h-[350px] w-full overflow-hidden transition-all duration-300 ${isEditMode ? "ring-4 ring-inset ring-amber-400" : "bg-slate-900"}`}>
        <img src={getAssetUrl(headerEdit.image)} className="h-full w-full object-cover opacity-40" alt={headerEdit.name} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center w-full max-w-4xl px-4">
            {isEditMode ? (
              <div className="space-y-4 bg-black/40 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                <div className="flex flex-col items-center gap-2">
                  <label className="text-amber-400 text-xs font-bold uppercase flex items-center gap-2"><Camera size={14} /> Background Image URL</label>
                  <input
                    className="w-full max-w-md bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm outline-none"
                    value={headerEdit.image}
                    onChange={(e) => setHeaderEdit({ ...headerEdit, image: e.target.value })}
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
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl"><Menu size={24} /></button>

        <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white transform transition-transform duration-300 p-6 lg:relative lg:transform-none lg:p-0 lg:bg-transparent lg:z-0 ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="sticky top-28 bg-slate-50 rounded-3xl p-6 border border-slate-100 h-fit">

          <nav className="space-y-2">
  {navLinks.map((link) => {
    const fullPath = `/departments/${loaderData.slug}${link.path}`;
    
    // Check if current path starts with this nav link's path
    // This makes Faculty stay highlighted when viewing a faculty profile
    const isActive = link.path === "" 
      ? location.pathname === fullPath          // exact match for About
      : location.pathname.startsWith(fullPath); // prefix match for all others
    
    return (
      <Link
        key={link.path}
        to={fullPath}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
          isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-white"
        }`}
      >
        {link.icon} {link.name}
      </Link>
    );
  })}
</nav>
          </div>
        </aside>

        {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

        <main className="flex-grow min-w-0 space-y-6">
          {/* FIXED: Passing down the structural slug matching parameters property string */}

          <div className="mt-2"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}