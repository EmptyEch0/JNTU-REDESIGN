import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  File,
  X,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Paperclip,
  RotateCcw,
} from "lucide-react";
import { getAssetUrl } from "@/lib/assets";

interface FileUploadDropzoneProps {
  label?: string;
  sublabel?: string;
  value?: string; // Current uploaded path or URL
  onChange: (path: string) => void;
  module?: string;
  category?: string;
  fileNamePrefix?: string;
  accept?: string;
  maxSizeMB?: number;
  allowUrlInput?: boolean;
  className?: string;
}

export function FileUploadDropzone({
  label = "Upload Document or Picture",
  sublabel = "Drag and drop any file here, or click to browse (PDF, Images, Docs, Zip, etc.)",
  value,
  onChange,
  module = "general",
  category = "general",
  fileNamePrefix = "",
  accept = "*/*",
  maxSizeMB = 50,
  allowUrlInput = true,
  className = "",
}: FileUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileExtension = (pathOrName: string) => {
    if (!pathOrName) return "";
    const clean = pathOrName.split("?")[0];
    const match = clean.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : "";
  };

  const isImageFile = (pathOrName: string) => {
    const ext = getFileExtension(pathOrName);
    return ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "avif"].includes(ext);
  };

  const isPdfFile = (pathOrName: string) => {
    const ext = getFileExtension(pathOrName);
    return ext === "pdf";
  };

  const isExcelFile = (pathOrName: string) => {
    const ext = getFileExtension(pathOrName);
    return ["xls", "xlsx", "csv", "ods"].includes(ext);
  };

  const isWordFile = (pathOrName: string) => {
    const ext = getFileExtension(pathOrName);
    return ["doc", "docx", "rtf", "odt", "txt"].includes(ext);
  };

  const isArchiveFile = (pathOrName: string) => {
    const ext = getFileExtension(pathOrName);
    return ["zip", "rar", "7z", "tar", "gz"].includes(ext);
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    // Size check
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    setUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", module);
    formData.append("category", category);
    if (fileNamePrefix) {
      formData.append("name", fileNamePrefix);
    }

    const tId = toast.loading(`Uploading ${file.name}...`);

    try {
      setUploadProgress(60);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(90);
      const json = await res.json();

      if (json.success) {
        onChange(json.path);
        toast.success(`Uploaded ${file.name} successfully!`, { id: tId });
      } else {
        toast.error(json.error || "Upload failed", { id: tId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file", { id: tId });
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    setCustomUrl("");
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
      toast.success("File link attached!");
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          {label}
        </label>
        {allowUrlInput && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Paperclip className="w-3 h-3" />
            <span>{showUrlInput ? "Dropzone View" : "Paste URL Link"}</span>
          </button>
        )}
      </div>

      {showUrlInput ? (
        <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Paste a direct URL or asset path:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="e.g. https://... or local-assets/uploads/..."
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="button"
              onClick={handleApplyCustomUrl}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Attach
            </button>
          </div>
        </div>
      ) : value ? (
        /* Preview of Attached File */
        <div className="p-3.5 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 transition animate-fade-in shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                {isImageFile(value) ? (
                  <ImageIcon className="w-5 h-5" />
                ) : isPdfFile(value) ? (
                  <FileText className="w-5 h-5 text-rose-600" />
                ) : isExcelFile(value) ? (
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                ) : isWordFile(value) ? (
                  <FileText className="w-5 h-5 text-blue-600" />
                ) : isArchiveFile(value) ? (
                  <FileArchive className="w-5 h-5 text-amber-600" />
                ) : (
                  <File className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                    {value.split("/").pop() || value}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 text-[9px] font-extrabold uppercase tracking-wider">
                    Attached
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">{value}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={getAssetUrl(value)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Open / Preview Asset"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                title="Remove Attached File"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Thumbnail Preview for Images */}
          {isImageFile(value) && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">
              <img
                src={getAssetUrl(value)}
                alt="File Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as any).src =
                    "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500";
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={getAssetUrl(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Full
                </a>
              </div>
            </div>
          )}

          {/* Action button to replace */}
          <div className="pt-1 flex items-center justify-end">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10.5px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Replace File
            </button>
          </div>
        </div>
      ) : (
        /* Active Drag & Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.01] shadow-lg shadow-blue-500/10"
              : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
              isDragging
                ? "bg-blue-600 text-white scale-110 shadow-md"
                : "bg-blue-50 dark:bg-blue-950/50 text-[#0F4C81] dark:text-sky-400 group-hover:scale-105"
            }`}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            ) : isDragging ? (
              <UploadCloud className="w-6 h-6 animate-bounce" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {uploading
                ? "Uploading attachment..."
                : isDragging
                ? "Drop your file here now!"
                : "Drag & drop your file here, or browse"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium max-w-xs">
              {uploading
                ? "Saving to university assets..."
                : sublabel || "Accepts PDFs, Images (JPG/PNG/WEBP), Word Docs, Excel, PPT, Zip archives up to 50MB"}
            </p>
          </div>

          {uploading && uploadProgress !== null && (
            <div className="w-full max-w-[200px] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}
