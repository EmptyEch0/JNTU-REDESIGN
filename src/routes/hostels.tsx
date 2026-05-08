import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/PageHero";
import hostelImg from "@/assets/hostel.jpg";
import { getHostelData } from "@/funcs/hostel.server";

export const Route = createFileRoute("/hostels")({
  loader: async () => await getHostelData(),
  component: HostelsPage,
});

function HostelsPage() {
  const data = Route.useLoaderData();

  const blocks = data?.blocks ?? [];
  const wardens = data?.wardens ?? [];
  const facilities = data?.facilities ?? [];
  const officer = data?.officer;
  const health = data?.health;
  const staff = data?.staff ?? [];
  const images = data?.images ?? [];

  const [tab, setTab] = useState<"office" | "girls" | "boys">("office");

  const getImages = (type: string) =>
    images.filter((img: any) => img.type === type).map((i: any) => i.url);

  // ✅ BLOCK FILTERS
  const girlsBlocks = blocks.filter((b: any) => b.type === "girls");
  const boysBlocks = blocks.filter((b: any) => b.type === "boys");

  // ✅ WARDENS FIXED
  const girlsWardens = wardens.filter((w: any) => w.hostelType === "girls");
  const boysWardens = wardens.filter((w: any) => w.hostelType === "boys");

  // ✅ FACILITIES FIXED
  const girlsFacilities = facilities.filter((f: any) => f.type === "girls");
  const boysFacilities = facilities.filter((f: any) => f.type === "boys");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lora:wght@400;500;600&display=swap');

        :root {
          --luxury-dark: #1a1a1a;
          --luxury-gold: #d4af37;
          --luxury-light: #f8f5f0;
          --luxury-gray: #4a4a4a;
          --luxury-accent: #2d5a6f;
        }

        .premium-container {
          font-family: 'Lora', serif;
        }

        .font-display {
          font-family: 'Playfair Display', serif;
        }

        .premium-tab-btn {
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .premium-tab-active {
          background: linear-gradient(135deg, var(--luxury-gold) 0%, #e6c200 100%);
          color: var(--luxury-dark);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .premium-tab-inactive {
          background: var(--luxury-light);
          color: var(--luxury-gray);
          border: 1px solid #e0d5c7;
        }

        .premium-tab-inactive:hover {
          background: #f0e6d8;
          border-color: var(--luxury-gold);
        }

        .premium-card {
          background: white;
          border: 1px solid #e0d5c7;
          border-radius: 12px;
          padding: 28px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .premium-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--luxury-gold) 0%, transparent 100%);
        }

        .premium-card:hover {
          border-color: var(--luxury-gold);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--luxury-dark);
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 12px;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background: var(--luxury-gold);
          border-radius: 2px;
        }

        .premium-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: white;
          border: 1px solid #e0d5c7;
          border-radius: 8px;
          overflow: hidden;
        }
        .premium-table th {
          padding: 14px 18px;
          text-align: left;
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          color: var(--luxury-dark);
          font-size: 14px;
          background: var(--luxury-light);
          border-bottom: 2px solid var(--luxury-gold);
        }
        .premium-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #e0d5c7;
          color: var(--luxury-gray);
          font-size: 14px;
        }
        .premium-table tbody tr:hover {
          background-color: var(--luxury-light);
        }
        .premium-table tbody tr:last-child td {
          border-bottom: none;
        }

        .block-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
        }

        .info-stat {
          background: linear-gradient(135deg, var(--luxury-light) 0%, #f0e6d8 100%);
          padding: 18px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e0d5c7;
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--luxury-dark);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--luxury-gray);
          font-weight: 600;
        }

        .facility-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .facility-item {
          background: var(--luxury-light);
          padding: 14px 18px;
          border-radius: 8px;
          border-left: 4px solid var(--luxury-gold);
          font-size: 14px;
          color: var(--luxury-gray);
          display: flex;
          align-items: center;
        }

        .facility-item::before {
          content: '✦';
          color: var(--luxury-gold);
          margin-right: 10px;
          font-size: 16px;
        }
      `}</style>

      <PageHero
        title="HOSTELS"
        subtitle={data?.about?.description || "Hostel Information"}
        image={getImages("office")[0] || hostelImg}
      />

      <section className="max-w-6xl mx-auto px-4 py-12 premium-container">

        {/* TABS */}
        <div className="flex gap-4 mb-10 justify-center">
          <TabBtn label="Hostel Office" value="office" tab={tab} setTab={setTab} />
          <TabBtn label="Girls Hostel" value="girls" tab={tab} setTab={setTab} />
          <TabBtn label="Boys Hostel" value="boys" tab={tab} setTab={setTab} />
        </div>

        {/* ================= OFFICE ================= */}
        {tab === "office" && (
          <div className="space-y-6">
            <ImageCarousel images={getImages("office")} fallback={hostelImg} />

            {/* ABOUT */}
            <Card title="About Hostel Office">
              <p className="text-[16px] leading-[1.8] text-[var(--luxury-gray)]">
                {data?.about?.description}
              </p>
            </Card>

            {/* OFFICER */}
            {officer && (
              <Card title="Officer in Charge">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <img
                    src={officer.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250";
                    }}
                    className="w-32 h-32 rounded-lg object-cover border-2 border-[var(--luxury-gold)] shadow-md"
                  />
                  <div>
                    <h4 className="font-display font-bold text-xl text-[var(--luxury-dark)] mb-1">{officer.name}</h4>
                    <p className="text-[var(--luxury-gold)] font-semibold text-sm tracking-wide uppercase">{officer.role}</p>
                    <p className="text-sm text-[var(--luxury-gray)] mt-2">Overseeing hostel operations and residential student welfare.</p>
                  </div>
                </div>
              </Card>
            )}

            {/* WARDENS */}
            {girlsWardens.length > 0 && (
              <Card title="Girls Hostel Wardens">
                <WardenTable data={girlsWardens} />
              </Card>
            )}

            {boysWardens.length > 0 && (
              <Card title="Boys Hostel Wardens">
                <WardenTable data={boysWardens} />
              </Card>
            )}

            {/* STAFF */}
            {staff.length > 0 && (
              <Card title="Supporting Staff">
                <StaffTable data={staff} />
              </Card>
            )}
          </div>
        )}

        {/* ================= GIRLS ================= */}
        {tab === "girls" && (
          <div className="space-y-6">
            <ImageCarousel images={getImages("girls")} fallback="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000" />

            {girlsBlocks.map((b: any) => (
              <Card key={b.id} title={b.title}>
                <BlockInfo block={b} />
              </Card>
            ))}

            {girlsFacilities.length > 0 && (
              <Card title="Facilities Available">
                <FacilityList facilities={girlsFacilities} />
              </Card>
            )}

            {health && (
              <Card title="Health Assistant Services">
                <HealthTable health={health} />
              </Card>
            )}
          </div>
        )}

        {/* ================= BOYS ================= */}
        {tab === "boys" && (
          <div className="space-y-6">
            <ImageCarousel images={getImages("boys")} fallback="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000" />

            {boysBlocks.map((b: any) => (
              <Card key={b.id} title={b.title}>
                <BlockInfo block={b} />
              </Card>
            ))}

            {boysFacilities.length > 0 && (
              <Card title="Facilities Available">
                <FacilityList facilities={boysFacilities} />
              </Card>
            )}

            {health && (
              <Card title="Health Assistant Services">
                <HealthTable health={health} />
              </Card>
            )}
          </div>
        )}
      </section>
    </>
  );
}

/* ---------- UI COMPONENTS ---------- */

function TabBtn({ label, value, tab, setTab }: any) {
  return (
    <button
      onClick={() => setTab(value)}
      className={`premium-tab-btn ${
        tab === value ? "premium-tab-active" : "premium-tab-inactive"
      }`}
    >
      {label}
    </button>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="premium-card">
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}

function ImageCarousel({ images, fallback }: any) {
  const [src, setSrc] = useState(images?.[0] || fallback);

  useEffect(() => {
    if (images?.[0]) {
      setSrc(images[0]);
    } else {
      setSrc(fallback);
    }
  }, [images, fallback]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md border border-[#e0d5c7] mb-8 bg-amber-50/20">
      <img
        src={src}
        alt="Hostel Moment"
        className="w-full h-80 object-cover"
        onError={() => setSrc(fallback)}
      />
    </div>
  );
}

/* ---------- TABLES ---------- */

function WardenTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {data.map((w: any) => (
            <tr key={w.id}>
              <td className="font-display font-semibold text-[var(--luxury-dark)]">{w.name}</td>
              <td className="text-[var(--luxury-gray)]">{w.designation || "Warden"}</td>
              <td className="font-semibold text-[var(--luxury-accent)]">{w.phone || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StaffTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s: any) => (
            <tr key={s.id}>
              <td className="font-display font-semibold text-[var(--luxury-dark)]">{s.name}</td>
              <td className="text-[var(--luxury-gray)]">{s.role || "Staff"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockInfo({ block }: any) {
  return (
    <div className="block-info-grid">
      <div className="info-stat">
        <div className="stat-value">{block.rooms}</div>
        <div className="stat-label">Total Rooms</div>
      </div>
      <div className="info-stat">
        <div className="stat-value">{block.diningHall || "0"}</div>
        <div className="stat-label">Dining Halls</div>
      </div>
      <div className="info-stat">
        <div className="stat-value">{block.kitchen || "0"}</div>
        <div className="stat-label">Kitchens</div>
      </div>
    </div>
  );
}

function FacilityList({ facilities }: any) {
  return (
    <div className="facility-grid">
      {facilities.map((f: any) => (
        <div key={f.id} className="facility-item">
          {f.name}
        </div>
      ))}
    </div>
  );
}

function HealthTable({ health }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="premium-table">
        <tbody>
          <tr>
            <th>Staff Incharge</th>
            <td className="font-display font-semibold text-[var(--luxury-dark)]">{health.name}</td>
          </tr>
          <tr>
            <th>Timings / Availability</th>
            <td className="text-[var(--luxury-gray)]">{health.timing}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}