import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";

import nssImg from "@/assets/culture.jpg";
import profileImg from "@/assets/vakula.jpg";

export const Route = createFileRoute("/nss")({
  component: NSSPage,
});

const TABS = ["NSS", "NSS Activities", "NSS Special Camp Activities", "Gallery"];

function NSSPage() {
  const [tab, setTab] = useState("NSS");

  return (
    <div className="bg-white min-h-screen">

      <PageHero title="National Service Scheme" subtitle="" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-4 px-4 py-6">

        {/* LEFT SIDEBAR */}
        <div className="md:col-span-3">

          <div className="border p-2">
            <img src={profileImg} className="w-full h-48 object-cover" />

            <p className="text-xs font-semibold mt-2">NSS</p>

            <p className="text-xs mt-1">
              "Helping hands are better than praying lips. The best way to find yourself is to lose yourself in the service of others."
            </p>

            <p className="text-xs text-red-600 mt-2">V. Mani Kumar</p>
            <p className="text-xs">NSS Programme Officer</p>
          </div>

          <div className="mt-3 space-y-1">
            <div className="bg-blue-800 text-white px-3 py-2 text-xs">
              HoD’s Desk
            </div>
            <div className="bg-blue-800 text-white px-3 py-2 text-xs">
              Vision & Mission
            </div>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-9 text-[12px]">

          {/* IMAGE */}
          <img src={nssImg} className="w-full h-64 object-cover" />

          {/* TABS */}
          <div className="flex gap-2 mt-3 border-b pb-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 text-xs border ${tab === t ? "border-red-600 text-red-600" : ""
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ---------------- NSS ---------------- */}
          {tab === "NSS" && (
            <div className="mt-4 space-y-3">
              <p className="font-semibold">About NSS</p>
              <p>
                The National Service Scheme (NSS) is a Central Sector Scheme of Government of India.
                It provides students with opportunities to participate in social service programs.
              </p>
              <p>
                The motto of NSS is <b>"NOT ME BUT YOU"</b>, reflecting selfless service.
              </p>
            </div>
          )}

          {/* ---------------- ACTIVITIES ---------------- */}
          {tab === "NSS Activities" && (
            <div className="mt-4">
              <Table
                columns={["S.No", "Activity", "Date", "Venue"]}
                data={[
                  ["1", "Yoga Camp", "12-03-2013", "JNTU UCEV"],
                  ["2", "Clean & Green", "14-12-2013", "Campus"],
                  ["3", "Blood Donation", "22-07-2014", "Campus"],
                ]}
              />
            </div>
          )}

          {/* ---------------- CAMP ---------------- */}
          {tab === "NSS Special Camp Activities" && (
            <div className="mt-4 space-y-2">
              <p>
                Special camp conducted in villages with awareness programs.
              </p>
              <ul className="list-disc ml-5">
                <li>Day 1: Survey of village</li>
                <li>Day 2: Sanitation drive</li>
                <li>Day 3: Awareness rally</li>
                <li>Day 4: Anti-alcohol campaign</li>
              </ul>
            </div>
          )}

          {/* ---------------- GALLERY ---------------- */}
          {tab === "Gallery" && (
            <div className="mt-4 space-y-3">
              <div className="border p-3">
                <p className="font-semibold">Activity 1</p>
                <p>1 Photo</p>
              </div>

              <div className="border p-3">
                <p className="font-semibold">Activity 2</p>
                <p>2 Photos</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* TABLE */
function Table({ columns, data }: any) {
  return (
    <table className="w-full border text-xs mt-2">
      <thead className="bg-gray-300">
        <tr>
          {columns.map((c: string, i: number) => (
            <th key={i} className="p-2 border text-left">{c}</th>
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

export default NSSPage;