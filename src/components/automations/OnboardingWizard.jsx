'use client';

/**
 * Onboarding Wizard Component
 *
 * A step-by-step wizard to help users create their first automation.
 * Following Infinibay's UX philosophy of guiding users through workflows.
 */

import { useState, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetAutomationTemplatesQuery, useCreateAutomationFromTemplateMutation } from '@/gql/hooks';
import {
  Blocks,
  Cpu,
  HardDrive,
  Shield,
  RefreshCw,
  AppWindow,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORY_CONFIG = [
  { id: 'Performance', icon: Cpu, label: 'Performance', desc: 'CPU, memory usage' },
  { id: 'Storage', icon: HardDrive, label: 'Storage', desc: 'Disk space' },
  { id: 'Security', icon: Shield, label: 'Security', desc: 'Windows Defender' },
  { id: 'Updates', icon: RefreshCw, label: 'Updates', desc: 'Windows updates' },
  { id: 'Applications', icon: AppWindow, label: 'Applications', desc: 'App monitoring' },
];

function WelcomeStep() {
  return (
    <div className="text-center py-8">
      <Blocks className="h-16 w-16 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Create Your First Automation</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Automations help you monitor your VMs automatically. Let&apos;s create one together!
      </p>
    </div>
  );
}

function CategoryStep({ selection, setSelection }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      {CATEGORY_CONFIG.map((opt) => (
        <Card
          key={opt.id}
          className={`cursor-pointer transition-all ${
            selection === opt.id
              ? 'border-primary ring-2 ring-primary/20'
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelection(opt.id)}
        >
          <CardContent className="p-4 text-center">
            <opt.icon
              className={`h-8 w-8 mx-auto mb-2 ${
                selection === opt.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <p className="font-medium">{opt.label}</p>
            <p className="text-xs text-muted-foreground">{opt.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TemplateStep({ category, selection, setSelection, templates }) {
  const filtered = useMemo(
    () => templates.filter((t) => t.category === category),
    [templates, category]
  );

  return (
    <div className="space-y-3 py-4 max-h-64 overflow-auto">
      {filtered.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all ${
            selection === template.id
              ? 'border-primary ring-2 ring-primary/20'
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelection(template.id)}
        >
          <CardContent className="p-3 flex items-center gap-3">
            <div
              className={`p-1.5 rounded ${
                selection === template.id ? 'bg-primary/10' : 'bg-muted'
              }`}
            >
              <Check
                className={`h-4 w-4 ${
                  selection === template.id ? 'text-primary' : 'text-transparent'
                }`}
              />
            </div>
            <div>
              <p className="font-medium">{template.name}</p>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          No templates available for this category.
        </p>
      )}
    </div>
  );
}

function DoneStep() {
  return (
    <div className="text-center py-8">
      <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
        <Check className="h-8 w-8 text-green-500" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Automation Created</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Your automation is ready! You can now customize it in the visual editor, test it, and
        submit for approval.
      </p>
    </div>
  );
}

const STEPS = [
  { id: 'welcome', title: 'Welcome to Automations' },
  { id: 'category', title: 'What do you want to monitor?' },
  { id: 'template', title: 'Choose a starting point' },
  { id: 'done', title: "You're all set!" },
];

export function OnboardingWizard({ open, onOpenChange, onComplete }) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [createdAutomation, setCreatedAutomation] = useState(null);

  const { data, loading: templatesLoading } = useGetAutomationTemplatesQuery();
  const [createFromTemplate, { loading: creating }] = useCreateAutomationFromTemplateMutation({
    onError: (error) => {
      toast.error('Failed to create automation', {
        description: error.message,
      });
    },
  });

  const templates = data?.automationTemplates ?? [];
  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const canContinue =
    step === 0 ||
    step === 3 ||
    (step === 1 && category) ||
    (step === 2 && templateId);

  const handleNext = async () => {
    if (step === 2 && templateId) {
      // Create automation from template
      try {
        const result = await createFromTemplate({
          variables: { templateId },
        });

        if (result.data?.createAutomationFromTemplate) {
          setCreatedAutomation(result.data.createAutomationFromTemplate);
          toast.success('Automation created!');
          setStep((s) => s + 1);
        }
      } catch (error) {
        // Error handled by onError callback
      }
    } else if (step === STEPS.length - 1) {
      onComplete?.(createdAutomation);
      onOpenChange(false);
      // Reset state
      setStep(0);
      setCategory(null);
      setTemplateId(null);
      setCreatedAutomation(null);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    if (step === 2) {
      setTemplateId(null);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <CategoryStep selection={category} setSelection={setCategory} />;
      case 2:
        return (
          <TemplateStep
            category={category}
            selection={templateId}
            setSelection={setTemplateId}
            templates={templates}
          />
        );
      case 3:
        return <DoneStep />;
      default:
        return null;
    }
  };

  const isLoading = templatesLoading || creating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <div className="space-y-4">
          <Progress value={progress} className="h-1" />

          <div className="min-h-[300px]">
            <h2 className="text-lg font-semibold text-center mb-4">{currentStep.title}</h2>
            {isLoading && step !== 3 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              renderStepContent()
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            {step > 0 && step < 3 ? (
              <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button onClick={handleNext} disabled={!canContinue || isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {step === STEPS.length - 1 ? 'Get Started' : 'Continue'}
              {step < STEPS.length - 1 && !isLoading && (
                <ChevronRight className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingWizard;
