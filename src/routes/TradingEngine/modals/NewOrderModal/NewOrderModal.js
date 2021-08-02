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
import { createValidator, translateLabels } from 'utils/validator';
import createOrderMutation from './graphql/CreateOrderMutation';
import './NewOrderModal.scss';

class NewOrderModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    createOrder: PropTypes.func.isRequired,
    login: PropTypes.number.isRequired,
  };

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
    } = this.props;

    return (
      <Modal className="NewOrderModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{
            login,
            volumeLots: 1,
            symbol: 'US30',
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
                    <option key="US30" value="US30">US30, US Wall Street 30</option>
                    <option key="USTEC" value="USTEC">USTEC, US Tech 100</option>
                    <option key="CHINAA" value="CHINAA">CHINAA, China A50</option>
                    <option key="EURUSD-" value="EURUSD-">EURUSD-, Euro vs US Dollar</option>
                    <option key="AUDUSD-" value="AUDUSD-">AUDUSD-, Australian vs US Dollar</option>
                    <option key="USDCAD-" value="USDCAD-">USDCAD-, US Dollar vs Canadian</option>
                  </Field>
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
  }),
)(NewOrderModal);
