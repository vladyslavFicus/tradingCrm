import { useEffect, useState, useCallback } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { State, TableSelection } from 'types';
import usePrevious from 'hooks/usePrevious';
import { fieldTimeZoneOffset } from 'utils/timeZoneOffset';
import { FormValues } from '../types/leadsGridFilter';
import { LeadsListQueryVariables, useLeadsListQuery } from '../graphql/__generated__/LeadsListQuery';

const useLeadsList = () => {
  const [select, setSelect] = useState<TableSelection | null>(null);

  const state = useLocation().state as State<FormValues>;

  const {
    timeZone,
    lastCallDateFrom,
    lastCallDateTo,
    lastNoteDateFrom,
    lastNoteDateTo,
    registrationDateEnd,
    registrationDateStart,
    ...rest
  } = state?.filters || {} as FormValues;

  const queryVariables = {
    args: {
      ...rest,
      ...fieldTimeZoneOffset('lastCallDateFrom', lastCallDateFrom, timeZone),
      ...fieldTimeZoneOffset('lastCallDateTo', lastCallDateTo, timeZone),
      ...fieldTimeZoneOffset('lastNoteDateFrom', lastNoteDateFrom, timeZone),
      ...fieldTimeZoneOffset('lastNoteDateTo', lastNoteDateTo, timeZone),
      ...fieldTimeZoneOffset('registrationDateEnd', registrationDateEnd, timeZone),
      ...fieldTimeZoneOffset('registrationDateStart', registrationDateStart, timeZone),
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts,
      },
    },
  };

  // ===== Requests ===== //
  const leadsQuery = useLeadsListQuery({
    variables: queryVariables as LeadsListQueryVariables,
  });

  const { refetch, loading, networkStatus } = leadsQuery;
  const prevLeadsQuery = usePrevious(loading);

  // ===== Handlers ===== //
  const handleSelect = useCallback((selectedLeads: TableSelection) => {
    setSelect(selectedLeads);
  }, []);

  // ===== Effects ===== //
  useEffect(() => {
    // Clear selecting when filters or sorting changed
    if (networkStatus === NetworkStatus.setVariables && !prevLeadsQuery && select) {
      select.reset();
    }
  }, [networkStatus]);

  return {
    state,
    select,
    leadsQuery,
    refetch,
    handleSelect,
  };
};

export default useLeadsList;
