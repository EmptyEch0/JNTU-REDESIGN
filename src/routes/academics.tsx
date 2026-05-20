import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AcademicsSidebar } from "@/components/academics/layout/AcademicsSidebar";
import { AcademicsHeader } from "@/components/academics/layout/AcademicsHeader";
import { AcademicsMobileNav } from "@/components/academics/layout/AcademicsMobileNav";

export const Route = createFileRoute("/academics")({
  component: AcademicsLayout,
});

function AcademicsLayout() {
  const location = useLocation();
  const isIndex =
    location.pathname === "/academics" || location.pathname === "/academics/";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans">
      {!isIndex && <AcademicsSidebar />}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <AcademicsHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 md:pb-8">
          <div className={isIndex ? "w-full" : "max-w-7xl mx-auto"}>
            <Outlet />
          </div>
        </main>
      </div>
      <AcademicsMobileNav />
    </div>
  );
}
