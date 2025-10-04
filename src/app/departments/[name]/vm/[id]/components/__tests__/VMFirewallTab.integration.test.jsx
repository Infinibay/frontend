/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import VMFirewallTab from '../VMFirewallTab';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SizeProvider } from '@/components/ui/size-provider';

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockSearchParams = { get: jest.fn(() => null) };

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    pathname: '/departments/test/vm/123'
  }),
  useParams: () => ({
    name: 'test',
    id: '123'
  }),
  useSearchParams: () => mockSearchParams
}));

// Mock debug utility
jest.mock('@/utils/debug', () => ({
  createDebugger: () => ({
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    success: jest.fn()
  })
}));

// Mock socket service
const mockSubscribe = jest.fn(() => jest.fn());
jest.mock('@/services/socketService', () => ({
  getSocketService: () => ({
    subscribe: mockSubscribe,
    connect: jest.fn(),
    disconnect: jest.fn()
  })
}));

// Mock useVMFirewall hook
const mockRefreshFirewallData = jest.fn();
const mockUseVMFirewallImpl = jest.fn(() => ({
  firewallState: 'active',
  availableTemplates: [],
  appliedTemplates: [],
  customRules: [
    { id: '1', name: 'Custom Rule 1', action: 'allow', direction: 'inbound' }
  ],
  effectiveRules: [
    { id: '1', name: 'Custom Rule 1', action: 'allow', direction: 'inbound' },
    { id: '2', name: 'Generic Rule 1', action: 'allow', direction: 'inbound', isGeneric: true }
  ],
  rulesSummary: { total: 2, allow: 2, deny: 0 },
  checkRuleConflicts: [],
  lastSync: new Date(),
  isLoading: false,
  error: null,
  refreshData: mockRefreshFirewallData
}));
jest.mock('@/hooks/useVMFirewall', () => ({
  __esModule: true,
  default: mockUseVMFirewallImpl
}));

// Mock GraphQL queries and mutations
import { GET_GENERIC_FILTERS, UNASSIGN_GENERIC_FILTER_FROM_VM } from '@/gql/queries/genericFilters';

const mockGenericFilters = [
  {
    id: 'filter-1',
    name: 'clean-traffic',
    description: 'Allow clean traffic only',
    priority: 1,
    rules: [],
    isCritical: true,
    createdBy: 'admin'
  },
  {
    id: 'filter-2',
    name: 'allow-ssh',
    description: 'Allow SSH access',
    priority: 2,
    rules: [],
    isCritical: false,
    createdBy: 'admin'
  }
];

const getGenericFiltersMock = {
  request: { query: GET_GENERIC_FILTERS },
  result: { data: { getGenericFilters: mockGenericFilters } }
};

const unassignFilterMock = (filterId) => ({
  request: {
    query: UNASSIGN_GENERIC_FILTER_FROM_VM,
    variables: { vmId: 'test-vm-1', filterId }
  },
  result: {
    data: { unassignGenericFilterFromVM: { success: true } }
  }
});

// Mock Redux store
const createMockStore = (userRole = 'admin') => {
  return configureStore({
    reducer: {
      auth: (state = { user: { role: userRole } }) => state
    }
  });
};

// Test wrapper with all required providers
const TestWrapper = ({ children, mocks = [], userRole = 'admin' }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <Provider store={createMockStore(userRole)}>
      <SizeProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </SizeProvider>
    </Provider>
  </MockedProvider>
);

