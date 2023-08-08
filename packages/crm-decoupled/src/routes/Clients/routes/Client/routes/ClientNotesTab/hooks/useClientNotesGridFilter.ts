import { omit } from 'lodash';
import { Config } from '@crm/common';
import { usePermission } from 'providers/PermissionsProvider';
import { useAuthoritiesOptionsQuery } from '../graphql/__generated__/AuthorityOptionsQuery';

const useClientNotesGridFilter = () => {
  // ===== Permissions ===== //
  const permission = usePermission();
  const deniesAuthoritiesOptions = permission.denies(Config.permissions.AUTH.GET_AUTHORITIES);

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
