import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withApollo } from 'react-apollo';
import { parseErrors, withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import Hotkeys from 'react-hot-keys';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import { OrderType } from 'types/trading-engine';
import PropTypes from 'constants/propTypes';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import {
  FormikCheckbox,
  FormikInputField,
  FormikTextAreaField,
  FormikSelectField,
  FormikInputDecimalsField,
} from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import Input from 'components/Input';
import SymbolPricesStream from 'routes/TradingEngine/components/SymbolPricesStream';
import { calculatePnL } from 'routes/TradingEngine/utils/formulas';
import TradingEngineAccountQuery from './graphql/TradingEngineAccountQuery';
import createOrderMutation from './graphql/CreateOrderMutation';
import './NewOrderModal.scss';

class NewOrderModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    ...withStorage.propTypes,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    createOrder: PropTypes.func.isRequired,
    tradingEngineAccountQuery: PropTypes.query(PropTypes.tradingEngineAccount).isRequired,
  };

  state = {
    currentSymbolPrice: null,
  };

  getCurrentSymbol = (symbol) => {
    const account = this.props.tradingEngineAccountQuery?.data?.tradingEngineAccount;

    return account?.allowedSymbols?.find(({ name }) => name === symbol);
  }

  onChangeSymbol = (value, values, setValues) => {
    setValues({
      ...values,
      symbol: value,
      takeProfit: null,
      stopLoss: null,
      openPrice: null,
      autoOpenPrice: true,
    });
  };

  handleSubmit = async ({ takeProfit, stopLoss, openPrice, direction, ...res }) => {
    const {
      notify,
      onCloseModal,
      createOrder,
      onSuccess,
      storage,
      match: {
        params: {
          id,
        },
      },
    } = this.props;


    try {
      const {
        data: {
          tradingEngine: {
            createOrder: { id: orderId },
          },
        },
      } = await createOrder({
        variables: {
          type: 'MARKET',
          accountUuid: id,
          pendingOrder: true,
          takeProfit,
          stopLoss,
          openPrice,
          direction,
          ...res,
        },
      });

      // Save last created order to storage to open it later by request
      storage.set('TE.lastCreatedOrderId', orderId);

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('COMMON.ERROR'),
        message: error === 'error.order.creation.not-enough-free-margin'
          ? I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.NOTIFICATION.NOT_ENOUGH_FREE_MARGIN')
          : I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.NOTIFICATION.FAILED'),
      });
    }
  }

  handleAutoOpenPrice = (value, symbol, setFieldValue) => () => {
    const { currentSymbolPrice } = this.state;

    const currentSymbol = this.getCurrentSymbol(symbol);

    const autoOpenPrice = !value;

    // Get current BID price with applied group spread
    const currentPriceBid = round(
      currentSymbolPrice?.bid - currentSymbol?.groupSpread?.bidAdjustment,
      currentSymbol?.digits,
    );

    const openPrice = !autoOpenPrice ? currentPriceBid : undefined;

    setFieldValue('autoOpenPrice', autoOpenPrice);

    setFieldValue('openPrice', openPrice);
  };

  handleSymbolsPricesTick = (currentSymbolPrice) => {
    this.setState({ currentSymbolPrice });
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      tradingEngineAccountQuery,
    } = this.props;

    const { currentSymbolPrice } = this.state;

    const account = tradingEngineAccountQuery.data?.tradingEngineAccount;

    return (
      <Modal className="NewOrderModal" toggle={onCloseModal} isOpen={isOpen} keyboard={false}>
        {/*
           Disable keyboard controlling on modal to prevent close modal by ESC button because it's working with a bug
           and after close by ESC button hotkeys not working when not clicking ESC button second time.
           So we should implement close event by ESC button manually.
        */}
        <Hotkeys keyName="esc" filter={() => true} onKeyUp={onCloseModal} />
        <Formik
          initialValues={{
            login: account?.login,
            volumeLots: 1,
            symbol: account?.allowedSymbols[0]?.name,
            autoOpenPrice: true,
          }}
          validate={values => createValidator({
            volumeLots: ['required', 'numeric', 'max:1000', 'min:0.01'],
            symbol: ['required', 'string'],
            ...!values.autoOpenPrice && {
              openPrice: 'required',
            },
            stopLoss: [
              `max:${
              values.direction === 'BUY'
              && !values.autoOpenPrice
              && values.openPrice
                ? values.openPrice
                : 999999
            }`,
              `min:${
              values.direction === 'SELL'
              && !values.autoOpenPrice
              && values.openPrice
                ? values.openPrice : 0
            }`,
            ],
            takeProfit: [
              `max:${
              values.direction === 'SELL'
              && !values.autoOpenPrice
              && values.openPrice
                ? values.openPrice
                : 999999
            }`,
              `min:${
              values.direction === 'BUY'
              && !values.autoOpenPrice
              && values.openPrice
                ? values.openPrice
                : 0
            }`,
            ],
          }, {
            volumeLots: I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.VOLUME'),
            openPrice: I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.OPEN_PRICE'),
          }, false)(values)}
          validateOnChange={false}
          validateOnBlur={false}
          enableReinitialize
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, setValues, handleSubmit }) => {
            const {
              autoOpenPrice,
              openPrice,
              symbol,
              volumeLots,
            } = values;

            const currentSymbol = this.getCurrentSymbol(symbol);

            // Get current BID and ASK prices with applied group spread
            const currentPriceBid = round(
              (currentSymbolPrice?.bid || 0) - (currentSymbol?.groupSpread?.bidAdjustment || 0),
              currentSymbol?.digits,
            );

            const currentPriceAsk = round(
              (currentSymbolPrice?.ask || 0) + (currentSymbol?.groupSpread?.askAdjustment || 0),
              currentSymbol?.digits,
            );

            // Get SELL and BUY price depends on autoOpenPrice checkbox
            const sellPrice = autoOpenPrice ? currentPriceBid : openPrice;
            const buyPrice = autoOpenPrice ? currentPriceAsk : openPrice;

            const decimalsSettings = {
              decimalsLimit: currentSymbol?.digits,
              decimalsWarningMessage: I18n.t('TRADING_ENGINE.DECIMALS_WARNING_MESSAGE', {
                symbol,
                digits: currentSymbol?.digits,
              }),
              decimalsLengthDefault: currentSymbol?.digits,
            };

            return (
              <Form>
                <If condition={symbol}>
                  {/* Subscribe to symbol prices stream */}
                  <SymbolPricesStream
                    symbol={symbol}
                    onNotify={this.handleSymbolsPricesTick}
                  />
                </If>

                <ModalHeader toggle={onCloseModal}>
                  {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.TITLE')}
                </ModalHeader>
                <div className="NewOrderModal__inner-wrapper">
                  <SymbolChart symbol={symbol} accountUuid={account?.uuid} />
                  <ModalBody>
                    <div className="NewOrderModal__field-container NewOrderModal__field-container--half">
                      <Field
                        disabled
                        name="login"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.LOGIN')}
                        className="NewOrderModal__field"
                        component={FormikInputField}
                      />
                    </div>
                    <div className="NewOrderModal__field-container">
                      <Field
                        autoFocus
                        name="volumeLots"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.VOLUME')}
                        className="NewOrderModal__field"
                        placeholder="0.00"
                        step="0.01"
                        min={0.01}
                        max={1000}
                        component={FormikInputField}
                      />
                    </div>
                    <div className="NewOrderModal__field-container">
                      <Field
                        name="symbol"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.SYMBOL')}
                        className="NewOrderModal__field"
                        component={FormikSelectField}
                        customOnChange={value => this.onChangeSymbol(value, values, setValues)}
                        searchable
                      >
                        {(account?.allowedSymbols || []).map(({ name, description }) => (
                          <option key={name} value={name}>
                            {`${name}  ${description}`}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="NewOrderModal__field-container">
                      <Field
                        name="takeProfit"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.TAKE_PROFIT')}
                        className="NewOrderModal__field"
                        placeholder={`0.${'0'.repeat(currentSymbol?.digits || 4)}`}
                        step="0.00001"
                        min={0}
                        max={999999}
                        component={FormikInputDecimalsField}
                        {...decimalsSettings}
                      />
                      <Field
                        name="stopLoss"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.STOP_LOSS')}
                        className="NewOrderModal__field"
                        placeholder={`0.${'0'.repeat(currentSymbol?.digits || 4)}`}
                        step="0.00001"
                        min={0}
                        max={999999}
                        component={FormikInputDecimalsField}
                        {...decimalsSettings}
                      />
                    </div>
                    <div className="NewOrderModal__field-container">
                      <Field
                        name="openPrice"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.OPEN_PRICE')}
                        className="NewOrderModal__field"
                        placeholder={`0.${'0'.repeat(currentSymbol?.digits || 4)}`}
                        step="0.01"
                        min={0}
                        max={999999}
                        value={sellPrice}
                        disabled={autoOpenPrice}
                        component={FormikInputDecimalsField}
                        {...decimalsSettings}
                      />
                      <Button
                        className="NewOrderModal__button NewOrderModal__button--small"
                        type="button"
                        primaryOutline
                        disabled={autoOpenPrice}
                        onClick={() => setFieldValue('openPrice', currentPriceBid)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.UPDATE')}
                      </Button>
                      <Field
                        name="autoOpenPrice"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.AUTO')}
                        className="NewOrderModal__field NewOrderModal__field--center"
                        component={FormikCheckbox}
                        onChange={this.handleAutoOpenPrice(autoOpenPrice, symbol, setFieldValue)}
                      />
                    </div>
                    <div className="NewOrderModal__field-container">
                      <Input
                        disabled
                        name="sellPnl"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.SELL_PNL')}
                        value={
                          (account && currentSymbol && currentSymbolPrice)
                            ? calculatePnL({
                              type: OrderType.SELL,
                              currentPriceBid,
                              currentPriceAsk,
                              openPrice: sellPrice,
                              volume: volumeLots,
                              lotSize: currentSymbol?.lotSize,
                              exchangeRate: currentSymbolPrice?.pnlRates[account.currency],
                            })
                            : 0}
                        className="NewOrderModal__field"
                      />
                      <Input
                        disabled
                        name="buyPnl"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.BUY_PNL')}
                        value={
                          (account && currentSymbol && currentSymbolPrice)
                            ? calculatePnL({
                              type: OrderType.BUY,
                              currentPriceBid,
                              currentPriceAsk,
                              openPrice: buyPrice,
                              volume: volumeLots,
                              lotSize: currentSymbol?.lotSize,
                              exchangeRate: currentSymbolPrice?.pnlRates[account.currency],
                            })
                            : 0}
                        className="NewOrderModal__field"
                      />
                    </div>
                    <div className="NewOrderModal__field-container">
                      <Field
                        name="comment"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.COMMENT')}
                        className="NewOrderModal__field"
                        maxLength={1000}
                        component={FormikTextAreaField}
                      />
                    </div>
                    <div className="NewOrderModal__field-container">
                      {/* Sell order by CTRL+S pressing */}
                      <Hotkeys
                        keyName="ctrl+s"
                        filter={() => true}
                        onKeyUp={() => {
                          setFieldValue('direction', 'SELL');
                          handleSubmit();
                        }}
                      />

                      {/* Buy order by CTRL+D pressing */}
                      <Hotkeys
                        keyName="ctrl+d"
                        filter={() => true}
                        onKeyUp={() => {
                          setFieldValue('direction', 'BUY');
                          handleSubmit();
                        }}
                      />
                      <Button
                        className="NewOrderModal__button"
                        danger
                        disabled={isSubmitting || !sellPrice}
                        onClick={() => {
                          setFieldValue('direction', 'SELL');
                          handleSubmit();
                        }}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.SELL_AT', {
                          value: sellPrice && sellPrice.toFixed(currentSymbol?.digits),
                        })}
                      </Button>
                      <Button
                        className="NewOrderModal__button"
                        primary
                        disabled={isSubmitting || !buyPrice}
                        onClick={() => {
                          setFieldValue('direction', 'BUY');
                          handleSubmit();
                        }}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.BUY_AT', {
                          value: buyPrice && buyPrice.toFixed(currentSymbol?.digits),
                        })}
                      </Button>
                    </div>
                  </ModalBody>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withNotifications,
  withStorage,
  withRequests({
    createOrder: createOrderMutation,
    tradingEngineAccountQuery: TradingEngineAccountQuery,
  }),
)(NewOrderModal);
