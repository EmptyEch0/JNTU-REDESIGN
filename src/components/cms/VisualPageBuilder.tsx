import { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Save,
  CheckCircle,
  History,
  X,
  Layers,
  Sparkles,
  Heading,
  FileText,
  Image as ImageIcon,
  Grid,
  CreditCard,
  MousePointer,
  Minus,
  Quote,
  Users,
  Trophy,
  HelpCircle,
  Clock,
  Table,
  PhoneCall,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  saveDepartmentPageDraft,
  publishDepartmentPage,
  getPageVersions,
  restorePageVersion,
  type DepartmentPageBlock,
  type PageVersion,
} from "@/funcs/department-cms.server";
import { BlockRenderer } from "./BlockRenderer";
import { MediaLibraryModal } from "./MediaLibraryModal";

interface VisualPageBuilderProps {
  deptSlug: string;
  pageSlug: string;
  initialTitle: string;
  initialBlocks: DepartmentPageBlock[];
  pageId?: number;
  isOpen: boolean;
  onClose: () => void;
  onPublished?: () => void;
}

const BLOCK_LIBRARY = [
  { type: "heading", label: "Heading", category: "Basic", icon: Heading, desc: "Title with optional eyebrow & subtitle" },
  { type: "richtext", label: "Rich Text", category: "Basic", icon: FileText, desc: "Formatted text, lists, and links" },
  { type: "image", label: "Image", category: "Basic", icon: ImageIcon, desc: "Single image with caption" },
  { type: "imagetext", label: "Image + Text", category: "Basic", icon: Grid, desc: "Side-by-side feature layout" },
  { type: "columns", label: "Multi-Column", category: "Basic", icon: Grid, desc: "2 or 3 column content grid" },
  { type: "cards", label: "Cards Grid", category: "Basic", icon: CreditCard, desc: "Repeatable cards for scholarships & centers" },
  { type: "button", label: "Button / CTA", category: "Basic", icon: MousePointer, desc: "Action button or link" },
  { type: "divider", label: "Divider", category: "Basic", icon: Minus, desc: "Section separator line" },
  { type: "quote", label: "Quote", category: "Basic", icon: Quote, desc: "Highlighted callout or quotation" },

  { type: "documents", label: "Documents / PDFs", category: "Advanced", icon: Download, desc: "Downloadable PDF file list" },
  { type: "faq", label: "FAQ Accordion", category: "Advanced", icon: HelpCircle, desc: "Expandable Q&A accordion list" },
  { type: "stats", label: "Statistics", category: "Advanced", icon: Sparkles, desc: "Numerical counter callouts" },
  { type: "timeline", label: "Timeline", category: "Advanced", icon: Clock, desc: "Milestones / chronological events" },
];

