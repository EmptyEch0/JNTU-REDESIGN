import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { Users } from "lucide-react";
export const Route = createFileRoute("/departments/$id/faculty")({
  component: FacultyPage,
});

function FacultyPage() {
  // Reach up to the parent route ('/departments/$id') to get the data
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;

  // Fallback check
  const faculty = data?.faculty || [];

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6 text-slate-900">Faculty Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {faculty.map((f) => (
  <div key={f.id} className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-all flex gap-6 items-center">
    
    {/* Add this Image Section */}
    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-50 shadow-inner bg-slate-100">
      {f.photo_url ? (
        <img 
          src={f.photo_url} 
          alt={f.name} 
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback if the URL in the DB is broken
            e.currentTarget.src = "https://ui-avatars.com/api/?name=" + f.name;
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-slate-300">
          <Users size={32} />
        </div>
      )}
    </div>

    {/* Text Section */}
    <div className="flex-grow">
      <h3 className="text-xl font-bold text-blue-900">{f.name}</h3>
      <p className="text-slate-600 font-medium">{f.designation}</p>
    </div>

  </div>
))}
      </div>
    </div>
  );
}