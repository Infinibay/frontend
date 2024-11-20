import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { cn } from "@/lib/utils";

const DragAndDrop = ({ 
  items = [], 
  onDrop, 
  onOrderChange,
  className,
  itemClassName,
  renderItem,
  dragOverClassName = "bg-secondary/50",
  containerClassName,
  acceptFrom,
  listId,
  dropPosition = 'anywhere' // 'start', 'end', 'anywhere'
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const itemRefs = useRef(new Map());
  const containerRef = useRef(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    setMousePosition({ x: e.clientX, y: e.clientY });
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: item.id,
      sourceListId: listId,
      item
    }));
  };

  const findNearestDropIndex = (mouseY) => {
    if (dropPosition === 'start') return 0;
    if (dropPosition === 'end') return items.length;
    
    // For 'anywhere', find the nearest position based on mouse Y coordinate
    const itemPositions = Array.from(itemRefs.current.entries()).map(([index, el]) => {
      const rect = el.getBoundingClientRect();
      return {
        index: parseInt(index),
        top: rect.top,
        bottom: rect.bottom,
        middle: rect.top + rect.height / 2
      };
    });

    if (itemPositions.length === 0) return 0;

    // If mouse is above first item
    if (mouseY < itemPositions[0].top) return 0;
    
    // If mouse is below last item
    if (mouseY > itemPositions[itemPositions.length - 1].bottom) {
      return items.length;
    }

    // Find the two items the mouse is between
    for (let i = 0; i < itemPositions.length; i++) {
      const currentItem = itemPositions[i];
      const nextItem = itemPositions[i + 1];

      if (!nextItem) {
        // We're at the last item
        return mouseY > currentItem.middle ? items.length : items.length - 1;
      }

      if (mouseY >= currentItem.top && mouseY <= nextItem.top) {
        return mouseY < currentItem.middle ? i : i + 1;
      }
    }

    return items.length;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    const dropIndex = findNearestDropIndex(e.clientY);
    setDragOverIndex(dropIndex);
  };

  const handleDragLeave = (e) => {
    // Only trigger if we're actually leaving the container
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setIsDraggingOver(false);
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { id, sourceListId, item } = data;

      // Check if this drop is allowed
      if (acceptFrom && !acceptFrom.includes(sourceListId)) {
        return;
      }

      // Handle the drop
      if (sourceListId === listId) {
        // Internal reordering
        const currentIndex = items.findIndex(i => i.id.toString() === id.toString());
        if (currentIndex === -1) return;

        const newItems = [...items];
        const [movedItem] = newItems.splice(currentIndex, 1);
        const targetIndex = dragOverIndex > currentIndex ? dragOverIndex - 1 : dragOverIndex;
        newItems.splice(targetIndex, 0, movedItem);
        
        if (onOrderChange) {
          onOrderChange(newItems);
        }
      } else {
        // Cross-list drop
        if (onDrop) {
          onDrop(id, sourceListId, dragOverIndex, item);
        }
        if (onOrderChange) {
          const newItems = [...items];
          newItems.splice(dragOverIndex, 0, item);
          onOrderChange(newItems);
        }
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "min-h-[200px] p-4 rounded-lg border border-border",
        containerClassName,
        isDraggingOver && dragOverClassName
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn("grid gap-2", className)}>
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {dragOverIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: 1, 
                    height: 'auto',
                    transition: { duration: 0.2 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    height: 0,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-primary/10 rounded-md border-2 border-dashed border-primary/30 h-16"
                />
              )}
              <motion.div
                ref={el => {
                  if (el) itemRefs.current.set(index, el);
                  else itemRefs.current.delete(index);
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className={cn(
                  "cursor-grab active:cursor-grabbing p-4 rounded-md border bg-card",
                  itemClassName
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }
                }}
                exit={{ 
                  opacity: 0,
                  x: mousePosition.x,
                  y: mousePosition.y,
                  scale: 0.5,
                  transition: { 
                    duration: 0.3,
                    ease: "easeInOut"
                  }
                }}
                layout
                layoutId={item.id.toString()}
              >
                {renderItem ? renderItem(item) : item.id}
              </motion.div>
            </React.Fragment>
          ))}
          {dragOverIndex === items.length && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: 'auto',
                transition: { duration: 0.2 }
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: { duration: 0.2 }
              }}
              className="bg-primary/10 rounded-md border-2 border-dashed border-primary/30 h-16"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

DragAndDrop.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  onDrop: PropTypes.func,
  onOrderChange: PropTypes.func,
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  renderItem: PropTypes.func,
  dragOverClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  acceptFrom: PropTypes.arrayOf(PropTypes.string),
  listId: PropTypes.string,
  dropPosition: PropTypes.oneOf(['start', 'end', 'anywhere'])
};

export default DragAndDrop;
