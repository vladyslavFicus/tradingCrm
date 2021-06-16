import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import ShortLoader from 'components/ShortLoader';
import {
  FormikInputField,
  FormikDatePicker,
  FormikTextAreaField,
} from 'components/Formik';
import { Button } from 'components/UI';
import createCreditInMutation from './graphql/CreateCreditInMutation';
import createCreditOutMutation from './graphql/CreateCreditOutMutation';
import './CreditModal.scss';

class CreditModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    createCreditIn: PropTypes.func.isRequired,
    createCreditOut: PropTypes.func.isRequired,
  }

  handleCreditIn = async () => {
    const { createCreditIn } = this.props;
    console.log('--Submit--');

    try {
      createCreditIn({
        variables: {
          accountUuid: 'Uuid-test',
          amount: 236,
          comment: 'test comment',
        }
      });
    } catch (e) {

    }
  }

  handleCreditOut = async () => {
    const { createCreditOut } = this.props;
    console.log('--Submit--');

    try {
      createCreditOut({
        variables: {
          accountUuid: 'Uuid-test',
          amount: 222,
          comment: 'test comment',
        }
      });
    } catch (e) {

    }
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
              initialValues={{
                account: '567-412-567',
                name: 'First Name',
                balance: 4026.28,
                margin: 21528.28,
                credit: 502,
                amount: 456,
              }}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={this.handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    <div className="CreditModal__field-container">
                      <Field
                        name="account"
                        disabled
                        className="CreditModal__field"
                        label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.ACCOUNT')}
                        component={FormikInputField}
                      />
                      <Field
                        name="name"
                        disabled
                        className="CreditModal__field"
                        label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.NAME')}
                        component={FormikInputField}
                      />
                    </div>
                    <div className="CreditModal__field-container">
                      <Field
                        name="balance"
                        disabled
                        className="CreditModal__field"
                        label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.BALANCE')}
                        component={FormikInputField}
                      />
                      <Field
                        disabled
                        name="amount"
                        className="CreditModal__field"
                        label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.AMOUNT')}
                        component={FormikInputField}
                      />
                    </div>
                    <Field
                      disabled
                      name="credit"
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.CREDIT')}
                      component={FormikInputField}
                    />
                    <Field
                      name="margin"
                      disabled
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.FREE_MARGIN')}
                      component={FormikInputField}
                    />
                    <Field
                      name="dueDate"
                      className="CreditModal__field CreditModal__field--margin-bottom"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.DUE_DATE')}
                      component={FormikDatePicker}
                      withTime
                      withUtc
                    />
                    <Field
                      name="comment"
                      className="CreditModal__field"
                      label={I18n.t('TRADING_ENGINE.MODALS.CREDIT.COMMENT')}
                      component={FormikTextAreaField}
                    />
                  </ModalBody>

                  <ModalFooter>
                    <div className="CreditModal__buttons">
                      <Button
                        disabled={isSubmitting}
                        className="CreditModal__button"
                        onClick={this.handleCreditIn}
                        primary
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.CREDIT.CREDIT_IN')}
                      </Button>

                      <Button
                        onClick={onCloseModal}
                        className="CreditModal__button"
                        common
                      >
                        {I18n.t('COMMON.CANCEL')}
                      </Button>

                      <Button
                        disabled={isSubmitting}
                        className="CreditModal__button"
                        onClick={this.handleCreditOut}
                        danger
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.CREDIT.CREDIT_OUT')}
                      </Button>
                    </div>
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

export default compose(
  withRequests({
    createCreditIn: createCreditInMutation,
    createCreditOut: createCreditOutMutation,
  }),
)(CreditModal);
