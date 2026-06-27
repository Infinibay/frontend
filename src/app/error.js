'use client';

// Root error boundary for the app router.
// Any uncaught error thrown during render of a route segment (or its children)
// is caught here so the user sees a recovery UI instead of a white screen.
// Next.js requires this to be a client component and to export a `reset` action
// that remounts the segment.
//
// Coherent with the rest of the app:
//  - Uses Harbor's Button so the look-and-feel matches every other screen.
//  - Logs through the shared debug logger (debug-panel), not raw console.
//  - Distinguishes a recoverable segment error (here) from a fatal layout
//    error (global-error.js), which replaces the whole document.

import { useEffect } from 'react';
import { Button } from '@infinibay/harbor';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:error-boundary');

/**
 * Root error boundary for the app router (client component).
 *
 * Catches uncaught errors thrown during render of any route segment or its
 * children, so the user sees a recovery UI instead of a white screen. Next.js
 * requires a client component that exports a `reset` action which remounts the
 * segment.
 *
 * @param {Object} props
 * @param {Error} props.error - The error that was thrown.
 * @param {() => void} props.reset - Action that re-renders the segment.
 * @returns {JSX.Element} The recovery UI.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Record the render error for the operator debug panel + production logs.
    debug.error('render', 'Uncaught route segment error', error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-semibold text-[rgb(var(--harbor-text))]">
          Something went wrong
        </h1>
        <p className="max-w-md text-sm text-[rgb(var(--harbor-text-muted))]">
          An unexpected error occurred while loading this page. You can try
          again, or return to the dashboard.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="primary" size="md" onClick={() => reset()}>
          Try again
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}
