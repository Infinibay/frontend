'use client';

// Global error boundary — the LAST line of defense.
// Unlike error.js (which wraps a route segment), this replaces the ENTIRE
// document (html/body), so it must render its own <html><body>. It catches
// errors thrown by the root layout itself (e.g. a provider crash), where
// error.js cannot help because the layout frame is gone.
//
// Kept deliberately minimal: it cannot rely on Harbor's CSS variables (those
// are injected by the app's theme provider, which lives inside the broken
// layout), so it uses plain inline styles. The goal is a readable message and
// a working reload button — nothing more.

import { useEffect } from 'react';

/**
 * Global error boundary — the last line of defense.
 *
 * Replaces the ENTIRE document (html/body) and catches errors thrown by the
 * root layout itself, where error.js cannot help because the layout frame is
 * gone. Deliberately minimal: it cannot rely on the app's theme provider (it
 * lives inside the broken layout), so it uses plain inline styles.
 *
 * @param {Object} props
 * @param {Error} props.error - The fatal error that was thrown.
 * @param {() => void} props.reset - Action that reloads/remounts the app.
 * @returns {JSX.Element} A standalone <html> document with a recovery message.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Best-effort log; the debug panel may itself be unavailable here.
    if (typeof console !== 'undefined' && console.error) {
      console.error('Global error boundary caught:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        role="alert"
        aria-live="assertive"
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '32px',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          backgroundColor: '#0b0f17',
          color: '#e6edf3',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
          The application crashed
        </h1>
        <p style={{ margin: 0, maxWidth: '420px', fontSize: '14px', opacity: 0.8 }}>
          A critical error prevented the interface from loading. Reloading
          usually fixes this; if the problem persists, contact your
          administrator.
        </p>
        <button
          onClick={() => reset()}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#0b0f17',
            backgroundColor: '#e6edf3',
            border: 'none',
            borderRadius: '8px',
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
