import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { HealthScoreCard } from '@/components/vm/health';
import healthReducer from '@/state/slices/health';
import '@testing-library/jest-dom';

// Mock hooks
jest.mock('@/hooks/useHealthScore', () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockUseHealthScore = require('@/hooks/useHealthScore').default;

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

describe('HealthScoreCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Score Display', () => {
    it('displays correct color for healthy score (>=80)', () => {
      mockUseHealthScore.mockReturnValue({
        score: 85,
        lastCheck: new Date().toISOString()
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <HealthScoreCard vmId="test-vm-1" />
        </Provider>
      );

      const scoreElement = screen.getByText('85');
      expect(scoreElement).toHaveClass('text-green-600');
      expect(screen.getByText('Healthy')).toBeInTheDocument();
    });

    it('displays correct color for warning score (60-79)', () => {
      mockUseHealthScore.mockReturnValue({
        score: 70,
        lastCheck: new Date().toISOString()
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <HealthScoreCard vmId="test-vm-2" />
        </Provider>
      );

      const scoreElement = screen.getByText('70');
      expect(scoreElement).toHaveClass('text-yellow-600');
      expect(screen.getByText('Needs Attention')).toBeInTheDocument();
    });

    it('displays correct color for critical score (<60)', () => {
      mockUseHealthScore.mockReturnValue({
        score: 45,
        lastCheck: new Date().toISOString()
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <HealthScoreCard vmId="test-vm-3" />
        </Provider>
      );

      const scoreElement = screen.getByText('45');
      expect(scoreElement).toHaveClass('text-red-600');
      expect(screen.getByText('Critical Issues')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('triggers health check on button click', async () => {
      const mockRunHealthCheck = jest.fn();
      mockUseHealthScore.mockReturnValue({
        score: 75,
        lastCheck: new Date().toISOString(),
        runHealthCheck: mockRunHealthCheck
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <HealthScoreCard vmId="test-vm-4" />
        </Provider>
      );

      const checkButton = screen.getByRole('button', { name: /Check Now/i });
      fireEvent.click(checkButton);

      await waitFor(() => {
        expect(mockRunHealthCheck).toHaveBeenCalledWith('test-vm-4');
      });
    });

    it('shows details when View Details button is clicked', async () => {
      const mockShowDetails = jest.fn();
      mockUseHealthScore.mockReturnValue({
        score: 90,
        lastCheck: new Date().toISOString(),
        showDetails: mockShowDetails
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <HealthScoreCard vmId="test-vm-5" />
        </Provider>
      );

      const detailsButton = screen.getByRole('button', { name: /View Details/i });
      fireEvent.click(detailsButton);

      await waitFor(() => {
        expect(mockShowDetails).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state when health data is being fetched', () => {
      mockUseHealthScore.mockReturnValue({
        score: null,
        loading: true,
        lastCheck: null
      });

      const store = createMockStore({ isLoading: true });
      render(
        <Provider store={store}>
          <HealthScoreCard vmId="test-vm-6" />
        </Provider>
      );

      expect(screen.getByText(/Loading health data/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when health check fails', () => {
      mockUseHealthScore.mockReturnValue({
        score: null,
        error: 'Failed to fetch health data',
        lastCheck: null
      });

      const store = createMockStore({ error: 'Failed to fetch health data' });
      render(
        <Provider store={store}>
          <HealthScoreCard vmId="test-vm-7" />
        </Provider>
      );

      expect(screen.getByText(/Unable to load health score/i)).toBeInTheDocument();
    });
  });

  describe('Last Check Time', () => {
    it('displays formatted last check time', () => {
      const lastCheckTime = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
      mockUseHealthScore.mockReturnValue({
        score: 80,
        lastCheck: lastCheckTime
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <HealthScoreCard vmId="test-vm-8" />
        </Provider>
      );

      expect(screen.getByText(/Last checked: 5 minutes ago/i)).toBeInTheDocument();
    });

    it('shows "Never checked" when no last check time is available', () => {
      mockUseHealthScore.mockReturnValue({
        score: 75,
        lastCheck: null
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <HealthScoreCard vmId="test-vm-9" />
        </Provider>
      );

      expect(screen.getByText(/Last checked: Never/i)).toBeInTheDocument();
    });
  });
});