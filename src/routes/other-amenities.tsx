    import {
    createFileRoute,
    Link,
    Outlet,
    useRouterState,
    } from "@tanstack/react-router";
    import { PageHero } from "@/components/PageHero";
    import { OTHER_AMENITIES_SUBNAV } from "@/lib/site";

    import typeA from "@/assets/campus-life.jpg";
    import typeB from "@/assets/campus-map.png";
    import guest from "@/assets/hero-2.jpg";

    export const Route = createFileRoute("/other-amenities")({
    component: OtherAmenitiesPage,
    });

    function OtherAmenitiesPage() {
    const path = useRouterState({ select: (s) => s.location.pathname });
    const isOverview = path === "/other-amenities";

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <PageHero
            title="Other Amenities"
            subtitle="Residential and hospitality facilities on campus"
        />

        {/* SUB NAV */}
        <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 sm:gap-2 overflow-x-auto py-2 sm:py-3 no-scrollbar">
                {OTHER_AMENITIES_SUBNAV.map((item) => {
                const active = path === item.to || path.startsWith(item.to + "/");

                return (
                    <Link
                    key={item.to}
                    to={item.to}
                    className={`shrink-0 rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        active
                        ? "bg-blue-800 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
            <section className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900">
                Other Amenities
                </h2>

                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-7 max-w-3xl">
                The institution provides residential and hospitality facilities
                within the campus to support staff members and official guests.
                These amenities ensure convenience, comfort, and better campus life.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* STAFF QUARTERS */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <img
                    src={typeA}
                    alt="Staff quarters"
                    className="w-full h-48 sm:h-64 object-cover"
                    />
                    <div className="p-4 sm:p-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Staff Quarters
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-6">
                        Comfortable residential accommodation is provided for staff
                        members within the campus, helping them stay close to academic
                        and administrative facilities.
                    </p>
                    </div>
                </div>

                {/* FACULTY QUARTERS */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <img
                    src={typeB}
                    alt="Faculty quarters"
                    className="w-full h-48 sm:h-64 object-cover"
                    />
                    <div className="p-4 sm:p-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Faculty Quarters
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-6">
                        Dedicated faculty quarters and residential blocks are
                        available to support long-term accommodation for teaching
                        staff and campus officers.
                    </p>
                    </div>
                </div>

                {/* GUEST HOUSE */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm sm:col-span-2 lg:col-span-1">
                    <img
                    src={guest}
                    alt="Guest house"
                    className="w-full h-48 sm:h-64 object-cover"
                    />
                    <div className="p-4 sm:p-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Guest House
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-6">
                        The campus guest house offers a comfortable stay for visiting
                        scholars, academic experts, dignitaries, and official guests.
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </section>
        ) : (
            <section className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
            </section>
        )}
        </div>
    );
    }

    export default OtherAmenitiesPage;