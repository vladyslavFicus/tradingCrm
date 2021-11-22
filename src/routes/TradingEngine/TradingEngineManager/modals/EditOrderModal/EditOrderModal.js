import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withModals, withNotifications } from 'hoc';
import { OrderDirection, OrderType, OrderStatus } from 'types/trading-engine';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikTextAreaField, FormikInputDecimalsField } from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import ShortLoader from 'components/ShortLoader';
import Input from 'components/Input';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import { step, placeholder } from 'routes/TradingEngine/utils/inputHelper';
import { calculatePnL } from 'routes/TradingEngine/utils/formulas';
import PnL from 'routes/TradingEngine/components/PnL';
import SymbolsPricesStream from 'routes/TradingEngine/components/SymbolsPricesStream';
import editOrderMutation from './graphql/EditOrderMutation';
import closeOrderMutation from './graphql/CloseOrderMutation';
import deleteOrderMutation from './graphql/DeleteOrderMutation';
import activatePendingOrderMutation from './graphql/ActivatePendingOrderMutation';
import orderQuery from './graphql/OrderQuery';
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
    closeOrder: PropTypes.func.isRequired,
    orderQuery: PropTypes.object.isRequired,
  };

  state = {
    currentSymbolPrice: null,
    initialSymbolPrice: null,
  };

  handleEditOrder = async ({ takeProfit, stopLoss, openPrice, ...res }) => {
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

  handleCloseOrder = async ({ volumeLots, closePrice }) => {
    const {
      id,
      notify,
      onCloseModal,
      closeOrder,
      onSuccess,
      modals: { confirmActionModal },
      orderQuery: { data },
    } = this.props;
    const {
      status,
      symbol,
      type,
    } = data?.tradingEngineOrder || {};

    confirmActionModal.show({
      modalTitle: I18n.t(`TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CLOSE_ORDER_TITLE_${status}`),
      actionText: I18n.t(`TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CLOSE_ORDER_TEXT_${status}`, {
        id,
        closePrice: closePrice || 0,
        symbol,
        type: I18n.t(`TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.${type}`),
      }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'EditOrderModal__confirmation-modal',
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
      className: 'EditOrderModal__confirmation-modal',
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

  handleActivatePendingOrder = async ({ activationPrice }) => {
    const {
      id,
      notify,
      onCloseModal,
      activatePendingOrder,
      onSuccess,
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.PENDING_ORDER_TITLE'),
      actionText: I18n.t(
        'TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.PENDING_ORDER_TEXT',
        { id, activationPrice },
      ),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'EditOrderModal__confirmation-modal',
      onSubmit: async () => {
        try {
          await activatePendingOrder({
            variables: {
              orderId: id,
              activationPrice,
            },
          });

          notify({
            level: 'success',
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.PENDING_SUCCESS'),
          });

          onSuccess();
          onCloseModal();
        } catch (_) {
          notify({
            level: 'error',
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.PENDING_FAILED'),
          });
        }
      },
    });
  }

  handleSymbolsPricesTick = (symbolsPrices) => {
    const { symbol } = this.props.orderQuery.data.tradingEngineOrder;

    const currentSymbolPrice = symbolsPrices[symbol];

    this.setState({ currentSymbolPrice });

    // Save initial symbol price to render it inside close price field
    if (!this.state.initialSymbolPrice) {
      this.setState({ initialSymbolPrice: currentSymbolPrice });
    }
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      orderQuery: { data, loading },
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
      takeProfit,
      volumeLots,
      openPrice,
      comment,
      accountLogin,
      accountUuid,
      account,
      symbolEntity,
      groupSpread,
      direction,
    } = data?.tradingEngineOrder || {};

    const { currentSymbolPrice, initialSymbolPrice } = this.state;

    // Get current BID and ASK prices with applied group spread
    const currentPriceBid = round((currentSymbolPrice?.bid || 0) - (groupSpread?.bidAdjustment || 0), digits);
    const currentPriceAsk = round((currentSymbolPrice?.ask || 0) + (groupSpread?.askAdjustment || 0), digits);

    // Get initial BID and ASK prices with applied group spread
    const initialPriceBid = round((initialSymbolPrice?.bid || 0) - (groupSpread?.bidAdjustment || 0), digits);
    const initialPriceAsk = round((initialSymbolPrice?.ask || 0) + (groupSpread?.askAdjustment || 0), digits);

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

        <If condition={symbol}>
          {/* Subscribe to symbol prices stream */}
          <SymbolsPricesStream
            symbols={[symbol]}
            onNotify={this.handleSymbolsPricesTick}
          />
        </If>

        <ModalHeader toggle={onCloseModal}>
          <Choose>
            <When condition={loading}>
              {I18n.t('COMMON.LOADING')}
            </When>
            <Otherwise>
              {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
                id,
                type: I18n.t(`TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.${type}`),
                volumeLots,
                symbol,
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
              <div className="EditOrderModal__inner-wrapper">
                <SymbolChart accountUuid={accountUuid} symbol={symbol} />

                <div>
                  <Formik
                    initialValues={{
                      openPrice,
                      stopLoss,
                      takeProfit,
                      comment,
                    }}
                    validate={createValidator({
                      openPrice: ['required'],
                    }, {
                      openPrice: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE'),
                    })}
                    onSubmit={this.handleEditOrder}
                    validateOnChange={false}
                    validateOnBlur={false}
                    enableReinitialize
                  >
                    {({ values, isSubmitting, dirty }) => {
                      const floatingPnL = calculatePnL({
                        type,
                        currentPriceBid,
                        currentPriceAsk,
                        openPrice: values.openPrice,
                        volume: volumeLots,
                        lotSize: symbolEntity.lotSize,
                        exchangeRate: currentSymbolPrice?.pnlRates[account.currency],
                      });

                      return (
                        <Form>
                          <fieldset className="EditOrderModal__fieldset">
                            <legend className="EditOrderModal__fieldset-title">
                              {accountLogin}
                            </legend>
                            <div className="EditOrderModal__field-container">
                              <Input
                                disabled
                                name="order"
                                value={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
                                  id,
                                  type: I18n.t(`TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.${type}`),
                                  volumeLots,
                                  symbol,
                                })}
                                label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.ORDER')}
                                className="EditOrderModal__field"
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
                              <Input
                                disabled
                                name="openTime"
                                value={moment.utc(time?.creation).local().format('DD.MM.YYYY HH:mm:ss')}
                                label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_TIME')}
                                className="EditOrderModal__field"
                              />
                              <Input
                                disabled
                                name="commission"
                                value={commission}
                                label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.COMMISSION')}
                                className="EditOrderModal__field"
                              />
                            </div>
                            <If condition={time?.expiration}>
                              <div className="EditOrderModal__field-container">
                                <Input
                                  disabled
                                  name="expiry"
                                  value={moment.utc(time?.expiration).local().format('DD.MM.YYYY HH:mm:ss')}
                                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.EXPIRY')}
                                  className="EditOrderModal__field"
                                />
                              </div>
                            </If>
                            <div className="EditOrderModal__field-container">
                              <div className="EditOrderModal__field">
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
                              <Input
                                disabled
                                name="swaps"
                                value={swaps}
                                label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.RO_SWAPS')}
                                className="EditOrderModal__field"
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
                              <Input
                                disabled
                                name="pnl"
                                value={status === OrderStatus.OPEN ? floatingPnL.toFixed(2) : '-'}
                                label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.FLOATING_PL')}
                                className="EditOrderModal__field"
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
                                component={FormikInputDecimalsField}
                                {...decimalsSettings}
                              />
                              <Input
                                disabled
                                name="netPnL"
                                value={
                                  status === OrderStatus.OPEN
                                    ? (floatingPnL - commission - swaps).toFixed(2)
                                    : '-'
                                }
                                label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NET_FLOATING')}
                                className="EditOrderModal__field"
                              />
                            </div>
                            <div className="EditOrderModal__field-container">
                              <Field
                                name="comment"
                                label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.COMMENT')}
                                className="EditOrderModal__field"
                                component={FormikTextAreaField}
                                maxLength={1000}
                              />
                              <Button
                                type="submit"
                                primary
                                className="EditOrderModal__button EditOrderModal__button--small"
                                disabled={!dirty || isSubmitting}
                              >
                                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CHANGE')}
                              </Button>
                            </div>
                          </fieldset>
                        </Form>
                      );
                    }}
                  </Formik>

                  <Choose>
                    <When condition={status === OrderStatus.PENDING}>
                      <Formik
                        enableReinitialize
                        initialValues={{
                          volumeLots,
                          activationPrice: openPrice,
                        }}
                        validate={createValidator({
                          volumeLots: ['required', 'numeric', 'max:1000', 'min:0.01'],
                        }, {
                          volumeLots: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME'),
                        })}
                        onSubmit={this.handleActivatePendingOrder}
                      >
                        {({ values: _values, setFieldValue }) => (
                          <Form>
                            <fieldset className="EditOrderModal__fieldset">
                              <legend className="EditOrderModal__fieldset-title">
                                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.PENDING_ORDER')}
                              </legend>

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
                                  classNameError="EditOrderModal__field--customError"
                                  component={FormikInputField}
                                  disabled
                                />
                                <Field
                                  name="activationPrice"
                                  type="number"
                                  disabled={!initialSymbolPrice}
                                  className="EditOrderModal__field"
                                  placeholder={placeholder(currentSymbolPrice?.digits)}
                                  step={step(digits)}
                                  min={0}
                                  max={999999}
                                  additionClassName="EditOrderModal__additionUpdate"
                                  additionPosition="right"
                                  addition={
                                    (
                                      <Button
                                        className="EditOrderModal__additionUpdate-button"
                                        onClick={() => {
                                          const _activationPrice = direction === OrderDirection.SELL
                                            ? currentPriceBid
                                            : currentPriceAsk;

                                          setFieldValue('activationPrice', Number(_activationPrice?.toFixed(digits)));
                                        }}
                                        disabled={!initialSymbolPrice}
                                      >
                                        {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.UPDATE')}
                                      </Button>
                                    )
                                  }
                                  component={FormikInputDecimalsField}
                                  {...decimalsSettings}
                                />
                                <Button
                                  type="submit"
                                  className="EditOrderModal__button"
                                  danger
                                >
                                  {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.BUTTON_ACTIVATE_PENDING_ORDER', {
                                    volumeLots: Number(_values.volumeLots).toFixed(2),
                                    activationPrice: (_values.activationPrice || 0).toFixed(digits),
                                  })}
                                </Button>
                              </div>
                            </fieldset>
                          </Form>
                        )}
                      </Formik>
                    </When>
                    <When condition={status === OrderStatus.OPEN}>
                      <Formik
                        enableReinitialize
                        initialValues={{
                          volumeLots,
                          closePrice: type === OrderType.SELL ? initialPriceAsk : initialPriceBid,
                        }}
                        validate={createValidator({
                          volumeLots: ['required', 'numeric', 'max:1000', 'min:0.01'],
                        }, {
                          volumeLots: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME'),
                        })}
                        onSubmit={this.handleCloseOrder}
                      >
                        {({ values: _values, setFieldValue }) => (
                          <Form>
                            <fieldset className="EditOrderModal__fieldset">
                              <legend className="EditOrderModal__fieldset-title">
                                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.PROCESS')}
                              </legend>

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
                                  classNameError="EditOrderModal__field--customError"
                                  component={FormikInputField}
                                  disabled
                                />
                                <Field
                                  name="closePrice"
                                  type="number"
                                  disabled={!initialSymbolPrice}
                                  className="EditOrderModal__field"
                                  placeholder={placeholder(currentSymbolPrice?.digits)}
                                  step={step(digits)}
                                  min={0}
                                  max={999999}
                                  additionClassName="EditOrderModal__additionUpdate"
                                  additionPosition="right"
                                  addition={
                                    (
                                      <Button
                                        className="EditOrderModal__additionUpdate-button"
                                        onClick={() => {
                                          const _closePrice = type === OrderType.SELL
                                            ? currentPriceAsk
                                            : currentPriceBid;
                                          setFieldValue('closePrice', Number(_closePrice?.toFixed(digits)));
                                        }}
                                        disabled={!initialSymbolPrice}
                                      >
                                        {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.UPDATE')}
                                      </Button>
                                    )
                                  }
                                  component={FormikInputDecimalsField}
                                  {...decimalsSettings}
                                />
                                <Button
                                  type="submit"
                                  disabled={!initialSymbolPrice}
                                  className="EditOrderModal__button"
                                  danger
                                >
                                  {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.BUTTON_CLOSE_ORDER', {
                                    volumeLots: Number(_values.volumeLots).toFixed(2),
                                    closePrice: (_values.closePrice || 0).toFixed(digits),
                                  })}
                                </Button>
                              </div>
                              <div className="EditOrderModal__field-container">
                                <div className="EditOrderModal__close-pnl">
                                  {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.WITH_PNL')}&nbsp;
                                  <PnL
                                    type={type}
                                    openPrice={openPrice}
                                    currentPriceBid={_values.closePrice || 0}
                                    currentPriceAsk={_values.closePrice || 0}
                                    volume={volumeLots}
                                    lotSize={symbolEntity.lotSize}
                                    exchangeRate={this.state.currentSymbolPrice?.pnlRates[account.currency]}
                                    loaderSize={16}
                                  />
                                </div>
                              </div>
                            </fieldset>
                          </Form>
                        )}
                      </Formik>
                    </When>
                  </Choose>
                </div>
              </div>
            </ModalBody>
          </Otherwise>
        </Choose>
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
    editOrder: editOrderMutation,
    closeOrder: closeOrderMutation,
    deleteOrder: deleteOrderMutation,
    activatePendingOrder: activatePendingOrderMutation,
    orderQuery,
  }),
)(EditOrderModal);
