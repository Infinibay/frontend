import React from 'react';
import PropTypes from 'prop-types';
import { cn } from "../../lib/utils";
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
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
  layout = 'vertical', // 'vertical', 'horizontal', or 'grid'
}) => {
  const getSortingStrategy = () => {
    switch (layout) {
      case 'horizontal':
        return horizontalListSortingStrategy;
      case 'grid':
        return rectSortingStrategy;
      case 'vertical':
      default:
        return verticalListSortingStrategy;
    }
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

  return (
    <div className={cn("min-h-[100px] p-4 rounded-lg border", containerClassName)}>
      <SortableContext 
        items={items.map(item => item.id)} 
        strategy={getSortingStrategy()}
      >
        <div className={cn(getLayoutClassName(), className)}>
          {items.map((item) => (
            <SortableItem 
              key={item.id} 
              id={item.id}
              containerId={listId}
            >
              {(sortableProps) => renderItem ? renderItem(item, sortableProps) : (
                <div>{item.id}</div>
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
  layout: PropTypes.oneOf(['vertical', 'horizontal', 'grid']),
};

export default DragAndDrop;