import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import cultureImg from "@/assets/culture.jpg";
import { getDispensaryData } from "@/funcs/dispensary.server";

export const Route = createFileRoute("/dispensary/")({
  loader: async () => await getDispensaryData(),
  component: DispensaryPage,
});

const TABS = ["Doctors", "Facilities", "Supporting Staff"];

function DispensaryPage() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState("Doctors");

  const doctors = data?.doctors ?? [];
  const facilities = data?.facilities ?? [];
  const medicines = data?.medicines ?? [];
  const staff = data?.staff ?? [];
  const drivers = data?.drivers ?? [];
  const images = data?.images ?? [];

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

        * {
          font-family: 'Lora', serif;
        }

        .font-display {
          font-family: 'Playfair Display', serif;
        }

        .tab-btn-active {
          background: linear-gradient(135deg, var(--luxury-gold) 0%, #e6c200 100%);
          color: var(--luxury-dark);
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.2);
        }

        .tab-btn-inactive {
          background: var(--luxury-light);
          color: var(--luxury-gray);
          border: 1px solid #e0d5c7;
          transition: all 0.3s ease;
        }

        .tab-btn-inactive:hover {
          background: #f0e6d8;
          border-color: var(--luxury-gold);
        }

        .premium-card {
          background: white;
          border: 1px solid #e0d5c7;
          border-radius: 12px;
          padding: 28px;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          position: relative;
          overflow: hidden;
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
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--luxury-dark);
          margin-bottom: 32px;
          position: relative;
          padding-bottom: 16px;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background: var(--luxury-gold);
          border-radius: 2px;
        }

        .premium-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 16px;
        }

        .premium-table thead {
          background: var(--luxury-light);
        }

        .premium-table th {
          padding: 16px 20px;
          text-align: left;
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          color: var(--luxury-dark);
          font-size: 14px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          border-bottom: 2px solid var(--luxury-gold);
          white-space: nowrap;
        }

        .premium-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #e0d5c7;
          color: var(--luxury-gray);
          font-size: 14px;
        }

        .premium-table tbody tr {
          transition: background-color 0.3s ease;
        }

        .premium-table tbody tr:hover {
          background-color: var(--luxury-light);
        }

        .premium-table tbody tr:last-child td {
          border-bottom: none;
        }

        .tab-container {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
          justify-content: flex-start;
          flex-wrap: wrap;
          animation: fadeInDown 0.6s ease-out;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--luxury-gold), transparent);
          margin: 48px 0;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .content-section {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        /* Responsive refinements */
        @media (max-width: 768px) {
          .section-title {
            font-size: 24px;
          }
          .premium-table th, .premium-table td {
            padding: 12px 16px;
          }
        }
      `}</style>

      <PageHero
        title="Dispensary"
        subtitle="Campus medical care & emergency support"
        image={images[0]?.url || cultureImg}
      />

      <section className="px-4 py-12 sm:px-6 lg:py-16 max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="premium-card !p-0 overflow-hidden">
            <div className="w-full aspect-[4/3] sm:aspect-auto sm:h-56 lg:h-64 overflow-hidden relative">
              <img
                src={data?.info?.img || "/images/nurse.jpg"}
                alt="Dispensary"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => { e.currentTarget.src = "/fallback.jpg" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-display text-lg shadow-sm">
                  {data?.info?.hodName || "Medical Officer"}
                </p>
                <p className="text-[var(--luxury-gold)] text-xs font-semibold uppercase tracking-wider">
                  In-charge
                </p>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <p className="font-display text-[var(--luxury-dark)] text-xl mb-4 border-b border-[#e0d5c7] pb-3">
                Message
              </p>
              <p className="text-[15px] leading-relaxed text-[var(--luxury-gray)] italic">
                "{data?.info?.message || "Providing essential medical support, first aid, basic medicines, and emergency assistance for the well-being of our students and staff."}"
              </p>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="lg:col-span-8 space-y-8 min-w-0">
          <div className="w-full shadow-lg rounded-xl overflow-hidden mb-10 border border-[#e0d5c7]">
            <ImageCarousel images={images.map((i: any) => i.url)} />
          </div>

          <div className="premium-card">
            <h2 className="section-title">Dispensary Services</h2>

            {/* TABS */}
            <div className="tab-container">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={tab === t ? "tab-btn-active" : "tab-btn-inactive"}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    border: tab === t ? 'none' : undefined,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* ================= DOCTORS ================= */}
            {tab === "Doctors" && (
              <div className="content-section overflow-x-auto rounded-lg border border-[#e0d5c7]">
                <Table
                  columns={["S.No", "Name", "Qualification", "Working Hours", "Photo", "Contact"]}
                  data={doctors.map((d: any, i: number) => [
                    i + 1,
                    <span className="font-display font-medium text-[var(--luxury-dark)]">{d.name}</span>,
                    d.qualification,
                    d.workingHours,
                    d.img,
                    <span className="text-[var(--luxury-accent)] font-medium">{d.contact}</span>,
                  ])}
                />
              </div>
            )}

            {/* ================= FACILITIES ================= */}
            {tab === "Facilities" && (
              <div className="content-section space-y-10">
                <div>
                  <h3 className="font-display text-xl text-[var(--luxury-dark)] mb-4">Available Facilities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {facilities.map((f: any) => (
                      <div key={f.id} className="bg-[var(--luxury-light)] p-4 rounded-lg border-l-4 border-[var(--luxury-gold)] shadow-sm flex items-center transition-transform hover:-translate-y-1">
                        <span className="text-[var(--luxury-gold)] text-xl mr-3">✓</span>
                        <span className="text-[var(--luxury-gray)] font-medium">{f.name}</span>
                      </div>
                    ))}
                    {facilities.length === 0 && <p className="text-[var(--luxury-gray)] italic">No facilities listed.</p>}
                  </div>
                </div>

                <div className="divider"></div>

                <div>
                  <h3 className="font-display text-xl text-[var(--luxury-dark)] mb-4">Medicines Available</h3>
                  <div className="overflow-x-auto rounded-lg border border-[#e0d5c7]">
                    <Table
                      columns={["S.No", "Medicine Name"]}
                      data={medicines.map((m: any, i: number) => [
                        i + 1,
                        <span className="font-medium text-[var(--luxury-gray)]">{m.name}</span>,
                      ])}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= STAFF ================= */}
            {tab === "Supporting Staff" && (
              <div className="content-section space-y-10">
                <div>
                  <h3 className="font-display text-xl text-[var(--luxury-dark)] mb-4">Supporting Staff</h3>
                  <div className="overflow-x-auto rounded-lg border border-[#e0d5c7]">
                    <Table
                      columns={["S.No", "Name", "Qualification", "Contact"]}
                      data={staff.map((s: any, i: number) => [
                        i + 1,
                        <span className="font-display font-medium text-[var(--luxury-dark)]">{s.name}</span>,
                        s.qualification,
                        <span className="text-[var(--luxury-accent)] font-medium">{s.contact}</span>,
                      ])}
                    />
                  </div>
                </div>

                <div className="divider"></div>

                <div>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <h3 className="font-display text-xl text-[var(--luxury-dark)]">Ambulance Services</h3>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                      🚑 24/7 Available
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-[#e0d5c7]">
                    <Table
                      columns={["S.No", "Driver Name", "Contact Number"]}
                      data={drivers.map((d: any, i: number) => [
                        i + 1,
                        <span className="font-display font-medium text-[var(--luxury-dark)]">{d.name}</span>,
                        <span className="text-[var(--luxury-accent)] font-medium">{d.contact}</span>,
                      ])}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </section>
    </>
  );
}

/* ---------------- CAROUSEL ---------------- */
function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay, images.length]);

  if (!images || images.length === 0) return null;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoplay(false);
  };
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setAutoplay(false);
  };
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setAutoplay(false);
  };

  return (
    <div
      className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[var(--luxury-light)] group overflow-hidden"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <img
        src={images[currentIndex]}
        alt={`Dispensary view ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      
      {images.length > 1 && (
        <>
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-md z-10">
            {currentIndex + 1} / {images.length}
          </div>

          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--luxury-dark)] w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-10"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--luxury-dark)] w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-10"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index 
                    ? 'w-8 h-2 bg-[var(--luxury-gold)] shadow-[0_0_8px_rgba(212,175,55,0.8)]' 
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- TABLE ---------------- */
function Table({ columns, data }: { columns: string[], data: any[] }) {
  if (!data || data.length === 0) return <div className="p-8 text-center text-[var(--luxury-gray)] italic">No data available at the moment.</div>;
  
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
            {row.map((cell: any, j: number) => (
              <td key={j}>
                {typeof cell === "string" && (cell.startsWith("http") || cell.includes("/images")) ? (
                  <img
                    src={cell}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[var(--luxury-gold)] shadow-sm"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
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
  );
}
