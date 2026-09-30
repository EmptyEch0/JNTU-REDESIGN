import { createFileRoute, useLoaderData, useParams, Navigate } from "@tanstack/react-router";
import { HodSection } from "@/components/departments/HodSection";
import { type DepartmentData } from "@/functions/departments";
import { getAssetUrl, updateDepartment, STATIC_DEPARTMENTS } from "@/lib/departments";
import { SafeImage } from "@/components/SafeImage";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminUpload } from "@/components/AdminEditPanel";
import { 
  Mail, 
  Quote, 
  UserCircle, 
  GraduationCap, 
  Save, 
  Image as ImageIcon, 
  Mail as MailIcon,
  MessageSquare
} from "lucide-react";
import { ProfileRenderer } from "@/components/ProfileRenderer";

export const Route = createFileRoute("/departments/$id/hod")({
  head: ({ matches }) => {
    const parentMatch = matches.find((m) => (m.routeId as string) === "/departments/$id");
    const parentData = parentMatch?.loaderData as DepartmentData | undefined;
    const name = parentData?.name || "Department";
    const hodFaculty = parentData?.faculty?.find((f) => /hod|head of (the )?department/i.test(f.designation || ""));
    const hod = hodFaculty?.name || parentData?.hod || STATIC_DEPARTMENTS.find((d) => d.slug === parentData?.slug || d.id === parentData?.id)?.hod || "Head of Department";
    return {
      meta: [
        { title: `HOD Message — ${name} — JNTU-GV CEV` },
        {
          name: "description",
          content: `Read the message from ${hod}, the Head of the ${name} Department at JNTU-GV College of Engineering Vizianagaram.`,
        },
      ],
      links: [
        { rel: "canonical", href: `https://jntugvcev.edu.in/departments/${parentData?.slug || ""}/hod` }
      ],
    };
  },
  component: HodPage,
});

function HodPage() {
  const { hostDept } = useLoaderData({ from: "__root__" }) as { hostDept?: string };
  if (hostDept) {
    return <Navigate to="/departments/$id" params={{ id: hostDept }} hash="hod" replace />;
  }
  return <HodSection />;
}
