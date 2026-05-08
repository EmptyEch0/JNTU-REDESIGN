import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { getDepartmentDetails, type DepartmentData } from "@/functions/departments";
import {
  BookOpen,
  Users,
  GraduationCap,
  FlaskConical,
  Trophy,
  Image,
  ChevronRight,
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
  // Use 'unknown' as a bridge to force TS to recognize our custom type
  const data = Route.useLoaderData() as unknown as DepartmentData;
  const location = useLocation();

  // If data is null or undefined (safety check), return nothing
  if (!data || !data.slug) return null;

  const navLinks = [
    { name: "About & Vision", path: "", icon: <BookOpen size={18} /> },
    { name: "HOD's Desk", path: "/hod", icon: <Users size={18} /> },
    { name: "Programmes", path: "/courses", icon: <GraduationCap size={18} /> },
    { name: "Faculty", path: "/faculty", icon: <Users size={18} /> },
    { name: "Laboratories", path: "/labs", icon: <FlaskConical size={18} /> },
    { name: "Achievements", path: "/achievements", icon: <Trophy size={18} /> },
    { name: "Gallery", path: "/gallery", icon: <Image size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden bg-slate-900">
        <img src={data.image} className="h-full w-full object-cover opacity-40" alt={data.name} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase px-4">
              Department of {data.name}
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2 text-blue-300 font-medium">
              <span>Home</span>
              <ChevronRight size={14} />
              <span>Departments</span>
              <ChevronRight size={14} />
              <span className="text-white">{data.slug.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 flex flex-col lg:flex-row gap-12">
        {/* Sticky Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-28 bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">
              Menu
            </h3>
            <nav className="space-y-2">
              {navLinks.map((link) => {
                const fullPath = `/departments/${data.slug}${link.path}`;
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

        {/* Content Outlet - We pass the data into the context so sub-routes can use it */}
        <main className="flex-grow min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
