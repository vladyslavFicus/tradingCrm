import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import withModals from 'hoc/withModals';
import Uuid from 'components/Uuid';
import Tabs from 'components/Tabs';
import EditOrderModal from 'routes/TradingEngine/TradingEngineManager/modals/EditOrderModal';
import { EditButton } from 'components/UI';
import TradingEngineOrdersQuery from './graphql/TradingEngineOrdersQuery';
import { tradingEngineTabs } from '../../constants';
import TradingEngineOrdersGridFilter from './components/TradingEngineOrdersGridFilter';
import { types, tradeStatusesColor } from './attributes/constants';
import { getTypeColor } from './attributes/utils';
import './TradingEngineOrdersGrid.scss';

class TradingEngineOrdersGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    modals: PropTypes.shape({
      editOrderModal: PropTypes.modalType,
    }).isRequired,
    orders: PropTypes.query({
      tradingEngineOrders: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
  };

  refetchOrders = () => this.props.orders.refetch();

  handlePageChanged = () => {
    const {
      location: {
        state,
      },
      orders: {
        data,
        loadMore,
        variables,
      },
    } = this.props;

    const currentPage = data?.tradingEngineOrders?.number || 0;
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    loadMore({
      args: {
        orderStatuses: ['PENDING', 'OPEN'],
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

  render() {
    const {
      location: { state },
      orders: {
        data,
        loading,
      },
      modals: {
        editOrderModal,
      },
    } = this.props;

    const { content = [], last = true, totalElements = 0 } = data?.tradingEngineOrders || {};

    return (
      <div className="card">
        <Tabs items={tradingEngineTabs} />

        <div className="card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ORDERS.HEADLINE')}
          </span>
        </div>

        <TradingEngineOrdersGridFilter handleRefetch={this.refetchOrders} />

        <div className="TradingEngineOrdersGrid">
          <Table
            items={content}
            loading={loading}
            hasMore={!last}
            sorts={state?.sorts}
            onSort={this.handleSort}
            onMore={this.handlePageChanged}
          >
            <Column
              sortBy="id"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.TRADE')}
              render={({ id }) => (
                <div
                  className="TradingEngineOrdersGrid__uuid"
                  onClick={() => editOrderModal.show({
                    id,
                    onSuccess: () => this.refetchOrders(),
                  })}
                >
                  <div className="TradingEngineOrdersGrid__cell-value">
                    <Uuid
                      uuid={`${id}`}
                      uuidPrefix="TR"
                    />
                    <EditButton className="TradingEngineOrdersGrid__edit-button" />
                  </div>
                </div>
              )}
            />
            <Column
              sortBy="accountLogin"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.LOGIN')}
              render={({ accountLogin }) => (
                <>
                  <div className="TradingEngineOrdersGrid__cell-value">
                    <Uuid
                      uuid={`${accountLogin}`}
                    />
                  </div>
                </>
              )}
            />
            <Column
              sortBy="type"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.TYPE')}
              render={({ type }) => (
                <div
                  className={classNames(
                    getTypeColor(types.find(item => item.value === type).value),
                    'TradingEngineOrdersGrid__cell-value',
                  )}
                >
                  {I18n.t(types.find(item => item.value === type).label)}
                </div>
              )}
            />
            <Column
              sortBy="symbol"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.SYMBOL')}
              render={({ symbol }) => (
                <Fragment>
                  <div className="TradingEngineOrdersGrid__cell-value">{symbol}</div>
                </Fragment>
              )}
            />
            <Column
              sortBy="openingPrice"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.OPEN_PRICE')}
              render={({ openPrice, digits }) => (
                <Fragment>
                  <div className="TradingEngineOrdersGrid__cell-value">{openPrice.toFixed(digits)}</div>
                </Fragment>
              )}
            />
            <Column
              sortBy="volume"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.VOLUME')}
              render={({ volumeLots }) => (
                <div className="TradingEngineOrdersGrid__cell-value">{volumeLots}</div>
              )}
            />
            <Column
              sortBy="stopLoss"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.S/L')}
              render={({ stopLoss }) => (
                <div className="TradingEngineOrdersGrid__cell-value">
                  <Choose>
                    <When condition={stopLoss}>
                      {stopLoss}
                    </When>
                    <Otherwise>
                      &mdash;
                    </Otherwise>
                  </Choose>
                </div>
              )}
            />
            <Column
              sortBy="takeProfit"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.T/P')}
              render={({ takeProfit }) => (
                <div className="TradingEngineOrdersGrid__cell-value">
                  <Choose>
                    <When condition={takeProfit}>
                      {takeProfit}
                    </When>
                    <Otherwise>
                      &mdash;
                    </Otherwise>
                  </Choose>
                </div>
              )}
            />
            <Column
              sortBy="swaps"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.SWAP')}
              render={({ swaps }) => (
                <div className="TradingEngineOrdersGrid__cell-value">{swaps}</div>
              )}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.P&L')}
              render={({ pnl }) => (
                <div className="TradingEngineOrdersGrid__cell-value">{pnl.net}</div>
              )}
            />
            <Column
              sortBy="openingTime"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.OPEN_TIME')}
              render={({ time }) => (
                <Fragment>
                  <div className="TradingEngineOrdersGrid__cell-value">
                    {moment.utc(time.creation).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="TradingEngineOrdersGrid__cell-value-add">
                    {moment.utc(time.creation).local().format('HH:mm')}
                  </div>
                </Fragment>
              )}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.STATUS')}
              render={({ status }) => (
                <Choose>
                  <When condition={status}>
                    <div
                      className={tradeStatusesColor[`${status}`]}
                    >
                      <strong>{I18n.t(`TRADING_ENGINE.ORDERS.STATUSES.${status}`)}</strong>
                    </div>
                  </When>
                  <Otherwise>
                    <span>&mdash;</span>
                  </Otherwise>
                </Choose>
              )}
            />
          </Table>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withModals({
    editOrderModal: EditOrderModal,
  }),
  withRequests({
    orders: TradingEngineOrdersQuery,
  }),
)(TradingEngineOrdersGrid);
