import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

import img1 from "@/assets/culture.jpg";
import img2 from "@/assets/campus-life.jpg";
import img3 from "@/assets/sports.jpg";

export const Route = createFileRoute("/campus-life/student-activity-club")({
  component: StudentActivityClubPage,
});

function StudentActivityClubPage() {
  return (
    <div className="bg-white min-h-screen">

      <PageHero title="Student Activity Club" subtitle="" />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-16 text-[13px]">

        {/* -------- VYKYA CLUB -------- */}
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="font-semibold text-blue-800 mb-2">
              VYKYA CLUB
            </h2>
            <p>
              Vykya is a student club run by ECE students. Its main objective is
              to improve communication skills among students. Students are encouraged
              to speak on latest topics and participate in discussions regularly.
            </p>
          </div>

          <img src={img1} className="w-full h-56 object-cover" />
        </div>

        {/* -------- CONSTELLE -------- */}
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <img src={img2} className="w-full h-56 object-cover" />

          <div>
            <h2 className="font-semibold text-blue-800 mb-2">
              CONSTELLE
            </h2>
            <p>
              Constelle is a student club run by CSE students. It conducts
              various activities like coding events, paper presentations,
              poster presentations, weekend talks, and magazine preparation.
            </p>
          </div>
        </div>

        {/* -------- YOGA CLUB -------- */}
        <div className="grid md:grid-cols-2 gap-6 items-center">

          <div className="flex flex-col items-start">
            <img
              src={img3}
              className="w-40 h-40 rounded-full object-cover mb-4"
            />

            <h2 className="font-semibold text-blue-800 mb-2">
              YOGA CLUB
            </h2>

            <p>
              Keeping in view students’ mental and physical health, the Yoga Club
              was initiated to promote wellness. Regular sessions help students
              improve focus, reduce stress, and maintain physical fitness.
            </p>
          </div>

          <img src={img3} className="w-full h-56 object-cover" />
        </div>

      </div>
    </div>
  );
}
