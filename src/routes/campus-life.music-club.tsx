import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { CAMPUS_LIFE_SUBNAV } from "@/lib/site";

import profileImg from "@/assets/vakula.jpg";
import img1 from "@/assets/culture.jpg";
import img2 from "@/assets/sports.jpg";
import img3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/campus-life/music-club")({
  component: MusicClubPage,
});

function MusicClubPage() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen overflow-x-hidden">
      <PageHero title="Music Club" subtitle="Campus music activities and performances" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 px-4 py-8 sm:py-12">
        {/* LEFT SIDEBAR */}
        <aside className="md:col-span-4 lg:col-span-3 min-w-0 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="w-full h-48 overflow-hidden">
              <img src={profileImg} className="w-full h-full object-cover" alt="Club Coordinator" />
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-blue-700 uppercase">
                Music Club Message
              </p>

              <p className="mt-3 text-sm italic leading-relaxed text-slate-600">
                "Music gives a soul to the universe, wings to the mind, flight to the imagination and life to everything."
              </p>

              <p className="mt-4 text-sm font-bold text-slate-900">Smt. B. Nivetha</p>
              <p className="text-xs text-slate-500">Club Coordinator</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button className="w-full rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all">
              HoD's Desk
            </button>
            <button className="w-full rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all">
              Vision & Mission
            </button>
          </div>

          {/* CAMPUS LIFE SUB-NAVIGATION */}
          <div className="grid gap-2 mt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2 mb-2">Campus Life</h3>
            {CAMPUS_LIFE_SUBNAV.map((link) => {
              const active = path === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active 
                      ? "bg-blue-800 text-white shadow-md pointer-events-none" 
                      : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 active:scale-[0.98]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="md:col-span-8 lg:col-span-9 min-w-0 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <img src={img1} className="w-full h-48 sm:h-64 object-cover" alt="Music Club Event" />

            <div className="p-5 sm:p-8 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
              
              {/* OBJECTIVES */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                  Objective of Music Club
                </h2>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Offer young people an opportunity for musical expression.</li>
                  <li>Help cultivate interest and appreciation for music.</li>
                  <li>Develop discipline through regular practice sessions.</li>
                  <li>Encourage creativity and performance skills.</li>
                </ul>
              </div>

              {/* PROCESS */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                  Process to Join
                </h2>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Students can join through club coordinators.</li>
                  <li>Guidance provided by experienced faculty members.</li>
                  <li>Regular practice sessions scheduled weekly.</li>
                  <li>Participation in campus cultural events and competitions.</li>
                </ul>
              </div>

              {/* COORDINATORS */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                  Coordinators
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h3 className="font-semibold text-slate-900 mb-3">Student Coordinators</h3>
                    <p className="text-slate-600">Male: <span className="font-medium text-slate-900">K. Vikas</span></p>
                    <p className="text-slate-600 mt-1">Female: <span className="font-medium text-slate-900">D. Divya</span></p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-3">Faculty Coordinator</h3>
                    <p className="text-blue-800">Smt. B. Nivetha</p>
                  </div>
                </div>
              </div>

              {/* EQUIPMENT */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                  Equipment Available
                </h2>
                <Table
                  columns={["S.No", "Item", "Cost"]}
                  data={[
                    ["1", "Keyboard", "₹10,000"],
                    ["2", "Guitar", "₹8,000"],
                    ["3", "Drum set", "₹15,000"],
                    ["4", "Violin", "₹3,500"],
                  ]}
                />
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

export default MusicClubPage;