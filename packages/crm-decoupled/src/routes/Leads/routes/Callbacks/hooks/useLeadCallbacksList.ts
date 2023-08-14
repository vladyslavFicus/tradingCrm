import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Utils, Types } from '@crm/common';
import { FormValues } from '../types/leadCallbacksGridFilter';
import {
  LeadCallbacksListQueryVariables,
  useLeadCallbacksListQuery,
} from '../graphql/__generated__/LeadCallbacksListQuery';

const useLeadCallbacksList = () => {
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
  const leadCallbacksListQuery = useLeadCallbacksListQuery({
    variables: queryVariables as LeadCallbacksListQueryVariables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: { batch: false },
  });

  const { data, refetch } = leadCallbacksListQuery;
  const totalElements = data?.leadCallbacks.totalElements;

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
    state,
    leadCallbacksListQuery,
    totalElements,
    refetch,
    handleSort,
  };
};

export default useLeadCallbacksList;
