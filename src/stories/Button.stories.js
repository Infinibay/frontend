import { fn } from '@storybook/test';

import { Button } from '@/components/ui/button';

export default {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
  args: {
    // All existing styles with names. Valid values are default, destructive, secondary, outline, ghost, ghost-invert
    variant: 'default',
    // Size of the button. Valid values are default, sm, lg, icon
    size: 'default',
    // Button content
    children: 'Button',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    onClick: { action: 'clicked' }
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Default Button',
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