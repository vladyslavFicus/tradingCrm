import React from 'react';
import useClientsList from 'routes/Clients/routes/ClientsList/hooks/useClientsList';
import ClientsHeader from './components/ClientsHeader';
import ClientsGrid from './components/ClientsGrid';
import ClientsGridFilter from './components/ClientsGridFilter';
import './ClientsList.scss';

const ClientsList = () => {
  const {
    clientsQuery,
    select,
    loading,
    refetch,
    onSelect,
    sorts,
  } = useClientsList();

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
        sorts={sorts}
      />
    </div>
  );
};

export default React.memo(ClientsList);
