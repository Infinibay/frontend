import React from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "../../lib/utils";

export function SortableItem({ id, containerId, disabled = false, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      containerId
    },
    disabled
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!disabled && attributes)}
      {...(!disabled && listeners)}
      className={cn(
        "relative",
        disabled && "cursor-not-allowed"
      )}
    >
      {children}
    </div>
  );
}

SortableItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  containerId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node
};

export default SortableItem;
