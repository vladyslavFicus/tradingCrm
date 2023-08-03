import { useContext } from 'react';
import { Permission } from 'types/permissions';
import { PermissionContext } from './PermissionProvider';

export const usePermission = (): Permission => {
  const { permission } = useContext(PermissionContext);

  return permission;
};
