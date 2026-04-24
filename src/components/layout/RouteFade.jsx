'use client';

import { usePathname } from 'next/navigation';
import { ContentSwap } from '@infinibay/harbor';

/**
 * Thin wrapper over Harbor's <ContentSwap> that supplies the Next.js
 * pathname as the discriminator. Sidebar and header live OUTSIDE this
 * wrapper (they are AppShell props, not children) so they stay pinned
 * across navigation — only the body dissolves and recomposes.
 */
export function RouteFade({ children }) {
  const pathname = usePathname();
  return (
    <ContentSwap
      id={pathname}
      variant="fade"
      mode="wait"
      duration={100}
      style={{ minHeight: '100%' }}
    >
      {children}
    </ContentSwap>
  );
}
