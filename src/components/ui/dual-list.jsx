import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  DndContext, 
  closestCenter, 
  DragOverlay,
  useDroppable 
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { cn } from "../../lib/utils";
import DragAndDrop from './drag-and-drop';

const DropZone = ({ id, children, isEmpty }) => {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "min-h-[120px] transition-colors rounded-lg",
        isEmpty && "border-2 border-dashed"
      )}
    >
      {children}
    </div>
  );
};

const DualList = ({
  leftItems: initialLeftItems,
  rightItems: initialRightItems,
  onChange,
  renderItem,
  leftTitle = "Left List",
  rightTitle = "Right List",
}) => {
  const [leftItems, setLeftItems] = useState(initialLeftItems);
  const [rightItems, setRightItems] = useState(initialRightItems);
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const findContainer = (id) => {
    if (leftItems.find(item => item.id === id)) return 'left';
    if (rightItems.find(item => item.id === id)) return 'right';
    return null;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const sourceContainer = findContainer(active.id);
    let targetContainer = findContainer(over.id);
    
    // If we're not dropping on an item, check if we're dropping on a container
    if (!targetContainer) {
      if (over.id === 'left' || over.id === 'right') {
        targetContainer = over.id;
      } else {
        targetContainer = over.data.current?.sortable?.containerId;
      }
    }

    if (!sourceContainer || !targetContainer) return;

    // Same container - reorder
    if (sourceContainer === targetContainer) {
      const items = sourceContainer === 'left' ? leftItems : rightItems;
      const setItems = sourceContainer === 'left' ? setLeftItems : setRightItems;
      
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);
        onChange?.({ 
          leftItems: sourceContainer === 'left' ? newItems : leftItems,
          rightItems: sourceContainer === 'right' ? newItems : rightItems 
        });
      }
    } 
    // Different containers - move between lists
    else {
      const sourceItems = sourceContainer === 'left' ? leftItems : rightItems;
      const targetItems = sourceContainer === 'left' ? rightItems : leftItems;
      
      const itemToMove = sourceItems.find(item => item.id === active.id);
      if (!itemToMove) return;

      const newSourceItems = sourceItems.filter(item => item.id !== active.id);
      const newTargetItems = [...targetItems, itemToMove];

      if (sourceContainer === 'left') {
        setLeftItems(newSourceItems);
        setRightItems(newTargetItems);
      } else {
        setLeftItems(newTargetItems);
        setRightItems(newSourceItems);
      }

      onChange?.({
        leftItems: sourceContainer === 'left' ? newSourceItems : newTargetItems,
        rightItems: sourceContainer === 'left' ? newTargetItems : newSourceItems
      });
    }
  };

  const findItemById = (id) => {
    return [...leftItems, ...rightItems].find(item => item.id === id);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">{leftTitle}</h3>
          <DropZone id="left" isEmpty={leftItems.length === 0}>
            <DragAndDrop
              items={leftItems}
              listId="left"
              renderItem={renderItem}
              containerClassName="bg-transparent border-none p-0"
            />
          </DropZone>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">{rightTitle}</h3>
          <DropZone id="right" isEmpty={rightItems.length === 0}>
            <DragAndDrop
              items={rightItems}
              listId="right"
              renderItem={renderItem}
              containerClassName="bg-transparent border-none p-0"
            />
          </DropZone>
        </div>
      </div>
      <DragOverlay>
        {activeId ? renderItem(findItemById(activeId)) : null}
      </DragOverlay>
    </DndContext>
  );
};

DualList.propTypes = {
  leftItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  rightItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  onChange: PropTypes.func,
  renderItem: PropTypes.func.isRequired,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
};

export default DualList;
