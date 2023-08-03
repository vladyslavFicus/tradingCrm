import { useCallback, useMemo } from 'react';
import { intersection, sortBy } from 'lodash';
import { getBrand } from 'config';
import { OPERATORS_SORT } from '../constants/leadsGridFilter';
import { FormValues } from '../types/leadsGridFilter';
import { useAcquisitionStatusesQuery } from '../graphql/__generated__/AcquisitionStatusesQuery';
import { useDesksAndTeamsQuery } from '../graphql/__generated__/DesksAndTeamsQuery';
import { useOperatorsQuery } from '../graphql/__generated__/OperatorsQuery';

const useLeadsGridFilter = () => {
  // ===== Requests ===== //
  const { data: desksAndTeamsData, loading: isDesksAndTeamsLoading } = useDesksAndTeamsQuery();
  const { data: acquisitionStatusesData, loading: isAcquisitionStatusesLoading } = useAcquisitionStatusesQuery({
    variables: { brandId: getBrand().id },
  });

  const { data: operatorsData, loading: isOperatorsLoading } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
  });
  const operators = operatorsData?.operators?.content || [];

  // ===== Handlers ===== //
  const filterOperatorsByBranch = useCallback((uuids: Array<string | null>) => (
    operators.filter((operator) => {
      const parentBranches = operator.hierarchy?.parentBranches || [];
      const branches = parentBranches.map(({ uuid }) => uuid) || [];

      return intersection(branches, uuids).length;
    })
  ), [operators]);

  const filterOperators = useCallback(({ desks, teams }: FormValues) => {
    if (teams && teams.length) {
      return filterOperatorsByBranch(teams);
    }

    if (desks && desks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsList = desksAndTeamsData?.userBranches?.TEAM || [];
      const teamsByDesks = teamsList.filter(team => desks.includes(team?.parentBranch?.uuid as string))
        .map(({ uuid }) => uuid);
      const uuids = [...desks, ...teamsByDesks];

      return filterOperatorsByBranch(uuids);
    }

    return operators;
  }, [desksAndTeamsData]);

  const salesStatuses = useMemo(() => (
    sortBy(acquisitionStatusesData?.settings.salesStatuses || [], 'status')
  ), [acquisitionStatusesData]);

  return {
    desksAndTeamsData,
    isDesksAndTeamsLoading,
    isAcquisitionStatusesLoading,
    isOperatorsLoading,
    filterOperators,
    salesStatuses,
  };
};

export default useLeadsGridFilter;
