import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Sorts, State } from 'types';
import { useTradingAccountsQuery, TradingAccountsQueryVariables } from '../graphql/__generated__/TradingAccountsQuery';

const useTradingAccounts = () => {
  const state = useLocation().state as State<TradingAccountsQueryVariables>;

  const navigate = useNavigate();

  // ===== Requests ===== //
  const { data, loading, variables, refetch, fetchMore } = useTradingAccountsQuery({
    variables: {
      ...state?.filters as TradingAccountsQueryVariables,
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts,
      },
    },
  });

  const { content = [], totalElements = 0, last = true, number = 0 } = data?.tradingAccounts || {};

  // ===== Handlers ===== //
  const handleFetchMore = useCallback(() => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as TradingAccountsQueryVariables), 'page.from', number + 1),
      });
    }
  }, [loading, variables, number]);

  const handleSort = useCallback((sorts: Sorts) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [state]);

  return {
    content,
    loading,
    totalElements,
    last,
    refetch,
    handleFetchMore,
    handleSort,
  };
};

export default useTradingAccounts;
