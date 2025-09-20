import React from "react"
import { Wizard, WizardStep, useWizardContext } from "@/components/ui/wizard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFormError } from "@/components/ui/form-error-provider"

const meta = {
  title: "Components/Wizard",
  component: Wizard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Modern Wizard Component

A beautifully designed, flexible multi-step form wizard with glassmorphism effects, smooth animations, and comprehensive validation support.

## ✨ Design Features
- **Modern Glassmorphism**: Elegant backdrop blur effects and transparency
- **Icon-based Progress**: Visual step indicators with completion states
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Enhanced Typography**: Improved visual hierarchy and spacing
- **Dark Theme Support**: Optimized for both light and dark themes

## 🚀 Core Features
- Multi-step form navigation with modern UI
- Step-by-step validation with visual feedback
- Comprehensive error handling and display
- Advanced form value management
- Animated progress indicators
- Customizable completion callbacks

## Basic Usage

\`\`\`jsx
import { Wizard, WizardStep } from "@/components/ui/wizard"

export function MyWizard() {
  return (
    <div className="w-[800px] p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Setup Wizard</h1>
        <p className="text-muted-foreground">Complete your setup in a few simple steps</p>
      </div>
      <Wizard onComplete={(values) => console.log(values)}>
        <WizardStep id="personal">
          {/* Personal information step */}
        </WizardStep>
        <WizardStep id="contact">
          {/* Contact details step */}
        </WizardStep>
        <WizardStep id="preferences">
          {/* Preferences step */}
        </WizardStep>
      </Wizard>
    </div>
  )
}
\`\`\`

## Step Validation

Each step can have its own validation function:

\`\`\`jsx
const validateStep = (values) => {
  const errors = {}
  if (!values.name) {
    errors.name = "Name is required"
  }
  if (Object.keys(errors).length) {
    throw errors
  }
}

<WizardStep id="step1" validate={validateStep}>
  {/* Step content */}
</WizardStep>
\`\`\`

## Using Form Values

Use the \`useWizardContext\` hook to access and update form values:

\`\`\`jsx
function MyStep() {
  const { values, setValue } = useWizardContext()
  return (
    <Input
      value={values.step1?.name}
      onChange={(e) => setValue('step1.name', e.target.value)}
    />
  )
}
\`\`\`

## Error Handling

Use the \`useFormError\` hook to handle validation errors:

\`\`\`jsx
function MyStep() {
  const { getError } = useFormError()
  return (
    <div>
      <Input name="field" />
      {getError('field') && (
        <p className="text-destructive">{getError('field')}</p>
      )}
    </div>
  )
}
\`\`\`
        `,
      },
    },
  },
}

export default meta

// Simple validation example
const validatePersonalInfo = (values) => {
  console.log('Validating personal info:', values)
  const errors = {}
  if (!values.firstName) {
    errors.firstName = "First name is required"
  }
  if (!values.lastName) {
    errors.lastName = "Last name is required"
  }
  if (Object.keys(errors).length) {
    console.log('Personal info validation errors:', errors)
    throw errors
  }
  console.log('Personal info validation passed')
}

const validateContactInfo = (values) => {
  console.log('Validating contact info:', values)
  const errors = {}
  if (!values.email) {
    errors.email = "Email is required"
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }
  if (!values.phone) {
    errors.phone = "Phone number is required"
  }
  if (Object.keys(errors).length) {
    console.log('Contact info validation errors:', errors)
    throw errors
  }
  console.log('Contact info validation passed')
}

