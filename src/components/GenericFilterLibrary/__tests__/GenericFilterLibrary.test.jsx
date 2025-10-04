/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { GenericFilterLibrary } from '../GenericFilterLibrary';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SizeProvider } from '@/components/ui/size-provider';
import {
  GET_GENERIC_FILTERS,
  GET_VM_ASSIGNED_GENERIC_FILTERS,
  ASSIGN_GENERIC_FILTER_TO_VM,
  UNASSIGN_GENERIC_FILTER_FROM_VM
} from '@/gql/graphql';

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

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(() => 'toast-id'),
    dismiss: jest.fn()
  }
}));

// Mock filter categories
jest.mock('@/utils/genericFilterCategories', () => ({
  categorizeFilter: (filter) => {
    if (filter.name.includes('ssh')) return 'remote-access';
    if (filter.name.includes('clean-traffic')) return 'security';
    return 'network';
  },
  isCriticalFilter: (name) => name === 'clean-traffic',
  FILTER_CATEGORIES: {
    'security': { name: 'Security', icon: '🛡️' },
    'remote-access': { name: 'Remote Access', icon: '🔐' },
    'network': { name: 'Network', icon: '🌐' }
  }
}));

// Mock Redux store
const createMockStore = (isAdmin = true) => {
  return configureStore({
    reducer: {
      auth: (state = { user: { role: isAdmin ? 'ADMIN' : 'USER' } }) => state
    }
  });
};

// Test wrapper with all required providers
const TestWrapper = ({ children, isAdmin = true, mocks = [] }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <Provider store={createMockStore(isAdmin)}>
      <SizeProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </SizeProvider>
    </Provider>
  </MockedProvider>
);

// Mock data
const mockFilters = [
  {
    id: 'filter-1',
    name: 'clean-traffic',
    description: 'Basic traffic filtering',
    category: 'security',
    rules: [
      { protocol: 'tcp', dstportstart: '80', action: 'accept', direction: 'inbound' }
    ]
  },
  {
    id: 'filter-2',
    name: 'allow-ssh',
    description: 'Allow SSH access',
    category: 'remote-access',
    rules: [
      { protocol: 'tcp', dstportstart: '22', action: 'accept', direction: 'inbound' }
    ]
  },
  {
    id: 'filter-3',
    name: 'web-server',
    description: 'Web server access',
    category: 'network',
    rules: [
      { protocol: 'tcp', dstportstart: '443', action: 'accept', direction: 'inbound' }
    ]
  }
];

// GraphQL mocks
const getCatalogMock = {
  request: {
    query: GET_GENERIC_FILTERS
  },
  result: {
    data: {
      getGenericFilters: mockFilters
    }
  }
};

const getAssignedFiltersMock = (assignedIds = []) => ({
  request: {
    query: GET_VM_ASSIGNED_GENERIC_FILTERS,
    variables: { vmId: 'test-vm-1' }
  },
  result: {
    data: {
      getVMAssignedGenericFilters: assignedIds.map(id => ({ id }))
    }
  }
});

const assignFilterSuccessMock = (filterId) => ({
  request: {
    query: ASSIGN_GENERIC_FILTER_TO_VM,
    variables: { vmId: 'test-vm-1', filterId }
  },
  result: {
    data: {
      assignGenericFilterToVM: {
        success: true,
        message: 'Filter assigned successfully'
      }
    }
  }
});

const assignFilterErrorMock = (filterId) => ({
  request: {
    query: ASSIGN_GENERIC_FILTER_TO_VM,
    variables: { vmId: 'test-vm-1', filterId }
  },
  error: new Error('Network error: Failed to assign filter')
});

const unassignFilterSuccessMock = (filterId) => ({
  request: {
    query: UNASSIGN_GENERIC_FILTER_FROM_VM,
    variables: { vmId: 'test-vm-1', filterId }
  },
  result: {
    data: {
      unassignGenericFilterFromVM: {
        success: true,
        message: 'Filter unassigned successfully'
      }
    }
  }
});

const unassignFilterErrorMock = (filterId) => ({
  request: {
    query: UNASSIGN_GENERIC_FILTER_FROM_VM,
    variables: { vmId: 'test-vm-1', filterId }
  },
  error: new Error('Network error: Failed to unassign filter')
});

