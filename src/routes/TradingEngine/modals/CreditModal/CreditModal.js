import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import ShortLoader from 'components/ShortLoader';
import {
  FormikInputField,
  FormikDatePicker,
  FormikTextAreaField,
} from 'components/Formik';
import { Button } from 'components/UI';
import './CreditModal.scss';

class CreditModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  }

  handleSubmit = async () => {
    console.log('--Submit--');
  }

  render() {
    const {
      isOpen,
      onCloseModal,
    } = this.props;

    return (
      <Modal className="CreditModal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader
          className="CreditModal__header"
          toggle={onCloseModal}
        >
          {I18n.t('TRADING_ENGINE.MODALS.CREDIT.TITLE')}
        </ModalHeader>

        <Choose>
          <When condition={false}>
            <div className="CreditModal__loader">
              <ShortLoader />
            </div>
          </When>
          <Otherwise>
            <Formik
              initialValues={{}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={this.handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    <Field
                      name="account"
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.ACCOUNT')}
                      component={FormikInputField}
                    />
                    <Field
                      name="name"
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.NAME')}
                      component={FormikInputField}
                    />
                    <Field
                      name="balance"
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.BALANCE')}
                      component={FormikInputField}
                    />
                    <Field
                      name="credit"
                      className="TradingEngineCreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.CREDIT')}
                      component={FormikInputField}
                    />
                    <Field
                      name="amount"
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.AMOUNT')}
                      component={FormikInputField}
                    />
                    <Field
                      name="comment"
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.COMMENT')}
                      component={FormikTextAreaField}
                    />
                    <Field
                      name="freeMargin"
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.FREE_MARGIN')}
                      component={FormikInputField}
                    />

                    <Field
                      name="dueDate"
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.DUE_DATE')}
                      component={FormikDatePicker}
                      withTime
                      withUtc
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      primary
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.CREDIT.CREDIT_IN')}
                    </Button>

                    <Button
                      onClick={onCloseModal}
                      common
                    >
                      {I18n.t('COMMON.CANCEL')}
                    </Button>

                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      primary
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.CREDIT.CREDIT_OUT')}
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </Otherwise>
        </Choose>
      </Modal>
    );
  }
}

export default CreditModal;
