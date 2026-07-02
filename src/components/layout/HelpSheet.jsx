'use client';

import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  Alert,
  Drawer,
  IconTile,
  ResponsiveStack,
} from '@infinibay/harbor';

export function HelpSheet({ open, onOpenChange, config }) {
  if (!config) return null;

  const { title, description, icon, sections = [], quickTips = [] } = config;
  // First section auto-expands. Keyed on the config's title so navigating to a
  // different page's help (HelpSheet persists in GlobalHeader across routes)
  // remounts the Accordion with the new page's first section expanded, rather
  // than leaving it stuck on the first-ever page's default.
  const defaultSectionId = sections[0]?.id;

  return (
    <Drawer
      open={!!open}
      onClose={() => onOpenChange?.(false)}
      side="right"
      size={460}
      title={
        <ResponsiveStack direction="row" gap={2} align="center">
          <IconTile icon={icon || <HelpCircle size={14} />} tone="purple" size="sm" />
          <span>{title}</span>
        </ResponsiveStack>
      }
    >
      <ResponsiveStack direction="col" gap={6}>
        {description ? <span>{description}</span> : null}

        {sections.length > 0 && (
          <Accordion key={title || defaultSectionId} defaultValue={defaultSectionId ?? undefined}>
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                title={section.title}
                icon={section.icon}
              >
                {section.content}
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {quickTips.length > 0 && (
          <Alert tone="info" title="Quick tips">
            <ResponsiveStack direction="col" gap={1}>
              {quickTips.map((tip, i) => (
                <span key={i}>• {tip}</span>
              ))}
            </ResponsiveStack>
          </Alert>
        )}
      </ResponsiveStack>
    </Drawer>
  );
}
