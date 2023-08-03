import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { State } from 'types';
import { Sort__Input as Sort } from '__generated__/types';
import { fieldTimeZoneOffset } from 'utils/timeZoneOffset';
import { FormValues } from '../types/leadCallbacksGridFilter';
import {
  LeadCallbacksListQueryVariables,
  useLeadCallbacksListQuery,
} from '../graphql/__generated__/LeadCallbacksListQuery';

const useLeadCallbacksList = () => {
  const state = useLocation().state as State<FormValues>;
  const { timeZone, callbackTimeFrom, callbackTimeTo, ...rest } = state?.filters || {} as FormValues;

  const navigate = useNavigate();

  const queryVariables = {
    ...rest,
    ...fieldTimeZoneOffset('callbackTimeFrom', callbackTimeFrom, timeZone),
    ...fieldTimeZoneOffset('callbackTimeTo', callbackTimeTo, timeZone),
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
  const handleSort = useCallback((sorts: Array<Sort>) => {
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
