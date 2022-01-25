import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withModals, withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import {
  FormikInputField,
  FormikTextAreaField,
  FormikSelectField,
  FormikDatePicker,
  FormikInputDecimalsField,
} from 'components/Formik';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import { OrderStatus, OrderType } from 'types/trading-engine';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Button } from 'components/UI';
import Input from 'components/Input';
import SymbolChart from 'components/SymbolChart';
import SymbolPricesStream from 'routes/TradingEngine/components/SymbolPricesStream';
import { calculatePnL } from 'routes/TradingEngine/utils/formulas';
import { reasons } from './constants';
import EditOrderMutation from './graphql/EditOrderMutation';
import ReopenOrderMutation from './graphql/ReopenOrderMutation';
import OrderQuery from './graphql/OrderQuery';
import SymbolsQuery from './graphql/SymbolsQuery';
import DeleteOrderMutation from './graphql/DeleteOrderMutation';
import './EditOrderModal.scss';

class EditOrderModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    editOrder: PropTypes.func.isRequired,
    reopenOrder: PropTypes.func.isRequired,
    orderQuery: PropTypes.object.isRequired,
    symbolsQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.symbolsTradingEngineType)).isRequired,
  };

  state = {
    currentSymbolPrice: null,
  };

  handleEditOrder = async ({ volumeLots, closePrice, ...res }, status) => {
    const {
      id,
      notify,
      editOrder,
      onSuccess,
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CHANGE_ORDER_TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CHANGE_ORDER_TEXT', { id }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'EditOrderModal__confirmation-modal',
      onSubmit: async () => {
        try {
          await editOrder({
            variables: {
              args: {
                orderId: id,
                volume: volumeLots,
                closePrice: status === OrderStatus.OPEN ? null : closePrice,
                ...res,
              },
            },
          });

          notify({
            level: 'success',
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.SUCCESS'),
          });

          onSuccess();
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

  handleReopenOrder = async () => {
    const {
      id,
      notify,
      onSuccess,
      reopenOrder,
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
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
            level: 'success',
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.REOPEN_SUCCESS'),
          });

          onSuccess();
        } catch (_) {
          notify({
            level: 'error',
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.REOPEN_FAILED'),
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
      orderQuery: {
        data,
      },
      modals: { confirmActionModal },
    } = this.props;

    const {
      type,
      symbol,
      volumeLots,
    } = data?.tradingEngineOrder || {};

    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CANCEL_DEAL_TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CANCEL_DEAL_TEXT', {
        id,
        type: I18n.t(`TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.${type}`),
        symbol,
        volumeLots,
      }),
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

  handleSymbolsPricesTick = (currentSymbolPrice) => {
    this.setState({ currentSymbolPrice });
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      orderQuery: { data },
      symbolsQuery,
    } = this.props;

    const {
      id,
      pnl,
      time,
      type,
      symbol,
      status,
      swaps,
      digits,
      margin,
      reason,
      comment,
      stopLoss,
      openRate,
      takeProfit,
      volumeLots,
      openPrice,
      closePrice,
      closeRate,
      commission,
      accountUuid,
      accountLogin,
      account,
      symbolConfig,
    } = data?.tradingEngineOrder || {};

    const { currentSymbolPrice } = this.state;

    // Get current BID and ASK prices with applied group spread
    const currentPriceBid = round((currentSymbolPrice?.bid || 0) - (symbolConfig?.bidAdjustment || 0), digits);
    const currentPriceAsk = round((currentSymbolPrice?.ask || 0) + (symbolConfig?.askAdjustment || 0), digits);

    const decimalsSettings = {
      decimalsLimit: digits,
      decimalsWarningMessage: I18n.t('TRADING_ENGINE.DECIMALS_WARNING_MESSAGE', {
        symbol,
        digits,
      }),
      decimalsLengthDefault: digits,
    };

    const symbols = symbolsQuery.data?.tradingEngineSymbols?.content || [];

    const isDisabled = status === OrderStatus.CANCELED;

    return (
      <Modal className="EditOrderModal" toggle={onCloseModal} isOpen={isOpen}>

        {/* Subscribe to symbol prices stream only for open orders */}
        <If condition={symbol && status === OrderStatus.OPEN}>
          <SymbolPricesStream
            symbol={symbol}
            onNotify={this.handleSymbolsPricesTick}
          />
        </If>

        <ModalHeader toggle={onCloseModal}>
          {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
            id,
            type: I18n.t(`TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.${type}`),
            volumeLots,
            symbol,
          })}
        </ModalHeader>
        <div className="EditOrderModal__inner-wrapper">
          <SymbolChart accountUuid={accountUuid} symbol={symbol} />
          <Formik
            initialValues={{
              symbol,
              swaps,
              reason,
              comment,
              openPrice,
              commission,
              takeProfit,
              volumeLots,
              stopLoss,
              openTime: time?.creation,
              closeTime: time?.closing,
            }}
            validate={createValidator({
              volumeLots: ['required', 'numeric', 'max:1000', 'min:0.01'],
            }, {
              volumeLots: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME'),
            })}
            onSubmit={values => this.handleEditOrder(values, status)}
            enableReinitialize
          >
            {({ values, isSubmitting, dirty }) => {
              const currentClosePrice = type === OrderType.SELL ? currentPriceAsk : currentPriceBid;

              // Close price is custom typed in priority or value returned from BE or calculated manually on FE side
              const _closePrice = values.closePrice ?? closePrice ?? currentClosePrice;

              const floatingPnL = calculatePnL({
                type,
                currentPriceBid,
                currentPriceAsk,
                openPrice: values.openPrice,
                volume: values.volumeLots,
                lotSize: symbolConfig?.lotSize,
                exchangeRate: currentSymbolPrice?.pnlRates[account.currency],
              });

              return (
                <Form>
                  <ModalBody>
                    <fieldset className="EditOrderModal__fieldset">
                      <legend className="EditOrderModal__fieldset-title">
                        {accountLogin}
                      </legend>
                      <div className="EditOrderModal__field-container">
                        <Field
                          name="reason"
                          component={FormikSelectField}
                          className="EditOrderModal__field"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.REASON')}
                          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                        >
                          {reasons.map(({ value, label }) => (
                            <option key={value} value={value}>{I18n.t(label)}</option>
                          ))}
                        </Field>
                        <Input
                          disabled
                          name="type"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TYPE')}
                          className="EditOrderModal__field"
                          value={I18n.t(`TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.${type}`)}
                        />
                      </div>
                      <div className="EditOrderModal__field-container">
                        <Field
                          name="volumeLots"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          min={0.01}
                          max={1000}
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.VOLUME')}
                          className="EditOrderModal__field"
                          component={FormikInputField}
                          disabled={isDisabled}
                        />
                        <Field
                          disabled
                          name="symbol"
                          component={FormikSelectField}
                          className="EditOrderModal__field"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.SYMBOL')}
                          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                        >
                          {symbols.map(({ name }) => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </Field>
                      </div>
                      <div className="EditOrderModal__field-container">
                        <Field
                          name="openTime"
                          className="EditOrderModal__field"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_TIME')}
                          component={FormikDatePicker}
                          withTime
                          withUtc
                          disabled={isDisabled}
                        />
                        <Field
                          name="openPrice"
                          type="number"
                          step="0.00001"
                          placeholder={`0.${'0'.repeat(digits || 4)}`}
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_PRICE')}
                          className="EditOrderModal__field"
                          component={FormikInputDecimalsField}
                          disabled={isDisabled}
                          {...decimalsSettings}
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
                          component={FormikInputDecimalsField}
                          disabled={isDisabled}
                          {...decimalsSettings}
                        />
                        <Field
                          name="takeProfit"
                          type="number"
                          step="0.00001"
                          placeholder={`0.${'0'.repeat(digits || 4)}`}
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TAKE_PROFIT')}
                          className="EditOrderModal__field"
                          component={FormikInputDecimalsField}
                          disabled={isDisabled}
                          {...decimalsSettings}
                        />
                      </div>
                      <div className="EditOrderModal__field-container">
                        <If condition={status === OrderStatus.CLOSED}>
                          <Field
                            name="closeTime"
                            className="EditOrderModal__field"
                            label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CLOSE_TIME')}
                            component={FormikDatePicker}
                            withTime
                            withUtc
                          />
                        </If>
                        <Field
                          disabled={status === OrderStatus.OPEN || isDisabled}
                          name="closePrice"
                          type="number"
                          step="0.00001"
                          placeholder="0.00"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CLOSE_PRICE')}
                          className="EditOrderModal__field"
                          value={_closePrice}
                          component={FormikInputField}
                        />
                      </div>
                      <div className="EditOrderModal__field-container">
                        <Input
                          disabled
                          name="openRate"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_RATE')}
                          className="EditOrderModal__field"
                          value={openRate}
                        />
                        <Input
                          disabled
                          name="closeRate"
                          placeholder="0.00"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CLOSE_RATE')}
                          className="EditOrderModal__field"
                          value={closeRate || 0}
                        />
                      </div>
                      <div className="EditOrderModal__field-container">
                        <Field
                          name="commission"
                          type="number"
                          step="0.00001"
                          placeholder="0.00"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.COMMISSION')}
                          className="EditOrderModal__field"
                          component={FormikInputField}
                          disabled={isDisabled}
                        />
                        <Field
                          name="swaps"
                          type="number"
                          step="0.00001"
                          placeholder="0.00"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.SWAPS')}
                          className="EditOrderModal__field"
                          component={FormikInputField}
                          disabled={isDisabled}
                        />
                      </div>
                      <div className="EditOrderModal__field-container">
                        <Input
                          disabled
                          name="profit"
                          placeholder="0.00"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.PROFIT')}
                          className="EditOrderModal__field"
                          value={status === OrderStatus.OPEN ? floatingPnL : pnl?.gross?.toFixed(2)}
                        />
                        <Input
                          disabled
                          name="margin"
                          label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.MARGIN')}
                          className="EditOrderModal__field"
                          value={margin}
                        />
                      </div>
                      <div className="EditOrderModal__field-container">
                        <Field
                          name="comment"
                          label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.COMMENT')}
                          className="EditOrderModal__field"
                          maxLength={1000}
                          component={FormikTextAreaField}
                          disabled={isDisabled}
                        />
                      </div>
                      <div className="EditOrderModal__field-container EditOrderModal__field-container-button">
                        <Button
                          type="submit"
                          className="EditOrderModal__button"
                          danger
                          disabled={!dirty || isSubmitting || isDisabled}
                        >
                          {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.UPDATE')}
                        </Button>
                        <If condition={status === OrderStatus.CLOSED}>
                          <Button
                            primary
                            onClick={this.handleReopenOrder}
                            className="EditOrderModal__button"
                            disabled={isSubmitting}
                          >
                            {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.REOPEN')}
                          </Button>
                        </If>
                        <Button
                          className="EditOrderModal__button"
                          dangerOutline
                          onClick={this.handleDeleteOrder}
                          disabled={isDisabled || isSubmitting}
                        >
                          {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CANCEL_ORDER')}
                        </Button>
                      </div>
                    </fieldset>
                  </ModalBody>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Modal>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
  withNotifications,
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  withRequests({
    editOrder: EditOrderMutation,
    reopenOrder: ReopenOrderMutation,
    orderQuery: OrderQuery,
    symbolsQuery: SymbolsQuery,
    deleteOrder: DeleteOrderMutation,
  }),
)(EditOrderModal);
