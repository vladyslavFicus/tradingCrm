import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withStreams } from 'rsocket';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import withModals from 'hoc/withModals';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import EditOrderModal from 'routes/TradingEngine/TradingEngineManager/modals/EditOrderModal';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import { EditButton } from 'components/UI';
import AccountProfileOrdersGridFilter from './components/AccountProfileOrdersGridFilter';
import { tradeStatusesColor, types } from '../../attributes/constants';
import { getTypeColor } from '../../attributes/utils';
import TradingEngineOrdersQuery from './graphql/TradingEngineOrdersQuery';
import './AccountProfileOrdersGrid.scss';

class AccountProfileOrdersGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    modals: PropTypes.shape({
      editOrderModal: PropTypes.modalType,
    }).isRequired,
    orders: PropTypes.query({
      tradingEngineOrders: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    openOrderStatistics$: PropTypes.object,
  };

  static defaultProps = {
    openOrderStatistics$: undefined,
  };

  componentDidMount() {
    EventEmitter.on(ORDER_RELOAD, this.refetchOrders);
  }

  componentWillUnmount() {
    EventEmitter.off(ORDER_RELOAD, this.refetchOrders);
  }

  refetchOrders = () => this.props.orders.refetch();

  handlePageChanged = () => {
    const {
      location: {
        state,
      },
      match: {
        params: {
          id,
        },
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
        orderStatuses: ['PENDING', 'OPEN', 'CLOSED'],
        accountUuid: id,
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
      openOrderStatistics$ = {},
    } = this.props;

    const { content = [], last = true, totalElements } = data?.tradingEngineOrders || {};

    return (
      <div className="AccountProfileOrdersGrid">
        <div className="AccountProfileOrdersGrid__title">
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.HEADLINE')}
        </div>

        <AccountProfileOrdersGridFilter handleRefetch={this.refetchOrders} />

        <div>
          <Table
            stickyFromTop={152}
            items={content}
            loading={loading}
            hasMore={!last}
            sorts={state?.sorts}
            onSort={this.handleSort}
            onMore={this.handlePageChanged}
          >
            <Column
              sortBy="id"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.TRADE')}
              render={({ id }) => (
                <div
                  className="AccountProfileOrdersGrid__uuid"
                  onClick={() => editOrderModal.show({
                    id,
                    onSuccess: () => this.refetchOrders(),
                  })}
                >
                  <div className="AccountProfileOrdersGrid__cell-value">
                    <Uuid
                      uuid={`${id}`}
                      uuidPrefix="TR"
                    />
                    <EditButton className="AccountProfileOrdersGrid__edit-button" />
                  </div>
                </div>
              )}
            />
            <Column
              sortBy="type"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.TYPE')}
              render={({ type }) => (
                <div
                  className={classNames(
                    getTypeColor(types.find(item => item.value === type).value),
                    'AccountProfileOrdersGrid__cell-value',
                  )}
                >
                  {I18n.t(types.find(item => item.value === type).label)}
                </div>
              )}
            />
            <Column
              sortBy="symbol"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.SYMBOL')}
              render={({ symbol }) => <div className="AccountProfileOrdersGrid__cell-value">{symbol}</div>}
            />
            <Column
              sortBy="openingTime"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.OPENING_TIME')}
              render={({ time }) => (
                <Fragment>
                  <div className="AccountProfileOrdersGrid__cell-value">
                    {moment.utc(time.creation).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="AccountProfileOrdersGrid__cell-value-add">
                    {moment.utc(time.creation).local().format('HH:mm:ss')}
                  </div>
                </Fragment>
              )}
            />
            <Column
              sortBy="openingPrice"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.OPEN_PRICE')}
              render={({ openPrice }) => (
                <Fragment>
                  <div className="AccountProfileOrdersGrid__cell-value">{openPrice}</div>
                </Fragment>
              )}
            />
            <Column
              sortBy="volume"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.VOLUME')}
              render={({ volumeLots }) => (
                <div className="AccountProfileOrdersGrid__cell-value">{volumeLots}</div>
              )}
            />
            <Column
              sortBy="stopLoss"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.S/L')}
              render={({ stopLoss }) => (
                <div className="AccountProfileOrdersGrid__cell-value">{stopLoss}</div>
              )}
            />
            <Column
              sortBy="takeProfit"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.T/P')}
              render={({ takeProfit }) => (
                <div className="AccountProfileOrdersGrid__cell-value">{takeProfit}</div>
              )}
            />
            <Column
              sortBy="swaps"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.SWAP')}
              render={({ swaps }) => (
                <div className="AccountProfileOrdersGrid__cell-value">{swaps}</div>
              )}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.P&L')}
              render={({ id, pnl }) => (
                <div className="AccountProfileOrdersGrid__cell-value">
                  {(openOrderStatistics$[id]?.data.pnl || pnl.net)?.toFixed(2)}
                </div>
              )}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.PRICE')}
              render={({ id, digits, price }) => (
                <div className="AccountProfileOrdersGrid__cell-value">
                  {(openOrderStatistics$[id]?.data.currentPrice || price)?.toFixed(digits)}
                </div>
              )}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.STATUS')}
              render={({ status }) => (
                <Choose>
                  <When condition={status}>
                    <div
                      className={tradeStatusesColor[`${status}`]}
                    >
                      <strong>{I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATUSES.${status}`)}</strong>
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
  withStreams(({ match: { params: { id } } }) => ({
    openOrderStatistics$: {
      route: 'streamOpenOrderStatistics',
      data: { accountUuid: id },
      accumulator: (curr, next) => ({ ...curr, [next.data.orderId]: next }),
    },
  })),
)(AccountProfileOrdersGrid);
