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
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-2.5 px-6 sticky top-0 z-[100] shadow-lg flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.3s] backdrop-blur-md text-[11px] uppercase tracking-widest">
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
