import React from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withModals, withNotifications } from 'hoc';
import { LevelType, Modal, Notify, TableSelection } from 'types';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Button } from 'components/UI';
import { OrdersQueryQueryResult, OrdersQuery } from '../../graphql/__generated__/OrdersQuery';
import { useBulkCloseOrderMutation } from './graphql/__generated__/BulkCloseOrderMutation';
import './AccountProfilePendingOrderBulkActions.scss';

type Props = {
  modals: {
    confirmationModal: Modal,
  }
  notify: Notify,
  select: TableSelection,
  ordersQuery: OrdersQueryQueryResult,
}

type Order = ExtractApolloTypeFromPageable<OrdersQuery['tradingEngine']['orders']>;

const AccountProfilePendingOrderBulkActions = (props: Props) => {
  const {
    modals: {
      confirmationModal,
    },
    ordersQuery,
    notify,
    select,
  } = props;

  const [bulkCloseOrders] = useBulkCloseOrderMutation();

  const handleBulkCloseOrderClick = async () => {
    const ordersData = ordersQuery.data?.tradingEngine.orders;

    const selectedOrders = select.all
      ? ordersData?.content
      : select.touched.map(index => ordersData?.content[index]) as Order[];

    const orders = !selectedOrders ? [] : selectedOrders
      .map(order => ({ id: order.id }));

    confirmationModal.show({
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

          EventEmitter.emit(ORDER_RELOAD);
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
        onClick={handleBulkCloseOrderClick}
      >
        {I18n.t('TRADING_ENGINE.MODALS.BULK_CANCEL_ORDERS.TITLE')}
      </Button>
    </div>
  );
};

export default compose(
  React.memo,
  withRouter,
  withNotifications,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(AccountProfilePendingOrderBulkActions);
