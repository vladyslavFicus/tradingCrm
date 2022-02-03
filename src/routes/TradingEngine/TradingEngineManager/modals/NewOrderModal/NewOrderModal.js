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
import { OrderType, OrderDirection } from 'types/trading-engine';
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
import { step, placeholder } from 'routes/TradingEngine/utils/inputHelper';
import { calculatePnL, determineOrderType } from 'routes/TradingEngine/utils/formulas';
import TradingEngineAccountQuery from './graphql/TradingEngineAccountQuery';
import TradingEngineAccountSymbolsQuery from './graphql/TradingEngineAccountSymbolsQuery';
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
    tradingEngineAccountSymbolsQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.accountSymbol)).isRequired,
  };

  state = {
    currentSymbolPrice: null,
  };

  getCurrentSymbol = (symbol) => {
    const allowedSymbols = this.props.tradingEngineAccountSymbolsQuery?.data?.tradingEngineAccountSymbols;

    return allowedSymbols?.find(({ name }) => name === symbol);
  }

  /**
   * Get current BID price with applied group spread
   *
   * @param symbol
   *
   * @return {number}
   */
  getCurrentPriceBid = (symbol) => {
    const { currentSymbolPrice } = this.state;

    const currentSymbol = this.getCurrentSymbol(symbol);

    return round(
      (currentSymbolPrice?.bid || 0) - (currentSymbol?.config?.bidAdjustment || 0),
      currentSymbol?.digits,
    );
  };

  /**
   * Get current ASK price with applied group spread
   *
   * @param symbol
   *
   * @return {number}
   */
  getCurrentPriceAsk = (symbol) => {
    const { currentSymbolPrice } = this.state;

    const currentSymbol = this.getCurrentSymbol(symbol);

    return round(
      (currentSymbolPrice?.ask || 0) + (currentSymbol?.config?.askAdjustment || 0),
      currentSymbol?.digits,
    );
  };

  onChangeSymbol = (value, values, setValues) => {
    setValues({
      ...values,
      symbol: value,
      takeProfit: null,
      stopLoss: null,
      openPrice: null,
      autoOpenPrice: true,
      pendingOrder: false,
    });
  };

  handleSubmit = async (values) => {
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
          accountUuid: id,
          ...values,
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
      const { message } = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('COMMON.ERROR'),
        message,
      });
    }
  }

  handleAutoOpenPrice = (values, setValues) => () => {
    const autoOpenPrice = !values.autoOpenPrice;

    const currentPriceBid = this.getCurrentPriceBid(values.symbol);

    // If auto open price is turned on --> remove openPrice, in other case set real BID price to openPrice field
    const openPrice = !autoOpenPrice ? currentPriceBid : undefined;

    setValues({
      ...values,
      autoOpenPrice,
      openPrice,
    });
  };

  handlePendingOrder = (values, setValues) => () => {
    const pendingOrder = !values.pendingOrder;
    let { autoOpenPrice, openPrice } = values;

    // If pending order is turned on --> turn off auto open price and set real BID price to openPrice field
    if (pendingOrder) {
      const currentPriceBid = this.getCurrentPriceBid(values.symbol);

      autoOpenPrice = false;

      // Set openPrice only if field is empty
      if (!values.openPrice) {
        openPrice = currentPriceBid;
      }
    }

    setValues({
      ...values,
      pendingOrder,
      autoOpenPrice,
      openPrice,
    });
  };

  handleSymbolsPricesTick = (currentSymbolPrice) => {
    this.setState({ currentSymbolPrice });
  };

  validate = (values) => {
    const currentSymbol = this.getCurrentSymbol(values.symbol);
    const { lotMin = 0, lotMax = 1000, lotStep = 1 } = currentSymbol?.config || {};

    return createValidator({
      volumeLots: ['required', 'numeric', `min:${lotMin}`, `max:${lotMax}`, `step:${lotStep}`],
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
    }, false)(values);
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      tradingEngineAccountQuery,
      tradingEngineAccountSymbolsQuery,
    } = this.props;

    const { currentSymbolPrice } = this.state;

    const account = tradingEngineAccountQuery.data?.tradingEngineAccount;
    const allowedSymbols = tradingEngineAccountSymbolsQuery.data?.tradingEngineAccountSymbols || [];

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
            symbol: allowedSymbols[0]?.name,
            volumeLots: allowedSymbols[0]?.config?.lotMin,
            autoOpenPrice: true,
            pendingOrder: false,
          }}
          validate={this.validate}
          enableReinitialize
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting, isValid, values, setFieldValue, setValues, handleSubmit }) => {
            const {
              autoOpenPrice,
              openPrice,
              symbol,
              volumeLots,
              pendingOrder,
            } = values;

            const currentSymbol = this.getCurrentSymbol(symbol);

            // Get current BID and ASK prices with applied group spread
            const currentPriceBid = this.getCurrentPriceBid(symbol);
            const currentPriceAsk = this.getCurrentPriceAsk(symbol);

            // Get SELL and BUY price depends on autoOpenPrice checkbox
            const sellPrice = autoOpenPrice ? currentPriceBid : openPrice;
            const buyPrice = autoOpenPrice ? currentPriceAsk : openPrice;

            // Determine order type for SELL and BUY buttons for right order creation
            const sellType = determineOrderType({
              pendingOrder,
              openPrice,
              direction: OrderDirection.SELL,
              currentPrice: currentPriceBid,
            });

            const buyType = determineOrderType({
              pendingOrder,
              openPrice,
              direction: OrderDirection.BUY,
              currentPrice: currentPriceAsk,
            });

            // Get status of buttons SELL and BUY
            const isSellDisabled = (
              isSubmitting || !isValid || !sellPrice || (pendingOrder && openPrice === currentPriceBid)
            );
            const isBuyDisabled = (
              isSubmitting || !isValid || !buyPrice || (pendingOrder && openPrice === currentPriceAsk)
            );

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
                        step={currentSymbol?.config?.lotStep}
                        min={currentSymbol?.config?.lotMin}
                        max={currentSymbol?.config?.lotMax}
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
                        {(allowedSymbols || []).map(({ name, description }) => (
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
                        placeholder={placeholder(currentSymbol?.digits)}
                        step={step(currentSymbol?.digits)}
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
                        placeholder={placeholder(currentSymbol?.digits)}
                        step={step(currentSymbol?.digits)}
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
                        placeholder={placeholder(currentSymbol?.digits)}
                        step={step(currentSymbol?.digits)}
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
                      <div className="NewOrderModal__checkbox-container">
                        <Field
                          name="autoOpenPrice"
                          label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.AUTO')}
                          disabled={pendingOrder}
                          className="NewOrderModal__auto-checkbox"
                          component={FormikCheckbox}
                          onChange={this.handleAutoOpenPrice(values, setValues)}
                        />
                        <Field
                          name="pendingOrder"
                          label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.PENDING_ORDER')}
                          component={FormikCheckbox}
                          onChange={this.handlePendingOrder(values, setValues)}
                        />
                      </div>
                    </div>
                    <If condition={!pendingOrder}>
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
                                lotSize: currentSymbol?.config?.lotSize,
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
                                lotSize: currentSymbol?.config?.lotSize,
                                exchangeRate: currentSymbolPrice?.pnlRates[account.currency],
                              })
                              : 0}
                          className="NewOrderModal__field"
                        />
                      </div>
                    </If>
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
                          if (!isSellDisabled) {
                            setFieldValue('type', sellType);
                            setFieldValue('direction', OrderDirection.SELL);
                            handleSubmit();
                          }
                        }}
                      />

                      {/* Buy order by CTRL+D pressing */}
                      <Hotkeys
                        keyName="ctrl+d"
                        filter={() => true}
                        onKeyUp={() => {
                          if (!isBuyDisabled) {
                            setFieldValue('type', buyType);
                            setFieldValue('direction', OrderDirection.BUY);
                            handleSubmit();
                          }
                        }}
                      />
                      <Button
                        className="NewOrderModal__button"
                        danger
                        disabled={isSellDisabled}
                        onClick={() => {
                          setFieldValue('type', sellType);
                          setFieldValue('direction', OrderDirection.SELL);
                          handleSubmit();
                        }}
                      >
                        {I18n.t(`TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.SELL_${sellType}_AT`, {
                          value: (sellPrice || 0).toFixed(currentSymbol?.digits),
                          type: I18n.t(`TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.${sellType}`),
                        })}
                      </Button>
                      <Button
                        className="NewOrderModal__button"
                        primary
                        disabled={isBuyDisabled}
                        onClick={() => {
                          setFieldValue('type', buyType);
                          setFieldValue('direction', OrderDirection.BUY);
                          handleSubmit();
                        }}
                      >
                        {I18n.t(`TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.BUY_${buyType}_AT`, {
                          value: (buyPrice || 0).toFixed(currentSymbol?.digits),
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
    tradingEngineAccountSymbolsQuery: TradingEngineAccountSymbolsQuery,
  }),
)(NewOrderModal);
