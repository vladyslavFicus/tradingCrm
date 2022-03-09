import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals, withNotifications } from 'hoc';
import { LevelType, Modal, Notify } from 'types';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Button } from 'components/UI';
import { OrderQuery } from '../../graphql/__generated__/OrderQuery';
import { useReopenOrderMutation } from './graphql/__generated__/ReopenOrderMutation';

interface Props {
  order: OrderQuery['tradingEngine']['order'],
  onSuccess: (shouldCloseModal?: boolean) => void,
  notify: Notify,
  modals: {
    confirmationModal: Modal,
  },
}

const ReopenOrderButton = (props: Props) => {
  const {
    order,
    onSuccess,
    notify,
    modals: {
      confirmationModal,
    },
  } = props;

  const { id } = order;

  const [reopenOrder, { loading }] = useReopenOrderMutation();

  const handleReopenOrder = async () => {
    confirmationModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.REOPEN_ORDER_TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.REOPEN_ORDER_TEXT', { id }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'EditOrderModal__confirmation-modal',
      onSubmit: async () => {
        try {
          await reopenOrder({
            variables: {
              orderId: id,
            },
          });

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.REOPEN_SUCCESS'),
          });

          onSuccess(true);
        } catch (_) {
          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.REOPEN_FAILED'),
          });
        }
      },
    });
  };

  return (
    <Button
      primary
      className="EditOrderModal__button"
      onClick={handleReopenOrder}
      disabled={loading}
    >
      {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.REOPEN')}
    </Button>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(ReopenOrderButton);