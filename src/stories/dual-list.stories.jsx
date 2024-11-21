import React from 'react';
import { cn } from '../lib/utils';
import DualList from '../components/ui/dual-list';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';

const meta = {
  title: 'Components/DualList',
  component: DualList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A dual list component that allows users to move items between two lists using drag and drop.

\`\`\`jsx
import DualList from '@/components/ui/dual-list';

// Basic usage
export function Example() {
  return (
    <DualList
      leftItems={[{ id: '1', content: 'Item 1' }]}
      rightItems={[{ id: '2', content: 'Item 2' }]}
      renderItem={(item) => <div>{item.content}</div>}
      onChange={({ leftItems, rightItems }) => {
        // Handle changes here
      }}
    />
  );
}
\`\`\`

**Note:** Drag and drop animations may not work properly in the documentation view. 
For the best experience, please view the examples in isolation mode by clicking the example you want to see at the left panel.
`,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

const generateItems = (prefix, count) => 
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    content: `Item ${i + 1}`
  }));

const renderItem = (item) => (
  <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    {item.content}
  </div>
);

// Basic example with vertical layout
export const BasicDualList = {
  args: {
    leftItems: generateItems('left', 3),
    rightItems: generateItems('right', 2),
    renderItem,
    leftTitle: "Available Items",
    rightTitle: "Selected Items",
    layout: 'vertical',
    dropZoneClassName: "bg-gray-50 p-4",
    emptyDropZoneClassName: "border-gray-300 bg-gray-100"
  }
};

// Horizontal layout example
export const HorizontalLayout = {
  args: {
    ...BasicDualList.args,
    layout: 'horizontal',
    leftItems: generateItems('left', 5),
    rightItems: generateItems('right', 3),
    dropZoneClassName: "bg-blue-50 p-4",
    emptyDropZoneClassName: "border-blue-200 bg-blue-50"
  }
};

// Grid layout example
export const GridLayout = {
  args: {
    ...BasicDualList.args,
    layout: 'grid',
    leftItems: generateItems('left', 6),
    rightItems: generateItems('right', 4),
    dropZoneClassName: "bg-purple-50 p-4",
    emptyDropZoneClassName: "border-purple-200 bg-purple-50"
  }
};

// Custom styled example
export const CustomStyled = {
  args: {
    ...BasicDualList.args,
    layout: 'vertical',
    dropZoneClassName: "bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl shadow-sm",
    emptyDropZoneClassName: "border-dashed border-gray-400 bg-gray-50/50",
    containerClassName: "gap-8",
    listClassName: "gap-4",
    renderItem: (item) => (
      <div className="p-4 bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-md transition-all">
        {item.content}
      </div>
    )
  }
};

// Empty lists example
export const EmptyLists = {
  args: {
    ...BasicDualList.args,
    leftItems: [],
    rightItems: [],
    dropZoneClassName: "bg-gray-50 p-4",
    emptyDropZoneClassName: "border-gray-300 bg-gray-100/50",
    leftTitle: "Drop Items Here",
    rightTitle: "Or Here"
  }
};

// Cards example with custom content
export const CardExample = {
  args: {
    ...BasicDualList.args,
    layout: 'grid',
    leftItems: [
      { id: 'card1', title: 'Task 1', priority: 'High', status: 'In Progress' },
      { id: 'card2', title: 'Task 2', priority: 'Medium', status: 'Todo' },
      { id: 'card3', title: 'Task 3', priority: 'Low', status: 'In Review' },
    ],
    rightItems: [
      { id: 'card4', title: 'Task 4', priority: 'High', status: 'Done' },
      { id: 'card5', title: 'Task 5', priority: 'Medium', status: 'In Progress' },
    ],
    dropZoneClassName: "bg-gray-50/50 p-4",
    emptyDropZoneClassName: "border-gray-200 bg-gray-50/30",
    leftTitle: "Backlog",
    rightTitle: "Sprint",
    renderItem: (item) => (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all space-y-2">
        <h3 className="font-medium text-gray-900">{item.title}</h3>
        <div className="flex gap-2 text-sm">
          <span className={cn(
            "px-2 py-1 rounded-full",
            item.priority === 'High' ? "bg-red-100 text-red-700" :
            item.priority === 'Medium' ? "bg-yellow-100 text-yellow-700" :
            "bg-green-100 text-green-700"
          )}>
            {item.priority}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {item.status}
          </span>
        </div>
      </div>
    )
  }
};

