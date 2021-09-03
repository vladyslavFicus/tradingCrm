import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { withRequests } from 'apollo';
import { withLazyStreams } from 'rsocket';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
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

  onChangeSymbol = (value, setFieldValue) => {
    this.fetchSymbolPrice(value);

    setFieldValue('symbol', value);
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

  handleGetAccount = ({ login }) => async () => {
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

  handleSubmit = (values, direction, setFieldValue, setSubmitting) => async () => {
    const {
      notify,
      onCloseModal,
      createOrder,
      onSuccess,
    } = this.props;

    const { accountUuid } = this.state;

    setFieldValue('direction', direction);

    try {
      await createOrder({
        variables: {
          type: 'MARKET',
          accountUuid,
          pendingOrder: true,
          direction,
          ...values,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ERROR.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (_) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.NOTIFICATION.FAILED'),
      });
    }

    setSubmitting(false);
  }

  render() {
    const {
      isOpen,
      onCloseModal,
    } = this.props;

    const {
      ask,
      bid,
      login,
      existingLogin,
      formError,
      accountSymbols,
      accountUuid,
    } = this.state;

    return (
      <Modal className="CommonNewOrderModal" toggle={onCloseModal} isOpen={isOpen}>
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
            volumeLots: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME'),
            openPrice: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE'),
          }), false)(values)}
          validateOnChange={false}
          validateOnBlur={false}
          enableReinitialize
        >
          {({ isSubmitting, dirty, values, setFieldValue, setSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TITLE')}
              </ModalHeader>
              <div className="CommonNewOrderModal__inner-wrapper">
                <SymbolChart symbol={values.symbol} accountUuid={accountUuid} />
                <ModalBody>
                  <If condition={formError && !existingLogin}>
                    <div className="CommonNewOrderModal__error">
                      {formError}
                    </div>
                  </If>
                  <div className="CommonNewOrderModal__field-container">
                    <Field
                      name="login"
                      label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.LOGIN')}
                      className="CommonNewOrderModal__field"
                      component={FormikInputField}
                    />
                    <Button
                      className="CommonNewOrderModal__button CommonNewOrderModal__button--small"
                      type="button"
                      primaryOutline
                      disabled={!dirty || isSubmitting}
                      onClick={this.handleGetAccount(values)}
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
                      customOnChange={value => this.onChangeSymbol(value, setFieldValue)}
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
                      placeholder="0.00000"
                      step="0.00001"
                      min={0}
                      max={999999}
                      component={FormikInputField}
                      disabled={!existingLogin}
                    />
                    <Field
                      name="stopLoss"
                      type="number"
                      label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.STOP_LOSS')}
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
                      name="openPrice"
                      type="number"
                      label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE')}
                      className="CommonNewOrderModal__field"
                      placeholder="0.00"
                      step="0.01"
                      min={0}
                      max={999999}
                      disabled={values.autoOpenPrice && !existingLogin}
                      component={FormikInputField}
                    />
                    <Button
                      className="CommonNewOrderModal__button CommonNewOrderModal__button--small"
                      type="button"
                      primaryOutline
                      disabled={!existingLogin}
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPDATE')}
                    </Button>
                    <Field
                      name="autoOpenPrice"
                      label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.AUTO')}
                      className="CommonNewOrderModal__field CommonNewOrderModal__field--center"
                      component={FormikCheckbox}
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
                    <Button
                      className="CommonNewOrderModal__button"
                      danger
                      type="submit"
                      disabled={isSubmitting || !existingLogin}
                      onClick={this.handleSubmit(values, 'SELL', setFieldValue, setSubmitting)}
                    >
                      {I18n.t(
                        'TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SELL_AT',
                        { value: values.openPrice || bid },
                      )}
                    </Button>
                    <Button
                      className="CommonNewOrderModal__button"
                      primary
                      type="submit"
                      disabled={isSubmitting || !existingLogin}
                      onClick={this.handleSubmit(values, 'BUY', setFieldValue, setSubmitting)}
                    >
                      {I18n.t(
                        'TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.BUY_AT',
                        { value: values.openPrice || ask },
                      )}
                    </Button>
                  </div>
                </ModalBody>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withApollo,
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
