"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { Drawer } from "@infinibay/harbor";

/**
 * HelpSheet — Harbor-native replacement. A right-side Drawer that
 * hosts a help config (title, description, sections with id + icon +
 * title + content, optional quickTips). Sections expand/collapse
 * inline via framer-motion AnimatePresence.
 */
export function HelpSheet({ open, onOpenChange, config }) {
  const [expanded, setExpanded] = useState(null);

  React.useEffect(() => {
    if (open && config?.sections?.length && expanded == null) {
      setExpanded(config.sections[0].id);
    }
  }, [open, config, expanded]);

  if (!config) return null;

  const { title, description, icon, sections = [], quickTips = [] } = config;

  return (
    <Drawer
      open={!!open}
      onClose={() => onOpenChange?.(false)}
      side="right"
      size={460}
      title={
        <span className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-accent/15 grid place-items-center text-accent">
            {icon || <HelpCircle className="h-4 w-4" />}
          </span>
          {title}
        </span>
      }
    >
      <div className="space-y-6">
        {description ? (
          <p className="text-sm text-fg-muted">{description}</p>
        ) : null}

        {sections.length > 0 && (
          <div className="space-y-1">
            {sections.map((section) => {
              const isOpen = expanded === section.id;
              return (
                <div
                  key={section.id}
                  className="rounded-lg border border-white/8 bg-surface-1 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : section.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-fg hover:bg-white/5 transition-colors"
                  >
                    {section.icon}
                    <span className="flex-1">{section.title}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <ChevronDown className="h-4 w-4 text-fg-muted" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-3 text-sm text-fg-muted border-t border-white/8 space-y-2">
                          {section.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {quickTips.length > 0 && (
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 space-y-2">
            <p className="text-sm font-semibold text-fg flex items-center gap-2">
              <span>💡</span>
              Quick tips
            </p>
            <ul className="text-sm text-fg-muted list-disc list-inside space-y-1 leading-relaxed">
              {quickTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Drawer>
  );
}
