import Link from 'next/link';

// Root not-found page for the app router.
// Rendered by Next.js when a route doesn't match any segment, or when a page
// calls `notFound()`. Uses a Next Link styled to match Harbor's primary Button
// so the look-and-feel is consistent with the rest of the app while keeping
// this a server component (no client JS added — Harbor's Button is a client
// component, so we intentionally do not import it here).

/**
 * Root not-found page for the app router.
 *
 * Rendered by Next.js when a route doesn't match any segment or when a page
 * calls `notFound()`. Server component (no client JS added).
 *
 * @returns {JSX.Element} The 404 UI with a link back to the dashboard.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-5xl font-bold text-[rgb(var(--harbor-text-muted))]">
        404
      </p>
      <h1 className="text-xl font-semibold text-[rgb(var(--harbor-text))]">
        Page not found
      </h1>
      <p className="max-w-md text-sm text-[rgb(var(--harbor-text-muted))]">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="inline-flex h-[var(--harbor-target-control-height)] items-center justify-center rounded-[var(--harbor-target-radius)] bg-[rgb(var(--harbor-brand))] px-[var(--harbor-target-control-padding-x)] text-sm font-medium text-[rgb(var(--harbor-brand-fg))] no-underline transition-colors hover:bg-[rgb(var(--harbor-accent-2))]"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
