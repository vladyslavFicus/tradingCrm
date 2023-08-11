import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Types } from '@crm/common';
import { useNotificationsQuery, NotificationsQueryVariables } from '../graphql/__generated__/NotificationsQuery';

const useNotifications = () => {
  const state = useLocation().state as Types.State<NotificationsQueryVariables>;

  // ===== Requests ===== //
  const { data, loading, variables, refetch, fetchMore } = useNotificationsQuery({
    variables: {
      args: {
        ...state?.filters as NotificationsQueryVariables,
        hierarchical: true,
        page: {
          from: 0,
          size: 20,
        },
      },
    },
  });

  const { content = [], last = true, totalElements = 0, number = 0 } = data?.notificationCenter || {};

  // ===== Handlers ===== //
  const handleFetchMore = useCallback(() => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as NotificationsQueryVariables), 'args.page.from', number + 1),
      });
    }
  }, [loading, variables, number]);

  return {
    content,
    loading,
    last,
    totalElements,
    refetch,
    handleFetchMore,
  };
};

export default useNotifications;
