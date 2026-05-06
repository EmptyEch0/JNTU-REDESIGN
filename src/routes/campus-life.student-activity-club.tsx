import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { CAMPUS_LIFE_SUBNAV } from "@/lib/site";

import img1 from "@/assets/culture.jpg";
import img2 from "@/assets/campus-life.jpg";
import img3 from "@/assets/sports.jpg";

export const Route = createFileRoute("/campus-life/student-activity-club")({
  component: StudentActivityClubPage,
});

function StudentActivityClubPage() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen overflow-x-hidden">
      <PageHero title="Student Activity Clubs" subtitle="Fostering communication, technical skills, and physical well-being." />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 px-4 py-8 sm:py-12">
        {/* LEFT SIDEBAR */}
        <aside className="md:col-span-4 lg:col-span-3 min-w-0 space-y-6">
          
          <div className="grid grid-cols-1 gap-3">
            <button className="w-full rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all">
              HoD's Desk
            </button>
            <button className="w-full rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all">
              Vision & Mission
            </button>
          </div>

          {/* CAMPUS LIFE SUB-NAVIGATION */}
          <div className="grid gap-2">
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
        <main className="md:col-span-8 lg:col-span-9 min-w-0 space-y-12 sm:space-y-16 text-sm sm:text-base text-slate-700 leading-relaxed">

          {/* -------- VYKYA CLUB -------- */}
          <section className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="order-2 md:order-1">
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wider uppercase">
                Communication & Debate
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                VYKYA CLUB
              </h2>
              <p>
                Vykya is a vibrant student club run by ECE students. Its main objective is
                to improve communication skills among students. Students are encouraged
                to speak on the latest topics, participate in discussions, and build the 
                confidence required for public speaking and leadership.
              </p>
            </div>

            <div className="order-1 md:order-2 rounded-xl overflow-hidden">
              <img src={img1} className="w-full h-56 sm:h-64 object-cover" alt="Vykya Club" />
            </div>
          </section>

          {/* -------- CONSTELLE -------- */}
          <section className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="rounded-xl overflow-hidden">
              <img src={img2} className="w-full h-56 sm:h-64 object-cover" alt="Constelle Club" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold tracking-wider uppercase">
                Technology & Development
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                CONSTELLE
              </h2>
              <p>
                Constelle is an active student club run by CSE students. It conducts
                various technical and creative activities such as coding events, paper presentations,
                poster presentations, weekend tech talks, and departmental magazine preparation.
              </p>
            </div>
          </section>

          {/* -------- YOGA CLUB -------- */}
          <section className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="order-2 md:order-1">
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-teal-100 text-teal-800 text-xs font-bold tracking-wider uppercase">
                Health & Wellness
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                YOGA CLUB
              </h2>

              <p>
                Keeping in view students’ mental and physical health, the Yoga Club
                was initiated to promote wellness across the campus. Regular morning and evening sessions help students
                improve focus, reduce academic stress, and maintain holistic physical fitness.
              </p>
            </div>

            <div className="order-1 md:order-2 rounded-xl overflow-hidden">
              <img src={img3} className="w-full h-56 sm:h-64 object-cover" alt="Yoga Practice" />
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default StudentActivityClubPage;
