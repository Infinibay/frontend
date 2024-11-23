import React from "react";
import { Input } from "@/components/ui/input";
import { SizeProvider } from "@/components/ui/size-provider";

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
  <SizeProvider size={args.size}>
    <div className="w-[300px]">
      <Input {...args} />
    </div>
  </SizeProvider>
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
      <SizeProvider size="sm">
        <Input placeholder="Small input" />
      </SizeProvider>
    </div>
    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
      <div className="text-sm font-medium">Medium:</div>
      <SizeProvider size="md">
        <Input placeholder="Medium input" />
      </SizeProvider>
    </div>
    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
      <div className="text-sm font-medium">Large:</div>
      <SizeProvider size="lg">
        <Input placeholder="Large input" />
      </SizeProvider>
    </div>
    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
      <div className="text-sm font-medium">Extra Large:</div>
      <SizeProvider size="xl">
        <Input placeholder="Extra large input" />
      </SizeProvider>
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
      <SizeProvider size="md">
        <Input type="text" placeholder="Text input" />
      </SizeProvider>
    </div>
    <div className="w-[300px]">
      <SizeProvider size="md">
        <Input type="password" placeholder="Password input" />
      </SizeProvider>
    </div>
    <div className="w-[300px]">
      <SizeProvider size="md">
        <Input type="email" placeholder="Email input" />
      </SizeProvider>
    </div>
    <div className="w-[300px]">
      <SizeProvider size="md">
        <Input type="number" placeholder="Number input" />
      </SizeProvider>
    </div>
  </div>
);
