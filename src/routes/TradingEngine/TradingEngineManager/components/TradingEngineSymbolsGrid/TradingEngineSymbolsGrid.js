import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { set } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import SymbolsPricesStream from 'routes/TradingEngine/components/SymbolsPricesStream';
import { tradingEngineTabs } from '../../constants';
import TradingEngineSymbolsQuery from './graphql/TradingEngineSymbolsQuery';
// import TradingEngineSymbolsGridFilter from './components/TradingEngineSymbolsGridFilter';
import './TradingEngineSymbolsGrid.scss';

class TradingEngineSymbols extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    symbolsQuery: PropTypes.query(PropTypes.pageable(PropTypes.symbolsTradingEngineType)).isRequired,
  };

  state = {
    symbolsPrices: {},
  };

  handlePageChanged = () => {
    const {
      symbolsQuery,
      symbolsQuery: {
        loadMore,
      },
    } = this.props;

    const page = symbolsQuery?.data?.tradingEngineSymbols?.number || 0;

    loadMore(variables => set(variables, 'args.page.from', page + 1));
  };

  handleSymbolsPricesTick = (symbolsPrices) => {
    this.setState({ symbolsPrices });
  };

  renderName = ({ name }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {name}
    </div>
  );

  renderBid = ({ name, digits }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {this.state.symbolsPrices[name]?.bid?.toFixed(digits) || '—'}
    </div>
  );

  renderAsk = ({ name, digits }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {this.state.symbolsPrices[name]?.ask?.toFixed(digits) || '—'}
    </div>
  );

  render() {
    const { symbolsQuery } = this.props;

    const { content = [], last = true, totalElements } = symbolsQuery.data?.tradingEngineSymbols || {};

    return (
      <div className="card">
        <Tabs items={tradingEngineTabs} />

        <div className="card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{totalElements}</strong>
            &nbsp;{I18n.t('TRADING_ENGINE.SYMBOLS.HEADLINE')}
          </span>
        </div>

        {/* Subscribe to symbol prices stream */}
        <SymbolsPricesStream
          symbols={content.map(({ name }) => name)}
          onNotify={this.handleSymbolsPricesTick}
        />

        {/* <TradingEngineSymbolsGridFilter handleRefetch={this.refetchOrders} /> */}

        <div className="TradingEngineSymbols">
          <Table
            items={content}
            loading={symbolsQuery.loading}
            onMore={this.handlePageChanged}
            hasMore={!last}
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
)(TradingEngineSymbols);
