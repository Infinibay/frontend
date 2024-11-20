import React from 'react';
import PropTypes from 'prop-types';
import { cn } from "../../lib/utils";
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';

const DragAndDrop = ({
  items = [],
  listId,
  renderItem,
  onOrderChange,
  onAdd,
  onRemove,
  acceptFrom,
  className,
  containerClassName,
}) => {
  return (
    <div className={cn("min-h-[100px] p-4 rounded-lg border", containerClassName)}>
      <SortableContext 
        items={items.map(item => item.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("space-y-2", className)}>
          {items.map((item) => (
            <SortableItem 
              key={item.id} 
              id={item.id}
              containerId={listId}
            >
              {renderItem ? renderItem(item) : (
                <div className="p-4 bg-background border rounded-lg">
                  {JSON.stringify(item)}
                </div>
              )}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

DragAndDrop.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  listId: PropTypes.string.isRequired,
  renderItem: PropTypes.func,
  onOrderChange: PropTypes.func,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  acceptFrom: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default DragAndDrop;