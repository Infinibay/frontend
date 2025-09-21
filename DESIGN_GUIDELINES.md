# Infinibay Frontend Design Guidelines

> **Version 1.0** - A comprehensive guide for maintaining consistent, accessible, and professional UI design across the Infinibay platform.

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Dark & Light Themes](#dark--light-themes)
3. [Typography & Colors](#typography--colors)
4. [Size System](#size-system)
5. [Glass Effects System](#glass-effects-system)
6. [Readability & Contrast](#readability--contrast)
7. [Layout Guidelines](#layout-guidelines)
8. [Wallpaper Considerations](#wallpaper-considerations)
9. [Content Management](#content-management)
10. [Whitespace Management](#whitespace-management)
11. [Settings & Style](#settings--style)
12. [Do's and Don'ts](#dos-and-donts)

---

## Design Philosophy

Infinibay adopts a **modern glassmorphism design system** inspired by Windows 11 Fluent Design, prioritizing:

- **Clarity**: Information hierarchy that guides users naturally
- **Accessibility**: WCAG 2.1 AA compliance for all users
- **Consistency**: Unified experience across all platform components
- **Performance**: Smooth interactions without sacrificing visual appeal
- **Adaptability**: Responsive design that works across devices and preferences

Our target audience includes small to medium tech companies and technical support teams who value **simplicity, reliability, and visual feedback** for every action.

---

## Dark & Light Themes

### Theme Philosophy

Infinibay implements a comprehensive theme system with three modes:
- **Light Mode**: Professional, clean interface for daytime use
- **Dark Mode**: Reduced eye strain for extended sessions and low-light environments
- **System Mode**: Automatically adapts to user's OS preference

### Implementation

**Theme Provider Location**: `src/contexts/ThemeProvider.jsx`

```jsx
import { useAppTheme } from '@/contexts/ThemeProvider'

const { theme, resolvedTheme, setTheme, toggleTheme } = useAppTheme()
```

### Brand Color Palette

Our design system uses three primary brand colors defined in CSS custom properties:

#### Primary Colors
```css
/* Celeste - Primary brand color, used for accents and highlights */
--brand-celeste-400: 186 70% 76%;

/* Dark Blue - Professional, trustworthy, used for primary actions */
--brand-dark-blue-600: 208 85% 38%;

/* Sun - Energetic accent, used sparingly for warnings and highlights */
--brand-sun-400: 35 100% 75%;
```

#### Color Scales
Each brand color includes a complete 50-900 scale for consistent variations:

```css
/* Example: Celeste scale */
--brand-celeste-50: 186 70% 95%;   /* Lightest */
--brand-celeste-100: 186 70% 90%;
--brand-celeste-200: 186 70% 85%;
/* ... continuing to ... */
--brand-celeste-900: 186 70% 35%;  /* Darkest */
```

### Semantic Color Tokens

Use semantic tokens instead of direct brand colors for better theme adaptation:

```css
/* Recommended - adapts to theme */
color: hsl(var(--primary));
background: hsl(var(--background));

/* Avoid - doesn't adapt */
color: #1e40af;
background: #ffffff;
```

### Theme Switching Guidelines

**✅ Always:**
- Use semantic color tokens (`--foreground`, `--background`, `--primary`)
- Test components in both light and dark themes
- Ensure proper contrast in both themes

**❌ Never:**
- Hardcode color values
- Assume theme state without checking `resolvedTheme`
- Use brand colors directly for text (use semantic tokens)

---

## Typography & Colors

### Font Hierarchy

Our typography system uses a fluid scale that adapts to the size provider:

```css
/* Size Provider Variants */
.text-sm     /* Compact UI */
.text-base   /* Standard UI */
.text-lg     /* Comfortable UI */
.text-xl     /* Spacious UI */
```

### Typography Classes

**Headings:**
```css
.mainheading   /* Hero titles - lg:text-5xl sm:text-4xl */
.subheading    /* Section headers - lg:text-2xl sm:text-xl */
.heading2      /* Subsection headers - lg:text-2xl text-xl */
```

**Body Text:**
```css
p              /* Base paragraph - sm:text-[17px] text-sm */
.para          /* Enhanced paragraph - text-base lg:text-lg */
```

### Color Contrast Requirements

Follow **WCAG 2.1 AA** standards:

- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text (18pt+)**: 3:1 contrast ratio minimum
- **Interactive elements**: 3:1 contrast ratio for borders/states

### Text on Glass Surfaces

Use specific text color tokens for glass components:

```css
/* Light theme */
color: hsl(var(--glass-text-primary));    /* High contrast text */
color: hsl(var(--glass-text-secondary));  /* Supporting text */

/* Dark theme - automatically adapts */
color: hsl(var(--glass-text-primary));    /* Remains accessible */
```

### Color Usage Guidelines

**Primary (Dark Blue):**
- Main navigation items
- Primary action buttons
- Important status indicators

**Secondary (Celeste):**
- Secondary actions
- Hover states
- Progress indicators

**Accent (Sun):**
- Warnings and alerts
- Special highlights
- Success confirmations (sparingly)

---

## Size System

### Size Provider Implementation

**Location**: `src/components/ui/size-provider.jsx`

The size system provides four consistent scales across the entire application using CSS classes and custom properties. The Size Provider automatically applies CSS classes to the document root and generates CSS variables for automatic scaling.

```jsx
import { useSizeContext } from '@/components/ui/size-provider'

// For conditional logic and settings only
const { size, setSize, getSizeLabel } = useSizeContext()
```

### Available Sizes

| Size | Label       | Use Case                    | CSS Class  |
|------|-------------|-----------------------------|
| `sm` | Compact     | Dense UIs, mobile devices   | `size-sm` |
| `md` | Standard    | Default desktop experience  | `size-md` |
| `lg` | Comfortable | Accessibility, larger screens | `size-lg` |
| `xl` | Spacious    | Presentation mode, demos    | `size-xl` |

### CSS Classes Reference

The new system provides ready-to-use CSS classes that automatically scale based on the current size. No JavaScript required for styling.

#### Typography Classes
```css
.size-text          /* Base text size */
.size-heading       /* Standard headings */
.size-mainheading   /* Main page headings */
.size-subheading    /* Section subheadings */
.size-heading2      /* Secondary headings */
.size-small         /* Small text */
.size-xsmall        /* Extra small text */
```

#### Spacing Classes
```css
.size-padding       /* Standard padding */
.size-gap          /* Flex/grid gaps */
.size-container    /* Container spacing */
.size-item         /* List item spacing */
.size-sub-item     /* Nested item spacing */
.size-margin-xs    /* Extra small margins */
.size-margin-sm    /* Small margins */
```

#### Dimension Classes
```css
.size-height       /* Standard height */
.size-width        /* Standard width */
.size-icon         /* Icon dimensions */
.size-icon-button  /* Icon button size */
.size-icon-nav     /* Navigation icon size */
.size-avatar       /* Avatar dimensions */
.size-logo         /* Logo dimensions */
```

#### Component-Specific Classes
```css
.size-input-height    /* Input field height */
.size-badge-padding   /* Badge internal spacing */
.size-card-title      /* Card title spacing */
.size-navbar-width    /* Navigation width */
.size-card-padding    /* Card internal spacing */
```

#### Combined Component Classes
```css
.size-input        /* Complete input styling */
.size-button       /* Complete button styling */
.size-card         /* Complete card styling */
.size-badge        /* Complete badge styling */
```

### Usage Patterns

**Simple CSS Classes (Recommended):**
```jsx
const MyComponent = () => {
  return (
    <div className="size-container size-padding">
      <h2 className="size-heading">Title</h2>
      <p className="size-text">Content that automatically scales</p>
      <button className="size-button">Action</button>
    </div>
  )
}
```

**Component-Specific Classes:**
```jsx
const FormComponent = () => {
  return (
    <div className="size-card size-gap">
      <input className="size-input" />
      <div className="size-badge">Status</div>
    </div>
  )
}
```

**Size-Specific Selectors (Advanced):**
```css
/* Custom styles that only apply in large size */
.size-lg .my-component {
  /* Custom large-size styling */
}

.size-sm .my-component {
  /* Custom small-size styling */
}
```

**Migration Example:**
```jsx
// OLD PATTERN (deprecated)
const OldComponent = () => {
  const { size } = useSizeContext()
  const variant = sizeVariants[size]

  return (
    <div className={`${variant.padding} ${variant.text}`}>
      Content
    </div>
  )
}

// NEW PATTERN (recommended)
const NewComponent = () => {
  return (
    <div className="size-padding size-text">
      Content
    </div>
  )
}
```

### Advanced Usage

**Using CSS Custom Properties:**
```css
.my-custom-component {
  padding: var(--size-padding);
  font-size: var(--size-text);
  gap: var(--size-gap);
}
```

**Conditional Logic (when needed):**
```jsx
const SettingsComponent = () => {
  const { size, setSize } = useSizeContext()

  // Use context for conditional logic, not styling
  const showAdvanced = size === 'lg' || size === 'xl'

  return (
    <div className="size-container">
      {showAdvanced && <AdvancedOptions />}
      <select value={size} onChange={(e) => setSize(e.target.value)}>
        {/* Size selector */}
      </select>
    </div>
  )
}
```

---

## Glass Effects System

### Glass Effect Hierarchy

Infinibay implements a comprehensive glassmorphism system with six distinct effects:

#### 1. Glass Minimal (`glass-minimal`)
**Usage**: Maximum readability scenarios, critical text content
```css
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(8px);
```
**When to use**: Forms, critical text, content requiring highest readability regardless of background

#### 2. Glass Subtle (`glass-subtle`)
**Usage**: Content with text that needs good readability
```css
background: rgba(255, 255, 255, 0.55);
backdrop-filter: blur(8px);
```
**When to use**: Cards with text content, secondary information panels, readable content areas

#### 3. Glass Medium (`glass-medium`)
**Usage**: Primary content areas with mixed content (text + images)
```css
background: rgba(255, 255, 255, 0.65);
backdrop-filter: blur(14px);
```
**When to use**: Main content containers, dashboard cards, primary content areas

#### 4. Glass Strong (`glass-strong`)
**Usage**: High-priority content requiring excellent readability
```css
background: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(50px);
```
**When to use**: Important dialogs, modal content, focused content areas, critical information

#### 5. Mica (`mica`)
**Usage**: Navigation with text content, system UI
```css
background: rgba(255, 255, 255, 0.60);
backdrop-filter: blur(12px);
```
**When to use**: Sidebars with navigation text, toolbars with labels, system UI components

#### 6. Acrylic (`acrylic`)
**Usage**: Headers and elevated surfaces with content
```css
background: rgba(255, 255, 255, 0.70);
backdrop-filter: blur(20px);
```
**When to use**: Sticky headers with text, elevated navigation, command bars

### Context-Specific Usage

**Navigation Components:**
```jsx
// Sidebar - use mica for consistent navigation feel
<div className="mica elevation-2 radius-fluent-md">

// Header - use acrylic when sticky for prominence
<header className="acrylic elevation-4 radius-fluent-md">
```

**Content Areas:**
```jsx
// High readability content - use glass-minimal or glass-strong
<div className="glass-minimal border border-sidebar-border/20">
<div className="glass-strong elevation-4 radius-fluent-lg">

// Primary content with mixed content - use glass-medium
<main className="glass-medium elevation-3 radius-fluent-lg">

// Text content areas - use glass-subtle (55% opacity minimum)
<aside className="glass-subtle elevation-1 radius-fluent-md">
```

**Modal/Overlay Surfaces:**
```jsx
// Modal content - use glass-strong for focus
<div className="glass-strong elevation-5 radius-fluent-xl">

// Overlay background - use glass-overlay
<div className="glass-overlay"> {/* No blur - controlled by parent */}
```

### Glass Effect Guidelines

**✅ Always:**
- Use effects with 50%+ opacity (0.5+) for any content containing text
- Ensure sufficient contrast ratios for text readability
- Test glass effects with actual wallpaper backgrounds and both themes
- Consider reduced transparency accessibility settings
- Apply appropriate elevation with glass effects
- Use `glass-minimal` (95%) or `glass-strong` (75%) for critical content

**❌ Never:**
- Use effects below 50% opacity (0.5) for text content
- Stack multiple strong glass effects
- Use glass effects without backdrop support detection
- Forget to test dark theme variations
- Use low-opacity effects on interactive elements without proper contrast
- Assume any glass effect will work over wallpapers - always verify readability

### Accessibility Considerations

The system automatically adapts for users with transparency preferences:

```css
/* Reduced transparency support */
@media (prefers-reduced-transparency: reduce) {
  .glass-subtle, .glass-medium, .glass-strong {
    backdrop-filter: none;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
  }
}
```

---

## Readability & Contrast

### WCAG Compliance Standards

All design decisions must meet **WCAG 2.1 AA** accessibility requirements:

#### Text Contrast Requirements
- **Body text**: 4.5:1 minimum contrast ratio
- **Large text (18pt/24px+)**: 3:1 minimum contrast ratio
- **Interactive elements**: 3:1 contrast ratio for visual boundaries

#### Color Accessibility
- **Never rely on color alone** to convey information
- **Test with color blindness simulators** (Protanopia, Deuteranopia, Tritanopia)
- **Provide alternative indicators** (icons, text, patterns)

### High Contrast Text Tokens

Use semantic tokens that ensure proper contrast:

```css
/* Always use these for text */
.text-foreground           /* Primary text */
.text-muted-foreground     /* Secondary text */
.text-glass-text-primary   /* Text over glass surfaces */
.text-glass-text-secondary /* Supporting text over glass */
```

### Contrast Testing

**Manual Testing Process:**
1. Test all text/background combinations
2. Use browser developer tools contrast checker
3. Test with actual wallpaper backgrounds
4. Verify in both light and dark themes

**Automated Testing:**
```bash
# Use accessibility linting tools
npm run test:a11y  # If available in your setup
```

### Wallpaper Contrast Challenges

**Problem**: Text floating over dynamic wallpapers can become unreadable

**Solution**: Always use appropriate glass effects:

```jsx
// ❌ Wrong - text directly over wallpaper
<div className="absolute inset-0 text-foreground">
  Content that may be unreadable
</div>

// ✅ Correct - text with proper background
<div className="glass-minimal text-glass-text-primary">
  Always readable content
</div>
```

### Interactive Element Contrast

**Focus Indicators:**
```css
/* Ensure visible focus rings on glass surfaces */
.focus:ring-2 .focus:ring-brand-celeste-500
.focus-visible:outline-none .focus-visible:ring-2
```

**Button States:**
```css
/* Maintain contrast across all button states */
.hover:bg-primary/90  /* Slight opacity change */
.active:bg-primary/80 /* More pronounced for feedback */
```

---

## Layout Guidelines

### Sidebar Patterns

**Implementation**: `src/components/ui/sidebar.jsx`

#### Sidebar Types and Usage

**Main Navigation Sidebar:**
```jsx
// Use mica effect for consistent navigation feel
<Sidebar className="mica elevation-2">
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Navigation items */}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>
```

**Secondary Sidebar (Right Panel):**
```jsx
// Use acrylic for elevated, contextual content
<Sidebar side="right" className="acrylic elevation-4">
  {/* Contextual content, filters, etc. */}
</Sidebar>
```

#### Sidebar Behavior Guidelines

**Responsive Behavior:**
- **Desktop**: Fixed sidebar with toggle capability
- **Mobile**: Overlay sidebar that auto-closes after navigation
- **Size Adaptation**: Automatically adjusts based on size provider

**Animation Standards:**
```css
/* Use consistent timing and easing */
transition-duration: 300ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

### Header Component Usage

**Implementation**: `src/components/ui/header.jsx`

#### Header Patterns

**Page Headers:**
```jsx
<Header variant="page" sticky={false}>
  <HeaderContent>
    <HeaderTitle>Page Title</HeaderTitle>
    <HeaderActions>
      <Button variant="primary">Primary Action</Button>
    </HeaderActions>
  </HeaderContent>
</Header>
```

**Sticky Headers:**
```jsx
<Header variant="sticky" className="acrylic elevation-4">
  <HeaderContent>
    {/* Use stronger glass effect for sticky headers */}
  </HeaderContent>
</Header>
```

#### Header Guidelines

**✅ Always:**
- Use sticky headers for long pages with scrollable content
- Include primary actions in header when relevant
- Maintain consistent header height across sections
- Apply proper glass effects based on context

**❌ Never:**
- Use multiple headers on the same page
- Hide essential navigation in headers
- Use glass effects that conflict with content readability

### Z-Index Management

**Z-Index Hierarchy** (defined in `globals.css`):

```css
/* Z-Index Layering Structure */
0     /* Background wallpaper (body::before) */
1     /* Body content base */
2     /* App container */
10    /* Main content */
20    /* Settings container */
30    /* Wallpaper selector */
35    /* Card hover states */
500   /* Dropdowns */
1000  /* Modals */
1100  /* Toasts */
```

**Usage in Components:**
```jsx
// Use predefined z-index utilities
<div className="z-500">  {/* Dropdown */}
<Modal className="z-1000"> {/* Modal */}
<Toast className="z-1100"> {/* Toast */}
```

### Layout Composition

**Standard Page Layout:**
```jsx
<div className="app-container"> {/* z-index: 2 */}
  <Sidebar className="mica">
    {/* Navigation */}
  </Sidebar>

  <main className="main-content"> {/* z-index: 10 */}
    <Header className="acrylic elevation-4">
      {/* Page header */}
    </Header>

    <div className="glass-medium p-6">
      {/* Main content area */}
    </div>
  </main>
</div>
```

---

## Wallpaper Considerations

### Dynamic Wallpaper System

Infinibay supports dynamic wallpapers that create visual depth but present unique design challenges.

**Wallpaper Implementation**: Background wallpapers are applied via CSS custom properties:

```css
/* CSS custom properties for wallpapers */
--wallpaper-url: url('/images/wallpapers/wallpaper1.jpg');
--wallpaper-url-dark: url('/images/wallpapers/wallpaper1.jpg');

/* Applied via body::before pseudo-element */
body::before {
  background: var(--wallpaper-url);
  background-size: cover;
  background-position: center;
  z-index: 0;
}
```

### Text Readability Over Wallpapers

**Core Problem**: Text elements floating directly over wallpapers can become unreadable depending on the background image colors and patterns.

**Solution Strategy**: Use appropriate glass effects that provide sufficient contrast:

#### Glass Effect Selection for Wallpapers

**Glass Minimal - Primary Choice:**
```jsx
// ✅ Best for text-heavy content over wallpapers
<div className="glass-minimal">
  <h2>Always readable title</h2>
  <p>Content that maintains readability regardless of wallpaper</p>
</div>
```

**When to Use Each Effect Over Wallpapers:**

| Glass Effect | Best For | Contrast Level |
|--------------|----------|----------------|
| `glass-minimal` | Critical text content, forms, data | Highest (95% background) |
| `glass-strong` | Important content, modals | Excellent (75% background) |
| `acrylic` | Headers, elevated surfaces | High (70% background) |
| `fluent-card` | Card content with text | High (68% background) |
| `glass-medium` | Mixed content, primary areas | Good (65% background) |
| `mica` | Navigation elements, sidebars | Good (60% background) |
| `glass-subtle` | Secondary content with text | Adequate (55% background) |

### Wallpaper-Safe Design Patterns

**Safe Content Containers:**
```jsx
// ✅ High readability containers (recommended for text)
<div className="glass-minimal border border-white/20 rounded-lg p-6">
  <h3 className="text-glass-text-primary">Always Readable Title</h3>
  <p className="text-glass-text-secondary">Always readable content</p>
</div>

<div className="glass-strong elevation-4 rounded-lg p-6">
  <h3 className="text-glass-text-primary">Important Content</h3>
  <p className="text-glass-text-secondary">Excellent readability</p>
</div>

// ✅ Good readability for secondary content
<div className="glass-medium elevation-3 rounded-lg p-4">
  <h4>Secondary Content</h4>
  <p>Good readability (65% background)</p>
</div>

// ❌ Text floating without adequate background
<div className="absolute top-4 left-4 text-foreground">
  This text may be unreadable over some wallpapers
</div>
```

**Navigation Over Wallpapers:**
```jsx
// ✅ Navigation with mica background (60% opacity - good for navigation text)
<nav className="mica backdrop-blur-md">
  <ul>
    <li><a href="#" className="text-glass-text-primary">Navigation Link</a></li>
  </ul>
</nav>

// ✅ Alternative: Use glass-medium for text-heavy navigation
<nav className="glass-medium backdrop-blur-md">
  <ul>
    <li><a href="#" className="text-glass-text-primary">Clear Navigation</a></li>
  </ul>
</nav>
```

**Interactive Elements:**
```jsx
// ✅ Buttons with adequate background (minimum 55% for text)
<Button className="glass-subtle backdrop-blur-sm">
  Readable Button Text
</Button>

// ✅ Form elements with high readability
<Input className="glass-minimal backdrop-blur-sm" placeholder="Always readable" />

// ✅ Important interactive elements
<Button className="glass-strong backdrop-blur-lg">
  Primary Action
</Button>
```

### Wallpaper Testing Guidelines

**Design Testing Process:**
1. **Test with multiple wallpaper types:**
   - Light wallpapers (clouds, bright landscapes)
   - Dark wallpapers (night scenes, space)
   - High contrast wallpapers (geometric patterns)
   - Busy wallpapers (detailed textures, complex scenes)

2. **Test text readability:**
   - Primary headings and titles
   - Body text and descriptions
   - Interactive element labels
   - Status messages and alerts

3. **Test component visibility:**
   - Button boundaries and hover states
   - Form field borders
   - Card edges and separators
   - Icon clarity

**Automated Testing:**
```bash
# Test contrast ratios with different backgrounds
# (This would be a custom script for your team)
npm run test:wallpaper-contrast
```

### Dynamic Wallpaper Adaptation

**Responsive Wallpaper Selection:**
```css
/* Different wallpapers for different screen sizes */
@media (max-width: 768px) {
  :root {
    --wallpaper-url: url('/images/wallpapers/mobile-wallpaper1.jpg');
  }
}
```

**Theme-Aware Wallpapers:**
```css
/* Dark theme wallpapers */
.dark body::before {
  background: var(--wallpaper-url-dark);
}
```

---

## Content Management

### Scrollable Content Design

#### Long Content Handling

**Virtualization for Large Lists:**
```jsx
// Use virtualization for lists with 100+ items
import { VirtualizedList } from '@/components/ui/virtualized-list'

<VirtualizedList
  items={largeDataSet}
  itemHeight={60}
  containerHeight={400}
  renderItem={({ item, index }) => (
    <ListItem key={item.id} data={item} />
  )}
/>
```

**Progressive Disclosure:**
```jsx
// Show limited content initially with expansion option
const [showAll, setShowAll] = useState(false)

return (
  <div className="glass-medium p-4">
    <Content items={showAll ? allItems : limitedItems} />
    {!showAll && (
      <Button onClick={() => setShowAll(true)} variant="ghost">
        Show {allItems.length - limitedItems.length} more items
      </Button>
    )}
  </div>
)
```

#### Custom Scrollbar Design

**Styled Scrollbars:**
```css
/* Custom scrollbar styling */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
```

**Implementation:**
```jsx
// Apply to containers with overflow
<div className="glass-medium custom-scrollbar max-h-96 overflow-y-auto">
  {/* Scrollable content */}
</div>
```

### Content Organization Strategies

#### Progressive Information Architecture

**Layered Information Disclosure:**
```jsx
// Summary → Details → Extended Details
<Card className="glass-medium">
  <CardHeader>
    <CardTitle>Quick Summary</CardTitle>
  </CardHeader>

  <CardContent>
    <Collapsible>
      <CollapsibleTrigger>Show Details</CollapsibleTrigger>
      <CollapsibleContent>
        <DetailedContent />

        <Collapsible>
          <CollapsibleTrigger>Technical Details</CollapsibleTrigger>
          <CollapsibleContent>
            <TechnicalSpecs />
          </CollapsibleContent>
        </Collapsible>
      </CollapsibleContent>
    </Collapsible>
  </CardContent>
</Card>
```

#### Tab-Based Content Organization

```jsx
// Use tabs for related content sections
<Tabs defaultValue="overview" className="glass-medium">
  <TabsList className="grid w-full grid-cols-4">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="logs">Logs</TabsTrigger>
  </TabsList>

  <TabsContent value="overview" className="space-y-4">
    <OverviewContent />
  </TabsContent>

  <TabsContent value="details" className="space-y-4">
    <DetailedContent />
  </TabsContent>
</Tabs>
```

### Performance Considerations

#### Lazy Loading Strategies

```jsx
// Lazy load heavy content sections
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Skeleton className="h-48" />}>
  <HeavyComponent />
</Suspense>
```

#### Content Pagination

```jsx
// Implement pagination for large data sets
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## Whitespace Management

### Spacing Scale and Rhythm

#### Design Tokens for Spacing

Infinibay uses a consistent spacing scale based on CSS classes that automatically scale:

**Size-Aware Spacing:**
```jsx
// Automatic scaling without JavaScript
return (
  <div className="size-container size-gap">
    {/* Content automatically adapts to current size */}
  </div>
)
```

**Size-Specific Overrides:**
```css
/* Custom spacing for specific sizes */
.size-lg .custom-spacing {
  padding: var(--size-padding);
}

.size-sm .custom-spacing {
  gap: var(--size-gap);
}
```

**Spacing Hierarchy:**

| Element Type | Small (sm) | Medium (md) | Large (lg) | XLarge (xl) |
|-------------|------------|-------------|------------|-------------|
| Container   | `p-3`      | `p-4`       | `p-6`      | `p-8`       |
| Items       | `px-4 py-2`| `px-5 py-3` | `px-6 py-4`| `px-8 py-6` |
| Gaps        | `gap-2`    | `gap-3`     | `gap-4`    | `gap-6`     |

#### Rhythm and Vertical Spacing

**Consistent Vertical Rhythm:**
```css
/* Base line height for readability */
.prose {
  line-height: 1.7;
}

/* Consistent vertical spacing between elements */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}
```

### Visual Hierarchy Through Spacing

#### Information Grouping

**Related Content Grouping:**
```jsx
// Close spacing for related items
<div className="space-y-2">
  <h3>Section Title</h3>
  <p>Related description immediately follows</p>
</div>

// Larger spacing to separate sections
<div className="space-y-8">
  <Section1 />
  <Section2 />
  <Section3 />
</div>
```

**Card Layout Spacing:**
```jsx
// Consistent internal spacing
<Card className="glass-medium">
  <CardHeader className="pb-3">
    <CardTitle className="text-xl">Title</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Description with appropriate line spacing
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    <Content />
  </CardContent>

  <CardFooter className="pt-3">
    <Actions />
  </CardFooter>
</Card>
```

### Breathing Room Principles

#### Content Density Balance

**Comfortable Reading Zones:**
```jsx
// Provide adequate breathing room for text content
<div className="max-w-2xl mx-auto prose prose-lg">
  <h1 className="mb-6">Properly Spaced Title</h1>
  <p className="mb-4 leading-relaxed">
    Paragraph with comfortable line height and spacing
  </p>
</div>
```

**Interface Element Spacing:**
```jsx
// Adequate touch targets for interactive elements
<Button className="min-h-[44px] px-6 py-3">
  Touch-friendly button
</Button>

// Proper spacing between interactive elements
<div className="flex gap-4">
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
</div>
```

#### Responsive Spacing

**Adaptive Spacing:**
```jsx
// Spacing that adapts to screen size and context
<div className="p-4 md:p-6 lg:p-8">
  {/* Content with responsive padding */}
</div>

<div className="space-y-4 md:space-y-6">
  {/* Responsive vertical spacing */}
</div>
```

### Micro-Interactions and Spacing

#### Hover State Spacing

```css
/* Maintain spatial relationships during interactions */
.interactive-card {
  @apply transition-all duration-200 ease-out;
  @apply hover:scale-[1.02] hover:shadow-lg;
  /* Consistent spacing maintained during scale */
}
```

#### Animation-Safe Spacing

```jsx
// Ensure animations don't break layout spacing
<motion.div
  className="space-y-4"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content maintains spacing during animation */}
</motion.div>
```

---

## Settings & Style

### Style Configuration System

#### Theme Settings Integration

**Settings Panel Implementation:**
```jsx
import { useAppTheme } from '@/contexts/ThemeProvider'
import { useSizeContext } from '@/components/ui/size-provider'

const StyleSettings = () => {
  const { theme, setTheme } = useAppTheme()
  // Context used for settings logic, not styling
  const { size, setSize, availableSizes } = useSizeContext()

  return (
    <div className="settings-container glass-medium size-container">
      <h2 className="size-heading">Appearance Settings</h2>

      <ThemeSelector value={theme} onChange={setTheme} />
      {/* Settings controls use context for logic */}
      <SizeSelector value={size} onChange={setSize} options={availableSizes} />
      <WallpaperSelector />
      <AccessibilitySettings />
    </div>
  )
}
```

**Note**: `useSizeContext` is primarily used for conditional logic and settings controls. For styling, use CSS classes which automatically scale.

#### Wallpaper Management

**Dynamic Wallpaper System:**
```jsx
const WallpaperSelector = () => {
  const [selectedWallpaper, setSelectedWallpaper] = useState('wallpaper1')

  const updateWallpaper = (wallpaper) => {
    document.documentElement.style.setProperty(
      '--wallpaper-url',
      `url('/images/wallpapers/${wallpaper}.jpg')`
    )
    setSelectedWallpaper(wallpaper)
  }

  return (
    <div className="wallpaper-selector">
      <h3>Background Wallpaper</h3>
      <div className="grid grid-cols-3 gap-4">
        {wallpapers.map(wallpaper => (
          <button
            key={wallpaper.id}
            onClick={() => updateWallpaper(wallpaper.id)}
            className={`
              glass-subtle p-2 rounded-lg border-2 transition-all
              ${selectedWallpaper === wallpaper.id
                ? 'border-primary'
                : 'border-transparent'
              }
            `}
          >
            <img src={wallpaper.thumbnail} alt={wallpaper.name} />
          </button>
        ))}
      </div>
    </div>
  )
}
```

### Accessibility Settings

#### Reduced Transparency Support

**Implementation in Components:**
```jsx
const AccessibilitySettings = () => {
  const [reducedTransparency, setReducedTransparency] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-reduced-transparency',
      reducedTransparency.toString()
    )
  }, [reducedTransparency])

  return (
    <div className="space-y-4">
      <h3>Accessibility</h3>

      <label className="flex items-center space-x-2">
        <Switch
          checked={reducedTransparency}
          onCheckedChange={setReducedTransparency}
        />
        <span>Reduce transparency effects</span>
      </label>

      <label className="flex items-center space-x-2">
        <Switch
          checked={prefersReducedMotion}
          onCheckedChange={setPrefersReducedMotion}
        />
        <span>Reduce motion animations</span>
      </label>
    </div>
  )
}
```

#### High Contrast Mode

```jsx
const HighContrastToggle = () => {
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  return (
    <Switch
      checked={highContrast}
      onCheckedChange={setHighContrast}
      aria-label="Toggle high contrast mode"
    />
  )
}
```

### User Preference Persistence

#### Settings Storage

```jsx
// Save user preferences to localStorage
const saveUserPreferences = (preferences) => {
  localStorage.setItem('infinibay-preferences', JSON.stringify(preferences))
}

// Load user preferences on app initialization
const loadUserPreferences = () => {
  const stored = localStorage.getItem('infinibay-preferences')
  return stored ? JSON.parse(stored) : defaultPreferences
}
```

#### Settings Synchronization

```jsx
// Sync settings across components
const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(loadUserPreferences)

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    saveUserPreferences(newSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}
```

---

## Do's and Don'ts

### Always Do ✅

#### Color and Contrast
- **Always use semantic color tokens** (`--foreground`, `--background`, `--primary`) instead of hardcoded values
- **Always test contrast ratios** to meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
- **Always provide alternative indicators** beyond color (icons, text labels, patterns)
- **Always test both light and dark themes** for every component
- **Always use `glass-minimal` for content over wallpapers** to ensure readability

#### Glass Effects
- **Always use appropriate glass effects for context** (mica for navigation, acrylic for headers, glass-minimal for wallpapers)
- **Always test glass effects with actual wallpaper backgrounds** during development
- **Always provide fallbacks** for browsers without backdrop-filter support
- **Always respect user accessibility preferences** (reduced transparency, reduced motion)

#### Typography and Spacing
- **Always use the size provider system** for consistent scaling across the application
- **Always maintain consistent spacing rhythm** using the established spacing scale
- **Always ensure adequate touch targets** (minimum 44px) for interactive elements
- **Always test readability** with actual content, not lorem ipsum

#### Layout and Navigation
- **Always use the established z-index hierarchy** to prevent layering conflicts
- **Always provide clear visual hierarchy** through spacing, typography, and color
- **Always include proper focus indicators** for keyboard navigation
- **Always test responsive behavior** across different screen sizes

#### Performance and Accessibility
- **Always lazy load heavy content** to improve performance
- **Always provide loading states** and skeleton screens for better UX
- **Always implement proper ARIA labels** and semantic HTML
- **Always test with screen readers** and keyboard-only navigation

### Never Do ❌

#### Color and Contrast
- **Never hardcode color values** in components (use semantic tokens instead)
- **Never rely solely on color** to convey important information
- **Never assume wallpaper colors** when designing text overlays
- **Never use low contrast combinations** that fail accessibility standards
- **Never forget to test dark theme** implementations

#### Glass Effects
- **Never stack multiple strong glass effects** (creates visual noise and performance issues)
- **Never use glass effects without backdrop-filter detection** and fallbacks
- **Never apply glass effects directly to text elements** (use containers instead)
- **Never ignore reduced transparency preferences** in your implementations
- **Never use glass effects on primary interactive elements** without ensuring proper contrast

#### Typography and Spacing
- **Never use fixed pixel values for spacing** (use the size provider system)
- **Never create cramped layouts** without adequate breathing room
- **Never mix spacing scales** within the same component or section
- **Never ignore line height and reading comfort** for text-heavy content
- **Never use font sizes below 14px** for body text (accessibility requirement)

#### Layout and Navigation
- **Never create custom z-index values** without consulting the established hierarchy
- **Never hide essential navigation** in mobile layouts without providing alternatives
- **Never create layouts that break** when content length varies
- **Never ignore touch target sizes** on mobile devices
- **Never create keyboard traps** or inaccessible focus flows

#### Performance and Code Quality
- **Never load all content upfront** for large data sets (use virtualization or pagination)
- **Never create animations without reduced motion fallbacks**
- **Never ignore loading states** for async operations
- **Never inline large amounts of CSS** in components (use utility classes)
- **Never ignore browser compatibility** for backdrop-filter and other modern CSS features

### Decision Making Guidelines

#### When Choosing Glass Effects
1. **Consider the content type**: Text-heavy = glass-minimal, Navigation = mica, Headers = acrylic
2. **Test with wallpapers**: Ensure readability across different background images
3. **Check accessibility**: Verify reduced transparency and high contrast modes work properly
4. **Performance impact**: Stronger effects use more resources, use appropriately

#### When Implementing Responsive Design
1. **Start with mobile**: Design for smallest screen first, then enhance
2. **Test touch interactions**: Ensure all interactive elements are accessible on touch devices
3. **Consider content priority**: What's most important when space is limited?
4. **Use the size provider**: Leverage the existing system for consistent scaling

#### When Adding New Components
1. **Follow existing patterns**: Check similar components for established conventions
2. **Use semantic tokens**: Never introduce hardcoded colors or spacing
3. **Test accessibility**: Screen readers, keyboard navigation, contrast ratios
4. **Document usage**: Add clear examples and guidelines for other developers

---

## Conclusion

This design system provides a comprehensive foundation for building consistent, accessible, and beautiful user interfaces in the Infinibay platform. By following these guidelines, we ensure that every user interaction feels polished, professional, and purposeful.

Remember: **Great design is invisible** - when users can focus on their tasks without friction, we've succeeded in creating an exceptional experience.

### Quick Reference

**Essential Imports:**
```jsx
import { useAppTheme } from '@/contexts/ThemeProvider'
import { useSizeContext } from '@/components/ui/size-provider' // For conditional logic only
import { cn } from '@/lib/utils'
// Note: sizeVariants import no longer needed for most cases
```

**Key Classes to Remember:**
- **Glass Effects**: `glass-minimal`, `glass-subtle`, `glass-medium`, `glass-strong`, `glass-overlay`
- **Size Typography**: `size-text`, `size-heading`, `size-mainheading`, `size-small`
- **Size Spacing**: `size-padding`, `size-gap`, `size-container`, `size-margin-xs`
- **Size Dimensions**: `size-height`, `size-width`, `size-icon`, `size-avatar`
- **Size Components**: `size-input`, `size-button`, `size-card`, `size-badge`
- **Size Layout**: `size-card-grid`, `size-section-spacing`, `size-navbar-width`
- **Legacy Classes**: `text-glass-text-primary`, `elevation-{1-5}`, `radius-fluent-{sm|md|lg|xl}`

**Size System Quick Reference:**
```css
/* Individual classes (mix and match) */
.size-padding .size-text .size-gap

/* Combined component classes (complete styling) */
.size-button .size-input .size-card

/* Size-specific selectors (advanced) */
.size-lg .component { /* large-size only */ }
```

**Testing Checklist:**
- [ ] Light and dark theme compatibility
- [ ] Wallpaper background readability
- [ ] Keyboard navigation
- [ ] Screen reader accessibility
- [ ] Mobile touch targets
- [ ] Reduced transparency/motion preferences

---

*Last updated: Version 1.0 - Initial comprehensive guidelines*