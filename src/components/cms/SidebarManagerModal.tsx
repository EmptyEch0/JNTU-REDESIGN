import { useState } from "react";
import {
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  EyeOff,
  Save,
  BookOpen,
  Users,
  GraduationCap,
  FlaskConical,
  Trophy,
  Image as ImageIcon,
  FolderKanban,
  Award,
  FileText,
  Download,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  Briefcase,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import {
  saveDepartmentNavItems,
  createDepartmentNavPage,
  deleteDepartmentNavPage,
  type DepartmentNavItem,
  type PageType,
} from "@/funcs/department-cms.server";

interface SidebarManagerModalProps {
  deptSlug: string;
  items: DepartmentNavItem[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const AVAILABLE_ICONS = [
  { name: "BookOpen", label: "Book / Overview" },
  { name: "Users", label: "Faculty / People" },
  { name: "GraduationCap", label: "Programmes / Academic" },
  { name: "FlaskConical", label: "Laboratories / Research" },
  { name: "Trophy", label: "Achievements / Awards" },
  { name: "ImageIcon", label: "Gallery / Photos" },
  { name: "Award", label: "Accreditation / Honors" },
  { name: "FileText", label: "Curriculum / Syllabus" },
  { name: "Download", label: "Downloads / Resources" },
  { name: "Sparkles", label: "Special Initiatives" },
  { name: "Layers", label: "Facilities / Labs" },
  { name: "Briefcase", label: "Placements / Careers" },
  { name: "Lightbulb", label: "Innovation / Projects" },
  { name: "HelpCircle", label: "FAQ / Helpdesk" },
  { name: "Clock", label: "Time Tables / Schedule" },
];

export function SidebarManagerModal({
  deptSlug,
  items: initialItems,
  isOpen,
  onClose,
  onRefresh,
}: SidebarManagerModalProps) {
  const [items, setItems] = useState<DepartmentNavItem[]>(initialItems || []);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New Page Form State
  const [newPage, setNewPage] = useState<{
    title: string;
    slug: string;
    icon: string;
    position: number;
    showInSidebar: boolean;
    status: "published" | "draft";
    pageType: PageType;
    externalUrl: string;
  }>({
    title: "",
    slug: "",
    icon: "BookOpen",
    position: items.length + 1,
    showInSidebar: true,
    status: "published",
    pageType: "custom",
    externalUrl: "",
  });

  if (!isOpen) return null;

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Recalculate position indexes
    const reindexed = updated.map((it, idx) => ({ ...it, position: idx + 1 }));
    setItems(reindexed);
  };

  const handleToggleSidebar = (index: number) => {
    const updated = [...items];
    updated[index].showInSidebar = !updated[index].showInSidebar;
    setItems(updated);
  };

  const handleDelete = async (item: DepartmentNavItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      await deleteDepartmentNavPage({ data: { id: item.id, deptSlug } });
      toast.success("Nav page removed");
      onRefresh();
      onClose();
    } catch {
      toast.error("Failed to delete page");
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      await saveDepartmentNavItems({
        data: {
          deptSlug,
          items: items.map((it, idx) => ({
            id: it.id,
            title: it.title,
            slug: it.slug,
            icon: it.icon,
            position: idx + 1,
            parentId: it.parentId,
            showInSidebar: it.showInSidebar,
            status: it.status,
            pageType: it.pageType,
            externalUrl: it.externalUrl,
          })),
        },
      });
      toast.success("Sidebar navigation saved successfully!");
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update navigation");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title.trim()) {
      toast.error("Page title is required");
      return;
    }

    const cleanSlug = (newPage.slug || newPage.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/^-+|-+$/g, "");

    setIsSaving(true);
    try {
      await createDepartmentNavPage({
        data: {
          deptSlug,
          title: newPage.title.trim(),
          slug: cleanSlug,
          icon: newPage.icon,
          showInSidebar: newPage.showInSidebar,
          status: newPage.status,
          pageType: newPage.pageType,
          externalUrl: newPage.externalUrl || undefined,
        },
      });

      toast.success(`Created page "${newPage.title}"!`);
      setIsAddingNew(false);
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create page");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-[fade-in_0.2s_ease-out]">
      <div
        className="bg-card text-card-foreground border border-border/80 w-full max-w-2xl rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[88vh] animate-[scale-in_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-ink tracking-tight">
                Department Navigation CMS
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reorder links, toggle visibility, and create dynamic subpages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-full transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5">
          {!isAddingNew ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  Sidebar Items
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-semibold">
                    {items.length}
                  </span>
                </span>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  <Plus className="h-4 w-4" /> Add New Page
                </button>
              </div>

              <div className="space-y-2.5">
                {items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      item.showInSidebar
                        ? "bg-background border-border/70 shadow-sm hover:border-primary/40"
                        : "bg-muted/40 border-border/40 text-muted-foreground opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <span className="w-6 text-center text-xs font-mono text-muted-foreground font-bold shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/15">
                        {renderIcon(item.icon)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[idx].title = e.target.value;
                            setItems(updated);
                          }}
                          className="font-bold text-sm bg-transparent outline-none border-b border-transparent hover:border-border focus:border-primary text-foreground w-full transition-colors py-0.5"
                        />
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground font-mono">
                          <span>/{item.slug || "(home)"}</span>
                          <span>•</span>
                          <span className="capitalize px-1.5 py-0.2 rounded bg-muted text-[10px] font-semibold text-primary">
                            {item.pageType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleSidebar(idx)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
                          item.showInSidebar
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border/60 hover:bg-muted/80"
                        }`}
                        title="Toggle Visibility in Sidebar"
                      >
                        {item.showInSidebar ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                        <span>{item.showInSidebar ? "Visible" : "Hidden"}</span>
                      </button>

                      <div className="flex items-center rounded-xl bg-muted/50 p-0.5 border border-border/50">
                        <button
                          onClick={() => handleMove(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, "down")}
                          disabled={idx === items.length - 1}
                          className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {item.slug !== "" &&
                        item.slug !== "hod" &&
                        item.slug !== "courses" &&
                        item.slug !== "faculty" && (
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 rounded-xl transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Create New Page Form */
            <form onSubmit={handleCreatePage} className="space-y-4 animate-[fade-in_0.2s_ease-out]">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Create New Department Page</h4>
                  <p className="text-xs text-muted-foreground">Add a custom dynamic section with the Visual Builder</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  ← Back to List
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Page Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPage.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setNewPage({
                        ...newPage,
                        title: t,
                        slug: t
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9-]/g, "-")
                          .replace(/^-+|-+$/g, ""),
                      });
                    }}
                    placeholder="e.g. Research & Facilities"
                    required
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono text-muted-foreground focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <span>/{deptSlug}/</span>
                    <input
                      type="text"
                      value={newPage.slug}
                      onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                      placeholder="research-facilities"
                      required
                      className="bg-transparent text-foreground outline-none w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Section Icon
                  </label>
                  <select
                    value={newPage.icon}
                    onChange={(e) => setNewPage({ ...newPage, icon: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {AVAILABLE_ICONS.map((ico) => (
                      <option key={ico.name} value={ico.name}>
                        {ico.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Page Architecture
                  </label>
                  <select
                    value={newPage.pageType}
                    onChange={(e) =>
                      setNewPage({ ...newPage, pageType: e.target.value as PageType })
                    }
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="custom">Custom Page (Visual Block Builder)</option>
                    <option value="standard">Standard Content Page</option>
                    <option value="documents">Documents & Downloads List</option>
                    <option value="external">External Link</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2.5 text-xs font-medium text-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newPage.showInSidebar}
                    onChange={(e) =>
                      setNewPage({ ...newPage, showInSidebar: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span>Show immediately in department sidebar navigation</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-full border border-border hover:bg-muted text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-semibold rounded-full bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> Create Page
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {!isAddingNew && (
          <div className="p-4 sm:p-5 bg-muted/30 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Order and title edits take effect upon saving
            </span>
            <button
              onClick={handleSaveOrder}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Save Sidebar & Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function renderIcon(iconName: string) {
  switch (iconName) {
    case "BookOpen":
      return <BookOpen className="h-4 w-4" />;
    case "Users":
      return <Users className="h-4 w-4" />;
    case "GraduationCap":
      return <GraduationCap className="h-4 w-4" />;
    case "FlaskConical":
      return <FlaskConical className="h-4 w-4" />;
    case "Trophy":
      return <Trophy className="h-4 w-4" />;
    case "ImageIcon":
      return <ImageIcon className="h-4 w-4" />;
    case "Award":
      return <Award className="h-4 w-4" />;
    case "FileText":
      return <FileText className="h-4 w-4" />;
    case "Download":
      return <Download className="h-4 w-4" />;
    case "Sparkles":
      return <Sparkles className="h-4 w-4" />;
    case "Layers":
      return <Layers className="h-4 w-4" />;
    case "Briefcase":
      return <Briefcase className="h-4 w-4" />;
    case "Lightbulb":
      return <Lightbulb className="h-4 w-4" />;
    case "HelpCircle":
      return <HelpCircle className="h-4 w-4" />;
    case "Clock":
      return <Clock className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
}
