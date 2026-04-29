import { Link } from "@tanstack/react-router";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink text-white/85 mt-32">
      <div className="container-narrow py-16 md:py-20 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-primary grid place-items-center">
              <GraduationCap className="h-5 w-5" />
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
            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link to="/academics" className="hover:text-white transition-colors">Academics</Link></li>
            <li><Link to="/departments" className="hover:text-white transition-colors">Departments</Link></li>
            <li><Link to="/admissions" className="hover:text-white transition-colors">Admissions</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="text-eyebrow text-accent mb-4">Campus</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/hostels" className="hover:text-white transition-colors">Hostels</Link></li>
            <li><Link to="/library" className="hover:text-white transition-colors">Library</Link></li>
            <li><Link to="/sports" className="hover:text-white transition-colors">Sports</Link></li>
            <li><Link to="/dispensary" className="hover:text-white transition-colors">Dispensary</Link></li>
            <li><Link to="/rd-cell" className="hover:text-white transition-colors">R&D Cell</Link></li>
            <li><Link to="/placements" className="hover:text-white transition-colors">Placements</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3 text-sm">
          <div className="text-eyebrow text-accent mb-4">Reach Us</div>
          <div className="flex items-start gap-2.5"><MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" /><span>{SITE.contact.address}</span></div>
          <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-accent shrink-0" /><span>{SITE.contact.phone}</span></div>
          <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-accent shrink-0" /><span>{SITE.contact.email}</span></div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-narrow py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/45">
          <div>© {new Date().getFullYear()} {SITE.fullName}. All rights reserved.</div>
          <div>Crafted with care for tomorrow's engineers.</div>
        </div>
      </div>
    </footer>
  );
}