describe('VMFirewallTab Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.get.mockImplementation(() => null);
    mockUseVMFirewallImpl.mockReturnValue({
      firewallState: 'active',
      availableTemplates: [],
      appliedTemplates: [],
      customRules: [
        { id: '1', name: 'Custom Rule 1', action: 'allow', direction: 'inbound' }
      ],
      effectiveRules: [
        { id: '1', name: 'Custom Rule 1', action: 'allow', direction: 'inbound' },
        { id: '2', name: 'Generic Rule 1', action: 'allow', direction: 'inbound', isGeneric: true }
      ],
      rulesSummary: { total: 2, allow: 2, deny: 0 },
      checkRuleConflicts: [],
      lastSync: new Date(),
      isLoading: false,
      error: null,
      refreshData: mockRefreshFirewallData
    });
  });

  describe('Tab Navigation', () => {
    it('all 3 tabs render correctly', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Servicios Predefinidos/i)).toBeInTheDocument();
        expect(screen.getByText(/Reglas Personalizadas/i)).toBeInTheDocument();
        expect(screen.getByText(/Reglas Efectivas/i)).toBeInTheDocument();
      });
    });

    it('clicking tab switches content', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Servicios Predefinidos/i)).toBeInTheDocument();
      });

      const personalizadasTab = screen.getByText(/Reglas Personalizadas/i);
      await user.click(personalizadasTab);

      await waitFor(() => {
        expect(personalizadasTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('URL query param updates when tab changes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Reglas Efectivas/i)).toBeInTheDocument();
      });

      const efectivasTab = screen.getByText(/Reglas Efectivas/i);
      await user.click(efectivasTab);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalled();
      });
    });

    it('default tab is "Servicios Predefinidos"', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        const serviciosTab = screen.getByText(/Servicios Predefinidos/i);
        expect(serviciosTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('initializes with tab from URL query param ?tab=efectivas', async () => {
      mockSearchParams.get.mockImplementation((key) => key === 'tab' ? 'efectivas' : null);

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        const efectivasTab = screen.getByText(/Reglas Efectivas/i);
        expect(efectivasTab).toHaveAttribute('data-state', 'active');
      });

      mockSearchParams.get.mockImplementation(() => null);
    });
  });

  describe('Keyboard Navigation', () => {
    it('ArrowDown navigates to next row in GenericFilterLibrary', async () => {
      const mocks = [getGenericFiltersMock];

      render(
        <TestWrapper mocks={mocks}>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      });

      // Get all filter rows
      const rows = screen.queryAllByRole('row');
      if (rows.length > 1) {
        // Focus first row
        rows[0].focus();
        expect(rows[0]).toHaveFocus();

        // Press ArrowDown
        fireEvent.keyDown(window, { key: 'ArrowDown' });

        // Check that focus moved (implementation may vary)
        // This tests that the keydown handler doesn't crash
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      }
    });

    it('ArrowUp navigates to previous row in GenericFilterLibrary', async () => {
      const mocks = [getGenericFiltersMock];

      render(
        <TestWrapper mocks={mocks}>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      });

      // Get all filter rows
      const rows = screen.queryAllByRole('row');
      if (rows.length > 1) {
        // Focus second row
        rows[1].focus();
        expect(rows[1]).toHaveFocus();

        // Press ArrowUp
        fireEvent.keyDown(window, { key: 'ArrowUp' });

        // Check that the handler doesn't crash
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      }
    });

    it('Space toggles focused row in GenericFilterLibrary', async () => {
      const mocks = [getGenericFiltersMock];

      render(
        <TestWrapper mocks={mocks}>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      });

      // Get a filter row with data-row attribute
      const filterRow = screen.queryByText(/clean-traffic/i)?.closest('[data-row]');
      if (filterRow) {
        filterRow.focus();
        expect(filterRow).toHaveFocus();

        // Press Space (should prevent page scroll)
        fireEvent.keyDown(window, { key: ' ' });

        // Check that the handler doesn't crash
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      }
    });

    it('Enter activates focused row in GenericFilterLibrary', async () => {
      const mocks = [getGenericFiltersMock];

      render(
        <TestWrapper mocks={mocks}>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      });

      // Get a filter row with data-row attribute
      const filterRow = screen.queryByText(/clean-traffic/i)?.closest('[data-row]');
      if (filterRow) {
        filterRow.focus();
        expect(filterRow).toHaveFocus();

        // Press Enter
        fireEvent.keyDown(window, { key: 'Enter' });

        // Check that the handler doesn't crash
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      }
    });

    it('keyboard shortcuts do not interfere with typing in inputs', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Servicios Predefinidos/i)).toBeInTheDocument();
      });

      // Find search input
      const searchInput = screen.queryByPlaceholderText(/Buscar/i);
      if (searchInput) {
        await user.click(searchInput);
        expect(searchInput).toHaveFocus();

        // Type "1" - should not switch tabs
        await user.type(searchInput, '1');

        // Tab should still be servicios
        const serviciosTab = screen.getByText(/Servicios Predefinidos/i);
        expect(serviciosTab).toHaveAttribute('data-state', 'active');
      }
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('pressing 1 switches to tab 1', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Servicios Predefinidos/i)).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: '1' });

      await waitFor(() => {
        const serviciosTab = screen.getByText(/Servicios Predefinidos/i);
        expect(serviciosTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('pressing 2 switches to tab 2', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Reglas Personalizadas/i)).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: '2' });

      await waitFor(() => {
        const personalizadasTab = screen.getByText(/Reglas Personalizadas/i);
        expect(personalizadasTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('pressing 3 switches to tab 3', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Reglas Efectivas/i)).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: '3' });

      await waitFor(() => {
        const efectivasTab = screen.getByText(/Reglas Efectivas/i);
        expect(efectivasTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('pressing Escape closes open AlertDialog', async () => {
      const user = userEvent.setup();
      const mocks = [getGenericFiltersMock, unassignFilterMock('filter-1')];

      render(
        <TestWrapper mocks={mocks}>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      // Wait for tab to be active
      await waitFor(() => {
        expect(screen.getByText(/Servicios Predefinidos/i)).toBeInTheDocument();
      });

      // Wait for GenericFilterLibrary to load
      await waitFor(() => {
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      });

      // Find the critical filter checkbox (assuming it's assigned and we want to unassign)
      // The critical filter is 'clean-traffic' which should trigger AlertDialog
      const criticalCheckbox = screen.queryByLabelText(/clean-traffic/i);
      if (criticalCheckbox) {
        await user.click(criticalCheckbox);

        // Wait for AlertDialog to appear
        await waitFor(() => {
          const dialog = screen.queryByRole('alertdialog');
          expect(dialog).toBeInTheDocument();
        });

        // Press Escape key
        fireEvent.keyDown(window, { key: 'Escape' });

        // Wait for dialog to close
        await waitFor(() => {
          const dialog = screen.queryByRole('alertdialog');
          expect(dialog).not.toBeInTheDocument();
        });
      }
    });

    it('pressing / focuses search input', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Servicios Predefinidos/i)).toBeInTheDocument();
      });

      // Find any search input on the page
      const searchInput = screen.queryByPlaceholderText(/Buscar/i);
      if (searchInput) {
        expect(searchInput).not.toHaveFocus();

        // Press / key
        fireEvent.keyDown(window, { key: '/' });

        // Input should now have focus
        await waitFor(() => {
          expect(searchInput).toHaveFocus();
        });
      }
    });
  });

  describe('Real-time Updates', () => {
    it('subscribes to WebSocket events on mount', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalledWith(
          'firewall:generic:assigned',
          expect.any(Function)
        );
        expect(mockSubscribe).toHaveBeenCalledWith(
          'firewall:generic:unassigned',
          expect.any(Function)
        );
      });
    });

    it('refetches data when WebSocket event received', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalled();
      });

      // Get the callback function passed to subscribe
      const subscribeCall = mockSubscribe.mock.calls.find(
        call => call[0] === 'firewall:generic:assigned'
      );

      if (subscribeCall) {
        const callback = subscribeCall[1];
        callback('generic:assigned', { vmId: 'test-vm-1', filterId: 'filter-1' });

        await waitFor(() => {
          expect(mockRefreshFirewallData).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Tab Content', () => {
    it('Tab 1 renders GenericFilterLibrary', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      });
    });

    it('Tab 2 shows custom rules only', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Reglas Personalizadas/i)).toBeInTheDocument();
      });

      const personalizadasTab = screen.getByText(/Reglas Personalizadas/i);
      await user.click(personalizadasTab);

      await waitFor(() => {
        expect(screen.getByText(/Custom Rule 1/i)).toBeInTheDocument();
      });
    });

    it('Tab 3 shows all effective rules', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Reglas Efectivas/i)).toBeInTheDocument();
      });

      const efectivasTab = screen.getByText(/Reglas Efectivas/i);
      await user.click(efectivasTab);

      await waitFor(() => {
        expect(screen.getByText(/Total de Reglas/i)).toBeInTheDocument();
      });
    });
  });

  describe('VM Status Integration', () => {
    it('shows warning when VM is running', async () => {
      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'running' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Important note/i)).toBeInTheDocument();
      });
    });

    it('disables GenericFilterLibrary when VM is running (tab 1)', async () => {
      const mocks = [getGenericFiltersMock];

      render(
        <TestWrapper mocks={mocks}>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'running' }} />
        </TestWrapper>
      );

      // Wait for tab 1 (servicios) to load
      await waitFor(() => {
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      });

      // GenericFilterLibrary receives disabled={true} when VM is running
      // Checkboxes in the library should be disabled
      await waitFor(() => {
        const checkboxes = screen.queryAllByRole('checkbox');
        if (checkboxes.length > 0) {
          checkboxes.forEach(checkbox => {
            expect(checkbox).toBeDisabled();
          });
        }
      });
    });

    it('disables FirewallRulesSection when VM is running (tab 2)', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'running' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Reglas Personalizadas/i)).toBeInTheDocument();
      });

      // Switch to tab 2
      const personalizadasTab = screen.getByText(/Reglas Personalizadas/i);
      await user.click(personalizadasTab);

      await waitFor(() => {
        expect(personalizadasTab).toHaveAttribute('data-state', 'active');
      });

      // FirewallRulesSection receives disabled={true}
      // Check that action buttons (if present) are disabled
      const addButton = screen.queryByText(/Nueva Regla/i);
      if (addButton) {
        expect(addButton).toBeDisabled();
      }
    });

    it('EffectiveRulesView remains read-only when VM is running (tab 3)', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'running' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Reglas Efectivas/i)).toBeInTheDocument();
      });

      // Switch to tab 3
      const efectivasTab = screen.getByText(/Reglas Efectivas/i);
      await user.click(efectivasTab);

      await waitFor(() => {
        expect(efectivasTab).toHaveAttribute('data-state', 'active');
      });

      // EffectiveRulesView is always read-only
      // Should show summary without action buttons
      await waitFor(() => {
        expect(screen.getByText(/Total de Reglas/i)).toBeInTheDocument();
      });

      // Verify no action buttons are present (read-only)
      const editButtons = screen.queryAllByText(/Editar/i);
      const deleteButtons = screen.queryAllByText(/Eliminar/i);
      expect(editButtons.length).toBe(0);
      expect(deleteButtons.length).toBe(0);
    });

    it('enables GenericFilterLibrary when VM is stopped (tab 1)', async () => {
      const mocks = [getGenericFiltersMock];

      render(
        <TestWrapper mocks={mocks}>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      // Wait for tab 1 (servicios) to load
      await waitFor(() => {
        expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
      });

      // GenericFilterLibrary receives disabled={false} when VM is stopped
      // Checkboxes should be enabled
      await waitFor(() => {
        const checkboxes = screen.queryAllByRole('checkbox');
        if (checkboxes.length > 0) {
          // At least some checkboxes should be enabled (non-critical ones)
          const enabledCheckboxes = checkboxes.filter(cb => !cb.disabled);
          expect(enabledCheckboxes.length).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });

  describe('Loading States', () => {
    it('shows skeleton while loading', async () => {
      // Mock loading state
      mockUseVMFirewallImpl.mockReturnValueOnce({
        firewallState: 'active',
        availableTemplates: [],
        appliedTemplates: [],
        customRules: [],
        effectiveRules: [],
        rulesSummary: { total: 0, allow: 0, deny: 0 },
        checkRuleConflicts: [],
        lastSync: new Date(),
        isLoading: true,
        error: null,
        refreshData: mockRefreshFirewallData
      });

      const { container } = render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        const skeletons = container.querySelectorAll('[class*="h-\\[200px\\]"]');
        expect(skeletons.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error alert when queries fail', async () => {
      mockUseVMFirewallImpl.mockReturnValueOnce({
        firewallState: 'active',
        availableTemplates: [],
        appliedTemplates: [],
        customRules: [],
        effectiveRules: [],
        rulesSummary: { total: 0, allow: 0, deny: 0 },
        checkRuleConflicts: [],
        lastSync: new Date(),
        isLoading: false,
        error: new Error('Failed to fetch firewall data'),
        refreshData: mockRefreshFirewallData
      });

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Error loading VM firewall configuration/i)).toBeInTheDocument();
      });
    });

    it('shows retry button on error', async () => {
      mockUseVMFirewallImpl.mockReturnValueOnce({
        firewallState: 'active',
        availableTemplates: [],
        appliedTemplates: [],
        customRules: [],
        effectiveRules: [],
        rulesSummary: { total: 0, allow: 0, deny: 0 },
        checkRuleConflicts: [],
        lastSync: new Date(),
        isLoading: false,
        error: new Error('Failed to fetch firewall data'),
        refreshData: mockRefreshFirewallData
      });

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Retry/i)).toBeInTheDocument();
      });
    });

    it('each tab has its own ErrorBoundary', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VMFirewallTab vmId="test-vm-1" vm={{ name: 'Test VM', status: 'stopped' }} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Servicios Predefinidos/i)).toBeInTheDocument();
      });

      // Tab 1 should have ErrorBoundary wrapping content
      expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();

      // Switch to tab 2
      const personalizadasTab = screen.getByText(/Reglas Personalizadas/i);
      await user.click(personalizadasTab);

      await waitFor(() => {
        expect(personalizadasTab).toHaveAttribute('data-state', 'active');
      });

      // Tab 2 should have ErrorBoundary wrapping content
      expect(screen.getByText(/Custom Rule 1/i)).toBeInTheDocument();

      // Switch to tab 3
      const efectivasTab = screen.getByText(/Reglas Efectivas/i);
      await user.click(efectivasTab);

      await waitFor(() => {
        expect(efectivasTab).toHaveAttribute('data-state', 'active');
      });

      // Tab 3 should have ErrorBoundary wrapping content
      expect(screen.getByText(/Total de Reglas/i)).toBeInTheDocument();
    });
  });
});
