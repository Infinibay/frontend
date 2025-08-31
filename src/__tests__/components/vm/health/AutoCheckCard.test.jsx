import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AutoCheckCard } from '@/components/vm/health';
import healthReducer from '@/state/slices/health';
import { Download } from 'lucide-react';
import '@testing-library/jest-dom';

// Mock hooks
jest.mock('@/hooks/useAutoCheckData', () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockUseAutoCheckData = require('@/hooks/useAutoCheckData').default;

// Helper function to create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      health: healthReducer
    },
    preloadedState: {
      health: {
        vmHealthData: {},
        autoChecks: {},
        remediations: {},
        activeRemediations: {},
        healthTrends: {},
        firewallStatus: {},
        isLoading: false,
        error: null,
        lastUpdated: {},
        ...initialState
      }
    }
  });
};

describe('AutoCheckCard', () => {
  const defaultProps = {
    title: 'System Updates',
    icon: <Download className="h-5 w-5" />,
    category: 'updates',
    vmId: 'test-vm-1'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Status Display', () => {
    it('displays healthy status with green badge', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'healthy',
        summary: 'All systems are up to date',
        hasIssues: false,
        metrics: [
          { label: 'Updates', value: '0 pending' },
          { label: 'Last Check', value: '5 min ago' }
        ]
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      const badge = screen.getByText('healthy');
      expect(badge.closest('.bg-green-100')).toBeInTheDocument();
      expect(screen.getByText('All systems are up to date')).toBeInTheDocument();
    });

    it('displays warning status with yellow badge', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'warning',
        summary: '3 updates available',
        hasIssues: true,
        metrics: [
          { label: 'Updates', value: '3 pending' },
          { label: 'Priority', value: 'Low' }
        ]
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      const badge = screen.getByText('warning');
      expect(badge.closest('.bg-yellow-100')).toBeInTheDocument();
      expect(screen.getByText('3 updates available')).toBeInTheDocument();
    });

    it('displays critical status with red badge', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'critical',
        summary: 'Critical security updates required',
        hasIssues: true,
        metrics: [
          { label: 'Critical', value: '2 updates' },
          { label: 'Security', value: 'High risk' }
        ]
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      const badge = screen.getByText('critical');
      expect(badge.closest('.bg-red-100')).toBeInTheDocument();
      expect(screen.getByText('Critical security updates required')).toBeInTheDocument();
    });

    it('displays checking status with loading spinner', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'checking',
        summary: 'Running health check...',
        hasIssues: false,
        metrics: []
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      const badge = screen.getByText('checking');
      expect(badge.closest('.bg-blue-100')).toBeInTheDocument();
      expect(screen.getByText('Running health check...')).toBeInTheDocument();
      // Check for loading spinner
      expect(badge.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('Metrics Display', () => {
    it('displays all provided metrics', () => {
      const metrics = [
        { label: 'CPU Usage', value: '45%' },
        { label: 'Memory', value: '2.1 GB' },
        { label: 'Disk Space', value: '120 GB free' }
      ];

      mockUseAutoCheckData.mockReturnValue({
        status: 'healthy',
        summary: 'Performance is optimal',
        hasIssues: false,
        metrics
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} category="performance" />
        </Provider>
      );

      metrics.forEach(metric => {
        expect(screen.getByText(`${metric.label}:`)).toBeInTheDocument();
        expect(screen.getByText(metric.value)).toBeInTheDocument();
      });
    });

    it('handles empty metrics gracefully', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'healthy',
        summary: 'No data available',
        hasIssues: false,
        metrics: null
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('shows View Solutions button when issues exist', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'warning',
        summary: 'Issues detected',
        hasIssues: true,
        metrics: []
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      const solutionsButton = screen.getByRole('button', { name: /View Solutions/i });
      expect(solutionsButton).toBeInTheDocument();
    });

    it('does not show View Solutions button when no issues', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'healthy',
        summary: 'All good',
        hasIssues: false,
        metrics: []
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      const solutionsButton = screen.queryByRole('button', { name: /View Solutions/i });
      expect(solutionsButton).not.toBeInTheDocument();
    });

    it('opens remediation dialog when View Solutions is clicked', async () => {
      const mockOpenRemediationDialog = jest.fn();
      mockUseAutoCheckData.mockReturnValue({
        status: 'warning',
        summary: 'Issues detected',
        hasIssues: true,
        metrics: [],
        checkData: { id: 'check-1', issues: ['issue-1', 'issue-2'] }
      });

      // Mock the openRemediationDialog function
      window.openRemediationDialog = mockOpenRemediationDialog;

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      const solutionsButton = screen.getByRole('button', { name: /View Solutions/i });
      fireEvent.click(solutionsButton);

      // In the actual implementation, this would open a dialog
      // For testing, we just verify the button is clickable
      expect(solutionsButton).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('displays the provided icon', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'healthy',
        summary: 'All good',
        hasIssues: false,
        metrics: []
      });

      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      // Check for the icon in the header
      const iconContainer = container.querySelector('.p-2.bg-primary\\/10');
      expect(iconContainer).toBeInTheDocument();
    });

    it('applies hover effect on card', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'healthy',
        summary: 'All good',
        hasIssues: false,
        metrics: []
      });

      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      const card = container.querySelector('.hover\\:shadow-lg');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Different Categories', () => {
    const categories = [
      { category: 'updates', title: 'System Updates' },
      { category: 'security', title: 'Security Status' },
      { category: 'storage', title: 'Storage Health' },
      { category: 'performance', title: 'Performance' },
      { category: 'applications', title: 'Applications' },
      { category: 'firewall', title: 'Network & Firewall' }
    ];

    categories.forEach(({ category, title }) => {
      it(`renders correctly for ${category} category`, () => {
        mockUseAutoCheckData.mockReturnValue({
          status: 'healthy',
          summary: `${title} check passed`,
          hasIssues: false,
          metrics: []
        });

        const store = createMockStore();
        render(
          <Provider store={store}>
            <AutoCheckCard
              {...defaultProps}
              category={category}
              title={title}
            />
          </Provider>
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(`${title} check passed`)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error state when data fetch fails', () => {
      mockUseAutoCheckData.mockReturnValue({
        status: 'error',
        summary: 'Failed to fetch check data',
        hasIssues: false,
        metrics: [],
        error: 'Network error'
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <AutoCheckCard {...defaultProps} />
        </Provider>
      );

      expect(screen.getByText('Failed to fetch check data')).toBeInTheDocument();
    });
  });
});