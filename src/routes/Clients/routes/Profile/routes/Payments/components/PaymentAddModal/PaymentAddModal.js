import React, { Fragment, PureComponent } from 'react';
import { get } from 'lodash';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withPermission } from 'providers/PermissionsProvider';
import { withNotifications } from 'hoc';
import Badge from 'components/Badge';
import NoteButton from 'components/NoteButton';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { manualPaymentMethodsLabels } from 'constants/payment';
import { accountTypesLabels } from 'constants/accountTypes';
import { Button } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDatePicker } from 'components/Formik';
import Currency from 'components/Amount/Currency';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Permissions from 'utils/permissions';
import { validation } from './utils';
import { paymentTypes, paymentTypesLabels, attributeLabels, paymentErrors } from './constants';
import { ManualPaymentMethodsQuery, AddNote, AddPayment } from './graphql';
import './PaymentAddModal.scss';

class PaymentAddModal extends PureComponent {
  static propTypes = {
    manualPaymentMethods: PropTypes.query({
      manualPaymentMethods: PropTypes.response(PropTypes.paymentMethods),
    }).isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    newProfile: PropTypes.newProfile.isRequired,
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
    } = this.props;

    const variables = {
      ...data,
      profileUUID: uuid,
    };

    const { data: { payment: { createClientPayment: { data: payment, error } } } } = await addPayment({ variables });

