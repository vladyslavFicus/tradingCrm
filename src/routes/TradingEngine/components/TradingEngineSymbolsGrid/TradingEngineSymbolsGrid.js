import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import TradingEngineSymbolsQuery from './graphql/TradingEngineSymbolsQuery';
import './TradingEngineSymbolsGrid.scss';

class TradingEngineSymbols extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    symbols: PropTypes.query(PropTypes.arrayOf(PropTypes.symbolsTradingEngineType)).isRequired,
  };

  handlePageChanged = () => {
    const {
      symbols,
      symbols: {
        loadMore,
        loading,
      },
    } = this.props;

    const currentPage = get(symbols, 'data.tradingEngineSymbols.page') || 0;

    if (!loading) {
      loadMore(currentPage + 1);
    }
  };

  renderSymbol = ({ symbol }) => (
    <Fragment>
      <div className="TradingEngineSymbols__cell-primary">
        {symbol}
      </div>
    </Fragment>
  );

  renderBid = ({ bid }) => (
    <Fragment>
      <div className="TradingEngineSymbols__cell-primary">
        {bid}
      </div>
    </Fragment>
  );

  renderAsk = ({ ask }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {ask}
    </div>
  );

  render() {
    const {
      location,
      symbols,
    } = this.props;

    const { content = [] } = symbols.data?.tradingEngineSymbols || {};

    return (
      <div className="TradingEngineSymbols">
        <Table
          items={content}
          sorts={location?.state?.sorts}
          onMore={this.handlePageChanged}
        >
          <Column
            sortBy="symbol"
            header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SYMBOL')}
            render={this.renderSymbol}
          />
          <Column
            sortBy="bid"
            header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.BID')}
            render={this.renderBid}
          />
          <Column
            sortBy="ask"
            header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.ASK')}
            render={this.renderAsk}
          />
        </Table>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    symbols: TradingEngineSymbolsQuery,
  }),
)(TradingEngineSymbols);
