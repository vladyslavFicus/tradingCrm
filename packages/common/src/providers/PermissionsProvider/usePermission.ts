import { useContext } from 'react';
import { Permission } from '../../types/permissions';
import { PermissionContext } from './PermissionProvider';

const usePermission = (): Permission => {
  const { permission } = useContext(PermissionContext);

  return permission;
};

export default usePermission;
