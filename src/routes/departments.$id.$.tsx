import { createFileRoute, useLoaderData, useParams, useRouterState } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDepartmentPage } from "@/funcs/department-cms.server";
import { BlockRenderer } from "@/components/cms/BlockRenderer";
import { VisualPageBuilder } from "@/components/cms/VisualPageBuilder";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { Edit3, Sparkles } from "lucide-react";

export const Route = createFileRoute("/departments/$id/$")({
  component: CustomDepartmentPage,
});

function CustomDepartmentPage() {
  const deptData = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const { id: deptSlug } = useParams({ from: "/departments/$id" });
  
  // Extract path tail (the page slug after /departments/deptSlug/)
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);
  const pageSlug = segments[2] || "";

  const { isDeptEditing } = useAdmin();
  const isEditMode = isDeptEditing(deptSlug || "");
  const queryClient = useQueryClient();

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["deptPage", deptSlug, pageSlug, isEditMode],
    queryFn: () => getDepartmentPage({ data: { deptSlug, pageSlug, isPreview: isEditMode } }),
    enabled: Boolean(deptSlug && pageSlug),
  });

  if (!deptData || !deptSlug) return null;

  return (
    <div className="space-y-6">
      {/* Admin Quick Builder Bar */}
      {isEditMode && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={16} className="text-amber-600 animate-pulse" />
            <span>Custom CMS Page: /{pageSlug} ({pageData?.status || "Draft"})</span>
          </div>
          <button
            onClick={() => setIsBuilderOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            <Edit3 size={14} /> Open Visual Builder
          </button>
        </div>
      )}

      {/* Render Page Content via BlockRenderer */}
      {pageData && pageData.blocks && pageData.blocks.length > 0 ? (
        <BlockRenderer blocks={pageData.blocks} />
      ) : (
        <div className="text-center py-16 px-6 bg-slate-50 border border-slate-200/80 rounded-3xl space-y-3">
          <h3 className="text-xl font-bold text-slate-800 capitalize">
            {pageData?.title || pageSlug.replace(/-/g, " ")}
          </h3>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
            {isEditMode
              ? "This custom page has no content blocks yet. Click 'Open Visual Builder' to add sections."
              : "Content for this section will be published soon by the department."}
          </p>
          {isEditMode && (
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2"
            >
              <Edit3 size={14} /> Launch Visual Page Builder
            </button>
          )}
        </div>
      )}

      {/* Visual Page Builder Modal */}
      {isBuilderOpen && (
        <VisualPageBuilder
          deptSlug={deptSlug}
          pageSlug={pageSlug}
          initialTitle={pageData?.title || pageSlug.replace(/-/g, " ")}
          initialBlocks={pageData?.blocks || []}
          pageId={pageData?.id}
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          onPublished={() => {
            queryClient.invalidateQueries({ queryKey: ["deptPage", deptSlug, pageSlug] });
          }}
        />
      )}
    </div>
  );
}
