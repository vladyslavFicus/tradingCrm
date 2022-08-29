import React, { useEffect, Fragment, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import compose from 'compose-function';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { withNotifications, withModals } from 'hoc';
import { LevelType, Notify, State, Sort, Modal, TableSelection } from 'types';
import { Button } from 'components/UI';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent';
import { round } from 'utils/round';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import PnL from 'routes/TE/components/PnL';
import CurrentPrice from 'routes/TE/components/CurrentPrice';
import { useSymbolsPricesStream } from 'routes/TE/components/SymbolsPricesStream';
import EditOrderModal from 'routes/TE/modals/EditOrderModal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { TradingEngine__OrderStatuses__Enum as OrderStatuses } from '__generated__/types';
import { tradeStatusesColor, types } from '../../attributes/constants';
import { MAX_SELECTED_ACCOUNT_ORDERS } from '../../constants';
import { getTypeColor } from '../../attributes/utils';
import AccountProfileOrdersGridFilter from './components/AccountProfileOrdersGridFilter';
import AccountProfileBulkActions from './components/AccountProfileBulkActions';
import { useOrdersQuery, OrdersQuery, OrdersQueryVariables } from './graphql/__generated__/OrdersQuery';
import { useCloseOrderMutation } from './graphql/__generated__/CloseOrderMutation';
import './AccountProfileOrdersGrid.scss';

type Order = ExtractApolloTypeFromPageable<OrdersQuery['tradingEngine']['orders']>;

type Props = {
  orderStatus: OrderStatuses,
  showCloseButtonColumn?: boolean,
  modals: {
    editOrderModal: Modal,
    confirmationModal: Modal,
  },
  notify: Notify,
}

const AccountProfileOrdersGrid = (props: Props) => {
  const {
    orderStatus,
    showCloseButtonColumn = false,
    modals: {
      editOrderModal,
      confirmationModal,
    },
    notify,
  } = props;

  const { id: accountUuid } = useParams<{ id: string }>();
  const history = useHistory();
  const { state } = useLocation<State<OrdersQueryVariables['args']>>();
  const [select, setSelect] = useState<TableSelection | null>(null);

  const permission = usePermission();
  const [closeOrder] = useCloseOrderMutation();

  const ordersQuery = useOrdersQuery({
    variables: {
      args: {
        orderStatuses: [orderStatus],
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

  const refetchOrders = () => { select?.reset(); ordersQuery.refetch(); };

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

  const handleCloseOrderClick = (order: Order) => {
    confirmationModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.DESCRIPTION', order),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'AccountProfileOrdersGrid__confirmation-modal',
      onSubmit: async () => {
        try {
          await closeOrder({
            variables: { orderId: order.id },
          });

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.NOTIFICATION.CLOSE_SUCCESS'),
          });

          ordersQuery.refetch();
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
    <div className="AccountProfileOrdersGrid">
      <div className="AccountProfileOrdersGrid__header">
        <div className="AccountProfileOrdersGrid__title">
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.HEADLINE')}<br />
          <If condition={!!select?.selected}>
            <div className="AccountProfileOrdersGrid__selected">
              <strong>{select?.selected}</strong> {I18n.t('COMMON.ORDERS_SELECTED')}
            </div>
          </If>
        </div>
        <PermissionContent permissions={permissions.WE_TRADING.BULK_ORDER_CLOSE}>
          <If condition={!!select?.selected && orderStatus === OrderStatuses.OPEN}>
            <div className="AccountProfileOrdersGrid__actions">
              <AccountProfileBulkActions select={select} ordersQuery={ordersQuery} />
            </div>
          </If>
        </PermissionContent>
      </div>

      <AccountProfileOrdersGridFilter onRefresh={refetchOrders} />

      <div>
        <Table
          stickyFromTop={124}
          items={content}
          loading={ordersQuery.loading}
          hasMore={!last}
          withMultiSelect
          maxSelectCount={MAX_SELECTED_ACCOUNT_ORDERS}
          sorts={state?.sorts}
          onSort={handleSort}
          onSelect={setSelect}
          onMore={handlePageChanged}
          totalCount={totalElements}
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
            sortBy="commission"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.COMMISSION')}
            render={({ commission }: Order) => (
              <div className="AccountProfileOrdersGrid__cell-value">
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
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.STATUS')}
            render={({ status }: Order) => (
              <div className={tradeStatusesColor[status]}>
                <strong>{I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATUSES.${status}`)}</strong>
              </div>
            )}
          />
          <If condition={permission.allows(permissions.WE_TRADING.CLOSE_ORDER) && showCloseButtonColumn}>
            <Column
              header={I18n.t('TRADING_ENGINE.ORDERS.GRID.ACTIONS')}
              render={(order: Order) => (
                <PermissionContent permissions={permissions.WE_TRADING.CLOSE_ORDER}>
                  <Button
                    type="submit"
                    onClick={() => handleCloseOrderClick(order)}
                    danger
                  >
                    {I18n.t('COMMON.CLOSE')}
                  </Button>
                </PermissionContent>
              )}
            />
          </If>
        </Table>
      </div>
    </div>
  );
};

AccountProfileOrdersGrid.defaultProps = {
  showCloseButtonColumn: false,
};

export default compose(
  React.memo,
  withNotifications,
  withModals({
    editOrderModal: EditOrderModal,
    confirmationModal: ConfirmActionModal,
  }),
)(AccountProfileOrdersGrid);
