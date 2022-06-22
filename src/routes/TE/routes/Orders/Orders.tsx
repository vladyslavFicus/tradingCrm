import React, { Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import compose from 'compose-function';
import Hotkeys from 'react-hot-keys';
import { UncontrolledTooltip } from 'reactstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import permissions from 'config/permissions';
import { withStorage } from 'providers/StorageProvider';
import { round } from 'utils/round';
import { Table, Column } from 'components/Table';
import withModals from 'hoc/withModals';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import Tabs from 'components/Tabs';
import PermissionContent from 'components/PermissionContent';
import { Modal, State, Sort } from 'types';
import { Storage } from 'types/storage';
import PnL from 'routes/TE/components/PnL';
import { useSymbolsPricesStream } from 'routes/TE/components/SymbolsPricesStream';
import NewOrderModal from 'routes/TE/modals/NewOrderModal';
import EditOrderModal from 'routes/TE/modals/EditOrderModal';
import { tradingEngineTabs } from '../../constants';
import OrdersFilter from './components/OrdersFilter';
import { types, tradeStatusesColor } from './attributes/constants';
import { getTypeColor } from './attributes/utils';
import { useOrdersQuery, OrdersQuery, OrdersQueryVariables } from './graphql/__generated__/OrdersQuery';
import { ReactComponent as ErrorIcon } from './img/error.svg';
import './Orders.scss';

type Order = ExtractApolloTypeFromPageable<OrdersQuery['tradingEngine']['orders']>;

interface Props {
  storage: Storage,
  modals: {
    newOrderModal: Modal,
    editOrderModal: Modal,
  },
}

const Orders = (props: Props) => {
  const {
    storage,
    modals: {
      newOrderModal,
      editOrderModal,
    },
  } = props;

  const history = useHistory();
  const { state } = useLocation<State<OrdersQueryVariables['args']>>();

  const ordersQuery = useOrdersQuery({
    variables: {
      args: {
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
    content.filter(({ status }) => status === 'OPEN').map(({ symbol }) => symbol),
  );

  // ==== Handlers ==== //
  const handleOpenLastCreatedOrder = () => {
    const id = storage.get('TE.lastCreatedOrderId');

    if (id) {
      editOrderModal.show({
        id,
        onSuccess: ordersQuery.refetch,
      });
    }
  };

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

  const handleNewOrderClick = () => {
    newOrderModal.show({
      onSuccess: ordersQuery.refetch,
    });
  };

  return (
    <div className="Orders">
      <Tabs items={tradingEngineTabs} />

      <div className="Orders__header">
        <span>
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ORDERS.HEADLINE')}
        </span>

        <PermissionContent permissions={permissions.WE_TRADING.CREATE_ORDER}>
          <div className="Orders__actions">
            <Button
              className="Orders__action"
              onClick={handleNewOrderClick}
              commonOutline
              small
            >
              {I18n.t('TRADING_ENGINE.ORDERS.NEW_ORDER')}
            </Button>
          </div>
        </PermissionContent>
      </div>

      {/* Hotkey on F9 button to open new order modal */}
      <PermissionContent permissions={permissions.WE_TRADING.CREATE_ORDER}>
        <Hotkeys
          keyName="f9"
          onKeyUp={handleNewOrderClick}
        />
      </PermissionContent>

      {/* Open last created order by SHIFT+Q hot key */}
      <Hotkeys keyName="shift+q" filter={() => true} onKeyUp={handleOpenLastCreatedOrder} />

      <OrdersFilter onRefresh={ordersQuery.refetch} />

      <Table
        items={content}
        loading={ordersQuery.loading}
        hasMore={!last}
        sorts={state?.sorts}
        onSort={handleSort}
        onMore={handlePageChanged}
        stickyFromTop={127}
      >
        <Column
          sortBy="id"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.DEAL')}
          render={({ id }: Order) => (
            <>
              <div
                className="Orders__cell-value Orders__cell-value--pointer"
                onClick={() => editOrderModal.show({
                  id,
                  onSuccess: ordersQuery.refetch,
                })}
              >
                {id}
              </div>
              <Uuid
                uuid={id.toString()}
                title={I18n.t('COMMON.COPY')}
                className="Orders__cell-value-add"
              />
            </>
          )}
        />
        <Column
          sortBy="accountLogin"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.LOGIN')}
          render={({ accountLogin }: Order) => (
            <div className="Orders__cell-value">
              <Uuid uuid={accountLogin.toString()} />
            </div>
          )}
        />
        <Column
          sortBy="account.group"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.GROUP')}
          render={({ group }: Order) => (
            <div className="Orders__cell-value">
              <Choose>
                <When condition={!!group}>
                  {group}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          sortBy="openingTime"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.OPEN_TIME')}
          render={({ time }: Order) => (
            <Fragment>
              <div className="Orders__cell-value">
                {moment.utc(time.creation).local().format('DD.MM.YYYY')}
              </div>
              <div className="Orders__cell-value-add">
                {moment.utc(time.creation).local().format('HH:mm')}
              </div>
            </Fragment>
          )}
        />
        <Column
          sortBy="type"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.TYPE')}
          render={({ type }: Order) => (
            <div
              className={classNames(
                getTypeColor(types.find(item => item.value === type)?.value),
                'Orders__cell-value',
              )}
            >
              {I18n.t(types.find(item => item.value === type)?.label as string)}
            </div>
          )}
        />
        <Column
          sortBy="symbol"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.SYMBOL')}
          render={({ symbol }: Order) => (
            <div className="Orders__cell-value">
              {symbol}
            </div>
          )}
        />
        <Column
          sortBy="volumeLots"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.LOTS')}
          render={({ volumeLots }: Order) => (
            <div className="Orders__cell-value">
              {volumeLots}
            </div>
          )}
        />
        <Column
          sortBy="openingPrice"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.OPEN_PRICE')}
          render={({ openPrice, digits }: Order) => (
            <div className="Orders__cell-value">
              {openPrice.toFixed(digits)}
            </div>
          )}
        />
        <Column
          sortBy="closingPrice"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.CLOSE_PRICE')}
          render={({ closePrice, digits }: Order) => (
            <div className="Orders__cell-value">
              {closePrice !== null ? closePrice.toFixed(digits) : '-'}
            </div>
          )}
        />
        <Column
          sortBy="stopLoss"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.S/L')}
          render={({ stopLoss }: Order) => (
            <div className="Orders__cell-value">
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
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.T/P')}
          render={({ takeProfit }: Order) => (
            <div className="Orders__cell-value">
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
          sortBy="closingTime"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.CLOSE_TIME')}
          render={({ time }: Order) => (
            <Choose>
              <When condition={!!time.closing}>
                <div className="Orders__cell-value">
                  {/* @ts-expect-error 'time.closing' can be null and TS not working with JSX control statements */}
                  {moment.utc(time.closing).local().format('DD.MM.YYYY')}
                </div>
                <div className="Orders__cell-value-add">
                  {/* @ts-expect-error 'time.closing' can be null and TS not working with JSX control statements */}
                  {moment.utc(time.closing).local().format('HH:mm:ss')}
                </div>
              </When>
              <Otherwise>
                &mdash;
              </Otherwise>
            </Choose>
          )}
        />
        <Column
          sortBy="commission"
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.COMMISSION')}
          render={({ commission }: Order) => (
            <div className="Orders__cell-value">
              <Choose>
                <When condition={!!commission}>
                  {commission}
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
          render={({ swaps }: Order) => (
            <div className="Orders__cell-value">
              <Choose>
                <When condition={!!swaps}>
                  {swaps}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.PNL')}
          render={({
            id,
            type,
            openPrice,
            symbol,
            volumeLots,
            account,
            digits,
            symbolConfig,
            status,
            pnl,
          }: Order) => {
            const { bid = 0, ask = 0, pnlRates = {} } = symbolsPrices[symbol] || {};
            const { bidAdjustment = 0, askAdjustment = 0 } = symbolConfig || {};

            // Get current BID and ASK prices with applied group spread
            const currentPriceBid = round(bid - bidAdjustment, digits);
            const currentPriceAsk = round(ask + askAdjustment, digits);

            return (
              <div className="Orders__cell-value">
                <Choose>
                  {/* If "symbolConfig" not available for order */}
                  <When condition={status === 'OPEN' && !symbolConfig}>
                    <ErrorIcon id={`order-profit-${id}`} className="Orders__instrument-configuration-problem" />
                    <UncontrolledTooltip
                      placement="top"
                      target={`order-profit-${id}`}
                    >
                      {I18n.t('TRADING_ENGINE.ORDERS.GRID.INSTRUMENT_CONFIGURATION_PROBLEM')}
                    </UncontrolledTooltip>
                  </When>
                  <When condition={status === 'OPEN'}>
                    <PnL
                      type={type}
                      openPrice={openPrice}
                      currentPriceBid={currentPriceBid}
                      currentPriceAsk={currentPriceAsk}
                      volume={volumeLots}
                      lotSize={symbolConfig?.lotSize || 0}
                      exchangeRate={pnlRates[account.currency]}
                    />
                  </When>
                  <When condition={status === 'CLOSED'}>
                    {pnl?.gross?.toFixed(2)}
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
          header={I18n.t('TRADING_ENGINE.ORDERS.GRID.STATUS')}
          render={({ status }: Order) => (
            <div className={tradeStatusesColor[status]}>
              <strong>{I18n.t(`TRADING_ENGINE.ORDERS.STATUSES.${status}`)}</strong>
            </div>
          )}
        />
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withStorage,
  withModals({
    newOrderModal: NewOrderModal,
    editOrderModal: EditOrderModal,
  }),
)(Orders);
