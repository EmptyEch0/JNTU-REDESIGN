import { createFileRoute, useLoaderData, useParams, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { DEPARTMENT_FACULTY_LIST, type DepartmentFacultyListItem } from "@/data/department-faculty-data";
import { useState, useMemo, useEffect } from "react";
import { Search, Users, ShieldCheck, ArrowRight, Filter } from "lucide-react";

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

  // Read subject query parameter from URL
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const urlSubject = searchParams.get("subject") || "";
  const [selectedSubject, setSelectedSubject] = useState(urlSubject);

  useEffect(() => {
    setSelectedSubject(urlSubject);
  }, [urlSubject]);

  // Check if explicit verified faculty list exists for this department
  const allFacultyItems: DepartmentFacultyListItem[] = useMemo(() => {
    const directList = DEPARTMENT_FACULTY_LIST[deptKey] || (data?.slug ? DEPARTMENT_FACULTY_LIST[data.slug.toLowerCase()] : undefined);
    if (directList && directList.length > 0) {
      return directList;
    }
    const fromLoader = data?.faculty || [];
    return fromLoader.map((f, idx) => ({
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
  }, [deptKey, data]);

  // Unique subjects available for filtering (e.g. Mathematics, Physics, Chemistry, English, Commerce)
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    allFacultyItems.forEach((f) => {
      if (f.subject && f.subject !== "—" && f.subject.trim() !== "") {
        // Map common subject names cleanly
        const sub = f.subject.trim();
        if (sub.toLowerCase().includes("math")) subjects.add("Mathematics");
        else if (sub.toLowerCase().includes("physic")) subjects.add("Physics");
        else if (sub.toLowerCase().includes("chem")) subjects.add("Chemistry");
        else if (sub.toLowerCase().includes("english")) subjects.add("English");
        else if (sub.toLowerCase().includes("commerce") || sub.toLowerCase().includes("econ")) subjects.add("Commerce");
        else subjects.add(sub);
      }
    });
    return Array.from(subjects);
  }, [allFacultyItems]);

  const hasExperienceColumn = useMemo(() => {
    return allFacultyItems.some((f) => Boolean(f.totalExperience));
  }, [allFacultyItems]);

  // Filtered roster
  const filteredFaculty = useMemo(() => {
    return allFacultyItems.filter((f) => {
      // Subject filter match
      if (selectedSubject) {
        const selLower = selectedSubject.toLowerCase();
        const fSubLower = (f.subject || "").toLowerCase();
        const matchesSubject =
          fSubLower.includes(selLower) ||
          (selLower === "commerce" && fSubLower.includes("econ")) ||
          (selLower === "mathematics" && fSubLower.includes("math")) ||
          (selLower === "physics" && fSubLower.includes("physic")) ||
          (selLower === "chemistry" && fSubLower.includes("chem"));

        if (!matchesSubject) return false;
      }

      // Search query match
      const query = searchQuery.toLowerCase().trim();
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
  }, [allFacultyItems, searchQuery, selectedSubject]);

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    const newParams = new URLSearchParams(location.search);
    if (subject) {
      newParams.set("subject", subject);
    } else {
      newParams.delete("subject");
    }
    const searchStr = newParams.toString();
    navigate({
      to: `/departments/${deptId}/faculty/list${searchStr ? `?${searchStr}` : ""}`,
      replace: true,
    });
  };

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

          {availableSubjects.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => handleSubjectChange("")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  !selectedSubject
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {availableSubjects.map((sub) => {
                return (
                  <button
                    key={sub}
                    onClick={() => handleSubjectChange(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedSubject.toLowerCase() === sub.toLowerCase()
                        ? "bg-primary text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          )}
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

          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Academic Faculty Directory</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck size={14} /> Official University Records
            </span>
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
