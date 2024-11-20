import { Spinner } from "@/components/ui/spinner";

/**
 * A versatile spinner component with multiple styles and customization options.
 * 
 * @component
 * @example
 * // How to import the component:
 * import { Spinner } from '@/components/ui/spinner'
 * 
 * // Basic usage:
 * export default function MyComponent() {
 *   return <Spinner className="text-blue-500" />
 * }
 * 
 * // With all props:
 * export default function MyComponent() {
 *   return (
 *     <Spinner
 *       style="windows"    // 'circular' | 'windows' | 'beat' | 'pulse'
 *       speed="medium"     // 'slow' | 'medium' | 'fast'
 *       size="md"         // 'sm' | 'md' | 'lg' | 'xl'
 *       className="text-blue-500"
 *     />
 *   )
 * }
 */
export default {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'A customizable loading spinner component with multiple styles',
    docs: {
      description: {
        component: `
### Import
\`\`\`jsx
import { Spinner } from '@/components/ui/spinner'
\`\`\`

### Usage
\`\`\`jsx
// Basic usage
<Spinner className="text-blue-500" />

// With custom style and speed
<Spinner 
  style="windows"
  speed="fast"
  className="text-green-500"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    speed: {
      control: 'select',
      options: ['slow', 'medium', 'fast'],
      description: 'The speed of the spinner animation',
      defaultValue: 'medium',
      table: {
        type: { summary: "'slow' | 'medium' | 'fast'" },
        defaultValue: { summary: 'medium' },
      },
    },
    style: {
      control: 'select',
      options: ['circular', 'windows', 'beat', 'pulse'],
      description: 'The visual style of the spinner',
      defaultValue: 'circular',
      table: {
        type: { summary: "'circular' | 'windows' | 'beat' | 'pulse'" },
        defaultValue: { summary: 'circular' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'The size of the spinner',
      defaultValue: 'md',
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply. Use text-{color} classes to change the spinner color.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
};

// Default Spinner
export const Default = {
  args: {
    speed: 'medium',
    style: 'circular',
    size: 'md',
    className: 'text-blue-500',
  },
};

// Different Speeds
export const Speeds = () => (
  <div className="flex gap-4 items-center">
    <Spinner speed="slow" className="text-blue-500" />
    <Spinner speed="medium" className="text-blue-500" />
    <Spinner speed="fast" className="text-blue-500" />
  </div>
);

// Different Styles
export const Styles = () => (
  <div className="flex gap-8 items-center">
    <Spinner style="circular" className="text-blue-500" />
    <Spinner style="windows" className="text-blue-500" />
    <Spinner style="beat" className="text-blue-500" />
    <Spinner style="pulse" className="text-blue-500" />
  </div>
);

// Different Sizes
export const Sizes = () => (
  <div className="flex gap-4 items-center">
    <Spinner size="sm" className="text-blue-500" />
    <Spinner size="md" className="text-blue-500" />
    <Spinner size="lg" className="text-blue-500" />
    <Spinner size="xl" className="text-blue-500" />
  </div>
);

// Different Colors
export const Colors = () => (
  <div className="flex flex-col gap-8">
    {['circular', 'windows', 'beat', 'pulse'].map(style => (
      <div key={style} className="flex gap-4 items-center">
        <span className="w-20 font-medium">{style}:</span>
        <Spinner style={style} className="text-blue-500" />
        <Spinner style={style} className="text-red-500" />
        <Spinner style={style} className="text-green-500" />
        <Spinner style={style} className="text-yellow-500" />
        <Spinner style={style} className="text-purple-500" />
      </div>
    ))}
  </div>
);

// Windows Style with Different Speeds
export const WindowsSpinner = () => (
  <div className="flex gap-8 items-center">
    <Spinner style="windows" speed="slow" className="text-blue-500" />
    <Spinner style="windows" speed="medium" className="text-blue-500" />
    <Spinner style="windows" speed="fast" className="text-blue-500" />
  </div>
);

// Beat Style with Different Speeds
export const BeatSpinner = () => (
  <div className="flex gap-8 items-center">
    <Spinner style="beat" speed="slow" className="text-blue-500" />
    <Spinner style="beat" speed="medium" className="text-blue-500" />
    <Spinner style="beat" speed="fast" className="text-blue-500" />
  </div>
);

// Pulse Style with Different Sizes
export const PulseSpinner = () => (
  <div className="flex gap-8 items-center">
    <Spinner style="pulse" size="sm" className="text-blue-500" />
    <Spinner style="pulse" size="md" className="text-blue-500" />
    <Spinner style="pulse" size="lg" className="text-blue-500" />
    <Spinner style="pulse" size="xl" className="text-blue-500" />
  </div>
);
