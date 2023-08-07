import React from 'react';
import I18n from 'i18n-js';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Button } from 'components';
import { OrderQuery } from '../../graphql/__generated__/OrderQuery';
import { useCancelOrderMutation } from './graphql/__generated__/CancelOrderMutation';

type Props = {
  order: OrderQuery['tradingEngine']['order'],
  onSuccess: (shouldCloseModal?: boolean) => void,
};

const CancelOrderButton = (props: Props) => {
  const { order, onSuccess } = props;

  const { id } = order;

  const [cancelOrder, { loading }] = useCancelOrderMutation();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleDeleteOrder = async () => {
    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CANCEL_ORDER_TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CANCEL_ORDER_TEXT', { id }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'EditOrderModal__confirmation-modal',
      onSubmit: async () => {
        try {
          await cancelOrder({
            variables: { orderId: id },
          });

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.CANCEL_SUCCESS'),
          });

          onSuccess(true);
        } catch (_) {
          notify({
            level: LevelType.ERROR,
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.CANCEL_FAILED'),
          });
        }
      },
    });
  };

  return (
    <Button
      secondary
      className="EditOrderModal__button"
      onClick={handleDeleteOrder}
      disabled={loading}
    >
      {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CANCEL_ORDER')}
    </Button>
  );
};

export default React.memo(CancelOrderButton);
