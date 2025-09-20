/**
 * Groups machines by department or returns them all in a single group
 * @param {boolean} byDepartment - Whether to group by department
 * @param {Array} machines - Array of machine objects
 * @returns {Object} Grouped machines object
 */
export function groupMachinesByDepartment(byDepartment, machines, departments) {
  if (!byDepartment) return { All: machines };
  let groupedByDepartment = {};

  departments.forEach((department) => {
    groupedByDepartment[department.id] = { name: department.name, machines: [] };
  });

  return machines.reduce((acc, machine) => {
    const department = machine.department || { id: "uncategorized", name: "Uncategorized" };
    if (!acc[department.id]) {
      acc[department.id] = {
        name: department.name,
        machines: []
      };
    }
    acc[department.id].machines.push(machine);
    return acc;
  }, groupedByDepartment);
}

/**
 * Robustly counts machines for both by-department and flat modes
 * @param {Object} groupedMachines - Grouped machines object
 * @returns {number} Total count of machines
 */
export function countMachines(groupedMachines) {
  if (!groupedMachines || typeof groupedMachines !== 'object') {
    return 0;
  }

  return Object.values(groupedMachines).reduce((count, group) => {
    // Handle both flat mode (group is array) and department mode (group has machines property)
    if (Array.isArray(group)) {
      return count + group.length;
    } else if (group && Array.isArray(group.machines)) {
      return count + group.machines.length;
    }
    return count;
  }, 0);
}
