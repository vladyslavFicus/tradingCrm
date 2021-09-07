import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import moment from 'moment';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications, withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import { createValidator } from 'utils/validator';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import editOrderMutation from './graphql/EditOrderMutation';
import closeOrderMutation from './graphql/CloseOrderMutation';
import deleteOrderMutation from './graphql/DeleteOrderMutation';
import orderQuery from './graphql/OrderQuery';
import './EditOrderModal.scss';

class EditOrderModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    editOrder: PropTypes.func.isRequired,
    closeOrder: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
  };

  handleEditOrder = async ({ takeProfit, stopLoss, openPrice, ...res }) => {
    const {
      id,
      notify,
      onCloseModal,
      editOrder,
      onSuccess,
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CHANGE_ORDER_TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CHANGE_ORDER_TEXT', { id }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      onSubmit: async () => {
        try {
          await editOrder({
            variables: {
              orderId: id,
              takeProfit: Number(takeProfit),
              stopLoss: Number(stopLoss),
              openPrice: Number(openPrice),
              ...res,
            },
          });

          notify({
            level: 'success',
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.SUCCESS'),
          });

          onSuccess();
          onCloseModal();
        } catch (_) {
          notify({
            level: 'error',
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.FAILED'),
          });
        }
      },
    });
  }

  handleCloseOrder = async ({ volumeLots, closePrice, status, symbol }) => {
    const {
      id,
      notify,
      onCloseModal,
      closeOrder,
      onSuccess,
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      modalTitle: I18n.t(`TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CLOSE_ORDER_TITLE_${status}`),
      actionText: I18n.t(`TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CLOSE_ORDER_TEXT_${status}`, {
        id,
        closePrice: closePrice || 0,
        symbol,
      }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      onSubmit: async () => {
        try {
          await closeOrder({
            variables: {
              orderId: id,
              volume: volumeLots,
              closePrice,
            },
          });

          notify({
            level: 'success',
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.CLOSE_SUCCESS'),
          });

          onSuccess();
          onCloseModal();
        } catch (_) {
          notify({
            level: 'error',
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.CLOSE_FAILED'),
          });
        }
      },
    });
  }

  handleDeleteOrder = async () => {
    const {
      id,
      notify,
      onCloseModal,
      deleteOrder,
      onSuccess,
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CANCEL_ORDER_TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CANCEL_ORDER_TEXT', { id }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      onSubmit: async () => {
        try {
          await deleteOrder({
            variables: { orderId: id },
          });

          notify({
            level: 'success',
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.CANCEL_SUCCESS'),
          });

          onSuccess();
          onCloseModal();
        } catch (_) {
          notify({
            level: 'error',
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.CANCEL_FAILED'),
          });
        }
      },
    });
  }

  render() {
    const {
      isOpen,
      onCloseModal,
      order: { data },
      match: {
        params: {
          id: accountUuid,
        },
      },
    } = this.props;

    const {
      id,
      time,
      type,
      symbol,
      status,
      commission,
      swaps,
      digits,
      stopLoss,
      pnl,
      takeProfit,
      volumeLots,
      openPrice,
      comment,
      accountLogin,
      direction,
    } = data?.tradingEngineOrder || {};

    const decimalsSettings = {
      decimalsLimit: digits,
      decimalsWarningMessage: I18n.t('TRADING_ENGINE.DECIMALS_WARNING_MESSAGE', {
        symbol,
        digits,
      }),
      decimalsLengthDefault: digits,
    };

    return (
      <Modal className="EditOrderModal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
            id,
            direction,
            volumeLots,
            symbol,
          })}
        </ModalHeader>
        <div className="EditOrderModal__inner-wrapper">
          <SymbolChart symbol={symbol} accountUuid={accountUuid} />
          <Formik
            initialValues={{
              type,
              symbol,
              openPrice,
              openTime: moment.utc(time?.creation).local().format('DD.MM.YYYY HH:mm:ss'),
              commission,
              expiry: moment.utc(time?.expiration).local().format('DD.MM.YYYY HH:mm:ss'),
              roSwaps: swaps,
              stopLoss,
              pnl: pnl?.net,
              takeProfit,
              profit: pnl?.net,
              volumeLots,
              comment,
            }}
            validate={createValidator({
              amount: ['required', 'numeric', 'greater:0', 'max:999999'],
            })}
            onSubmit={this.handleSubmit}
            enableReinitialize
          >
            {({ values, isSubmitting, dirty }) => (
              <Form>
                <ModalBody>
                  <fieldset className="EditOrderModal__fieldset">
                    <legend className="EditOrderModal__fieldset-title">
                      {accountLogin}
                    </legend>
                    <div className="EditOrderModal__field-container">
                      <Field
                        disabled
                        name="order"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.ORDER')}
                        className="EditOrderModal__field"
                        value={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
                          id,
                          direction,
                          volumeLots,
                          symbol,
                        })}
                        component={FormikInputField}
                      />
                      <Button
                        className="EditOrderModal__button EditOrderModal__button--small"
                        danger
                        onClick={() => this.handleDeleteOrder()}
                        disabled={isSubmitting}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CANCEL')}
                      </Button>
                    </div>
                    <div className="EditOrderModal__field-container">
                      <Field
                        disabled
                        name="openTime"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_TIME')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                      <Field
                        disabled
                        name="commission"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.COMMISSION')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                    </div>
                    <If condition={time?.expiratio}>
                      <div className="EditOrderModal__field-container">
                        <Field
                          disabled
                          name="expiry"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.EXPIRY')}
                          className="EditOrderModal__field"
                          component={FormikInputField}
                        />
                      </div>
                    </If>
                    <div className="EditOrderModal__field-container">
                      <Field
                        name="openPrice"
                        type="number"
                        step="0.00001"
                        placeholder={`0.${'0'.repeat(digits || 4)}`}
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_PRICE')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                        {...decimalsSettings}
                      />
                      <Field
                        disabled
                        name="roSwaps"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.RO_SWAPS')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                    </div>
                    <div className="EditOrderModal__field-container">
                      <Field
                        name="stopLoss"
                        type="number"
                        step="0.00001"
                        placeholder={`0.${'0'.repeat(digits || 4)}`}
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.STOP_LOSS')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                        {...decimalsSettings}
                      />
                      <Field
                        disabled
                        name="pnl"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.FLOATING_PL')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                    </div>
                    <div className="EditOrderModal__field-container">
                      <Field
                        name="takeProfit"
                        type="number"
                        step="0.00001"
                        placeholder={`0.${'0'.repeat(digits || 4)}`}
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TAKE_PROFIT')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                        {...decimalsSettings}
                      />
                      <Field
                        disabled
                        name="profit"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NET_FLOATING')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                    </div>
                    <div className="EditOrderModal__field-container">
                      <Field
                        name="comment"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.COMMENT')}
                        className="EditOrderModal__field"
                        component={FormikTextAreaField}
                      />
                      <Button
                        primary
                        onClick={() => this.handleEditOrder(values)}
                        className="EditOrderModal__button EditOrderModal__button--small"
                        disabled={!dirty || isSubmitting}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CHANGE')}
                      </Button>
                    </div>
                  </fieldset>

                  <Formik
                    initialValues={{}}
                    enableReinitialize
                  >
                    {({ values: _values }) => (
                      <Form>
                        <If condition={status !== 'CLOSED'}>
                          <fieldset className="EditOrderModal__fieldset">
                            <legend className="EditOrderModal__fieldset-title">
                              {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.PROCESS')}
                            </legend>

                            <div className="EditOrderModal__field-container">
                              <Field
                                name="volumeLots"
                                type="number"
                                label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.VOLUME')}
                                className="EditOrderModal__field"
                                placeholder="0"
                                component={FormikInputField}
                              />
                              <Field
                                name="closePrice"
                                type="number"
                                className="EditOrderModal__field"
                                placeholder="0.00000"
                                step="0.00001"
                                min={0}
                                max={999999}
                                component={FormikInputField}
                              />
                              <Button
                                className="EditOrderModal__button"
                                danger
                                onClick={() => this.handleCloseOrder({ ..._values, status, symbol })}
                                disabled={isSubmitting}
                              >
                                {I18n.t(`TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.BUTTON_FOR_${status}`, {
                                  volumeLots: Number(values.volumeLots).toFixed(2),
                                  closePrice: Number(_values.closePrice || 0.00000).toFixed(2),
                                })}
                              </Button>
                            </div>
                          </fieldset>
                        </If>
                      </Form>
                    )}
                  </Formik>
                </ModalBody>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  withRequests({
    editOrder: editOrderMutation,
    closeOrder: closeOrderMutation,
    deleteOrder: deleteOrderMutation,
    order: orderQuery,
  }),
)(EditOrderModal);
