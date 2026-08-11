/**
 * AdminEditPanel — Shared admin edit-mode UI components.
 * Used across Hostels, Dispensary, Other Amenities, Library, Sports, etc.
 * All amber-themed, consistent spacing, inputs, buttons and labels.
 */

import { Save, Plus, Trash2, X, Edit3 } from "lucide-react";

/* ─── Outer wrapper for any editable section ──────────────────────────── */
export function AdminPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-amber-50/60 border-2 border-amber-200/80 rounded-2xl p-5 space-y-4 animate-[fade-in_0.25s_ease-out] ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Panel header with title + optional action button ────────────────── */
export function AdminPanelHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
      <div className="flex items-center gap-2">
        <Edit3 className="w-3.5 h-3.5 text-amber-700" />
        <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">
          {title}
        </span>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

/* ─── Labelled input field ─────────────────────────────────────────────── */
export function AdminField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-amber-800 uppercase tracking-widest block">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Standard text input ──────────────────────────────────────────────── */
export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border-2 border-amber-200 bg-white rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-amber-400 transition placeholder:text-slate-300 ${props.className ?? ""}`}
    />
  );
}

/* ─── Standard textarea ────────────────────────────────────────────────── */
export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`w-full border-2 border-amber-200 bg-white rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-amber-400 transition resize-none leading-relaxed placeholder:text-slate-300 ${props.className ?? ""}`}
    />
  );
}

/* ─── Save / primary action button ────────────────────────────────────── */
export function AdminSaveButton({
  onClick,
  label = "Save",
  className = "",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-wider shadow transition cursor-pointer ${className}`}
    >
      <Save className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

/* ─── Add / secondary action button ───────────────────────────────────── */
export function AdminAddButton({
  onClick,
  label = "Add",
  className = "",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-600 active:scale-95 text-white font-black px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-wider shadow transition cursor-pointer ${className}`}
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

/* ─── Delete (icon-only) button ────────────────────────────────────────── */
export function AdminDeleteButton({
  onClick,
  round = false,
}: {
  onClick: () => void;
  round?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-slate-300 hover:text-rose-600 hover:bg-rose-50 active:scale-90 transition duration-200 cursor-pointer inline-grid place-items-center ${
        round ? "w-8 h-8 rounded-full" : "w-8 h-8 rounded-xl"
      }`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

/* ─── Small close/remove chip button ──────────────────────────────────── */
export function AdminRemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 hover:bg-rose-600 hover:text-white flex items-center justify-center shrink-0 cursor-pointer transition active:scale-90 shadow-sm border border-amber-200/40"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  );
}

/* ─── Sticky admin mode banner (top of page) ───────────────────────────── */
export function AdminModeBanner({ label }: { label: string }) {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-2.5 px-6 sticky top-0 z-[100] shadow-lg flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.15s] backdrop-blur-md text-[11px] uppercase tracking-widest">
      <span className="inline-block w-2 h-2 rounded-full bg-amber-950 animate-pulse shrink-0" />
      <span>{label}</span>
      <span className="hidden md:inline text-amber-100/70 normal-case italic font-medium text-[10px]">
        — Click any field to edit, then save.
      </span>
    </div>
  );
}

/* ─── Add-entry inline row (input + button) ────────────────────────────── */
export function AdminAddRow({
  value,
  onChange,
  onAdd,
  placeholder = "Type and press Enter or click Add…",
}: {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
  placeholder?: string;
}) {
  return (
    <div className="flex gap-2.5 bg-white border-2 border-amber-200 rounded-xl p-2 shadow-inner">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-2 py-1 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300"
      />
      <AdminAddButton onClick={onAdd} label="Add" className="!px-4 !py-2" />
    </div>
  );
}

/* ─── AdminUpload ───────────────────────────────────────────────────────────
 * Drag and drop zone for general image uploads.
 * ─────────────────────────────────────────────────────────────────────────── */
import { useState, useRef } from "react";
import axios from "axios";
import { Upload, AlertCircle, Camera } from "lucide-react";
import { getAssetUrl } from "@/lib/assets";

