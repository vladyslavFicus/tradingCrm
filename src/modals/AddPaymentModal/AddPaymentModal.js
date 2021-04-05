import React, { PureComponent } from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { manualPaymentMethodsLabels } from 'constants/payment';
import { Button } from 'components/UI';
import NoteButton from 'components/NoteButton';
import { FormikInputField, FormikSelectField, FormikDatePicker } from 'components/Formik';
import Currency from 'components/Amount/Currency';
import AccountsSelectField from './components/AccountsSelectField';
import { validation } from './utils';
import { paymentTypes, paymentTypesLabels, attributeLabels } from './constants';
import { ManualPaymentMethodsQuery, AddNote, AddPayment } from './graphql';
import './AddPaymentModal.scss';

class AddPaymentModal extends PureComponent {
  static propTypes = {
    manualPaymentMethods: PropTypes.query({
      manualPaymentMethods: PropTypes.response(PropTypes.paymentMethods),
    }).isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    profile: PropTypes.profile.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    addPayment: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  state = {
    errorMessage: '',
  };

  resetErrorMessage = () => {
    const { errorMessage } = this.state;

    if (errorMessage) {
      this.setState({
        errorMessage: '',
      });
    }
  };

  onSubmit = async (data) => {
    const {
      addPayment,
      addNote,
      match: { params: { id: uuid } },
      notify,
      onSuccess,
      onCloseModal,
    } = this.props;

    const variables = {
      ...data,
      profileUUID: uuid,
    };

    try {
      const { data: { payment: { createPayment } } } = await addPayment({ variables });
      const note = this.noteButton.getNote();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION_SUCCESS'),
      });

      if (note) {
        await addNote({ variables: { ...note, targetUUID: createPayment.paymentId } });
      }

      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);
      const { code, defaultMessage } = error.errors[0] || {};

      if (defaultMessage === 'error.validation.invalid.amount' && code) {
        this.setState({ errorMessage: I18n.t(`error.validation.invalid.amount.${code}`) });

        notify({
          level: 'error',
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t(`error.validation.invalid.amount.${code}`),
        });

        return;
      }

