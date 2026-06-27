// Root loading fallback for the app router.
// Shown automatically by Next.js while a route segment's server payload is in
// flight.
//
// IMPORTANT: this is a Server Component (no 'use client') on purpose — it adds
// zero JS to the bundle. Because of that it MUST NOT import from the
// `@infinibay/harbor` barrel: that barrel re-exports client-only components
// (e.g. backgrounds/Aurora, which use hooks) and importing even one named
// export pulls the whole barrel into the RSC module graph, breaking every
// route. So the spinner here is pure CSS (no external dependency).

/**
 * Root loading fallback for the app router.
 *
 * Server component (no 'use client') shown automatically by Next.js while a
 * route segment's server payload is in flight. Adds zero JS to the bundle.
 * Deliberately avoids importing from the `@infinibay/harbor` barrel (which
 * would pull client-only hooks into the RSC graph) — the spinner is pure CSS.
 *
 * @returns {JSX.Element} A centered accessible spinner.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="flex min-h-[60vh] w-full items-center justify-center p-8"
    >
      {/* Pure-CSS spinner — visually consistent with a generic loading state,
          no design-system dependency so it renders even before Harbor's CSS
          variables are hydrated. */}
      <span
        className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent opacity-60"
        style={{ width: 28, height: 28 }}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
