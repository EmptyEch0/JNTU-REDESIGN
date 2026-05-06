import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { PageHero } from "@/components/PageHero";
import { getLibraryData } from "@/funcs/library.server";
import cultureImg from "@/assets/culture.jpg";

export const Route = createFileRoute("/library")({
  loader: async () => await getLibraryData(),
  component: LibraryPage,
});

const TABS = [
  "About Library",
  "Titles & Volumes",
  "Periodicals",
  "Digital Library",
  "Team",
  "Ekedaa Video Library",
];

function LibraryPage() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState("About Library");

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
        title="Central Library" 
        subtitle="The heart of academic excellence and research" 
        image={images[0]?.url || cultureImg}
      />

      <section className="px-4 py-12 sm:px-6 lg:py-16 max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="premium-card !p-0 overflow-hidden">
            <div className="w-full aspect-[4/3] sm:aspect-auto sm:h-56 lg:h-64 overflow-hidden relative">
              <img
                src={data?.info?.img || "/fallback.jpg"}
                alt="Library Officer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => { e.currentTarget.src = "/fallback.jpg" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-display text-lg shadow-sm">
                  {data?.info?.officerName || "Officer In-Charge"}
                </p>
                <p className="text-[var(--luxury-gold)] text-xs font-semibold uppercase tracking-wider">
                  {data?.info?.designation || "Library In-Charge"}
                </p>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <p className="font-display text-[var(--luxury-dark)] text-xl mb-4 border-b border-[#e0d5c7] pb-3">
                Message
              </p>
              <p className="text-[15px] leading-relaxed text-[var(--luxury-gray)] italic">
                "{data?.info?.message || "Welcome to the central library. There's always more to the story..."}"
              </p>
            </div>
          </div>
        </aside>

        {/* ================= RIGHT CONTENT ================= */}
        <main className="lg:col-span-8 space-y-8 min-w-0">
          <div className="w-full shadow-lg rounded-xl overflow-hidden mb-10 border border-[#e0d5c7]">
            <ImageCarousel images={(data?.images || []).map((i: any) => i.url)} />
          </div>

          <div className="premium-card">
            <h2 className="section-title">Library Resources</h2>


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

            {/* ================= ABOUT ================= */}
            {tab === "About Library" && (
              <div className="content-section space-y-8">
                  <p className="text-[var(--luxury-gray)] leading-relaxed text-lg">
                    {data?.about || "The Central Library plays a vital role in academic growth. It has a large collection of books across various branches."}
                  </p>
  
                  <div>
                    <h3 className="font-display text-xl text-[var(--luxury-dark)] mb-4">Library Sections</h3>
                    <div className="overflow-x-auto rounded-lg border border-[#e0d5c7]">
                      <Table
                        columns={["S.No", "Section", "Area (Sq.m)", "Location"]}
                        data={(data?.sections || []).map((s: any, i: number) => [
                          i + 1,
                          <span className="font-display font-medium text-[var(--luxury-dark)]">{s.section}</span>,
                          s.area,
                          <span className="text-[var(--luxury-accent)] font-medium">{s.location}</span>,
                        ])}
                      />
                    </div>
                  </div>
  
                  <div className="divider"></div>
  
                  <div>
                    <h3 className="font-display text-xl text-[var(--luxury-dark)] mb-4">Working Hours</h3>
                    <div className="overflow-x-auto rounded-lg border border-[#e0d5c7] max-w-md">
                      <Table
                        columns={["Day", "Working Hours"]}
                        data={[
                          [
                            <span className="font-medium text-[var(--luxury-dark)]">Working Days</span>,
                            <span className="text-[var(--luxury-gray)]">{data?.hours?.workingDays || "Mon - Sat"}</span>
                          ],
                          [
                            <span className="font-medium text-[var(--luxury-dark)]">Working Hours</span>,
                            <span className="text-[var(--luxury-gray)]">{data?.hours?.workingTime || "08:00 AM - 08:00 PM"}</span>
                          ],
                          [
                            <span className="font-medium text-[var(--luxury-dark)]">Book Transactions</span>,
                            <span className="text-[var(--luxury-gray)]">{data?.hours?.transactionTime || "08:30 AM - 04:30 PM"}</span>
                          ]
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}
  
              {/* ================= TITLES ================= */}
              {tab === "Titles & Volumes" && (
                <div className="content-section">
                  <h3 className="font-display text-xl text-[var(--luxury-dark)] mb-4">Books Collection</h3>
                  <div className="overflow-x-auto rounded-lg border border-[#e0d5c7]">
                    <Table
                      columns={["Branch", "Titles", "Volumes"]}
                      data={(data?.titles || []).map((t: any) => [
                        <span className="font-display font-medium text-[var(--luxury-dark)]">{t.name}</span>,
                        <span className="text-[var(--luxury-accent)] font-bold">{t.value1}</span>,
                        <span className="text-[var(--luxury-gold)] font-bold">{t.value2}</span>,
                      ])}
                    />
                  </div>
                </div>
              )}
  
              {/* ================= PERIODICALS ================= */}
              {tab === "Periodicals" && (
                <div className="content-section">
                  <h3 className="font-display text-xl text-[var(--luxury-dark)] mb-4">Journals & Magazines</h3>
                  <div className="overflow-x-auto rounded-lg border border-[#e0d5c7]">
                    <Table
                      columns={["Department", "Count"]}
                      data={(data?.periodicals || []).map((p: any) => [
                        <span className="font-medium text-[var(--luxury-dark)]">{p.name}</span>,
                        <span className="bg-[var(--luxury-light)] text-[var(--luxury-gold)] font-bold px-3 py-1 rounded-full border border-[var(--luxury-gold)]">{p.value1}</span>,
                      ])}
                    />
                  </div>
                </div>
              )}
  
              {/* ================= DIGITAL ================= */}
              {tab === "Digital Library" && (
                <div className="content-section space-y-6">
                  <p className="text-[var(--luxury-gray)] text-lg leading-relaxed">
                    {data?.digital || "Network connectivity allows access to e-journals and e-resources."}
                  </p>
                <div className="bg-[var(--luxury-light)] p-6 rounded-xl border border-[#e0d5c7]">
                  <h4 className="font-display text-[var(--luxury-dark)] text-lg mb-4 border-b border-[var(--luxury-gold)] pb-2 inline-block">Available Digital Resources</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {(data?.digitalItems || []).map((d: any) => (
                      <li key={d.id} className="flex items-center text-[var(--luxury-gray)]">
                        <span className="text-[var(--luxury-gold)] text-xl mr-3">❖</span>
                        <span className="font-medium">{d.name}</span>
                      </li>
                    ))}
                    {(data?.digitalItems || []).length === 0 && <li className="italic text-gray-500">No resources listed.</li>}
                  </ul>
                </div>
              </div>
            )}

            {/* ================= TEAM ================= */}
            {tab === "Team" && (
              <div className="content-section">
                <h3 className="font-display text-xl text-[var(--luxury-dark)] mb-4">Library Staff</h3>
                <div className="overflow-x-auto rounded-lg border border-[#e0d5c7]">
                  <Table
                    columns={["Name", "Qualification", "Designation"]}
                    data={(data?.team || []).map((t: any) => [
                      <span className="font-display font-medium text-[var(--luxury-dark)]">{t.name}</span>,
                      t.qualification,
                      <span className="text-[var(--luxury-accent)] font-medium">{t.designation}</span>,
                    ])}
                  />
                </div>
              </div>
            )}

            {/* ================= EKEEDA ================= */}
            {tab === "Ekedaa Video Library" && (
              <div className="content-section text-center py-12 px-6 border-2 border-dashed border-[#e0d5c7] rounded-xl bg-[var(--luxury-light)]">
                <div className="text-[var(--luxury-gold)] text-6xl mb-4">▶</div>
                <h3 className="font-display text-2xl text-[var(--luxury-dark)] mb-4">Ekedaa Video Library</h3>
                <p className="text-[var(--luxury-gray)] text-lg max-w-xl mx-auto">
                  Ekedaa provides comprehensive online video lectures, expert tutorials, and digital learning resources to supplement your academic journey.
                </p>
                <button className="mt-8 px-8 py-3 bg-[var(--luxury-dark)] text-white rounded-md font-medium hover:bg-[var(--luxury-gold)] transition-colors duration-300">
                  Access Portal
                </button>
              </div>
            )}

          </div>
        </main>
      </section>
    </>
  );
}

/* TABLE COMPONENT */
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
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
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

  if (!images || images.length === 0) {
    return (
      <img
        src="/fallback.jpg"
        className="w-full h-64 object-cover"
        alt="Library interior"
      />
    );
  }

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
        alt={`Library view ${currentIndex + 1}`}
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

export default LibraryPage;