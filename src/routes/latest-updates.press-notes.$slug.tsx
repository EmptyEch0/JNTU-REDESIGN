import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  FileText,
  Calendar,
  Clock,
  ArrowLeft,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Pencil,
  X,
  Check,
  ZoomIn,
  Image as ImageIcon,
} from "lucide-react";
import {
  PRESS_NOTES,
  getActivePressNotes,
  savePressNoteToStorage,
  PressNote,
} from "@/data/latest-updates";
import { useAdmin } from "@/context/AdminContext";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { toast } from "sonner";

const heroBg = "/images/hero-carousal/hero-campus.webp";

export const Route = createFileRoute("/latest-updates/press-notes/$slug")({
  head: ({ params }) => {
    const all = typeof window !== "undefined" ? getActivePressNotes() : PRESS_NOTES;
    const note = all.find((n) => n.slug === params.slug) || PRESS_NOTES[0];
    return {
      meta: [
        { title: `${note?.title || "Press Note"} — JNTU-GV CEV` },
        {
          name: "description",
          content: note?.excerpt || "Official university press note from JNTU-GV.",
        },
        { property: "og:title", content: note?.title || "Press Note — JNTU-GV CEV" },
        { property: "og:description", content: note?.excerpt || "" },
      ],
    };
  },
  component: PressNoteDetailPage,
});

