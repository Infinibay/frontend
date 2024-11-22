import { Button } from "@/components/ui/button";

/**
 * A modern, accessible button component with multiple variants and sizes.
 * 
 * @component
 */
export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'Interactive button component with multiple variants and sizes',
    docs: {
      description: {
        component: `
### Import
\`\`\`jsx
import { Button } from '@/components/ui/button'
\`\`\`

### Usage
\`\`\`jsx
// Basic button (defaults to variant="default" size="md")
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="success">Success</Button>
<Button variant="info">Info</Button>
<Button variant="warning">Warning</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With icon
<Button>
  <IconComponent />
  With Icon
</Button>

// Disabled state
<Button disabled>Disabled</Button>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'success', 'info', 'warning'],
      description: 'The visual style variant of the button',
      defaultValue: 'default',
      table: {
        type: { summary: "'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'info' | 'warning'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'icon'],
      description: 'The size of the button',
      defaultValue: 'md',
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl' | 'icon'" },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child component',
    },
  },
};

// Default button
export const Default = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'md',
  },
};

// Size variations
export const Sizes = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

// Variant showcase
export const Variants = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="success">Success</Button>
      <Button variant="info">Info</Button>
      <Button variant="warning">Warning</Button>
    </div>
  ),
};

// With icons
export const WithIcons = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        Add Item
      </Button>
      <Button variant="outline">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
          <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
        </svg>
        Send Email
      </Button>
    </div>
  ),
};

// Status Variants
export const StatusVariants = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="success">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        Success
      </Button>
      <Button variant="info">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        Information
      </Button>
      <Button variant="warning">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        Warning
      </Button>
    </div>
  ),
};

// States
export const States = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled>Disabled</Button>
      <Button variant="primary" disabled>Disabled Primary</Button>
      <Button variant="outline" disabled>Disabled Outline</Button>
    </div>
  ),
};