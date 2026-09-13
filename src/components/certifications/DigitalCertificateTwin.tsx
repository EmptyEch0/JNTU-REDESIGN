import { ShieldCheck, Award, QrCode } from "lucide-react";
import type { CertificationRecord } from "@/data/certifications-2026";

interface Props {
  certificate: CertificationRecord;
  verificationUrl: string;
}

export function DigitalCertificateTwin({ certificate, verificationUrl }: Props) {
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    verificationUrl
  )}&bgcolor=ffffff&color=0f172a&margin=2`;

  return (
    <div
      id="certificate-print-area"
      className="relative w-full max-w-4xl mx-auto bg-[#faf8f5] text-slate-900 shadow-2xl rounded-2xl overflow-hidden border-[12px] border-double border-amber-700/70 p-6 sm:p-10 md:p-14 select-none print:m-0 print:p-8 print:shadow-none print:border-8 print:border-amber-800 print:w-full print:max-w-none print:rounded-none"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.03) 0%, rgba(217, 119, 6, 0.08) 100%),
          repeating-linear-gradient(45deg, rgba(30, 58, 138, 0.015) 0, rgba(30, 58, 138, 0.015) 1px, transparent 0, transparent 18px)
        `,
      }}
    >
      {/* Ornate Corner Accents */}
      <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-700 pointer-events-none" />
      <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-700 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-700 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-700 pointer-events-none" />

      {/* Verified Watermark in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none rotate-[-25deg]">
        <span className="text-8xl sm:text-9xl font-black tracking-widest text-slate-900 uppercase">
          OFFICIAL VERIFIED
        </span>
      </div>

      {/* Top Waves / Ribbon Graphic */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* University Crest / Logo */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-white shadow-md border-2 border-amber-600/60 flex items-center justify-center">
            <img
              src="/logo-circle.png"
              alt="JNTU-GV Emblem"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to text seal if image fails
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </div>

        {/* University Name */}
        <h3 className="text-xs sm:text-sm md:text-base font-bold tracking-[0.18em] text-amber-900 uppercase font-serif">
          Jawaharlal Nehru Technological University
        </h3>
        <h4 className="text-sm sm:text-base md:text-lg font-extrabold tracking-[0.22em] text-blue-950 uppercase font-serif mt-0.5">
          Gurajada Vizianagaram
        </h4>

        {/* Certificate Heading */}
        <div className="my-5 sm:my-6 relative">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-blue-950 font-serif drop-shadow-sm">
            CERTIFICATE
          </h1>
          <h2 className="text-base sm:text-xl md:text-2xl font-semibold tracking-[0.3em] text-amber-800 uppercase font-serif mt-1">
            Of Appreciation
          </h2>
          <div className="w-36 sm:w-48 h-1 mx-auto mt-2 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
        </div>

        {/* Presentation line */}
        <p className="text-sm sm:text-base italic text-slate-700 font-serif">
          This certificate is proudly presented to
        </p>

        {/* Recipient Section (Name + Photo) */}
        <div className="my-5 sm:my-6 flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto w-full">
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-900 font-serif tracking-tight border-b-2 border-amber-600/40 pb-2">
              {certificate.name.toUpperCase()}
            </h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-xs sm:text-sm font-semibold text-blue-950 uppercase tracking-wider">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
              <span>{certificate.department}</span>
            </div>
          </div>

          {/* Photo box */}
          <div className="relative shrink-0">
            <div className="w-24 h-28 sm:w-28 sm:h-32 bg-white p-1 rounded-sm shadow-md border-2 border-blue-900">
              <img
                src={certificate.imageSrc}
                alt={certificate.name}
                className="w-full h-full object-cover rounded-sm object-[85%_35%]"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white rounded-full p-1 shadow">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Citation Text */}
        <div className="max-w-3xl mx-auto text-xs sm:text-sm md:text-[15px] leading-relaxed text-slate-800 text-justify sm:text-center font-serif px-2 sm:px-6 my-4">
          <p>
            Awarded in recognition of the valuable contribution as a member of a team of four towards
            the development of the <strong className="text-blue-950 font-bold">JNTUGVCEV website</strong>, sincere
            dedication, and commendable efforts demonstrated during the{" "}
            <strong className="text-blue-950 font-bold">Summer Internship</strong>. The internship was
            successfully undertaken in alignment with the vision of a developed and self-reliant India
            and India's ambitious vision of{" "}
            <strong className="text-amber-900 font-bold italic">Viksit Bharat @2047</strong>. The
            commitment and professionalism demonstrated throughout the internship are highly appreciated
            and commendable.
          </p>
        </div>

        {/* Signatories & Bottom Seals */}
        <div className="w-full mt-8 sm:mt-12 pt-6 border-t border-amber-700/30">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {certificate.signatories.map((sig, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-8 flex items-end justify-center mb-1">
                  <div className="w-16 sm:w-24 h-0.5 bg-slate-400" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-blue-950 font-serif uppercase tracking-wide">
                  {sig.title}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-600 hidden sm:block">
                  {sig.designation}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Occasion and QR Code */}
        <div className="w-full mt-6 sm:mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-700">
          {/* Occasion */}
          <div className="text-center sm:text-left">
            <p className="font-semibold text-blue-950 font-serif">
              This Certificate is presented on the occasion of Engineer's Day - 2026
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Cert ID: {certificate.id} • Auth Code: {certificate.securityCode}
            </p>
          </div>

          {/* Golden Seal Medal */}
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 shadow-md flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900/40 flex flex-col items-center justify-center text-center p-1">
                  <Award className="w-6 h-6 text-amber-950" />
                  <span className="text-[7px] font-black uppercase tracking-tighter text-amber-950">
                    SEAL OF EXCELLENCE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Official QR Code for instant scanning verification */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-amber-700/40 shadow-sm shrink-0">
            <img
              src={qrImgUrl}
              alt="Scan to verify certificate"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            />
            <div className="text-[10px] font-semibold text-slate-700 leading-tight pr-1 text-left hidden sm:block">
              <span className="block text-emerald-700 font-bold">SCAN TO VERIFY</span>
              <span className="text-[9px] text-slate-500 font-mono">Official JNTU-GV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
