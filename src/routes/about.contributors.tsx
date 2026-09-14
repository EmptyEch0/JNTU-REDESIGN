import { createFileRoute } from "@tanstack/react-router";
import { TeamShowcase } from "@/components/TeamShowcase";

export const Route = createFileRoute("/about/contributors")({
  head: () => ({
    meta: [
      { title: "Contributors & Developers | JNTU-GV College of Engineering Vizianagaram" },
      {
        name: "description",
        content:
          "Meet the student development team (Likhith, Sai Rupini, Sai Vamsi, Anitha) and faculty supervisor Dr. W. Anil behind the JNTU-GV web portal.",
      },
    ],
  }),
  component: TeamShowcase,
});

