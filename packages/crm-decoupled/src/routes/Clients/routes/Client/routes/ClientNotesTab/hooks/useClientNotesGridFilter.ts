import { omit } from 'lodash';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { useAuthoritiesOptionsQuery } from '../graphql/__generated__/AuthorityOptionsQuery';

const useClientNotesGridFilter = () => {
  // ===== Permissions ===== //
  const permission = usePermission();
  const deniesAuthoritiesOptions = permission.denies(permissions.AUTH.GET_AUTHORITIES);

  // ===== Requests ===== //
  const { data, loading } = useAuthoritiesOptionsQuery({ skip: deniesAuthoritiesOptions });
  const allDepartmentRoles = data?.authoritiesOptions || {};
  const departmentRoles = omit(allDepartmentRoles, ['PLAYER', 'AFFILIATE']);

  return {
    loading,
    departmentRoles,
  };
};

export default useClientNotesGridFilter;
