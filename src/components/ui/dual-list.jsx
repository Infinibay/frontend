import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useDroppable,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { cn } from "../../lib/utils";
import DragAndDrop from './drag-and-drop';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";

const DropZone = ({ id, children, isEmpty, className, emptyClassName }) => {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "min-h-[120px] transition-colors rounded-lg",
        isEmpty && "border-2 border-dashed",
        isEmpty && emptyClassName,
        className
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
  dropZoneClassName,
  emptyDropZoneClassName,
  layout = "vertical", // 'vertical', 'horizontal', or 'grid'
  containerClassName,
  listClassName,
  sensors,
  moveRight,
  moveLeft,
  canDrag = () => true, // Add canDrag prop with default function
  leftSearch,
  rightSearch,
  size = "md"
}) => {
  const [leftItems, setLeftItems] = useState(initialLeftItems);
  const [rightItems, setRightItems] = useState(initialRightItems);
  const [activeId, setActiveId] = useState(null);

  // Search input component
  const SearchInput = ({ placeholder, value, onChange, onClear }) => (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className={cn("text-muted-foreground", "size-icon")} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full pl-10 pr-10 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          sizes.input.height,
          sizes.input.padding,
          sizes.input.text
        )}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Cross2Icon className={cn("text-muted-foreground hover:text-foreground", "size-icon")} />
        </button>
      )}
    </div>
  );

  const handleDragStart = (event) => {
    const item = findItemById(event.active.id);
    if (!item || !canDrag(item)) {
      event.preventDefault();
      return;
    }
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

  const handleDoubleClick = (item) => {
    if (!canDrag(item)) return;

    let newLeftItems, newRightItems;

    if (leftItems.find(i => i.id === item.id)) {
      newLeftItems = leftItems.filter(i => i.id !== item.id);
      newRightItems = [...rightItems, item];
    } else {
      newLeftItems = [...leftItems, item];
      newRightItems = rightItems.filter(i => i.id !== item.id);
    }

    setLeftItems(newLeftItems);
    setRightItems(newRightItems);
    onChange?.({ leftItems: newLeftItems, rightItems: newRightItems });
  };

  const renderWithContextMenu = (item, props) => {
    const isInLeftList = leftItems.find(i => i.id === item.id);

    let _moveRight = moveRight || (
      <>
        <ArrowRightIcon className="mr-2 h-4 w-4" />
        Move to Right
      </>
    )

    let _moveLeft = moveLeft || (
      <>
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Move to left
      </>
    )
    
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div onDoubleClick={() => handleDoubleClick(item)}>
            {renderItem(item, props)}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleDoubleClick(item)}>
            {isInLeftList ? (
              _moveRight
            ) : (
              _moveLeft
            )}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const getLayoutClassName = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row flex-wrap gap-2';
      case 'grid':
        return 'grid grid-cols-2 sm:grid-cols-3 gap-2';
      case 'vertical':
      default:
        return 'flex flex-col gap-2';
    }
  };

  const defaultSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 16,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 16,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 16,
      },
    })
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      sensors={sensors || defaultSensors}
    >
      <div className={cn("flex gap-4", containerClassName)}>
        <div className="flex-1">
          <h3 className={cn("font-medium mb-4", "size-heading")}>{leftTitle}</h3>
          {leftSearch && (
            <SearchInput
              placeholder={leftSearch.placeholder}
              value={leftSearch.value}
              onChange={leftSearch.onChange}
              onClear={leftSearch.onClear}
            />
          )}
          <DropZone
            id="left"
            isEmpty={leftItems.length === 0}
            className={dropZoneClassName}
            emptyClassName={emptyDropZoneClassName}
          >
            <DragAndDrop
              items={leftItems}
              listId="left"
              renderItem={renderWithContextMenu}
              containerClassName={cn(
                "bg-transparent border-none p-0",
                getLayoutClassName(),
                listClassName
              )}
              layout={layout}
            />
          </DropZone>
        </div>
        <div className="flex-1">
          <h3 className={cn("font-medium mb-4", "size-heading")}>{rightTitle}</h3>
          {rightSearch && (
            <SearchInput
              placeholder={rightSearch.placeholder}
              value={rightSearch.value}
              onChange={rightSearch.onChange}
              onClear={rightSearch.onClear}
            />
          )}
          <DropZone
            id="right"
            isEmpty={rightItems.length === 0}
            className={dropZoneClassName}
            emptyClassName={emptyDropZoneClassName}
          >
            <DragAndDrop
              items={rightItems}
              listId="right"
              renderItem={renderWithContextMenu}
              containerClassName={cn(
                "bg-transparent border-none p-0",
                getLayoutClassName(),
                listClassName
              )}
              layout={layout}
            />
          </DropZone>
        </div>
      </div>
      <DragOverlay className="shadow-xl shadow-gray-400/50 dark:shadow-black/50 scale-105">
        {activeId ? renderItem(findItemById(activeId), { overlay: true }) : null}
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
  onChange: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
  dropZoneClassName: PropTypes.string,
  emptyDropZoneClassName: PropTypes.string,
  layout: PropTypes.oneOf(['vertical', 'horizontal', 'grid']),
  containerClassName: PropTypes.string,
  listClassName: PropTypes.string,
  sensors: PropTypes.array,
  moveRight: PropTypes.any,
  moveLeft: PropTypes.any,
  canDrag: PropTypes.func,
  leftSearch: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    onClear: PropTypes.func
  }),
  rightSearch: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    onClear: PropTypes.func
  }),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};

export default DualList;