    if (error) {
      const defaultErrorMessage = I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION_FAIL');
      const errorMessage = paymentErrors[error.error] || defaultErrorMessage;

      this.setState({ errorMessage });

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: defaultErrorMessage,
      });
    } else {
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION_SUCCESS'),
      });
      const { onSuccess, onCloseModal } = this.props;
      const note = this.noteButton.getNote();

      if (note) {
        await addNote({ variables: { ...note, targetUUID: payment.paymentId } });
      }

      onCloseModal();
      onSuccess();
    }
  };

  getSourceAccount = ({ accountUUID, source }) => {
    const { tradingAccount } = this.props.newProfile;

    return tradingAccount.find(account => [accountUUID, source].includes(account.accountUUID));
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
      newProfile: {
        tradingAccount,
      },
    } = this.props;

    if (paymentType === 'WITHDRAW' && accountUUID && amount && tradingAccount.length) {
      const { balance } = tradingAccount.find(account => account.accountUUID === accountUUID);

      return balance >= amount;
    }

    if (paymentType === 'CREDIT_OUT' && accountUUID && amount && tradingAccount.length) {
      const { credit } = tradingAccount.find(account => account.accountUUID === accountUUID);

      return credit >= amount;
    }

    return true;
  };

  renderAccountSelectOption = (
    name, { paymentType, amount },
  ) => (
    { onClick, account = {}, forwardedRef },
  ) => {
    const isInsufficientBalance = (
      parseFloat(account.balance) < amount
      && [paymentTypes.WITHDRAW.name, paymentTypes.TRANSFER.name].includes(paymentType)
      && name !== 'target'
    );

    const isInsufficientCredit = (
      parseFloat(account.credit) < amount
      && [paymentTypes.CREDIT_OUT.name].includes(paymentType)
    );

    return (
      <div
        ref={forwardedRef}
        className="value-wrapper"
        onClick={isInsufficientBalance || isInsufficientCredit ? () => {} : onClick}
      >
        <div className="header-block-middle">
          <Badge
            center
            text={I18n.t(accountTypesLabels[account.accountType].label)}
            info={account.accountType === 'DEMO'}
            success={account.accountType === 'LIVE'}
          >
            {account.name}
          </Badge>
        </div>
        <div className="header-block-small">
          <PlatformTypeBadge center platformType={account.platformType}>
            {account.login}
          </PlatformTypeBadge>
          <div className={classNames({ 'color-danger': Number(account.balance) === 0 })}>
            {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.BALANCE')}: {account.currency} {account.balance}
          </div>
          <div>{I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.GROUP')}: {account.group}</div>
          <If condition={[paymentTypes.CREDIT_IN.name, paymentTypes.CREDIT_OUT.name].includes(paymentType)}>
            <div className={classNames({ 'color-danger': Number(account.credit) === 0 })}>
              {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.CREDIT')}: {account.currency} {account.credit}
            </div>
          </If>
        </div>
        <If condition={isInsufficientBalance || isInsufficientCredit}>
          <div className="color-danger">
            {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_MONEY')}
          </div>
        </If>
      </div>
    );
  };

  renderAccountSelectField = ({ label, name, className, values }) => {
    const {
      newProfile: {
        tradingAccount,
      },
    } = this.props;

    const {
      paymentType,
    } = values;

    const fieldName = name || 'accountUUID';

    return (
      <Field
        className={`${className || 'col'} select-field-wrapper`}
        name={fieldName}
        label={attributeLabels[label || 'fromAcc']}
        placeholder={tradingAccount.length === 0
          ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
          : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
        }
        disabled={tradingAccount.length === 0}
        showErrorMessage={false}
        singleOptionComponent={this.renderAccountSelectOption(name, values)}
        component={FormikSelectField}
      >
        {tradingAccount
          .filter(account => (
            !account.archived && !(
              account.accountType === 'DEMO'
                && [
                  paymentTypes.CREDIT_IN.name,
                  paymentTypes.CREDIT_OUT.name,
                  paymentTypes.TRANSFER.name,
                  paymentTypes.WITHDRAW.name,
                ].includes(paymentType)
            )
          ))
          .map(account => (
            <option key={account.accountUUID} value={account.accountUUID} account={account}>
              {`${account.login}`}
            </option>
          ))}
      </Field>
    );
  };

  render() {
    const {
      onCloseModal,
      newProfile: {
        uuid,
        tradingAccount,
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

    const manualMethods = get(manualPaymentMethodsData, 'manualPaymentMethods.data') || [];
    const manualMethodsError = get(manualPaymentMethodsData, 'manualPaymentMethods.error');

    return (
      <Modal contentClassName="payment-modal" toggle={onCloseModal} isOpen>
        <Formik
          initialValues={{}}
          validate={values => validation(values, tradingAccount)}
          onSubmit={this.onSubmit}
        >
          {({
            isSubmitting,
            dirty,
            isValid,
            values,
            setFieldValue,
            resetForm,
          }) => {
            const sourceAccount = this.getSourceAccount(values);

            return (
              <Form>
                <ModalHeader toggle={onCloseModal}>
                  {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.TITLE')}
                </ModalHeader>
                <ModalBody className="container-fluid">
                  <If condition={errorMessage}>
                    <span className="transaction-error">{errorMessage}</span>
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
                  <div className={`payment-fields ${(values && values.paymentType) ? 'visible' : ''}`}>
                    <div className="form-row align-items-center">
                      <Choose>
                        <When condition={values.paymentType === paymentTypes.DEPOSIT.name}>
                          <Fragment>
                            <Field
                              className="col select-field-wrapper"
                              name="paymentMethod"
                              label={attributeLabels.paymentMethod}
                              placeholder={I18n.t(
                                'PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.CHOOSE_PAYMENT_METHOD_LABEL',
                              )}
                              showErrorMessage={false}
                              disabled={manualMethodsLoading || manualMethodsError}
                              component={FormikSelectField}
                            >
                              {manualMethods.map(item => (
                                <option key={item} value={item}>
                                  {manualPaymentMethodsLabels[item]
                                    ? I18n.t(manualPaymentMethodsLabels[item])
                                    : item
                                  }
                                </option>
                              ))}
                            </Field>
                            <div className="col-auto arrow-icon-wrapper">
                              <i className="icon-arrow-down" />
                            </div>
                            {this.renderAccountSelectField({ label: 'toAcc', values })}
                          </Fragment>
                        </When>
                        <When condition={values.paymentType === paymentTypes.WITHDRAW.name}>
                          {this.renderAccountSelectField({ values })}
                        </When>
                        <When condition={values.paymentType === paymentTypes.TRANSFER.name}>
                          <Fragment>
                            {this.renderAccountSelectField({ name: 'source', values })}
                            <div className="col-auto arrow-icon-wrapper">
                              <i className="icon-arrow-down" />
                            </div>
                            {this.renderAccountSelectField({ label: 'toAcc', name: 'target', values })}
                          </Fragment>
                        </When>
                        <When condition={values.paymentType === paymentTypes.CREDIT_IN.name}>
                          {this.renderAccountSelectField({ label: 'toAcc', values })}
                        </When>
                        <When condition={values.paymentType === paymentTypes.CREDIT_OUT.name}>
                          {this.renderAccountSelectField({ label: 'fromAcc', values })}
                        </When>
                      </Choose>
                    </div>
                    <div className="row">
                      <Field
                        className="col-4"
                        name="amount"
                        label={attributeLabels.amount}
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min={0}
                        max={999999}
                        addition={sourceAccount && <Currency code={sourceAccount.currency} showSymbol />}
                        component={FormikInputField}
                        showErrorMessage={false}
                      />
                      <If condition={values && values.paymentType === paymentTypes.DEPOSIT.name}>
                        <Field
                          className="col-8"
                          name="externalReference"
                          type="text"
                          label={attributeLabels.externalReference}
                          component={FormikInputField}
                          showErrorMessage={false}
                        />
                      </If>
                      <If condition={values && values.paymentType === paymentTypes.CREDIT_IN.name}>
                        <FormikDatePicker
                          className="col-5"
                          name="expirationDate"
                          label={attributeLabels.expirationDate}
                          closeOnSelect={false}
                          showErrorMessage={false}
                          withTime
                        />
                      </If>
                    </div>
                    <div className="form-row justify-content-center">
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
                <ModalFooter>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col text-muted font-size-12 text-left">
                        <span className="font-weight-700">
                          {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.ATTENTION_UNDONE_ACTION_LABEL')}
                        </span>
                        {': '}
                        {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.ATTENTION_UNDONE_ACTION')}
                      </div>
                      <div className="col">
                        <Button
                          onClick={onCloseModal}
                          commonOutline
                        >
                          {I18n.t('COMMON.CANCEL')}
                        </Button>
                        <Button
                          className="margin-left-25"
                          disabled={!dirty || isSubmitting || !isValid || !this.isValidTransaction(values)}
                          type="submit"
                          primary
                        >
                          {I18n.t('COMMON.CONFIRM')}
                        </Button>
                      </div>
                    </div>
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
)(PaymentAddModal);
