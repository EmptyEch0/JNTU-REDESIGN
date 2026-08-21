import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AccountAccent = "faculty" | "hod" | "admin";

const accentStyles: Record<
  AccountAccent,
  {
    page: string;
    iconWrap: string;
    cta: string;
    chip: string;
    focusRing: string;
    strengthActive: string;
  }
> = {
  faculty: {
    page: "from-sand via-background to-teal-50/40",
    iconWrap: "bg-teal-50 border-teal-200 text-teal-700",
    cta: "bg-teal-700 hover:bg-teal-800 shadow-teal-700/15 hover:shadow-teal-700/25",
    chip: "bg-teal-50 text-teal-800 border-teal-100",
    focusRing: "focus-within:border-teal-600 focus-within:ring-teal-600/15",
    strengthActive: "bg-teal-600",
  },
  hod: {
    page: "from-sand via-background to-indigo-50/35",
    iconWrap: "bg-indigo-50 border-indigo-200 text-indigo-700",
    cta: "bg-indigo-700 hover:bg-indigo-800 shadow-indigo-700/15 hover:shadow-indigo-700/25",
    chip: "bg-indigo-50 text-indigo-800 border-indigo-100",
    focusRing: "focus-within:border-indigo-600 focus-within:ring-indigo-600/15",
    strengthActive: "bg-indigo-600",
  },
  admin: {
    page: "from-sand via-background to-sky-50/40",
    iconWrap: "bg-primary/10 border-primary/20 text-primary",
    cta: "bg-primary hover:bg-primary/90 shadow-primary/15 hover:shadow-primary/25",
    chip: "bg-primary/10 text-primary border-primary/15",
    focusRing: "focus-within:border-primary focus-within:ring-primary/15",
    strengthActive: "bg-primary",
  },
};

export function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];

type BackLink =
  | { label: string; to: string; params?: Record<string, string> }
  | { label: string; href: string }
  | null;

interface AccountSettingsLayoutProps {
  accent: AccountAccent;
  icon: LucideIcon;
  roleLabel: string;
  title: string;
  description: string;
  back?: BackLink;
  children: ReactNode;
}

export function AccountSettingsLayout({
  accent,
  icon: Icon,
  roleLabel,
  title,
  description,
  back,
  children,
}: AccountSettingsLayoutProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        "min-h-[80vh] bg-gradient-to-br flex items-start justify-center px-4 py-10 md:py-14",
        styles.page,
      )}
    >
      <div
        className="w-full max-w-xl space-y-5"
        style={{ animation: "login-entrance 0.55s cubic-bezier(0.22, 1, 0.36, 1) both" }}
      >
        {back && (
          "to" in back ? (
            <Link
              to={back.to as any}
              params={back.params as any}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors"
            >
              <ArrowLeft size={14} /> {back.label}
            </Link>
          ) : (
            <a
              href={back.href}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors"
            >
              <ArrowLeft size={14} /> {back.label}
            </a>
          )
        )}

        <div className="rounded-3xl border border-border/80 bg-card/95 backdrop-blur-sm shadow-[var(--shadow-elegant)] overflow-hidden">
          <div className="px-6 pt-7 pb-5 md:px-8 md:pt-8 border-b border-border/70 bg-gradient-to-br from-white to-sand/40">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "h-14 w-14 shrink-0 rounded-2xl border flex items-center justify-center",
                  styles.iconWrap,
                )}
              >
                <Icon size={24} />
              </div>
              <div className="min-w-0 space-y-1.5">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]",
                    styles.chip,
                  )}
                >
                  {roleLabel}
                </span>
                <h1 className="text-2xl font-bold text-ink font-display leading-tight">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 md:px-8 md:py-7 space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-ink tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

interface SettingsFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function SettingsField({ label, hint, required, children }: SettingsFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-[0.12em] ml-0.5">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground ml-0.5 leading-relaxed">{hint}</p>}
    </div>
  );
}

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  accent?: AccountAccent;
  showStrength?: boolean;
}

export function PasswordInput({
  value,
  onChange,
  disabled,
  placeholder = "••••••••",
  required,
  autoFocus,
  accent = "admin",
  showStrength = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const styles = accentStyles[accent];
  const strength = useMemo(() => getPasswordStrength(value), [value]);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative flex items-center rounded-xl border border-border bg-white/80 transition-all focus-within:ring-[3px]",
          styles.focusRing,
        )}
      >
        <div className="absolute left-3.5 text-muted-foreground pointer-events-none">
          <Lock className="w-4 h-4" />
        </div>
        <input
          type={visible ? "text" : "password"}
          className="w-full bg-transparent pl-10 pr-11 py-3 text-sm text-ink outline-none placeholder:text-muted-foreground/70"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 text-muted-foreground hover:text-ink transition-colors p-1"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i < strength ? styles.strengthActive : "bg-border",
                )}
              />
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Strength: <span className="font-semibold text-ink">{strengthLabels[strength]}</span>
          </p>
        </div>
      )}
    </div>
  );
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  type?: string;
  icon?: LucideIcon;
  accent?: AccountAccent;
}

export function TextInput({
  value,
  onChange,
  disabled,
  placeholder,
  required,
  type = "text",
  icon: Icon,
  accent = "admin",
}: TextInputProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        "relative flex items-center rounded-xl border border-border bg-white/80 transition-all focus-within:ring-[3px]",
        styles.focusRing,
      )}
    >
      {Icon && (
        <div className="absolute left-3.5 text-muted-foreground pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          "w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-muted-foreground/70",
          Icon ? "pl-10 pr-3.5" : "px-3.5",
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

interface SettingsSubmitButtonProps {
  accent: AccountAccent;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function SettingsSubmitButton({
  accent,
  loading,
  disabled,
  children,
}: SettingsSubmitButtonProps) {
  const styles = accentStyles[accent];

  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cn(
        "w-full text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2",
        styles.cta,
      )}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function SettingsError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs flex items-start gap-2.5"
      style={{ animation: "login-entrance 0.3s ease-out both" }}
    >
      <svg
        className="w-4 h-4 text-rose-500 shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export function SettingsSuccessNote({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-3.5 py-3 text-xs text-emerald-800">
      <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
      <span>{message}</span>
    </div>
  );
}

export function PasswordRulesChecklist({
  password,
  minLength = 12,
}: {
  password: string;
  minLength?: number;
}) {
  const rules = [
    { ok: password.length >= minLength, label: `At least ${minLength} characters` },
    { ok: /[A-Z]/.test(password), label: "One uppercase letter" },
    { ok: /[a-z]/.test(password), label: "One lowercase letter" },
    { ok: /[0-9]/.test(password), label: "One number" },
    { ok: /[^A-Za-z0-9]/.test(password), label: "One symbol (!@#$…)" },
  ];

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={cn(
            "flex items-center gap-2 text-[11px]",
            rule.ok ? "text-emerald-700" : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
              rule.ok
                ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                : "bg-muted border-border text-transparent",
            )}
          >
            <Check className="w-2.5 h-2.5" />
          </span>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
