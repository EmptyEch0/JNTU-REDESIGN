import { createFileRoute, Outlet } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { IQAC_SUBNAV } from "@/lib/site";
const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/administration/iqac")({
  component: IQACLayout,
});

function IQACLayout() {
  return (
    <>
      <PageHero
        eyebrow="Administration"
        title="Internal Quality Assurance Cell"
        subtitle="Ensuring continuous quality enhancement in academic and administrative activities."
        image={campusImg}
      />
      <SubNav items={IQAC_SUBNAV} />

      <main className="container-narrow">
        <Outlet />
      </main>
    </>
  );
}