function PressNoteDetailPage() {
  const { slug } = Route.useParams();
  const { isAdmin } = useAdmin();

  const [note, setNote] = useState<PressNote | undefined>(() => {
    return getActivePressNotes().find((n) => n.slug === slug);
  });

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PressNote>>({});
  const [isZoomingImage, setIsZoomingImage] = useState(false);

  useEffect(() => {
    const found = getActivePressNotes().find((n) => n.slug === slug);
    setNote(found);
    if (found) {
      setEditForm({ ...found });
    }
  }, [slug]);

  const handleStartEdit = () => {
    if (note) {
      setEditForm({
        ...note,
        imageUrl: note.imageUrl || (/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(note.documentUrl || "") ? note.documentUrl : ""),
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note || !editForm.title || !editForm.excerpt) {
      toast.error("Please provide both a title and an excerpt.");
      return;
    }

    const updatedNote: PressNote = {
      ...note,
      title: editForm.title || note.title,
      category: editForm.category || note.category,
      status: editForm.status || note.status,
      publishedAt: editForm.publishedAt || note.publishedAt,
      documentDate: editForm.documentDate || note.documentDate,
      revisedDate: editForm.revisedDate || note.revisedDate,
      excerpt: editForm.excerpt || note.excerpt,
      heading: editForm.heading || note.heading,
      subject: editForm.subject || note.subject,
      documentUrl: editForm.documentUrl || note.documentUrl,
      documentName: editForm.documentName || note.documentName,
      imageUrl: editForm.imageUrl || (/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(editForm.documentUrl || "") ? editForm.documentUrl : note.imageUrl),
      sourceUrl: editForm.sourceUrl || note.sourceUrl,
      sourceName: editForm.sourceName || note.sourceName,
      signedBy: editForm.signedBy || note.signedBy,
      isCustom: true,
    };

    savePressNoteToStorage(updatedNote);
    setNote(updatedNote);
    setIsEditing(false);
    toast.success("Press note / news article updated successfully!");
  };

  if (!note) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="text-3xl font-bold text-ink">Press Note Not Found</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          The requested official release could not be located or has been archived.
        </p>
        <Link to="/latest-updates" className="btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" /> Return to Latest Updates
        </Link>
      </div>
    );
  }

  const isImageDoc =
    Boolean(note.imageUrl) ||
    Boolean(note.documentUrl && /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(note.documentUrl));
  const activeImageUrl = note.imageUrl || (isImageDoc ? note.documentUrl : "");

  return (
    <>
      <PageHero
        eyebrow="Press Release & News Coverage"
        title="Official Notification"
        subtitle="Complete record, scanned media coverage, and official details of university announcements."
        image={heroBg}
      />

      <section className="py-12 md:py-20 bg-sand/30 min-h-screen">
        <div className="container-narrow max-w-4xl mx-auto px-4">
          {/* Top Actions Bar */}
          <RevealOnScroll>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <Link
                to="/latest-updates"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Latest Updates
              </Link>

              {/* Admin Edit Trigger */}
              {isAdmin && (
                <button
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 font-bold text-xs uppercase tracking-wider transition shadow-xs cursor-pointer"
                  title="Edit Press Note & Upload Clipping Image/PDF"
                >
                  <Pencil className="h-3.5 w-3.5 text-amber-600" />
                  Edit Article / Upload Clipping
                </button>
              )}
            </div>
          </RevealOnScroll>

          {/* Main Document Card Container */}
          <RevealOnScroll delay={80}>
            <div className="bg-white rounded-[36px] border border-border shadow-elegant overflow-hidden">
              {/* Document Header & Metadata Bar */}
              <div className="p-6 sm:p-10 border-b border-border bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
                <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 mb-6">
                  <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-slate-200/90 p-2 shadow-xs flex items-center justify-center">
                    <img
                      src="/logo-circle.png"
                      alt="JNTU-GV Emblem"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          {note.category}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                          Status: {note.status}
                        </span>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-ink leading-tight tracking-tight">
                      {note.title}
                    </h1>
                  </div>
                </div>

                {/* Structured Metadata Grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-border/80 shadow-xs">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Published
                    </div>
                    <div className="text-sm font-bold text-ink mt-0.5 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {note.publishedAt}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Document Date
                    </div>
                    <div className="text-sm font-bold text-ink mt-0.5 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      {note.documentDate}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary font-bold">
                      Revised Date
                    </div>
                    <div className="text-sm font-extrabold text-primary mt-0.5 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {note.revisedDate}
                    </div>
                  </div>
                </div>

                {/* Prominent Action Buttons Bar */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {note.documentUrl && (
                    <a
                      href={note.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary !py-3.5 !px-7 text-xs uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Download className="h-4 w-4" />
                      {isImageDoc ? "VIEW FULL RESOLUTION CLIPPING" : "VIEW UPLOADED SOURCE DOCUMENT"}
                      <ExternalLink className="h-3.5 w-3.5 opacity-70 ml-1" />
                    </a>
                  )}

                  {note.sourceUrl && note.sourceUrl !== note.documentUrl && (
                    <a
                      href={note.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Official Link / Registration Form
                    </a>
                  )}
                </div>
              </div>

              {/* Complete Official Document Body */}
              <div className="p-6 sm:p-10 md:p-12 space-y-8 font-sans text-ink">
                {/* Intro / Corrigendum Statement */}
                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 text-sm sm:text-base leading-relaxed font-medium text-slate-800">
                  <p className="font-bold text-primary mb-1 uppercase tracking-wider text-xs">
                    {note.category === "PRESS COVERAGE" ? "Press Release Overview" : "Official Overview"}
                  </p>
                  {note.excerpt}
                </div>

                {/* Newspaper Clipping Image Display */}
                {activeImageUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-primary" /> Newspaper / Media Clipping
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsZoomingImage(true)}
                        className="text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ZoomIn className="h-3.5 w-3.5" /> Expand Preview
                      </button>
                    </div>

                    <div
                      onClick={() => setIsZoomingImage(true)}
                      className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-50 relative group cursor-pointer"
                    >
                      <img
                        src={activeImageUrl}
                        alt={note.title}
                        className="w-full h-auto max-h-[700px] object-contain mx-auto transition duration-300 group-hover:scale-[1.01]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center pointer-events-none">
                        <span className="opacity-0 group-hover:opacity-100 bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2">
                          <ZoomIn className="h-4 w-4" /> Click to Zoom
                        </span>
                      </div>
                      <div className="p-3 bg-slate-100/90 border-t border-slate-200 text-xs text-slate-600 text-center font-semibold">
                        📰 Official Media Publication Clipping — {note.title}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* References */}
                {note.references && note.references.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      References & Contacts:
                    </h3>
                    <ol className="space-y-2.5 list-decimal list-inside text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
                      {note.references.map((refText, idx) => (
                        <li key={idx} className="pl-1">
                          <span className="font-normal">{refText}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Subject and Heading */}
                <div className="space-y-4 pt-4 border-t border-border">
                  {note.heading && (
                    <div className="text-center py-2">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
                        {note.heading}
                      </span>
                    </div>
                  )}

                  {note.subject && (
                    <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
                      <span className="text-amber-900 font-bold uppercase text-xs block mb-1">
                        Subject
                      </span>
                      {note.subject}
                    </div>
                  )}
                </div>

                {/* Schedule Table */}
                {note.schedule && note.schedule.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Revised Schedule Details:
                    </h3>
                    <div className="overflow-x-auto rounded-2xl border border-border shadow-xs">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-border">
                          <tr>
                            <th className="p-4">Activity</th>
                            <th className="p-4 whitespace-nowrap">Existing Date</th>
                            <th className="p-4 whitespace-nowrap text-primary">Revised Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                          {note.schedule.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-4 font-medium text-slate-800 leading-relaxed">
                                {row.activity}
                              </td>
                              <td className="p-4 whitespace-nowrap text-slate-600 font-semibold">
                                {row.existingDate}
                              </td>
                              <td className="p-4 whitespace-nowrap text-primary font-extrabold bg-primary/5">
                                {row.revisedDate}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Terms and Notes */}
                {note.notes && note.notes.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed italic space-y-2">
                    {note.notes.map((noteText, idx) => (
                      <p key={idx}>{noteText}</p>
                    ))}
                  </div>
                )}

                {/* Official Signoff */}
                {note.signedBy && (
                  <div className="pt-6 border-t border-border flex justify-end">
                    <div className="text-right space-y-1">
                      <div className="text-sm font-bold text-slate-900 whitespace-pre-line">
                        {note.signedBy}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        JNTU-GV College of Engineering Vizianagaram
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Image Zoom Lightbox Modal ── */}
      {isZoomingImage && activeImageUrl && (
        <div
          onClick={() => setIsZoomingImage(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[95vh] w-full bg-slate-900 rounded-3xl p-3 sm:p-5 overflow-auto shadow-2xl flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between pb-3 text-white border-b border-white/10 mb-3">
              <span className="text-xs font-bold truncate pr-4">{note.title}</span>
              <button
                type="button"
                onClick={() => setIsZoomingImage(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <img
              src={activeImageUrl}
              alt={note.title}
              className="max-h-[80vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* ── Admin Edit Modal with File/Image/PDF/Link Upload ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">Edit Press / News Article</h3>
                  <p className="text-xs text-muted-foreground">
                    Update article details and upload newspaper clipping image or PDF.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title || ""}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editForm.category || ""}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    placeholder="PRESS COVERAGE"
                    className="w-full bg-slate-50 border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Document Date
                  </label>
                  <input
                    type="text"
                    value={editForm.documentDate || ""}
                    onChange={(e) => setEditForm({ ...editForm, documentDate: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-slate-50 border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Short Excerpt / Lead Paragraph *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editForm.excerpt || ""}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                  className="w-full bg-slate-50 border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Newspaper Clipping Image / PDF / Link Upload */}
              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/80 space-y-3">
                <FileUploadDropzone
                  label="Newspaper Clipping / Photo / PDF Upload"
                  sublabel="Drag & drop scanned clipping photo (JPG/PNG/WEBP), PDF document, or paste link"
                  value={editForm.imageUrl || editForm.documentUrl || ""}
                  onChange={(uploadedPath) => {
                    const isImg = /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(uploadedPath);
                    setEditForm({
                      ...editForm,
                      imageUrl: isImg ? uploadedPath : editForm.imageUrl,
                      documentUrl: uploadedPath,
                    });
                  }}
                  module="press"
                  category="clippings"
                  fileNamePrefix={editForm.title || "press-clipping"}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={editForm.heading || ""}
                    onChange={(e) => setEditForm({ ...editForm, heading: e.target.value })}
                    placeholder="OFFICIAL NOTIFICATION"
                    className="w-full bg-slate-50 border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    External Source / Registration Form Link
                  </label>
                  <input
                    type="text"
                    value={editForm.sourceUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, sourceUrl: e.target.value })}
                    placeholder="https://forms.gle/..."
                    className="w-full bg-slate-50 border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Official Signoff / Authority
                </label>
                <input
                  type="text"
                  value={editForm.signedBy || ""}
                  onChange={(e) => setEditForm({ ...editForm, signedBy: e.target.value })}
                  placeholder="University Public Relations Cell & Committee"
                  className="w-full bg-slate-50 border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-ink font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !px-6 !py-2.5 !text-xs uppercase tracking-wider font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
