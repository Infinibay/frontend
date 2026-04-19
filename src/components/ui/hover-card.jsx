"use client";

/**
 * Stub for the deleted Radix hover-card. Any still-un-migrated shadcn
 * descendant (notably label.jsx) imports HoverCard* from here. Each
 * export below is a minimal pass-through so imports resolve; no
 * actual hover-card popover renders until the consumer is redesigned
 * in Harbor.
 */

export function HoverCard({ children }) {
  return children;
}

export function HoverCardTrigger({ children, asChild, ...props }) {
  if (asChild) return children;
  return <span {...props}>{children}</span>;
}

export function HoverCardContent() {
  return null;
}

export function HoverCardPortal({ children }) {
  return children;
}
