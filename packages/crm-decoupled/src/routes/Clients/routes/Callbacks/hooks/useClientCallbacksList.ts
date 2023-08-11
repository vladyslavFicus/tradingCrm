import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Utils, Types } from '@crm/common';

import { FormValues } from 'routes/Clients/routes/Callbacks/types';
import {
  useClientCallbacksListQuery,
  ClientCallbacksListQueryVariables,
} from '../graphql/__generated__/ClientCallbacksListQuery';

const useClientCallbacksList = () => {
  const state = useLocation().state as Types.State<FormValues>;
  const { timeZone, callbackTimeFrom, callbackTimeTo, ...rest } = state?.filters || {} as FormValues;

  const navigate = useNavigate();

  const queryVariables = {
    ...rest,
    ...Utils.fieldTimeZoneOffset('callbackTimeFrom', callbackTimeFrom, timeZone),
    ...Utils.fieldTimeZoneOffset('callbackTimeTo', callbackTimeTo, timeZone),
    page: {
      from: 0,
      size: 20,
      sorts: state?.sorts,
    },
  };

  // ===== Requests ===== //
  const clientCallbacksListQuery = useClientCallbacksListQuery({
    variables: queryVariables as ClientCallbacksListQueryVariables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: { batch: false },
  });

  // ===== Handlers ===== //
  const handleSort = useCallback((sorts: Array<Types.Sort>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [navigate, state]);

  return {
    totalElements: clientCallbacksListQuery.data?.clientCallbacks.totalElements,
    clientCallbacksListQuery,
    sorts: state?.sorts || [],
    handleSort,
  };
};

export default useClientCallbacksList;
