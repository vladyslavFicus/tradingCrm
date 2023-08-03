import React from 'react';
import useClientCallbacksList from 'routes/Clients/routes/Callbacks/hooks/useClientCallbacksList';
import ClientCallbacksHeader from './components/ClientCallbacksHeader';
import ClientCallbacksGridFilter from './components/ClientCallbacksGridFilter';
import ClientCallbacksGrid from './components/ClientCallbacksGrid';
import './ClientCallbacksList.scss';

const CallbacksList = () => {
  const {
    totalElements,
    clientCallbacksListQuery,
    sorts,
    handleSort,
  } = useClientCallbacksList();

  return (
    <div className="ClientCallbacksList">
      <ClientCallbacksHeader totalElements={totalElements} />

      <ClientCallbacksGridFilter onRefetch={clientCallbacksListQuery?.refetch} />

      <ClientCallbacksGrid
        sorts={sorts}
        onSort={handleSort}
        clientCallbacksListQuery={clientCallbacksListQuery}
      />
    </div>
  );
};

export default React.memo(CallbacksList);
