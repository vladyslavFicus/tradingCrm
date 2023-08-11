import { useCallback } from 'react';
import { omit } from 'lodash';
import { Types } from '@crm/common';
import { unAvailableFilterDepartments } from 'routes/Operators/constants';
import { useAuthoritiesOptionsQuery, AuthoritiesOptionsQuery } from '../graphql/__generated__/AuthoritiesOptionsQuery';
import { useOfficesDesksTeamsQuery } from '../graphql/__generated__/OfficesDesksTeamsQuery';
import { FormValues } from '../types';

type AuthoritiesOptions = AuthoritiesOptionsQuery['authoritiesOptions'];

type Office = {
  name: string,
  uuid: string,
};

type OfficeWithParentBranch = Office & {
  parentBranch: { uuid: string } | null,
};

type UseOperatorsGridFilter = {
  authorities: Record<string, Array<string>>,
  availableDepartments: Omit<AuthoritiesOptions, string>,
  desks: Array<OfficeWithParentBranch>,
  teams: Array<OfficeWithParentBranch>,
  offices: Array<Office>,
  officesDesksTeamsLoading: boolean,
  handleDepartmentFieldChange: (value: string, setFieldValue: Types.SetFieldValue<FormValues>) => void,
};

const useOperatorsGridFilter = (): UseOperatorsGridFilter => {
  // ===== Requests ===== //
  const authoritiesQuery = useAuthoritiesOptionsQuery();

  const authorities: Record<string, Array<string>> = authoritiesQuery?.data?.authoritiesOptions || {};
  const allDepartmentRoles = authoritiesQuery?.data?.authoritiesOptions || {};
  const availableDepartments = omit(allDepartmentRoles, unAvailableFilterDepartments);

  const officesDesksTeamsQuery = useOfficesDesksTeamsQuery();

  const officesDesksTeamsLoading = officesDesksTeamsQuery.loading;
  const desks = officesDesksTeamsQuery.data?.userBranches?.DESK || [];
  const teams = officesDesksTeamsQuery.data?.userBranches?.TEAM || [];
  const offices = officesDesksTeamsQuery.data?.userBranches?.OFFICE || [];

  // ===== Handlers ===== //
  const handleDepartmentFieldChange = useCallback((value: string, setFieldValue: Types.SetFieldValue<FormValues>) => {
    if (value) {
      setFieldValue('authorities.department', value);
      setFieldValue('authorities.roles', undefined);
    } else {
      setFieldValue('authorities', undefined);
    }
  }, []);

  return {
    authorities,
    availableDepartments,
    desks,
    teams,
    offices,
    officesDesksTeamsLoading,
    handleDepartmentFieldChange,
  };
};

export default useOperatorsGridFilter;
