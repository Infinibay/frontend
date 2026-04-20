'use client';

import React, { useState } from 'react';
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
  const [defaultValue, setDefaultValue] = useState(null);

  React.useEffect(() => {
    if (open && config?.sections?.length && defaultValue == null) {
      setDefaultValue(config.sections[0].id);
    }
  }, [open, config, defaultValue]);

  if (!config) return null;

  const { title, description, icon, sections = [], quickTips = [] } = config;

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
          <Accordion defaultValue={defaultValue ?? undefined}>
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
