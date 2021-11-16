import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import withModals from 'hoc/withModals';
import PropTypes from 'constants/propTypes';
import { round } from 'utils/round';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import SymbolsPricesStream from 'routes/TradingEngine/components/SymbolsPricesStream';
import CurrentPrice from 'routes/TradingEngine/components/CurrentPrice';
import EditOrderModal from 'routes/TradingEngine/TradingEngineManager/modals/EditOrderModal';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import AccountProfileOrdersGridFilter from './components/AccountProfileOrdersGridFilter';
import { tradeStatusesColor, types } from '../../attributes/constants';
import { getTypeColor } from '../../attributes/utils';
import TradingEngineOrdersQuery from './graphql/TradingEngineOrdersQuery';
import './AccountProfilePendingOrdersGrid.scss';

class AccountProfilePendingOrdersGrid extends PureComponent {
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
    orderStatuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  state = {
    symbolsPrices: {},
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
      orderStatuses,
    } = this.props;

    const currentPage = data?.tradingEngineOrders?.number || 0;
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    loadMore({
      args: {
        orderStatuses,
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

  handleSymbolsPricesTick = (symbolsPrices) => {
    this.setState({ symbolsPrices });
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

    const { content = [], last = true, totalElements } = data?.tradingEngineOrders || {};

    return (
      <div className="AccountProfilePendingOrdersGrid">
        <div className="AccountProfilePendingOrdersGrid__title">
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.HEADLINE')}
        </div>

        {/* Subscribe to symbol prices stream */}
        <SymbolsPricesStream
          symbols={content.map(({ symbol }) => symbol)}
          onNotify={this.handleSymbolsPricesTick}
        />

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
                <div className="AccountProfilePendingOrdersGrid__uuid">
                  <div
                    className="
                      AccountProfilePendingOrdersGrid__cell-value
                      AccountProfilePendingOrdersGrid__cell-value--pointer
                    "
                    onClick={() => editOrderModal.show({
                      id,
                      onSuccess: () => this.refetchOrders(),
                    })}
                  >
                    TR-{id}
                  </div>
                  <Uuid
                    uuid={`${id}`}
                    uuidPrefix="TR"
                    title={I18n.t('COMMON.COPY')}
                    className="AccountProfilePendingOrdersGrid__cell-value-add"
                  />
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
                    'AccountProfilePendingOrdersGrid__cell-value',
                  )}
                >
                  {I18n.t(types.find(item => item.value === type).label)}
                </div>
              )}
            />
            <Column
              sortBy="openingTime"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.OPENING_TIME')}
              render={({ time }) => (
                <Fragment>
                  <div className="AccountProfilePendingOrdersGrid__cell-value">
                    {moment.utc(time.creation).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="AccountProfilePendingOrdersGrid__cell-value-add">
                    {moment.utc(time.creation).local().format('HH:mm:ss')}
                  </div>
                </Fragment>
              )}
            />
            <Column
              sortBy="symbol"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.SYMBOL')}
              render={({ symbol }) => <div className="AccountProfilePendingOrdersGrid__cell-value">{symbol}</div>}
            />
            <Column
              sortBy="openingPrice"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.OPEN_PRICE')}
              render={({ openPrice }) => (
                <Fragment>
                  <div className="AccountProfileHistoryGrid__cell-value">{openPrice}</div>
                </Fragment>
              )}
            />
            <Column
              sortBy="volume"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.VOLUME')}
              render={({ volumeLots }) => (
                <div className="AccountProfilePendingOrdersGrid__cell-value">{volumeLots}</div>
              )}
            />
            <Column
              sortBy="stopLoss"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.S/L')}
              render={({ stopLoss }) => (
                <div className="AccountProfilePendingOrdersGrid__cell-value">
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
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.T/P')}
              render={({ takeProfit }) => (
                <div className="AccountProfilePendingOrdersGrid__cell-value">
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
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.PRICE')}
              render={({ type, symbol, digits, groupSpread }) => {
                const currentSymbol = this.state.symbolsPrices[symbol];

                // Get current BID and ASK prices with applied group spread
                const currentPriceBid = round(currentSymbol?.bid - groupSpread.bidAdjustment, digits);
                const currentPriceAsk = round(currentSymbol?.ask + groupSpread.askAdjustment, digits);

                return (
                  <div className="AccountProfilePendingOrdersGrid__cell-value">
                    <CurrentPrice
                      type={type}
                      digits={digits}
                      currentPriceBid={currentPriceBid}
                      currentPriceAsk={currentPriceAsk}
                    />
                  </div>
                );
              }}
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
)(AccountProfilePendingOrdersGrid);