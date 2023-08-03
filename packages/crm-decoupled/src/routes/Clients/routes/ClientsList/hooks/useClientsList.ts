import { useCallback, useEffect, useState } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { State, TableSelection } from 'types';
import usePrevious from 'hooks/usePrevious';
import { fieldTimeZoneOffset } from 'utils/timeZoneOffset';
import { FormValues } from '../types';
import { ClientsListQueryVariables, useClientsListQuery } from '../graphql/__generated__/ClientsQuery';

const useClientsList = () => {
  const [select, setSelect] = useState<TableSelection | null>(null);

  const state = useLocation().state as State<FormValues>;

  const {
    timeZone,
    affiliateFtdDateRange,
    firstDepositDateRange,
    firstNoteDateRange,
    lastCallDateRange,
    lastLoginDateRange,
    lastModificationDateRange,
    lastNoteDateRange,
    lastTradeDateRange,
    registrationDateRange,
    ...rest
  } = state?.filters || {} as FormValues;

  const queryVariables = {
    args: {
      ...rest,
      ...(affiliateFtdDateRange && { affiliateFtdDateRange: {
        ...fieldTimeZoneOffset('from', affiliateFtdDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', affiliateFtdDateRange?.to, timeZone),
      } }),
      ...(firstDepositDateRange && { firstDepositDateRange: {
        ...fieldTimeZoneOffset('from', firstDepositDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', firstDepositDateRange?.to, timeZone),
      } }),
      ...(firstNoteDateRange && { firstNoteDateRange: {
        ...fieldTimeZoneOffset('from', firstNoteDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', firstNoteDateRange?.to, timeZone),
      } }),
      ...(lastCallDateRange && { lastCallDateRange: {
        ...fieldTimeZoneOffset('from', lastCallDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', lastCallDateRange?.to, timeZone),
      } }),
      ...(lastLoginDateRange && { lastLoginDateRange: {
        ...fieldTimeZoneOffset('from', lastLoginDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', lastLoginDateRange?.to, timeZone),
      } }),
      ...(lastModificationDateRange && { lastModificationDateRange: {
        ...fieldTimeZoneOffset('from', lastModificationDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', lastModificationDateRange?.to, timeZone),
      } }),
      ...(lastNoteDateRange && { lastNoteDateRange: {
        ...fieldTimeZoneOffset('from', lastNoteDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', lastNoteDateRange?.to, timeZone),
      } }),
      ...(lastTradeDateRange && { lastTradeDateRange: {
        ...fieldTimeZoneOffset('from', lastTradeDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', lastTradeDateRange?.to, timeZone),
      } }),
      ...(registrationDateRange && { registrationDateRange: {
        ...fieldTimeZoneOffset('from', registrationDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', registrationDateRange?.to, timeZone),
      } }),
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts,
      },
    },
  };

  // ===== Requests ===== //
  const clientsQuery = useClientsListQuery({
    variables: queryVariables as ClientsListQueryVariables,
    fetchPolicy: 'network-only',
  });
  const { networkStatus, loading, refetch } = clientsQuery;
  const prevClientsQuery = usePrevious(loading);

  useEffect(() => {
    // Clear selecting when filters or sorting changed
    if (networkStatus === NetworkStatus.setVariables && !prevClientsQuery && select) {
      select.reset();
    }
  }, [networkStatus]);

  const onSelect = useCallback((values: TableSelection) => {
    setSelect(values);
  }, []);

  return {
    clientsQuery,
    select,
    loading,
    refetch,
    onSelect,
    sorts: state?.sorts || [],
  };
};

export default useClientsList;