export function AdminUpload({
  value,
  onChange,
  module,
  category,
  placeholder = "Drag & drop or click to upload...",
  className = "",
}: {
  value: string;
  onChange: (path: string) => void;
  module: string;
  category: string;
  placeholder?: string;
  className?: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type.toLowerCase())) {
      setError("Allowed formats: JPEG, JPG, PNG, WEBP.");
      return false;
    }
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError("File exceeds 5MB limit.");
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", module);
    formData.append("category", category);

    try {
      setProgress(0);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      if (res.data.success && res.data.path) {
        onChange(res.data.path);
        setProgress(null);
      } else {
        setError(res.data.error || "Upload failed");
        setProgress(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Upload failed");
      setProgress(null);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => {
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setError(null);
  };

  const triggerInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const previewUrl = value ? getAssetUrl(value) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      {previewUrl ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-amber-200 aspect-[16/9] max-h-48 bg-slate-50 flex items-center justify-center shadow-inner">
          <img decoding="async" loading="lazy" src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={triggerInput}
              className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-4.5 py-2 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="bg-rose-600 hover:bg-rose-700 text-white font-black px-4.5 py-2 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerInput}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            dragOver
              ? "border-amber-500 bg-amber-50/50"
              : "border-amber-200 bg-white hover:border-amber-400"
          }`}
        >
          <Upload className="w-8 h-8 text-amber-500 animate-bounce duration-1000" />
          <span className="text-xs font-semibold text-slate-600">{placeholder}</span>
          <span className="text-[10px] text-slate-400">JPEG, PNG, WEBP up to 5MB</span>
        </div>
      )}

      {progress !== null && (
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-amber-200">
          <div
            className="bg-amber-500 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-[11px] p-2 rounded-lg bg-rose-50 border border-rose-200/60">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />
    </div>
  );
}

/* ─── PersonAvatarUpload ────────────────────────────────────────────────────
 * Circular portrait-style uploader for person profile photos.
 * Renders a round zone matching the displayed avatar shape.
 * Props:
 *   value    — current DB path or empty string
 *   onChange — called with new DB path on successful upload
 *   module   — upload module (e.g. "facilities")
 *   category — upload category/subfolder (e.g. "sports/director")
 *   size     — diameter in pixels, default 96
 * ─────────────────────────────────────────────────────────────────────────*/
export function PersonAvatarUpload({
  value,
  onChange,
  module,
  category,
  size = 96,
}: {
  value: string;
  onChange: (v: string) => void;
  module: string;
  category: string;
  size?: number;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewUrl = value ? getAssetUrl(value) : null;

  const upload = async (file: File) => {
    setError(null);
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type.toLowerCase())) {
      setError("JPEG, PNG or WEBP only");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Max 5 MB");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("module", module);
    fd.append("category", category);
    setProgress(10);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json() as { success: boolean; path?: string; error?: string };
      setProgress(100);
      if (json.success && json.path) {
        onChange(json.path);
      } else {
        setError(json.error || "Upload failed");
      }
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      {/* Circle zone */}
      <div
        className="relative group cursor-pointer rounded-full border-[3px] border-dashed border-amber-300 hover:border-amber-500 bg-slate-50 transition-all duration-300 overflow-hidden shadow-md"
        style={{ width: size, height: size }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}
      >
        {previewUrl ? (
          <>
            <img decoding="async" loading="lazy" src={previewUrl} className="w-full h-full object-cover" alt="Portrait" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Camera className="w-5 h-5 text-white" />
              <span className="text-[9px] text-white font-black tracking-wider uppercase">Change</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <Camera className="text-amber-400" style={{ width: size * 0.28, height: size * 0.28 }} />
            <span className="text-amber-500 font-black tracking-widest uppercase" style={{ fontSize: size * 0.09 }}>Upload</span>
          </div>
        )}
      </div>

      {/* Progress */}
      {progress !== null && (
        <div className="bg-slate-100 rounded-full overflow-hidden" style={{ width: size, height: 4 }}>
          <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Remove */}
      {previewUrl && !progress && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(""); }}
          className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold transition cursor-pointer"
        >
          Remove
        </button>
      )}

      {/* Error */}
      {error && <p className="text-[10px] text-rose-600 font-semibold text-center" style={{ maxWidth: size }}>{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
      />
    </div>
  );
}

/* ─── AdminMultiUpload ───────────────────────────────────────────────────────
 * Drop zone that accepts multiple images at once.
 * Uploads them sequentially and calls onAdd(path) for each success.
 * Shows a live per-file progress queue while uploading.
 * ─────────────────────────────────────────────────────────────────────────── */
type FileJob = { id: string; name: string; progress: number; done: boolean; error?: string };

export function AdminMultiUpload({
  onAdd,
  module,
  category,
  className = "",
}: {
  onAdd: (path: string) => Promise<void> | void;
  module: string;
  category: string;
  className?: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [queue, setQueue] = useState<FileJob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateJob = (id: string, patch: Partial<FileJob>) =>
    setQueue((q) => q.map((j) => (j.id === id ? { ...j, ...patch } : j)));

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => {
      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      return allowed.includes(f.type.toLowerCase()) && f.size <= 5 * 1024 * 1024;
    });
    if (!arr.length) return;

    // Create unique IDs for these jobs
    const jobs = arr.map((f) => ({
      id: Math.random().toString(36).substring(2, 11),
      name: f.name,
      progress: 0,
      done: false,
    }));

    // Update queue state purely
    setQueue((q) => [...q, ...jobs]);

    // Kick off uploads sequentially
    for (let i = 0; i < arr.length; i++) {
      const job = jobs[i];
      const fd = new FormData();
      fd.append("file", arr[i]);
      fd.append("module", module);
      fd.append("category", category);
      try {
        const res = await axios.post("/api/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) updateJob(job.id, { progress: Math.round((e.loaded * 100) / e.total) });
          },
        });
        if (res.data.success && res.data.path) {
          await onAdd(res.data.path);
          updateJob(job.id, { progress: 100, done: true });
        } else {
          updateJob(job.id, { done: true, error: res.data.error || "Failed" });
        }
      } catch (err: any) {
        updateJob(job.id, { done: true, error: err.message || "Failed" });
      }
    }

    setTimeout(() => setQueue((q) => q.filter((j) => !j.done)), 2500);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all duration-300 flex items-center gap-4 ${
          dragOver
            ? "border-amber-500 bg-amber-50 scale-[1.01]"
            : "border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50/30"
        }`}
      >
        <div className={`w-12 h-12 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center shrink-0 transition-transform duration-300 ${dragOver ? "scale-110" : ""}`}>
          <Upload className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <p className="text-xs font-black text-slate-700">Drop images here or click to select multiple</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">JPEG, PNG, WEBP &middot; max 5 MB each &middot; any number of files</p>
        </div>
      </div>

      {/* Live upload queue */}
      {queue.length > 0 && (
        <div className="space-y-1.5">
          {queue.map((job) => (
            <div key={job.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-700 truncate">{job.name}</p>
                <div className="mt-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      job.error ? "bg-rose-500" : job.done ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
              <span className={`text-[10px] font-black shrink-0 tabular-nums ${
                job.error ? "text-rose-500" : job.done ? "text-emerald-600" : "text-amber-600"
              }`}>
                {job.error ? "✗" : job.done ? "✓" : `${job.progress}%`}
              </span>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
