import { createFileRoute } from "@tanstack/react-router";
import { TeamShowcase } from "@/components/TeamShowcase";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Development Team & Supervisor | JNTU-GV College of Engineering Vizianagaram" },
      {
        name: "description",
        content:
          "Meet the student development team (Likhith, Sai Rupini, Sai Vamsi, Anitha) and faculty supervisor Mr. Anil Wurity behind the JNTU-GV web portal.",
      },
    ],
  }),
  component: TeamShowcase,
});

