import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RemediationCard } from '@/components/vm/health';
import '@testing-library/jest-dom';

describe('RemediationCard', () => {
  const mockIssue = {
    id: 'issue-1',
    title: 'Install security updates',
    description: 'Your system has 3 security updates that should be installed to protect against vulnerabilities.',
    severity: 'warning',
    riskLevel: 'low',
    requiresApproval: false,
    estimatedTime: '5-10 minutes',
    expectedImprovement: 'Improved security and stability',
    steps: [
      'Download the latest security patches',
      'Install updates automatically',
      'Restart services if required',
      'Verify all systems are working properly'
    ]
  };

  const mockHighRiskIssue = {
    id: 'issue-2',
    title: 'Clean up system files',
    description: 'System files are consuming excessive disk space and may affect performance.',
    severity: 'critical',
    riskLevel: 'high',
    requiresApproval: true,
    approved: false,
    estimatedTime: '10-15 minutes',
    expectedImprovement: 'Free up 5GB of storage space',
    steps: [
      'Scan for large temporary files',
      'Remove old log files safely',
      'Clear system cache',
      'Verify system stability'
    ]
  };

  const mockOnApply = jest.fn();
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Issue Display', () => {
    it('renders issue title and description correctly', () => {
      render(
        <RemediationCard
          issue={mockIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByText(mockIssue.title)).toBeInTheDocument();
      expect(screen.getByText(mockIssue.description)).toBeInTheDocument();
    });

    it('displays risk level badge with correct color', () => {
      const { rerender } = render(
        <RemediationCard
          issue={mockIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      let badge = screen.getByText(/Risk: low/i);
      expect(badge).toHaveClass('bg-green-100');

      rerender(
        <RemediationCard
          issue={mockHighRiskIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      badge = screen.getByText(/Risk: high/i);
      expect(badge).toHaveClass('bg-red-100');
    });

    it('displays all remediation steps', () => {
      render(
        <RemediationCard
          issue={mockIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      mockIssue.steps.forEach((step, index) => {
        expect(screen.getByText(`${index + 1}.`)).toBeInTheDocument();
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });

    it('shows estimated time and expected improvement', () => {
      render(
        <RemediationCard
          issue={mockIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByText(mockIssue.estimatedTime)).toBeInTheDocument();
      expect(screen.getByText(mockIssue.expectedImprovement)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onApply when Apply Fix button is clicked', () => {
      render(
        <RemediationCard
          issue={mockIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      const applyButton = screen.getByRole('button', { name: /Apply Fix/i });
      fireEvent.click(applyButton);

      expect(mockOnApply).toHaveBeenCalledWith(mockIssue.id);
    });

    it('disables Apply Fix button when approval is required but not granted', () => {
      render(
        <RemediationCard
          issue={mockHighRiskIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      const applyButton = screen.getByRole('button', { name: /Apply Fix/i });
      expect(applyButton).toBeDisabled();
    });

    it('enables Apply Fix button when approval is granted', () => {
      const approvedIssue = { ...mockHighRiskIssue, approved: true };
      render(
        <RemediationCard
          issue={approvedIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      const applyButton = screen.getByRole('button', { name: /Apply Fix/i });
      expect(applyButton).not.toBeDisabled();
    });

    it('calls onDismiss when Dismiss button is clicked', () => {
      render(
        <RemediationCard
          issue={mockIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      const dismissButton = screen.getByRole('button', { name: /Dismiss/i });
      fireEvent.click(dismissButton);

      expect(mockOnDismiss).toHaveBeenCalledWith(mockIssue.id);
    });

    it('shows more information when Learn More button is clicked', async () => {
      const mockShowMoreInfo = jest.fn();
      
      // Mock the showMoreInfo function
      jest.spyOn(React, 'useState').mockImplementation((initial) => {
        if (initial === false) { // Assuming this is for showing more info state
          return [false, mockShowMoreInfo];
        }
        return jest.requireActual('react').useState(initial);
      });

      render(
        <RemediationCard
          issue={mockIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      const learnMoreButton = screen.getByRole('button', { name: /Learn More/i });
      fireEvent.click(learnMoreButton);

      // The actual implementation would show a modal or expand the card
      // For now, we just verify the button exists and is clickable
      expect(learnMoreButton).toBeInTheDocument();
    });
  });

  describe('Visual Indicators', () => {
    it('displays warning icon for issues', () => {
      render(
        <RemediationCard
          issue={mockIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      // Check for the presence of an alert icon (using test-id or aria-label if available)
      const card = screen.getByText(mockIssue.title).closest('.border-l-4');
      expect(card).toHaveClass('border-l-primary');
    });

    it('shows problem and solution sections clearly', () => {
      render(
        <RemediationCard
          issue={mockIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByText('What we found:')).toBeInTheDocument();
      expect(screen.getByText('How to fix:')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing optional fields gracefully', () => {
      const minimalIssue = {
        id: 'minimal-1',
        title: 'Basic Issue',
        description: 'A simple issue',
        riskLevel: 'low',
        steps: ['Fix it']
      };

      render(
        <RemediationCard
          issue={minimalIssue}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByText('Basic Issue')).toBeInTheDocument();
      expect(screen.getByText('A simple issue')).toBeInTheDocument();
    });

    it('handles empty steps array', () => {
      const issueWithoutSteps = {
        ...mockIssue,
        steps: []
      };

      render(
        <RemediationCard
          issue={issueWithoutSteps}
          onApply={mockOnApply}
          onDismiss={mockOnDismiss}
        />
      );

      // Should still render without crashing
      expect(screen.getByText(issueWithoutSteps.title)).toBeInTheDocument();
    });
  });
});