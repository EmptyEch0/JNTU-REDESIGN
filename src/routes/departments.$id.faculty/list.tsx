import { createFileRoute, useLoaderData, useParams, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { DEPARTMENT_FACULTY_LIST, type DepartmentFacultyListItem, sortFacultyList } from "@/data/department-faculty-data";
import { useState, useMemo } from "react";
import { Search, Users, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/departments/$id/faculty/list")({
  head: ({ loaderData }) => {
    const data = loaderData as DepartmentData | undefined;
    const name = data?.name || "Department";
    return {
      meta: [
        { title: `Faculty List — Department of ${name} | JNTU-GV CEV` },
        {
          name: "description",
          content: `Official faculty directory, teaching staff roster, and academic qualifications for the Department of ${name} at JNTU-GV College of Engineering Vizianagaram.`,
        },
      ],
    };
  },
  component: FacultyListPage,
});

function FacultyListPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const { id: deptId } = useParams({ from: "/departments/$id/faculty/list" });
  const location = useLocation();
  const navigate = useNavigate();
  const deptKey = (deptId || "").toLowerCase();

  const [searchQuery, setSearchQuery] = useState("");

  // Check if explicit verified faculty list exists for this department and sort hierarchically
  const allFacultyItems: DepartmentFacultyListItem[] = useMemo(() => {
    const directList = DEPARTMENT_FACULTY_LIST[deptKey] || (data?.slug ? DEPARTMENT_FACULTY_LIST[data.slug.toLowerCase()] : undefined);
    let rawList: DepartmentFacultyListItem[] = [];
    if (directList && directList.length > 0) {
      rawList = directList;
    } else {
      const fromLoader = data?.faculty || [];
      rawList = fromLoader.map((f, idx) => ({
        sNo: idx + 1,
        name: f.name || "Faculty Member",
        qualification: f.qualification || (Array.isArray(f.qualifications) && f.qualifications.length > 0 ? f.qualifications.join(", ") : "Ph.D / M.Tech"),
        studiedUniversity: f.studied_university || f.university || "—",
        graduationYear: f.year_of_graduation || f.graduation_year || "—",
        designation: f.designation || "Assistant Professor",
        dateOfJoining: f.date_of_joining || f.joining_date || "—",
        subject: f.subject || f.specialization || data?.name || "—",
        associationType: f.employment_type || f.association_type || "Regular",
        totalExperience: f.total_experience || f.experience || undefined,
        id: f.id,
      }));
    }
    
    // Sort by rank: Professor -> Associate Professor -> Assistant Professor -> Assistant Professor (Contract)
    const sorted = sortFacultyList(rawList);
    return sorted.map((item, idx) => ({
      ...item,
      sNo: idx + 1,
    }));
  }, [deptKey, data]);



  const hasExperienceColumn = useMemo(() => {
    return allFacultyItems.some((f) => Boolean(f.totalExperience));
  }, [allFacultyItems]);

  // Filtered roster (search only)
  const filteredFaculty = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return allFacultyItems.filter((f) => {
      if (!query) return true;
      return (
        (f.name || "").toLowerCase().includes(query) ||
        (f.designation || "").toLowerCase().includes(query) ||
        (f.qualification || "").toLowerCase().includes(query) ||
        (f.studiedUniversity || "").toLowerCase().includes(query) ||
        (f.subject || "").toLowerCase().includes(query) ||
        (f.associationType || "").toLowerCase().includes(query) ||
        (f.totalExperience || "").toLowerCase().includes(query)
      );
    });
  }, [allFacultyItems, searchQuery]);



  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Faculty List
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Detailed academic qualifications, graduation background, and association details of faculty members in the Department of {data?.name}.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, qualification, designation or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          
        </div>
      </div>

      {/* Faculty Table View */}
      {filteredFaculty.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4 w-16 text-center">S.No</th>
                  <th className="py-4 px-4">Name of the faculty Member</th>
                  <th className="py-4 px-4">Qualification</th>
                  <th className="py-4 px-4">Studied University</th>
                  <th className="py-4 px-4">Year of graduation</th>
                  <th className="py-4 px-4">Current Designation</th>
                  <th className="py-4 px-4">Date of joining</th>
                  <th className="py-4 px-4">Subject</th>
                  <th className="py-4 px-4">Regular/contract/adjunct</th>
                  {hasExperienceColumn && (
                    <th className="py-4 px-4">Total Experience</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredFaculty.map((f, idx) => (
                  <tr
                    key={f.id ? String(f.id) : `${f.sNo}-${f.name}`}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-xs">
                      {f.sNo || idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      {f.id ? (
                        <Link
                          to="/departments/$id/faculty/$facultyId"
                          params={{ id: deptId, facultyId: String(f.id) }}
                          className="font-bold text-slate-900 group-hover:text-blue-700 hover:underline transition-colors block"
                        >
                          {f.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors block">
                          {f.name}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs font-semibold">
                      {f.qualification}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {f.studiedUniversity}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                      {f.graduationYear}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/60">
                        {f.designation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {f.dateOfJoining}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">
                      {f.subject}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold border ${
                          f.associationType.toLowerCase() === "regular"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : "bg-blue-50 text-blue-700 border-blue-200/60"
                        }`}
                      >
                        {f.associationType}
                      </span>
                    </td>
                    {hasExperienceColumn && (
                      <td className="py-3.5 px-4 text-slate-700 text-xs font-semibold whitespace-nowrap">
                        {f.totalExperience || "—"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-6 bg-slate-50 border border-dashed border-slate-300 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Users size={28} />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {searchQuery ? "No matching faculty found" : "Faculty list under compilation"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {searchQuery
                ? `No faculty members matched "${searchQuery}". Please check the spelling or clear the search query.`
                : `The tabular faculty roster for the Department of ${data?.name} is currently being verified. You can view individual faculty member cards under the Faculty Profiles tab.`}
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
            <Link
              to="/departments/$id/faculty"
              params={{ id: deptId }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>Switch to Faculty Profiles</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
