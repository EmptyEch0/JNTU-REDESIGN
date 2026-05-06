import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";

import heroImg from "@/assets/hero-3.jpg";
import profileImg from "@/assets/vakula.jpg";

export const Route = createFileRoute("/women-empowerment")({
  component: WomenPage,
});

const TABS = [
  "About WEGC",
  "WEGC Team",
  "Activities & Events",
  "Recreation Club",
  "Magazine",
];

function WomenPage() {
  const [tab, setTab] = useState("About WEGC");

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen overflow-x-hidden">
      <PageHero title="Women's Grievances Cell" subtitle="A safe, supportive and ambitious environment for women on campus." />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 px-4 py-8 sm:py-12">
        {/* LEFT SIDEBAR */}
        <aside className="md:col-span-4 lg:col-span-3 min-w-0 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="w-full h-48 overflow-hidden">
              <img src={profileImg} className="w-full h-full object-cover" alt="Convener" />
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-blue-700 uppercase">
                WEGC Message
              </p>

              <p className="mt-3 text-sm italic leading-relaxed text-slate-600">
                "A woman with a creative voice is by definition an innovative strong woman"
              </p>

              <p className="mt-4 text-sm font-bold text-slate-900">Dr. G. Jaya Suma</p>
              <p className="text-xs text-slate-500">Convener WEGC</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
            <button className="w-full rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all">
              HoD's Desk
            </button>
            <button className="w-full rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all">
              Vision & Mission
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="md:col-span-8 lg:col-span-9 min-w-0 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <img src={heroImg} className="w-full h-48 sm:h-64 object-cover" alt="Women Empowerment" />

            <div className="p-4 sm:p-6 lg:p-8 min-w-0">
              {/* TABS */}
              <div className="border-b border-slate-200">
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex min-w-max gap-2 sm:gap-3 pb-2" role="tablist">
                    {TABS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        role="tab"
                        aria-selected={tab === t}
                        className={`relative shrink-0 px-4 sm:px-5 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                          tab === t
                            ? "text-blue-700 bg-blue-50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {t}
                        {tab === t && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 rounded-t-md"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="mt-6 sm:mt-8 text-sm sm:text-base text-slate-700 leading-relaxed">
                
                {/* ---------------- ABOUT ---------------- */}
                {tab === "About WEGC" && (
                  <div className="space-y-6">
                    <blockquote className="border-l-4 border-blue-400 pl-4 italic text-slate-600 font-medium">
                      "Empowered women transform Society"
                    </blockquote>

                    <p>
                      The Women Empowerment and Grievance Cell (WEGC) aims to empower and safeguard
                      women students and staff. It promotes awareness, leadership, and provides
                      a platform to discuss issues.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mt-6">
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Vision</h3>
                        <p className="text-sm">To enable women to become professionally competent and socially responsible.</p>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Mission</h3>
                        <p className="text-sm">To provide opportunities for skill development and leadership.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 mb-3 text-lg">Objectives</h3>
                      <ul className="list-disc ml-5 space-y-2">
                        <li>Develop decision-making skills</li>
                        <li>Encourage participation in all areas</li>
                        <li>Promote leadership and awareness</li>
                        <li>Organize gender sensitization programs</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* ---------------- TEAM ---------------- */}
                {tab === "WEGC Team" && (
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Executive Committee Members</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { name: "Dr. G. Jaya Suma", role: "Convener" },
                        { name: "Smt. M. Hema", role: "Secretary" },
                        { name: "Dr. V. S. Vakula", role: "Joint Secretary" },
                        { name: "Dr. P. Aruna Kumari", role: "Treasurer" },
                      ].map((member) => (
                        <div key={member.name} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
                          <span className="font-semibold text-slate-900">{member.name}</span>
                          <span className="text-sm text-slate-500 mt-1">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ---------------- ACTIVITIES ---------------- */}
                {tab === "Activities & Events" && (
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Recent Programs</h3>
                    <Table
                      columns={["S.No", "Program", "Date"]}
                      data={[
                        ["1", "Women Empowerment Seminar", "05-03-2014"],
                        ["2", "Medical Camp", "20-02-2016"],
                        ["3", "Workshop on Skill Development", "24-07-2016"],
                      ]}
                    />
                  </div>
                )}

                {/* ---------------- RECREATION ---------------- */}
                {tab === "Recreation Club" && (
                  <div className="space-y-6">
                    <p>
                      Recreation activities improve emotional and physical well-being.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
                        <img src={heroImg} className="h-48 sm:h-56 object-cover w-full hover:scale-105 transition-transform duration-500" alt="Recreation 1" />
                      </div>
                      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
                        <img src={heroImg} className="h-48 sm:h-56 object-cover w-full hover:scale-105 transition-transform duration-500" alt="Recreation 2" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- MAGAZINE ---------------- */}
                {tab === "Magazine" && (
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Magazine - Yuthika</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {["Yuthika Issue 1", "Yuthika Issue 2"].map((issue) => (
                        <div key={issue} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            #
                          </div>
                          <span className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* TABLE */
function Table({ columns, data }: { columns: string[], data: any[][] }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 shadow-sm mt-4">
      <table className="w-full text-sm sm:text-base text-left bg-white whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((c: string, i: number) => (
              <th key={i} className="p-4 font-semibold text-slate-700">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row: any[], i: number) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              {row.map((cell: any, j: number) => (
                <td key={j} className="p-4 text-slate-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WomenPage;
