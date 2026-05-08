import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { getSportsData } from "@/funcs/sports.server";
import cultureImg from "@/assets/culture.jpg";
import { 
  Award, 
  User,
  Users, 
  Shield, 
  Trophy, 
  MapPin, 
  Mail, 
  Phone, 
  Image as ImageIcon, 
  BookOpen,
  Sparkles,
  Building
} from "lucide-react";

export const Route = createFileRoute("/sports")({
  loader: async () => await getSportsData(),
  component: SportsPage,
});

const TABS = [
  "Overview",
  "Staff & Team",
  "Achievements",
  "Play Fields",
  "Gymnasium",
  "Gallery",
];

function SportsPage() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState("Overview");

  const images = data?.images || [];
  const sportsContentList = Array.isArray(data?.info) ? data?.info : [];

  const getCarouselImages = () => images.map((i: any) => i.url);

  // Get coordinators from sportsContentList
  const coordinators = sportsContentList.filter((item: any) =>
    item.designation?.toLowerCase().includes("coordinator")
  );

  // If none explicitly matching, fallback to all content list items
  const displayPeople = coordinators.length > 0 ? coordinators : sportsContentList;

  const welcomeMessage = (msg: string) => {
    if (!msg || msg === "---" || msg.trim() === "") {
      return "Welcome to the Department of Physical Education and Sports. We believe in nurturing a healthy mind in a healthy body through regular physical activity, training bootcamps, and competitive athletic events.";
    }
    return msg;
  };

  return (
    <div className="min-h-screen bg-[oklch(0.972_0.012_85)] text-slate-800 pb-20">
      <PageHero
        eyebrow="Athletics & Recreation"
        title="Sports & Physical Education"
        subtitle="Inculcating discipline, team spirit, and excellence through robust sports infrastructure and coaching."
        image={images?.length ? images[0].url : undefined}
      />

      <section className="container-narrow py-12">
        {/* TABS */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
          {TABS.map((t) => (
            <TabBtn 
              key={t}
              label={t} 
              active={tab === t} 
              onClick={() => setTab(t)} 
              icon={
                t === "Overview" ? BookOpen : 
                t === "Staff & Team" ? Users : 
                t === "Achievements" ? Trophy : 
                t === "Play Fields" ? MapPin : 
                t === "Gymnasium" ? Shield : ImageIcon
              } 
            />
          ))}
        </div>

        <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
          <ImageCarousel images={getCarouselImages()} fallback={cultureImg} />

          {/* ================= OVERVIEW ================= */}
          {tab === "Overview" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              
              {/* SPORTS COORDINATOR */}
              {displayPeople[0] && (
                <Card title="Sports Coordinator" icon={User}>
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <img
                      src={displayPeople[0].img || "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=250"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=250";
                      }}
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-200/50 shadow-sm shrink-0"
                      alt={displayPeople[0].name}
                    />
                    <div>
                      <h4 className="font-display font-bold text-lg text-slate-900 mb-0.5">
                        {displayPeople[0].name}
                      </h4>
                      <p className="text-[oklch(0.42_0.18_265)] font-semibold text-xs tracking-wider uppercase">
                        {displayPeople[0].designation || "Sports Coordinator"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">{displayPeople[0].qualification}</p>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed italic">
                        "{welcomeMessage(displayPeople[0].message)}"
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                        {displayPeople[0].email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {displayPeople[0].email}
                          </span>
                        )}
                        {displayPeople[0].phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {displayPeople[0].phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* WELCOME / ABOUT */}
              <Card title="Physical Education Department" icon={Sparkles}>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  The Department of Physical Education plays a key role in the overall development of our students' personality. 
                  With a firm belief that athletic participation builds integrity, resilience, and collaboration, the university provides excellent infrastructure, 
                  modern training equipment, and opportunities to represent the institution at state, zone, and national levels.
                </p>
              </Card>
            </div>
          )}

          {/* ================= STAFF & TEAM ================= */}
          {tab === "Staff & Team" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              {data?.faculty?.length > 0 && (
                <Card title="Physical Education Faculty" icon={Users}>
                  <StaffTable data={data.faculty} />
                </Card>
              )}

              {data?.nonTeaching?.length > 0 && (
                <Card title="Supporting / Non-Teaching Staff" icon={Users}>
                  <StaffTable data={data.nonTeaching} />
                </Card>
              )}
            </div>
          )}

          {/* ================= ACHIEVEMENTS ================= */}
          {tab === "Achievements" && (
            <Card title="Recent Sports Achievements & Accolades" icon={Trophy}>
              <AchievementsTable data={data?.achievements || []} />
            </Card>
          )}

          {/* ================= PLAY FIELDS ================= */}
          {tab === "Play Fields" && (
            <Card title="Outdoor & Indoor Playfields" icon={MapPin}>
              <FieldsTable data={data?.fields || []} />
            </Card>
          )}

          {/* ================= GYMNASIUM ================= */}
          {tab === "Gymnasium" && (
            <Card title="Gymnasium Equipment & Infrastructure" icon={Shield}>
              <GymTable data={data?.gym || []} />
            </Card>
          )}

          {/* ================= GALLERY ================= */}
          {tab === "Gallery" && (
            <Card title="Campus Athletic Moments" icon={ImageIcon} subtitle="A glimpse into training camps, tournaments, and fitness sessions">
              {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img: any) => (
                    <div key={img.id} className="relative group overflow-hidden rounded-2xl border border-slate-100 aspect-[4/3] bg-slate-50">
                      <img
                        src={img.url}
                        alt="Athletic Moment"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 italic text-sm">
                  No gallery images uploaded.
                </div>
              )}
            </Card>
          )}

        </div>
      </section>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function TabBtn({ label, active, onClick, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 active:scale-95 border cursor-pointer ${
        active
          ? "bg-[oklch(0.42_0.18_265)] text-white border-transparent shadow-sm"
          : "bg-white border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
      }`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {label}
    </button>
  );
}

function Card({ title, subtitle, icon: Icon, children, className = "" }: any) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 hover:shadow-md transition-all duration-300 shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
          {Icon && <Icon className="w-5 h-5 text-[oklch(0.42_0.18_265)]" />}
          <div>
            <h3 className="font-display font-semibold text-lg md:text-xl text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

function ImageCarousel({ images, fallback }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || !images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoplay, images]);

  if (!images || images.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-100 mb-8 aspect-[16/6] min-h-[240px] max-h-[380px] bg-slate-100">
        <img src={fallback} className="w-full h-full object-cover" alt="Sports fallback" />
      </div>
    );
  }

  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-md border border-slate-150 mb-8 aspect-[16/6] min-h-[240px] max-h-[380px] bg-slate-100 group"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="w-full h-full relative">
        {images.map((img: string, i: number) => (
          <img
            key={i}
            src={img}
            alt={`Sports view ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentIndex === i ? "opacity-100" : "opacity-0"
            }`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 w-9 h-9 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer z-10"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 w-9 h-9 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer z-10"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  currentIndex === index 
                    ? "w-6 bg-white" 
                    : "w-1.5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- TABLES ---------- */

function StaffTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">S.No</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Designation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((f: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 text-sm font-semibold text-slate-400">{i + 1}</td>
              <td className="py-3.5 font-semibold text-slate-900 text-sm flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-[oklch(0.42_0.18_265)] font-display text-xs font-bold shrink-0">
                  {f.name?.[0]}
                </div>
                {f.name}
              </td>
              <td className="py-3.5 text-sm text-slate-500 font-semibold">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                  {f.designation}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AchievementsTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">S.No</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Student Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Branch</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Game / Event</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Tournament</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Venue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((a: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 text-sm font-semibold text-slate-400">{i + 1}</td>
              <td className="py-3.5 font-semibold text-slate-900 text-sm">{a.student}</td>
              <td className="py-3.5 text-sm text-slate-500 font-semibold">{a.branch}</td>
              <td className="py-3.5 text-sm text-slate-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {a.game}
                </span>
              </td>
              <td className="py-3.5 text-sm text-slate-600">{a.tournament}</td>
              <td className="py-3.5 text-sm text-slate-400 font-medium">{a.venue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FieldsTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">S.No</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Field / Court Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Quantity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((f: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 text-sm font-semibold text-slate-400">{i + 1}</td>
              <td className="py-3.5 font-semibold text-slate-900 text-sm">{f.name}</td>
              <td className="py-3.5 text-sm font-bold text-indigo-600 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {f.qty}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GymTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">S.No</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Equipment Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Quantity</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Estimated Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((g: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 text-sm font-semibold text-slate-400">{i + 1}</td>
              <td className="py-3.5 font-semibold text-slate-900 text-sm">{g.name}</td>
              <td className="py-3.5 text-sm font-bold text-indigo-600 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {g.qty}
                </span>
              </td>
              <td className="py-3.5 text-sm text-slate-500 font-semibold text-right">{g.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SportsPage;