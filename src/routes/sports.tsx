import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { getSportsData } from "@/funcs/sports.server";

export const Route = createFileRoute("/sports")({
  loader: async () => await getSportsData(),
  component: SportsPage,
});

const TABS = ["Staff", "Achievements", "Play Fields", "Gymnasium"];

function SportsPage() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState("Staff");

  const images = data?.images || [];
  const info = data?.info || {};

  const coordinator =
    info?.designation?.toLowerCase().includes("coordinator")
      ? info
      : data?.faculty?.[0] || {};

  const hod =
    !info?.designation?.toLowerCase().includes("coordinator")
      ? info
      : data?.faculty?.[0] || {};

  return (
    <>
      <PageHero
        title="Sports & Fitness"
        subtitle="A robust sports culture on campus with facilities for every game."
        image={images?.length ? images[0].url : "/fallback.jpg"}
      />

      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-6 px-4 py-8">

        {/* LEFT */}
        <aside className="md:col-span-3 space-y-4">

          {/* TABS */}
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`w-full p-3 rounded ${
                tab === t ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}

          {/* MESSAGE CARD */}
          <div className="bg-white border rounded-lg overflow-hidden shadow">
            <img
              src={coordinator?.img || "/fallback.jpg"}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/fallback.jpg";
              }}
            />

            <div className="p-4">
              <p className="text-xs text-blue-600 uppercase font-bold">
                Sports Message
              </p>

              <p className="text-sm mt-2 text-gray-600">
                {coordinator?.message || "No message available"}
              </p>

              <p className="font-semibold mt-3">
                {coordinator?.name || "No name"}
              </p>

              <p className="text-xs text-gray-500">
                {coordinator?.designation || ""}
              </p>
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="md:col-span-9 space-y-6">

          {/* IMAGE SLIDER */}
          <ImageCarousel images={images.map((i: any) => i.url)} />

          {/* DESCRIPTION FROM DB */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-3">
              Department of Physical Education
            </h2>
            <p className="text-gray-600">
              {info?.description || "No description available"}
            </p>
          </div>

          {/* TAB CONTENT */}
          {tab === "Staff" && (
            <>
              {/* HOD */}
              <div className="bg-white p-6 rounded-lg shadow flex gap-6">
                <img
                  src={hod?.img || "/fallback.jpg"}
                  className="w-32 h-32 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/fallback.jpg";
                  }}
                />

                <div>
                  <h3 className="text-xl font-bold">
                    {hod?.name || "No name"}
                  </h3>

                  <p className="text-blue-600 text-sm">
                    {hod?.designation || ""}
                  </p>

                  <p className="text-gray-600 mt-2 text-sm">
                    {hod?.qualification || ""}
                  </p>

                  <p className="text-sm mt-2">{hod?.address}</p>
                  <p className="text-sm">{hod?.phone}</p>
                  <p className="text-sm">{hod?.email}</p>
                </div>
              </div>

              {/* FACULTY */}
              <Table
                columns={["S.No", "Name", "Designation"]}
                data={(data?.faculty || []).map((f: any, i: number) => [
                  i + 1,
                  f.name,
                  f.designation,
                ])}
              />

              {/* NON TEACHING */}
              <Table
                columns={["S.No", "Name", "Designation"]}
                data={(data?.nonTeaching || []).map((n: any, i: number) => [
                  i + 1,
                  n.name,
                  n.designation,
                ])}
              />
            </>
          )}

          {tab === "Achievements" && (
            <Table
              columns={["S.No", "Name", "Branch", "Game", "Tournament", "Venue"]}
              data={(data?.achievements || []).map((a: any, i: number) => [
                i + 1,
                a.student,
                a.branch,
                a.game,
                a.tournament,
                a.venue,
              ])}
            />
          )}

          {tab === "Play Fields" && (
            <Table
              columns={["S.No", "Field", "Qty"]}
              data={(data?.fields || []).map((f: any, i: number) => [
                i + 1,
                f.name,
                f.qty,
              ])}
            />
          )}

          {tab === "Gymnasium" && (
            <Table
              columns={["S.No", "Item", "Qty", "Cost"]}
              data={(data?.gym || []).map((g: any, i: number) => [
                i + 1,
                g.name,
                g.qty,
                g.cost,
              ])}
            />
          )}
        </main>
      </div>
    </>
  );
}

/* ================= CAROUSEL ================= */
function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(t);
  }, [images]);

  return (
    <img
      src={images[index] || "/fallback.jpg"}
      className="w-full h-64 object-cover rounded"
    />
  );
}

/* ================= TABLE ================= */
function Table({ columns, data }: any) {
  if (!data.length) return <p>No data available</p>;

  return (
    <table className="w-full border mt-4">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((c: string, i: number) => (
            <th key={i} className="p-2 border">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, i: number) => (
          <tr key={i}>
            {row.map((cell: any, j: number) => (
              <td key={j} className="p-2 border">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SportsPage;