import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { OTHER_AMENITIES_SUBNAV } from "@/lib/site";

import typeA from "@/assets/faculity-quaters1.jpg";
import guest from "@/assets/guestoffice.jpg";

export const Route = createFileRoute("/other-amenities")({
  component: OtherAmenitiesPage,
});

function OtherAmenitiesPage() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isOverview = path === "/other-amenities";

  return (
    <div className="min-h-screen bg-slate-50/50">
      <PageHero
        title="Other Amenities"
        subtitle="Premium residential and world-class hospitality facilities on campus"
      />

      {/* SUB NAV */}
      <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar justify-start sm:justify-center">
            {OTHER_AMENITIES_SUBNAV.map((item) => {
              const active = path === item.to || path.startsWith(item.to + "/");

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-300 border ${
                    active
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:text-primary hover:border-primary/40 hover:bg-slate-50/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {isOverview ? (
        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 animate-[fade-in_0.5s_ease-out]">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              On-Campus Residential & Hospitality
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
              JNTU-GV provides secure, comfortable, and well-maintained residential and
              lodging spaces. These facilities guarantee comfort, proximity to work,
              and a vibrant academic ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* STAFF QUARTERS */}
            <Link
              to="/other-amenities/staff-quarters"
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={typeA}
                  alt="Staff Quarters"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary tracking-wide uppercase">
                  Welfare
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                    Staff Quarters
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    Comfortable and fully-serviced residential accommodation is provided
                    for non-teaching and support staff members, promoting a tight-knit community.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore Details <span>&rarr;</span>
                </div>
              </div>
            </Link>


            {/* GUEST HOUSE */}
            <Link
              to="/other-amenities/guest-house"
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 md:col-span-2 lg:col-span-1"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={guest}
                  alt="Guest House"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary tracking-wide uppercase">
                  Hospitality
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                    Guest House
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    A world-class lodging facility offering VIP suites and executive rooms
                    for visiting dignitaries, speakers, and external examiners.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore Details <span>&rarr;</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Outlet />
        </section>
      )}
    </div>
  );
}

export default OtherAmenitiesPage;