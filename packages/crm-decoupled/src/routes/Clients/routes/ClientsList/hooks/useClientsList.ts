import { useCallback, useEffect, useState } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { Utils } from '@crm/common';
import { State, TableSelection } from 'types';
import usePrevious from 'hooks/usePrevious';
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
        ...Utils.fieldTimeZoneOffset('from', affiliateFtdDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', affiliateFtdDateRange?.to, timeZone),
      } }),
      ...(firstDepositDateRange && { firstDepositDateRange: {
        ...Utils.fieldTimeZoneOffset('from', firstDepositDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', firstDepositDateRange?.to, timeZone),
      } }),
      ...(firstNoteDateRange && { firstNoteDateRange: {
        ...Utils.fieldTimeZoneOffset('from', firstNoteDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', firstNoteDateRange?.to, timeZone),
      } }),
      ...(lastCallDateRange && { lastCallDateRange: {
        ...Utils.fieldTimeZoneOffset('from', lastCallDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', lastCallDateRange?.to, timeZone),
      } }),
      ...(lastLoginDateRange && { lastLoginDateRange: {
        ...Utils.fieldTimeZoneOffset('from', lastLoginDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', lastLoginDateRange?.to, timeZone),
      } }),
      ...(lastModificationDateRange && { lastModificationDateRange: {
        ...Utils.fieldTimeZoneOffset('from', lastModificationDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', lastModificationDateRange?.to, timeZone),
      } }),
      ...(lastNoteDateRange && { lastNoteDateRange: {
        ...Utils.fieldTimeZoneOffset('from', lastNoteDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', lastNoteDateRange?.to, timeZone),
      } }),
      ...(lastTradeDateRange && { lastTradeDateRange: {
        ...Utils.fieldTimeZoneOffset('from', lastTradeDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', lastTradeDateRange?.to, timeZone),
      } }),
      ...(registrationDateRange && { registrationDateRange: {
        ...Utils.fieldTimeZoneOffset('from', registrationDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', registrationDateRange?.to, timeZone),
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
