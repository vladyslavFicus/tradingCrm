import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { withLazyStreams } from 'rsocket';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { tradingEngineTabs } from '../../constants';
import TradingEngineSymbolsQuery from './graphql/TradingEngineSymbolsQuery';
// import TradingEngineSymbolsGridFilter from './components/TradingEngineSymbolsGridFilter';
import './TradingEngineSymbolsGrid.scss';

class TradingEngineSymbols extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    symbolsQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.symbolsTradingEngineType)).isRequired,
    symbolsStreamRequest: PropTypes.func.isRequired,
  };

  symbols = [];

  intervalID = null;

  state = {
    tick: null, // eslint-disable-line
  };

  componentDidUpdate(prevProps) {
    const {
      symbolsQuery,
      symbolsStreamRequest,
    } = this.props;

    // Subscribe to symbols ticks when symbols list will be allowed to use in stream request
    const symbolsNames = symbolsQuery.data?.tradingEngineSymbols?.content?.map(({ name }) => name) || [];

    if (
      prevProps.symbolsQuery.loading
      && !symbolsQuery.loading
      && symbolsNames.length
    ) {
      // Initially fill symbols variable to render it inside render method
      this.symbols = symbolsQuery.data.tradingEngineSymbols.content;

      // Request symbols stream by retrieved symbols name
      const symbolsStream = symbolsStreamRequest({ data: { symbols: symbolsNames } });

      // Here can be up to 90 ticks per second, so performance is so bad for 90 re-rendering per one second
      // The solution is aggregate ticks inside in-memory variable and manually re-render table each 200 ms
      symbolsStream.onNext(({ data }) => { // eslint-disable-line
        const symbol = this.symbols.find(({ name }) => name === data.symbol);

        // Calculate direction where price moved depends from previous symbol tick
        symbol.askDirection = data.ask > symbol.ask ? 'UP' : 'DOWN';
        symbol.bidDirection = data.bid > symbol.bid ? 'UP' : 'DOWN';

        // Mutate object to change bid and ask values
        symbol.bid = data.bid;
        symbol.ask = data.ask;
      });

      // Make re-rendering 1 time per 200 ms to optimize performance and FPS
      if (!this.intervalID) {
        this.intervalID = setInterval(() => {
          this.setState({ tick: Math.random() }); // eslint-disable-line
        }, 200);
      }
    }
  }

  componentWillUnmount() {
    // Clear component interval update
    clearInterval(this.intervalID);
  }

  renderName = ({ name }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {name}
    </div>
  );

  renderBid = ({ bid, bidDirection }) => (
    <div
      key={bid}
      className={classNames(
        'TradingEngineSymbols__cell-primary',
        'TradingEngineSymbols__direction',
        {
          'TradingEngineSymbols__direction--up': bidDirection === 'UP',
          'TradingEngineSymbols__direction--down': bidDirection === 'DOWN',
        },
      )}
    >
      {bid || '—'}
    </div>
  );

  renderAsk = ({ ask, askDirection }) => (
    <div
      key={ask}
      className={classNames(
        'TradingEngineSymbols__cell-primary',
        'TradingEngineSymbols__direction',
        {
          'TradingEngineSymbols__direction--up': askDirection === 'UP',
          'TradingEngineSymbols__direction--down': askDirection === 'DOWN',
        },
      )}
    >
      {ask || '—'}
    </div>
  );

  render() {
    const { symbolsQuery } = this.props;

    const symbols = this.symbols.length ? this.symbols : (symbolsQuery.data?.tradingEngineSymbols?.content || []);

    return (
      <div className="card">
        <Tabs items={tradingEngineTabs} />

        <div className="card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{symbolsQuery.data?.tradingEngineSymbols?.content?.length}</strong>
            &nbsp;{I18n.t('TRADING_ENGINE.SYMBOLS.HEADLINE')}
          </span>
        </div>

        {/* <TradingEngineSymbolsGridFilter handleRefetch={this.refetchOrders} /> */}

        <div className="TradingEngineSymbols">
          <Table
            items={symbols}
            loading={symbolsQuery.loading}
            stickyFromTop={123}
          >
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SYMBOL')}
              render={this.renderName}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.BID')}
              render={this.renderBid}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.ASK')}
              render={this.renderAsk}
            />
          </Table>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    symbolsQuery: TradingEngineSymbolsQuery,
  }),
  withLazyStreams({
    symbolsStreamRequest: {
      route: 'streamAllSymbolPrices',
    },
  }),
)(TradingEngineSymbols);
