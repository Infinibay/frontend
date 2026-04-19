import React from "react";
import { Input } from "@/components/ui/input";

export default {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      defaultValue: "md",
    },
    placeholder: {
      control: "text",
      defaultValue: "Type something...",
    },
    disabled: {
      control: "boolean",
      defaultValue: false,
    },
  },
};

// Base template for all stories
const Template = (args) => (
  
    <div className="w-[300px]">
      <Input {...args} />
    </div>
  
);

// Default story
export const Default = Template.bind({});
Default.args = {
  placeholder: "Type something...",
  size: "md",
};

// All sizes story
export const AllSizes = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
      <div className="text-sm font-medium">Small:</div>
      
        <Input placeholder="Small input" />
      
    </div>
    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
      <div className="text-sm font-medium">Medium:</div>
      
        <Input placeholder="Medium input" />
      
    </div>
    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
      <div className="text-sm font-medium">Large:</div>
      
        <Input placeholder="Large input" />
      
    </div>
    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
      <div className="text-sm font-medium">Extra Large:</div>
      
        <Input placeholder="Extra large input" />
      
    </div>
  </div>
);

// Disabled state
export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: "Disabled input",
  disabled: true,
  size: "md",
};

// With value
export const WithValue = Template.bind({});
WithValue.args = {
  value: "Hello, World!",
  size: "md",
};

// Different types
export const Types = () => (
  <div className="space-y-4">
    <div className="w-[300px]">
      
        <Input type="text" placeholder="Text input" />
      
    </div>
    <div className="w-[300px]">
      
        <Input type="password" placeholder="Password input" />
      
    </div>
    <div className="w-[300px]">
      
        <Input type="email" placeholder="Email input" />
      
    </div>
    <div className="w-[300px]">
      
        <Input type="number" placeholder="Number input" />
      
    </div>
  </div>
);
