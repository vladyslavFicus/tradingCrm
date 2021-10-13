import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { parseErrors, withRequests } from 'apollo';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { accountTypesLabels } from 'constants/accountTypes';
import {
  FormikCheckbox,
  FormikInputField,
  FormikTextAreaField,
  FormikSelectField,
  FormikInputDecimalsField } from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import Badge from 'components/Badge';
import Input from 'components/Input';
import { createValidator, translateLabels } from 'utils/validator';
import { OrderType } from 'types/trading-engine';
import SymbolPricesStream from 'routes/TradingEngine/components/SymbolPricesStream';
import { calculatePnL } from 'routes/TradingEngine/utils/formulas';
import CreateOrderMutation from './graphql/CreateOrderMutation';
import TradingEngineAccountQuery from './graphql/TradingEngineAccountQuery';
import './CommonNewOrderModal.scss';

class CommonNewOrderModal extends PureComponent {
  static propTypes = {
    ...withStorage.propTypes,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    createOrder: PropTypes.func.isRequired,
  };

  state = {
    login: null,
    account: null,
    currentSymbolPrice: null,
    loading: false,
    formError: null,
  };

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

  getCurrentSymbol = symbol => this.state.account?.allowedSymbols?.find(({ name }) => name === symbol);

  handleGetAccount = login => async () => {
    this.setState({
      login,
      loading: true,
      account: null,
    });

    try {
      const {
        data: {
          tradingEngineAccount,
        },
      } = await this.props.client.query({
        query: TradingEngineAccountQuery,
        variables: { identifier: login },
        fetchPolicy: 'network-only',
      });

      this.setState({ account: tradingEngineAccount, formError: null });
    } catch (_) {
      this.setState({ formError: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ERROR') });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleSubmit = ({ takeProfit, stopLoss, openPrice, ...res }, direction, setFieldValue, setSubmitting) => async () => {
    const {
      notify,
      onCloseModal,
      createOrder,
      onSuccess,
      storage,
    } = this.props;

    const { account } = this.state;

    setFieldValue('direction', direction);

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
          accountUuid: account.uuid,
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
        message: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('COMMON.ERROR'),
        message: error === 'error.order.creation.not-enough-free-margin'
          ? I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.NOTIFICATION.NOT_ENOUGH_FREE_MARGIN')
          : I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.NOTIFICATION.FAILED'),
      });
    }

    setSubmitting(false);
  }

  handleAutoOpenPrice = (value, symbol, setFieldValue) => () => {
    const { currentSymbolPrice } = this.state;

    const currentSymbol = this.getCurrentSymbol(symbol);

    const autoOpenPrice = !value;

    // Get current BID price and apply group spread
    const openPrice = !autoOpenPrice ? currentSymbolPrice?.bid + currentSymbol?.groupSpread?.bidAdjustment : undefined;

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
    } = this.props;

    const {
      login: _login,
      account,
      currentSymbolPrice,
      loading,
      formError,
    } = this.state;

