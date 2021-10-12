import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withModals, withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { OrderStatus } from 'types/trading-engine';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Button } from 'components/UI';
import Input from 'components/Input';
import ShortLoader from 'components/ShortLoader';
import TextArea from 'components/TextArea';
import OrderQuery from './graphql/OrderQuery';
import DeleteOrderMutation from './graphql/DeleteOrderMutation';
import './ClosedOrderModal.scss';

class ClosedOrderModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    orderQuery: PropTypes.query({
      tradingEngineOrder: PropTypes.order,
    }).isRequired,
    deleteOrder: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
  };

  handleDeleteOrder = async () => {
    const {
      orderQuery,
      notify,
      onCloseModal,
      deleteOrder,
      onSuccess,
      modals: { confirmActionModal },
    } = this.props;

    const {
      id,
      type,
      symbol,
      closePrice,
    } = orderQuery.data?.tradingEngineOrder || {};

    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.CONFIRMATION.CANCEL_ORDER_TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.CONFIRMATION.CANCEL_ORDER_TEXT', {
        id,
        type,
        symbol,
        closePrice,
      }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'ClosedOrderModal__confirmation-modal',
      onSubmit: async () => {
        try {
          await deleteOrder({
            variables: { orderId: id },
          });

          notify({
            level: 'success',
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.NOTIFICATION.CANCEL_SUCCESS'),
          });

          onSuccess();
          onCloseModal();
        } catch (_) {
          notify({
            level: 'error',
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.NOTIFICATION.CANCEL_FAILED'),
          });
        }
      },
    });
  }

  render() {
    const {
      isOpen,
      onCloseModal,
      orderQuery: {
        data,
        loading,
      },
    } = this.props;

    const {
      accountLogin,
      status,
      group,
      leverage,
      id,
      type,
      volumeLots,
      time,
      symbol,
      openPrice,
      closePrice,
      stopLoss,
      takeProfit,
      swaps,
      pnl,
      commission,
      comment,
    } = data?.tradingEngineOrder || {};

    const isStatusClosed = status === OrderStatus.CLOSED;
    const isStatusCanceled = status === OrderStatus.CANCELED;

    return (
      <Modal className="ClosedOrderModal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>
          <Choose>
            <When condition={loading}>
              {I18n.t('COMMON.LOADING')}
            </When>
            <Otherwise>
              {I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.TITLE', {
                id,
                type,
                volumeLots,
                symbol,
                openPrice,
              })}
            </Otherwise>
          </Choose>
        </ModalHeader>

        <Choose>
          <When condition={loading}>
            <ShortLoader className="EditOrderModal--loading" />
          </When>
          <Otherwise>
            <ModalBody>
              <fieldset className="ClosedOrderModal__fieldset">
                <legend className="ClosedOrderModal__fieldset-title">
                  {I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.FIELDSET_TITLE')}
                </legend>
                <div className="ClosedOrderModal__field-container">
                  <Input
                    disabled
                    name="accountLogin"
                    label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.LOGIN')}
                    className="ClosedOrderModal__field"
                    value={accountLogin}
                  />
                  <If condition={isStatusClosed}>
                    <Input
                      disabled
                      name="status"
                      label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.STATUS')}
                      className="ClosedOrderModal__field"
                      value={status}
                    />
                  </If>
                </div>
                <div className="ClosedOrderModal__field-container">
                  <Input
                    disabled
                    name="group"
                    label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.GROUP')}
                    className="ClosedOrderModal__field"
                    value={group}
                  />
                  <Input
                    disabled
                    name="leverage"
                    label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.LEVERAGE')}
                    className="ClosedOrderModal__field"
                    value={leverage}
                  />
                </div>
              </fieldset>
              <fieldset className="ClosedOrderModal__fieldset">
                <legend className="ClosedOrderModal__fieldset-title">
                  {I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.ORDER')}
                </legend>
                <div className="ClosedOrderModal__field-container">
                  <Input
                    disabled
                    name="id"
                    label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.ORDER')}
                    className="ClosedOrderModal__field"
                    value={id}
                  />
                  <Input
                    disabled
                    name="type"
                    label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.TYPE')}
                    className="ClosedOrderModal__field"
                    value={`${type} ${volumeLots} ${symbol}`}
                  />
                </div>
                <div className="ClosedOrderModal__field-container">
                  <Input
                    disabled
                    name="openTime"
                    label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.OPEN_TIME')}
                    className="ClosedOrderModal__field"
                    value={moment.utc(time?.creation).local().format('DD.MM.YYYY HH:mm:ss')}
                  />
                  <If condition={isStatusClosed}>
                    <Input
                      disabled
                      name="closeTime"
                      label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.CLOSE_TIME')}
                      className="ClosedOrderModal__field"
                      value={moment.utc(time?.closing).local().format('DD.MM.YYYY HH:mm:ss')}
                    />
                  </If>
                </div>
                <div className="ClosedOrderModal__field-container">
                  <Input
                    disabled
                    name="openPrice"
                    label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.OPEN_PRICE')}
                    className="ClosedOrderModal__field"
                    value={openPrice}
                  />
                  <If condition={isStatusClosed}>
                    <Input
                      disabled
                      name="closePrice"
                      label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.CLOSE_PRICE')}
                      className="ClosedOrderModal__field"
                      value={closePrice}
                    />
                  </If>
                </div>
                <div className="ClosedOrderModal__field-container">
                  <Input
                    disabled
                    name="stopLoss"
                    label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.STOP_LOSS')}
                    className="ClosedOrderModal__field"
                    value={stopLoss}
                  />
                  <Input
                    disabled
                    name="takeProfit"
                    label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.TAKE_PROFIT')}
                    className="ClosedOrderModal__field"
                    value={takeProfit}
                  />
                </div>
                <If condition={isStatusClosed}>
                  <div className="ClosedOrderModal__field-container">
                    <Input
                      disabled
                      name="swaps"
                      label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.R_O_SWAPS')}
                      className="ClosedOrderModal__field"
                      value={swaps}
                    />
                    <Input
                      disabled
                      name="profit"
                      label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.PROFIT')}
                      className="ClosedOrderModal__field"
                      value={pnl?.gross}
                    />
                  </div>
                  <div className="ClosedOrderModal__field-container">
                    <Input
                      disabled
                      name="commission"
                      label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.COMISSION')}
                      className="ClosedOrderModal__field"
                      value={commission}
                    />
                  </div>
                  <div className="ClosedOrderModal__field-container">
                    <TextArea
                      disabled
                      name="comment"
                      label={I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.COMMENT')}
                      className="ClosedOrderModal__field"
                      value={comment}
                    />
                  </div>
                </If>
              </fieldset>
            </ModalBody>
            <ModalFooter className="ClosedOrderModal__container-button">
              <Button
                className="ClosedOrderModal__button ClosedOrderModal__button--small"
                danger
                onClick={this.handleDeleteOrder}
                disabled={isStatusCanceled}
              >
                {I18n.t('TRADING_ENGINE.MODALS.CLOSED_ORDER_MODAL.CANCEL')}
              </Button>
              <Button
                onClick={onCloseModal}
                className="ClosedOrderModal__button"
                common
              >
                {I18n.t('COMMON.CLOSE')}
              </Button>
            </ModalFooter>
          </Otherwise>
        </Choose>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    orderQuery: OrderQuery,
    deleteOrder: DeleteOrderMutation,
  }),
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
)(ClosedOrderModal);
