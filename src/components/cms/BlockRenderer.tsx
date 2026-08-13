import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Award,
  Download,
  ExternalLink,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  HelpCircle,
  Users,
  Image as ImageIcon,
  ArrowRight,
  Info,
} from "lucide-react";

import { SafeImage } from "@/components/SafeImage";

interface BlockProps {
  block: {
    id: string;
    type: string;
    visible?: boolean;
    content: Record<string, any>;
  };
}

export function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-8 py-2">
      {blocks
        .filter((b) => b.visible !== false)
        .map((block) => (
          <SingleBlockRenderer key={block.id || Math.random()} block={block} />
        ))}
    </div>
  );
}

function SingleBlockRenderer({ block }: BlockProps) {
  const { type, content } = block;

  switch (type) {
    case "heading": {
      const Level = content.level || "h2";
      const align = content.align || "left";
      const alignClass =
        align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

      return (
        <div className={`space-y-2 ${alignClass}`}>
          {content.eyebrow && (
            <span className="text-eyebrow tracking-widest text-xs font-semibold text-primary uppercase">
              {content.eyebrow}
            </span>
          )}
          <Level className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
            {content.title}
          </Level>
          {content.subtitle && (
            <p className="text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
              {content.subtitle}
            </p>
          )}
          {content.gradientLine && (
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-2" />
          )}
        </div>
      );
    }

    case "richtext": {
      return (
        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm md:text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: content.html || content.text || "" }}
        />
      );
    }

    case "image": {
      return (
        <figure className="space-y-2">
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-md">
            <SafeImage
              src={content.url}
              alt={content.caption || "Page Image"}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
          {content.caption && (
            <figcaption className="text-xs text-slate-500 text-center italic">
              {content.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "imagetext": {
      const imageLeft = content.imagePosition !== "right";
      return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 border border-slate-100 p-6 rounded-3xl">
          <div className={`md:col-span-5 ${imageLeft ? "order-1" : "order-1 md:order-2"}`}>
            <div className="overflow-hidden rounded-2xl shadow-sm">
              <SafeImage src={content.imageUrl} alt={content.title || ""} className="w-full h-64 object-cover" />
            </div>
          </div>
          <div className={`md:col-span-7 space-y-3 ${imageLeft ? "order-2" : "order-2 md:order-1"}`}>
            <h3 className="text-xl font-bold text-slate-900">{content.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{content.description}</p>
            {content.buttonText && content.buttonUrl && (
              <a
                href={content.buttonUrl}
                className="btn-primary inline-flex items-center gap-2 text-xs px-5 py-2 mt-2"
              >
                {content.buttonText} <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>
      );
    }

    case "columns": {
      const cols = content.items || [];
      const colCount = cols.length || 2;
      const gridClass =
        colCount === 3
          ? "grid-cols-1 md:grid-cols-3"
          : colCount === 4
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 md:grid-cols-2";

      return (
        <div className={`grid ${gridClass} gap-6`}>
          {cols.map((col: any, idx: number) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
              {col.icon && <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit"><Info size={20} /></div>}
              {col.title && <h4 className="font-bold text-slate-900 text-base">{col.title}</h4>}
              {col.text && <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{col.text}</p>}
            </div>
          ))}
        </div>
      );
    }

    case "cards": {
      const items = content.items || [];
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {item.image ? (
                  <div className="overflow-hidden rounded-xl h-40 w-full mb-3">
                    <SafeImage src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 w-fit">
                    <GraduationCap size={22} />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors flex items-center justify-between">
                    {item.title}
                    {item.badge && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {item.badge}
                      </span>
                    )}
                  </h4>
                  {item.subtitle && <p className="text-xs font-medium text-slate-400 mt-0.5">{item.subtitle}</p>}
                </div>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {(item.link || item.buttonLabel) && (
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>{item.buttonLabel || "Learn More"}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    case "button": {
      return (
        <div className={`py-2 ${content.align === "center" ? "text-center" : content.align === "right" ? "text-right" : "text-left"}`}>
          <a
            href={content.url || "#"}
            target={content.external ? "_blank" : "_self"}
            rel="noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold shadow-md shadow-blue-600/20"
          >
            {content.label}
            {content.external ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
          </a>
        </div>
      );
    }

    case "divider": {
      return <hr className="border-t border-slate-200 my-6" />;
    }

    case "quote": {
      return (
        <blockquote className="p-6 rounded-2xl bg-blue-50/60 border-l-4 border-blue-600 my-4 space-y-2">
          <p className="text-sm md:text-base font-medium text-slate-800 italic">"{content.text}"</p>
          {content.author && (
            <footer className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              — {content.author} {content.role ? `(${content.role})` : ""}
            </footer>
          )}
        </blockquote>
      );
    }

    case "documents": {
      const items = content.items || [];
      return (
        <div className="space-y-3">
          {items.map((doc: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-all flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">{doc.title}</h4>
                  {doc.description && <p className="text-xs text-slate-500 line-clamp-1">{doc.description}</p>}
                </div>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs px-3.5 py-1.5 shrink-0 flex items-center gap-1.5"
              >
                <Download size={14} /> Download
              </a>
            </div>
          ))}
        </div>
      );
    }

    case "faq": {
      const items = content.items || [];
      return <FaqAccordion items={items} />;
    }

    case "stats": {
      const items = content.items || [];
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {items.map((stat: any, idx: number) => (
            <div key={idx} className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 shadow-sm space-y-1">
              <div className="text-2xl md:text-3xl font-extrabold text-blue-700">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      );
    }

    case "timeline": {
      const items = content.items || [];
      return (
        <div className="relative border-l-2 border-blue-200 ml-4 space-y-6 py-2">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="relative pl-6">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.date || item.year}</div>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{item.title}</h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

function FaqAccordion({ items }: { items: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full p-4 text-left font-semibold text-slate-900 text-sm md:text-base flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle size={18} className="text-blue-600 shrink-0" />
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="p-4 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
