import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import Avatar from '../components/ui/avatar';
import DragAndDrop from '../components/ui/drag-and-drop';
import DualList from '../components/ui/dual-list';
import { cn } from "../lib/utils";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { 
  arrayMove,
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable';

/**
 * DragAndDrop Component Stories
 * 
 * Demonstrates various use cases and configurations of the DragAndDrop component:
 * - Basic reordering
 * - Custom item rendering with task cards
 * - File list example
 * - Dual list example with team member assignment
 */
export default {
  title: 'UI/DragAndDrop',
  component: DragAndDrop,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# DragAndDrop Component

A flexible drag and drop component with smooth animations using dnd-kit.

## Features
- Smooth drag and drop animations
- Keyboard accessibility
- Touch support
- Custom item rendering
- Simple reordering API

## Usage Example
\`\`\`jsx
const [items, setItems] = useState([
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' }
]);

return (
  <DragAndDrop
    items={items}
    listId="my-list"
    onOrderChange={setItems}
    renderItem={(item) => (
      <Card>
        <h3>{item.title}</h3>
      </Card>
    )}
  />
);
\`\`\`
        `
      }
    }
  }
};

// Sample data for stories
const tasks = [
  { id: 1, title: 'Design System', priority: 'High', assignee: 'Alice' },
  { id: 2, title: 'API Integration', priority: 'Medium', assignee: 'Bob' },
  { id: 3, title: 'Documentation', priority: 'Low', assignee: 'Charlie' },
  { id: 4, title: 'Testing', priority: 'High', assignee: 'Diana' },
  { id: 5, title: 'Deployment', priority: 'Medium', assignee: 'Eve' }
];

const files = [
  { id: 1, name: 'document.pdf', size: '2.4 MB', type: 'PDF' },
  { id: 2, name: 'image.png', size: '1.8 MB', type: 'Image' },
  { id: 3, name: 'spreadsheet.xlsx', size: '3.1 MB', type: 'Excel' },
  { id: 4, name: 'presentation.pptx', size: '2.5 MB', type: 'PowerPoint' },
  { id: 5, name: 'audio.mp3', size: '1.2 MB', type: 'Audio' }
];

/**
 * Basic example showing simple list reordering
 */
export const Basic = () => {
  const [items, setItems] = useState(files);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <DragAndDrop
        items={items}
        listId="basic-list"
        onOrderChange={setItems}
        renderItem={(item) => (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-muted-foreground">{item.size}</span>
            </div>
          </Card>
        )}
      />
    </DndContext>
  );
};

/**
 * Example showing a task board with custom item rendering
 */
export const TaskBoard = () => {
  const [items, setItems] = useState(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const renderTask = (task) => (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{task.title}</h3>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            task.priority === 'high' 
              ? "bg-red-100 text-red-800" 
              : "bg-slate-100 text-slate-800"
          )}>
            {task.priority}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </div>
    </Card>
  );

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <DragAndDrop
        items={items}
        listId="task-list"
        onOrderChange={setItems}
        renderItem={renderTask}
      />
    </DndContext>
  );
};

/**
 * Example demonstrating drag and drop between two lists
 */
export const Dual = () => {
  const [items, setItems] = useState({
    leftItems: files.slice(0, 3),
    rightItems: files.slice(3)
  });

  const renderItem = (item) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground">{item.size}</span>
      </div>
    </Card>
  );

  return (
    <div className="w-[800px]">
      <DualList
        leftItems={items.leftItems}
        rightItems={items.rightItems}
        onChange={setItems}
        renderItem={renderItem}
        leftTitle="Files"
        rightTitle="Selected Files"
      />
    </div>
  );
};