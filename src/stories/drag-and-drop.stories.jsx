import React, { useState } from 'react';
import DragAndDrop from '../components/ui/drag-and-drop';

/**
 * A flexible drag and drop component that supports both single-list reordering and cross-list item transfers.
 * Features smooth animations, customizable drop positions, and support for custom item rendering.
 */
export default {
  title: 'UI/DragAndDrop',
  component: DragAndDrop,
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of items to be rendered in the list. Each item must have a unique "id" property.',
      control: 'object',
      table: {
        type: { summary: 'Array<{ id: string | number, ... }>' }
      }
    },
    onDrop: {
      description: 'Callback fired when an item is dropped from another list. Receives (id, sourceListId, targetIndex, item).',
      control: false,
      table: {
        type: { summary: '(id: string | number, sourceListId: string, targetIndex: number, item: any) => void' }
      }
    },
    onOrderChange: {
      description: 'Callback fired when the order of items changes. Receives the new array of items.',
      control: false,
      table: {
        type: { summary: '(items: Array<any>) => void' }
      }
    },
    className: {
      description: 'Additional CSS class for the items container.',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    itemClassName: {
      description: 'CSS class applied to each draggable item.',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    renderItem: {
      description: 'Custom render function for list items. If not provided, renders item.id.',
      control: false,
      table: {
        type: { summary: '(item: any) => ReactNode' }
      }
    },
    dragOverClassName: {
      description: 'CSS class applied when dragging over the container.',
      control: 'text',
      defaultValue: 'bg-secondary/50',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'bg-secondary/50' }
      }
    },
    containerClassName: {
      description: 'Additional CSS class for the outer container.',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    acceptFrom: {
      description: 'Array of listIds from which this list accepts items. If not provided, accepts from any list.',
      control: 'object',
      table: {
        type: { summary: 'Array<string>' }
      }
    },
    listId: {
      description: 'Unique identifier for the list. Required for cross-list operations.',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    dropPosition: {
      description: 'Controls where items can be dropped.',
      control: { type: 'select' },
      options: ['start', 'end', 'anywhere'],
      defaultValue: 'anywhere',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'anywhere' }
      }
    },
    animationSpeed: {
      description: 'Controls the speed of all animations in the component.',
      control: { type: 'select' },
      options: ['slow', 'normal', 'fast'],
      defaultValue: 'normal',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'normal' }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
A highly customizable drag and drop component built with Framer Motion.

### Features
- Smooth animations for drag and drop operations with customizable speeds
- Support for both single-list reordering and cross-list transfers
- Customizable drop positions (start, end, or anywhere)
- Custom item rendering
- Tailwind CSS integration
- Accessible drag and drop interface

### Basic Usage

\`\`\`jsx
const [items, setItems] = useState([
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' }
]);

return (
  <DragAndDrop
    items={items}
    onOrderChange={setItems}
    listId="my-list"
    renderItem={(item) => <div>{item.title}</div>}
    animationSpeed="normal"
  />
);
\`\`\`

### Animation Speeds
- slow: Gentle, smooth animations (0.4s-0.5s)
- normal: Balanced animations (0.2s-0.3s)
- fast: Quick, snappy animations (0.1s-0.2s)
        `
      }
    }
  }
};

const items = [
  { id: 1, title: 'Item 1', description: 'Description 1' },
  { id: 2, title: 'Item 2', description: 'Description 2' },
  { id: 3, title: 'Item 3', description: 'Description 3' },
  { id: 4, title: 'Item 4', description: 'Description 4' },
  { id: 5, title: 'Item 5', description: 'Description 5' },
];

const renderItem = (item) => (
  <div className="space-y-2">
    <h3 className="font-semibold">{item.title}</h3>
    <p className="text-sm text-muted-foreground">{item.description}</p>
  </div>
);

/**
 * Basic example showing drag and drop within a single list.
 * Items can be reordered by dragging them to any position.
 */
export const Default = () => {
  const [currentItems, setCurrentItems] = useState(items.slice(0, 3));

  return (
    <div className="space-y-4">
      <DragAndDrop 
        items={currentItems} 
        onOrderChange={setCurrentItems}
        listId="default-list"
        dropPosition="anywhere"
        renderItem={renderItem}
      />
      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">Current Order:</h3>
        <pre className="text-sm">
          {JSON.stringify(currentItems, null, 2)}
        </pre>
      </div>
    </div>
  );
};

/**
 * Example showing drag and drop between two lists.
 * Items can be moved within each list and transferred between lists.
 */
