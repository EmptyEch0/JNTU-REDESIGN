import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  ENGINEERS_DAY_2026_CERTIFICATES,
  getCertificateById,
  type CertificationRecord,
} from "@/data/certifications-2026";
import { getAdminCertificates } from "@/funcs/certifications.server";
import { VerificationScannerModal } from "@/components/certifications/VerificationScannerModal";
import { QRCodeTool } from "@/components/certifications/QRCodeTool";
import {
  ShieldCheck,
  Award,
  FileCheck2,
  Printer,
  Download,
  Share2,
  Sparkles,
  QrCode,
  CheckCircle2,
  Calendar,
  Building,
  UserCheck,
  ExternalLink,
  Check,
  Code2,
  Globe2,
} from "lucide-react";
import { toast } from "sonner";

interface SearchParams {
  id?: string;
  scan?: string;
}

export const Route = createFileRoute("/engineersday2026/certifications")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      id: (search.id as string) || "JNTUGV-ED26-001",
      scan: (search.scan as string) || "true",
    };
  },
  loader: async ({ location }) => {
    const searchParams = new URLSearchParams(location.search);
    const rawId = (searchParams.get("id") || "").trim().toLowerCase();

    const isTeam47_49 = [
      "047", "048", "049",
      "jntugv-ed26-047", "jntugv-ed26-048", "jntugv-ed26-049",
      "ed26-047", "ed26-048", "ed26-049",
      "prem", "sagar", "avinash", "leela-avinash", "charan", "gowri-charan",
    ].some((k) => rawId === k || rawId.includes(k));

    if (isTeam47_49) {
      if (typeof window !== "undefined") {
        window.location.replace("https://cap.jntugv.edu.in/about/team");
      } else {
        throw new Response(null, {
          status: 302,
          headers: { Location: "https://cap.jntugv.edu.in/about/team" },
        });
      }
    }

    const isContrib50_55 = [
      "050", "051", "052", "053", "054", "055",
      "jntugv-ed26-050", "jntugv-ed26-051", "jntugv-ed26-052", "jntugv-ed26-053", "jntugv-ed26-054", "jntugv-ed26-055",
      "ed26-050", "ed26-051", "ed26-052", "ed26-053", "ed26-054", "ed26-055",
      "vinay", "siringi", "durga", "srinivasa", "narendra", "sravya", "srujana", "bhargavi", "sneha", "swaroop",
    ].some((k) => rawId === k || rawId.includes(k));

    if (isContrib50_55) {
      if (typeof window !== "undefined") {
        window.location.replace("https://cap.jntugv.edu.in/contributors");
      } else {
        throw new Response(null, {
          status: 302,
          headers: { Location: "https://cap.jntugv.edu.in/contributors" },
        });
      }
    }

    try {
      const all = await getAdminCertificates();
      return { allCertificates: all as CertificationRecord[] };
    } catch {
      return { allCertificates: ENGINEERS_DAY_2026_CERTIFICATES };
    }
  },
  head: () => ({
    meta: [
      {
        title: "Engineer's Day 2026 Certificate Verification — JNTU-GV CEV",
      },
      {
        name: "description",
        content:
          "Official digital certificate verification portal for JNTU-GV College of Engineering Vizianagaram Summer Internship & Engineer's Day 2026.",
      },
      {
        property: "og:title",
        content: "Verified Certificate of Appreciation — JNTU-GV CEV",
      },
      {
        property: "og:description",
        content:
          "Verified credentials for Summer Internship & Website Modernization — JNTU-GV CEV.",
      },
      {
        property: "og:image",
        content: "https://jntugvcev.edu.in/logo.png",
      },
    ],
  }),
  component: EngineersDayCertificationsPage,
});

