# Storybook Guide

This guide explains how to work with our Storybook setup and the size provider pattern used across our components.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start Storybook:
```bash
npm run storybook
```

This will open Storybook in your default browser at `http://localhost:6006`.

## Size Provider Pattern

Our components use a size-based design system implemented through the `SizeProvider`. This ensures consistent sizing across the application.

### Key Concepts

1. **Size Provider**: A React context that provides size information to all child components
   ```jsx
   import { SizeProvider } from '@/components/ui/size-provider';

   <SizeProvider size="md">
     <YourComponent />
   </SizeProvider>
   ```

2. **Available Sizes**:
   - `sm` - Small
   - `md` - Medium (default)
   - `lg` - Large
   - `xl` - Extra Large

3. **Component Requirements**:
   - All components must accept a `size` prop
   - Components should use the `useSizeContext` hook to access the current size
   - Components should adapt their styling based on the provided size

### Using Size Provider in Stories

1. **Global Decorator**:
```jsx
const decorators = [
  (Story, context) => (
    <SizeProvider size={context.args.size}>
      <Story {...context.args} />
    </SizeProvider>
  ),
];

export default {
  title: 'Components/YourComponent',
  component: YourComponent,
  decorators,
  args: {
    size: 'md', // default size
  },
};
```

2. **Size Variants**:
```jsx
export const Small = {
  args: {
    size: 'sm',
  },
};

export const Medium = {
  args: {
    size: 'md',
  },
};
```

### Best Practices

1. **Component Implementation**:
```jsx
import { useSizeContext } from '@/components/ui/size-provider';

function YourComponent() {
  const { size } = useSizeContext();
  
  // Use size to determine styling
  const styles = {
    sm: 'text-sm p-2',
    md: 'text-base p-3',
    lg: 'text-lg p-4',
    xl: 'text-xl p-5',
  }[size];

  return <div className={styles}>...</div>;
}
```

2. **Story Organization**:
   - Group size variants together
   - Include examples of different states (loading, error, etc.)
   - Document component props using JSDoc comments
   - Add descriptions for complex interactions

3. **Testing Different Sizes**:
   - Always test components at all available sizes
   - Ensure responsive behavior works correctly
   - Verify that text, padding, and spacing scale appropriately

## Common Issues

1. **Missing Size Provider**:
   If you see the error "useSizeContext must be used within a SizeProvider", ensure your component is wrapped in a `SizeProvider`.

2. **Incorrect Size Propagation**:
   Check that your decorators are properly set up and that the size prop is being passed through args.

3. **Inconsistent Sizing**:
   Use the predefined size variants from the `size-provider.jsx` file instead of custom values to maintain consistency.

## Additional Resources

- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Component-Driven Development](https://www.componentdriven.org/)
- [React Context API](https://reactjs.org/docs/context.html)
