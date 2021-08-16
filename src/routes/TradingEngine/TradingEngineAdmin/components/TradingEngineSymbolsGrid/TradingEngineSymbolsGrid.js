import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { tradingEngineAdminTabs } from '../../constants';
import TradingEngineSymbolsQuery from './graphql/TradingEngineSymbolsQuery';
import TradingEngineSymbolsGridFilter from './components/TradingEngineSymbolsGridFilter';
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

  renderSecurities = ({ securities }) => (
    <Fragment>
      <div className="TradingEngineSymbols__cell-primary">
        {securities}
      </div>
    </Fragment>
  );

  renderSpread = ({ spread }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {spread}
    </div>
  );

  renderStop = ({ stop }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {stop}
    </div>
  );

  renderLong = ({ long }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {long}
    </div>
  );

  renderShort = ({ short }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {short}
    </div>
  );

  renderDigits = ({ digits }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {digits}
    </div>
  );

  render() {
    const {
      location,
      symbols,
    } = this.props;

    const { content = [], totalElements = 0 } = symbols.data?.tradingEngineSymbols || {};

    return (
      <div className="card">
        <Tabs items={tradingEngineAdminTabs} />

        <div className="card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SYMBOLS.HEADLINE')}
          </span>
        </div>

        <TradingEngineSymbolsGridFilter handleRefetch={this.refetchOrders} />

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
              sortBy="securities"
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SECURITIES')}
              render={this.renderSecurities}
            />
            <Column
              sortBy="spread"
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SPREAD')}
              render={this.renderSpread}
            />
            <Column
              sortBy="stop"
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.STOP')}
              render={this.renderStop}
            />
            <Column
              sortBy="long"
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.LONG')}
              render={this.renderLong}
            />
            <Column
              sortBy="short"
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SHORT')}
              render={this.renderShort}
            />
            <Column
              sortBy="digits"
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.DIGITS')}
              render={this.renderDigits}
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
    symbols: TradingEngineSymbolsQuery,
  }),
)(TradingEngineSymbols);
