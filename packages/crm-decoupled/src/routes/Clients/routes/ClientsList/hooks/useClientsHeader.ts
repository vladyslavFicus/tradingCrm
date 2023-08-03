import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryResult, NetworkStatus } from '@apollo/client';
import { State, TableSelection } from 'types';
import { ClientsListQuery, ClientsListQueryVariables } from '../graphql/__generated__/ClientsQuery';
import { useClientsCountQueryLazyQuery } from '../graphql/__generated__/ClientsCountQuery';

type Props = {
  select: TableSelection | null,
  clientsQuery: QueryResult<ClientsListQuery>,
};

const useClientsHeader = (props: Props) => {
  const {
    select,
    clientsQuery: {
      data,
      loading,
      variables,
      networkStatus,
    },
  } = props;

  const state = useLocation().state as State<ClientsListQueryVariables['args']>;

  const [clientsTotalCount, setClientsTotalCount] = useState<number | null>(null);
  const [clientsTotalCountLoading, setClientsTotalCountLoading] = useState(false);

  const totalElements = data?.profiles?.totalElements || 0;
  const searchLimit = state?.filters?.searchLimit;

  const clientsListCount = (searchLimit && searchLimit < totalElements)
    ? searchLimit
    : totalElements;

  const selectedCount = select?.selected || 0;

  // ===== Requests ===== //
  const [clientsCountQuery] = useClientsCountQueryLazyQuery({
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: { batch: false },
  });

  // ===== Handlers ===== //
  const handleClearClientsCount = useCallback(() => {
    setClientsTotalCount(null);
  }, []);

  const handleGetClientsCount = useCallback(async () => {
    setClientsTotalCountLoading(true);

    try {
      const { data: clientsCountData } = await clientsCountQuery({
        variables: variables as ClientsListQueryVariables,
      });

      if (clientsCountData?.profilesCount) {
        setClientsTotalCount(clientsCountData.profilesCount);
      }
    } catch (e) {
      // Do nothing...
    }

    setClientsTotalCountLoading(false);
  }, [clientsCountQuery, variables]);

  useEffect(() => {
    if (networkStatus === NetworkStatus.setVariables) {
      handleClearClientsCount();
    }
  }, [networkStatus]);

  return {
    loading,
    clientsListCount,
    clientsTotalCountLoading,
    clientsTotalCount,
    selectedCount,
    totalElements,
    handleGetClientsCount,
  };
};

export default useClientsHeader;
