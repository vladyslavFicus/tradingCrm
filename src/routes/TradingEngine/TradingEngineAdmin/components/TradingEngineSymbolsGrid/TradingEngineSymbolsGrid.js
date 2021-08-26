import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withRequests } from 'apollo';
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
    symbolsQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.symbolsTradingEngineType)).isRequired,
  };

  renderName = ({ name }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {name}
    </div>
  );

  renderSecurities = ({ securities }) => (
    <div className="TradingEngineSymbols__cell-primary">
      {securities}
    </div>
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
      symbolsQuery,
    } = this.props;

    const symbols = symbolsQuery.data?.tradingEngineSymbols || [];

    return (
      <div className="card">
        <Tabs items={tradingEngineAdminTabs} />

        <div className="card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{symbols.length}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SYMBOLS.HEADLINE')}
          </span>
        </div>

        <TradingEngineSymbolsGridFilter handleRefetch={this.refetchOrders} />

        <div className="TradingEngineSymbols">
          <Table
            items={symbols}
            sorts={location?.state?.sorts}
            loading={symbolsQuery.loading}
          >
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SYMBOL')}
              render={this.renderName}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SECURITIES')}
              render={this.renderSecurities}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SPREAD')}
              render={this.renderSpread}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.STOP')}
              render={this.renderStop}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.LONG')}
              render={this.renderLong}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SHORT')}
              render={this.renderShort}
            />
            <Column
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
    symbolsQuery: TradingEngineSymbolsQuery,
  }),
)(TradingEngineSymbols);
