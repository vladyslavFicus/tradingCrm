import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { parseErrors } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { LevelType, Modal, Notify } from 'types';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Button } from 'components/Buttons';
import { OrderQuery } from '../../graphql/__generated__/OrderQuery';
import { useReopenOrderMutation } from './graphql/__generated__/ReopenOrderMutation';

type Props = {
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
        } catch (e) {
          const error = parseErrors(e);

          // Is symbol not found by route order -> account group -> group-securities -> symbol
          const isSymbolRouteNotFound = [
            'error.symbol.not.found',
            'error.symbol.disabled',
            'error.order.symbol.not.related',
            'error.trading.order.group-security.disabled',
          ].includes(error.error);

          notify({
            level: LevelType.ERROR,
            title: I18n.t('COMMON.ERROR'),
            message: isSymbolRouteNotFound
              ? I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.REOPEN_FAILED_SYMBOL_NOT_FOUND')
              : I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.REOPEN_FAILED'),
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