export function VisualPageBuilder({
  deptSlug,
  pageSlug,
  initialTitle,
  initialBlocks,
  pageId,
  isOpen,
  onClose,
  onPublished,
}: VisualPageBuilderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState<DepartmentPageBlock[]>(initialBlocks || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<{ blockId: string; field: string; subIdx?: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await saveDepartmentPageDraft({
        data: {
          deptSlug,
          pageSlug,
          title,
          blocks,
        },
      });
      toast.success("Draft saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
  
    try {
      // 1. Save the current editor state as draft
      await saveDepartmentPageDraft({
        data: {
          deptSlug,
          pageSlug,
          title,
          blocks,
        },
      });
  
      // 2. Copy draft -> published
      const res = await publishDepartmentPage({
        data: {
          deptSlug,
          pageSlug,
        },
      });
  
      toast.success(
        `Page published live! (Version ${res.versionNumber})`
      );
  
      // 3. Notify parent if provided
      if (onPublished) {
        onPublished();
      }
  
      // 4. Close CMS editor
      onClose();
  
      // 5. IMPORTANT:
      // Reload the actual public page so it fetches
      // the newly published blocks from the database.
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err: any) {
      console.error("Publish failed:", err);
      toast.error(err.message || "Failed to publish page");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBlock = (type: string) => {
    const newBlock: DepartmentPageBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      visible: true,
      content: getDefaultContentForType(type, title),
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setIsLibraryOpen(false);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setBlocks(updated);
  };

  const handleDuplicate = (index: number) => {
    const original = blocks[index];
    const copy: DepartmentPageBlock = {
      ...original,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      content: JSON.parse(JSON.stringify(original.content)),
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, copy);
    setBlocks(updated);
  };

  const handleDelete = (index: number) => {
    const updated = blocks.filter((_, idx) => idx !== index);
    setBlocks(updated);
    if (selectedBlockId === blocks[index]?.id) setSelectedBlockId(null);
  };

  const handleToggleVisibility = (index: number) => {
    const updated = [...blocks];
    updated[index].visible = !(updated[index].visible ?? true);
    setBlocks(updated);
  };

  const updateBlockContent = (blockId: string, updates: Record<string, any>) => {
    setBlocks(
      blocks.map((b) => (b.id === blockId ? { ...b, content: { ...b.content, ...updates } } : b))
    );
  };

  const loadVersions = async () => {
    if (!pageId) return;
    try {
      const res = await getPageVersions({ data: { pageId } });
      setVersions(res);
      setIsHistoryOpen(true);
    } catch {
      toast.error("Failed to load version history");
    }
  };

  const handleRestore = async (versionId: number) => {
    if (!pageId) return;
    try {
      const res = await restorePageVersion({ data: { pageId, versionId } });
      toast.success(`Restored Version ${res.restoredVersion} to draft!`);
      setIsHistoryOpen(false);
      window.location.reload();
    } catch {
      toast.error("Failed to restore version");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background text-foreground font-sans animate-[fade-in_0.2s_ease-out]">
      {/* Top Navbar */}
      <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-serif text-base font-bold bg-transparent border-b border-transparent hover:border-border focus:border-primary text-foreground outline-none px-1 py-0.5 transition-colors"
              placeholder="Page Title"
            />
            <p className="text-[11px] text-muted-foreground font-mono">
              /departments/{deptSlug}/{pageSlug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
              isPreview
                ? "bg-amber-500 text-black border-amber-600 shadow-sm"
                : "bg-background border-border text-foreground hover:bg-muted"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> {isPreview ? "Canvas Editor" : "Live Preview"}
          </button>

          {pageId && (
            <button
              onClick={loadVersions}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-background border border-border text-foreground hover:bg-muted transition-colors"
            >
              <History className="h-3.5 w-3.5 text-muted-foreground" /> Versions
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-background hover:bg-muted text-foreground border border-border transition-colors disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> Save Draft
          </button>

          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" /> Publish Page
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-1"
            title="Close Visual Builder"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace split */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Block Stream */}
        {!isPreview && (
          <aside className="w-80 bg-card/60 border-r border-border flex flex-col shrink-0">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Page Blocks ({blocks.length})
              </span>
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Add Block
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {blocks.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <Layers size={32} className="mx-auto text-slate-600" />
                  <p className="text-xs text-slate-400">No blocks added yet.</p>
                  <button
                    onClick={() => setIsLibraryOpen(true)}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    + Choose First Block
                  </button>
                </div>
              ) : (
                blocks.map((block, idx) => {
                  const isSelected = selectedBlockId === block.id;
                  const isVisible = block.visible !== false;
                  return (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground shadow-sm ring-1 ring-primary/20"
                          : "bg-background border-border/70 text-foreground hover:border-border"
                      } ${!isVisible ? "opacity-40" : ""}`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                          #{idx + 1} {block.type}
                        </span>
                        <p className="text-xs font-semibold truncate text-foreground">
                          {block.content?.title || block.content?.label || `${block.type} section`}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleVisibility(idx);
                          }}
                          className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                          title="Toggle visibility"
                        >
                          {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(idx, "up");
                          }}
                          disabled={idx === 0}
                          className="p-1 hover:text-foreground text-muted-foreground disabled:opacity-30 transition-colors"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(idx, "down");
                          }}
                          disabled={idx === blocks.length - 1}
                          className="p-1 hover:text-foreground text-muted-foreground disabled:opacity-30 transition-colors"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(idx);
                          }}
                          className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(idx);
                          }}
                          className="p-1 hover:text-rose-500 text-muted-foreground transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}

        {/* Center Live Canvas View */}
        <main className="flex-1 overflow-y-auto bg-muted/30 text-foreground p-6 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-sm">
              {/* Live rendered blocks */}
              <BlockRenderer blocks={blocks} />

              {blocks.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl p-8 space-y-3">
                  <Sparkles className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="text-lg font-serif font-bold text-foreground">Your custom page is empty</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Click "+ Add Block" on the left panel to insert interactive sections, text, cards, and media.
                  </p>
                  <button
                    onClick={() => setIsLibraryOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    + Add First Block
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Inspector Drawer (for selected block editing) */}
        {!isPreview && selectedBlockId && (
          <aside className="w-80 bg-card border-l border-border p-5 overflow-y-auto shrink-0 space-y-6">
            {renderBlockInspector({
              block: blocks.find((b) => b.id === selectedBlockId)!,
              onUpdate: (updates) => updateBlockContent(selectedBlockId, updates),
              onOpenMedia: (field, subIdx) => {
                setMediaTargetField({ blockId: selectedBlockId, field, subIdx });
                setIsMediaOpen(true);
              },
            })}
          </aside>
        )}
      </div>

      {/* Block Library Selector Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]">
          <div className="bg-card border border-border text-foreground max-w-3xl w-full rounded-3xl p-6 space-y-6 shadow-2xl animate-[scale-in_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-ink">Reusable Block Library</h3>
                <p className="text-xs text-muted-foreground">Choose a component to insert into your page stream</p>
              </div>
              <button
                onClick={() => setIsLibraryOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {BLOCK_LIBRARY.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.type}
                    onClick={() => handleAddBlock(item.type)}
                    className="p-4 rounded-2xl bg-background hover:bg-primary/5 border border-border hover:border-primary/40 cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm"
                  >
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Version History Drawer */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]">
          <div className="bg-card border border-border text-foreground max-w-lg w-full rounded-3xl p-6 space-y-5 shadow-2xl animate-[scale-in_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif text-base font-bold flex items-center gap-2 text-ink">
                <History className="h-4 w-4 text-primary" /> Version History
              </h3>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  className="p-4 rounded-2xl bg-background border border-border flex items-center justify-between shadow-sm"
                >
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Version {ver.versionNumber}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ver.createdAt).toLocaleString()} • {ver.createdBy}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestore(ver.id)}
                    className="px-3.5 py-1.5 rounded-full border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                  >
                    Restore Version
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaLibraryModal
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={(url) => {
          if (!mediaTargetField) return;
          const { blockId, field, subIdx } = mediaTargetField;
          const targetBlock = blocks.find((b) => b.id === blockId);
          if (!targetBlock) return;

          if (subIdx !== undefined && Array.isArray(targetBlock.content[field])) {
            const updatedItems = [...targetBlock.content[field]];
            updatedItems[subIdx] = { ...updatedItems[subIdx], image: url, url };
            updateBlockContent(blockId, { [field]: updatedItems });
          } else {
            updateBlockContent(blockId, { [field]: url });
          }
        }}
      />
    </div>
  );
}

// ── Default Initial Content for New Blocks ──
function getDefaultContentForType(type: string, pageTitle: string) {
  switch (type) {
    case "heading":
      return { title: pageTitle, subtitle: "Configure subtitle in inspector", level: "h2", align: "left" };
    case "richtext":
      return { html: "<p>Write your detailed information here...</p>" };
    case "image":
      return { url: "/local-assets/uploads/photo-gallery/IMG_6832.JPG", caption: "Caption" };
    case "imagetext":
      return { title: "Feature Title", description: "Detailed description", imageUrl: "/local-assets/uploads/photo-gallery/IMG_6832.JPG", imagePosition: "left" };
    case "columns":
      return {
        items: [
          { title: "Column 1", text: "Details for first column" },
          { title: "Column 2", text: "Details for second column" },
        ],
      };
    case "cards":
      return {
        items: [
          { title: "Scholarship 1", subtitle: "Merit-based", description: "Details about scholarship criteria.", buttonLabel: "Apply Now" },
          { title: "Scholarship 2", subtitle: "Need-based", description: "Details about eligibility.", buttonLabel: "View Details" },
        ],
      };
    case "documents":
      return {
        items: [{ title: "Academic Guidelines PDF", description: "Official PDF document", url: "/local-assets/uploads/2026/08/ii-b-tech-academic-calendar-2026-2027.pdf" }],
      };
    case "faq":
      return {
        items: [
          { question: "Who is eligible?", answer: "All enrolled students." },
          { question: "How to apply?", answer: "Submit application form before deadline." },
        ],
      };
    case "stats":
      return {
        items: [
          { value: "100+", label: "Recipients" },
          { value: "₹25L+", label: "Awarded" },
        ],
      };
    case "timeline":
      return {
        items: [
          { year: "2026", title: "Applications Open", description: "Submission begins" },
          { year: "2026", title: "Selection", description: "Committee review" },
        ],
      };
    default:
      return { title: "New Section" };
  }
}

// ── Inspector Form Renderer for Selected Block ──
function renderBlockInspector({
  block,
  onUpdate,
  onOpenMedia,
}: {
  block: DepartmentPageBlock;
  onUpdate: (updates: Record<string, any>) => void;
  onOpenMedia: (field: string, subIdx?: number) => void;
}) {
  const { content } = block;

  return (
    <div className="space-y-4 text-xs">
      <div className="border-b border-border pb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Inspector</span>
        <h4 className="font-serif font-bold text-sm text-foreground capitalize">{block.type} Settings</h4>
      </div>

      {block.type === "heading" && (
        <>
          <div>
            <label className="text-muted-foreground block mb-1.5 font-semibold">Title</label>
            <input
              type="text"
              value={content.title || ""}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full bg-background border border-border rounded-xl p-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-muted-foreground block mb-1.5 font-semibold">Eyebrow</label>
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(e) => onUpdate({ eyebrow: e.target.value })}
              className="w-full bg-background border border-border rounded-xl p-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-muted-foreground block mb-1.5 font-semibold">Subtitle</label>
            <textarea
              value={content.subtitle || ""}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              className="w-full bg-background border border-border rounded-xl p-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </>
      )}

      {block.type === "richtext" && (
        <div>
          <label className="text-muted-foreground block mb-1.5 font-semibold">HTML Content</label>
          <textarea
            rows={8}
            value={content.html || ""}
            onChange={(e) => onUpdate({ html: e.target.value })}
            className="w-full bg-background border border-border rounded-xl p-2.5 font-mono text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      )}

      {block.type === "image" && (
        <div className="space-y-3">
          <div>
            <label className="text-muted-foreground block mb-1.5 font-semibold">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={content.url || ""}
                onChange={(e) => onUpdate({ url: e.target.value })}
                className="w-full bg-background border border-border rounded-xl p-2.5 text-foreground outline-none"
              />
              <button
                onClick={() => onOpenMedia("url")}
                className="px-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-colors"
              >
                Media
              </button>
            </div>
          </div>
          <div>
            <label className="text-muted-foreground block mb-1.5 font-semibold">Caption</label>
            <input
              type="text"
              value={content.caption || ""}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              className="w-full bg-background border border-border rounded-xl p-2.5 text-foreground outline-none"
            />
          </div>
        </div>
      )}

      {/* Repeatable Cards Inspector */}
      {block.type === "cards" && (
        <div className="space-y-4">
          <label className="text-muted-foreground block font-semibold">Card Items</label>
          {(content.items || []).map((card: any, idx: number) => (
            <div key={idx} className="p-3 bg-background border border-border rounded-2xl space-y-2 shadow-sm">
              <input
                type="text"
                value={card.title || ""}
                onChange={(e) => {
                  const updated = [...content.items];
                  updated[idx] = { ...updated[idx], title: e.target.value };
                  onUpdate({ items: updated });
                }}
                placeholder="Card Title"
                className="w-full bg-muted/40 border border-border rounded-xl p-2 text-foreground font-semibold"
              />
              <input
                type="text"
                value={card.subtitle || ""}
                onChange={(e) => {
                  const updated = [...content.items];
                  updated[idx] = { ...updated[idx], subtitle: e.target.value };
                  onUpdate({ items: updated });
                }}
                placeholder="Subtitle"
                className="w-full bg-muted/40 border border-border rounded-xl p-2 text-foreground"
              />
              <textarea
                value={card.description || ""}
                onChange={(e) => {
                  const updated = [...content.items];
                  updated[idx] = { ...updated[idx], description: e.target.value };
                  onUpdate({ items: updated });
                }}
                placeholder="Description"
                className="w-full bg-muted/40 border border-border rounded-xl p-2 text-foreground text-xs"
                rows={2}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={card.image || ""}
                  onChange={(e) => {
                    const updated = [...content.items];
                    updated[idx] = { ...updated[idx], image: e.target.value };
                    onUpdate({ items: updated });
                  }}
                  placeholder="Image URL"
                  className="w-full bg-muted/40 border border-border rounded-xl p-2 text-foreground text-xs"
                />
                <button
                  onClick={() => onOpenMedia("items", idx)}
                  className="px-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
                >
                  Media
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const updated = [...(content.items || []), { title: "New Item", description: "Details..." }];
              onUpdate({ items: updated });
            }}
            className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            + Add Card Item
          </button>
        </div>
      )}

      {/* Documents Inspector */}
      {block.type === "documents" && (
        <div className="space-y-3">
          <label className="text-muted-foreground block font-semibold">Document Files</label>
          {(content.items || []).map((doc: any, idx: number) => (
            <div key={idx} className="p-3 bg-background border border-border rounded-2xl space-y-2 shadow-sm">
              <input
                type="text"
                value={doc.title || ""}
                onChange={(e) => {
                  const updated = [...content.items];
                  updated[idx] = { ...updated[idx], title: e.target.value };
                  onUpdate({ items: updated });
                }}
                placeholder="Document Title"
                className="w-full bg-muted/40 border border-border rounded-xl p-2 text-foreground font-semibold text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={doc.url || ""}
                  onChange={(e) => {
                    const updated = [...content.items];
                    updated[idx] = { ...updated[idx], url: e.target.value };
                    onUpdate({ items: updated });
                  }}
                  placeholder="PDF / File URL"
                  className="w-full bg-muted/40 border border-border rounded-xl p-2 text-foreground text-xs"
                />
                <button
                  onClick={() => onOpenMedia("items", idx)}
                  className="px-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
                >
                  Browse
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const updated = [...(content.items || []), { title: "New Document PDF", url: "" }];
              onUpdate({ items: updated });
            }}
            className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            + Add Document
          </button>
        </div>
      )}
    </div>
  );
}
