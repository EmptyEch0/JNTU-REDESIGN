import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
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
        title="Seven departments. One academic culture."
        subtitle="Each department is led by faculty who teach with conviction, mentor with care and research with rigour."
        image={labImg}
      />
      <section className="py-24 container-narrow">
        {isPending ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid auto-rows-[210px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                    className={`group relative h-full overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] ${spanClass}`}
                  >
                    <img
                      src={department.image}
                      alt={department.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/20" />

                    <div className="relative flex h-full flex-col justify-end p-6 text-white">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/70">Department</p>
                      <h3 className="mt-2 text-2xl font-semibold leading-tight">{department.name}</h3>
                      <p className="mt-2 text-sm text-white/85">
                        <span className="font-semibold">HOD:</span> {department.hod}
                      </p>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/80">
                        {department.description}
                      </p>
                    </div>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        ) : null}

        {!isPending && !isError && (!data || data.length === 0) ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            No departments found in the database.
          </div>
        ) : null}
      </section>
    </>
  );
}
