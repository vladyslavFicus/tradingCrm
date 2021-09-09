import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { parseErrors, withRequests } from 'apollo';
import { withLazyStreams } from 'rsocket';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { FormikCheckbox, FormikInputField, FormikTextAreaField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import { createValidator, translateLabels } from 'utils/validator';
import CreateOrderMutation from './graphql/CreateOrderMutation';
import TradingEngineAccountQuery from './graphql/TradingEngineAccountQuery';
import TradingEngineAccountSymbolsQuery from './graphql/TradingEngineAccountSymbolsQuery';
import TradingEngineSymbolPricesQuery from './graphql/SymbolPricesQuery';

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
    streamPriceRequest: PropTypes.func.isRequired,
  };

  state = {
    ask: 0,
    bid: 0,
    accountUuid: null,
    formError: null,
    existingLogin: false,
    accountSymbols: [],
    login: null,
  };

  componentDidUpdate(_, { accountSymbols: prevAccountSymbols }) {
    const { accountSymbols, accountUuid } = this.state;
    const defaultSymbol = accountSymbols[0]?.name;
    const prevDefaultSymbol = prevAccountSymbols[0]?.name;

    if (accountUuid && (prevDefaultSymbol !== defaultSymbol)) {
      this.fetchSymbolPrice(defaultSymbol);
    }
  }

  onChangeSymbol = (value, values, setValues) => {
    this.fetchSymbolPrice(value);

    setValues({
      ...values,
      symbol: value,
      takeProfit: null,
      stopLoss: null,
      openPrice: null,
    });
  };

  fetchSymbolPrice = async (symbol) => {
    const {
      client,
      notify,
      streamPriceRequest,
    } = this.props;

    const subscription = streamPriceRequest({
      data: { symbol, accountUuid: this.state.accountUuid },
    });

    subscription.onNext(({ data: { ask, bid } }) => {
      this.setState({ ask, bid });
    });

    try {
      const { data: { tradingEngineSymbolPrices } } = await client.query({
        query: TradingEngineSymbolPricesQuery,
        variables: {
          symbol,
          size: 1,
        },
        fetchPolicy: 'network-only',
      });

      this.setState({
        ask: tradingEngineSymbolPrices[0]?.ask || 0,
        bid: tradingEngineSymbolPrices[0]?.bid || 0,
      });
    } catch (_) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
      });
    }
  };

  handleGetAccount = login => async () => {
    try {
      const {
        data: {
          tradingEngineAccount: {
            uuid: accountUuid,
          },
        },
      } = await this.props.client.query({
        query: TradingEngineAccountQuery,
        variables: { identifier: login },
        fetchPolicy: 'network-only',
      });

      const {
        data: {
          tradingEngineAccountSymbols,
        },
      } = await this.props.client.query({
        query: TradingEngineAccountSymbolsQuery,
        variables: { accountUuid },
        fetchPolicy: 'network-only',
      });

      this.setState({
        login,
        existingLogin: true,
        accountUuid,
        accountSymbols: tradingEngineAccountSymbols,
      });
    } catch (_) {
      this.setState({
        existingLogin: false,
      });
      this.setState({ formError: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ERROR') });
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

    const { accountUuid } = this.state;

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
          accountUuid,
          pendingOrder: true,
          takeProfit: Number(takeProfit),
          stopLoss: Number(stopLoss),
          openPrice: Number(openPrice),
          direction,
          ...res,
        },
      });

      // Save last created order to storage to open it later by request
      storage.set('TE.lastCreatedOrderId', orderId);

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ERROR.NOTIFICATION.SUCCESS'),
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
          : I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.NOTIFICATION.FAILED'),
      });
    }

    setSubmitting(false);
  }

  handleAutoOpenPrice = (value, setFieldValue) => () => {
    const autoOpenPrice = !value;

    setFieldValue('autoOpenPrice', autoOpenPrice);

    setFieldValue('openPrice', !autoOpenPrice ? this.state.bid : undefined);
  };

  render() {
    const {
      isOpen,
      onCloseModal,
    } = this.props;

    const {
      ask,
      bid,
      login: _login,
      existingLogin,
      formError,
      accountSymbols,
      accountUuid,
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
            symbol: accountSymbols[0]?.name,
            autoOpenPrice: true,
          }}
          validate={values => createValidator({
            volumeLots: ['required', 'numeric', 'max:10000', 'min:0.01'],
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
            } = values;

            const sellPrice = autoOpenPrice ? bid : openPrice;
            const buyPrice = autoOpenPrice ? ask : openPrice;

            const digitsCurrentSymbol = accountSymbols.find(({ name }) => name === symbol)?.digits;

            const decimalsSettings = {
              decimalsLimit: digitsCurrentSymbol,
              decimalsWarningMessage: I18n.t('TRADING_ENGINE.DECIMALS_WARNING_MESSAGE', {
                symbol,
                digits: digitsCurrentSymbol,
              }),
              decimalsLengthDefault: digitsCurrentSymbol,
            };

            return (
              <Form>
                <ModalHeader toggle={onCloseModal}>
                  {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TITLE')}
                </ModalHeader>
                <div className="CommonNewOrderModal__inner-wrapper">
                  <SymbolChart symbol={symbol} accountUuid={accountUuid} />
                  <ModalBody>
                    <If condition={formError && !existingLogin}>
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
                        disabled={!dirty || isSubmitting}
                        onClick={this.handleGetAccount(login)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPLOAD')}
                      </Button>
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        name="volumeLots"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME')}
                        className="CommonNewOrderModal__field"
                        placeholder="0.00000"
                        step="0.00001"
                        min={0}
                        max={999999}
                        component={FormikInputField}
                        disabled={!existingLogin}
                      />
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        name="symbol"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SYMBOL')}
                        className="CommonNewOrderModal__field"
                        component={FormikSelectField}
                        disabled={!existingLogin}
                        customOnChange={value => this.onChangeSymbol(value, values, setValues)}
                        searchable
                      >
                        {accountSymbols.map(({ name, description }) => (
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
                        placeholder={`0.${'0'.repeat(digitsCurrentSymbol || 4)}`}
                        step="0.00001"
                        min={0}
                        max={999999}
                        component={FormikInputField}
                        disabled={!existingLogin}
                        {...decimalsSettings}
                      />
                      <Field
                        name="stopLoss"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.STOP_LOSS')}
                        className="CommonNewOrderModal__field"
                        placeholder={`0.${'0'.repeat(digitsCurrentSymbol || 4)}`}
                        step="0.00001"
                        min={0}
                        max={999999}
                        component={FormikInputField}
                        disabled={!existingLogin}
                        {...decimalsSettings}
                      />
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        name="openPrice"
                        type="number"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE')}
                        className="CommonNewOrderModal__field"
                        placeholder={`0.${'0'.repeat(digitsCurrentSymbol || 4)}`}
                        step="0.00001"
                        min={0}
                        max={999999}
                        value={autoOpenPrice ? bid.toFixed(digitsCurrentSymbol) : openPrice}
                        disabled={autoOpenPrice || !existingLogin}
                        component={FormikInputField}
                        {...decimalsSettings}
                      />
                      <Button
                        className="CommonNewOrderModal__button CommonNewOrderModal__button--small"
                        type="button"
                        primaryOutline
                        disabled={autoOpenPrice || !existingLogin}
                        onClick={() => setFieldValue('openPrice', bid)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPDATE')}
                      </Button>
                      <Field
                        name="autoOpenPrice"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.AUTO')}
                        className="CommonNewOrderModal__field CommonNewOrderModal__field--center"
                        component={FormikCheckbox}
                        onChange={this.handleAutoOpenPrice(autoOpenPrice, setFieldValue)}
                        disabled={!existingLogin}
                      />
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <Field
                        name="comment"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.COMMENT')}
                        className="CommonNewOrderModal__field"
                        maxLength={1000}
                        component={FormikTextAreaField}
                        disabled={!existingLogin}
                      />
                    </div>
                    <div className="CommonNewOrderModal__field-container">
                      <If condition={existingLogin}>
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
                        className="CommonNewOrderModal__button"
                        danger
                        disabled={isSubmitting || !existingLogin || !sellPrice}
                        onClick={this.handleSubmit(values, 'SELL', setFieldValue, setSubmitting)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SELL_AT', {
                          value: sellPrice && sellPrice.toFixed(digitsCurrentSymbol),
                        })}
                      </Button>
                      <Button
                        className="CommonNewOrderModal__button"
                        primary
                        disabled={isSubmitting || !existingLogin || !buyPrice}
                        onClick={this.handleSubmit(values, 'BUY', setFieldValue, setSubmitting)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.BUY_AT', {
                          value: buyPrice && buyPrice.toFixed(digitsCurrentSymbol),
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
  withLazyStreams({
    streamPriceRequest: {
      route: 'streamPrices',
    },
  }),
)(CommonNewOrderModal);
