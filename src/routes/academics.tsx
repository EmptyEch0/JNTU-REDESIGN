import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SubNav } from "@/components/SubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";

export const Route = createFileRoute("/academics")({
  component: AcademicsLayout,
});

function AcademicsLayout() {
  return (
    <>
      <Outlet />
      <SubNavMount />
    </>
  );
}

// Render SubNav at top via portal-like fixed band; placed after hero by each page.
// To keep it consistent, expose at bottom of viewport flow above each page section.
function SubNavMount() {
  return null;
}

export { SubNav, ACADEMICS_SUBNAV };
