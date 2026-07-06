import { useCallback, useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getPowerActionError } from "@/utils/powerActionResult";
import { getSocketService } from "@/services/socketService";
import { useRestartMachineMutation, useResetMachineMutation } from "@/gql/hooks";

const vmDetailedInfo = gql`
  query vmDetailedInfo($id: String!) {
    machine(id: $id) {
      id
      name
      status
      setupComplete
      nodeId
      userId
      templateId
      createdAt
      configuration
      cpuCores
      ramGB
      gpuPciAddress
      os
      localIP
      department {
        id
        name
      }
      template {
        id
        name
        description
        cores
        ram
        storage
      }
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

// GraphQL mutations - using proper mutation definitions
const POWER_ON = gql`
  mutation powerOn($id: String!) {
    powerOn(id: $id) {
      success
      message
    }
  }
`;

const POWER_OFF = gql`
  mutation powerOff($id: String!) {
    powerOff(id: $id) {
      success
      message
    }
  }
`;

/**
 * Custom hook for managing VM detail page state and logic
 */
export const useVMDetail = (vmId) => {
  const router = useRouter();

  // Redux selectors
  const currentUser = useSelector(state => state.auth.user);
  const isAdmin = (currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN');

  // UI State
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  // True while a powerOn/powerOff mutation is in flight, so the caller can
  // disable the Start/Stop control and prevent double-submits (the mapped VM
  // status alone stays 'online'/'offline' during the request).
  const [powerActionLoading, setPowerActionLoading] = useState(false);

  // GraphQL query for VM data
  const {
    data,
    loading: isLoading,
    error: graphqlError,
    refetch
  } = useQuery(vmDetailedInfo, {
    variables: { id: vmId },
    skip: !vmId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    // Defense-in-depth: socket-driven reloadVM() refetches must NOT flip isLoading
    // (which page.js uses to blank the whole page). Explicit here so this holds even
    // if the global default is ever changed back.
    notifyOnNetworkStatusChange: false,
  });

  // GraphQL mutations
  const [powerOnMutation] = useMutation(POWER_ON);
  const [powerOffMutation] = useMutation(POWER_OFF);
  // Reboot variants (backend already implements both). restartMachine is a
  // graceful shutdown-then-boot; resetMachine is a hardware reset (QMP
  // system_reset) for when the guest is unresponsive.
  const [restartMachineMutation] = useRestartMachineMutation();
  const [resetMachineMutation] = useResetMachineMutation();

  const vm = data?.machine;
  const error = graphqlError;

  // Show toast notification
  const showToastNotification = (variant, title, description) => {
    setToastProps({ variant, title, description });
    setShowToast(true);
  };

  // Silent refetch for programmatic use (post-migrate, post-domain-join, socket
  // events). Does NOT toast — the caller already surfaces its own feedback, so a
  // toast here would double up.
  const reloadVM = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing VM:", error);
    }
  }, [refetch]);

  // Explicit user-initiated refresh (header Refresh button) — toasts so the
  // click has visible feedback.
  const refreshVM = async () => {
    try {
      await refetch();
      showToastNotification(
        "success",
        "Updated",
        "VM information has been updated successfully."
      );
    } catch (error) {
      console.error("Error refreshing VM:", error);
      showToastNotification(
        "destructive",
        "Error",
        "Could not update VM information."
      );
    }
  };

  // Handle power actions
  const handlePowerAction = async (action) => {
    if (!vm) return;
    // Guard against double-submit: the mapped VM status stays online/offline
    // while the mutation is in flight, so only this flag prevents a second click.
    if (powerActionLoading) return;

    setPowerActionLoading(true);
    try {
      let successText;

      // Show loading notification
      switch (action) {
        case 'start':
          successText = 'is starting up';
          showToastNotification(
            "default",
            "Processing",
            "Attempting to start the desktop..."
          );
          {
            // powerOn resolves the async start and returns SuccessType
            // { success, message }. Apollo only THROWS on a GraphQL/transport
            // error, so a resolver returning success:false (e.g. QEMU failed to
            // start) must be inspected explicitly — otherwise we falsely report
            // success. See getPowerActionError.
            const { data } = await powerOnMutation({ variables: { id: vm.id } });
            const failure = getPowerActionError('start', data);
            if (failure) throw new Error(failure);
          }
          break;
        case 'stop':
          successText = 'is powering off';
          showToastNotification(
            "default",
            "Processing",
            "Attempting to stop the desktop..."
          );
          {
            const { data } = await powerOffMutation({ variables: { id: vm.id } });
            const failure = getPowerActionError('stop', data);
            if (failure) throw new Error(failure);
          }
          break;
        case 'restart':
          successText = 'is rebooting';
          showToastNotification(
            "default",
            "Processing",
            "Attempting to reboot the desktop..."
          );
          {
            // Graceful reboot: backend does a shutdown-then-boot. Same
            // success:false-with-HTTP-200 caveat as start/stop, so inspect the
            // result explicitly.
            const { data } = await restartMachineMutation({ variables: { id: vm.id } });
            const result = data?.restartMachine;
            if (result && result.success === false) {
              throw new Error(result.message || "Could not reboot the desktop.");
            }
          }
          break;
        case 'reset':
          successText = 'is being force-reset';
          showToastNotification(
            "default",
            "Processing",
            "Force-resetting the desktop..."
          );
          {
            // Hardware reset (QMP system_reset) — instant power-cycle for an
            // unresponsive guest, no graceful shutdown.
            const { data } = await resetMachineMutation({ variables: { id: vm.id } });
            const result = data?.resetMachine;
            if (result && result.success === false) {
              throw new Error(result.message || "Could not reset the desktop.");
            }
          }
          break;
        default:
          return;
      }

      // Refresh VM data
      await refetch();

      // The mutation only REQUESTS the transition — a graceful start/shutdown
      // can take 30–120s. Report the request, not a completed state; the status
      // badge confirms when it actually finishes.
      showToastNotification(
        "success",
        "Request sent",
        "The desktop " + successText + ". The status will update when it completes."
      );

    } catch (error) {
      console.error("Error " + action + " VM:", error);
      const errorAction = action === 'start' ? 'start' : 'stop';
      // Prefer the server-provided reason (e.g. "failed to initialize spice
      // server") over a generic message so the user knows WHY it failed.
      const detail = error?.message && typeof error.message === 'string'
        ? error.message
        : "Could not " + errorAction + " the desktop.";
      showToastNotification(
        "destructive",
        "Error",
        detail
      );
    } finally {
      setPowerActionLoading(false);
    }
  };

  // Handle navigation back to department
  const handleBackToDepartment = useCallback(() => {
    if (vm?.department?.name) {
      router.push("/departments/" + encodeURIComponent(vm.department.name));
    } else {
      router.push('/departments');
    }
  }, [router, vm]);

  // Keep this page's Apollo-rendered VM in sync with realtime backend events.
  // The vmDetailedInfo query has no pollInterval, and status changes are only
  // pushed into the Redux vms slice (which this page never reads) — so without
  // this subscription the header/status would stay stale until a manual Refresh.
  useEffect(() => {
    if (!vmId) return undefined;
    const socketService = getSocketService();
    // Coalesce bursts of VM events (status_changed + update + telemetry can arrive
    // within milliseconds of a single transition) into ONE trailing refetch, so we
    // don't fire a stream of overlapping network requests per power action.
    let debounceTimer = null;
    const scheduleReload = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        reloadVM();
      }, 400);
    };
    const unsubscribe = socketService.subscribeToAllResourceEvents(
      "vms",
      (_action, event) => {
        // Events carry the changed VM under event.data; only react to ours.
        if (event?.data?.id && event.data.id !== vmId) return;
        scheduleReload();
      },
      ["create", "update", "delete", "power_on", "power_off", "suspend", "status_changed"]
    );
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      unsubscribe?.();
    };
  }, [vmId, reloadVM]);

  return {
    // State
    isLoading,
    vm,
    error,
    showToast,
    toastProps,
    activeTab,
    powerActionLoading,

    // Admin state
    isAdmin,

    // Actions
    setActiveTab,
    setShowToast,
    refreshVM,
    reloadVM,
    handlePowerAction,
    handleBackToDepartment,
    showToastNotification,
  };
};
