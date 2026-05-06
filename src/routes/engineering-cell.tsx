import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { getEngineeringData } from "@/funcs/engineer.server";

export const Route = createFileRoute("/engineering-cell")({
  loader: async () => await getEngineeringData(),
  component: EngineeringCellPage,
});

const TABS = [
  "Construction Activities",
  "PE (Elec) Section",
  "Vision & Mission",
];

function EngineeringCellPage() {
  const data = Route.useLoaderData() as any;

  const [tab, setTab] = useState(
    "Construction Activities"
  );

  const content = data?.content || {};
  const construction = data?.construction || [];

  /* ✅ FULLY FROM BACKEND */
  const electrical = data?.electrical || {};

  const civilStaff = data?.civilStaff || [];
  const electricalStaff =
    data?.electricalStaff || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lora:wght@400;500;600&display=swap');

        :root {
          --luxury-dark: #1a1a1a;
          --luxury-gold: #d4af37;
          --luxury-light: #f8f5f0;
          --luxury-gray: #4a4a4a;
        }

        .premium-container {
          font-family: 'Lora', serif;
        }

        .font-display {
          font-family: 'Playfair Display', serif;
        }

        .premium-tab-btn {
          width: 100%;
          text-align: left;
          padding: 14px 20px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 10px;
          margin-bottom: 8px;
          transition: 0.3s ease;
        }

        .premium-tab-active {
          background: linear-gradient(
            135deg,
            var(--luxury-gold),
            #e6c200
          );
          color: black;
        }

        .premium-tab-inactive {
          background: var(--luxury-light);
          color: var(--luxury-gray);
          border: 1px solid #e0d5c7;
        }

        .premium-card {
          background: white;
          border-radius: 14px;
          padding: 24px;
          border: 1px solid #e0d5c7;
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .premium-table {
          width: 100%;
          border-collapse: collapse;
        }

        .premium-table th {
          background: #f5f5f5;
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
          font-weight: 700;
        }

        .premium-table td {
          padding: 12px;
          border: 1px solid #ddd;
        }

        .premium-table tr:nth-child(even) {
          background: #fafafa;
        }
      `}</style>

      {/* HERO */}
      <PageHero
        title={
          content?.title || "Engineering Cell"
        }
        subtitle="Construction, maintenance & technical operations."
        image={
          electrical?.img || "/fallback.jpg"
        }
      />

      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 px-4 py-10 premium-container">

        {/* SIDEBAR */}
        <aside className="md:col-span-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`premium-tab-btn ${
                tab === t
                  ? "premium-tab-active"
                  : "premium-tab-inactive"
              }`}
            >
              {t}
            </button>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="md:col-span-9 space-y-6">

          {/* OVERVIEW */}
          <div className="premium-card">
            <h2 className="section-title">
              Overview
            </h2>

            <p className="leading-relaxed text-[15px]">
              {content?.description ||
                "No description available"}
            </p>
          </div>

          {/* ================= CONSTRUCTION ================= */}
          {tab ===
            "Construction Activities" && (
            <div className="space-y-6">

              {/* ACTIVITIES */}
              <div className="premium-card">
                <h2 className="section-title">
                  Construction Activities
                </h2>

                {!construction.length ? (
                  <p>
                    No construction activities
                    available.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {construction.map(
                      (
                        item: string,
                        i: number
                      ) => (
                        <li
                          key={i}
                          className="leading-relaxed"
                        >
                          ✦ {item}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>

              {/* CIVIL STAFF */}
              <StaffSection
                title="Engineering Cell Staff"
                staff={civilStaff}
              />
            </div>
          )}

          {/* ================= ELECTRICAL ================= */}
          {tab === "PE (Elec) Section" && (
            <div className="grid md:grid-cols-12 gap-8">

              {/* LEFT PROFILE CARD */}
              <div className="md:col-span-4">

                <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">

                  <div className="h-1.5 bg-red-600" />

                  <div className="p-5">

                    {/* IMAGE */}
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={
                          electrical?.img ||
                          "/fallback.jpg"
                        }
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/fallback.jpg";
                        }}
                        alt={
                          electrical?.engineer ||
                          "Engineer"
                        }
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="mt-5 text-center">

                      {/* ✅ PADMAJA FROM DB */}
                      <h3 className="font-display text-red-600 text-2xl font-bold">
                        {electrical?.engineer ||
                          "Project Engineer"}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {electrical?.name ||
                          "Project Engineer"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT DETAILS */}
              <div className="md:col-span-8 space-y-6">

                {/* SECTION INFO */}
                <div className="premium-card">

                  <h2 className="font-display text-2xl font-bold uppercase">
                    {electrical?.title ||
                      "Electrical Section"}
                  </h2>

                  <p className="mt-3 leading-relaxed">
                    {electrical?.description ||
                      "No description available"}
                  </p>

                  <div className="mt-5 text-[15px]">
                    <strong>
                      Project Engineer(Elec):
                    </strong>{" "}
                    {/* ✅ PADMAJA FROM DB */}
                    {electrical?.engineer ||
                      "Not available"}
                  </div>
                </div>

                {/* SUPPORTING STAFF */}
                <StaffSection
                  title="Supporting Staff"
                  staff={electricalStaff}
                />
              </div>
            </div>
          )}

          {/* ================= VISION ================= */}
          {tab === "Vision & Mission" && (
            <div className="grid md:grid-cols-2 gap-6">

              {/* VISION */}
              <div className="premium-card">
                <h2 className="section-title">
                  Vision
                </h2>

                <p className="leading-relaxed">
                  {content?.vision ||
                    "No vision available"}
                </p>
              </div>

              {/* MISSION */}
              <div className="premium-card">
                <h2 className="section-title">
                  Mission
                </h2>

                <p className="leading-relaxed">
                  {content?.mission ||
                    "No mission available"}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/* ================= STAFF SECTION ================= */
function StaffSection({
  title,
  staff,
}: {
  title: string;
  staff: any[];
}) {
  return (
    <div className="premium-card">

      <h2 className="section-title">
        {title}
      </h2>

      <Table
        columns={[
          "S.No",
          "Name",
          "Designation",
        ]}
        data={staff.map((s, i) => [
          i + 1,
          s.name,
          s.designation,
        ])}
      />
    </div>
  );
}

/* ================= TABLE ================= */
function Table({
  columns,
  data,
}: {
  columns: string[];
  data: any[];
}) {
  if (!data.length) {
    return (
      <p className="text-gray-500 italic">
        No data available.
      </p>
    );
  }

  return (
    <table className="premium-table">
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i}>{c}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {row.map(
              (cell: any, j: number) => (
                <td key={j}>{cell}</td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EngineeringCellPage;