      this.setState({ errorMessage: error.message });

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: error.message || I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION_FAIL'),
      });
    }
  };

  getSourceAccount = ({ accountUUID, source }) => {
    const { tradingAccounts } = this.props.profile;

    return tradingAccounts.find(account => [accountUUID, source].includes(account.accountUUID));
  };

  handlePaymentTypeChanged = (value, { setFieldValue, resetForm }) => {
    this.resetErrorMessage();
    resetForm();
    setFieldValue('paymentType', value);
  };

  isValidTransaction = ({
    paymentType,
    accountUUID,
    amount,
  }) => {
    const {
      profile: {
        tradingAccounts,
      },
    } = this.props;

    if (paymentType === 'WITHDRAW' && accountUUID && amount && tradingAccounts.length) {
      const { balance } = tradingAccounts.find(account => account.accountUUID === accountUUID);

      return balance >= amount;
    }

    if (paymentType === 'CREDIT_OUT' && accountUUID && amount && tradingAccounts.length) {
      const { credit } = tradingAccounts.find(account => account.accountUUID === accountUUID);

      return credit >= amount;
    }

    return true;
  };

  render() {
    const {
      onCloseModal,
      profile: {
        uuid,
        tradingAccounts,
      },
      permission: {
        permissions,
      },
      manualPaymentMethods: {
        data: manualPaymentMethodsData,
        loading: manualMethodsLoading,
      },
    } = this.props;
    const { errorMessage } = this.state;

    const manualMethods = manualPaymentMethodsData?.manualPaymentMethods || [];

    return (
      <Modal contentClassName="AddPaymentModal" toggle={onCloseModal} isOpen>
        <Formik
          initialValues={{}}
          validate={values => validation(values, tradingAccounts)}
          onSubmit={this.onSubmit}
        >
          {({
            isSubmitting,
            dirty,
            isValid,
            values,
            values: { paymentType },
            setFieldValue,
            resetForm,
          }) => {
            const sourceAccount = this.getSourceAccount(values);
            const paymentMethods = paymentType === paymentTypes.CREDIT_IN.name
              ? ['REFERRAL_BONUS', 'INTERNAL_TRANSFER']
              : manualMethods;

            return (
              <Form>
                <ModalHeader toggle={onCloseModal}>
                  {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.TITLE')}
                </ModalHeader>
                <ModalBody>
                  <If condition={errorMessage}>
                    <span className="AddPaymentModal__error-message">{errorMessage}</span>
                  </If>
                  <Field
                    name="paymentType"
                    label={attributeLabels.paymentType}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    component={FormikSelectField}
                    customOnChange={value => (
                      this.handlePaymentTypeChanged(value, { setFieldValue, resetForm })
                    )}
                    showErrorMessage={false}
                  >
                    {Object
                      .values(paymentTypes)
                      .filter(({ permission }) => (new Permissions(permission)).check(permissions))
                      .map(({ name }) => (
                        <option key={name} value={name}>
                          {I18n.t(paymentTypesLabels[name].label)}
                        </option>
                      ))}
                  </Field>
                  <div
                    className={classNames('AddPaymentModal__payment-fields', {
                      'AddPaymentModal__payment-fields--visible': paymentType,
                    })}
                  >
                    <div className="AddPaymentModal__row AddPaymentModal__row--v-align-center">
                      <Choose>
                        <When
                          condition={[paymentTypes.DEPOSIT.name, paymentTypes.CREDIT_IN.name].includes(paymentType)}
                        >
                          <Field
                            name="paymentMethod"
                            label={attributeLabels.paymentMethod}
                            className="AddPaymentModal__field"
                            placeholder={I18n.t(
                              'PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.CHOOSE_PAYMENT_METHOD_LABEL',
                            )}
                            disabled={manualMethodsLoading}
                            component={FormikSelectField}
                            showErrorMessage={false}
                          >
                            {paymentMethods.map(item => (
                              <option key={item} value={item}>
                                {manualPaymentMethodsLabels[item]
                                  ? I18n.t(manualPaymentMethodsLabels[item])
                                  : item
                                }
                              </option>
                            ))}
                          </Field>
                          <div className="AddPaymentModal__direction-icon">
                            <i className="icon-arrow-down" />
                          </div>
                          <AccountsSelectField
                            className="AddPaymentModal__field"
                            name="accountUUID"
                            label="toAcc"
                            values={values}
                            tradingAccounts={tradingAccounts}
                          />
                        </When>
                        <When condition={paymentType === paymentTypes.WITHDRAW.name}>
                          <AccountsSelectField
                            className="AddPaymentModal__field"
                            name="accountUUID"
                            label="fromAcc"
                            values={values}
                            tradingAccounts={tradingAccounts}
                          />
                        </When>
                        <When condition={paymentType === paymentTypes.TRANSFER.name}>
                          <AccountsSelectField
                            className="AddPaymentModal__field"
                            name="source"
                            label="fromAcc"
                            values={values}
                            tradingAccounts={tradingAccounts}
                          />
                          <div className="AddPaymentModal__direction-icon">
                            <i className="icon-arrow-down" />
                          </div>
                          <AccountsSelectField
                            className="AddPaymentModal__field"
                            name="target"
                            label="toAcc"
                            values={values}
                            tradingAccounts={tradingAccounts}
                          />
                        </When>
                        <When condition={paymentType === paymentTypes.CREDIT_IN.name}>
                          <AccountsSelectField
                            className="AddPaymentModal__field"
                            name="accountUUID"
                            label="toAcc"
                            values={values}
                            tradingAccounts={tradingAccounts}
                          />
                        </When>
                        <When condition={paymentType === paymentTypes.CREDIT_OUT.name}>
                          <AccountsSelectField
                            className="AddPaymentModal__field"
                            name="accountUUID"
                            label="fromAcc"
                            values={values}
                            tradingAccounts={tradingAccounts}
                          />
                        </When>
                      </Choose>
                    </div>
                    <div className="AddPaymentModal__row">
                      <Field
                        name="amount"
                        type="number"
                        label={attributeLabels.amount}
                        className="AddPaymentModal__field AddPaymentModal__field--small"
                        placeholder="0.00"
                        step="0.01"
                        min={0}
                        max={999999}
                        addition={sourceAccount && <Currency code={sourceAccount.currency} showSymbol />}
                        component={FormikInputField}
                        showErrorMessage={false}
                      />
                      <If condition={paymentType === paymentTypes.DEPOSIT.name}>
                        <Field
                          name="externalReference"
                          type="text"
                          label={attributeLabels.externalReference}
                          className="AddPaymentModal__field"
                          component={FormikInputField}
                          showErrorMessage={false}
                        />
                      </If>
                      <If condition={paymentType === paymentTypes.CREDIT_IN.name}>
                        <Field
                          name="expirationDate"
                          label={attributeLabels.expirationDate}
                          className="AddPaymentModal__field"
                          component={FormikDatePicker}
                          showErrorMessage={false}
                          withTime
                          withUtc
                        />
                      </If>
                    </div>
                    <div className="AddPaymentModal__row AddPaymentModal__row--h-align-center">
                      <NoteButton
                        manual
                        ref={(ref) => { this.noteButton = ref; }}
                        placement="bottom"
                        playerUUID={uuid}
                        targetUUID={uuid}
                        targetType={targetTypes.PAYMENT}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="AddPaymentModal__footer">
                  <div className="AddPaymentModal__footer-message">
                    <strong>
                      {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.ATTENTION_UNDONE_ACTION_LABEL')}
                    </strong>
                    {': '}
                    {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.ATTENTION_UNDONE_ACTION')}
                  </div>
                  <div className="AddPaymentModal__buttons">
                    <Button
                      className="AddPaymentModal__button"
                      onClick={onCloseModal}
                      commonOutline
                    >
                      {I18n.t('COMMON.CANCEL')}
                    </Button>
                    <Button
                      className="AddPaymentModal__button"
                      disabled={!dirty || isSubmitting || !isValid || !this.isValidTransaction(values)}
                      type="submit"
                      primary
                    >
                      {I18n.t('COMMON.CONFIRM')}
                    </Button>
                  </div>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withPermission,
  withRouter,
  withRequests({
    manualPaymentMethods: ManualPaymentMethodsQuery,
    addPayment: AddPayment,
    addNote: AddNote,
  }),
)(AddPaymentModal);
