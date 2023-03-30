import React, { useEffect, useState } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { State, TableSelection } from 'types';
import usePrevious from 'hooks/usePrevious';
import LeadsHeader from './components/LeadsHeader';
import LeadsGridFilter from './components/LeadsGridFilter';
import LeadsGrid from './components/LeadsGrid';
import { LeadsListQueryVariables, useLeadsListQuery } from './graphql/__generated__/LeadsListQuery';
import './LeadsList.scss';

const LeadsList = () => {
  const [select, setSelect] = useState<TableSelection | null>(null);

  const { state } = useLocation<State<LeadsListQueryVariables>>();

  const searchLimit = state?.filters?.args?.searchLimit;
  const size = (searchLimit && searchLimit < 20) ? searchLimit : 20;

  const leadsQuery = useLeadsListQuery({
    variables: {
      args: {
        ...state?.filters as LeadsListQueryVariables,
        page: {
          from: 0,
          size,
          sorts: state?.sorts,
        },
      },
    },
  });

  const { refetch, loading, networkStatus } = leadsQuery;
  const prevLeadsQuery = usePrevious(loading);

  useEffect(() => {
    // Clear selecting when filters or sorting changed
    if (networkStatus === NetworkStatus.setVariables && !prevLeadsQuery && select) {
      select.reset();
    }
  }, [networkStatus]);

  const handleSelect = (selectedLeads: TableSelection) => {
    setSelect(selectedLeads);
  };

  return (
    <div className="LeadsList">
      <LeadsHeader
        leadsQuery={leadsQuery}
        select={select}
      />

      <LeadsGridFilter handleRefetch={refetch} />

      <LeadsGrid
        leadsQuery={leadsQuery}
        onSelect={handleSelect}
        sorts={state.sorts || []}
      />
    </div>
  );
};

export default React.memo(LeadsList);
