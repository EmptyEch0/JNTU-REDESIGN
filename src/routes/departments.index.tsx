import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import labImg from "@/assets/lab.jpg";

type Department = {
  id: string;
  name: string;
  hod: string;
  description: string;
  image: string;
  slug: string; // Added slug to type
};

// 1. Updated Server Function to fetch the slug
export const getDepartments = createServerFn({ method: "GET" }).handler(async () => {
  const { sql } = await import("@/lib/db");

  const rows = await sql<Department[]>`
    SELECT id, name, hod, description, image, slug
    FROM departments
    ORDER BY name ASC
  `;

  return rows;
});

// 2. Exporting getDepartmentBySlug here so it can be imported by the detail page
export const getDepartmentBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug) // This tells TS that 'data' is a string
  .handler(async ({ data }) => {
    const { sql } = await import("@/lib/db");
    
    // Now TS knows 'data' is a string and not 'undefined'
    const [department] = await sql`
      SELECT * FROM departments WHERE slug = ${data}
    `;
    
    return department || null;
  })

export const Route = createFileRoute("/departments/")({
  head: () => ({
    meta: [
      { title: "Departments — JNTU-GV CEV" },
      { name: "description", content: "Engineering and management departments at JNTU-GV CEV." },
      { property: "og:title", content: "Departments at JNTU-GV CEV" },
      { property: "og:description", content: "CSE, ECE, EEE, Mech, Civil, IT and MBA — meet the people and programs." },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getDepartments(),
  });

  return (
    <>
      <PageHero
        eyebrow="Departments"
        title="Eight departments. One academic culture."
        subtitle="Each department is led by faculty who teach with conviction, mentor with care and research with rigour."
        image={labImg}
      />
      <section className="bg-sand/40 py-24">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Academic Units"
              title="Explore Our Departments"
              subtitle="Each department blends rigorous academics, practical exposure, and dedicated faculty mentoring."
            />
          </RevealOnScroll>

          {isPending ? (
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-80 animate-pulse rounded-3xl border border-border bg-muted/30" />
              ))}
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
              Failed to load departments: {error instanceof Error ? error.message : "Unknown error"}
            </div>
          ) : null}

          {!isPending && !isError ? (
            <div className="mt-12 grid auto-rows-[230px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data?.map((department, index) => {
                const spanClass =
                  index % 5 === 0
                    ? "lg:col-span-2 lg:row-span-2"
                    : index % 5 === 3
                      ? "sm:col-span-2 lg:col-span-2"
                      : "";

                return (
                  <RevealOnScroll key={department.id} delay={index * 60}>
                    {/* 3. Wrapped Article in a Link for navigation */}
                    <Link
                      to="/departments/$id"
                      params={{ id: department.slug }}
                      className={`group relative block h-full overflow-hidden rounded-3xl border border-white/20 bg-card shadow-[var(--shadow-soft)] ring-1 ring-black/5 transition-all duration-300 hover:ring-2 hover:ring-primary/20 ${spanClass}`}
                    >
                      <article className="h-full">
                        <img
                          src={department.image}
                          alt={department.name}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        <div className="relative flex h-full flex-col justify-between p-5 text-white md:p-6">
                          <div>
                            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                              View Dept
                            </span>
                          </div>

                          <div>
                            <h3 className="max-w-[20ch] text-2xl font-bold leading-tight drop-shadow-md">
                              {department.name}
                            </h3>
                            <p className="mt-2 text-sm font-medium text-white/90">
                              HOD: <span className="font-bold text-white">{department.hod}</span>
                            </p>
                            <p className="mt-3 line-clamp-2 max-w-[52ch] text-xs leading-relaxed text-white/80">
                              {department.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </RevealOnScroll>
                );
              })}
            </div>
          ) : null}

          {!isPending && !isError && (!data || data.length === 0) ? (
            <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-muted-foreground text-center">
              No departments found in the database.
            </div>
          ) : null}
        </div>
      </section>
      <Outlet />
    </>
  );
}