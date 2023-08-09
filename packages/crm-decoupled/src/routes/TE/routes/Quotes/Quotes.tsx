import React from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { Config } from '@crm/common';
import { Button } from 'components';
import { State } from 'types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { maxSelectedFavortieSymbols, tradingEngineTabs } from 'routes/TE/constants';
import { useSymbolsPricesStream } from 'routes/TE/components/SymbolsPricesStream';
import { usePermission } from 'providers/PermissionsProvider';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import QuotesFilter from './components/QuotesFilter/QuotesFilter';
import { useSymbolsQuery, SymbolsQuery, SymbolsQueryVariables } from './graphql/__generated__/SymbolsQuery';
import { useAddFavoriteSymbolMutation } from './graphql/__generated__/AddFavoriteSymbolMutation';
import { useFavoriteSymbolsQuery } from './graphql/__generated__/FavoriteSymbolsQuery';
import { useDeleteFavoriteSymbolMutation } from './graphql/__generated__/DeleteFavoriteSymbolMutation';
import { useRestartStreamingMutation } from './graphql/__generated__/RestartStreamingMutation';
import './Quotes.scss';

type SymbolType = ExtractApolloTypeFromPageable<SymbolsQuery['tradingEngine']['symbols']>;

const Quotes = () => {
  const state = useLocation().state as State<SymbolsQueryVariables['args']>;

  const permission = usePermission();

  const symbolsQuery = useSymbolsQuery({
    variables: {
      args: {
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
        },
      },
    },
  });

  const { data } = symbolsQuery;
  const page = data?.tradingEngine.symbols.number || 0;
  const { content = [], last = true, totalElements } = data?.tradingEngine.symbols || {};
  const symbolsPrices = useSymbolsPricesStream(content.map(({ name }) => name) || []);

  const favoritesSymbolsQuery = useFavoriteSymbolsQuery();

  const favoriteSymbols = favoritesSymbolsQuery.data?.tradingEngine.favoriteSymbolData || [];

  const [restartStreaming, { loading: isStreamingRestarting }] = useRestartStreamingMutation();

  const [addFavoriteSymbols, { loading: addFavoriteLoading }] = useAddFavoriteSymbolMutation();
  const [deleteFavoriteSymbols, { loading: deleteFavoriteLoading }] = useDeleteFavoriteSymbolMutation();

  const handlePageChanged = useHandlePageChanged({ query: symbolsQuery, page, path: 'page.from' });

  const handleFavoriteSymbol = async (symbolValue: string) => {
    if (addFavoriteLoading || deleteFavoriteLoading) {
      return;
    }

    try {
      if (favoriteSymbols.includes(symbolValue)) {
        await deleteFavoriteSymbols({ variables: { symbol: symbolValue } });

        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('TRADING_ENGINE.QUOTES.NOTIFICATION.FAVORITE_SYMBOLS_REMOVED', { symbol: symbolValue }),
        });
      } else {
        await addFavoriteSymbols({ variables: { symbol: symbolValue } });

        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('TRADING_ENGINE.QUOTES.NOTIFICATION.FAVORITE_SYMBOLS_ADDED', { symbol: symbolValue }),
        });
      }

      await favoritesSymbolsQuery.refetch();
    } catch (_) {
      if (favoriteSymbols.length + 1 >= maxSelectedFavortieSymbols) {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('TRADING_ENGINE.QUOTES.NOTIFICATION.MAX_COUNT_FAVORITE'),
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('TRADING_ENGINE.QUOTES.NOTIFICATION.FAVORITE_SYMBOLS_FAILED'),
        });
      }
    }
  };

  const handleRestartStreaming = async () => {
    try {
      await restartStreaming();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.QUOTES.NOTIFICATION.RESTART_STREAMING_SUCCESS'),
      });
    } catch (_) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('TRADING_ENGINE.QUOTES.NOTIFICATION.RESTART_STREAMING_FAILED'),
      });
    }
  };

  return (
    <div className="Quotes">
      <Tabs items={tradingEngineTabs} />

      <div className="Quotes__header">
        <span>
          <strong>{totalElements}</strong> {I18n.t('TRADING_ENGINE.QUOTES.HEADLINE')}
        </span>
        <If condition={permission.allows(Config.permissions.LIQUIDITY_PROVIDER_ADAPTER.RESTART_STREAMING)}>
          <Button
            small
            danger
            disabled={isStreamingRestarting}
            onClick={handleRestartStreaming}
            data-testid="Quotes-restartStreamingButton"
          >
            {I18n.t('TRADING_ENGINE.QUOTES.RESTART_STREAMING')}
          </Button>
        </If>
      </div>

      <QuotesFilter onRefresh={symbolsQuery.refetch} />

      <Table
        items={content}
        loading={symbolsQuery.loading}
        onMore={handlePageChanged}
        hasMore={!last}
        stickyFromTop={127}
      >
        <Column
          header={I18n.t('TRADING_ENGINE.QUOTES.GRID.SYMBOL')}
          render={({ name }: SymbolType) => (
            <div className="Quotes__cell-primary">
              <FavoriteStarIcon
                onClick={() => handleFavoriteSymbol(name)}
                className={`Quotes__cell-${favoriteSymbols.includes(name) ? 'active' : 'icon'}
                Quotes__cell-favroite`}
              />
              {name}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.QUOTES.GRID.BID')}
          render={({ name, digits }: SymbolType) => (
            <div className="Quotes__cell-primary">
              {symbolsPrices[name]?.bid.toFixed(digits) || '—'}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.QUOTES.GRID.ASK')}
          render={({ name, digits }: SymbolType) => (
            <div className="Quotes__cell-primary">
              {symbolsPrices[name]?.ask.toFixed(digits) || '—'}
            </div>
          )}
        />
      </Table>
    </div>
  );
};

export default React.memo(Quotes);
