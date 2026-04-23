'use client';

import { ResponsiveStack } from '@infinibay/harbor';

/**
 * PageHeader — the single primitive all operator pages open with.
 *
 * See docs/design/harbor_design_guidelines.md §15. No Card wrap, no IconTile,
 * no gradient. Title + optional muted count + optional description, actions
 * on the right, optional second row for filters/search.
 *
 * Props:
 *   - title: required string, becomes H1.
 *   - count: optional string/ReactNode, rendered muted after the title with a
 *            middot separator. Use for inline status like "12 · 8 running" or
 *            "updated 2m ago".
 *   - description: optional single-line muted subtitle. Use sparingly.
 *   - primary: optional ReactNode, typically a "New X" Button (Plus14 convention).
 *   - secondary: optional ReactNode, Refresh / overflow / toggles.
 *   - filters: optional ReactNode rendered on a second row below the title.
 */
export function PageHeader({
  title,
  count,
  description,
  primary,
  secondary,
  filters,
}) {
  return (
    <ResponsiveStack direction="col" gap={3}>
      <ResponsiveStack
        direction={{ base: 'col', md: 'row' }}
        gap={3}
        align={{ base: 'stretch', md: 'center' }}
        justify="between"
      >
        <ResponsiveStack direction="col" gap={1}>
          <ResponsiveStack direction="row" gap={2} align="baseline" wrap>
            <h1 className="text-xl font-semibold leading-tight m-0">{title}</h1>
            {count ? (
              <span className="text-fg-muted text-sm">· {count}</span>
            ) : null}
          </ResponsiveStack>
          {description ? (
            <span className="text-fg-muted text-sm">{description}</span>
          ) : null}
        </ResponsiveStack>

        {primary || secondary ? (
          <ResponsiveStack direction="row" gap={2} align="center">
            {secondary}
            {primary}
          </ResponsiveStack>
        ) : null}
      </ResponsiveStack>

      {filters ? (
        <ResponsiveStack direction="row" gap={2} align="center" wrap>
          {filters}
        </ResponsiveStack>
      ) : null}
    </ResponsiveStack>
  );
}
