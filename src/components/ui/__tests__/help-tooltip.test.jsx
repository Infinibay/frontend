/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelpTooltip, HELP_CONTENT } from '../help-tooltip';
import { TooltipProvider } from '../tooltip';

// Test wrapper with TooltipProvider
const TestWrapper = ({ children }) => (
  <TooltipProvider>{children}</TooltipProvider>
);

describe('HelpTooltip', () => {
  describe('Basic Functionality', () => {
    it('renders with valid helpKey', () => {
      render(
        <HelpTooltip helpKey="cpu-metric" />,
        { wrapper: TestWrapper }
      );
      
      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-label', 'Uso de CPU');
    });

    it('renders with custom children', () => {
      render(
        <HelpTooltip>
          <div>Custom help content</div>
        </HelpTooltip>,
        { wrapper: TestWrapper }
      );
      
      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-label', 'Help');
    });

    it('returns null when no helpKey or children provided', () => {
      const { container } = render(
        <HelpTooltip />,
        { wrapper: TestWrapper }
      );
      
      expect(container.firstChild).toBeNull();
    });

    it('returns null with invalid helpKey', () => {
      const { container } = render(
        <HelpTooltip helpKey="invalid-key" />,
        { wrapper: TestWrapper }
      );
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label from help content title', () => {
      render(
        <HelpTooltip helpKey="memory-metric" />,
        { wrapper: TestWrapper }
      );
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-label', 'Uso de Memoria');
    });

    it('uses custom aria-label when provided', () => {
      render(
        <HelpTooltip 
          helpKey="cpu-metric" 
          ariaLabel="Custom label" 
        />,
        { wrapper: TestWrapper }
      );
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-label', 'Custom label');
    });

    it('has keyboard support', () => {
      render(
        <HelpTooltip helpKey="system-status" />,
        { wrapper: TestWrapper }
      );
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('tabIndex', '0');
      
      // Button should be focusable
      trigger.focus();
      expect(trigger).toHaveFocus();
    });
  });

  describe('Content Display', () => {
    it('shows help icon by default', () => {
      render(
        <HelpTooltip helpKey="storage-metric" />,
        { wrapper: TestWrapper }
      );
      
      const icon = screen.getByRole('button').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('hides help icon when showIcon is false', () => {
      render(
        <HelpTooltip helpKey="network-metric" showIcon={false} />,
        { wrapper: TestWrapper }
      );
      
      const icon = screen.getByRole('button').querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <HelpTooltip 
          helpKey="threshold-colors" 
          triggerClassName="custom-class" 
        />,
        { wrapper: TestWrapper }
      );
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('custom-class');
    });
  });

  describe('Help Content Integration', () => {
    it('uses help content from HELP_CONTENT configuration', () => {
      expect(HELP_CONTENT['cpu-metric']).toBeDefined();
      expect(HELP_CONTENT['cpu-metric'].title).toBe('Uso de CPU');
      expect(HELP_CONTENT['cpu-metric'].content).toContain('procesador');
    });

    it('handles all defined help keys', () => {
      const requiredKeys = [
        'system-status',
        'cpu-metric',
        'memory-metric',
        'storage-metric',
        'network-metric'
      ];

      requiredKeys.forEach(key => {
        expect(HELP_CONTENT[key]).toBeDefined();
        expect(HELP_CONTENT[key].title).toBeTruthy();
        expect(HELP_CONTENT[key].content).toBeTruthy();
      });
    });
  });

  describe('Integration with Different Sides', () => {
    const sides = ['top', 'bottom', 'left', 'right'];
    
    sides.forEach(side => {
      it(`renders with side="${side}"`, () => {
        render(
          <HelpTooltip helpKey="trend-indicators" side={side} />,
          { wrapper: TestWrapper }
        );
        
        const trigger = screen.getByRole('button');
        expect(trigger).toBeInTheDocument();
      });
    });
  });
});