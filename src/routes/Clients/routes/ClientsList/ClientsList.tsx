import React, { useEffect, useState } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { State, TableSelection } from 'types';
import usePrevious from 'hooks/usePrevious';
import ClientsHeader from './components/ClientsHeader';
import ClientsGrid from './components/ClientsGrid';
import ClientsGridFilter from './components/ClientsGridFilter';
import { ClientsListQueryVariables, useClientsListQuery } from './graphql/__generated__/ClientsQuery';
import './ClientsList.scss';

const ClientsList = () => {
  const [select, setSelect] = useState<TableSelection | null>(null);

  const { state } = useLocation<State<ClientsListQueryVariables>>();

  const clientsQuery = useClientsListQuery({
    variables: {
      args: {
        ...state?.filters as ClientsListQueryVariables,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
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


  const onSelect = (values: TableSelection) => {
    setSelect(values);
  };

  return (
    <div className="ClientsList">
      <ClientsHeader
        clientsQuery={clientsQuery}
        select={select}
      />

      <ClientsGridFilter
        clientsLoading={loading}
        handleRefetch={refetch}
      />

      <ClientsGrid
        clientsQuery={clientsQuery}
        onSelect={onSelect}
        sorts={state?.sorts || []}
      />
    </div>
  );
};

export default React.memo(ClientsList);
