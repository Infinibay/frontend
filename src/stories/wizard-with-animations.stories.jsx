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
import { SimpleIllustration } from '@/components/ui/undraw-illustration';
import { CloudDownload, Shield, Settings, BarChart3, Search, Laptop, UserCircle } from 'lucide-react';
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
  title: 'Infinibay/Wizard with Illustrations',
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

// Story showcasing all illustrations
export const IllustrationShowcase = () => {
  const illustrations = [
    { icon: Shield, name: 'Security (Basic Info Step)' },
    { icon: Settings, name: 'Configuration Step' },
    { icon: BarChart3, name: 'Resources Analysis' },
    { icon: CloudDownload, name: 'Downloads' },
    { icon: Search, name: 'Search/Applications' },
    { icon: Laptop, name: 'Working/Review' },
    { icon: UserCircle, name: 'User/Account' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Icon Illustration Showcase</h1>
        <p className="text-muted-foreground mb-8">
          Simple icon-based illustrations used in the VM creation wizard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {illustrations.map((illustration, index) => (
          <div
            key={index}
            className="bg-card border rounded-lg p-6 space-y-4"
          >
            <h3 className="font-semibold text-lg">{illustration.name}</h3>
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded">
              <SimpleIllustration
                icon={illustration.icon}
                size="medium"
                opacity={20}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Using lucide-react icons for clean, accessible illustrations
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Story showing different illustration sizes and opacity
export const IllustrationVariations = () => {
  const sizes = ['small', 'medium', 'large'];
  const opacities = [10, 20, 40, 80];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Illustration Size & Opacity Options</h1>
        <p className="text-muted-foreground mb-8">
          Different sizing and opacity options for icon illustrations
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Size Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sizes.map((size) => (
            <div
              key={size}
              className="bg-card border rounded-lg p-8 flex flex-col items-center justify-center space-y-4"
            >
              <SimpleIllustration
                icon={BarChart3}
                size={size}
                opacity={20}
              />
              <h3 className="font-semibold">Size: {size}</h3>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Opacity Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {opacities.map((opacity) => (
            <div
              key={opacity}
              className="bg-card border rounded-lg p-8 flex flex-col items-center justify-center space-y-4"
            >
              <SimpleIllustration
                icon={CloudDownload}
                size="medium"
                opacity={opacity}
              />
              <h3 className="font-semibold">Opacity: {opacity}%</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// The complete wizard
export const CompleteWizard = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Create Virtual Machine</h1>
        <p className="text-muted-foreground">
          Complete wizard with simple icon illustrations
        </p>
      </div>
      <CreateMachineWizard />
    </div>
  );
};

// Individual step stories for testing
export const BasicInfoStep_ = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <BasicInfoStep id="basicInfo" />
  </div>
);

export const ConfigurationStep_ = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <ConfigurationStep id="configuration" />
  </div>
);

export const ResourcesStep_ = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <ResourcesStep id="resources" />
  </div>
);

export const ApplicationsStep_ = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <ApplicationsStep id="applications" />
  </div>
);

export const ReviewStep_ = () => (
  <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg border">
    <ReviewStep id="review" />
  </div>
);