function EngineersDayCertificationsPage() {
  const { allCertificates } = Route.useLoaderData();
  const search = Route.useSearch();
  const certId = (search.id || "").trim().toLowerCase();

  useEffect(() => {
    const rawId = certId.toLowerCase();
    const isTeam47_49 = [
      "047", "048", "049",
      "jntugv-ed26-047", "jntugv-ed26-048", "jntugv-ed26-049",
      "prem", "sagar", "avinash", "leela-avinash", "charan", "gowri-charan",
    ].some((k) => rawId === k || rawId.includes(k));

    if (isTeam47_49) {
      window.location.replace("https://cap.jntugv.edu.in/about/team");
      return;
    }

    const isContrib50_55 = [
      "050", "051", "052", "053", "054", "055",
      "jntugv-ed26-050", "jntugv-ed26-051", "jntugv-ed26-052", "jntugv-ed26-053", "jntugv-ed26-054", "jntugv-ed26-055",
      "vinay", "siringi", "durga", "srinivasa", "narendra", "sravya", "srujana", "bhargavi", "sneha", "swaroop",
    ].some((k) => rawId === k || rawId.includes(k));

    if (isContrib50_55) {
      window.location.replace("https://cap.jntugv.edu.in/contributors");
      return;
    }
  }, [certId]);

  const certificate: CertificationRecord =
    (certId
      ? allCertificates.find(
          (c: CertificationRecord) =>
            c.id.toLowerCase() === certId ||
            c.slug.toLowerCase() === certId ||
            c.name.toLowerCase() === certId ||
            (c.rollNumber && c.rollNumber.toLowerCase() === certId) ||
            c.id.toLowerCase().replace(/-/g, "") === certId.replace(/-/g, "") ||
            (c.slug && c.slug.length > 2 && certId.includes(c.slug.toLowerCase()))
        )
      : null) ||
    allCertificates[0] ||
    ENGINEERS_DAY_2026_CERTIFICATES[0];

  const [showScannerModal, setShowScannerModal] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Determine current host verification URL
  const [baseUrl, setBaseUrl] = useState("https://jntugvcev.edu.in");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const verificationUrl = certificate.verificationUrl || `${baseUrl}/engineersday2026/certifications?id=${certificate.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopiedLink(true);
      toast.success("Verification link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `Excited to share the verified Certificate of Appreciation from Jawaharlal Nehru Technological University Gurajada Vizianagaram (JNTU-GV CEV) for contributions towards Developing JNTUGVCEV website during the Summer Internship! Verification URL: ${verificationUrl}`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Official Certificate Verification from JNTU-GV CEV for ${certificate.name} (${certificate.id}): ${verificationUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-amber-500/30">
      {/* Holographic Verification Scan Pop-up Animation */}
      <VerificationScannerModal
        certificate={certificate}
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
      />

      {/* Hero Section */}
      <PageHero
        eyebrow="NATIONAL ENGINEER'S DAY 2026 • DIGITAL VERIFICATION PORTAL"
        title="Official Certificate Verification"
        subtitle="Jawaharlal Nehru Technological University Gurajada Vizianagaram — Accredited Credential Verification System"
      >
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-lg shadow-emerald-500/10 animate-pulse">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AUTHENTICATED BY JNTU-GV REGISTRAR & VC</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/10 text-white/90 border border-white/20 backdrop-blur-md">
            <span>ID: {certificate.id}</span>
          </div>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Verification Status Banner */}
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-amber-950/90 p-6 sm:p-8 text-white shadow-2xl border border-amber-500/30">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                  {certificate.name}
                </h2>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                  Honored with the <strong>{certificate.title}</strong> on the occasion of{" "}
                  <strong>{certificate.event}</strong> for exemplary contributions to{" "}
                  <strong>{certificate.project}</strong> under the vision of{" "}
                  <em className="text-amber-300 font-serif">Viksit Bharat @2047</em>.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/70 font-mono">
                  <span>Issued: {certificate.formattedDate}</span>
                  <span>•</span>
                  <span>Dept: {certificate.department}</span>
                  <span>•</span>
                  <span>Code: {certificate.securityCode}</span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => setShowScannerModal(true)}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Replay Scan Animation</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 backdrop-blur-sm transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>

                <button
                  onClick={handleCopyShareLink}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 backdrop-blur-sm transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? "Link Copied!" : "Share Verification"}</span>
                </button>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Official Certificate Viewer Section */}
        <RevealOnScroll>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground font-display flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  Official Certificate Showcase
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  High-definition verified certificate presented on the occasion of Engineer's Day - 2026.
                </p>
              </div>

              {certificate.imageSrc && (
                <div className="inline-flex items-center gap-2">
                  <a
                    href={certificate.imageSrc}
                    download={`JNTUGV_Certificate_${certificate.slug}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full HD</span>
                  </a>
                </div>
              )}
            </div>

            {/* High-Definition Original Certificate Image View or Verified Placeholder */}
            <div className="relative rounded-2xl overflow-hidden bg-card/60 dark:bg-slate-900/60 border border-border p-4 sm:p-8 shadow-2xl flex flex-col items-center">
              {certificate.imageSrc ? (
                <div className="relative max-w-3xl w-full mx-auto rounded-xl overflow-hidden shadow-2xl border-4 border-amber-600/30 group">
                  <img
                    src={certificate.imageSrc}
                    alt={`Certificate of Appreciation - ${certificate.name}`}
                    className="w-full h-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                    <span className="text-white text-xs font-semibold tracking-wide">
                      Official Certificate • JNTU-GV CEV Engineer's Day 2026
                    </span>
                    <a
                      href={certificate.imageSrc}
                      download={`JNTUGV_Certificate_${certificate.slug}.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download HD Image</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="relative max-w-2xl w-full mx-auto rounded-2xl border-2 border-dashed border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-primary/5 p-8 sm:p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Official Record Registered & Verified
                    </div>
                    <h4 className="text-2xl font-bold font-display text-foreground pt-2">
                      {certificate.name}
                    </h4>
                    <p className="text-xs font-mono text-primary font-bold">
                      {certificate.id} • {certificate.department}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    This credential has been officially verified and endorsed for the <strong>Summer Internship</strong> on <strong>Engineer's Day 2026</strong>. The high-resolution certificate image scan will appear here once uploaded by the university administration.
                  </p>
                  <div className="pt-2">
                    <a
                      href="/admin/certifications"
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                    >
                      <span>Upload certificate scan in Admin Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Official JNTU-GV Registry
                </span>
                <span>•</span>
                <span>Recipient: {certificate.name}</span>
                <span>•</span>
                <span>Presented by Vice-Chancellor & Leadership</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Verification Ledger & Candidate Dossier Grid */}
        <RevealOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Detailed Credential Metadata */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card/90 dark:bg-slate-900/90 border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Verified Credential Details</h3>
                    <p className="text-xs text-muted-foreground">
                      Official certificate breakdown and institutional endorsement
                    </p>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60">
                    <span className="text-xs text-muted-foreground uppercase font-medium block">
                      Certificate Holder
                    </span>
                    <span className="font-bold text-foreground text-base mt-0.5 block">
                      {certificate.honorific} {certificate.name}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60">
                    <span className="text-xs text-muted-foreground uppercase font-medium block">
                      Certificate Identifier
                    </span>
                    <span className="font-mono font-bold text-primary text-base mt-0.5 block">
                      {certificate.id}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60">
                    <span className="text-xs text-muted-foreground uppercase font-medium block">
                      Program / Initiative
                    </span>
                    <span className="font-semibold text-foreground mt-0.5 block">
                      Summer Internship — Web Modernization
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60">
                    <span className="text-xs text-muted-foreground uppercase font-medium block">
                      Occasion & Date
                    </span>
                    <span className="font-semibold text-foreground mt-0.5 block">
                      Engineer's Day • {certificate.formattedDate}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 sm:col-span-2">
                    <span className="text-xs text-muted-foreground uppercase font-medium block">
                      Recognized Contribution & Citation
                    </span>
                    <p className="mt-1 text-xs sm:text-sm text-foreground/90 leading-relaxed font-serif italic">
                      "{certificate.citation}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 sm:col-span-2">
                    <span className="text-xs text-muted-foreground uppercase font-medium block mb-1">
                      Official Security Hash
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground break-all bg-background/80 p-2 rounded-md border border-border block">
                      {certificate.verificationHash}
                    </span>
                  </div>
                </div>

                {/* Endorsement Signatories */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Authorized Signatories & Leadership
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {certificate.signatories.map((sig, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-muted/30 border border-border/50 text-center flex flex-col justify-center items-center"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-500 mb-1" />
                        <span className="text-xs font-bold text-foreground block">{sig.title}</span>
                        <span className="text-[10px] text-muted-foreground leading-tight mt-0.5 block">
                          {sig.designation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills & Competencies Validated */}
              <div className="bg-card/90 dark:bg-slate-900/90 border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Validated Competencies & Technical Skills
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-muted border border-border text-foreground flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: QR Code Tool & Social Sharing */}
            <div className="space-y-6">
              {/* QR Code Tool */}
              <QRCodeTool
                certificateId={certificate.id}
                verificationUrl={verificationUrl}
                recipientName={certificate.name}
              />

              {/* Share Card */}
              <div className="bg-card/90 dark:bg-slate-900/90 border border-border rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-primary" />
                  Share Official Verification
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Broadcast your achievement or share this authenticated link with employers, academic
                  institutions, and professional networks.
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    onClick={handleShareLinkedIn}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>LinkedIn</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Institutional Endorsement Info */}
              <div className="bg-muted/40 border border-border rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
                  <Building className="w-4 h-4 text-amber-500" />
                  <span>Issuing Institution</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>JNTU-GV College of Engineering Vizianagaram</strong>
                  <br />
                  A constituent college of Jawaharlal Nehru Technological University Gurajada
                  Vizianagaram, Andhra Pradesh, India.
                </p>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Accreditation: NBA & NAAC</span>
                  <a
                    href="/"
                    className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}


