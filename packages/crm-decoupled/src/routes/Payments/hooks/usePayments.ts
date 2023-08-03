import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cloneDeep, set, compact } from 'lodash';
import { State } from 'types';
import { Sort__Input as Sort } from '__generated__/types';
import { statusMapper, statuses } from 'constants/payment';
import { FiltersFormValues } from 'components/PaymentsListFilters';
import { fieldTimeZoneOffset } from 'utils/timeZoneOffset';
import { usePaymentsQuery, PaymentsQueryVariables } from '../graphql/__generated__/PaymentsQuery';
import { usePartnersQuery } from '../graphql/__generated__/PartnersQuery';

const usePayments = () => {
  const state = useLocation().state as State<FiltersFormValues>;

  const navigate = useNavigate();

  const {
    timeZone,
    statusChangedTimeFrom,
    statusChangedTimeTo,
    creationTimeFrom,
    creationTimeTo,
    modificationTimeFrom,
    modificationTimeTo,
    ...rest
  } = state?.filters || { accountType: 'LIVE' } as FiltersFormValues;

  const queryVariables = {
    args: {
      ...rest,
      ...fieldTimeZoneOffset('statusChangedTimeFrom', statusChangedTimeFrom, timeZone),
      ...fieldTimeZoneOffset('statusChangedTimeTo', statusChangedTimeTo, timeZone),
      ...fieldTimeZoneOffset('creationTimeFrom', creationTimeFrom, timeZone),
      ...fieldTimeZoneOffset('creationTimeTo', creationTimeTo, timeZone),
      ...fieldTimeZoneOffset('modificationTimeFrom', modificationTimeFrom, timeZone),
      ...fieldTimeZoneOffset('modificationTimeTo', modificationTimeTo, timeZone),
      statuses: state?.filters?.statuses
        ? compact(state?.filters?.statuses).map(item => statusMapper[item as statuses]).flat()
        : undefined,
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts,
      },
    },
  };

  // ===== Requests ===== //
  const paymentsQuery = usePaymentsQuery({
    variables: queryVariables as PaymentsQueryVariables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: { batch: false },
  });

  const { data: paymentsData, fetchMore, variables = {}, refetch, loading: paymentsLoading } = paymentsQuery;
  const { content = [], totalElements = 0, last = false, number = 0 } = paymentsData?.payments || {};

  const partnersQuery = usePartnersQuery();
  const { data: partnersData, loading: partnersLoading } = partnersQuery;

  const partners = partnersData?.partners?.content || [];

  // ===== Handlers ===== //
  const handleRefetch = useCallback(() => {
    refetch({
      args: {
        ...state?.filters,
        requestId: Math.random().toString(36).slice(2),
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    });
  }, [state]);

  const handleFetchMore = useCallback(() => {
    fetchMore({
      variables: set(cloneDeep(variables), 'args.page.from', number + 1),
    });
  }, [variables, number]);

  const handleSort = useCallback((sorts: Array<Sort>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [state]);

  return {
    state,
    totalElements,
    partners,
    partnersLoading,
    paymentsQuery,
    paymentsLoading,
    content,
    last,
    refetch,
    handleRefetch,
    handleFetchMore,
    handleSort,
  };
};

export default usePayments;
