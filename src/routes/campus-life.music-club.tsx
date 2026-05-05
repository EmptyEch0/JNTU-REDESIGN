import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

import profileImg from "@/assets/vakula.jpg";
import img1 from "@/assets/culture.jpg";
import img2 from "@/assets/sports.jpg";
import img3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/campus-life/music-club")({
  component: MusicClubPage,
});

function MusicClubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      <PageHero
        title="Music Club"
        subtitle="Campus music activities and performances"
      />

      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT SIDE */}
          <aside className="lg:col-span-4 xl:col-span-3 min-w-0 space-y-4">
            {/* CLUB COORDINATOR */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <img
                src={profileImg}
                alt="Music club coordinator"
                className="w-full h-40 sm:h-48 object-cover"
              />

              <div className="p-5">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-700">
                  Music Club Message
                </p>

                <p className="text-sm text-slate-600 mt-3 leading-6">
                  Music gives a soul to the universe, wings to the mind, flight
                  to the imagination and life to everything.
                </p>

                <p className="text-sm font-semibold text-red-600 mt-4">
                  Smt. B. Nivetha
                </p>
                <p className="text-sm text-slate-600">Club Coordinator</p>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Quick Links
              </h3>

              <div className="space-y-2">
                <button className="w-full text-left rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium hover:bg-blue-700 transition-all duration-300">
                  HoD's Desk
                </button>
                <button className="w-full text-left rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium hover:bg-blue-700 transition-all duration-300">
                  Vision & Mission
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <img
                src={img1}
                alt="Music club event"
                className="w-full h-56 sm:h-72 lg:h-80 object-cover"
              />

              <div className="p-5 sm:p-6 lg:p-8">
                {/* OBJECTIVES */}
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Objective of Music Club
                  </h2>

                  <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5">
                    <li>
                      Offer young people an opportunity for musical expression.
                    </li>
                    <li>Help cultivate interest and appreciation for music.</li>
                    <li>Develop discipline through regular practice sessions.</li>
                    <li>Encourage creativity and performance skills.</li>
                  </ul>
                </div>

                {/* PROCESS TO JOIN */}
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Process to Join
                  </h2>

                  <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5">
                    <li>Students can join through club coordinators.</li>
                    <li>Guidance provided by experienced faculty members.</li>
                    <li>Regular practice sessions scheduled weekly.</li>
                    <li>Participation in campus cultural events and competitions.</li>
                  </ul>
                </div>

                {/* COORDINATORS */}
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Coordinators
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 text-base">
                        Student Coordinators
                      </h3>
                      <p className="text-sm text-slate-700 mt-1">Male: K. Vikas</p>
                      <p className="text-sm text-slate-700">Female: D. Divya</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 text-base">
                        Faculty Coordinator
                      </h3>
                      <p className="text-sm text-slate-700 mt-1">
                        Smt. B. Nivetha
                      </p>
                    </div>
                  </div>
                </div>

                {/* EQUIPMENT */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Equipment
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
      </section>
    </div>
  );
}

/* TABLE COMPONENT */
function Table({ columns, data }: any) {
  return (
    <div className="mt-6">
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
                    className="p-3 sm:p-4 text-slate-700"
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

export default MusicClubPage;