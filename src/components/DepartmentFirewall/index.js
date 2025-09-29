/**
 * DepartmentFirewall Components
 *
 * This module provides a user-friendly firewall rule creation wizard that simplifies
 * the complex process of configuring firewall rules for department-level virtual machines.
 *
 * The wizard follows a Direction → Service → Customization → Review flow, using everyday
 * language and smart defaults to guide users through creating secure firewall configurations.
 */

// Main wizard component
export { default as DepartmentFirewallWizard } from './DepartmentFirewallWizard';

// Individual step components are now available from the shared FirewallRuleWizard
// Re-export them here for backward compatibility
export {
  DirectionStep,
  ServiceStep,
  CustomizationStep,
  ReviewStep
} from '@/components/FirewallRuleWizard';

/**
 * DepartmentFirewallWizard - Main wizard component
 *
 * A comprehensive firewall rule creation wizard that guides users through:
 * 1. Direction & Action selection (What & Where)
 * 2. Service type selection with common presets
 * 3. Customization with progressive disclosure
 * 4. Review with risk assessment and plain language summary
 *
 * Features:
 * - User-friendly language instead of technical jargon
 * - Smart defaults and auto-configuration
 * - Real-time risk assessment and validation
 * - Department impact warnings
 * - Conflict detection with existing rules
 * - Progressive disclosure for advanced options
 *
 * @param {string} departmentId - ID of the department to create rules for
 * @param {string} departmentName - Name of the department for display
 * @param {Array} departmentFilters - Existing filters for the department
 * @param {Function} onRuleChange - Callback when a rule is created/updated
 * @param {Function} onComplete - Optional callback when wizard completes
 */

/**
 * DirectionStep - First step: Action and direction selection
 *
 * Presents the fundamental choice of what the user wants to accomplish:
 * - Action: Allow, Block, or Reject traffic
 * - Direction: Incoming or Outgoing connections
 *
 * Uses large clickable cards with icons and everyday language explanations.
 */

/**
 * ServiceStep - Second step: Service type selection
 *
 * Provides common service categories with user-friendly descriptions:
 * - Web Services (HTTP/HTTPS)
 * - Remote Access (SSH/RDP)
 * - File Sharing (FTP/SFTP)
 * - Email Services (SMTP/POP3/IMAP)
 * - Database Access (MySQL/PostgreSQL/etc.)
 * - Custom Service configuration
 *
 * Auto-configures ports and protocols based on service selection.
 */

/**
 * CustomizationStep - Third step: Rule customization
 *
 * Offers basic customization with progressive disclosure:
 * - Target selection (All department, Specific IPs, External)
 * - Priority levels (High, Normal, Low)
 * - Optional description
 * - Advanced options (IP ranges, custom priority)
 *
 * Includes real-time risk assessment and validation feedback.
 */

/**
 * ReviewStep - Final step: Review and confirmation
 *
 * Displays comprehensive rule summary:
 * - Plain language rule description
 * - Risk assessment with color-coded indicators
 * - Department impact warnings
 * - Conflict detection results
 * - Technical details in collapsible section
 * - Final confirmation checkbox
 *
 * Shows suggested alternatives for high-risk configurations.
 */