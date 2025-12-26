import React from 'react';
import { useSelector } from 'react-redux';
import DepartmentSecurityTab from './DepartmentSecurityTab';

const SecuritySection = ({ departmentId }) => {
  const department = useSelector((state) =>
    state.departments.items.find((d) => d.id === departmentId)
  );

  if (!department) {
    return <div className="p-4 text-muted-foreground">Cargando departamento...</div>;
  }

  return <DepartmentSecurityTab department={department} />;
};

export default SecuritySection;
