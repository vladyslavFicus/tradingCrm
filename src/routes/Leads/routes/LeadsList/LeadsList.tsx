import React, { useEffect, useState } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { State, TableSelection } from 'types';
import usePrevious from 'hooks/usePrevious';
import { fieldTimeZoneOffset } from 'utils/timeZoneOffset';
import LeadsHeader from './components/LeadsHeader';
import LeadsGridFilter from './components/LeadsGridFilter';
import LeadsGrid from './components/LeadsGrid';
import { FormValues } from './type';
import { LeadsListQueryVariables, useLeadsListQuery } from './graphql/__generated__/LeadsListQuery';
import './LeadsList.scss';

const LeadsList = () => {
  const [select, setSelect] = useState<TableSelection | null>(null);

  const { state } = useLocation<State<FormValues>>();

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
  const handleSelect = (selectedLeads: TableSelection) => {
    setSelect(selectedLeads);
  };

  // ===== Effects ===== //
  useEffect(() => {
    // Clear selecting when filters or sorting changed
    if (networkStatus === NetworkStatus.setVariables && !prevLeadsQuery && select) {
      select.reset();
    }
  }, [networkStatus]);

  return (
    <div className="LeadsList">
      <LeadsHeader leadsQuery={leadsQuery} select={select} />

      <LeadsGridFilter onRefetch={refetch} />

      <LeadsGrid
        leadsQuery={leadsQuery}
        onSelect={handleSelect}
        sorts={state?.sorts || []}
      />
    </div>
  );
};

export default React.memo(LeadsList);
