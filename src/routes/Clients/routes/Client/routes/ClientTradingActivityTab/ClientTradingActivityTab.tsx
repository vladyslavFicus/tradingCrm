import React, { useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { Sorts, State } from 'types';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import TabHeader from 'components/TabHeader';
import TradingActivityGridFilter from './components/TradingActivityGridFilter';
import TradingActivityGrid from './components/TradingActivityGrid';
import { useTradingActivityQuery, TradingActivityQueryVariables } from './graphql/__generated__/TradingActivityQuery';
import './ClientTradingActivityTab.scss';

const ClientTradingActivityTab = () => {
  const { id: profileUUID } = useParams<{ id: string }>();

  const history = useHistory();

  const { state } = useLocation<State<TradingActivityQueryVariables>>();

  // ===== Requests ===== //
  const { data, loading, variables = {}, refetch, fetchMore } = useTradingActivityQuery({
    variables: {
      profileUUID,
      tradeType: 'LIVE',
      ...state?.filters,
      page: 0,
      limit: 20,
    } as TradingActivityQueryVariables,
  });

  const { content = [], last = true, number = 0 } = data?.tradingActivity || {};

  // ===== Handlers ===== //
  const handleLoadMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables), 'page', number + 1),
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

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, refetch);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, refetch);
    };
  }, []);

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
        sorts={state?.sorts || []}
        onSort={handleSort}
        onRefetch={refetch}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default React.memo(ClientTradingActivityTab);
