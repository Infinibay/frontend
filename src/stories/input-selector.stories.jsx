import React from "react";
import { InputSelector } from "@/components/ui/input-selector";

export default {
  title: "Components/InputSelector",
  component: InputSelector,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    selectedItem: {
      control: "object",
      description: "The currently selected item",
    },
    onSelectItem: { action: "selected" },
    placeholder: {
      control: "text",
      description: "Placeholder text when no item is selected",
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

// Sample items for the selector
const sampleItems = [
  { id: "1", name: "Apple" },
  { id: "2", name: "Banana" },
  { id: "3", name: "Cherry" },
  { id: "4", name: "Dragon Fruit" },
  { id: "5", name: "Elderberry" },
  { id: "6", name: "Fig" },
  { id: "7", name: "Grape" },
  { id: "8", name: "Honeydew" },
  { id: "9", name: "Kiwi" },
  { id: "10", name: "Lemon" },
];

// Base template for all stories
const Template = (args) => (
  <div className="w-[300px]">
    <InputSelector {...args} items={sampleItems} />
  </div>
);

// Default story - No selection
export const Default = Template.bind({});
Default.args = {
  placeholder: "Select a fruit",
  searchPlaceholder: "Search fruits...",
};

// With a preselected item
export const WithSelection = Template.bind({});
WithSelection.args = {
  selectedItem: sampleItems[2],
  placeholder: "Select a fruit",
  searchPlaceholder: "Search fruits...",
};

// Custom keys
export const CustomKeys = () => {
  const customItems = [
    { code: "US", label: "United States" },
    { code: "CA", label: "Canada" },
    { code: "MX", label: "Mexico" },
    { code: "UK", label: "United Kingdom" },
    { code: "FR", label: "France" },
  ];

  return (
    <div className="w-[300px]">
      <InputSelector
        items={customItems}
        selectedItem={customItems[1]}
        itemLabelKey="label"
        itemValueKey="code"
        placeholder="Select a country"
        searchPlaceholder="Search countries..."
      />
    </div>
  );
};

// Custom rendering
export const CustomRendering = () => {
  const userItems = [
    { id: "1", name: "John Doe", role: "Admin", avatar: "😎" },
    { id: "2", name: "Jane Smith", role: "User", avatar: "👩" },
    { id: "3", name: "Bob Johnson", role: "Developer", avatar: "👨‍💻" },
    { id: "4", name: "Sarah Williams", role: "Designer", avatar: "👩‍🎨" },
    { id: "5", name: "Mike Brown", role: "Manager", avatar: "👨‍💼" },
  ];

  return (
    <div className="w-[300px]">
      <InputSelector
        items={userItems}
        selectedItem={userItems[0]}
        placeholder="Select a user"
        searchPlaceholder="Search users..."
        renderItem={(item, isSelected) => (
          <div className="flex items-center">
            <span className="mr-2 text-lg">{item.avatar}</span>
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs text-gray-500">{item.role}</span>
            </div>
            {isSelected && (
              <div className="ml-auto">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            )}
          </div>
        )}
        displayValue={(item) => `${item.avatar} ${item.name}`}
      />
    </div>
  );
};

// Responsive sizes
export const Responsive = () => (
  <div className="space-y-6">
    <div>
      <h3 className="mb-2 text-sm font-medium">Small (Mobile):</h3>
      <div className="w-[200px]">
        <InputSelector 
          items={sampleItems} 
          placeholder="Select a fruit"
        />
      </div>
    </div>
    
    <div>
      <h3 className="mb-2 text-sm font-medium">Medium:</h3>
      <div className="w-[300px]">
        <InputSelector 
          items={sampleItems} 
          selectedItem={sampleItems[4]}
          placeholder="Select a fruit"
        />
      </div>
    </div>
    
    <div>
      <h3 className="mb-2 text-sm font-medium">Large:</h3>
      <div className="w-[500px]">
        <InputSelector 
          items={sampleItems} 
          selectedItem={sampleItems[7]}
          placeholder="Select a fruit"
        />
      </div>
    </div>
  </div>
);