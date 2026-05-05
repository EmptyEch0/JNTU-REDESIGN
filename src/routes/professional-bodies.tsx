import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";

import heroImg from "@/assets/campus-life.jpg";

export const Route = createFileRoute("/professional-bodies")({
  component: ProfessionalBodiesPage,
});

const TABS = ["CSI", "IEEE", "IE", "IETE", "IIM"];



function ProfessionalBodiesPage() {
  const [tab, setTab] = useState("CSI");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      <PageHero
        title="Professional Bodies"
        subtitle="Student chapters, technical engagement, and professional development"
        image={heroImg}
      />
      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto">
          <main className="space-y-6 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <img
            src={heroImg}
            alt="Professional bodies activities"
            className="w-full h-[220px] sm:h-[300px] lg:h-[380px] object-cover"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Professional Bodies
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-7">
            Professional bodies help students build technical knowledge,
            industry exposure, leadership skills, and participation in
            seminars, workshops, contests, and chapter activities.
          </p>

          {/* TABS */}
          <div className="mt-6 border-b border-slate-200 overflow-x-auto">
            <div className="flex min-w-max gap-2 sm:gap-3 pb-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${tab === t
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                >
                  {t}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-blue-700 transition-all duration-300 ${tab === t ? "w-full" : "w-0"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* CSI */}
          {tab === "CSI" && (
            <div className="mt-6 space-y-5">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Computer Society of India (CSI)
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-700 leading-7">
                  JNTUK UCEV Vizianagaram has CSI institutional membership.
                  The chapter supports research, technical learning,
                  knowledge sharing, and career enhancement through events
                  and academic engagement.
                </p>
              </div>

              <Table
                columns={["S.No", "Event", "Date", "Participants"]}
                data={[
                  ["1", "PHP Workshop", "2014", "150 Students"],
                  ["2", "Technical Paper Contest", "2016", "120 Students"],
                  ["3", "Faculty Development Program", "2020", "200 Participants"],
                ]}
              />
            </div>
          )}

          {/* IEEE */}
          {tab === "IEEE" && (
            <div className="mt-6">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  IEEE Student Chapter
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-700 leading-7">
                  IEEE is one of the world’s largest professional
                  associations dedicated to advancing technology. Student
                  chapters provide technical exposure, networking
                  opportunities, and access to innovation-oriented events.
                </p>
              </div>
            </div>
          )}

          {/* IE */}
          {tab === "IE" && (
            <div className="mt-6 space-y-5">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Institution of Engineers (IE)
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-700 leading-7">
                  The Institution of Engineers chapter promotes engineering
                  excellence, professional recognition, and faculty and
                  student participation in technical development activities.
                </p>
              </div>

              <Table
                columns={["S.No", "Faculty Name", "Membership No"]}
                data={[
                  ["1", "Dr. G. Swami Naidu", "F-120467"],
                  ["2", "Dr. M. Naga Rao", "M-140901"],
                ]}
              />
            </div>
          )}

          {/* IETE */}
          {tab === "IETE" && (
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Total Students</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">67</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Activity Period</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    2019–2020
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* IIM */}
          {tab === "IIM" && (
            <div className="mt-6 space-y-5">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  IIM Activities
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-700 leading-7">
                  This section highlights workshops, symposiums, and other
                  technical events conducted under the IIM-related activity
                  stream for student exposure and academic development.
                </p>
              </div>

              <Table
                columns={["Year", "Event", "Date"]}
                data={[
                  ["2019", "Workshop on Materials", "Aug 2019"],
                  ["2018", "National Symposium", "Mar 2018"],
                ]}
              />
            </div>
          )}
        </div>
      </main>
        </div>
      </section>
    </div>
  );
}

/* TABLE COMPONENT */
function Table({ columns, data }: any) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
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
                <td key={j} className="p-3 sm:p-4 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfessionalBodiesPage;