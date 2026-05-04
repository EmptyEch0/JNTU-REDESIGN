import { createFileRoute } from "@tanstack/react-router";
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
};

const getDepartments = createServerFn({ method: "GET" }).handler(async () => {
  const { sql } = await import("@/lib/db");

  const rows = await sql<Department[]>`
    SELECT id, name, hod, description, image
    FROM departments
    ORDER BY name ASC
  `;

  return rows;
});

export const Route = createFileRoute("/departments")({
  head: () => ({
    meta: [
      { title: "Departments — JNTU-GV CEV" },
      { name: "description", content: "Seven engineering and management departments at JNTU-GV CEV." },
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
                  <article
                    className={`group relative h-full overflow-hidden rounded-3xl border border-white/20 bg-card shadow-[var(--shadow-soft)] ring-1 ring-black/5 ${spanClass}`}
                  >
                    <img
                      src={department.image}
                      alt={department.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/36 to-black/8" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />

                    <div className="relative flex h-full flex-col justify-between p-5 text-white md:p-6">
                      <div>
                        <span className="inline-flex rounded-full bg-white/92 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                          Department
                        </span>
                      </div>

                      <div>
                        <h3 className="max-w-[20ch] text-2xl font-semibold leading-tight [text-wrap:balance] drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
                          {department.name}
                        </h3>
                        <p className="mt-2 text-sm font-medium text-white">
                          HOD: <span className="font-semibold">{department.hod}</span>
                        </p>
                        <p className="mt-3 line-clamp-3 max-w-[52ch] text-sm leading-relaxed text-white/92">
                          {department.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        ) : null}

        {!isPending && !isError && (!data || data.length === 0) ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            No departments found in the database.
          </div>
        ) : null}
        </div>
      </section>
    </>
  );
}
