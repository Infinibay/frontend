// Example usage of MockDataBadge components

import { MockDataBadge, MockDataSection, MockDataIndicator } from './mock-data-badge';

// 1. Basic badge usage
export const BasicBadgeExample = () => (
  <MockDataBadge>Mock Data</MockDataBadge>
);

// 2. Different variants
export const VariantsExample = () => (
  <>
    <MockDataBadge variant="default">Default</MockDataBadge>
    <MockDataBadge variant="warning">Warning</MockDataBadge>
    <MockDataBadge variant="info">Info</MockDataBadge>
    <MockDataBadge variant="subtle">Subtle</MockDataBadge>
  </>
);

// 3. Different sizes
export const SizesExample = () => (
  <>
    <MockDataBadge size="sm">Small</MockDataBadge>
    <MockDataBadge size="default">Default</MockDataBadge>
    <MockDataBadge size="lg">Large</MockDataBadge>
  </>
);

// 4. Positioned badges on cards
export const PositionedExample = () => (
  <div className="relative p-8 border rounded">
    <MockDataBadge position="top-right">Top Right</MockDataBadge>
    <MockDataBadge position="top-left">Top Left</MockDataBadge>
    <MockDataBadge position="bottom-right">Bottom Right</MockDataBadge>
    <MockDataBadge position="bottom-left">Bottom Left</MockDataBadge>
    <p>Card content here</p>
  </div>
);

// 5. Mock data section wrapper
export const SectionExample = () => (
  <MockDataSection 
    showBadge={true}
    message="This data is simulated"
    badgeProps={{ variant: 'warning' }}
  >
    <div className="p-4 border rounded">
      <h3>Some Content</h3>
      <p>This entire section is marked as mock data</p>
    </div>
  </MockDataSection>
);

// 6. Inline indicator for values
export const InlineExample = () => (
  <div>
    <p>CPU Usage: <MockDataIndicator>85%</MockDataIndicator></p>
    <p>Memory: <MockDataIndicator tooltip="Mock memory value">4GB</MockDataIndicator></p>
  </div>
);

// 7. Conditional display
export const ConditionalExample = ({ isMockData }) => (
  <>
    {isMockData && <MockDataBadge>Mock Data Active</MockDataBadge>}
    <MockDataSection showBadge={isMockData}>
      <div>Content that may or may not be mock</div>
    </MockDataSection>
  </>
);