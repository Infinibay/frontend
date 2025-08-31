import { toast } from 'sonner';
import {
  updateHealthScore,
  addHealthIssue,
  updateAutoCheck,
  updateRemediationResult,
  setFirewallStatus,
  updateFirewallService,
} from '@/state/slices/health';

/**
 * Setup health-related WebSocket event listeners
 * @param {Socket} socket - Socket.io client instance
 * @param {AppDispatch} dispatch - Redux dispatch function
 */
export const setupHealthSocketListeners = (socket, dispatch) => {
  // Auto-check issue detected
  socket.on('autocheck:issue-detected', (data) => {
    const { vmId, check, severity } = data;
    
    dispatch(addHealthIssue({ vmId, issue: check }));
    
    // Show notification based on severity
    const severityMessages = {
      critical: {
        fn: toast.error,
        title: 'Critical Issue Detected',
      },
      warning: {
        fn: toast.warning,
        title: 'Warning',
      },
      info: {
        fn: toast.info,
        title: 'Information',
      },
    };
    
    const notif = severityMessages[severity] || severityMessages.info;
    notif.fn(`${notif.title}: ${check.message}`, {
      description: `VM: ${vmId}`,
      duration: 5000,
    });
  });
  
  // Remediation available
  socket.on('autocheck:remediation-available', (data) => {
    const { vmId, remediation } = data;
    
    toast.info('New remediation available', {
      description: remediation.description,
      action: {
        label: 'View',
        onClick: () => {
          // Navigate to VM health tab
          window.location.href = `/vm/${vmId}?tab=health`;
        },
      },
      duration: 7000,
    });
  });
  
  // Remediation completed
  socket.on('autocheck:remediation-completed', (data) => {
    const { vmId, result } = data;
    
    dispatch(updateRemediationResult({
      remediationId: result.remediationId,
      result,
    }));
    
    if (result.success) {
      toast.success('Remediation completed successfully', {
        description: result.message,
        duration: 5000,
      });
    } else {
      toast.error('Remediation failed', {
        description: result.message || 'Please check the logs for details',
        duration: 7000,
      });
    }
  });
  
  // Health score updated
  socket.on('health:score-updated', (data) => {
    const { vmId, score, previousScore } = data;
    
    dispatch(updateHealthScore({ vmId, score }));
    
    // Show notification if score changed significantly
    if (previousScore && Math.abs(score - previousScore) >= 10) {
      const improved = score > previousScore;
      const message = improved
        ? `Health improved: ${previousScore} → ${score}`
        : `Health degraded: ${previousScore} → ${score}`;
      
      const toastFn = improved ? toast.success : toast.warning;
      toastFn(message, {
        description: `VM ${vmId}`,
        duration: 4000,
      });
    }
  });
  
  // Auto-check started
  socket.on('autocheck:started', (data) => {
    const { vmId, checkName } = data;
    
    dispatch(updateAutoCheck({
      vmId,
      check: {
        id: `${checkName}-${Date.now()}`,
        checkName,
        status: 'running',
        message: 'Check in progress...',
      },
    }));
  });
  
  // Auto-check completed
  socket.on('autocheck:completed', (data) => {
    const { vmId, check } = data;
    
    dispatch(updateAutoCheck({ vmId, check }));
  });
  
  // Firewall status updated
  socket.on('firewall:status-updated', (data) => {
    const { vmId, status } = data;
    
    dispatch(setFirewallStatus({ vmId, status }));
  });
  
  // Firewall service toggled
  socket.on('firewall:service-toggled', (data) => {
    const { vmId, serviceId, enabled } = data;
    
    dispatch(updateFirewallService({ vmId, serviceId, enabled }));
    
    const action = enabled ? 'enabled' : 'disabled';
    toast.info(`Firewall service ${action}`, {
      description: `Service has been ${action} successfully`,
      duration: 3000,
    });
  });
  
  // Remediation approval required
  socket.on('remediation:approval-required', (data) => {
    const { vmId, remediation } = data;
    
    toast.warning('Approval required', {
      description: `${remediation.description} requires your approval`,
      action: {
        label: 'Review',
        onClick: () => {
          window.location.href = `/vm/${vmId}?tab=health&remediation=${remediation.id}`;
        },
      },
      duration: 10000,
    });
  });
  
  // Remediation rollback
  socket.on('remediation:rolled-back', (data) => {
    const { vmId, remediationId, reason } = data;
    
    toast.error('Remediation rolled back', {
      description: reason || 'The remediation was rolled back due to an error',
      duration: 7000,
    });
  });
};

/**
 * Remove health socket listeners
 * @param {Socket} socket - Socket.io client instance
 */
export const removeHealthSocketListeners = (socket) => {
  const events = [
    'autocheck:issue-detected',
    'autocheck:remediation-available',
    'autocheck:remediation-completed',
    'health:score-updated',
    'autocheck:started',
    'autocheck:completed',
    'firewall:status-updated',
    'firewall:service-toggled',
    'remediation:approval-required',
    'remediation:rolled-back',
  ];
  
  events.forEach(event => socket.off(event));
};

/**
 * Request health data for a VM
 * @param {Socket} socket - Socket.io client instance
 * @param {string} vmId - VM ID
 */
export const requestVMHealthData = (socket, vmId) => {
  socket.emit('health:request-data', { vmId });
};

/**
 * Subscribe to health updates for a VM
 * @param {Socket} socket - Socket.io client instance
 * @param {string} vmId - VM ID
 */
export const subscribeToVMHealth = (socket, vmId) => {
  socket.emit('health:subscribe', { vmId });
};

/**
 * Unsubscribe from health updates for a VM
 * @param {Socket} socket - Socket.io client instance
 * @param {string} vmId - VM ID
 */
export const unsubscribeFromVMHealth = (socket, vmId) => {
  socket.emit('health:unsubscribe', { vmId });
};