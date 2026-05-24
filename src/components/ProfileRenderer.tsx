import React from "react";
import { motion } from "framer-motion";

interface ProfileRendererProps {
  content: string;
}

export function ProfileRenderer({ content }: ProfileRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Headers (### Section)
        if (trimmed.startsWith("###")) {
          return (
            <motion.h3
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="text-xl font-bold text-ink mt-10 mb-4 pb-2 border-b border-primary/10 flex items-center gap-2"
            >
              <span className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
              {trimmed.replace("###", "").trim().replace(":", "")}
            </motion.h3>
          );
        }

        // Bullet points (handle both - and – and —)
        if (
          trimmed.startsWith("–") ||
          trimmed.startsWith("-") ||
          trimmed.startsWith("—")
        ) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
              className="flex gap-4 items-start text-muted-foreground ml-2 group"
            >
              <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors flex-shrink-0" />
              <span className="text-lg leading-relaxed group-hover:text-ink transition-colors">
                {trimmed.substring(1).trim()}
              </span>
            </motion.div>
          );
        }

        // Empty lines
        if (trimmed === "") {
          return <div key={i} className="h-2" />;
        }

        // Bold labels (e.g. "Achievement:")
        if (
          trimmed.includes(":") &&
          trimmed.length < 60 &&
          !trimmed.startsWith("http") &&
          !trimmed.includes("@")
        ) {
          return (
            <motion.p 
              key={i} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg font-bold text-ink pt-4"
            >
              {trimmed}
            </motion.p>
          );
        }

        // Normal paragraphs
        return (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.02 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {line}
          </motion.p>
        );
      })}
    </div>
  );
}
