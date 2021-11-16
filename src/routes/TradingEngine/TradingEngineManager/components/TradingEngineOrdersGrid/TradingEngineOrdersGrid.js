import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import Hotkeys from 'react-hot-keys';
import { withRouter } from 'react-router-dom';
import { withLazyStreams } from 'rsocket';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { round } from 'utils/round';
import { Table, Column } from 'components/Table';
import withModals from 'hoc/withModals';
import Uuid from 'components/Uuid';
import Tabs from 'components/Tabs';
import PnL from 'routes/TradingEngine/components/PnL';
import SymbolsPricesStream from 'routes/TradingEngine/components/SymbolsPricesStream';
import EditOrderModal from 'routes/TradingEngine/TradingEngineManager/modals/EditOrderModal';
import TradingEngineOrdersQuery from './graphql/TradingEngineOrdersQuery';
import { tradingEngineTabs } from '../../constants';
import TradingEngineOrdersGridFilter from './components/TradingEngineOrdersGridFilter';
import { types, tradeStatusesColor } from './attributes/constants';
import { getTypeColor } from './attributes/utils';
import './TradingEngineOrdersGrid.scss';

class TradingEngineOrdersGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    ...withStorage.propTypes,
    modals: PropTypes.shape({
      editOrderModal: PropTypes.modalType,
    }).isRequired,
    ordersQuery: PropTypes.query({
      tradingEngineOrders: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
  };

  state = {
    symbolsPrices: {},
  };

  refetchOrders = () => this.props.ordersQuery.refetch();

  handlePageChanged = () => {
    const {
      location: {
        state,
      },
      ordersQuery: {
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

  handleOpenLastCreatedOrder = () => {
    const {
      storage,
      modals: {
        editOrderModal,
      },
    } = this.props;

    const id = storage.get('TE.lastCreatedOrderId');

    if (id) {
      editOrderModal.show({
        id,
        onSuccess: this.refetchOrders,
      });
    }
  }

  handleSymbolsPricesTick = (symbolsPrices) => {
    this.setState({ symbolsPrices });
  };

  render() {
    const {
      location: { state },
      ordersQuery: {
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

        {/* Open last created order by SHIFT+Q hot key */}
        <Hotkeys keyName="shift+q" filter={() => true} onKeyUp={this.handleOpenLastCreatedOrder} />

        {/* Subscribe to symbol prices stream */}
        <SymbolsPricesStream
          symbols={content?.map(({ symbol }) => symbol)}
          onNotify={this.handleSymbolsPricesTick}
        />

        <TradingEngineOrdersGridFilter handleRefetch={this.refetchOrders} />

        <div className="TradingEngineOrdersGrid">
          <Table
            items={content}
            loading={loading}
            hasMore={!last}
            sorts={state?.sorts}
            onSort={this.handleSort}
            onMore={this.handlePageChanged}
            stickyFromTop={125}
          >
            <Column
              sortBy="id"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.TRADE')}
              render={({ id }) => (
                <>
                  <div
                    className="TradingEngineOrdersGrid__cell-value TradingEngineOrdersGrid__cell-value--pointer"
                    onClick={() => editOrderModal.show({
                      id,
                      onSuccess: () => this.refetchOrders(),
                    })}
                  >
                    TR-{id}
                  </div>
                  <Uuid
                    uuid={id.toString()}
                    title={I18n.t('COMMON.COPY')}
                    className="AccountProfileOrdersGrid__cell-value-add"
                  />
                </>
              )}
            />
            <Column
              sortBy="accountLogin"
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.LOGIN')}
              render={({ accountLogin }) => (
                <>
                  <div className="TradingEngineOrdersGrid__cell-value">
                    <Uuid uuid={accountLogin.toString()} />
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
              render={({ symbol, type, status, openPrice, volumeLots, digits, symbolEntity, groupSpread, account }) => {
                const currentSymbol = this.state.symbolsPrices[symbol];

                // Get current BID and ASK prices with applied group spread
                const currentPriceBid = round(currentSymbol?.bid - groupSpread.bidAdjustment, digits);
                const currentPriceAsk = round(currentSymbol?.ask + groupSpread.askAdjustment, digits);

                return (
                  <div className="TradingEngineOrdersGrid__cell-value">
                    <Choose>
                      <When condition={status === 'OPEN'}>
                        <PnL
                          type={type}
                          openPrice={openPrice}
                          currentPriceBid={currentPriceBid}
                          currentPriceAsk={currentPriceAsk}
                          volume={volumeLots}
                          lotSize={symbolEntity.lotSize}
                          exchangeRate={currentSymbol?.pnlRates[account.currency]}
                        />
                      </When>
                      <Otherwise>
                        &mdash;
                      </Otherwise>
                    </Choose>
                  </div>
                );
              }}
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
  withStorage,
  withModals({
    editOrderModal: EditOrderModal,
  }),
  withRequests({
    ordersQuery: TradingEngineOrdersQuery,
  }),
  withLazyStreams({
    symbolsStreamRequest: {
      route: 'streamAllSymbolPrices',
    },
  }),
)(TradingEngineOrdersGrid);