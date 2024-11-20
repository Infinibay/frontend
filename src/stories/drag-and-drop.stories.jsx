import React, { useState } from 'react';
import DragAndDrop from '../components/ui/drag-and-drop';

export default {
  title: 'UI/DragAndDrop',
  component: DragAndDrop,
  tags: ['autodocs'],
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
