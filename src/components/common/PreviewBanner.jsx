'use client';

import { Eye } from 'lucide-react';

/**
 * Strip shown at the top of every mocked roadmap screen. Honest copy; tone
 * info so it doesn't look like an error, quiet enough that it doesn't scream.
 * See plan Fase 4 §"Mocked roadmap features".
 */
export function PreviewBanner() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-info/30 bg-info/5 text-fg-muted text-xs">
      <Eye size={14} className="text-info shrink-0" />
      <span>
        <strong className="text-fg">Preview</strong> — this feature is under
        design. The data below is fictional and is not stored.
      </span>
    </div>
  );
}
