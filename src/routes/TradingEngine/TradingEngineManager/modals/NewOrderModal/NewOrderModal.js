import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { FormikCheckbox, FormikInputField, FormikTextAreaField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import { createValidator, translateLabels } from 'utils/validator';
import createOrderMutation from './graphql/CreateOrderMutation';
import TradingEngineAccountSymbolsQuery from './graphql/TradingEngineAccountSymbolsQuery';
import './NewOrderModal.scss';

class NewOrderModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
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
  };

  static defaultProps = {
    login: null,
  }

  handleSubmit = (values, direction, setFieldValue) => async () => {
    const {
      notify,
      onCloseModal,
      createOrder,
      onSuccess,
      match: {
        params: {
          id,
        },
      },
    } = this.props;

    setFieldValue('direction', direction);

    try {
      await createOrder({
        variables: {
          type: 'MARKET',
          accountUuid: id,
          pendingOrder: true,
          direction,
          ...values,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (_) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.NOTIFICATION.FAILED'),
      });
    }
  }

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

    const accountSymbols = tradingEngineAccountSymbolsQuery.data?.tradingEngineAccountSymbols || [];

    return (
      <Modal className="NewOrderModal" toggle={onCloseModal} isOpen={isOpen}>
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
        >
          {({ isSubmitting, dirty, values, setFieldValue }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.TITLE')}
              </ModalHeader>
              <div className="NewOrderModal__inner-wrapper">
                <SymbolChart symbol={values.symbol} accountUuid={accountUuid} />
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
                    >
                      {accountSymbols.map(({ name, description }) => (
                        <option key={name} value={name}>
                          {name} {description}
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
                      placeholder="0.00000"
                      step="0.00001"
                      min={0}
                      max={999999}
                      component={FormikInputField}
                    />
                    <Field
                      name="stopLoss"
                      type="number"
                      label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.STOP_LOSS')}
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
                      name="openPrice"
                      type="number"
                      label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.OPEN_PRICE')}
                      className="NewOrderModal__field"
                      placeholder="0.00"
                      step="0.01"
                      min={0}
                      max={999999}
                      disabled={values.autoOpenPrice}
                      component={FormikInputField}
                    />
                    <Button
                      className="NewOrderModal__button NewOrderModal__button--small"
                      type="button"
                      primaryOutline
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.UPDATE')}
                    </Button>
                    <Field
                      name="autoOpenPrice"
                      label={I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.AUTO')}
                      className="NewOrderModal__field NewOrderModal__field--center"
                      component={FormikCheckbox}
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
                    <Button
                      className="NewOrderModal__button"
                      danger
                      type="submit"
                      disabled={!dirty || isSubmitting}
                      onClick={this.handleSubmit(values, 'SELL', setFieldValue)}
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.SELL_AT', { value: values.openPrice || 0 })}
                    </Button>
                    <Button
                      className="NewOrderModal__button"
                      primary
                      type="submit"
                      disabled={!dirty || isSubmitting}
                      onClick={this.handleSubmit(values, 'BUY', setFieldValue)}
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.BUY_AT', { value: values.openPrice || 0 })}
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
  withRouter,
  withNotifications,
  withRequests({
    createOrder: createOrderMutation,
    tradingEngineAccountSymbolsQuery: TradingEngineAccountSymbolsQuery,
  }),
)(NewOrderModal);
