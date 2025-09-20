import React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Modern Inputs",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Modern Input Components

Showcase of the enhanced input components with floating labels, micro-interactions, and glassmorphism effects.

## ✨ New Features

- **Floating Labels**: Smooth animations when focusing on inputs
- **Micro-interactions**: Hover effects and smooth transitions
- **Enhanced States**: Better visual feedback for focus, error, and success states
- **Auto-resize**: Intelligent textarea resizing
- **Character Count**: Visual feedback for text limits
- **Improved Glassmorphism**: Better contrast and visual depth
- **Accessibility**: Full keyboard navigation and screen reader support

## 🎨 Design Principles

- **WCAG AAA Compliance**: Maximum accessibility and contrast
- **Smooth Animations**: 200ms transitions with custom easing
- **Consistent Spacing**: Harmonious rhythm throughout
- **Modern Aesthetics**: 2024-2025 design trends implementation
        `,
      },
    },
  },
}

export default meta

export const FloatingLabels = {
  render: () => (
    <div className="w-[500px] p-8 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Floating Label Inputs</h3>
        <div className="space-y-6">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            floatingLabel
          />
          <Input
            type="email"
            label="Email Address"
            placeholder="your.email@example.com"
            floatingLabel
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter a secure password"
            floatingLabel
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Floating Labels Demo

Modern input fields with smooth floating label animations. Labels move up gracefully when the field is focused or contains text.

**Features:**
- Smooth CSS animations with custom easing
- Smart label positioning
- Enhanced focus states with glowing rings
- Placeholder text appears only when floating
        `,
      },
    },
  },
}

export const InputStates = {
  render: () => (
    <div className="w-[500px] p-8 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Input States</h3>
        <div className="space-y-6">
          <Input
            label="Normal State"
            placeholder="This is a normal input"
            floatingLabel
          />
          <Input
            label="Error State"
            placeholder="This input has an error"
            error="This field is required"
            floatingLabel
          />
          <Input
            label="Success State"
            placeholder="This input is valid"
            success="Perfect! This looks good"
            floatingLabel
            defaultValue="Valid input text"
          />
          <Input
            label="Disabled State"
            placeholder="This input is disabled"
            disabled
            floatingLabel
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Input States Showcase

Demonstration of different input states with appropriate visual feedback and animations.

**States Include:**
- **Normal**: Default state with subtle styling
- **Error**: Red accent with shake animation
- **Success**: Green accent with pulse animation
- **Disabled**: Muted appearance with no interactions
        `,
      },
    },
  },
}

export const TextareaFeatures = {
  render: () => (
    <div className="w-[500px] p-8 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Enhanced Textarea</h3>
        <div className="space-y-6">
          <Textarea
            label="Basic Textarea"
            placeholder="Enter your message here..."
            floatingLabel
          />
          <Textarea
            label="Auto-resize Textarea"
            placeholder="This textarea grows as you type..."
            floatingLabel
            autoResize
            maxRows={8}
          />
          <Textarea
            label="Character Limited"
            placeholder="Maximum 200 characters..."
            floatingLabel
            maxLength={200}
            autoResize
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Enhanced Textarea Features

Modern textarea component with intelligent features and smooth interactions.

**Features:**
- **Floating Labels**: Same smooth animations as inputs
- **Auto-resize**: Grows with content up to maximum rows
- **Character Count**: Visual feedback with color-coded limits
- **Smart Positioning**: Labels position appropriately for multiline content
        `,
      },
    },
  },
}

export const SelectEnhancements = {
  render: () => (
    <div className="w-[500px] p-8 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Enhanced Select</h3>
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-semibold mb-2 block">Country</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="de">🇩🇪 Germany</SelectItem>
                <SelectItem value="fr">🇫🇷 France</SelectItem>
                <SelectItem value="es">🇪🇸 Spain</SelectItem>
                <SelectItem value="it">🇮🇹 Italy</SelectItem>
                <SelectItem value="jp">🇯🇵 Japan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Error State</Label>
            <Select>
              <SelectTrigger error>
                <SelectValue placeholder="This select has an error" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Success State</Label>
            <Select>
              <SelectTrigger success>
                <SelectValue placeholder="This select is valid" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Enhanced Select Component

Improved select dropdown with better glassmorphism, micro-interactions, and visual states.

**Improvements:**
- **Enhanced Glassmorphism**: Better backdrop blur and transparency
- **Micro-interactions**: Hover effects and smooth animations
- **Better Dropdown**: Improved styling and animations
- **Visual States**: Error and success states with appropriate styling
- **Icon Animations**: Chevron rotates and scales on interaction
        `,
      },
    },
  },
}

export const GlassmorphismDemo = {
  render: () => (
    <div
      className="w-[600px] p-8 space-y-8 relative overflow-hidden rounded-xl"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '500px'
      }}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-300 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-6 text-white">Glassmorphism Effects</h3>
        <div className="space-y-6">
          <Input
            label="Name"
            placeholder="Enter your name"
            floatingLabel
            glass
          />
          <Input
            type="email"
            label="Email"
            placeholder="your.email@example.com"
            floatingLabel
            glass
          />
          <div>
            <Label className="text-sm font-semibold mb-2 block text-white/90">Role</Label>
            <Select>
              <SelectTrigger glass>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">👨‍💻 Developer</SelectItem>
                <SelectItem value="designer">🎨 Designer</SelectItem>
                <SelectItem value="manager">👔 Manager</SelectItem>
                <SelectItem value="other">🌟 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            floatingLabel
            glass
            autoResize
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Glassmorphism in Action

Showcase of the enhanced glassmorphism effects against a colorful background to demonstrate transparency and blur effects.

**Glassmorphism Features:**
- **Enhanced Backdrop Blur**: Stronger blur effects for better depth
- **Smart Transparency**: Maintains readability while showing background
- **Context Awareness**: Adapts opacity based on background contrast
- **Multi-layer Effects**: Subtle gradients and shadow combinations
        `,
      },
    },
  },
}

export const ResponsiveDemo = {
  render: () => (
    <div className="w-full max-w-4xl p-8">
      <h3 className="text-lg font-semibold mb-6">Responsive Layout</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Input
          label="First Name"
          placeholder="Enter first name"
          floatingLabel
        />
        <Input
          label="Last Name"
          placeholder="Enter last name"
          floatingLabel
        />
        <Input
          type="email"
          label="Email"
          placeholder="your.email@domain.com"
          floatingLabel
        />
        <Input
          type="tel"
          label="Phone"
          placeholder="+1 (555) 123-4567"
          floatingLabel
        />
        <div>
          <Label className="text-sm font-semibold mb-2 block">Country</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-semibold mb-2 block">Role</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dev">Developer</SelectItem>
              <SelectItem value="des">Designer</SelectItem>
              <SelectItem value="mgr">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6">
        <Textarea
          label="Additional Notes"
          placeholder="Any additional information..."
          floatingLabel
          autoResize
          maxLength={300}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Responsive Grid Layout

Demonstration of how the enhanced components work in responsive grid layouts across different screen sizes.

**Responsive Features:**
- **Mobile-first Design**: Touch-friendly targets and spacing
- **Flexible Grid**: Adapts from 1 to 3 columns based on screen size
- **Consistent Spacing**: Maintains visual rhythm across breakpoints
- **Touch Optimization**: Larger interactive areas for mobile devices
        `,
      },
    },
  },
}