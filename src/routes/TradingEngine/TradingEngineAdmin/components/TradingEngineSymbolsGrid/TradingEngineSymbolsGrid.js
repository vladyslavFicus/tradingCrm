import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { Button } from 'components/UI';
import { Link } from 'components/Link';
import { tradingEngineAdminTabs } from '../../constants';
import TradingEngineSymbolsQuery from './graphql/TradingEngineSymbolsQuery';
import TradingEngineSymbolsGridFilter from './components/TradingEngineSymbolsGridFilter';
import './TradingEngineSymbolsGrid.scss';

class TradingEngineSymbols extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    symbolsQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.symbolsTradingEngineType)).isRequired,
  };

  refetchSymbols = () => this.props.symbolsQuery.refetch();

  handlePageChanged = () => {
    const {
      location: {
        state,
      },

      symbolsQuery: {
        data,
        loadMore,
        variables: {
          args: {
            page: {
              size,
            },
          },
        },
      },
    } = this.props;

    const currentPage = data?.tradingEngineAdminSymbols?.number || 0;
    const filters = state?.filters || {};
    const sorts = state?.sorts;

    loadMore({
      args: {
        ...filters,
        page: {
          from: currentPage + 1,
          size,
          sorts,
        },
      },
    });
  };

  handleSort = (sorts) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  renderName = ({ symbol }) => (
    <Link to={`/trading-engine-admin/symbols/${symbol}`} target="_blank">
      <div className="TradingEngineSymbols__cell-primary">
        {symbol}
      </div>
    </Link>
  );

  renderSecurities = ({ securityName }) => (
    <div className="TradingEngineSymbols__cell-primary">
      <Choose>
        <When condition={securityName}>
          {securityName}
        </When>
        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </div>
  );

  renderAskSpread = ({ askSpread }) => (
    <div className="TradingEngineSymbols__cell-primary">
      <Choose>
        <When condition={askSpread}>
          {askSpread}
        </When>
        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </div>
  );

  renderBidSpread = ({ bidSpread }) => (
    <div className="TradingEngineSymbols__cell-primary">
      <Choose>
        <When condition={bidSpread}>
          {bidSpread}
        </When>
        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </div>
  );

  renderStop = ({ stopsLevel }) => (
    <div className="TradingEngineSymbols__cell-primary">
      <Choose>
        <When condition={stopsLevel}>
          {stopsLevel}
        </When>
        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </div>
  );

  renderLong = ({ swapConfigs }) => (
    <div className="TradingEngineSymbols__cell-primary">
      <Choose>
        <When condition={swapConfigs?.long}>
          {swapConfigs.long}
        </When>
        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </div>
  );

  renderShort = ({ swapConfigs }) => (
    <div className="TradingEngineSymbols__cell-primary">
      <Choose>
        <When condition={swapConfigs?.short}>
          {swapConfigs.short}
        </When>
        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </div>
  );

  renderDigits = ({ digits }) => (
    <div className="TradingEngineSymbols__cell-primary">
      <Choose>
        <When condition={digits}>
          {digits}
        </When>
        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </div>
  );

  render() {
    const {
      location: { state },
      symbolsQuery: {
        data,
        loading,
      },
    } = this.props;

    const { content = [], last = true, totalElements } = data?.tradingEngineAdminSymbols || {};

    return (
      <div className="card">
        <Tabs items={tradingEngineAdminTabs} />

        <div className="TradingEngineSymbols__header card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SYMBOLS.HEADLINE')}
          </span>
          <div className="TradingEngineSymbols__actions">
            <Link to="/trading-engine-admin/symbols/new">
              <Button
                className="TradingEngineAccountsGrid__action"
                commonOutline
                small
              >
                {I18n.t('TRADING_ENGINE.SYMBOLS.NEW_SYMBOL')}
              </Button>
            </Link>
          </div>
        </div>

        <TradingEngineSymbolsGridFilter handleRefetch={this.refetchSymbols} />

        <div className="TradingEngineSymbols">
          <Table
            items={content}
            sorts={state?.sorts}
            loading={loading}
            hasMore={!last}
            onSort={this.handleSort}
            onMore={this.handlePageChanged}
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
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SPREAD_ASK')}
              render={this.renderAskSpread}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SPREAD_BID')}
              render={this.renderBidSpread}
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
