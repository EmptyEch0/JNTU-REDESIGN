import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Linkedin } from "lucide-react";
import { SITE } from "@/lib/site";

export function Footer() {
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).__DEV_CREDITS_LOGGED__) {
      (window as any).__DEV_CREDITS_LOGGED__ = true;
      console.log(
        "%c 🎓 JNTUGV %c Developed by ",
        "background: #0284c7; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px; font-family: system-ui, sans-serif;",
        "background: #0f172a; color: #38bdf8; font-weight: 600; padding: 4px 8px; border-radius: 0 4px 4px 0; font-family: system-ui, sans-serif;"
      );
      console.log(
        "%c👨‍💻 Likhith    %c https://www.linkedin.com/in/likhithmankala/\n" +
        "%c👩‍💻 Sai Rupini %c https://www.linkedin.com/in/sairupini-chitikesi/\n" +
        "%c👩‍💻 Anitha     %c https://www.linkedin.com/in/anitha-palavalasa/\n" +
        "%c👨‍💻 Sai Vamsi  %c Developer",
        "color: #38bdf8; font-weight: bold; font-family: monospace;", "color: #94a3b8; text-decoration: underline; font-family: monospace;",
        "color: #38bdf8; font-weight: bold; font-family: monospace;", "color: #94a3b8; text-decoration: underline; font-family: monospace;",
        "color: #38bdf8; font-weight: bold; font-family: monospace;", "color: #94a3b8; text-decoration: underline; font-family: monospace;",
        "color: #38bdf8; font-weight: bold; font-family: monospace;", "color: #94a3b8; font-family: monospace;"
      );
    }
  }, []);

  return (
    <footer className="bg-ink text-white/85 mt-32">
      <div className="container-narrow py-16 md:py-20 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-white grid place-items-center overflow-hidden border border-white/20">
              <img src="/logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="text-display text-lg text-white">{SITE.name}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                Engineering · Vizianagaram
              </div>
            </div>
          </div>
          <p className="text-sm text-white/60 max-w-sm leading-relaxed">{SITE.shortDesc}</p>
        </div>

        <div className="md:col-span-2">
          <div className="text-eyebrow text-accent mb-4">Explore</div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/academics" className="hover:text-white transition-colors">
                Academics
              </Link>
            </li>
            <li>
              <Link to="/departments" className="hover:text-white transition-colors">
                Departments
              </Link>
            </li>
            <li>
              <Link to="/admissions" className="hover:text-white transition-colors">
                Admissions
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="text-eyebrow text-accent mb-4">Campus</div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/hostels" className="hover:text-white transition-colors">
                Hostels
              </Link>
            </li>
            <li>
              <Link to="/library" className="hover:text-white transition-colors">
                Library
              </Link>
            </li>
            <li>
              <Link to="/sports" className="hover:text-white transition-colors">
                Sports
              </Link>
            </li>
            <li>
              <Link to="/dispensary" className="hover:text-white transition-colors">
                Dispensary
              </Link>
            </li>
            <li>
              <Link to="/rd-cell" className="hover:text-white transition-colors">
                R&D Cell
              </Link>
            </li>
            <li>
              <Link to="/placements" className="hover:text-white transition-colors">
                Placements
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3 text-sm">
          <div className="text-eyebrow text-accent mb-4">Reach Us</div>
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
            <span>{SITE.contact.address}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-accent shrink-0" />
            <span>{SITE.contact.phone}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-accent shrink-0" />
            <span>{SITE.contact.email}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-narrow flex flex-col items-center justify-center gap-4 text-xs text-white/50 text-center">
          {/* Centered Developer Badge Pill Container */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 shadow-lg backdrop-blur-md">
            <span className="text-white/70 font-medium mr-1">Developed by</span>

            <a
              href="https://www.linkedin.com/in/likhithmankala/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 hover:bg-sky-500/30 hover:text-sky-100 border border-sky-400/30 transition-all font-medium group shadow-sm hover:scale-105"
            >
              <span>Likhith</span>
              <Linkedin className="h-3 w-3 text-sky-400 group-hover:text-sky-200 transition-colors" />
            </a>

            <a
              href="https://www.linkedin.com/in/sairupini-chitikesi/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 hover:bg-purple-500/30 hover:text-purple-100 border border-purple-400/30 transition-all font-medium group shadow-sm hover:scale-105"
            >
              <span>Sai Rupini</span>
              <Linkedin className="h-3 w-3 text-purple-400 group-hover:text-purple-200 transition-colors" />
            </a>

            <a
              href="https://www.linkedin.com/in/anitha-palavalasa/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/30 hover:text-emerald-100 border border-emerald-400/30 transition-all font-medium group shadow-sm hover:scale-105"
            >
              <span>Anitha</span>
              <Linkedin className="h-3 w-3 text-emerald-400 group-hover:text-emerald-200 transition-colors" />
            </a>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 font-medium">
              Sai Vamsi
            </span>
          </div>

          <div className="text-white/40 text-[11px]">
            © {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
