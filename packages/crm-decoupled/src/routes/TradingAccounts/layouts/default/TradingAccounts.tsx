import React from 'react';
import I18n from 'i18n-js';
import useTradingAccounts from 'routes/TradingAccounts/hooks/useTradingAccounts';
import TradingAccountsFilters from './components/TradingAccountsFilters';
import TradingAccountsGrid from './components/TradingAccountsGrid';
import './TradingAccounts.scss';

const TradingAccounts = () => {
  const {
    content,
    loading,
    totalElements,
    last,
    refetch,
    handleFetchMore,
    handleSort,
  } = useTradingAccounts();

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
