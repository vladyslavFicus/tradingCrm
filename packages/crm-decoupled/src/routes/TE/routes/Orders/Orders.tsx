import React, { Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import { UncontrolledTooltip } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { Config, Utils } from '@crm/common';
import { Button } from 'components';
import { TradingEngine__OrderStatuses__Enum as OrderStatusesEnum } from '__generated__/types';
import { State, Sort } from 'types';
import { OrderCloseByEnum } from 'types/trading-engine';
import { usePermission } from 'providers/PermissionsProvider';
import { useStorage } from 'providers/StorageProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import Tabs from 'components/Tabs';
import ActionsDropDown from 'components/ActionsDropDown';
import PnL from 'routes/TE/components/PnL';
import { useSymbolsPricesStream } from 'routes/TE/components/SymbolsPricesStream';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import NewOrderModal, { NewOrderModalProps } from 'routes/TE/modals/NewOrderModal';
import EditOrderModal, { EditOrderModalProps } from 'routes/TE/modals/EditOrderModal';
import { tradingEngineTabs } from '../../constants';
import OrdersFilter from './components/OrdersFilter';
import { types } from './attributes/constants';
import { useCloseOrderMutation } from './graphql/__generated__/CloseOrderMutation';
import { useOrdersQuery, OrdersQuery, OrdersQueryVariables } from './graphql/__generated__/OrdersQuery';
import { ReactComponent as ErrorIcon } from './img/error.svg';
import './Orders.scss';

type Order = ExtractApolloTypeFromPageable<OrdersQuery['tradingEngine']['orders']>;

const Orders = () => {
  const storage = useStorage();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const editOrderModal = useModal<EditOrderModalProps>(EditOrderModal);
  const newOrderModal = useModal<NewOrderModalProps>(NewOrderModal);

  const navigate = useNavigate();
  const state = useLocation().state as State<OrdersQueryVariables['args']>;

  const permission = usePermission();
  const [closeOrder] = useCloseOrderMutation();

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

  const { data } = ordersQuery;
  const page = data?.tradingEngine.orders.number || 0;
  const { content = [], last = true, totalElements } = data?.tradingEngine.orders || {};

  // Subscribe to symbol prices stream on opened positions
  const symbolsPrices = useSymbolsPricesStream(
    content.filter(({ status }) => status === OrderStatusesEnum.OPEN).map(({ symbol }) => symbol),
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

  const handlePageChanged = useHandlePageChanged({
    query: ordersQuery,
    page,
    path: 'page.from',
  });

  const handleSort = (sorts: Sort[]) => {
    navigate('.', {
      replace: true,
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

  const handleCloseOrderClick = async (order: Order, closeBy: OrderCloseByEnum) => {
    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.TITLE'),
      actionText: I18n.t(`TRADING_ENGINE.MODALS.CLOSE_ORDER.${closeBy}_DESCRIPTION`, order),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'Orders__confirmation-modal',
      onSubmit: async () => {
        // Close with price by market
        let closePrice = null;

        // Close with price by stop loss
        if (closeBy === OrderCloseByEnum.STOP_LOSS) {
          closePrice = order.stopLoss;
        }

        // Close with price by take profit
        if (closeBy === OrderCloseByEnum.TAKE_PROFIT) {
          closePrice = order.takeProfit;
        }

        try {
          await closeOrder({
            variables: {
              orderId: order.id,
              closePrice,
            },
          });

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.NOTIFICATION.CLOSE_SUCCESS'),
          });

          await ordersQuery.refetch();
        } catch (_) {
          notify({
            level: LevelType.ERROR,
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.NOTIFICATION.CLOSE_FAILED'),
          });
        }
      },
    });
  };

  return (
    <div className="Orders">
      <Tabs items={tradingEngineTabs} />

      <div className="Orders__header">
        <span>
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ORDERS.HEADLINE')}
        </span>

        <If condition={permission.allows(Config.permissions.WE_TRADING.CREATE_ORDER)}>
          <div className="Orders__actions">
            <Button
              className="Orders__action"
              data-testid="Orders-newOrderButton"
              onClick={handleNewOrderClick}
              tertiary
              small
            >
              {I18n.t('TRADING_ENGINE.ORDERS.NEW_ORDER')}
            </Button>
          </div>
        </If>
      </div>

      {/* Hotkey on F9 button to open new order modal */}
      <If condition={permission.allows(Config.permissions.WE_TRADING.CREATE_ORDER)}>
        <Hotkeys
          keyName="f9"
          onKeyUp={handleNewOrderClick}
        />
      </If>

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
                'Orders__cell-value',
                'Orders__type', {
                  'Orders__type--buy': type.includes('BUY'),
                  'Orders__type--sell': !type.includes('BUY'),
                },
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
            const currentPriceBid = Utils.round(bid - bidAdjustment, digits);
            const currentPriceAsk = Utils.round(ask + askAdjustment, digits);

            return (
              <div className="Orders__cell-value">
                <Choose>
                  {/* If "symbolConfig" not available for order */}
                  <When condition={status === OrderStatusesEnum.OPEN && !symbolConfig}>
                    <ErrorIcon id={`order-profit-${id}`} className="Orders__instrument-configuration-problem" />
                    <UncontrolledTooltip
                      placement="top"
                      target={`order-profit-${id}`}
                    >
                      {I18n.t('TRADING_ENGINE.ORDERS.GRID.INSTRUMENT_CONFIGURATION_PROBLEM')}
                    </UncontrolledTooltip>
                  </When>
                  <When condition={status === OrderStatusesEnum.OPEN}>
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
                  <When condition={status === OrderStatusesEnum.CLOSED}>
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
            <div
              className={classNames(
                'Orders__status',
                {
                  'Orders__status--pending': status === OrderStatusesEnum.PENDING,
                  'Orders__status--open': status === OrderStatusesEnum.OPEN,
                  'Orders__status--closed': status === OrderStatusesEnum.CLOSED,
                },
              )}
            >
              <strong>{I18n.t(`TRADING_ENGINE.ORDERS.STATUSES.${status}`)}</strong>
            </div>
          )}
        />
        <If condition={permission.allows(Config.permissions.WE_TRADING.CLOSE_ORDER)}>
          <Column
            width={0}
            header={I18n.t('TRADING_ENGINE.ORDERS.GRID.ACTIONS')}
            render={(order: Order) => (
              <div className="Orders__cell-actions">
                <If condition={order.status === OrderStatusesEnum.OPEN}>
                  <Button
                    small
                    danger
                    type="submit"
                    data-testid="Orders-closeOrderButton"
                    onClick={() => handleCloseOrderClick(order, OrderCloseByEnum.MARKET)}
                  >
                    {I18n.t('COMMON.CLOSE')}
                  </Button>

                  <ActionsDropDown
                    className="Orders__cell-actions-dropdown"
                    items={[
                      ...(order.stopLoss !== null
                        ? [{
                          label: I18n.t('TRADING_ENGINE.ORDERS.GRID.CLOSE_BY_STOP_LOSS'),
                          onClick: () => handleCloseOrderClick(order, OrderCloseByEnum.STOP_LOSS),
                        }]
                        : []),
                      ...(order.takeProfit !== null
                        ? [{
                          label: I18n.t('TRADING_ENGINE.ORDERS.GRID.CLOSE_BY_TAKE_PROFIT'),
                          onClick: () => handleCloseOrderClick(order, OrderCloseByEnum.TAKE_PROFIT),
                        }]
                        : []),
                    ]}
                  />
                </If>
              </div>
            )}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(Orders);
