import { useCallback } from 'react';
import { intersection } from 'lodash';
import { OPERATORS_SORT } from '../constants/notificationGridFilter';
import { FormValues } from '../types/notificationGridFilters';
import { useNotificationTypesQuery } from '../graphql/__generated__/NotificationTypesQuery';
import { useDesksTeamsQuery } from '../graphql/__generated__/DesksTeamsQuery';
import { useOperatorsQuery } from '../graphql/__generated__/OperatorsQuery';

const useNotificationsGridFilters = () => {
  // ===== Requests ===== //
  const { data: notificationTypesQueryData, loading: notificationTypesLoading } = useNotificationTypesQuery();

  const notificationTypesData = notificationTypesQueryData?.notificationCenterTypes || {};
  const notificationTypes = Object.keys(notificationTypesData);

  const { data: desksTeamsData, loading: desksTeamsLoading } = useDesksTeamsQuery();

  const desks = desksTeamsData?.userBranches?.DESK || [];
  const teams = desksTeamsData?.userBranches?.TEAM || [];

  const { data: operatorsData, loading: operatorsLoading } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
  });

  const operators = operatorsData?.operators?.content || [];

  // ===== Handlers ===== //
  const filterOperatorsByBranch = useCallback((uuids: Array<string>) => (
    operators.filter((operator) => {
      const partnerBranches = operator.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  ), [operators]);

  const filterOperators = useCallback(({ operatorDesks, operatorTeams }: FormValues) => {
    if (operatorTeams?.length) {
      return filterOperatorsByBranch(operatorTeams);
    }

    if (operatorDesks?.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsByDesks = teams
        .filter(team => team.parentBranch && operatorDesks.includes(team.parentBranch.uuid))
        .map(({ uuid }) => uuid);

      return filterOperatorsByBranch([...operatorDesks, ...teamsByDesks]);
    }

    return operators;
  }, [teams, filterOperatorsByBranch]);

  return {
    teams,
    desks,
    notificationTypes,
    notificationTypesData,
    notificationTypesLoading,
    desksTeamsLoading,
    operatorsLoading,
    filterOperators,
  };
};

export default useNotificationsGridFilters;
