import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikTextAreaField } from 'components/Formik';
import { Currency } from 'components/Amount';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import './DepositWithdrawalModal.scss';

class DepositWithdrawalModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleSubmit = async () => {
    const {
      notify,
      onCloseModal,
    } = this.props;

    try {
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
      <Modal className="DepositWithdrawalModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{
            login: '123-412-123',
            fullName: 'Vasya Pupkin',
            balance: 21026.28,
            margin: 21528.28,
            credit: 502,
          }}
          validate={createValidator({
            amount: ['required', 'numeric', 'greater:0', 'max:999999'],
          })}
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('TRADING_ENGINE.MODALS.DEPOSIT_WITHDRAWAL_MODAL.TITLE')}
              </ModalHeader>
              <ModalBody>
                <div className="DepositWithdrawalModal__field-container--half">
                  <Field
                    disabled
                    name="login"
                    label={I18n.t('TRADING_ENGINE.MODALS.DEPOSIT_WITHDRAWAL_MODAL.LOGIN')}
                    className="DepositWithdrawalModal__field"
                    component={FormikInputField}
                  />
                </div>
                <div className="DepositWithdrawalModal__field-container">
                  <Field
                    disabled
                    name="fullName"
                    label={I18n.t('TRADING_ENGINE.MODALS.DEPOSIT_WITHDRAWAL_MODAL.FULL_NAME')}
                    className="DepositWithdrawalModal__field"
                    component={FormikInputField}
                  />
                </div>
                <div className="DepositWithdrawalModal__field-container">
                  <Field
                    disabled
                    name="balance"
                    label={I18n.t('TRADING_ENGINE.MODALS.DEPOSIT_WITHDRAWAL_MODAL.BALANCE')}
                    className="DepositWithdrawalModal__field"
                    component={FormikInputField}
                  />
                  <Field
                    disabled
                    name="margin"
                    label={I18n.t('TRADING_ENGINE.MODALS.DEPOSIT_WITHDRAWAL_MODAL.MARGIN')}
                    className="DepositWithdrawalModal__field"
                    digitsAfterDot={2}
                    component={FormikInputField}
                  />
                </div>
                <div className="DepositWithdrawalModal__field-container--half">
                  <Field
                    disabled
                    name="credit"
                    label={I18n.t('TRADING_ENGINE.MODALS.DEPOSIT_WITHDRAWAL_MODAL.CREDIT')}
                    className="DepositWithdrawalModal__field"
                    digitsAfterDot={2}
                    component={FormikInputField}
                  />
                </div>
                <div className="DepositWithdrawalModal__field-container--half">
                  <Field
                    name="amount"
                    type="number"
                    label={I18n.t('COMMON.AMOUNT')}
                    className="DepositWithdrawalModal__field"
                    placeholder="0.00"
                    step="0.01"
                    min={0}
                    max={999999}
                    addition={<Currency code="USD" showSymbol />}
                    component={FormikInputField}
                  />
                </div>
                <div className="DepositWithdrawalModal__field-container">
                  <Field
                    name="comment"
                    label={I18n.t('TRADING_ENGINE.MODALS.DEPOSIT_WITHDRAWAL_MODAL.COMMENT')}
                    className="DepositWithdrawalModal__field DepositWithdrawalModal__field--margin-bottom"
                    component={FormikTextAreaField}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="DepositWithdrawalModal__buttons">
                  <Button
                    className="DepositWithdrawalModal__button"
                    primary
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {I18n.t('COMMON.PAYMENT.TYPE.DEPOSIT')}
                  </Button>

                  <Button
                    onClick={onCloseModal}
                    className="DepositWithdrawalModal__button"
                    commonOutline
                  >
                    {I18n.t('COMMON.BUTTONS.CANCEL')}
                  </Button>

                  <Button
                    className="DepositWithdrawalModal__button"
                    danger
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {I18n.t('COMMON.PAYMENT.TYPE.WITHDRAW')}
                  </Button>
                </div>
              </ModalFooter>
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
)(DepositWithdrawalModal);
