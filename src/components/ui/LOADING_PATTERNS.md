# Loading State Patterns

This document provides guidelines for implementing consistent loading states across the Infinibay application.

## Available Components

### 1. Skeleton (`skeleton.jsx`)

**Purpose:** Placeholder for content that is loading

**When to Use:**
- Lists, grids, and cards
- Any structured content during initial load
- Page-level loading states

**Advantages:**
- Maintains visual structure during loading
- Reduces layout shift (CLS)
- Provides better UX than spinners for content areas

**Example:**
```jsx
import { Skeleton } from "@/components/ui/skeleton"

// Simple skeleton
<Skeleton className="h-6 w-3/4 rounded" />

// Skeleton that matches a specific component
<Skeleton className="w-12 h-12 rounded-full" /> // Avatar
<Skeleton className="h-4 w-32 rounded" />       // Text line
```

### 2. LoadingOverlay (`loading-overlay.jsx`)

**Purpose:** Full-page blocking during critical operations

**When to Use:**
- Saving critical configuration
- Processing operations that require user attention
- Operations that should prevent user interaction

**Props:**
- `message`: Descriptive text shown to user
- `variant`: `"default"` | `"pulse"`
- `size`: `"default"` | `"lg"` | `"xl"`

**Note:** Use sparingly - can be intrusive

**Example:**
```jsx
import { LoadingOverlay } from "@/components/ui/loading-overlay"

{isProcessing && (
  <LoadingOverlay
    message="Processing your request..."
    variant="pulse"
    size="lg"
  />
)}
```

### 3. Spinner (`spinner.jsx`)

**Purpose:** Inline loading indicator for small operations

**When to Use:**
- Inside buttons during form submission
- Small sections loading data
- Quick operations (< 2 seconds)

**Props:**
- `size`: `"sm"` | `"md"` | `"lg"` | `"xl"`
- `style`: `"circular"` | `"windows"` | `"beat"` | `"pulse"`

**Example:**
```jsx
import { Spinner } from "@/components/ui/spinner"

<Button disabled={isLoading}>
  {isLoading && <Spinner size="sm" className="mr-2" />}
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

## Implementation Patterns

### Pattern 1: Page-Level Loading with Skeleton

Maintain the page structure during loading for better UX.

```jsx
if (isLoading) {
  return (
    <div className="w-full">
      <Header />  {/* Keep header visible */}
      <ContentContainer>
        <ContentSkeleton count={6} size={size} />
      </ContentContainer>
    </div>
  );
}
```

**Existing Implementations:**
- `DepartmentGridSkeleton` - Grid of department card skeletons
- `MachineGridSkeleton` - Grid of VM card skeletons
- `MachineTableSkeleton` - Table of VM row skeletons

### Pattern 2: Button Loading State

Disable the button and show a spinner with descriptive text.

```jsx
<Button disabled={isLoading}>
  {isLoading && <Spinner size="sm" className="mr-2" />}
  {isLoading ? 'Processing...' : 'Submit'}
</Button>
```

### Pattern 3: Section Loading

Use skeleton for sections with defined structure.

```jsx
{isLoadingSection ? (
  <Skeleton className="h-32 w-full rounded-lg" />
) : (
  <SectionContent />
)}
```

### Pattern 4: Blocking Operation

Use LoadingOverlay only for critical operations.

```jsx
{isProcessing && (
  <LoadingOverlay
    message="Processing your request..."
    variant="pulse"
    size="lg"
  />
)}
```

## Best Practices

1. **Always use skeleton for lists/grids** - Better UX than generic spinners
2. **Maintain page structure during loading** - Headers and navigation should remain visible
3. **Skeleton should replicate exact structure** - Same size, spacing, and layout as real content
4. **Disable actions during loading** - Prevent double-submit and race conditions
5. **Use LoadingOverlay sparingly** - It's intrusive and blocks all interaction
6. **Include text with spinners in buttons** - "Saving...", "Loading...", etc.
7. **Consider error states** - Not just loading, plan for error handling too

## Anti-Patterns to Avoid

- Using spinner for long lists (use skeleton instead)
- LoadingOverlay for fast operations (< 500ms)
- Skeleton that doesn't match actual content structure
- Multiple LoadingOverlays at once
- Buttons without visual feedback during loading
- Abrupt layout changes when content loads (use skeleton to prevent this)

## Component Location Reference

| Component | Path |
|-----------|------|
| Skeleton | `src/components/ui/skeleton.jsx` |
| LoadingOverlay | `src/components/ui/loading-overlay.jsx` |
| Spinner | `src/components/ui/spinner.jsx` |
| DepartmentCardSkeleton | `src/app/departments/components/DepartmentCardSkeleton.jsx` |
| UserPcSkeleton | `src/app/departments/[name]/components/UserPcSkeleton.jsx` |

## Quick Reference Table

| Scenario | Component | Example |
|----------|-----------|---------|
| Department list loading | `DepartmentGridSkeleton` | `<DepartmentGridSkeleton count={6} size={size} />` |
| VM grid loading | `MachineGridSkeleton` | `<MachineGridSkeleton count={8} size={size} />` |
| VM table loading | `MachineTableSkeleton` | `<MachineTableSkeleton count={6} />` |
| Button saving | `Spinner` | `<Button><Spinner size="sm" className="mr-2" />Saving...</Button>` |
| Critical operation | `LoadingOverlay` | `<LoadingOverlay message="Processing..." />` |
| Generic section | `Skeleton` | `<Skeleton className="h-32 w-full rounded-lg" />` |
