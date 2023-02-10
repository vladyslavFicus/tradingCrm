import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { Sorts, State } from 'types';
import TradingAccountsFilters from './components/TradingAccountsFilters';
import TradingAccountsGrid from './components/TradingAccountsGrid';
import { useTradingAccountsQuery, TradingAccountsQueryVariables } from './graphql/__generated__/TradingAccountsQuery';
import './TradingAccounts.scss';

const TradingAccounts = () => {
  const { state } = useLocation<State<TradingAccountsQueryVariables>>();

  const history = useHistory();

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
  const handleFetchMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as TradingAccountsQueryVariables), 'page.from', number + 1),
      });
    }
  };

  const handleSort = (sorts: Sorts) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  return (
    <div className="TradingAccounts">
      <div className="TradingAccounts__header">
        <strong>{totalElements} </strong>

        {I18n.t('TRADING_ACCOUNTS.HEADLINE')}
      </div>

      <TradingAccountsFilters onRefetch={refetch} />

      <TradingAccountsGrid
        content={content}
        loading={loading}
        last={last}
        onFetchMore={handleFetchMore}
        onSort={handleSort}
      />
    </div>
  );
};

export default React.memo(TradingAccounts);
