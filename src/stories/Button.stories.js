import { Button } from "@/components/ui/button";

/**
 * A customizable button component with various styles and variants.
 * 
 * @component
 * @example
 * // How to import the component:
 * import { Button } from '@/components/ui/button'
 * 
 * // Basic usage:
 * export default function MyComponent() {
 *   return (
 *     <Button onClick={() => console.log('Clicked!')}>
 *       Click me
 *     </Button>
 *   )
 * }
 * 
 * // With variants and sizes:
 * export default function MyComponent() {
 *   return (
 *     <>
 *       <Button variant="default" size="default">
 *         Default Button
 *       </Button>
 *       <Button variant="destructive" size="lg">
 *         Delete
 *       </Button>
 *       <Button variant="outline" size="sm">
 *         Small Outline
 *       </Button>
 *     </>
 *   )
 * }
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
// Basic button
<Button>Click me</Button>

// With variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// With sizes
<Button size="default">Default Size</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With icon
<Button>
  <IconComponent className="mr-2 h-4 w-4" />
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
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the button',
      defaultValue: 'default',
      table: {
        type: { summary: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
      defaultValue: 'default',
      table: {
        type: { summary: "'default' | 'sm' | 'lg' | 'icon'" },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
      table: {
        type: { summary: 'string' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render the button as a child component',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    onClick: { action: 'clicked' }
  }
};

export const Default = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
};

// Variants

export const Destructive = {
  args: {
    variant: 'destructive',
    size: 'default',
    children: 'Destructive Button',
  },
};

export const Outline = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Outline Button',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Ghost Button',
  },
};

export const Link = {
  args: {
    variant: 'link',
    size: 'default',
    children: 'Link Button',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    size: 'default',
    children: 'Secondary Button',
  },
};

// Sizes

export const Large = {
  args: {
    variant: 'default',
    size: 'lg',
    children: 'Large Button',
  },
};

export const Small = {
  args: {
    variant: 'default',
    size: 'sm',
    children: 'Small Button',
  },
};

export const Icon = {
  args: {
    variant: 'default',
    size: 'icon',
    children: '🔍',
  },
}