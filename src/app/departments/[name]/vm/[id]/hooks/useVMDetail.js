import { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// Check if IP fields are enabled via environment variable
const IP_FIELDS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_VM_IP_FIELDS === 'true';

// GraphQL queries - using inline gql instead of separate file import
const allUsers = gql`
  query allUsers($orderBy: UserOrderByInputType, $pagination: PaginationInputType) {
    users(orderBy: $orderBy, pagination: $pagination) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

const vmDetailedInfo = gql`
  query vmDetailedInfo($id: String!) {
    machine(id: $id) {
      id
      name
      status
      userId
      templateId
      createdAt
      configuration
      cpuCores
      ramGB
      gpuPciAddress
      ${IP_FIELDS_ENABLED ? `
      localIP
      publicIP
      ` : ''}
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


const UPDATE_MACHINE_HARDWARE = gql`
  mutation updateMachineHardware($input: UpdateMachineHardwareInput!) {
    updateMachineHardware(input: $input) {
      id
      name
      configuration
      status
      userId
      templateId
      createdAt
      template {
        id
        name
        description
        cores
        ram
        storage
        createdAt
        categoryId
        totalMachines
      }
      department {
        id
        name
        createdAt
        internetSpeed
        ipSubnet
        totalMachines
      }
      user {
        id
        firstName
        lastName
        role
        email
        avatar
        createdAt
      }
    }
  }
`;

const UPDATE_MACHINE_NAME = gql`
  mutation updateMachineName($input: UpdateMachineNameInput!) {
    updateMachineName(input: $input) {
      id
      name
      configuration
      status
      userId
      templateId
      createdAt
      template {
        id
        name
        description
        cores
        ram
        storage
        createdAt
        categoryId
        totalMachines
      }
      department {
        id
        name
        createdAt
        internetSpeed
        ipSubnet
        totalMachines
      }
      user {
        id
        firstName
        lastName
        role
        email
        avatar
        createdAt
      }
    }
  }
`;

const UPDATE_MACHINE_USER = gql`
  mutation updateMachineUser($input: UpdateMachineUserInput!) {
    updateMachineUser(input: $input) {
      id
      name
      configuration
      status
      userId
      templateId
      createdAt
      template {
        id
        name
        description
        cores
        ram
        storage
        createdAt
        categoryId
        totalMachines
      }
      department {
        id
        name
        createdAt
        internetSpeed
        ipSubnet
        totalMachines
      }
      user {
        id
        firstName
        lastName
        role
        email
        avatar
        createdAt
      }
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
  const isAdmin = currentUser?.role === 'ADMIN';

  // UI State
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [activeTab, setActiveTab] = useState("recommendations");

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
    errorPolicy: 'all'
  });

  // GraphQL query for users (admin only)
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError
  } = useQuery(allUsers, {
    variables: {
      orderBy: {
        fieldName: 'FIRST_NAME',
        direction: 'ASC'
      },
      pagination: {
        take: 100,
        skip: 0
      }
    },
    skip: !isAdmin,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // GraphQL mutations
  const [powerOnMutation] = useMutation(POWER_ON);
  const [powerOffMutation] = useMutation(POWER_OFF);
  const [updateMachineHardwareMutation, { loading: hardwareUpdateLoading }] = useMutation(UPDATE_MACHINE_HARDWARE);
  const [updateMachineNameMutation, { loading: nameUpdateLoading }] = useMutation(UPDATE_MACHINE_NAME);
  const [updateMachineUserMutation, { loading: userUpdateLoading }] = useMutation(UPDATE_MACHINE_USER);

  const vm = data?.machine;
  const users = usersData?.users || [];
  const error = graphqlError;

  // Show toast notification
  const showToastNotification = (variant, title, description) => {
    setToastProps({ variant, title, description });
    setShowToast(true);
  };

  // Handle VM refresh
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

    try {
      let actionText;
      let successText;

      // Show loading notification
      switch (action) {
        case 'start':
          actionText = 'start';
          successText = 'started';
          showToastNotification(
            "default",
            "Processing",
            "Attempting to " + actionText + " the virtual machine..."
          );
          await powerOnMutation({ variables: { id: vm.id } });
          break;
        case 'stop':
          actionText = 'stop';
          successText = 'stopped';
          showToastNotification(
            "default",
            "Processing",
            "Attempting to " + actionText + " the virtual machine..."
          );
          await powerOffMutation({ variables: { id: vm.id } });
          break;
        case 'restart':
          // Restart functionality is disabled for now
          showToastNotification(
            "default",
            "Function not available",
            "The restart function is not currently available."
          );
          return;
        default:
          return;
      }

      // Refresh VM data
      await refetch();

      showToastNotification(
        "success",
        "Success",
        "The virtual machine has been " + successText + " successfully."
      );

    } catch (error) {
      console.error("Error " + action + " VM:", error);
      const errorAction = action === 'start' ? 'start' : 'stop';
      showToastNotification(
        "destructive",
        "Error",
        "Could not " + errorAction + " the virtual machine."
      );
    }
  };

  // Handle hardware update (admin only)
  const handleHardwareUpdate = async (hardwareUpdate) => {
    if (!vm || !isAdmin) return;

    // Validate VM is stopped
    if (vm.status === 'running') {
      showToastNotification(
        "destructive",
        "Error",
        "VM must be stopped before updating hardware configuration."
      );
      return;
    }

    try {
      showToastNotification(
        "default",
        "Processing",
        "Updating hardware configuration..."
      );

      const input = {
        id: vm.id,
        ...hardwareUpdate
      };

      await updateMachineHardwareMutation({
        variables: { input }
      });

      await refetch();

      showToastNotification(
        "success",
        "Success",
        "Hardware configuration has been updated successfully."
      );

    } catch (error) {
      console.error("Error updating hardware:", error);
      showToastNotification(
        "destructive",
        "Error",
        "Could not update hardware configuration."
      );
    }
  };

  // Handle name update (admin only)
  const handleNameUpdate = async (newName) => {
    if (!vm || !isAdmin) return;

    // Validate name is not empty
    if (!newName || newName.trim() === '') {
      showToastNotification(
        "destructive",
        "Error",
        "VM name cannot be empty."
      );
      return;
    }

    // Don't update if name hasn't changed
    if (newName.trim() === vm.name) {
      return;
    }

    try {
      showToastNotification(
        "default",
        "Processing",
        "Updating VM name..."
      );

      const input = {
        id: vm.id,
        name: newName.trim()
      };

      await updateMachineNameMutation({
        variables: { input }
      });

      await refetch();

      showToastNotification(
        "success",
        "Success",
        "VM name has been updated successfully."
      );

    } catch (error) {
      console.error("Error updating name:", error);
      const errorMessage = error?.graphQLErrors?.[0]?.message || "Could not update VM name.";
      showToastNotification(
        "destructive",
        "Error",
        errorMessage
      );
    }
  };

  // Handle user assignment update (admin only)
  const handleUserUpdate = async (newUserId) => {
    if (!vm || !isAdmin) return;

    // Don't update if user hasn't changed
    const currentUserId = vm.userId || null;
    if (newUserId === currentUserId) {
      return;
    }

    try {
      showToastNotification(
        "default",
        "Processing",
        "Updating user assignment..."
      );

      const input = {
        id: vm.id,
        userId: newUserId
      };

      await updateMachineUserMutation({
        variables: { input }
      });

      await refetch();

      const message = newUserId
        ? "User assignment has been updated successfully."
        : "User has been unassigned successfully.";

      showToastNotification(
        "success",
        "Success",
        message
      );

    } catch (error) {
      console.error("Error updating user assignment:", error);
      const errorMessage = error?.graphQLErrors?.[0]?.message || "Could not update user assignment.";
      showToastNotification(
        "destructive",
        "Error",
        errorMessage
      );
    }
  };

  // Handle navigation back to department
  const handleBackToDepartment = () => {
    if (vm?.department?.name) {
      router.push("/departments/" + encodeURIComponent(vm.department.name));
    } else {
      router.push('/departments');
    }
  };

  // Handle escape key to navigate back
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleBackToDepartment();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [vm]);

  return {
    // State
    isLoading,
    vm,
    error,
    showToast,
    toastProps,
    activeTab,

    // Admin state
    isAdmin,
    hardwareUpdateLoading,
    nameUpdateLoading,
    userUpdateLoading,
    users,
    usersLoading,
    usersError,

    // Actions
    setActiveTab,
    setShowToast,
    refreshVM,
    handlePowerAction,
    handleBackToDepartment,
    showToastNotification,

    // Admin actions
    handleHardwareUpdate,
    handleNameUpdate,
    handleUserUpdate
  };
};
