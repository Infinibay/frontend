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
# Wizard Component

A flexible multi-step form wizard component that supports validation, error handling, and a completion hook.

## Features
- Multi-step form navigation
- Step-by-step validation
- Error handling and display
- Form value management
- Progress indicator
- Completion callback

## Basic Usage

\`\`\`jsx
import { Wizard, WizardStep } from "@/components/ui/wizard"

export function MyWizard() {
  return (
    <Wizard onComplete={(values) => console.log(values)}>
      <WizardStep id="step1">
        {/* Step 1 content */}
      </WizardStep>
      <WizardStep id="step2">
        {/* Step 2 content */}
      </WizardStep>
    </Wizard>
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
    <div className="w-[600px]">
      <Wizard
        onComplete={(values) => console.log("Wizard completed with values:", values)}
      >
        <WizardStep id="personal" validate={validatePersonalInfo}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input name="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input name="lastName" placeholder="Doe" />
            </div>
          </div>
        </WizardStep>
        <WizardStep id="contact" validate={validateContactInfo}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
        </WizardStep>
        <WizardStep id="preferences">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme Preference</Label>
              <Select name="theme">
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea name="bio" placeholder="Tell us about yourself..." />
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
### Simple Wizard

A basic three-step wizard with validation:
1. Personal information (first name, last name)
2. Contact information (email, phone)
3. Preferences (theme, bio)

Each step has validation to ensure required fields are filled.
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
            <SelectValue placeholder="Select team size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">1-5</SelectItem>
            <SelectItem value="medium">6-10</SelectItem>
            <SelectItem value="large">11+</SelectItem>
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
            <SelectValue placeholder="Select methodology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agile">Agile</SelectItem>
            <SelectItem value="waterfall">Waterfall</SelectItem>
            <SelectItem value="kanban">Kanban</SelectItem>
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
            <SelectValue placeholder="Select privacy setting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="team">Team Only</SelectItem>
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
      <div className="w-[600px]">
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
### Complex Wizard

A more complex three-step wizard that demonstrates:
1. Project information with async validation
2. Team settings with select inputs
3. Project settings with a completion dialog

Features demonstrated:
- Async validation (project name uniqueness check)
- Different input types (text, textarea, select)
- Completion dialog with collected values
- Required field indicators
- Error message display
        `,
      },
    },
  },
}
