    import { createFileRoute } from "@tanstack/react-router";
    import { PageHero } from "@/components/PageHero";

    import canteenImg from "@/assets/culture.jpg";

    export const Route = createFileRoute("/canteen")({
    component: CanteenPage,
    });

    function CanteenPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
        <PageHero
            title="Canteen"
            subtitle="Dining facilities and food services"
            image={canteenImg}
        />

        <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="max-w-4xl mx-auto space-y-6">

            {/* IMAGE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <img
                src={canteenImg}
                alt="Canteen"
                className="w-full h-[200px] sm:h-[300px] md:h-[380px] object-cover"
                />
            </div>

            {/* CONTENT CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-8 space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Campus Canteen
                </h2>

                <blockquote className="border-l-4 border-blue-400 pl-4 italic text-sm sm:text-base text-slate-500 leading-relaxed">
                "Food for brain is supplied in classrooms and food for body is
                supplied at cafeteria."
                </blockquote>

                <p className="text-sm sm:text-base text-slate-600 leading-7">
                JNTUK University College of Engineering has a spacious and clean
                canteen that caters to the taste of all students. The canteen
                conveniently accommodates a large number of students at a time and
                is well maintained with efficient service on campus.
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-7">
                The canteen is furnished with modern facilities and provides hot
                lunch, snacks, and beverages for both students and staff at
                reasonable rates. It remains open on all working days, serving
                beverages of different flavours according to seasons.
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-7">
                The spacious cafeteria offers varieties of delicious and hygienic
                food. Apart from breakfast, lunch, and dinner, students can have
                snacks, tea, coffee, soft drinks and confectionery. A team of
                experienced members closely monitors food quality. Separate cabins
                are available for faculty and students, and a fresh-choice bakery
                outlet is also available within the campus.
                </p>

                {/* HIGHLIGHTS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                {[
                    { label: "Seating Capacity", value: "Large" },
                    { label: "Cuisine", value: "Veg & Non-Veg" },
                    { label: "Open on", value: "All Working Days" },
                ].map((item) => (
                    <div
                    key={item.label}
                    className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center"
                    >
                    <div className="text-base font-bold text-slate-900">{item.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </section>
        </div>
    );
    }