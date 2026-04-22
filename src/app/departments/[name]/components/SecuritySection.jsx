import { useSelector } from 'react-redux';
import { LoadingOverlay } from '@infinibay/harbor';
import DepartmentSecurityTab from './DepartmentSecurityTab';

const SecuritySection = ({ departmentId }) => {
  const department = useSelector((state) =>
    state.departments.items.find((d) => d.id === departmentId),
  );

  if (!department) {
    return <LoadingOverlay label="Loading department…" />;
  }

  return <DepartmentSecurityTab department={department} />;
};

export default SecuritySection;