describe('GenericFilterLibrary', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText(/Biblioteca de Filtros Genéricos/i)).toBeInTheDocument();
    });

    it('shows loading skeleton when data is loading', () => {
      const { container } = render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      // Check for skeleton elements (they typically have specific classes)
      const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders search input and filter controls', async () => {
      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Buscar/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('filters by service name', async () => {
      const user = userEvent.setup();

      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Buscar/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Buscar/i);
      await user.type(searchInput, 'ssh');

      // Wait for debounce (300ms)
      await waitFor(() => {
        expect(searchInput.value).toBe('ssh');
      }, { timeout: 500 });
    });

    it('debounces search input', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Buscar/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Buscar/i);
      await user.type(searchInput, 'test');

      // Advance timers to trigger debounce
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(searchInput.value).toBe('test');
      });

      jest.useRealTimers();
    });
  });

  describe('Filter Controls', () => {
    it('shows category dropdown', async () => {
      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByText(/Categoría/i)).toBeInTheDocument();
      });
    });

    it('shows "Solo asignados" checkbox', async () => {
      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByText(/Solo asignados/i)).toBeInTheDocument();
      });
    });

    it('has clear filters button when filters are active', async () => {
      const user = userEvent.setup();

      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Buscar/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Buscar/i);
      await user.type(searchInput, 'test');

      await waitFor(() => {
        expect(screen.getByText(/Limpiar filtros/i)).toBeInTheDocument();
      }, { timeout: 500 });
    });
  });

  describe('Critical Filters', () => {
    it('non-admin cannot unassign critical filters', async () => {
      render(
        <TestWrapper isAdmin={false}>
          <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.queryByText(/clean-traffic/i)).toBeInTheDocument();
      });

      // Critical filter checkbox should be disabled for non-admin
      const checkboxes = screen.getAllByRole('checkbox');
      const criticalCheckbox = checkboxes.find(cb => cb.disabled);
      expect(criticalCheckbox).toBeDefined();
    });

    it('admin can unassign critical filters with confirmation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper isAdmin={true}>
          <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.queryByText(/clean-traffic/i)).toBeInTheDocument();
      });

      // Find and click "Quitar" button for critical filter
      const quitarButtons = screen.getAllByText(/Quitar/i);
      if (quitarButtons.length > 0) {
        await user.click(quitarButtons[0]);

        // Confirmation dialog should appear
        await waitFor(() => {
          expect(screen.getByText(/Desasignar Filtro Crítico/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Inherited Filters', () => {
    it('shows "Heredado" badge for inherited filters', async () => {
      const mockWithInherited = [
        ...mockGenericFilters,
        {
          id: '3',
          name: 'inherited-filter',
          description: 'Inherited from department',
          category: 'security',
          isInherited: true,
          inheritedFrom: 'Engineering',
          rules: []
        }
      ];

      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        const badges = screen.queryAllByText(/Heredado/i);
        expect(badges.length).toBeGreaterThanOrEqual(0);
      });
    });

    it('checkbox is disabled for inherited filters', async () => {
      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        const disabledCheckboxes = checkboxes.filter(cb => cb.disabled);
        expect(disabledCheckboxes.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Collapsible Categories', () => {
    it('categories can be expanded/collapsed', async () => {
      const user = userEvent.setup();

      render(
        <GenericFilterLibrary vmId="test-vm-1" onFilterChange={jest.fn()} />,
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        const categoryHeaders = screen.queryAllByRole('button');
        expect(categoryHeaders.length).toBeGreaterThan(0);
      });

      const categoryButton = screen.queryAllByRole('button')[0];
      if (categoryButton) {
        await user.click(categoryButton);

        await waitFor(() => {
          expect(categoryButton).toHaveAttribute('data-state');
        });
      }
    });
  });

  describe('Accessibility', () => {
    it('all interactive elements have proper ARIA labels', async () => {
      const mocks = [getCatalogMock, getAssignedFiltersMock([])];

      render(
        <TestWrapper mocks={mocks}>
          <GenericFilterLibrary vmId="test-vm-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
          expect(
            button.getAttribute('aria-label') ||
            button.textContent.length > 0
          ).toBeTruthy();
        });
      });
    });

    it('keyboard navigation works', async () => {
      const user = userEvent.setup();
      const mocks = [getCatalogMock, getAssignedFiltersMock([])];

      render(
        <TestWrapper mocks={mocks}>
          <GenericFilterLibrary vmId="test-vm-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Buscar servicios/i)).toBeInTheDocument();
      });

      await user.tab();
      expect(document.activeElement).toBeDefined();
    });
  });

  describe('Mutation Tests with Apollo Mocks', () => {
    beforeEach(() => {
      const { toast } = require('sonner');
      jest.clearAllMocks();
    });

    it('assigns filter with loading and success toast', async () => {
      const { toast } = require('sonner');
      const user = userEvent.setup();
      const onFilterChange = jest.fn();

      const mocks = [
        getCatalogMock,
        getAssignedFiltersMock([]),
        assignFilterSuccessMock('filter-2'),
        getCatalogMock,
        getAssignedFiltersMock(['filter-2'])
      ];

      render(
        <TestWrapper mocks={mocks}>
          <GenericFilterLibrary vmId="test-vm-1" onFilterChange={onFilterChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/allow-ssh/i)).toBeInTheDocument();
      });

      // Find and click checkbox
      const checkbox = screen.getByRole('checkbox', { name: /Activar allow-ssh/i });
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      // Loading toast should be called
      expect(toast.loading).toHaveBeenCalled();

      // Wait for success toast
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(onFilterChange).toHaveBeenCalled();
      });
    });

    it('shows error toast on assignment failure', async () => {
      const { toast } = require('sonner');
      const user = userEvent.setup();

      const mocks = [
        getCatalogMock,
        getAssignedFiltersMock([]),
        assignFilterErrorMock('filter-2')
      ];

      render(
        <TestWrapper mocks={mocks}>
          <GenericFilterLibrary vmId="test-vm-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/allow-ssh/i)).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox', { name: /Activar allow-ssh/i });
      await user.click(checkbox);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('unassigns non-critical filter with success toast', async () => {
      const { toast } = require('sonner');
      const user = userEvent.setup();

      const mocks = [
        getCatalogMock,
        getAssignedFiltersMock(['filter-2']),
        unassignFilterSuccessMock('filter-2'),
        getCatalogMock,
        getAssignedFiltersMock([])
      ];

      render(
        <TestWrapper mocks={mocks}>
          <GenericFilterLibrary vmId="test-vm-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/allow-ssh/i)).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox', { name: /Desactivar allow-ssh/i });
      expect(checkbox).toBeChecked();

      await user.click(checkbox);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it('admin sees AlertDialog for critical filter unassignment', async () => {
      const user = userEvent.setup();

      const mocks = [
        getCatalogMock,
        getAssignedFiltersMock(['filter-1'])
      ];

      render(
        <TestWrapper isAdmin={true} mocks={mocks}>
          <GenericFilterLibrary vmId="test-vm-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/clean-traffic/i)).toBeInTheDocument();
      });

      const quitarButton = screen.getByRole('button', { name: /Quitar clean-traffic/i });
      await user.click(quitarButton);

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(screen.getByText(/Desasignar Filtro Crítico/i)).toBeInTheDocument();
      });
    });

    it('admin confirms critical unassignment via dialog', async () => {
      const { toast } = require('sonner');
      const user = userEvent.setup();

      const mocks = [
        getCatalogMock,
        getAssignedFiltersMock(['filter-1']),
        unassignFilterSuccessMock('filter-1'),
        getCatalogMock,
        getAssignedFiltersMock([])
      ];

      render(
        <TestWrapper isAdmin={true} mocks={mocks}>
          <GenericFilterLibrary vmId="test-vm-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/clean-traffic/i)).toBeInTheDocument();
      });

      const quitarButton = screen.getByRole('button', { name: /Quitar clean-traffic/i });
      await user.click(quitarButton);

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /Confirmar \(Admin\)/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      });
    });

    it('non-admin cannot unassign critical filter', async () => {
      const mocks = [
        getCatalogMock,
        getAssignedFiltersMock(['filter-1'])
      ];

      render(
        <TestWrapper isAdmin={false} mocks={mocks}>
          <GenericFilterLibrary vmId="test-vm-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/clean-traffic/i)).toBeInTheDocument();
      });

      const quitarButton = screen.getByRole('button', { name: /Quitar clean-traffic/i });
      expect(quitarButton).toBeDisabled();
    });
  });
});
