/**
 * Automation Help Configuration
 *
 * Contextual help content following Infinibay's UX philosophy:
 * - Automatic Transmission: Hide complexity, guide through workflows
 * - Friendly Terminology: Explain technical terms without being condescending
 */

import { Blocks, Zap, Play, ShieldCheck, Settings, AlertCircle, Sparkles, Plus } from 'lucide-react';

export const automationListHelp = {
  title: 'Automations Help',
  description: 'Create visual rules to monitor your VMs automatically',
  icon: <Blocks className="h-5 w-5 text-primary" />,
  sections: [
    {
      id: 'what-are',
      title: 'What are Automations?',
      icon: <Zap className="h-4 w-4" />,
      content: (
        <div className="space-y-2">
          <p>
            Automations are <strong>visual rules</strong> that monitor your VMs and take action
            when certain conditions are met.
          </p>
          <p className="text-sm">
            Think of them like email filters: &ldquo;When [condition], then [action]&rdquo;.
          </p>
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Example:</p>
            <p className="text-sm text-muted-foreground">
              &ldquo;When CPU usage is above 90% for more than 5 minutes, show a recommendation
              to add more resources.&rdquo;
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'workflow',
      title: 'Automation Workflow',
      icon: <ShieldCheck className="h-4 w-4" />,
      content: (
        <div className="space-y-2">
          <p>Automations go through a review process:</p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li><strong>Draft</strong> - You&apos;re building and testing</li>
            <li><strong>Pending Approval</strong> - Waiting for admin review</li>
            <li><strong>Approved</strong> - Ready to be turned on</li>
            <li><strong>Enabled</strong> - Actively monitoring your VMs</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-2">
            This ensures automations are reviewed before they can affect your systems.
          </p>
        </div>
      ),
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Play className="h-4 w-4" />,
      content: (
        <div className="space-y-2">
          <p>The easiest way to start is with a template:</p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Click &ldquo;New Automation&rdquo;</li>
            <li>Choose &ldquo;Start from Template&rdquo;</li>
            <li>Pick one that matches your need</li>
            <li>Customize if needed</li>
            <li>Test and submit for approval</li>
          </ol>
        </div>
      ),
    },
  ],
  quickTips: [
    'Templates are the fastest way to get started',
    'Always test your automation before submitting',
    'Set a cooldown to avoid repeated notifications',
    'You can duplicate and modify existing automations',
  ],
};

export const automationEditorHelp = {
  title: 'Visual Editor Help',
  description: 'Build automation logic by connecting blocks',
  icon: <Blocks className="h-5 w-5 text-primary" />,
  sections: [
    {
      id: 'using-blocks',
      title: 'Using Blocks',
      icon: <Blocks className="h-4 w-4" />,
      content: (
        <div className="space-y-2">
          <p>
            The visual editor uses <strong>blocks</strong> that snap together
            like puzzle pieces.
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Drag blocks from the left panel</li>
            <li>Drop them in the workspace</li>
            <li>Connect them together</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Blocks only connect if they&apos;re compatible - you can&apos;t accidentally
            create invalid logic.
          </p>
        </div>
      ),
    },
    {
      id: 'block-categories',
      title: 'Block Categories',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-3">
          <div>
            <p className="font-medium text-emerald-600">Health Data</p>
            <p className="text-sm">Read information from your VM: CPU, memory, disk, etc.</p>
          </div>
          <div>
            <p className="font-medium text-blue-600">Logic</p>
            <p className="text-sm">Make decisions: if/else, and, or, not</p>
          </div>
          <div>
            <p className="font-medium text-indigo-600">Compare</p>
            <p className="text-sm">Compare values: greater than, less than, between</p>
          </div>
          <div>
            <p className="font-medium text-violet-600">Loops</p>
            <p className="text-sm">Repeat actions: for each, while, repeat</p>
          </div>
          <div>
            <p className="font-medium text-cyan-600">Math</p>
            <p className="text-sm">Calculations: sum, average, min, max</p>
          </div>
          <div>
            <p className="font-medium text-red-600">Actions</p>
            <p className="text-sm">What happens: trigger the automation or skip</p>
          </div>
        </div>
      ),
    },
    {
      id: 'testing',
      title: 'Testing Your Logic',
      icon: <Play className="h-4 w-4" />,
      content: (
        <div className="space-y-2">
          <p>Before submitting, test your automation:</p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Go to the &ldquo;Test&rdquo; tab</li>
            <li>Select a VM to test against</li>
            <li>Click &ldquo;Run Test&rdquo;</li>
            <li>See if it would trigger or not</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-2">
            Testing doesn&apos;t actually execute scripts - it just checks if the
            condition would be met.
          </p>
        </div>
      ),
    },
    {
      id: 'common-mistakes',
      title: 'Common Mistakes',
      icon: <AlertCircle className="h-4 w-4" />,
      content: (
        <div className="space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>No trigger block</strong> - Your automation needs to end with a
              &ldquo;Trigger&rdquo; or &ldquo;Skip&rdquo; block
            </li>
            <li>
              <strong>Condition always true</strong> - Check your comparison values
            </li>
            <li>
              <strong>Too sensitive</strong> - Set appropriate thresholds to avoid spam
            </li>
            <li>
              <strong>No cooldown</strong> - Without cooldown, it may trigger every minute
            </li>
          </ul>
        </div>
      ),
    },
  ],
  quickTips: [
    'The preview panel shows what your automation does in plain English',
    'Right-click a block for options like duplicate or delete',
    'Use Ctrl+Z to undo, Ctrl+Y to redo',
    'Zoom with the mouse wheel or controls in the corner',
  ],
};

export const templateGalleryHelp = {
  title: 'Template Gallery',
  description: 'Pre-built automations to get you started quickly',
  icon: <Sparkles className="h-5 w-5 text-primary" />,
  sections: [
    {
      id: 'what-are-templates',
      title: 'What are Templates?',
      icon: <Sparkles className="h-4 w-4" />,
      content: (
        <div className="space-y-2">
          <p>
            Templates are <strong>pre-built automations</strong> designed for common
            monitoring scenarios.
          </p>
          <p className="text-sm text-muted-foreground">
            They save you time by providing a ready-made starting point that you
            can customize to your specific needs.
          </p>
        </div>
      ),
    },
    {
      id: 'categories',
      title: 'Template Categories',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Performance</strong> - Monitor CPU, memory, and resources</li>
            <li><strong>Storage</strong> - Track disk space and usage</li>
            <li><strong>Security</strong> - Check Windows Defender and threats</li>
            <li><strong>Updates</strong> - Monitor Windows and app updates</li>
            <li><strong>Applications</strong> - Track app behavior and issues</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'how-to-use',
      title: 'How to Use a Template',
      icon: <Plus className="h-4 w-4" />,
      content: (
        <div className="space-y-2">
          <ol className="list-decimal list-inside space-y-1">
            <li>Browse templates by category</li>
            <li>Click on a template to preview it</li>
            <li>Click &ldquo;Use Template&rdquo; to create a new automation</li>
            <li>Customize the settings if needed</li>
            <li>Test and submit for approval</li>
          </ol>
        </div>
      ),
    },
  ],
  quickTips: [
    'Templates are a great way to learn how automations work',
    'You can always customize a template after creating it',
    'Check the description to understand what each template does',
    'Popular templates have been proven to work well',
  ],
};
