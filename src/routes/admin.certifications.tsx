import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  getAdminCertificates,
  createAdminCertificate,
  deleteAdminCertificate,
} from "@/funcs/certifications.server";
import { toast } from "sonner";
import {
  ShieldCheck,
  QrCode,
  UploadCloud,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Download,
  Search,
  CheckCircle2,
  Award,
  Sparkles,
  Lock,
  User,
  KeyRound,
  Eye,
  Building,
  Calendar,
  Layers,
  X,
  RefreshCw,
} from "lucide-react";
import type { CertificationRecord } from "@/data/certifications-2026";

export const Route = createFileRoute("/admin/certifications")({
  head: () => ({
    meta: [
      { title: "Certificate Management & QR Generator — JNTU-GV CEV Admin" },
      { name: "description", content: "Upload PDF certificates and generate official verification QR codes." },
    ],
  }),
  component: AdminCertificationsPage,
});

function AdminCertificationsPage() {
  const { isAdmin, login, role } = useAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"issue" | "registry" | "qr-tester">("issue");

  // Certificate Form state
  const [name, setName] = useState("");
  const [honorific, setHonorific] = useState("Ms.");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [roleField, setRoleField] = useState("Web Development Intern");
  const [project, setProject] = useState("Developing JNTUGVCEV website");
  const [event, setEvent] = useState("Engineer's Day - 2026");
  const [formattedDate, setFormattedDate] = useState("September 15, 2026");
  const [citation, setCitation] = useState(
    "Awarded in recognition of the valuable contributions towards Developing JNTUGVCEV website, sincere dedication, and commendable efforts demonstrated during the Summer Internship. The internship was successfully undertaken towards the vision of a developed and self-reliant India, in alignment with the India's ambitious vision of Viksit Bharat @2047."
  );
  const [skillsInput, setSkillsInput] = useState("Web Modernization, UI/UX Design, Viksit Bharat @2047, React & TypeScript");

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success QR modal state
  const [createdCert, setCreatedCert] = useState<CertificationRecord | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedQrCert, setSelectedQrCert] = useState<CertificationRecord | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Host URL calculation
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://jntugvcev.edu.in";

  // Query certificates
  const { data: certificates = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const res = await getAdminCertificates();
      return res as CertificationRecord[];
    },
    enabled: isAdmin,
  });

  // Create certificate mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const skills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await createAdminCertificate({
        data: {
          name,
          honorific,
          department,
          role: roleField,
          project,
          event,
          formattedDate,
          citation,
          fileUrl: uploadedFileUrl || "/images/certifications/teki-chaitanya-lakshmi-engineers-day-2026.jpg",
          skills,
        },
      });
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      toast.success("Certificate issued & QR code generated successfully!");
      if (data?.certificate) {
        setCreatedCert(data.certificate);
        setShowSuccessModal(true);
      }
      // Reset form fields
      setName("");
      setRollNo("");
      setUploadedFile(null);
      setUploadedFileUrl("");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create certificate");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteAdminCertificate({ data: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      toast.success("Certificate removed from registry");
    },
    onError: () => {
      toast.error("Failed to delete certificate");
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Logged in successfully as Administrator");
      } else {
        toast.error("Invalid administrator credentials");
      }
    } catch {
      toast.error("Login failed. Please verify credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("module", "certifications");
      formData.append("category", "engineers-day-2026");
      formData.append("name", name || "certificate");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setUploadedFileUrl(json.url);
        toast.success(`Uploaded: ${file.name}`);
      } else {
        toast.error(json.error || "File upload failed");
      }
    } catch {
      toast.error("Error uploading file to server");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("Verification URL copied!");
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadQR = async (cert: CertificationRecord) => {
    const url = `${baseUrl}/engineersday2026/certifications?id=${cert.id}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
      url
    )}&bgcolor=ffffff&color=0f172a&margin=2`;

    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `QR_${cert.id}_${cert.slug}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      toast.success(`QR Code downloaded for ${cert.name}!`);
    } catch {
      window.open(qrImageUrl, "_blank");
    }
  };

  // If not logged in as Admin, show Admin Authentication Portal
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground font-display">
              Certificate Administration Portal
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with your JNTU-GV Administrator credentials to upload PDF certificates and generate verification QR codes.
            </p>
          </div>

          <div className="bg-card/90 dark:bg-slate-900/90 border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Admin Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@jntugvcev.edu.in"
                    className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-input rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-input rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 cursor-pointer"
              >
                {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{isLoggingIn ? "Authenticating..." : "Sign In to Admin Portal"}</span>
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>Jawaharlal Nehru Technological University Gurajada Vizianagaram</p>
          </div>
        </div>
      </div>
    );
  }

  // Filtered certificates list
  const filteredCertificates = certificates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Page Hero */}
      <PageHero
        eyebrow="ADMINISTRATION CONTROL CENTER"
        title="Certificate & QR Studio"
        subtitle="Upload student & intern certificates as PDFs/Images and generate official QR verification codes."
      >
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Admin Active ({role || "Administrator"})</span>
          </div>
          <a
            href="/engineersday2026/certifications"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/90 hover:bg-white/20 border border-white/20 transition-colors"
          >
            <span>View Public Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="inline-flex p-1 rounded-xl bg-muted border border-border">
            <button
              onClick={() => setActiveTab("issue")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "issue" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Certificate</span>
            </button>
            <button
              onClick={() => setActiveTab("registry")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "registry" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Certificate Registry ({certificates.length})</span>
            </button>
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            Host: {baseUrl}
          </div>
        </div>

        {/* TAB 1: ISSUE & UPLOAD NEW CERTIFICATE */}
        {activeTab === "issue" && (
          <RevealOnScroll>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Form: Details */}
              <div className="lg:col-span-2 bg-card/90 dark:bg-slate-900/90 border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Certificate & Recipient Details</h3>
                    <p className="text-xs text-muted-foreground">
                      Fill in the recipient information and upload the certificate file.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Recipient Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Teki Chaitanya Lakshmi"
                      className="w-full text-sm bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Honorific */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Honorific
                    </label>
                    <select
                      value={honorific}
                      onChange={(e) => setHonorific(e.target.value)}
                      className="w-full text-sm bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="Ms.">Ms.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-sm bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                      <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Metallurgical Engineering">Metallurgical Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
                    </select>
                  </div>

                  {/* Role / Track */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Role / Internship Track
                    </label>
                    <input
                      type="text"
                      value={roleField}
                      onChange={(e) => setRoleField(e.target.value)}
                      placeholder="e.g. Web Development Intern"
                      className="w-full text-sm bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Project Title */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Recognized Project / Initiative
                    </label>
                    <input
                      type="text"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      placeholder="e.g. Developing JNTUGVCEV website"
                      className="w-full text-sm bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Event */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Occasion / Event
                    </label>
                    <input
                      type="text"
                      value={event}
                      onChange={(e) => setEvent(e.target.value)}
                      placeholder="e.g. Engineer's Day - 2026"
                      className="w-full text-sm bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Issue Date
                    </label>
                    <input
                      type="text"
                      value={formattedDate}
                      onChange={(e) => setFormattedDate(e.target.value)}
                      placeholder="e.g. September 15, 2026"
                      className="w-full text-sm bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  {/* Citation */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Certificate Citation / Official Text
                    </label>
                    <textarea
                      rows={3}
                      value={citation}
                      onChange={(e) => setCitation(e.target.value)}
                      className="w-full text-sm bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none font-serif"
                    />
                  </div>

                  {/* Skills Tagged */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Validated Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="e.g. Web Modernization, UI/UX Design, Viksit Bharat @2047"
                      className="w-full text-sm bg-muted/50 border border-input rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: PDF Upload & QR Preview Box */}
              <div className="space-y-6">
                {/* PDF / File Dropzone */}
                <div className="bg-card/90 dark:bg-slate-900/90 border border-border rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <UploadCloud className="w-5 h-5 text-primary" />
                    <span>Upload Certificate File (PDF / Image)</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      uploadedFile
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/40"
                    }`}
                  >
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                        <p className="text-xs font-semibold text-foreground break-all">{uploadedFile.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB • Click to change file
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto" />
                        <p className="text-xs font-semibold text-foreground">
                          Drag & drop or click to upload PDF
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Supports PDF, JPG, PNG, WEBP (Max 50MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {isUploading && (
                    <div className="flex items-center justify-center gap-2 text-xs text-primary font-medium">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading to server storage...</span>
                    </div>
                  )}
                </div>

                {/* Submit & Generate QR Button */}
                <div className="bg-card/90 dark:bg-slate-900/90 border border-border rounded-2xl p-6 shadow-xl space-y-4">
                  <button
                    type="button"
                    disabled={!name.trim() || createMutation.isPending}
                    onClick={() => createMutation.mutate()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {createMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <QrCode className="w-4 h-4" />
                    )}
                    <span>
                      {createMutation.isPending ? "Generating QR & Saving..." : "Issue Certificate & Generate QR"}
                    </span>
                  </button>

                  <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                    ✨ Automatically creates the permanent verification link, generates the scannable QR code, and registers the certificate.
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* TAB 2: CERTIFICATES REGISTRY */}
        {activeTab === "registry" && (
          <RevealOnScroll>
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, ID, or department..."
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  Showing {filteredCertificates.length} registered certificates
                </span>
              </div>

              {/* Certificates Table */}
              <div className="bg-card/90 dark:bg-slate-900/90 border border-border rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Recipient & ID</th>
                        <th className="py-3.5 px-4 sm:px-6">Department / Program</th>
                        <th className="py-3.5 px-4 sm:px-6">Occasion</th>
                        <th className="py-3.5 px-4 sm:px-6">Status</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions & QR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredCertificates.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">
                            No certificates match your search query.
                          </td>
                        </tr>
                      ) : (
                        filteredCertificates.map((cert) => {
                          const certUrl = `${baseUrl}/engineersday2026/certifications?id=${cert.id}`;
                          return (
                            <tr key={cert.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-4 px-4 sm:px-6">
                                <div className="font-bold text-foreground font-display text-sm sm:text-base">
                                  {cert.honorific} {cert.name}
                                </div>
                                <div className="text-[11px] font-mono text-primary font-semibold mt-0.5">
                                  {cert.id}
                                </div>
                              </td>

                              <td className="py-4 px-4 sm:px-6 text-xs text-muted-foreground">
                                <div className="font-medium text-foreground">{cert.department}</div>
                                <div>{cert.role}</div>
                              </td>

                              <td className="py-4 px-4 sm:px-6 text-xs text-muted-foreground">
                                <div>{cert.event}</div>
                                <div className="text-[11px]">{cert.formattedDate}</div>
                              </td>

                              <td className="py-4 px-4 sm:px-6">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {cert.status}
                                </span>
                              </td>

                              <td className="py-4 px-4 sm:px-6 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* View QR Code Button */}
                                  <button
                                    onClick={() => setSelectedQrCert(cert)}
                                    title="View & Download QR Code"
                                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer"
                                  >
                                    <QrCode className="w-4 h-4" />
                                  </button>

                                  {/* Copy Link Button */}
                                  <button
                                    onClick={() => handleCopyLink(certUrl, cert.id)}
                                    title="Copy Verification URL"
                                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                                  >
                                    {copiedId === cert.id ? (
                                      <Check className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>

                                  {/* Open Public Page */}
                                  <a
                                    href={certUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open Verification Page"
                                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>

                                  {/* Delete Certificate */}
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete certificate for ${cert.name}?`)) {
                                        deleteMutation.mutate(cert.id);
                                      }
                                    }}
                                    title="Revoke / Delete"
                                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        )}
      </div>

      {/* QR Code Modal (for any certificate selected or created) */}
      {(showSuccessModal && createdCert) || selectedQrCert ? (
        (() => {
          const targetCert = selectedQrCert || createdCert!;
          const certUrl = `${baseUrl}/engineersday2026/certifications?id=${targetCert.id}`;
          const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
            certUrl
          )}&bgcolor=ffffff&color=0f172a&margin=2`;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
              <div className="relative w-full max-w-md bg-card dark:bg-slate-900 border border-border rounded-2xl p-6 shadow-2xl space-y-5 text-center">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSelectedQrCert(null);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Official Verification QR Code
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-display">
                    {targetCert.name}
                  </h3>
                  <p className="text-xs font-mono text-primary font-bold">
                    ID: {targetCert.id}
                  </p>
                </div>

                {/* QR Code Box */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-inner max-w-[240px] mx-auto">
                  <img
                    src={qrImageUrl}
                    alt={`QR Code for ${targetCert.name}`}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-muted/60 p-2 rounded-lg text-xs font-mono text-muted-foreground break-all text-left">
                    <span className="truncate flex-1">{certUrl}</span>
                    <button
                      onClick={() => handleCopyLink(certUrl, targetCert.id)}
                      className="p-1 text-primary hover:text-primary/80 shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      onClick={() => handleDownloadQR(targetCert)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download QR (PNG)</span>
                    </button>

                    <a
                      href={certUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors border border-border"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Scan</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      ) : null}
    </div>
  );
}