// Example with onAdd/onRemove events for team assignment
export const TeamAssignment = {
  args: {
    leftItems: [
      { id: 'user1', name: 'Alice Johnson', role: 'Developer', available: true },
      { id: 'user2', name: 'Bob Smith', role: 'Designer', available: true },
      { id: 'user3', name: 'Carol White', role: 'Manager', available: true },
    ],
    rightItems: [
      { id: 'user4', name: 'David Brown', role: 'Developer', available: false },
      { id: 'user5', name: 'Eve Black', role: 'Designer', available: false },
    ],
    renderItem: (user) => (
      <Card className="p-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.role}</div>
          </div>
          <span className={cn(
            "ml-auto px-2 py-1 rounded-full text-xs",
            user.available 
              ? "bg-green-100 text-green-800" 
              : "bg-blue-100 text-blue-800"
          )}>
            {user.available ? 'Available' : 'Assigned'}
          </span>
        </div>
      </Card>
    ),
    leftTitle: "Available Team Members",
    rightTitle: "Project Team",
    layout: 'vertical',
    dropZoneClassName: "bg-gray-50/50 p-4",
    emptyDropZoneClassName: "border-gray-200 bg-gray-50/30",
    containerClassName: "gap-6",
    onChange: ({ leftItems, rightItems }) => {
      // Update availability status when items move between lists
      const updatedLeftItems = leftItems.map(item => ({ ...item, available: true }));
      const updatedRightItems = rightItems.map(item => ({ ...item, available: false }));
      
      // Return the updated items and force a re-render
      return {
        leftItems: updatedLeftItems,
        rightItems: updatedRightItems,
        forceUpdate: true
      };
    }
  }
};

// Example with onAdd/onRemove events and validation
export const TaskPrioritization = {
  args: {
    leftItems: [
      { id: 'task1', title: 'Setup Project', priority: 'Low', effort: 1 },
      { id: 'task2', title: 'User Authentication', priority: 'High', effort: 3 },
      { id: 'task3', title: 'Database Design', priority: 'Medium', effort: 2 },
      { id: 'task4', title: 'API Integration', priority: 'High', effort: 3 },
    ],
    rightItems: [
      { id: 'task5', title: 'Documentation', priority: 'Medium', effort: 1 },
    ],
    renderItem: (task) => (
      <Card className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{task.title}</h3>
            <div className="flex gap-2">
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                task.priority === 'High' ? "bg-red-100 text-red-700" :
                task.priority === 'Medium' ? "bg-yellow-100 text-yellow-700" :
                "bg-green-100 text-green-700"
              )}>
                {task.priority}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {task.effort} SP
              </span>
            </div>
          </div>
        </div>
      </Card>
    ),
    leftTitle: "Backlog",
    rightTitle: "Sprint (Max 8 SP)",
    layout: 'vertical',
    dropZoneClassName: "bg-gray-50/50 p-4",
    emptyDropZoneClassName: "border-gray-200 bg-gray-50/30",
    containerClassName: "gap-6",
    onChange: ({ leftItems, rightItems }) => {
      // Calculate total effort in the sprint
      const totalEffort = rightItems.reduce((sum, task) => sum + task.effort, 0);
      
      // If total effort would exceed 8 SP, prevent the change
      if (totalEffort > 8) {
        console.warn('Sprint capacity exceeded (8 SP maximum)');
        return null; // Returning null prevents the change
      }
      
      return { leftItems, rightItems };
    }
  }
};
