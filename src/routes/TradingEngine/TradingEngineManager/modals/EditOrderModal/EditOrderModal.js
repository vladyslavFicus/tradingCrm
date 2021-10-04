import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withModals, withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikTextAreaField, FormikInputDecimalsField } from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import ShortLoader from 'components/ShortLoader';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { createValidator } from 'utils/validator';
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
      pnl,
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

    const closePrice = type === 'SELL'
      ? (initialSymbolPrice?.ask || 0) + (groupSpread?.askAdjustment || 0)
      : (initialSymbolPrice?.bid || 0) + (groupSpread?.bidAdjustment || 0);

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
                      type,
                      symbol,
                      openPrice,
                      openTime: moment.utc(time?.creation).local().format('DD.MM.YYYY HH:mm:ss'),
                      commission,
                      expiry: moment.utc(time?.expiration).local().format('DD.MM.YYYY HH:mm:ss'),
                      roSwaps: swaps,
                      stopLoss,
                      pnl: pnl.net.toFixed(2),
                      takeProfit,
                      profit: pnl.net.toFixed(2),
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
                              <If condition={status === 'OPEN'}>
                                <div className="EditOrderModal__field-hint">
                                  {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.ESTIMATED_PNL')}&nbsp;
                                  <PnL
                                    type={type}
                                    openPrice={values.openPrice || 0}
                                    currentPriceBid={this.state.currentSymbolPrice?.bid + groupSpread.bidAdjustment}
                                    currentPriceAsk={this.state.currentSymbolPrice?.ask + groupSpread.askAdjustment}
                                    volume={volumeLots}
                                    lotSize={symbolEntity.lotSize}
                                    exchangeRate={this.state.currentSymbolPrice?.pnlRates[account.currency]}
                                    loaderSize={16}
                                  />
                                </div>
                              </If>
                            </div>
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
                              component={FormikInputDecimalsField}
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
                              component={FormikInputDecimalsField}
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
                      </Form>
                    )}
                  </Formik>

                  <Formik
                    enableReinitialize
                    initialValues={{
                      volumeLots,
                      closePrice,
                    }}
                    onSubmit={() => {}}
                  >
                    {({ values: _values, setFieldValue }) => (
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
                                component={FormikInputField}
                              />
                              <div className="EditOrderModal__field">
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
                                    const _closePrice = type === 'SELL'
                                      ? currentSymbolPrice?.ask + groupSpread.askAdjustment
                                      : currentSymbolPrice?.bid + groupSpread.bidAdjustment;

                                    setFieldValue('closePrice', Number(_closePrice?.toFixed(digits)));
                                  }}
                                  component={FormikInputField}
                                />
                                <If condition={status === 'OPEN'}>
                                  <div className="EditOrderModal__field-hint">
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
                                </If>
                              </div>
                              <Button
                                disabled={!initialSymbolPrice}
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