    return (
      <Modal className="CommonNewOrderModal" toggle={onCloseModal} isOpen={isOpen} keyboard={false}>
        {/*
           Disable keyboard controlling on modal to prevent close modal by ESC button because it's working with a bug
           and after close by ESC button hotkeys not working when not clicking ESC button second time.
           So we should implement close event by ESC button manually.
        */}
        <Hotkeys keyName="esc" filter={() => true} onKeyUp={onCloseModal} />

        <Formik
          initialValues={{
            login: _login,
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
          }, translateLabels({
            volumeLots: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME'),
            openPrice: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE'),
          }), false)(values)}
          validateOnChange={false}
          validateOnBlur={false}
          enableReinitialize
          onSubmit={() => {}}
        >
          {({ isSubmitting, dirty, values, setFieldValue, setSubmitting, setValues }) => {
            const {
              login,
              autoOpenPrice,
              openPrice,
              symbol,
              volumeLots,
            } = values;

            const currentSymbol = this.getCurrentSymbol(symbol);

            // Get current BID and ASK prices with applied group spread
            const currentPriceBid = (currentSymbolPrice?.bid || 0) + (currentSymbol?.groupSpread?.bidAdjustment || 0);
            const currentPriceAsk = (currentSymbolPrice?.ask || 0) + (currentSymbol?.groupSpread?.askAdjustment || 0);

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
                  {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TITLE')}
                </ModalHeader>
                <div className="CommonNewOrderModal__inner-wrapper">
                  <SymbolChart symbol={symbol} accountUuid={account?.uuid} />
                  <ModalBody>
                    <If condition={formError}>
                      <div className="CommonNewOrderModal__error">
                        {formError}
                      </div>
                    </If>
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        autoFocus
                        name="login"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.LOGIN')}
                        className="CommonNewOrderModal__field"
                        component={FormikInputField}
                        onEnterPress={this.handleGetAccount(login)}
                      />
                      <Button
                        className="CommonNewOrderModal__button CommonNewOrderModal__button--small"
                        type="button"
                        primaryOutline
                        submitting={loading}
                        disabled={!dirty || isSubmitting}
                        onClick={this.handleGetAccount(login)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPLOAD')}
                      </Button>
                    </div>
                    <If condition={account}>
                      <div className="CommonNewOrderModal__field-container">
                        <div className="CommonNewOrderModal__account">
                          <div>
                            <Badge
                              text={I18n.t(accountTypesLabels[account.accountType].label)}
                              info={account.accountType === 'DEMO'}
                              success={account.accountType === 'LIVE'}
                            >
                              <span className="CommonNewOrderModal__account-label">
                                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.NAME')}:
                              </span>
                              &nbsp;{account.name}
                            </Badge>
                            <div>
                              <span className="CommonNewOrderModal__account-label">
                                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.GROUP')}:
                              </span>
                              &nbsp;{account.group}
                            </div>
                          </div>
                          <div>
                            <div>
                              <span className="CommonNewOrderModal__account-label">
                                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.BALANCE')}:
                              </span>
                              &nbsp;{I18n.toCurrency(account.balance, { unit: '' })}
                            </div>
                            <div>
                              <span className="CommonNewOrderModal__account-label">
                                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.CREDIT')}:
                              </span>
                              &nbsp;{I18n.toCurrency(account.credit, { unit: '' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </If>
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        name="volumeLots"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME')}
                        className="CommonNewOrderModal__field"
                        placeholder="0.00"
                        step="0.01"
                        min={0}
                        max={1000}
                        maxLength={4}
                        component={FormikInputField}
                        disabled={!account}
                      />
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        name="symbol"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SYMBOL')}
                        className="CommonNewOrderModal__field"
                        component={FormikSelectField}
                        disabled={!account}
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
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        name="takeProfit"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TAKE_PROFIT')}
                        className="CommonNewOrderModal__field"
                        placeholder={`0.${'0'.repeat(currentSymbol?.digits || 4)}`}
                        step="0.00001"
                        min={0}
                        max={999999}
                        component={FormikInputDecimalsField}
                        disabled={!account}
                        {...decimalsSettings}
                      />
                      <Field
                        name="stopLoss"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.STOP_LOSS')}
                        className="CommonNewOrderModal__field"
                        placeholder={`0.${'0'.repeat(currentSymbol?.digits || 4)}`}
                        step="0.00001"
                        min={0}
                        max={999999}
                        component={FormikInputDecimalsField}
                        disabled={!account}
                        {...decimalsSettings}
                      />
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        name="openPrice"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE')}
                        className="CommonNewOrderModal__field"
                        placeholder={`0.${'0'.repeat(currentSymbol?.digits || 4)}`}
                        step="0.00001"
                        min={0}
                        max={999999}
                        value={sellPrice}
                        disabled={autoOpenPrice || !account}
                        component={FormikInputDecimalsField}
                        {...decimalsSettings}
                      />
                      <Button
                        className="CommonNewOrderModal__button CommonNewOrderModal__button--small"
                        type="button"
                        primaryOutline
                        disabled={autoOpenPrice || !account}
                        onClick={() => setFieldValue('openPrice', currentPriceBid)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPDATE')}
                      </Button>
                      <Field
                        name="autoOpenPrice"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.AUTO')}
                        className="CommonNewOrderModal__field CommonNewOrderModal__field--center"
                        component={FormikCheckbox}
                        onChange={this.handleAutoOpenPrice(autoOpenPrice, symbol, setFieldValue)}
                        disabled={!account}
                      />
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <Input
                        disabled
                        name="sellPnl"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SELL_PNL')}
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
                        className="CommonNewOrderModal__field"
                      />
                      <Input
                        disabled
                        name="buyPnl"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.BUY_PNL')}
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
                        className="CommonNewOrderModal__field"
                      />
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        name="comment"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.COMMENT')}
                        className="CommonNewOrderModal__field"
                        maxLength={1000}
                        component={FormikTextAreaField}
                        disabled={!account}
                      />
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <If condition={account}>
                        {/* Sell order by CTRL+S pressing */}
                        <Hotkeys
                          keyName="ctrl+s"
                          filter={() => true}
                          onKeyUp={this.handleSubmit(values, 'SELL', setFieldValue, setSubmitting)}
                        />

                        {/* Buy order by CTRL+S pressing */}
                        <Hotkeys
                          keyName="ctrl+d"
                          filter={() => true}
                          onKeyUp={this.handleSubmit(values, 'BUY', setFieldValue, setSubmitting)}
                        />
                      </If>
                      <Button
                        type="submit"
                        className="CommonNewOrderModal__button"
                        danger
                        disabled={isSubmitting || !account || !sellPrice}
                        onClick={this.handleSubmit(values, 'SELL', setFieldValue, setSubmitting)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SELL_AT', {
                          value: sellPrice ? Number(sellPrice).toFixed(currentSymbol?.digits) : 0,
                        })}
                      </Button>
                      <Button
                        type="submit"
                        className="CommonNewOrderModal__button"
                        primary
                        disabled={isSubmitting || !account || !buyPrice}
                        onClick={this.handleSubmit(values, 'BUY', setFieldValue, setSubmitting)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.BUY_AT', {
                          value: buyPrice ? Number(buyPrice).toFixed(currentSymbol?.digits) : 0,
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
  withApollo,
  withStorage,
  withNotifications,
  withRequests({
    createOrder: CreateOrderMutation,
  }),
)(CommonNewOrderModal);
