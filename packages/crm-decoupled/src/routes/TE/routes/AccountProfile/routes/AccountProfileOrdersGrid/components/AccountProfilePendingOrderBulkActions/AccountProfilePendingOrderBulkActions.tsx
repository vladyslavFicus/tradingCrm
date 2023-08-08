import React from 'react';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { Button } from 'components';
import { TableSelection } from 'types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { OrdersQueryQueryResult, OrdersQuery } from '../../graphql/__generated__/OrdersQuery';
import { useBulkCloseOrderMutation } from './graphql/__generated__/BulkCloseOrderMutation';
import './AccountProfilePendingOrderBulkActions.scss';

type Props = {
  select: TableSelection | null,
  ordersQuery: OrdersQueryQueryResult,
};

type Order = ExtractApolloTypeFromPageable<OrdersQuery['tradingEngine']['orders']>;

const AccountProfilePendingOrderBulkActions = (props: Props) => {
  const { ordersQuery, select } = props;

  const [bulkCloseOrders] = useBulkCloseOrderMutation();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleBulkCloseOrderClick = async () => {
    const ordersData = ordersQuery.data?.tradingEngine.orders || { content: [] };

    const selectedOrders = select?.all
      // Get all orders except unchecked
      ? ordersData?.content.filter((_, index) => !select?.touched.includes(index))
      // Get only checked orders
      : (select?.touched || []).map(index => ordersData?.content[index]) as Order[];

    const orders = selectedOrders.map(order => ({ id: order.id }));

    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.BULK_CANCEL_ORDERS.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.BULK_CANCEL_ORDERS.CANCEL'),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'Orders__confirmation-modal',
      onSubmit: async () => {
        try {
          await bulkCloseOrders({
            variables: {
              args: {
                orders,
              },
            },
          });

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.BULK_CANCEL_ORDERS.NOTIFICATION.CANCEL_SUCCESS'),
          });

          Utils.EventEmitter.emit(Utils.ORDER_RELOAD);
        } catch (_) {
          notify({
            level: LevelType.ERROR,
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.BULK_CANCEL_ORDERS.NOTIFICATION.CANCEL_FAILED'),
          });
        }
      },
    });
  };

  return (
    <div className="AccountProfilePendingOrderBulkActions">
      <div className="AccountProfilePendingOrderBulkActions__title">
        {I18n.t('TRADING_ENGINE.ACCOUNTS.BULK_ACTIONS')}
      </div>

      <Button
        tertiary
        className="AccountProfilePendingOrderBulkActions__button"
        data-testid="AccountProfilePendingOrderBulkActions-cancelOrderButton"
        onClick={handleBulkCloseOrderClick}
      >
        {I18n.t('TRADING_ENGINE.MODALS.BULK_CANCEL_ORDERS.TITLE')}
      </Button>
    </div>
  );
};

export default React.memo(AccountProfilePendingOrderBulkActions);
