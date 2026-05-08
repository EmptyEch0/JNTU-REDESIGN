import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { getSportsData } from "@/funcs/sports.server";
import { Award, Users, Shield, Trophy, MapPin, Mail, Phone, Image as ImageIcon, BookOpen } from "lucide-react";

export const Route = createFileRoute("/sports")({
  loader: async () => await getSportsData(),
  component: SportsPage,
});

const TABS = [
  { name: "Overview", icon: BookOpen },
  { name: "Staff & Team", icon: Users },
  { name: "Achievements", icon: Trophy },
  { name: "Play Fields", icon: MapPin },
  { name: "Gymnasium", icon: Shield },
  { name: "Gallery", icon: ImageIcon },
];

function SportsPage() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState("Overview");

  const images = data?.images || [];
  const sportsContentList = Array.isArray(data?.info) ? data?.info : [];

  // Get coordinators from sportsContentList
  const coordinators = sportsContentList.filter((item: any) =>
    item.designation?.toLowerCase().includes("coordinator")
  );

  // If none explicitly matching, fallback to all content list items
  const displayPeople = coordinators.length > 0 ? coordinators : sportsContentList;

  const welcomeMessage = (msg: string) => {
    if (!msg || msg === "---" || msg.trim() === "") {
      return "Welcome to the Department of Physical Education and Sports. We believe in nurturing a healthy mind in a healthy body through regular physical activity, training bootcamps, and competitive athletic events. Our state-of-the-art play fields and gymnasium are open to all residential and day scholar students to cultivate physical fitness, excellence, and exceptional sportsmanship.";
    }
    return msg;
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-16">
      <PageHero
        eyebrow="Athletics & Recreation"
        title="Sports & Physical Education"
        subtitle="Inculcating discipline, team spirit, and excellence through robust sports infrastructure and coaching."
        image={images?.length ? images[0].url : undefined}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Elegant Side Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">
                Sports Menu
              </h3>
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => setTab(t.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      active
                        ? "bg-slate-900 text-white shadow-md shadow-slate-950/10 scale-[1.01]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-[#d4af37]" : "text-slate-400"}`} />
                    {t.name}
                  </button>
                );
              })}
            </div>

            {/* Quick Contact Info */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Department Office
              </h4>
              <div className="space-y-3 text-sm text-slate-600">
                <p className="leading-relaxed">
                  JNTU-GV University College of Engineering, Vizianagaram – 535003, A.P., India.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>08922-277918</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-xs break-all">phyedu@jntukucev.ac.in</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN PANEL ================= */}
          <main className="lg:col-span-9 space-y-10">

            {/* ================= OVERVIEW TAB ================= */}
            {tab === "Overview" && (
              <div className="space-y-10">
                
                {/* Introduction */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#d4af37]" />
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Department of Physical Education & Sports
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    The Department of Physical Education plays a key role in the overall development of our students' personality. 
                    With a firm belief that athletic participation builds integrity, resilience, and collaboration, the university provides excellent infrastructure, 
                    modern training equipment, and opportunities to represent the institution at state, zone, and national levels.
                  </p>
                </div>

                {/* Coordinators / Personnel Carousel */}
                <div className="grid md:grid-cols-2 gap-6">
                  {displayPeople.map((person: any) => (
                    <div key={person.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="p-6 space-y-4">
                        <div className="flex gap-4 items-start">
                          <img
                            src={person.img || "/fallback.jpg"}
                            alt={person.name}
                            className="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-100 shrink-0"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/fallback.jpg";
                            }}
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">
                              {person.name}
                            </h4>
                            <p className="text-[11px] text-[#d4af37] font-semibold uppercase tracking-wider mt-0.5">
                              {person.designation}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {person.qualification}
                            </p>
                          </div>
                        </div>

                        <p className="text-slate-600 text-xs leading-relaxed italic border-t border-slate-100 pt-3">
                          "{welcomeMessage(person.message)}"
                        </p>
                      </div>

                      <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {person.email?.split(",")?.[0]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {person.phone?.split("/")?.[0]?.trim()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= STAFF & TEAM TAB ================= */}
            {tab === "Staff & Team" && (
              <div className="space-y-10">
                {/* Faculty Card Display */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-hidden">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 px-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-400" />
                    Physical Education Faculty
                  </h3>
                  <Table
                    columns={["S.No", "Name", "Designation"]}
                    data={(data?.faculty || []).map((f: any, i: number) => [
                      i + 1,
                      f.name,
                      f.designation,
                    ])}
                  />
                </div>

                {/* Non Teaching */}
                {data?.nonTeaching?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 px-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-slate-400" />
                      Supporting / Non-Teaching Staff
                    </h3>
                    <Table
                      columns={["S.No", "Name", "Designation"]}
                      data={(data?.nonTeaching || []).map((n: any, i: number) => [
                        i + 1,
                        n.name,
                        n.designation,
                      ])}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ================= ACHIEVEMENTS TAB ================= */}
            {tab === "Achievements" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 mb-4 px-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-slate-400" />
                  Recent Sports Achievements & Accolades
                </h3>
                <Table
                  columns={["S.No", "Student Name", "Branch", "Game / Event", "Tournament Name", "Venue"]}
                  data={(data?.achievements || []).map((a: any, i: number) => [
                    i + 1,
                    a.student,
                    a.branch,
                    a.game,
                    a.tournament,
                    a.venue,
                  ])}
                />
              </div>
            )}

            {/* ================= PLAY FIELDS TAB ================= */}
            {tab === "Play Fields" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 mb-4 px-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  Outdoor & Indoor Playfields
                </h3>
                <Table
                  columns={["S.No", "Field / Court Name", "Quantity Available"]}
                  data={(data?.fields || []).map((f: any, i: number) => [
                    i + 1,
                    f.name,
                    f.qty,
                  ])}
                />
              </div>
            )}

            {/* ================= GYMNASIUM TAB ================= */}
            {tab === "Gymnasium" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 mb-4 px-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-slate-400" />
                  Gymnasium Equipment & Infrastructure
                </h3>
                <Table
                  columns={["S.No", "Equipment Name", "Quantity Available", "Estimated Cost"]}
                  data={(data?.gym || []).map((g: any, i: number) => [
                    i + 1,
                    g.name,
                    g.qty,
                    g.cost,
                  ])}
                />
              </div>
            )}

            {/* ================= GALLERY TAB ================= */}
            {tab === "Gallery" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                    Campus Athletic Moments
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    A glimpse into our training camps, annual tournaments, and physical fitness activities.
                  </p>

                  {images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img: any) => (
                        <div key={img.id} className="relative group overflow-hidden rounded-xl border border-slate-100 aspect-[4/3] bg-slate-50">
                          <img
                            src={img.url}
                            alt="Athletic Moment"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400 italic text-sm">
                      No gallery images uploaded.
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ================= PREMIUM TABLE ================= */
function Table({ columns, data }: any) {
  if (!data.length) {
    return (
      <div className="text-center py-8 text-slate-400 italic text-sm">
        No record available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {columns.map((c: string, i: number) => (
              <th key={i} className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, i: number) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition duration-150">
              {row.map((cell: any, j: number) => (
                <td key={j} className="p-4 text-sm font-medium text-slate-700">
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

export default SportsPage;