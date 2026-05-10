import { createFileRoute } from "@tanstack/react-router";
import img1 from "@/assets/faculity-quaters1.jpg";
import img2 from "@/assets/faculity-quaters2.jpg";

export const Route = createFileRoute("/other-amenities/staff-quarters")({
  component: StaffQuartersPage,
});

function StaffQuartersPage() {
  return (
    <div className="bg-white min-h-screen animate-[fade-in_0.5s_ease-out]">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-sm text-gray-800">
        <div className="border-b border-primary/20 pb-3">
          <h1 className="text-3xl font-bold text-primary tracking-tight">Staff Quarters</h1>
        </div>

        <div className="space-y-6 text-base leading-relaxed text-slate-600 text-justify">
          <p>
            Staff quarters are an integral part of the university's welfare initiatives, providing
            residential units for the accommodation of employees. The primary goal is to enhance the
            quality of life for staff members and strategically attract and retain talent by
            offering a convenient living environment.
          </p>
          <p>
            Equipped with essential facilities such as kitchens, living areas, and utilities, these
            quarters provide a comfortable and welcoming atmosphere. The proximity of the quarters to
            the campus enhances accessibility and fosters a strong sense of community among the
            university's employees, reinforcing a positive organizational culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="relative group overflow-hidden rounded-2xl border-2 border-primary/20 shadow-md">
            <img
              src={img1}
              alt="Staff Quarters Block A"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white font-semibold">Residential Block A</span>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl border-2 border-primary/20 shadow-md">
            <img
              src={img2}
              alt="Staff Quarters Block B"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white font-semibold">Residential Block B</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

