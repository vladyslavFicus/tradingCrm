import React, { useEffect, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import compose from 'compose-function';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { State, Sort, Modal } from 'types';
import withModals from 'hoc/withModals';
import { round } from 'utils/round';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import PnL from 'routes/TE/components/PnL';
import CurrentPrice from 'routes/TE/components/CurrentPrice';
import { useSymbolsPricesStream } from 'routes/TE/components/SymbolsPricesStream';
import EditOrderModal from 'routes/TE/modals/EditOrderModal';
import { tradeStatusesColor, types } from '../../attributes/constants';
import { getTypeColor } from '../../attributes/utils';
import AccountProfileOrdersGridFilter from './components/AccountProfileOrdersGridFilter';
import { useOrdersQuery, OrdersQuery, OrdersQueryVariables } from './graphql/__generated__/OrdersQuery';
import './AccountProfileOrdersGrid.scss';

type Order = ExtractApolloTypeFromPageable<OrdersQuery['tradingEngine']['orders']>;

interface Props {
  orderStatuses: [string],
  modals: {
    editOrderModal: Modal,
  },
}

const AccountProfileOrdersGrid = (props: Props) => {
  const {
    orderStatuses,
    modals: {
      editOrderModal,
    },
  } = props;

  const { id: accountUuid } = useParams<{ id: string }>();
  const history = useHistory();
  const { state } = useLocation<State<OrdersQueryVariables['args']>>();

  const ordersQuery = useOrdersQuery({
    variables: {
      args: {
        orderStatuses,
        accountUuid,
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });

  const { content = [], last = true, totalElements } = ordersQuery.data?.tradingEngine.orders || {};

  // Subscribe to symbol prices stream on opened positions
  const symbolsPrices = useSymbolsPricesStream(
    content.map(({ symbol }) => symbol),
  );

  const refetchOrders = () => ordersQuery.refetch();

  useEffect(() => {
    EventEmitter.on(ORDER_RELOAD, refetchOrders);

    return () => {
      EventEmitter.off(ORDER_RELOAD, refetchOrders);
    };
  });

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = ordersQuery;

    const page = data?.tradingEngine.orders.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as OrdersQueryVariables), 'args.page.from', page + 1),
    });
  };

  const handleSort = (sorts: Sort[]) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  return (
    <div className="AccountProfileOrdersGrid">
      <div className="AccountProfileOrdersGrid__title">
        <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.HEADLINE')}
      </div>

      <AccountProfileOrdersGridFilter onRefresh={refetchOrders} />

      <div>
        <Table
          stickyFromTop={152}
          items={content}
          loading={ordersQuery.loading}
          hasMore={!last}
          sorts={state?.sorts}
          onSort={handleSort}
          onMore={handlePageChanged}
        >
          <Column
            sortBy="id"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.TRADE')}
            render={({ id }: Order) => (
              <>
                <div
                  className="AccountProfileOrdersGrid__cell-value AccountProfileOrdersGrid__cell-value--pointer"
                  onClick={() => editOrderModal.show({
                    id,
                    onSuccess: () => refetchOrders(),
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
            sortBy="type"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.TYPE')}
            render={({ type }: Order) => (
              <div
                className={classNames(
                  getTypeColor(type),
                  'AccountProfileOrdersGrid__cell-value',
                )}
              >
                {I18n.t(types.find(item => item.value === type)?.label as string)}
              </div>
            )}
          />
          <Column
            sortBy="symbol"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.SYMBOL')}
            render={({ symbol }: Order) => <div className="AccountProfileOrdersGrid__cell-value">{symbol}</div>}
          />
          <Column
            sortBy="openingTime"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.OPENING_TIME')}
            render={({ time }: Order) => (
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
            render={({ openPrice }: Order) => (
              <Fragment>
                <div className="AccountProfileOrdersGrid__cell-value">{openPrice}</div>
              </Fragment>
            )}
          />
          <Column
            sortBy="volume"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.VOLUME')}
            render={({ volumeLots }: Order) => (
              <div className="AccountProfileOrdersGrid__cell-value">{volumeLots}</div>
            )}
          />
          <Column
            sortBy="stopLoss"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.S/L')}
            render={({ stopLoss }: Order) => (
              <div className="AccountProfileOrdersGrid__cell-value">
                <Choose>
                  <When condition={!!stopLoss}>
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
            render={({ takeProfit }: Order) => (
              <div className="AccountProfileOrdersGrid__cell-value">
                <Choose>
                  <When condition={!!takeProfit}>
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
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.SWAP')}
            render={({ swaps }: Order) => (
              <div className="AccountProfileOrdersGrid__cell-value">{swaps}</div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.P&L')}
            render={({ type, symbol, openPrice, volumeLots, digits, account, symbolConfig }: Order) => {
              const { bid = 0, ask = 0, pnlRates = {} } = symbolsPrices[symbol] || {};
              const { bidAdjustment = 0, askAdjustment = 0 } = symbolConfig || {};

              // Get current BID and ASK prices with applied group spread
              const currentPriceBid = round(bid - bidAdjustment, digits);
              const currentPriceAsk = round(ask + askAdjustment, digits);

              return (
                <div className="TradingEngineOrdersGrid__cell-value">
                  <PnL
                    type={type}
                    openPrice={openPrice}
                    currentPriceBid={currentPriceBid}
                    currentPriceAsk={currentPriceAsk}
                    volume={volumeLots}
                    lotSize={symbolConfig?.lotSize || 0}
                    exchangeRate={pnlRates[account.currency]}
                  />
                </div>
              );
            }}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.PRICE')}
            render={({ type, symbol, digits, symbolConfig }: Order) => {
              const { bid = 0, ask = 0 } = symbolsPrices[symbol] || {};
              const { bidAdjustment = 0, askAdjustment = 0 } = symbolConfig || {};

              // Get current BID and ASK prices with applied group spread
              const currentPriceBid = round(bid - bidAdjustment, digits);
              const currentPriceAsk = round(ask + askAdjustment, digits);

              return (
                <div className="AccountProfileOrdersGrid__cell-value">
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
            sortBy="closingTime"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.CLOSING_TIME')}
            render={({ time: { closing } }) => (
              <Choose>
                <When condition={closing}>
                  <div className="AccountProfileOrdersGrid__cell-value">
                    {moment.utc(closing).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="AccountProfileOrdersGrid__cell-value-add">
                    {moment.utc(closing).local().format('HH:mm:ss')}
                  </div>
                </When>
                <Otherwise>
                  <span>&mdash;</span>
                </Otherwise>
              </Choose>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.STATUS')}
            render={({ status }: Order) => (
              <div className={tradeStatusesColor[status]}>
                <strong>{I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATUSES.${status}`)}</strong>
              </div>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    editOrderModal: EditOrderModal,
  }),
)(AccountProfileOrdersGrid);
