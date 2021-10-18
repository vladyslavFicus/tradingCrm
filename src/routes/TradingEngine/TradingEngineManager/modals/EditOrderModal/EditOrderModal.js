import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withModals, withNotifications } from 'hoc';
import { OrderType, OrderStatus } from 'types/trading-engine';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikTextAreaField, FormikInputDecimalsField } from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import ShortLoader from 'components/ShortLoader';
import Input from 'components/Input';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import { calculatePnL } from 'routes/TradingEngine/utils/formulas';
import PnL from 'routes/TradingEngine/components/PnL';
import SymbolsPricesStream from 'routes/TradingEngine/components/SymbolsPricesStream';
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

  handleCloseOrder = async ({ volumeLots, closePrice, status, symbol, type }) => {
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
        type,
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
      direction,
      account,
      symbolEntity,
      groupSpread,
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
                direction,
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
                      amount: ['required', 'numeric', 'greater:0', 'max:999999'],
                    })}
                    onSubmit={this.handleSubmit}
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
                                  direction,
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
                        </Form>
                      );
                    }}
                  </Formik>

                  <Formik
                    enableReinitialize
                    initialValues={{
                      volumeLots,
                      closePrice: type === OrderType.SELL ? initialPriceAsk : initialPriceBid,
                    }}
                    onSubmit={() => {}}
                  >
                    {({ values: _values, setFieldValue }) => (
                      <Form>
                        <If condition={status !== OrderStatus.CLOSED}>
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
                                component={FormikInputField}
                              />
                              <Field
                                name="closePrice"
                                type="number"
                                disabled={!initialSymbolPrice}
                                className="EditOrderModal__field"
                                step="0.00001"
                                min={0}
                                max={999999}
                                addition="UPDATE"
                                additionPosition="right"
                                onAdditionClick={() => {
                                  const _closePrice = type === OrderType.SELL ? currentPriceAsk : currentPriceBid;

                                  setFieldValue('closePrice', Number(_closePrice?.toFixed(digits)));
                                }}
                                component={FormikInputDecimalsField}
                                {...decimalsSettings}
                              />
                              <Button
                                disabled={status === OrderStatus.PENDING || !initialSymbolPrice}
                                className="EditOrderModal__button"
                                danger
                                onClick={() => this.handleCloseOrder({ ..._values, status, symbol, type })}
                              >
                                {I18n.t(`TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.BUTTON_FOR_${status}`, {
                                  volumeLots: Number(_values.volumeLots).toFixed(2),
                                  closePrice: (_values.closePrice || 0).toFixed(digits),
                                })}
                              </Button>
                            </div>
                            <If condition={status === OrderStatus.OPEN}>
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
                            </If>
                          </fieldset>
                        </If>
                      </Form>
                    )}
                  </Formik>
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
    orderQuery,
  }),
)(EditOrderModal);
