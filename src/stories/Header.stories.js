import { Button } from "@/components/ui/button"
import { Header, HeaderLeft, HeaderCenter, HeaderRight } from "@/components/ui/header"

/**
 * A flexible header component with left, center, and right sections.
 * Supports different sizes, variants, and a sticky mode.
 */
export default {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'Header component with customizable sections and variants',
    docs: {
      description: {
        component: `
### Import
\`\`\`jsx
import { Header, HeaderLeft, HeaderCenter, HeaderRight } from "@/components/ui/header"
\`\`\`

### Usage
\`\`\`jsx
<Header>
  <HeaderLeft>Left content</HeaderLeft>
  <HeaderCenter>Center content</HeaderCenter>
  <HeaderRight>Right content</HeaderRight>
</Header>

// With variants
<Header variant="primary" size="lg">
  <HeaderLeft>Left content</HeaderLeft>
  <HeaderCenter>Center content</HeaderCenter>
  <HeaderRight>Right content</HeaderRight>
</Header>

// Sticky header
<Header sticky>
  <HeaderLeft>Left content</HeaderLeft>
  <HeaderCenter>Center content</HeaderCenter>
  <HeaderRight>Right content</HeaderRight>
</Header>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'error',
        'warning',
        'info',
        'dark',
        'glass',
        'gradient',
        'gradient-secondary',
        'gradient-success',
        'gradient-error'
      ],
      description: 'The visual style variant of the header',
      defaultValue: 'default',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'The size of the header',
      defaultValue: 'md',
    },
    sticky: {
      control: 'boolean',
      description: 'Whether the header should stick to the top of the viewport',
      defaultValue: false,
    },
    elevated: {
      control: 'boolean',
      description: 'Whether to add a shadow to the header',
      defaultValue: false,
    },
    bordered: {
      control: 'boolean',
      description: 'Whether to show borders',
      defaultValue: true,
    },
  },
};

// Basic header with all sections
export const Default = {
  render: () => (
    <Header>
      <HeaderLeft>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
        <span className="font-semibold">Company Name</span>
      </HeaderLeft>
      <HeaderCenter>
        <nav className="flex gap-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Products</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
        </nav>
      </HeaderCenter>
      <HeaderRight>
        <Button variant="ghost" size="sm">Sign in</Button>
        <Button size="sm">Sign up</Button>
      </HeaderRight>
    </Header>
  ),
};

// Size variations
export const Sizes = {
  render: () => (
    <div className="flex flex-col gap-8">
      {['sm', 'md', 'lg', 'xl'].map((size) => (
        <Header key={size} size={size}>
          <HeaderLeft>
            <span className="font-semibold">Size: {size}</span>
          </HeaderLeft>
          <HeaderCenter>
            <nav className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Products</a>
            </nav>
          </HeaderCenter>
          <HeaderRight>
            <Button size={size === 'xl' ? 'lg' : size === 'lg' ? 'md' : 'sm'}>
              Action
            </Button>
          </HeaderRight>
        </Header>
      ))}
    </div>
  ),
};

// Variant showcase
export const Variants = {
  render: () => (
    <div className="flex flex-col gap-8">
      {[
        'default',
        'primary',
        'secondary',
        'success',
        'error',
        'warning',
        'info',
        'dark',
        'glass',
        'gradient',
        'gradient-secondary',
        'gradient-success',
        'gradient-error'
      ].map((variant) => (
        <Header key={variant} variant={variant} elevated={variant === 'glass'}>
          <HeaderLeft>
            <span className="font-semibold">Variant: {variant}</span>
          </HeaderLeft>
          <HeaderCenter>
            <nav className="flex gap-6">
              <a href="#" className="hover:opacity-70 transition-opacity">Home</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Products</a>
            </nav>
          </HeaderCenter>
          <HeaderRight>
            <Button 
              variant={
                variant === 'default' ? 'primary' : 
                variant.startsWith('gradient') ? 'outline' : 
                'outline'
              }
              className={variant !== 'default' ? 'border-white/20 text-white hover:bg-white/10' : ''}
            >
              Action
            </Button>
          </HeaderRight>
        </Header>
      ))}
    </div>
  ),
};

// Style combinations
export const StyleCombinations = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Header variant="glass" elevated bordered>
        <HeaderLeft>
          <span className="font-semibold">Glass + Elevated + Bordered</span>
        </HeaderLeft>
        <HeaderRight>
          <Button variant="outline">Action</Button>
        </HeaderRight>
      </Header>

      <Header variant="gradient" elevated={false} bordered={false}>
        <HeaderLeft>
          <span className="font-semibold">Gradient (No Border/Shadow)</span>
        </HeaderLeft>
        <HeaderRight>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Action
          </Button>
        </HeaderRight>
      </Header>

      <Header variant="dark" elevated bordered>
        <HeaderLeft>
          <span className="font-semibold">Dark + Elevated</span>
        </HeaderLeft>
        <HeaderRight>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Action
          </Button>
        </HeaderRight>
      </Header>

      <Header variant="secondary" elevated className="bg-opacity-95">
        <HeaderLeft>
          <span className="font-semibold">Secondary + Elevated</span>
        </HeaderLeft>
        <HeaderRight>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Action
          </Button>
        </HeaderRight>
      </Header>
    </div>
  ),
};

// Sticky header example
export const StickyHeader = {
  render: () => (
    <div className="h-[200vh] bg-gray-100">
      <Header sticky>
        <HeaderLeft>
          <span className="font-semibold">Sticky Header</span>
        </HeaderLeft>
        <HeaderCenter>
          <nav className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Products</a>
          </nav>
        </HeaderCenter>
        <HeaderRight>
          <Button>Action</Button>
        </HeaderRight>
      </Header>
      <div className="p-8">
        <p>Scroll down to see the sticky header in action</p>
      </div>
    </div>
  ),
};

// Complex example with search and notifications
export const ComplexHeader = {
  render: () => (
    <Header size="lg">
      <HeaderLeft>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
          <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
          <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
        </svg>
        <span className="text-xl font-bold">Dashboard</span>
      </HeaderLeft>
      <HeaderCenter>
        <div className="relative w-full max-w-lg">
          <input
            type="search"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>
      </HeaderCenter>
      <HeaderRight>
        <Button variant="ghost" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
          </svg>
        </Button>
        <Button variant="ghost" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
            <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
          </svg>
        </Button>
        <div className="w-px h-6 bg-gray-200" />
        <Button variant="ghost" size="sm">John Doe</Button>
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center font-medium">JD</div>
      </HeaderRight>
    </Header>
  ),
};

// Modern Dashboard Header
export const ModernDashboard = {
  render: () => (
    <Header variant="glass" elevated size="lg">
      <HeaderLeft>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white grid place-items-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">Welcome back, Admin</p>
        </div>
      </HeaderLeft>
      <HeaderCenter>
        <div className="relative w-full max-w-lg">
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full h-11 pl-11 pr-4 text-gray-900 placeholder-gray-500 bg-gray-100/50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-3">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>
      </HeaderCenter>
      <HeaderRight>
        <Button variant="ghost" size="icon" className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
          </svg>
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[11px] font-medium text-white rounded-full grid place-items-center">
            3
          </span>
        </Button>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="font-medium">John Doe</span>
            <span className="text-sm text-gray-500">Admin</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white grid place-items-center font-medium shadow-lg">
            JD
          </div>
        </div>
      </HeaderRight>
    </Header>
  ),
};
