import { useState, useCallback } from 'react';
import { useAuthorityOptionsQuery } from '../graphql/__generated__/AuthorityOptionsQuery';

type Authorities = {
  [key: string]: Array<string>,
};

const useRbacGrid = () => {
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  // ===== Requests ===== //
  const { data, loading } = useAuthorityOptionsQuery();

  const authorities = data?.authoritiesOptions as Authorities || {};

  // ===== Handlers ===== //
  const handleSelectAuthority = useCallback((department: string, role: string) => {
    setActiveDepartment(department);
    setActiveRole(role);
  }, []);

  return {
    authorities,
    loading,
    activeDepartment,
    activeRole,
    handleSelectAuthority,
  };
};

export default useRbacGrid;
