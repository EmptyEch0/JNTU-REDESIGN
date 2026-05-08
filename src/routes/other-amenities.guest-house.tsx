import { createFileRoute } from "@tanstack/react-router";
import guestImg from "@/assets/guestoffice.jpg";

export const Route = createFileRoute("/other-amenities/guest-house")({
  component: GuestHousePage,
});

function GuestHousePage() {
  return (
    <div className="bg-white min-h-screen animate-[fade-in_0.5s_ease-out]">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-sm text-gray-800">
        <div className="border-b border-primary/20 pb-3">
          <h1 className="text-3xl font-bold text-primary tracking-tight">Guest House</h1>
        </div>

        <div className="space-y-6 text-base leading-relaxed text-slate-600 text-justify">
          <p>
            The JNTU-GV Guest House stands as a testament to the university's commitment to academic
            hospitality. Designed to be a professional yet comfortable haven, it provides high-quality
            temporary accommodation for visiting professors, distinguished scholars, administrative
            officials, and participants of national and international conferences.
          </p>

          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-3">
            <h3 className="text-blue-700 font-bold text-lg">Features and Amenities</h3>
            <p className="text-slate-600">
              The facility offers well-appointed rooms, including <b>AC and non-AC suites</b>, meticulously
              maintained to provide a quiet and productive environment. Its strategic location near the
              Central Administrative Building and Academic Blocks ensures seamless convenience for guests
              engaged in official interactions and academic collaborations.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-3">
            <h3 className="text-blue-700 font-bold text-lg">A Hub for Academic Collaboration</h3>
            <p className="text-slate-600">
              Serving as a "home away from home," the Guest House plays a crucial role in fostering
              scholarship and networking. With dedicated meeting spaces and a commitment to hospitality,
              it reflects the university's dedication to supporting all academic pursuits in a prestigious
              setting.
            </p>
          </div>
        </div>

        <div className="pt-6 flex justify-center">
          <div className="relative group overflow-hidden rounded-2xl border-2 border-primary/20 shadow-lg w-full max-w-2xl">
            <img
              src={guestImg}
              alt="University Guest House"
              className="w-full h-[380px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-bold text-lg">JNTU-GV VIP Guest House</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

