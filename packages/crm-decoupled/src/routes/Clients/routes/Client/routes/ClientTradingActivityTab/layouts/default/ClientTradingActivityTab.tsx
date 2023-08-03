import React from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import useClientTradingActivityTab from '../../hooks/useClientTradingActivityTab';
import TradingActivityGridFilter from './components/TradingActivityGridFilter';
import TradingActivityGrid from './components/TradingActivityGrid';
import './ClientTradingActivityTab.scss';

const ClientTradingActivityTab = () => {
  const {
    profileUUID,
    loading,
    refetch,
    content,
    last,
    handleSort,
    handleLoadMore,
    stateSorts: sorts,
  } = useClientTradingActivityTab();

  return (
    <div className="ClientTradingActivityTab">
      <TabHeader
        title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY')}
        className="ClientTradingActivityTab__header"
      />

      <TradingActivityGridFilter
        profileUUID={profileUUID}
        loading={loading}
        onRefetch={refetch}
      />

      <TradingActivityGrid
        content={content}
        loading={loading}
        last={last}
        sorts={sorts}
        onSort={handleSort}
        onRefetch={refetch}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default React.memo(ClientTradingActivityTab);
