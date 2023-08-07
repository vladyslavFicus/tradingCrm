import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import { TableSelection } from 'types';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import { TradingEngineOrderAccountBulkClose__OrderInput as BulkCloseInput } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { OrdersQueryQueryResult, OrdersQuery } from '../../graphql/__generated__/OrdersQuery';
import { useBulkCloseOrderMutation } from './graphql/__generated__/BulkCloseOrderMutation';
import './AccountProfileOpenOrderBulkActions.scss';

enum closeByEnum {
  MARKET_PRICE = 'MARKET_PRICE',
  TAKE_PROFIT = 'TAKE_PROFIT',
  STOP_LOSS = 'STOP_LOSS',
}

type Order = ExtractApolloTypeFromPageable<OrdersQuery['tradingEngine']['orders']>;

type Props = {
  select: TableSelection | null,
  ordersQuery: OrdersQueryQueryResult,
};

const AccountProfileOpenOrderBulkActions = (props: Props) => {
  const { ordersQuery, select } = props;

  const [bulkCloseOrders] = useBulkCloseOrderMutation();

  const getActionText = (type: closeByEnum) => {
    switch (type) {
      case closeByEnum.TAKE_PROFIT: return I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.CLOSE_BY_TAKE_PROFIT');
      case closeByEnum.STOP_LOSS: return I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.CLOSE_BY_STOP_LOSS');
      default: return I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.CLOSE_BY_MARKET_PRICE');
    }
  };

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleBulkCloseOrderClick = async (closeType: closeByEnum) => {
    const ordersData = ordersQuery.data?.tradingEngine.orders;

    const selectedOrders = select?.all
      ? ordersData?.content
      : select?.touched.map(index => ordersData?.content[index]) as Order[];

    const orders = !selectedOrders
      ? []
      : selectedOrders.map((order) => {
        if (closeType === closeByEnum.MARKET_PRICE) {
          return { id: order.id };
        }

        if (closeType === closeByEnum.STOP_LOSS && order.stopLoss) {
          return { id: order.id, closePrice: order.stopLoss };
        }

        if (closeType === closeByEnum.TAKE_PROFIT && order.takeProfit) {
          return { id: order.id, closePrice: order.takeProfit };
        }
        return false;
      }).filter(order => !!order) as BulkCloseInput[];

    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.TITLE'),
      actionText: getActionText(closeType),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'Orders__confirmation-modal',
      onSubmit: async () => {
        try {
          if (orders.length) {
            await bulkCloseOrders({
              variables: {
                args: {
                  orders,
                },
              },
            });
          }

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.CLOSE_ORDER.NOTIFICATION.CLOSE_SUCCESS'),
          });

          EventEmitter.emit(ORDER_RELOAD);
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
    <div className="AccountProfileOpenOrderBulkActions">
      <div className="AccountProfileOpenOrderBulkActions__title">
        {I18n.t('TRADING_ENGINE.ACCOUNTS.BULK_ACTIONS')}
      </div>

      <Button
        tertiary
        className="AccountProfileOpenOrderBulkActions__button"
        data-testid="AccountProfileOpenOrderBulkActions-closeByMpButton"
        onClick={() => handleBulkCloseOrderClick(closeByEnum.MARKET_PRICE)}
      >
        {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.BULK_CLOSE_BY_MP')}
      </Button>

      <Button
        tertiary
        className="AccountProfileOpenOrderBulkActions__button"
        data-testid="AccountProfileOpenOrderBulkActions-closeByTpButton"
        onClick={() => handleBulkCloseOrderClick(closeByEnum.TAKE_PROFIT)}
      >
        {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.BULK_CLOSE_BY_TP')}
      </Button>

      <Button
        tertiary
        className="AccountProfileOpenOrderBulkActions__button"
        data-testid="AccountProfileOpenOrderBulkActions-closeByStButton"
        onClick={() => handleBulkCloseOrderClick(closeByEnum.STOP_LOSS)}
      >
        {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.BULK_CLOSE_BY_SL')}
      </Button>
    </div>
  );
};

export default React.memo(AccountProfileOpenOrderBulkActions);
