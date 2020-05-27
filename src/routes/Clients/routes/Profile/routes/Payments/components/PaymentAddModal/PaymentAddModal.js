/* eslint-disable */
import React, { Fragment, PureComponent } from 'react';
import { get } from 'lodash';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withPermission } from 'providers/PermissionsProvider';
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
import { paymentTypes, paymentTypesLabels, attributeLabels } from './constants';
import { ManualPaymentMethodsQuery } from './graphql';
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
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  };

  onSubmit = async (data) => {
    await this.props.onSubmit({
      ...data,
      note: this.noteButton.getNote(),
    });
  };

  getSourceAccount = ({ accountUUID, source }) => {
    const { tradingAccount } = this.props.newProfile;

    return tradingAccount.find(account => [accountUUID, source].includes(account.accountUUID));
  };

  handlePaymentTypeChanged = (value, formikAPI) => {
    const { setFieldValue, resetForm } = formikAPI;

    resetForm();
    setFieldValue('paymentType', value);
  };

  isValidTransaction = (values) => {
    const {
      newProfile: {
        tradingAccount,
      },
    } = this.props;

    const {
      paymentType,
      accountUUID,
      amount,
    } = values;

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

  renderAccountSelectOption = (name, values) => ({ onClick, account = {} }) => {
    const { paymentType, amount } = values;

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

    return (
      <Field
        className={`${className || 'col'} select-field-wrapper`}
        name={name || 'accountUUID'}
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

    const manualMethods = get(manualPaymentMethodsData, 'manualPaymentMethods.data') || [];
    const manualMethodsError = get(manualPaymentMethodsData, 'manualPaymentMethods.error');

    return (
      <Modal contentClassName="payment-modal" toggle={onCloseModal} isOpen>
        <Formik
          initialValues={{
            paymentType: '',
          }}
          validate={values => validation(values, tradingAccount)}
          onSubmit={this.onSubmit}
        >
          {({
            isSubmitting,
            pristine,
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
                              placeholder={I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.CHOOSE_PAYMENT_METHOD_LABEL')}
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
                        addition={sourceAccount && <Currency code={sourceAccount.currency} showSymbol={false} />}
                        component={FormikInputField}
                      />
                      <If condition={values && values.paymentType === paymentTypes.DEPOSIT.name}>
                        <Field
                          className="col-8"
                          name="externalReference"
                          type="text"
                          label={attributeLabels.externalReference}
                          component={FormikInputField}
                        />
                      </If>
                      <If condition={values && values.paymentType === paymentTypes.CREDIT_IN.name}>
                        <FormikDatePicker
                          className="col-5"
                          name="expirationDate"
                          label={attributeLabels.expirationDate}
                          closeOnSelect={false}
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
                          className="btn"
                          onClick={onCloseModal}
                          commonOutline
                        >
                          {I18n.t('COMMON.CANCEL')}
                        </Button>
                        <Button
                          className="btn margin-left-25"
                          disabled={pristine || isSubmitting || !isValid || !this.isValidTransaction(values)}
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
  withPermission,
  withRequests({
    manualPaymentMethods: ManualPaymentMethodsQuery,
  }),
)(PaymentAddModal);
