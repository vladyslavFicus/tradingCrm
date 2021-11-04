import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests, parseErrors } from 'apollo';
import { withRouter } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import ShortLoader from 'components/ShortLoader';
import {
  FormikInputField,
  FormikTextAreaField,
} from 'components/Formik';
import { Button } from 'components/UI';
import createCreditInMutation from './graphql/CreateCreditInMutation';
import createCreditOutMutation from './graphql/CreateCreditOutMutation';
import accountQuery from './graphql/AccountQuery';
import './CreditModal.scss';

class CreditModal extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    account: PropTypes.query({
      tradingEngineAccount: PropTypes.tradingEngineAccount,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    createCreditIn: PropTypes.func.isRequired,
    createCreditOut: PropTypes.func.isRequired,
  }

  handleCreditIn = async ({ amount, comment }) => {
    const {
      createCreditIn,
      onCloseModal,
      notify,
      match: {
        params: {
          id,
        },
      },
    } = this.props;

    try {
      await createCreditIn({
        variables: {
          accountUuid: id,
          amount,
          comment,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.CREDIT.NOTIFICATION.CREDIT_IN.SUCCESS'),
      });

      onCloseModal();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('TRADING_ENGINE.MODALS.CREDIT.NOTIFICATION.CREDIT_IN.FAILED'),
      });
    }
  }

  handleCreditOut = async ({ amount, comment }) => {
    const {
      createCreditOut,
      onCloseModal,
      notify,
      match: {
        params: {
          id,
        },
      },
    } = this.props;

    try {
      await createCreditOut({
        variables: {
          accountUuid: id,
          amount,
          comment,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.CREDIT.NOTIFICATION.CREDIT_OUT.SUCCESS'),
      });

      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: error.error === 'error.credit.not-enough-credit'
          ? I18n.t('TRADING_ENGINE.MODALS.CREDIT.NOTIFICATION.CREDIT_OUT.NO_CREDIT')
          : I18n.t('TRADING_ENGINE.MODALS.CREDIT.NOTIFICATION.CREDIT_OUT.FAILED'),
      });
    }
  }

  render() {
    const {
      isOpen,
      onCloseModal,
      account,
    } = this.props;

    const {
      uuid,
      name,
      balance,
      margin,
      credit,
    } = account.data?.tradingEngineAccount || {};

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
                account: uuid,
                name,
                balance,
                margin,
                credit,
                amount: 0,
              }}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={this.handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values }) => (
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
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min={0}
                        max={999999}
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
                        onClick={() => this.handleCreditIn(values)}
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
                        onClick={() => this.handleCreditOut(values)}
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
  withNotifications,
  withRouter,
  withRequests({
    createCreditIn: createCreditInMutation,
    createCreditOut: createCreditOutMutation,
    account: accountQuery,
  }),
)(CreditModal);
