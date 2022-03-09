import React from 'react';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import compose from 'compose-function';
import { LevelType, Notify } from 'types';
import { withNotifications } from 'hoc';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import Button from 'components/UI/Button';
import { tradingEngineTabs } from 'routes/TE/constants';
import { useSymbolsPricesStream } from 'routes/TE/components/SymbolsPricesStream';
import { useSymbolsQuery, SymbolsQuery, SymbolsQueryVariables } from './graphql/__generated__/SymbolsQuery';
import { useRestartStreamingMutation } from './graphql/__generated__/RestartStreamingMutation';
import './Quotes.scss';

type SymbolType = ExtractApolloTypeFromPageable<SymbolsQuery['tradingEngine']['symbols']>;
type Props = {
  notify: Notify,
}

const Quotes = ({ notify }: Props) => {
  const symbolsQuery = useSymbolsQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 20,
        },
      },
    },
  });

  const { content = [], last = true, totalElements } = symbolsQuery.data?.tradingEngine.symbols || {};

  const symbolsPrices = useSymbolsPricesStream(content.map(({ name }) => name) || []);
  const [restartStreaming, { loading: isStreamingRestarting }] = useRestartStreamingMutation();

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = symbolsQuery;

    const page = data?.tradingEngine.symbols.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as SymbolsQueryVariables), 'args.page.from', page + 1),
    });
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
        <PermissionContent permissions={permissions.LIQUIDITY_PROVIDER_ADAPTER.RESTART_STREAMING}>
          <Button
            commonOutline
            small
            danger
            disabled={isStreamingRestarting}
            onClick={handleRestartStreaming}
          >
            {I18n.t('TRADING_ENGINE.QUOTES.RESTART_STREAMING')}
          </Button>
        </PermissionContent>
      </div>

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

export default compose(
  React.memo,
  withNotifications,
)(Quotes);