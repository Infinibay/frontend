/**
 * Groups machines by department or returns them all in a single group
 * @param {boolean} byDepartment - Whether to group by department
 * @param {Array} machines - Array of machine objects
 * @returns {Object} Grouped machines object
 */
export function groupMachinesByDepartment(byDepartment, machines) {
  if (!byDepartment) return { All: machines };
  
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
  }, {});
}
