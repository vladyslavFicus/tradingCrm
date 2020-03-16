import React, { PureComponent } from 'react';
import { Field } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { get } from 'lodash';
import classNames from 'classnames';
import I18n from 'i18n-js';
import Badge from 'components/Badge';
import NoteButton from 'components/NoteButton';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { manualPaymentMethodsLabels } from 'constants/payment';
import { accountTypesLabels } from 'constants/accountTypes';
import { InputField, NasSelectField, DateTimeField } from 'components/ReduxForm';
import Currency from 'components/Amount/Currency';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Permissions from 'utils/permissions';
import { floatNormalize } from 'utils/inputNormalize';
import { paymentTypes, paymentTypesLabels, attributeLabels } from './constants';
import './PaymentAddModal.scss';

class PaymentAddModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    currentValues: PropTypes.shape({
      paymentType: PropTypes.string,
      amount: PropTypes.number,
      fromAcc: PropTypes.string,
      toAcc: PropTypes.string,
    }),
    newProfile: PropTypes.newProfile,
    error: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    reset: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    manualPaymentMethods: PropTypes.shape({
      manualPaymentMethods: PropTypes.shape({
        data: PropTypes.paymentMethods,
        error: PropTypes.object,
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    submitting: false,
    pristine: false,
    newProfile: {},
    error: [],
    currentValues: {
      paymentType: '',
      accountUUID: '',
      amount: null,
    },
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

  handlePaymentTypeChanged = (value) => {
    const { change, reset } = this.props;

    reset();
    change('paymentType', value);
  };

  isValidTransaction = () => {
    const {
      currentValues: {
        paymentType,
        accountUUID,
        amount,
      },
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

  renderAccountSelectOption = name => ({ onClick, account = {} }) => {
    const { currentValues: { paymentType, amount } } = this.props;

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
        key={account.login}
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

  renderAccountSelectField = (label, name, className) => {
    const {
      newProfile: {
        tradingAccount,
      },
      currentValues: {
        paymentType,
      },
    } = this.props;

    return (
      <Field
        key={name || 'accountUUID'}
        name={name || 'accountUUID'}
        label={attributeLabels[label || 'fromAcc']}
        component={NasSelectField}
        placeholder={tradingAccount.length === 0
          ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
          : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
        }
        disabled={tradingAccount.length === 0}
        className={`${className || 'col'} select-field-wrapper`}
        searchable={false}
        showErrorMessage={false}
        singleOptionComponent={this.renderAccountSelectOption(name)}
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
      handleSubmit,
      pristine,
      submitting,
      invalid,
      newProfile: {
        uuid,
      },
      permission: {
        permissions,
      },
      currentValues,
      error: errors,
      manualPaymentMethods: {
        manualPaymentMethods,
        loading: manualMethodsLoading,
      },
    } = this.props;

    const manualMethods = get(manualPaymentMethods, 'data') || [];
    const manualMethodsError = get(manualPaymentMethods, 'error');

    const sourceAccount = this.getSourceAccount(currentValues);

    return (
      <Modal contentClassName="payment-modal" toggle={onCloseModal} isOpen>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.TITLE')}
        </ModalHeader>

        <ModalBody tag="form" id="new-transaction" className="container-fluid" onSubmit={handleSubmit(this.onSubmit)}>

          <If condition={errors.length}>
            <div className="alert alert-warning">
              {I18n.t('error.internal')}
            </div>
          </If>

          <Field
            name="paymentType"
            label={attributeLabels.paymentType}
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            component={NasSelectField}
            onFieldChange={this.handlePaymentTypeChanged}
            searchable={false}
            showErrorMessage={false}
          >
            {Object
              .entries(paymentTypes)
              .filter(([, { permission }]) => (new Permissions(permission)).check(permissions))
              .map(([key]) => (
                <option key={key} value={key}>
                  {I18n.t(paymentTypesLabels[key].label)}
                </option>
              ))}
          </Field>
          <div className={`payment-fields ${(currentValues && currentValues.paymentType) ? 'visible' : ''}`}>
            <div className="form-row align-items-center">
              <Choose>

                <When condition={currentValues.paymentType === paymentTypes.DEPOSIT.name}>
                  <Field
                    name="paymentMethod"
                    label={attributeLabels.paymentMethod}
                    placeholder={I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.CHOOSE_PAYMENT_METHOD_LABEL')}
                    component={NasSelectField}
                    className="col select-field-wrapper"
                    searchable={false}
                    showErrorMessage={false}
                    disabled={manualMethodsLoading || manualMethodsError}
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
                  {this.renderAccountSelectField('toAcc')}
                </When>

                <When condition={currentValues.paymentType === paymentTypes.WITHDRAW.name}>
                  {this.renderAccountSelectField()}
                </When>

                <When condition={currentValues.paymentType === paymentTypes.TRANSFER.name}>
                  {this.renderAccountSelectField('', 'source')}
                  <div className="col-auto arrow-icon-wrapper">
                    <i className="icon-arrow-down" />
                  </div>
                  {this.renderAccountSelectField('toAcc', 'target')}
                </When>

                <When condition={currentValues.paymentType === paymentTypes.CREDIT_IN.name}>
                  {this.renderAccountSelectField('toAcc')}
                </When>

                <When condition={currentValues.paymentType === paymentTypes.CREDIT_OUT.name}>
                  {this.renderAccountSelectField('fromAcc')}
                </When>
              </Choose>
            </div>
            <div className="row">
              <Field
                name="amount"
                label={attributeLabels.amount}
                type="number"
                placeholder="0.00"
                step="0.01"
                className="col-4"
                normalize={floatNormalize}
                inputAddon={sourceAccount && <Currency code={sourceAccount.currency} showSymbol={false} />}
                component={InputField}
              />
              <If condition={currentValues && currentValues.paymentType === paymentTypes.DEPOSIT.name}>
                <Field
                  name="externalReference"
                  type="text"
                  className="col-8"
                  label={attributeLabels.externalReference}
                  component={InputField}
                  position="vertical"
                />
              </If>
              <If condition={currentValues && currentValues.paymentType === paymentTypes.CREDIT_IN.name}>
                <Field
                  withTime
                  closeOnSelect={false}
                  name="expirationDate"
                  type="text"
                  className="col-5"
                  label={attributeLabels.expirationDate}
                  component={DateTimeField}
                  position="vertical"
                  isValidDate={() => true}
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
                <button
                  type="button"
                  className="btn btn-default-outline text-uppercase"
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.CANCEL')}
                </button>
                <button
                  disabled={pristine || submitting || invalid || !this.isValidTransaction()}
                  type="submit"
                  className="btn btn-primary text-uppercase margin-left-25"
                  form="new-transaction"
                >
                  {I18n.t('COMMON.CONFIRM')}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default PaymentAddModal;
