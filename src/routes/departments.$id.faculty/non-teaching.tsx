import { createFileRoute, useLoaderData, useParams, Link } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { DEPARTMENT_NON_TEACHING_STAFF, type DepartmentNonTeachingStaffItem } from "@/data/department-faculty-data";
import { useState, useMemo } from "react";
import {
  Briefcase,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight,
  Info,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/departments/$id/faculty/non-teaching")({
  head: ({ loaderData }) => {
    const data = loaderData as DepartmentData | undefined;
    const name = data?.name || "Department";
    return {
      meta: [
        { title: `Non-Teaching Staff — Department of ${name} | JNTU-GV CEV` },
        {
          name: "description",
          content: `Directory of non-teaching, technical, and administrative support staff for the Department of ${name} at JNTU-GV College of Engineering Vizianagaram.`,
        },
      ],
    };
  },
  component: NonTeachingStaffPage,
});

function NonTeachingStaffPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const { id: deptId } = useParams({ from: "/departments/$id/faculty/non-teaching" });
  const deptKey = (deptId || "").toLowerCase();

  const [searchQuery, setSearchQuery] = useState("");

  const staffList: DepartmentNonTeachingStaffItem[] = useMemo(() => {
    return DEPARTMENT_NON_TEACHING_STAFF[deptKey] || (data?.slug ? DEPARTMENT_NON_TEACHING_STAFF[data.slug.toLowerCase()] : undefined) || [];
  }, [deptKey, data?.slug]);

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staffList;
    const q = searchQuery.toLowerCase().trim();
    return staffList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q) ||
        s.qualification.toLowerCase().includes(q) ||
        s.association.toLowerCase().includes(q)
    );
  }, [staffList, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Non-Teaching Staff
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Technical laboratory assistants, work inspectors, technicians, and support staff for the Department of {data?.name}.
          </p>
        </div>
      </div>

      {staffList.length > 0 && (
        /* Search Bar when staff exists */
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search non-teaching staff by name, designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      )}

      {/* Non-Teaching Staff Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4 w-16 text-center">S.No</th>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Qualification</th>
                <th className="py-4 px-4">Designation</th>
                <th className="py-4 px-4">Date of Joining</th>
                <th className="py-4 px-4">Association</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((s) => (
                  <tr key={s.sNo} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-xs">
                      {s.sNo}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {s.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs font-semibold">
                      {s.qualification}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/60">
                        {s.designation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                      {s.dateOfJoining}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {s.association && s.association.trim() ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                          {s.association}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-14 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                        <Clock size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-base">
                          {searchQuery ? "No matching staff found" : "Staff Roster Verification in Progress"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {searchQuery
                            ? `No records matched "${searchQuery}". Please try another search term.`
                            : `The non-teaching and technical staff records for the Department of ${data?.name} are currently being updated and verified with the university administration.`}
                        </p>
                      </div>
                      {searchQuery ? (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Clear Search Filter
                        </button>
                      ) : (
                        <div className="pt-2">
                          <Link
                            to="/departments/$id/faculty"
                            params={{ id: deptId }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                          >
                            <Users size={13} />
                            <span>View Teaching Faculty</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Info size={14} className="text-blue-600" />
            <span>Official University Non-Teaching Registry</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck size={14} /> JNTU-GV CEV
          </span>
        </div>
      </div>
    </div>
  );
}
