import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withApollo } from 'react-apollo';
import { parseErrors, withRequests } from 'apollo';
import { withLazyStreams } from 'rsocket';
import { withStorage } from 'providers/StorageProvider';
import Hotkeys from 'react-hot-keys';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import {
  FormikCheckbox,
  FormikInputField,
  FormikTextAreaField,
  FormikSelectField,
  FormikInputDecimalsField,
} from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import createOrderMutation from './graphql/CreateOrderMutation';
import TradingEngineAccountSymbolsQuery from './graphql/TradingEngineAccountSymbolsQuery';
import TradingEngineSymbolPricesQuery from './graphql/SymbolPricesQuery';
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
    tradingEngineAccountSymbolsQuery: PropTypes.query({
      tradingEngineAccountSymbolsQuery: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
    }).isRequired,
    login: PropTypes.number,
    streamPriceRequest: PropTypes.func.isRequired,
  };

  static defaultProps = {
    login: null,
  }

  state = {
    ask: 0,
    bid: 0,
  };

  componentDidUpdate({ tradingEngineAccountSymbolsQuery: { loading: prevLoading } }) {
    const { tradingEngineAccountSymbolsQuery: { data, loading } } = this.props;

    const [accountSymbols] = data?.tradingEngineAccountSymbols || [];
    const defaultSymbol = accountSymbols?.name;

    if (!loading && prevLoading) {
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
      autoOpenPrice: true,
    });
  };

  fetchSymbolPrice = async (symbol) => {
    const {
      client,
      notify,
      streamPriceRequest,
      match: {
        params: {
          id: accountUuid,
        },
      },
    } = this.props;

    const subscription = streamPriceRequest({
      data: { symbol, accountUuid },
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

  handleSubmit = ({ takeProfit, stopLoss, openPrice, ...res }, direction, setFieldValue) => async () => {
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
          accountUuid: id,
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

  handleAutoOpenPrice = (value, setFieldValue) => () => {
    const autoOpenPrice = !value;

    setFieldValue('autoOpenPrice', autoOpenPrice);

    setFieldValue('openPrice', !autoOpenPrice ? this.state.bid : undefined);
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      login,
      tradingEngineAccountSymbolsQuery,
      match: {
        params: {
          id: accountUuid,
        },
      },
    } = this.props;

    const { ask, bid } = this.state;

    const accountSymbols = tradingEngineAccountSymbolsQuery.data?.tradingEngineAccountSymbols || [];

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
            login,
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
            volumeLots: I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.VOLUME'),
            openPrice: I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.OPEN_PRICE'),
          }), false)(values)}
          validateOnChange={false}
          validateOnBlur={false}
          enableReinitialize
          onSubmit={() => {}}
        >
          {({ isSubmitting, values, setFieldValue, setValues }) => {
            const {
              autoOpenPrice,
              openPrice,
              symbol,
            } = values;

            const sellPrice = autoOpenPrice ? bid : openPrice;
            const buyPrice = autoOpenPrice ? ask : openPrice;

            const digitsCurrentSymbol = accountSymbols.find(({ name }) => name === symbol)?.digits;
            // console.log('openPrice', openPrice, bid.toFixed(digitsCurrentSymbol), autoOpenPrice);
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
                  {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.TITLE')}
                </ModalHeader>
                <div className="NewOrderModal__inner-wrapper">
                  <SymbolChart symbol={symbol} accountUuid={accountUuid} />
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
                        placeholder="0.00000"
                        step="0.00001"
                        min={0}
                        max={999999}
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
                        {accountSymbols.map(({ name, description }) => (
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
                        placeholder={`0.${'0'.repeat(digitsCurrentSymbol || 4)}`}
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
                        placeholder={`0.${'0'.repeat(digitsCurrentSymbol || 4)}`}
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
                        placeholder={`0.${'0'.repeat(digitsCurrentSymbol || 4)}`}
                        step="0.01"
                        min={0}
                        max={999999}
                        value={autoOpenPrice ? bid.toFixed(digitsCurrentSymbol) : openPrice}
                        disabled={autoOpenPrice}
                        component={FormikInputDecimalsField}
                        {...decimalsSettings}
                      />
                      <Button
                        className="NewOrderModal__button NewOrderModal__button--small"
                        type="button"
                        primaryOutline
                        disabled={autoOpenPrice}
                        onClick={() => setFieldValue('openPrice', bid)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.UPDATE')}
                      </Button>
                      <Field
                        name="autoOpenPrice"
                        label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.AUTO')}
                        className="NewOrderModal__field NewOrderModal__field--center"
                        component={FormikCheckbox}
                        onChange={this.handleAutoOpenPrice(autoOpenPrice, setFieldValue)}
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
                        onKeyUp={this.handleSubmit(values, 'SELL', setFieldValue)}
                      />

                      {/* Buy order by CTRL+S pressing */}
                      <Hotkeys
                        keyName="ctrl+d"
                        filter={() => true}
                        onKeyUp={this.handleSubmit(values, 'BUY', setFieldValue)}
                      />
                      <Button
                        className="NewOrderModal__button"
                        danger
                        disabled={isSubmitting || !sellPrice}
                        onClick={this.handleSubmit(values, 'SELL', setFieldValue)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.SELL_AT', {
                          value: sellPrice && Number(sellPrice).toFixed(digitsCurrentSymbol),
                        })}
                      </Button>
                      <Button
                        className="NewOrderModal__button"
                        primary
                        disabled={isSubmitting || !buyPrice}
                        onClick={this.handleSubmit(values, 'BUY', setFieldValue)}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.BUY_AT', {
                          value: buyPrice && Number(buyPrice).toFixed(digitsCurrentSymbol),
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
    tradingEngineAccountSymbolsQuery: TradingEngineAccountSymbolsQuery,
  }),
  withLazyStreams({
    streamPriceRequest: {
      route: 'streamPrices',
    },
  }),
)(NewOrderModal);
