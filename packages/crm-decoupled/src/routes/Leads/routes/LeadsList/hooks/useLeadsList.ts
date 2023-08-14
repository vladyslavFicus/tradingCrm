import { useEffect, useState, useCallback } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { Utils, Types } from '@crm/common';
import usePrevious from 'hooks/usePrevious';
import { FormValues } from '../types/leadsGridFilter';
import { LeadsListQueryVariables, useLeadsListQuery } from '../graphql/__generated__/LeadsListQuery';

const useLeadsList = () => {
  const [select, setSelect] = useState<Types.TableSelection | null>(null);

  const state = useLocation().state as Types.State<FormValues>;

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
      ...Utils.fieldTimeZoneOffset('lastCallDateFrom', lastCallDateFrom, timeZone),
      ...Utils.fieldTimeZoneOffset('lastCallDateTo', lastCallDateTo, timeZone),
      ...Utils.fieldTimeZoneOffset('lastNoteDateFrom', lastNoteDateFrom, timeZone),
      ...Utils.fieldTimeZoneOffset('lastNoteDateTo', lastNoteDateTo, timeZone),
      ...Utils.fieldTimeZoneOffset('registrationDateEnd', registrationDateEnd, timeZone),
      ...Utils.fieldTimeZoneOffset('registrationDateStart', registrationDateStart, timeZone),
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
  const handleSelect = useCallback((selectedLeads: Types.TableSelection) => {
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