export const TwoLists = () => {
  const [list1Items, setList1Items] = useState(items.slice(0, 3));
  const [list2Items, setList2Items] = useState(items.slice(3));

  const handleList1Drop = (id, sourceListId, targetIndex, item) => {
    if (sourceListId === 'list2') {
      // Remove from list 2 and add to list 1
      const newList2Items = list2Items.filter(i => i.id.toString() !== id.toString());
      setList2Items(newList2Items);
      setList1Items([...list1Items, item]);
    }
  };

  const handleList2Drop = (id, sourceListId, targetIndex, item) => {
    if (sourceListId === 'list1') {
      // Remove from list 1 and add to list 2
      const newList1Items = list1Items.filter(i => i.id.toString() !== id.toString());
      setList1Items(newList1Items);
      setList2Items([...list2Items, item]);
    }
  };

  const handleList1OrderChange = (newItems) => {
    setList1Items(newItems);
  };

  const handleList2OrderChange = (newItems) => {
    setList2Items(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">List A</h3>
          <DragAndDrop 
            items={list1Items} 
            onDrop={handleList1Drop}
            onOrderChange={handleList1OrderChange}
            listId="list1"
            acceptFrom={['list1', 'list2']}
            containerClassName="bg-primary/5"
            renderItem={renderItem}
            dropPosition="anywhere"
            animationSpeed="slow"
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2">List B</h3>
          <DragAndDrop 
            items={list2Items} 
            onDrop={handleList2Drop}
            onOrderChange={handleList2OrderChange}
            listId="list2"
            acceptFrom={['list1', 'list2']}
            containerClassName="bg-secondary/5"
            renderItem={renderItem}
            dropPosition="anywhere"
            animationSpeed="slow"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">List A Order:</h3>
          <pre className="text-sm">
            {JSON.stringify(list1Items, null, 2)}
          </pre>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">List B Order:</h3>
          <pre className="text-sm">
            {JSON.stringify(list2Items, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

/**
 * Example demonstrating different drop position modes:
 * - start: Only allows dropping at the beginning of the list
 * - end: Only allows dropping at the end of the list
 * - anywhere: Allows dropping between any items
 */
export const DropPositionExamples = () => {
  const [startItems, setStartItems] = useState(items.slice(0, 2));
  const [endItems, setEndItems] = useState(items.slice(2, 4));
  const [anywhereItems, setAnywhereItems] = useState(items.slice(4));

  const handleStartDrop = (id, sourceListId) => {
    if (sourceListId === 'end-list') {
      setEndItems(endItems.filter(i => i.id.toString() !== id.toString()));
    } else if (sourceListId === 'anywhere-list') {
      setAnywhereItems(anywhereItems.filter(i => i.id.toString() !== id.toString()));
    }
  };

  const handleEndDrop = (id, sourceListId) => {
    if (sourceListId === 'start-list') {
      setStartItems(startItems.filter(i => i.id.toString() !== id.toString()));
    } else if (sourceListId === 'anywhere-list') {
      setAnywhereItems(anywhereItems.filter(i => i.id.toString() !== id.toString()));
    }
  };

  const handleAnywhereDrop = (id, sourceListId) => {
    if (sourceListId === 'start-list') {
      setStartItems(startItems.filter(i => i.id.toString() !== id.toString()));
    } else if (sourceListId === 'end-list') {
      setEndItems(endItems.filter(i => i.id.toString() !== id.toString()));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <h3 className="font-semibold mb-2">Drop at Start Only</h3>
          <DragAndDrop 
            items={startItems} 
            onDrop={handleStartDrop}
            onOrderChange={setStartItems}
            listId="start-list"
            acceptFrom={['start-list', 'end-list', 'anywhere-list']}
            dropPosition="start"
            containerClassName="bg-primary/5"
            renderItem={renderItem}
          />
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Drop at End Only</h3>
          <DragAndDrop 
            items={endItems} 
            onDrop={handleEndDrop}
            onOrderChange={setEndItems}
            listId="end-list"
            acceptFrom={['start-list', 'end-list', 'anywhere-list']}
            dropPosition="end"
            containerClassName="bg-secondary/5"
            renderItem={renderItem}
          />
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Drop Anywhere</h3>
          <DragAndDrop 
            items={anywhereItems} 
            onDrop={handleAnywhereDrop}
            onOrderChange={setAnywhereItems}
            listId="anywhere-list"
            acceptFrom={['start-list', 'end-list', 'anywhere-list']}
            dropPosition="anywhere"
            containerClassName="bg-accent/5"
            renderItem={renderItem}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Start List Order:</h3>
          <pre className="text-sm">
            {JSON.stringify(startItems, null, 2)}
          </pre>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">End List Order:</h3>
          <pre className="text-sm">
            {JSON.stringify(endItems, null, 2)}
          </pre>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Anywhere List Order:</h3>
          <pre className="text-sm">
            {JSON.stringify(anywhereItems, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

/**
 * Example demonstrating different animation speeds.
 * Try changing the animation speed using the controls panel.
 */
export const AnimationSpeedExample = () => {
  const [currentItems, setCurrentItems] = useState(items.slice(0, 3));

  return (
    <div className="space-y-4">
      <DragAndDrop 
        items={currentItems} 
        onOrderChange={setCurrentItems}
        listId="animation-speed-example"
        dropPosition="anywhere"
        renderItem={renderItem}
        animationSpeed="normal"
      />
      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">Try different speeds:</h3>
        <p className="text-sm text-muted-foreground">
          Change the animation speed using the controls panel above.
          The speed affects all animations including drag, drop, and placeholder transitions.
        </p>
      </div>
    </div>
  );
};
