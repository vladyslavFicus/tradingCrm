import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import './EditOrderModal.scss';

class EditOrderModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleSubmit = async (values) => {
    const {
      notify,
      onCloseModal,
    } = this.props;

    try {
      console.log('SUBMIT', values);

      onCloseModal();
    } catch (_) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  render() {
    const {
      isOpen,
      onCloseModal,
    } = this.props;

    return (
      <Modal className="EditOrderModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{
            type: 'SELL',
            amount: '1.0',
            symbol: 'GBPUSD',
            openPrice: '1.42116',
            openTime: '2021.05.21 14:43:18',
            commission: '-2.50',
            expiry: '2021.05.31 11:01',
            taxes: '0.00',
            roSwaps: '10.97',
            stopLoss: '0.00000',
            floatingPL: '351.00',
            takeProfit: '0.00000',
            profit: '359.47',
            volume: '1',
            currentPrice: '1.41760',
          }}
          validate={createValidator({
            amount: ['required', 'numeric', 'greater:0', 'max:999999'],
          })}
          onSubmit={this.handleSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
                  id: '46188376',
                  type: 'SELL',
                  amount: '1.0',
                  symbol: 'GBPUSD',
                  openPrice: '1.42116',
                })}
              </ModalHeader>
              <ModalBody>
                <fieldset className="EditOrderModal__fieldset">
                  <legend className="EditOrderModal__fieldset-title">
                    2124671936, OI Test
                  </legend>
                  <div className="EditOrderModal__field-container">
                    <Field
                      disabled
                      name="order"
                      label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.ORDER')}
                      className="EditOrderModal__field"
                      value={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
                        id: '46188376',
                        type: 'SELL',
                        amount: '1.0',
                        symbol: 'GBPUSD',
                        openPrice: '1.42116',
                      })}
                      component={FormikInputField}
                    />
                    <Button
                      className="EditOrderModal__button EditOrderModal__button--small"
                      danger
                      disabled={isSubmitting}
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.DELETE')}
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
                  <div className="EditOrderModal__field-container">
                    <Field
                      disabled
                      name="expiry"
                      label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.EXPIRY')}
                      className="EditOrderModal__field"
                      component={FormikInputField}
                    />
                    <Field
                      disabled
                      name="taxes"
                      label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TAXES')}
                      className="EditOrderModal__field"
                      component={FormikInputField}
                    />
                  </div>
                  <div className="EditOrderModal__field-container">
                    <Field
                      name="openPrice"
                      type="number"
                      step="0.00001"
                      label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_PRICE')}
                      className="EditOrderModal__field"
                      component={FormikInputField}
                    />
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
                      label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.STOP_LOSS')}
                      className="EditOrderModal__field"
                      component={FormikInputField}
                    />
                    <Field
                      disabled
                      name="floatingPL"
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
                      label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TAKE_PROFIT')}
                      className="EditOrderModal__field"
                      component={FormikInputField}
                    />
                    <Button
                      primary
                      className="EditOrderModal__button EditOrderModal__button--small"
                      disabled={isSubmitting}
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.MODIFY')}
                    </Button>
                    <Field
                      disabled
                      name="profit"
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
                      className="EditOrderModal__button EditOrderModal__button--small"
                      disabled={isSubmitting}
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CHANGE')}
                    </Button>
                  </div>
                </fieldset>

                <fieldset className="EditOrderModal__fieldset">
                  <legend className="EditOrderModal__fieldset-title">
                    {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.PROCESS')}
                  </legend>

                  <div className="EditOrderModal__field-container">
                    <Field
                      name="volume"
                      type="number"
                      label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.VOLUME')}
                      className="EditOrderModal__field"
                      placeholder="0"
                      component={FormikInputField}
                    />
                    <Field
                      name="currentPrice"
                      type="number"
                      className="EditOrderModal__field"
                      placeholder="0.00000"
                      step="0.00001"
                      min={0}
                      max={999999}
                      component={FormikInputField}
                    />
                    <Button
                      className="EditOrderModal__button"
                      danger
                      disabled={isSubmitting}
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CLOSE_AT', {
                        volume: Number(values.volume).toFixed(2),
                        currentPrice: values.currentPrice,
                      })}
                    </Button>
                  </div>
                </fieldset>
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
)(EditOrderModal);
