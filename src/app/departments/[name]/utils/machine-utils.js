/**
 * Utility functions for handling machine data
 */

/**
 * Sorts machines based on the provided criteria
 * @param {Array} machines - Array of machine objects
 * @param {string} sortBy - Field to sort by (e.g., "name", "username")
 * @param {string} sortDirection - Sort direction ("asc" or "desc")
 * @returns {Array} - Sorted array of machines
 */
// The machines query returns user { firstName lastName email } — there is no
// `name` field, so build a display label from the real fields.
const userLabel = (user) => {
  if (!user) return '';
  const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return full || user.email || '';
};

export const getSortedMachines = (machines, sortBy, sortDirection) => {
  if (!machines || !machines.length) return [];
  
  return [...machines].sort((a, b) => {
    let valueA, valueB;
    
    if (sortBy === "name") {
      valueA = (a.name || '').toLowerCase();
      valueB = (b.name || '').toLowerCase();
    } else if (sortBy === "username") {
      valueA = userLabel(a.user).toLowerCase();
      valueB = userLabel(b.user).toLowerCase();
    }
    
    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Filters machines by department name
 * @param {Array} vms - Array of all VMs
 * @param {string} departmentName - Department name to filter by
 * @returns {Array} - Filtered array of machines
 */
export const filterMachinesByDepartment = (vms, departmentName) => {
  if (!vms || !departmentName) return [];
  return vms.filter(vm => vm.department?.name?.toLowerCase() === departmentName.toLowerCase());
};
