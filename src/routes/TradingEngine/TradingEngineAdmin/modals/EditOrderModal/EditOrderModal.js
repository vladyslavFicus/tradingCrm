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
} from 'components/Formik';
import { createValidator } from 'utils/validator';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import FormikInputDecimalsField from 'components/Formik/FormikInputField/components/FormikInputDecimalsField';
import { reasons } from './constants';
import EditOrderMutation from './graphql/EditOrderMutation';
import ReopenOrderMutation from './graphql/ReopenOrderMutation';
import OrderQuery from './graphql/OrderQuery';
import SymbolsQuery from './graphql/SymbolsQuery';
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

  handleEditOrder = async (
    {
      takeProfit,
      stopLoss,
      openPrice,
      volumeLots,
      closePrice,
      profit,
      openRate,
      closeRate,
      margin,
      ...res
    },
    status,
  ) => {
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
                takeProfit: Number(takeProfit),
                stopLoss: Number(stopLoss),
                openPrice: Number(openPrice),
                closePrice: status === 'OPEN' ? null : closePrice,
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
      direction,
      closePrice,
      closeRate,
      commission,
      accountUuid,
      accountLogin,
    } = data?.tradingEngineOrder || {};

    const decimalsSettings = {
      decimalsLimit: digits,
      decimalsWarningMessage: I18n.t('TRADING_ENGINE.DECIMALS_WARNING_MESSAGE', {
        symbol,
        digits,
      }),
      decimalsLengthDefault: digits,
    };

    const symbols = symbolsQuery.data?.tradingEngineSymbols || [];
    const currentSymbol = symbols.find(({ name }) => name === symbol);

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
          <SymbolChart accountUuid={accountUuid} symbol={symbol} />
          <Formik
            initialValues={{
              type,
              symbol,
              margin,
              swaps,
              reason,
              comment,
              closePrice: closePrice || currentSymbol?.bid,
              openPrice,
              commission,
              takeProfit,
              volumeLots,
              stopLoss,
              openRate,
              closeRate,
              profit: pnl?.gross,
              openTime: time?.creation,
              closeTime: time?.closing,
            }}
            validate={createValidator({
              amount: ['required', 'numeric', 'greater:0', 'max:999999'],
              volumeLots: ['required', 'numeric', 'max:100000', 'min:0.01'],
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
                      <Field
                        disabled
                        name="type"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TYPE')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                    </div>
                    <div className="EditOrderModal__field-container">
                      <Field
                        name="volumeLots"
                        type="number"
                        step="0.00001"
                        placeholder="0.00"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.VOLUME')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
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
                      />
                      <Field
                        name="openPrice"
                        type="number"
                        step="0.00001"
                        placeholder={`0.${'0'.repeat(digits || 4)}`}
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_PRICE')}
                        className="EditOrderModal__field"
                        component={FormikInputDecimalsField}
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
                        {...decimalsSettings}
                      />
                    </div>
                    <div className="EditOrderModal__field-container">
                      <If condition={status === 'CLOSED'}>
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
                        disabled={status === 'OPEN'}
                        name="closePrice"
                        type="number"
                        step="0.00001"
                        placeholder="0.00"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CLOSE_PRICE')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                    </div>
                    <div className="EditOrderModal__field-container">
                      <Field
                        disabled
                        name="openRate"
                        placeholder="0.00"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_RATE')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                      <Field
                        disabled
                        name="closeRate"
                        placeholder="0.00"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CLOSE_RATE')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
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
                      />
                      <Field
                        name="swaps"
                        type="number"
                        step="0.00001"
                        placeholder="0.00"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.SWAPS')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                    </div>
                    <div className="EditOrderModal__field-container">
                      <Field
                        disabled
                        name="profit"
                        placeholder="0.00"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.PROFIT')}
                        className="EditOrderModal__field"
                        component={FormikInputField}
                      />
                      <Field
                        disabled
                        name="margin"
                        placeholder="0.00"
                        label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.MARGIN')}
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
                    </div>
                    <div className="EditOrderModal__field-container EditOrderModal__field-container-button">
                      <Button
                        primary
                        onClick={() => this.handleEditOrder(values, status)}
                        className="EditOrderModal__button Button--danger"
                        disabled={!dirty || isSubmitting}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.UPDATE')}
                      </Button>
                      <If condition={status === 'CLOSED'}>
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
                        primary
                        onClick={onCloseModal}
                        className="EditOrderModal__button"
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CANCEL')}
                      </Button>
                    </div>
                  </fieldset>
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
  }),
)(EditOrderModal);
