import { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

// Check if IP fields are enabled via environment variable
const IP_FIELDS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_VM_IP_FIELDS === 'true';

// GraphQL queries - using inline gql instead of separate file import
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

/**
 * Custom hook for managing VM detail page state and logic
 */
export const useVMDetail = (vmId) => {
  const router = useRouter();

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

  // GraphQL mutations
  const [powerOnMutation] = useMutation(POWER_ON);
  const [powerOffMutation] = useMutation(POWER_OFF);

  const vm = data?.machine;
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
        "Actualizado",
        "La información de la VM se ha actualizado correctamente."
      );
    } catch (error) {
      console.error("Error refreshing VM:", error);
      showToastNotification(
        "destructive",
        "Error",
        "No se pudo actualizar la información de la VM."
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
          actionText = 'iniciar';
          successText = 'iniciado';
          showToastNotification(
            "default",
            "Procesando",
            "Intentando " + actionText + " la máquina virtual..."
          );
          await powerOnMutation({ variables: { id: vm.id } });
          break;
        case 'stop':
          actionText = 'detener';
          successText = 'detenido';
          showToastNotification(
            "default",
            "Procesando",
            "Intentando " + actionText + " la máquina virtual..."
          );
          await powerOffMutation({ variables: { id: vm.id } });
          break;
        case 'restart':
          // Restart functionality is disabled for now
          showToastNotification(
            "default",
            "Función no disponible",
            "La función de reinicio no está disponible actualmente."
          );
          return;
        default:
          return;
      }

      // Refresh VM data
      await refetch();

      showToastNotification(
        "success",
        "Éxito",
        "La máquina virtual se ha " + successText + " correctamente."
      );

    } catch (error) {
      console.error("Error " + action + " VM:", error);
      const errorAction = action === 'start' ? 'iniciar' : 'detener';
      showToastNotification(
        "destructive",
        "Error",
        "No se pudo " + errorAction + " la máquina virtual."
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

    // Actions
    setActiveTab,
    setShowToast,
    refreshVM,
    handlePowerAction,
    handleBackToDepartment,
    showToastNotification
  };
};
