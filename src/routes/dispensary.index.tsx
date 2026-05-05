import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import cultureImg from "@/assets/culture.jpg";

export const Route = createFileRoute("/dispensary/")({
  component: DispensaryPage,
});

/* ---------------- IMAGES ---------------- */
const IMAGES = [
  "/images/disp1.jpg",
  "/images/disp2.jpg",
  "/images/disp3.jpg",
];

/* ---------------- TABS ---------------- */
const TABS = ["Doctors", "Facilities", "Supporting Staff"];

function DispensaryPage() {
  const [tab, setTab] = useState("Doctors");

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-white">
      <PageHero
        title="Dispensary"
        subtitle="Campus medical care & emergency support"
        image={cultureImg}
      />

      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-4 xl:col-span-3 min-w-0 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="w-full h-40 sm:h-48 overflow-hidden">
                <img
                  src="/images/nurse.jpg"
                  alt="Dispensary message"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-blue-700 uppercase">
                  Dispensary Message
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  "MEDICINE means Mercy - Empathy - Care - Integrity"
                </p>

                <p className="mt-4 text-sm font-semibold text-slate-900">
                  M. Sowbhagya Lakshmi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <button className="w-full rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-blue-900 active:scale-[0.99] transition-all duration-300">
                HOD's Desk
              </button>

              <button className="w-full rounded-xl bg-blue-800 text-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-blue-900 active:scale-[0.99] transition-all duration-300">
                Vision & Mission
              </button>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-6">
            <ImageCarousel />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Dispensary
              </h2>

              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-7 max-w-3xl">
                The campus dispensary provides essential medical support, first aid,
                basic medicines, and emergency assistance for students and staff.
              </p>

              {/* TABS */}
              <div className="mt-6 border-b border-slate-200">
                <div className="overflow-x-auto no-scrollbar">
                  <div
                    className="flex min-w-max gap-2 sm:gap-3 pb-2"
                    role="tablist"
                    aria-label="Dispensary sections"
                  >
                    {TABS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        role="tab"
                        aria-selected={tab === t}
                        className={`relative shrink-0 px-4 sm:px-5 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                          tab === t
                            ? "text-blue-700 bg-blue-50"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        {t}
                        <span
                          className={`absolute left-0 bottom-0 h-0.5 bg-blue-700 transition-all duration-300 ${
                            tab === t ? "w-full" : "w-0"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* DOCTORS */}
              {tab === "Doctors" && (
                <div className="mt-6 min-w-0">
                  <Table
                    columns={[
                      "S.No",
                      "Name",
                      "Qualification",
                      "Working Hours",
                      "Photo",
                      "Contact",
                    ]}
                    data={[
                      [
                        "1",
                        "Dr. K. Samba Murthy",
                        "M.B.B.S",
                        "2 Hrs",
                        "/images/doc1.jpg",
                        "9491XXXX",
                      ],
                      [
                        "2",
                        "Dr. G. Sowjanya Devi",
                        "M.B.B.S",
                        "2 Hrs",
                        "/images/doc2.jpg",
                        "9492XXXX",
                      ],
                    ]}
                  />
                </div>
              )}

              {/* FACILITIES */}
              {tab === "Facilities" && (
                <div className="mt-6 space-y-6 min-w-0">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5">
                    <h3 className="text-base font-semibold text-slate-900 mb-3">
                      Available Facilities
                    </h3>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                      <li className="rounded-lg bg-white border border-slate-200 px-4 py-3">
                        First Aid Equipment Available
                      </li>
                      <li className="rounded-lg bg-white border border-slate-200 px-4 py-3">
                        3 Beds Available
                      </li>
                      <li className="rounded-lg bg-white border border-slate-200 px-4 py-3 sm:col-span-2">
                        Medicines Available
                      </li>
                    </ul>
                  </div>

                  <Table
                    columns={["S.No", "Medicine"]}
                    data={[
                      ["1", "Paracetamol"],
                      ["2", "Diclofenac"],
                      ["3", "Ranitidine"],
                      ["4", "ORS"],
                    ]}
                  />
                </div>
              )}

              {/* SUPPORTING STAFF */}
              {tab === "Supporting Staff" && (
                <div className="mt-6 space-y-6 min-w-0">
                  <Table
                    columns={["S.No", "Name", "Qualification", "Contact"]}
                    data={[
                      ["1", "T. Venkata Krishna", "Inter", "9491XXXX"],
                      ["2", "G. Krishna Veni", "Inter", "9492XXXX"],
                    ]}
                  />

                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 sm:p-5">
                    <p className="text-sm sm:text-base font-semibold text-emerald-800">
                      Ambulance: 24/7 Available
                    </p>
                  </div>

                  <Table
                    columns={["S.No", "Driver", "Contact"]}
                    data={[["1", "P. Suresh", "8085XXXX"]]}
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

/* ---------------- CAROUSEL ---------------- */
function ImageCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scroll = (i: number) => {
    if (!ref.current) return;
    const width = ref.current.clientWidth;
    ref.current.scrollTo({ left: width * i, behavior: "smooth" });
    setActive(i);
  };

  useEffect(() => {
    const handleResize = () => scroll(active);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [active]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4 min-w-0 overflow-hidden">
      <div
        ref={ref}
        onScroll={(e: React.UIEvent<HTMLDivElement>) => {
          const w = e.currentTarget.clientWidth;
          setActive(Math.round(e.currentTarget.scrollLeft / w));
        }}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar rounded-xl"
      >
        {IMAGES.map((img, i) => (
          <div key={i} className="min-w-full w-full shrink-0 snap-center">
            <img
              src={img}
              alt={`Dispensary ${i + 1}`}
              className="block w-full h-[220px] sm:h-[300px] lg:h-[380px] object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => scroll(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              active === i
                ? "w-8 h-2.5 bg-blue-700"
                : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- TABLE ---------------- */
function Table({ columns, data }: any) {
  return (
    <div className="min-w-0">
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
                    className="p-3 sm:p-4 text-slate-700 align-middle"
                  >
                    {typeof cell === "string" && cell.includes("/images") ? (
                      <img
                        src={cell}
                        alt="Profile"
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      cell
                    )}
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

export default DispensaryPage;