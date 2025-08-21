import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CreateMachineWizard from '@/components/CreateMachine/CreateMachineWizard';
import { BasicInfoStep } from '@/components/CreateMachine/steps/BasicInfoStep';
import { ConfigurationStep } from '@/components/CreateMachine/steps/ConfigurationStep';
import { ResourcesStep } from '@/components/CreateMachine/steps/ResourcesStep';
import { ApplicationsStep } from '@/components/CreateMachine/steps/ApplicationsStep';
import { ReviewStep } from '@/components/CreateMachine/steps/ReviewStep';
import { GpuSelectionStep } from '@/components/CreateMachine/steps/GpuSelectionStep';
import { WizardStepAnimation, LottieAnimation } from '@/components/ui/lottie-animation';
import vmsReducer from '@/state/slices/vms';
import departmentsReducer from '@/state/slices/departments';
import templatesReducer from '@/state/slices/templates';
import templateCategoriesReducer from '@/state/slices/templateCategories';
import applicationsReducer from '@/state/slices/applications';
import systemReducer from '@/state/slices/system';

// Create a mock store for Storybook
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      vms: vmsReducer,
      departments: departmentsReducer,
      templates: templatesReducer,
      templateCategories: templateCategoriesReducer,
      applications: applicationsReducer,
      system: systemReducer,
    },
    preloadedState: {
      departments: {
        items: [
          { id: '1', name: 'Engineering' },
          { id: '2', name: 'Marketing' },
          { id: '3', name: 'Sales' },
        ],
        loading: { fetch: false },
        error: { fetch: null },
      },
      templates: {
        items: [
          { id: '1', name: 'Basic', cores: 2, ram: 4, storage: 50, categoryId: 'general' },
          { id: '2', name: 'Standard', cores: 4, ram: 8, storage: 100, categoryId: 'general' },
          { id: '3', name: 'Professional', cores: 8, ram: 16, storage: 200, categoryId: 'performance' },
        ],
        loading: { fetch: false },
        error: { fetch: null },
      },
      templateCategories: {
        items: [
          { id: 'general', name: 'General Purpose' },
          { id: 'performance', name: 'High Performance' },
        ],
        loading: { fetch: false },
        error: { fetch: null },
      },
      applications: {
        items: [
          { id: '1', name: 'VS Code', description: 'Code editor', icon: 'vscode' },
          { id: '2', name: 'Chrome', description: 'Web browser', icon: 'chrome' },
          { id: '3', name: 'Docker', description: 'Container platform', icon: 'docker' },
        ],
        loading: { fetch: false },
        error: { fetch: null },
      },
      system: {
        graphics: [
          { pciBus: '0000:01:00.0', vendor: 'NVIDIA', model: 'RTX 3080', memory: 10 },
          { pciBus: '0000:02:00.0', vendor: 'AMD', model: 'RX 6800', memory: 16 },
        ],
        loading: false,
        error: null,
      },
      vms: {
        items: [],
        loading: { fetch: false, create: false },
        error: { fetch: null, create: null },
      },
      ...initialState,
    },
  });
};

export default {
  title: 'Infinibay/Wizard with Animations',
  component: CreateMachineWizard,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore()}>
        <div className="min-h-screen bg-background p-8">
          <Story />
        </div>
      </Provider>
    ),
  ],
};

// Story showcasing all animations
export const AnimationShowcase = () => {
  const animations = [
    { path: '/lottie/signin-security.json', name: 'Security (Basic Info Step)' },
    { path: '/lottie/system-update.json', name: 'System Update (Configuration Step)' },
    { path: '/lottie/data-analysis.json', name: 'Data Analysis (Resources Step)' },
    { path: '/lottie/web-upgrade.json', name: 'Web Upgrade (GPU Selection Step)' },
    { path: '/lottie/data-search.json', name: 'Data Search (Applications Step)' },
    { path: '/lottie/man-is-working-on-a-laptop.json', name: 'Working (Review Step)' },
    { path: '/lottie/user-login.json', name: 'User Login (Alternative)' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Lottie Animation Showcase</h1>
        <p className="text-muted-foreground mb-8">
          All available Lottie animations used in the VM creation wizard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animations.map((animation, index) => (
          <div
            key={index}
            className="bg-card border rounded-lg p-6 space-y-4"
          >
            <h3 className="font-semibold text-lg">{animation.name}</h3>
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded">
              <LottieAnimation
                animationPath={animation.path}
                className="w-40 h-40"
                loop={true}
                autoplay={true}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Path: {animation.path}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Story showing different animation positions
export const AnimationPositions = () => {
  const positions = ['top-right', 'top-left', 'center-top', 'background'];
  const sizes = ['small', 'medium', 'large'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Animation Positioning Options</h1>
        <p className="text-muted-foreground mb-8">
          Different positioning and sizing options for wizard step animations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {positions.map((position) => (
          <div
            key={position}
            className="bg-card border rounded-lg p-8 h-64 relative overflow-hidden"
          >
            <WizardStepAnimation
              animationPath="/lottie/signin-security.json"
              position={position}
              size="medium"
              opacity={position === 'background' ? 1 : 0.6}
            />
            <div className={position === 'background' ? 'relative z-10' : ''}>
              <h3 className="font-semibold text-lg mb-2">Position: {position}</h3>
              <p className="text-sm text-muted-foreground">
                This demonstrates the "{position}" positioning option for animations.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Size Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sizes.map((size) => (
            <div
              key={size}
              className="bg-card border rounded-lg p-8 flex flex-col items-center justify-center space-y-4"
            >
              <WizardStepAnimation
                animationPath="/lottie/data-analysis.json"
                position="center-top"
                size={size}
                opacity={0.8}
              />
              <h3 className="font-semibold">Size: {size}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// The complete wizard with animations
export const CompleteWizardWithAnimations = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Create Virtual Machine</h1>
        <p className="text-muted-foreground">
          Complete wizard with Lottie animations enhancing each step
        </p>
      </div>
      <CreateMachineWizard />
    </div>
  );
};

// Individual step stories for testing
export const BasicInfoStepWithAnimation = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <BasicInfoStep id="basicInfo" />
  </div>
);

export const ConfigurationStepWithAnimation = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <ConfigurationStep id="configuration" />
  </div>
);

export const ResourcesStepWithAnimation = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <ResourcesStep id="resources" />
  </div>
);

export const ApplicationsStepWithAnimation = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <ApplicationsStep id="applications" />
  </div>
);

export const ReviewStepWithAnimation = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <ReviewStep id="review" />
  </div>
);

// Animation performance test
export const PerformanceTest = () => {
  const [count, setCount] = React.useState(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Performance Test</h2>
        <button
          onClick={() => setCount(c => Math.min(c + 1, 10))}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Add Animation
        </button>
        <button
          onClick={() => setCount(c => Math.max(c - 1, 1))}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
        >
          Remove Animation
        </button>
        <span className="text-muted-foreground">Count: {count}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: count }, (_, i) => (
          <LottieAnimation
            key={i}
            animationPath="/lottie/data-analysis.json"
            className="w-32 h-32"
            loop={true}
            autoplay={true}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Test multiple animations running simultaneously to check performance impact
      </p>
    </div>
  );
};