export const SimpleWizard = {
  render: () => (
    <div className="w-[800px] p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Account Setup</h1>
        <p className="text-muted-foreground">Let's get you started with a few quick steps</p>
      </div>
      <Wizard
        onComplete={(values) => {
          console.log("Wizard completed with values:", values)
          alert("Setup completed successfully! Check console for details.")
        }}
      >
        <WizardStep id="personal" validate={validatePersonalInfo}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  name="firstName"
                  label="First Name *"
                  placeholder="Enter your first name"
                  floatingLabel
                />
              </div>
              <div className="space-y-1">
                <Input
                  name="lastName"
                  label="Last Name *"
                  placeholder="Enter your last name"
                  floatingLabel
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>This information will be used to personalize your experience.</p>
            </div>
          </div>
        </WizardStep>
        <WizardStep id="contact" validate={validateContactInfo}>
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <Input
                  name="email"
                  type="email"
                  label="Email Address *"
                  placeholder="your.email@example.com"
                  floatingLabel
                />
              </div>
              <div className="space-y-1">
                <Input
                  name="phone"
                  type="tel"
                  label="Phone Number *"
                  placeholder="+1 (555) 123-4567"
                  floatingLabel
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>We'll use this information to send you important updates and notifications.</p>
            </div>
          </div>
        </WizardStep>
        <WizardStep id="preferences">
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="theme" className="text-sm font-semibold mb-2 block">Theme Preference</Label>
                <Select name="theme">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your preferred theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">🌞 Light Theme</SelectItem>
                    <SelectItem value="dark">🌙 Dark Theme</SelectItem>
                    <SelectItem value="system">⚙️ System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Textarea
                  name="bio"
                  label="About You (Optional)"
                  placeholder="Tell us a bit about yourself and your interests..."
                  floatingLabel
                  autoResize
                  maxLength={500}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>These preferences can be changed later in your account settings.</p>
            </div>
          </div>
        </WizardStep>
      </Wizard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Modern Simple Wizard

A beautifully designed three-step account setup wizard featuring:

**Design Features:**
- Modern glassmorphism effects with enhanced visual hierarchy
- Icon-based progress indicators with smooth animations
- Improved spacing and typography
- Enhanced button styling with hover effects
- Step descriptions and contextual help text

**Functionality:**
1. **Personal Info** - Collect basic user information with validation
2. **Contact Details** - Gather communication preferences
3. **Preferences** - Customize user experience settings

Each step includes comprehensive validation and helpful user guidance.
        `,
      },
    },
  },
}

// Complex validation example
const validateProjectInfo = async (values) => {
  console.log('Validating project info:', values)
  const errors = {}
  
  if (!values.projectName?.trim()) {
    errors.projectName = "Project name is required"
  } else if (values.projectName.length < 3) {
    errors.projectName = "Project name must be at least 3 characters"
  } else if (values.projectName.toLowerCase() === "test") {
    // Simulate async validation
    await new Promise(resolve => setTimeout(resolve, 500))
    errors.projectName = "This project name is already taken"
  }

  if (!values.description?.trim()) {
    errors.description = "Project description is required"
  }

  if (Object.keys(errors).length) {
    console.log('Project info validation errors:', errors)
    throw errors
  }
  console.log('Project info validation passed')
}

const validateTeamInfo = (values) => {
  console.log('Validating team info:', values)
  const errors = {}
  
  if (!values.teamSize) {
    errors.teamSize = "Team size is required"
  }
  
  if (!values.methodology) {
    errors.methodology = "Development methodology is required"
  }

  if (Object.keys(errors).length) {
    console.log('Team info validation errors:', errors)
    throw errors
  }
  console.log('Team info validation passed')
}

const validateSettings = (values) => {
  console.log('Validating settings:', values)
  const errors = {}
  
  if (!values.privacy) {
    errors.privacy = "Privacy setting is required"
  }

  if (Object.keys(errors).length) {
    console.log('Settings validation errors:', errors)
    throw errors
  }
  console.log('Settings validation passed')
}

const RequiredLabel = ({ children }) => (
  <div className="flex items-center gap-1">
    {children}
    <span className="text-destructive">*</span>
  </div>
)

const ProjectStep = () => {
  const { getError } = useFormError()
  const { values, setValue } = useWizardContext()
  const projectValues = values.project || {}
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <RequiredLabel>
          <Label htmlFor="projectName">Project Name</Label>
        </RequiredLabel>
        <Input 
          name="projectName" 
          placeholder="My Awesome Project"
          required
          value={projectValues.projectName}
          onChange={(e) => setValue('project.projectName', e.target.value)}
          description="Must be at least 3 characters long"
        />
        {getError('projectName') && (
          <p className="text-sm text-destructive">{getError('projectName')}</p>
        )}
      </div>
      <div className="space-y-2">
        <RequiredLabel>
          <Label htmlFor="description">Description</Label>
        </RequiredLabel>
        <Textarea 
          name="description" 
          placeholder="Describe your project..."
          required
          value={projectValues.description}
          onChange={(e) => setValue('project.description', e.target.value)}
        />
        {getError('description') && (
          <p className="text-sm text-destructive">{getError('description')}</p>
        )}
      </div>
    </div>
  )
}

const TeamStep = () => {
  const { getError } = useFormError()
  const { values, setValue } = useWizardContext()
  const teamValues = values.team || {}
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <RequiredLabel>
          <Label htmlFor="teamSize">Team Size</Label>
        </RequiredLabel>
        <Select
          name="teamSize"
          value={teamValues.teamSize}
          onValueChange={(value) => setValue('team.teamSize', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your team size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">👥 Small Team (1-5 people)</SelectItem>
            <SelectItem value="medium">🏢 Medium Team (6-10 people)</SelectItem>
            <SelectItem value="large">🏭 Large Team (11+ people)</SelectItem>
          </SelectContent>
        </Select>
        {getError('teamSize') && (
          <p className="text-sm text-destructive">{getError('teamSize')}</p>
        )}
      </div>
      <div className="space-y-2">
        <RequiredLabel>
          <Label htmlFor="methodology">Development Methodology</Label>
        </RequiredLabel>
        <Select
          name="methodology"
          value={teamValues.methodology}
          onValueChange={(value) => setValue('team.methodology', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose development methodology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agile">🔄 Agile Development</SelectItem>
            <SelectItem value="waterfall">📊 Waterfall Methodology</SelectItem>
            <SelectItem value="kanban">📋 Kanban Workflow</SelectItem>
            <SelectItem value="scrum">⚡ Scrum Framework</SelectItem>
          </SelectContent>
        </Select>
        {getError('methodology') && (
          <p className="text-sm text-destructive">{getError('methodology')}</p>
        )}
      </div>
    </div>
  )
}

const SettingsStep = () => {
  const { getError } = useFormError()
  const { values, setValue } = useWizardContext()
  const settingsValues = values.settings || {}
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <RequiredLabel>
          <Label htmlFor="privacy">Project Privacy</Label>
        </RequiredLabel>
        <Select
          name="privacy"
          value={settingsValues.privacy}
          onValueChange={(value) => setValue('settings.privacy', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose privacy level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">🌍 Public Access</SelectItem>
            <SelectItem value="private">🔒 Private Project</SelectItem>
            <SelectItem value="team">👥 Team Members Only</SelectItem>
            <SelectItem value="restricted">🔐 Restricted Access</SelectItem>
          </SelectContent>
        </Select>
        {getError('privacy') && (
          <p className="text-sm text-destructive">{getError('privacy')}</p>
        )}
      </div>
    </div>
  )
}

export const ComplexWizard = {
  render: () => {
    const [completedValues, setCompletedValues] = React.useState(null)

    const handleComplete = (values) => {
      setCompletedValues(values)
    }

    return (
      <div className="w-[900px] p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Project Setup Wizard</h1>
          <p className="text-muted-foreground">Create and configure your new project in just a few steps</p>
        </div>
        <Wizard
          onComplete={handleComplete}
          initialValues={{
            project: {
              projectName: '',
              description: ''
            },
            team: {
              teamSize: '',
              methodology: ''
            },
            settings: {
              privacy: ''
            }
          }}
        >
          <WizardStep id="project" validate={validateProjectInfo}>
            <ProjectStep />
          </WizardStep>
          <WizardStep id="team" validate={validateTeamInfo}>
            <TeamStep />
          </WizardStep>
          <WizardStep id="settings" validate={validateSettings}>
            <SettingsStep />
          </WizardStep>
        </Wizard>

        <Dialog open={!!completedValues} onOpenChange={() => setCompletedValues(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Project Created Successfully!</DialogTitle>
              <DialogDescription>
                Here's a summary of your project setup:
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-4">
                <div>
                  <h3 className="font-medium">Project Information</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {completedValues?.project?.projectName}</p>
                    <p><span className="text-muted-foreground">Description:</span> {completedValues?.project?.description}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Team Setup</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="text-muted-foreground">Team Size:</span> {completedValues?.team?.teamSize}</p>
                    <p><span className="text-muted-foreground">Methodology:</span> {completedValues?.team?.methodology}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Settings</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="text-muted-foreground">Privacy:</span> {completedValues?.settings?.privacy}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
### Advanced Project Setup Wizard

A sophisticated multi-step project creation wizard showcasing:

**Enhanced Design Elements:**
- Professional glassmorphism styling with backdrop blur effects
- Animated progress indicators with completion states
- Modern card layouts with improved visual hierarchy
- Smooth transitions and micro-interactions
- Enhanced button styling with loading states

**Advanced Features:**
1. **Project Details** - Async validation with uniqueness checking
2. **Team Configuration** - Dropdown selections with team methodology
3. **Privacy Settings** - Final configuration with completion summary

**Technical Highlights:**
- Asynchronous validation with loading states
- Form state management across multiple steps
- Error handling with contextual messaging
- Completion dialog with formatted results
- Required field validation with visual indicators
        `,
      },
    },
  },
}
