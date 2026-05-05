    import { createFileRoute } from "@tanstack/react-router";
    import { useState } from "react";
    import { PageHero } from "@/components/PageHero";

    import engineerImg from "@/assets/campus-life.jpg";

    export const Route = createFileRoute("/engineering-cell")({
    component: EngineeringCellPage,
    });

    const TABS = [
    "Construction Activities",
    "PE (Elec) Section",
    ];

    function EngineeringCellPage() {
    const [tab, setTab] = useState("Construction Activities");

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
        <PageHero
            title="Engineering Cell"
            subtitle="Construction, maintenance & technical operations"
        />

        <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start min-w-0">
            {/* LEFT SIDEBAR */}
            <aside className="lg:col-span-4 xl:col-span-3 min-w-0 space-y-4 w-full">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 sm:p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                    Engineering Cell Sections
                </h2>

                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3"
                    role="tablist"
                    aria-label="Engineering cell sections"
                >
                    {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        role="tab"
                        aria-selected={tab === t}
                        className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        tab === t
                            ? "bg-red-600 text-white shadow-sm"
                            : "bg-blue-800 text-white hover:bg-blue-700"
                        }`}
                    >
                        {t}
                    </button>
                    ))}
                </div>
                </div>
            </aside>

            {/* RIGHT CONTENT */}
            <main className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Engineering Cell
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 leading-7 max-w-3xl">
                    The Engineering Cell oversees campus construction activities,
                    maintenance services, and technical infrastructure support to
                    ensure safe, efficient, and well-maintained facilities.
                </p>

                {/* CONSTRUCTION ACTIVITIES */}
                {tab === "Construction Activities" && (
                    <div className="mt-6 space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <h3 className="text-lg font-semibold text-slate-900">
                        Construction Activities
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 leading-6">
                        The following infrastructure works are proposed or being
                        initiated to strengthen campus facilities.
                        </p>

                        <ul className="mt-4 space-y-3 text-sm text-slate-700 list-disc pl-5">
                        <li>
                            Construction of Academic Block-III (G+2) at an estimated
                            cost of Rs. 17.99 crores.
                        </li>
                        <li>
                            Construction of steps with CC paver path from Boys Hostel
                            to AB-II at a cost of Rs. 18 lakhs.
                        </li>
                        <li>
                            Construction of water tank and pipeline connections at an
                            estimated cost of Rs. 1.20 lakhs.
                        </li>
                        </ul>
                    </div>

                    <StaffSection />
                    </div>
                )}

                {/* ELECTRICAL SECTION */}
                {tab === "PE (Elec) Section" && (
                    <div className="mt-6 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                        <img
                            src={engineerImg}
                            alt="Project Engineer Electrical"
                            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl border border-slate-200"
                        />

                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                            Project Engineer (Electrical)
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 leading-6">
                            The Electrical Section handles electrical maintenance,
                            power-related works, and technical support services
                            across the campus.
                            </p>

                            <p className="mt-3 text-sm text-slate-800">
                            <span className="font-semibold">Project Engineer:</span>{" "}
                            Dr. V. S. Vakula
                            </p>
                        </div>
                        </div>
                    </div>

                    <Table
                        columns={["S.No", "Name", "Designation"]}
                        data={[
                        ["1", "Sri. N. Appa Rao", "Technician"],
                        ["2", "Sri. B. Rama Krishna", "Helper"],
                        ]}
                    />

                    <StaffSection />
                    </div>
                )}

                {/* HOD DESK */}
                {tab === "HoD’s Desk" && (
                    <div className="mt-6 space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <h3 className="text-lg font-semibold text-slate-900">
                        HoD’s Desk
                        </h3>
                        <p className="mt-3 text-sm text-slate-600 leading-7">
                        The Engineering Cell is committed to creating and
                        maintaining quality infrastructure for academic and
                        administrative excellence. Through planned construction,
                        timely maintenance, and technical supervision, the cell
                        supports the institution’s long-term development.
                        </p>
                    </div>

                    <StaffSection />
                    </div>
                )}

                {/* VISION & MISSION */}
                {tab === "Vision & Mission" && (
                    <div className="mt-6 space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Vision
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 leading-7">
                            To develop and maintain high-quality, sustainable, and
                            safe infrastructure that supports academic growth and
                            institutional excellence.
                        </p>
                        </div>

                        <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Mission
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 leading-7">
                            To ensure efficient construction, maintenance, and
                            technical services through proper planning, quality
                            execution, and timely support for all campus facilities.
                        </p>
                        </div>
                    </div>

                    <StaffSection />
                    </div>
                )}
                </div>
            </main>
            </div>
        </section>
        </div>
    );
    }

    function StaffSection() {
    return (
        <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Staff</h3>
        <Table
            columns={["S.No", "Name", "Designation"]}
            data={[
            ["1", "Er. L. Hari Prakash", "Assistant Executive Engineer"],
            ["2", "M.S.R.Ch.S Raju", "Work Inspector (Civil)"],
            ["3", "A. Lakshmana Rao", "Work Inspector (Civil)"],
            ["4", "P. Suneetha", "Work Inspector (Civil)"],
            ["5", "M. Ramana", "Work Inspector (Non-Technical)"],
            ]}
        />
        </div>
    );
    }

    /* ---------------- TABLE ---------------- */
    function Table({ columns, data }: any) {
    return (
        <div className="min-w-0">
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm bg-white">
            <thead className="bg-slate-100">
                <tr>
                {columns.map((c: string, i: number) => (
                    <th
                    key={i}
                    className="p-3 sm:p-4 text-left font-semibold text-slate-700 border-b border-slate-200"
                    >
                    {c}
                    </th>
                ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row: any, i: number) => (
                <tr
                    key={i}
                    className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
                >
                    {row.map((cell: any, j: number) => (
                    <td
                        key={j}
                        className="p-3 sm:p-4 text-slate-700 align-middle"
                    >
                        {cell}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
    }

