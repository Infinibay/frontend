"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Thin wrapper around @dnd-kit/sortable's useSortable. Renders
 * children with drag handles wired up. Preserved here because the
 * still-un-migrated department detail page and computers-list consume
 * it; nothing visual about it is legacy — it's just plumbing.
 */
export function SortableItem({ id, children, className }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export default SortableItem;
