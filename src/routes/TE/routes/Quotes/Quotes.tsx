import React from 'react';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { tradingEngineTabs } from 'routes/TE/constants';
import { useSymbolsPricesStream } from 'routes/TE/components/SymbolsPricesStream';
import { useSymbolsQuery, SymbolsQuery, SymbolsQueryVariables } from './graphql/__generated__/SymbolsQuery';
import './Quotes.scss';

type SymbolType = ExtractApolloTypeFromPageable<SymbolsQuery['tradingEngine']['symbols']>;

const Quotes = () => {
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

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = symbolsQuery;

    const page = data?.tradingEngine.symbols.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as SymbolsQueryVariables), 'args.page.from', page + 1),
    });
  };

  return (
    <div className="Quotes">
      <Tabs items={tradingEngineTabs} />

      <div className="Quotes__header">
        <span>
          <strong>{totalElements}</strong> {I18n.t('TRADING_ENGINE.QUOTES.HEADLINE')}
        </span>
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

export default React.memo(Quotes);
