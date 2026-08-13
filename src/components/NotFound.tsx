import { Link } from "@tanstack/react-router";
import {
  Compass,
  Home,
  GraduationCap,
  Bell,
  Building2,
  BookOpen,
  ArrowLeft,
  Search,
  MapPin,
} from "lucide-react";
import { useState } from "react";

export function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickLinks = [
    {
      title: "Academic Departments",
      desc: "Explore CSE, ECE, EEE, Mechanical, Civil & IT",
      icon: GraduationCap,
      href: "/departments",
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Notices & Circulars",
      desc: "Latest official announcements & updates",
      icon: Bell,
      href: "/notices",
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Campus & Hostels",
      desc: "Student facilities, hostels, library & sports",
      icon: Building2,
      href: "/hostels",
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Academics & Regulations",
      desc: "Academic calendars, syllabus & regulations",
      icon: BookOpen,
      href: "/academics/cac",
      color: "from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        
        {/* Decorative Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center space-y-8">
        {/* Animated Badge & Hero Graphic */}
        <div className="inline-flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center border border-primary/20 shadow-xl backdrop-blur-sm animate-float">
              <Compass className="w-12 h-12 text-primary animate-[spin_20s_linear_infinite]" />
            </div>
            <span className="absolute -top-2 -right-2 px-3 py-1 text-xs font-bold font-mono rounded-full bg-primary text-primary-foreground shadow-md">
              404
            </span>
          </div>

          <span className="text-eyebrow tracking-widest text-xs font-semibold text-primary uppercase">
            JNTU-GV CEV • Page Not Found
          </span>
          <h1 className="mt-2 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Looks like this page skipped class!
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The link you followed might be broken, relocated, or removed from the university curriculum.
            Don't worry, let's get you back on track.
          </p>
        </div>

        {/* Quick Search Bar */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search JNTU-GV website..."
              className="w-full pl-11 pr-24 py-3 text-sm bg-card border border-border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Campus Directory Quick Links Grid */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Or explore popular campus destinations
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group relative p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-3.5 hover:-translate-y-0.5"
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${link.color} shrink-0 transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                      {link.title}
                      <span className="text-xs text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {link.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Primary Navigation Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/30"
          >
            <Home className="w-4 h-4" />
            Back to Campus Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center gap-2 text-sm px-5 py-2.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Previous Page
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground/70 pt-4 flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          JNTU-GV College of Engineering, Vizianagaram — 535003
        </p>
      </div>
    </div>
  );
}
