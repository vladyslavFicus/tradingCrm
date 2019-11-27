import React, { PureComponent } from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { get } from 'lodash';
import classNames from 'classnames';
import I18n from 'i18n-js';
import Badge from 'components/Badge';
import NoteButton from 'components/NoteButton';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { manualPaymentMethods, manualPaymentMethodsLabels } from 'constants/payment';
import { accountTypesLabels } from 'constants/accountTypes';
import { InputField, NasSelectField, DateTimeField } from 'components/ReduxForm';
import Currency from 'components/Amount/Currency';
import Permissions from 'utils/permissions';
import { floatNormalize } from 'utils/inputNormalize';
import { createValidator } from 'utils/validator';
import { paymentMethods, paymentMethodsLabels } from './constants';
import './PaymentAddModal.scss';

const attributeLabels = {
  paymentType: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TYPE'),
  amount: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.AMOUNT'),
  paymentAccount: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_ACCOUNT'),
  externalReference: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXTERNAL_REF'),
  expirationDate: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXPIRATION_DATE'),
  fromMt4Acc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.FROM_MT4'),
  toMt4Acc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TO_MT4'),
};

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
      fromMt4Acc: PropTypes.string,
      toMt4Acc: PropTypes.string,
    }),
    playerProfile: PropTypes.object.isRequired,
    error: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    reset: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  };

  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };

  static defaultProps = {
    submitting: false,
    pristine: false,
    currentValues: {},
    error: [],
  };

  onSubmit = async (data) => {
    await this.props.onSubmit({
      ...data,
      note: this.noteButton.getNote(),
    });
  };

  getSourceAccount = ({ login, source }) => {
    const mt4Accounts = this.props.playerProfile.tradingProfile.mt4Users || [];

    return mt4Accounts.find(account => [login, source].includes(account.login));
  };

  handlePaymentTypeChanged = (value) => {
    const { change, reset } = this.props;

    reset();
    change('paymentType', value);
  };

  renderMt4SelectOption = name => ({ onClick, mt4 = {} }) => {
    const { currentValues: { paymentType, amount } } = this.props;

    const isInsufficientBalance = (
      parseFloat(mt4.balance) < amount
      && [paymentMethods.WITHDRAW.name, paymentMethods.TRANSFER.name].includes(paymentType)
      && name !== 'target'
    );

    const isInsufficientCredit = (
      parseFloat(mt4.credit) < amount
      && [paymentMethods.CREDIT_OUT.name].includes(paymentType)
    );

    return (
      <div
        key={mt4.login}
        className="value-wrapper"
        onClick={isInsufficientBalance || isInsufficientCredit ? () => {} : onClick}
      >
        <div className="header-block-middle">
          <Badge
            center
            text={I18n.t(accountTypesLabels[mt4.accountType].label)}
            info={mt4.accountType === 'DEMO'}
            success={mt4.accountType === 'LIVE'}
          >
            {mt4.name}
          </Badge>
          <If condition={isInsufficientBalance || isInsufficientCredit}>
            <span className="color-danger ml-2">
              {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.MT4_NO_MONEY')}
            </span>
          </If>
        </div>
        <div className="header-block-small">
          <div>MT4-ID {mt4.login}</div>
          <div className={classNames({ 'color-danger': Number(mt4.balance) === 0 })}>
            {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.BALANCE')}: {mt4.symbol} {mt4.balance}
          </div>
          <div>{I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.GROUP')}: {mt4.group}</div>
          <If condition={[paymentMethods.CREDIT_IN.name, paymentMethods.CREDIT_OUT.name].includes(paymentType)}>
            <div className={classNames({ 'color-danger': Number(mt4.credit) === 0 })}>
              {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.CREDIT')}: {mt4.symbol} {mt4.credit}
            </div>
          </If>
        </div>
      </div>
    );
  };

  renderMt4SelectField = (label, name, className) => {
    const {
      playerProfile: {
        tradingProfile,
      },
      currentValues: {
        paymentType,
      },
    } = this.props;
    const mt4Users = get(tradingProfile, 'mt4Users') || [];

    return (
      <Field
        key={name || 'login'}
        name={name || 'login'}
        label={I18n.t(attributeLabels[label || 'fromMt4Acc'])}
        component={NasSelectField}
        placeholder={mt4Users.length === 0
          ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
          : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
        }
        disabled={mt4Users.length === 0}
        className={`${className || 'col'} select-field-wrapper`}
        searchable={false}
        showErrorMessage={false}
        singleOptionComponent={this.renderMt4SelectOption(name)}
      >
        {mt4Users
          .filter(i => !i.archived && !(i.accountType === 'DEMO'
            && [
              paymentMethods.CREDIT_IN.name,
              paymentMethods.CREDIT_OUT.name,
              paymentMethods.TRANSFER.name,
              paymentMethods.WITHDRAW.name,
            ]
              .includes(paymentType)))
          .map(acc => (
            <option key={acc.login} value={acc.login} mt4={acc}>
              {`${acc.login}`}
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
      playerProfile: {
        playerUUID,
      },
      currentValues,
      error: errors,
    } = this.props;

    const sourceAccount = this.getSourceAccount(currentValues);

    return (
      <Modal contentClassName="payment-modal" toggle={onCloseModal} isOpen>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.TITLE')}
        </ModalHeader>
        <ModalBody tag="form" id="new-transaction" className="container-fluid" onSubmit={handleSubmit(this.onSubmit)}>

          <If condition={errors.length}>
            <For each="error" index="index" of={errors}>
              <div key={index} className="alert alert-warning">
                {I18n.t(get(error, 'error') ? error.error : error)}
              </div>
            </For>
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
              .entries(paymentMethods)
              .filter(([, { permission }]) => (new Permissions(permission)).check(this.context.permissions))
              .map(([key]) => (
                <option key={key} value={key}>
                  {I18n.t(paymentMethodsLabels[key].label)}
                </option>
              ))}
          </Field>
          <div className={`payment-fields ${(currentValues && currentValues.paymentType) ? 'visible' : ''}`}>
            <div className="form-row align-items-center">
              <Choose>
                <When condition={currentValues.paymentType === paymentMethods.DEPOSIT.name}>
                  <Field
                    name="paymentMethod"
                    label={attributeLabels.paymentAccount}
                    placeholder={I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.CHOOSE_PAYMENT_ACCOUNT_LABEL')}
                    component={NasSelectField}
                    className="col select-field-wrapper"
                    searchable={false}
                    showErrorMessage={false}
                  >
                    {Object.values(manualPaymentMethods).map(item => (
                      <option key={item} value={item}>
                        {I18n.t(manualPaymentMethodsLabels[item])}
                      </option>
                    ))}
                  </Field>
                  <div className="col-auto arrow-icon-wrapper">
                    <i className="icon-arrow-down" />
                  </div>
                  {this.renderMt4SelectField('toMt4Acc')}
                </When>
                <When condition={currentValues.paymentType === paymentMethods.WITHDRAW.name}>
                  {this.renderMt4SelectField()}
                </When>
                <When condition={currentValues.paymentType === paymentMethods.TRANSFER.name}>
                  {this.renderMt4SelectField('', 'source')}
                  <div className="col-auto arrow-icon-wrapper">
                    <i className="icon-arrow-down" />
                  </div>
                  {this.renderMt4SelectField('toMt4Acc', 'target')}
                </When>
                <When condition={currentValues.paymentType === paymentMethods.CREDIT_IN.name}>
                  {this.renderMt4SelectField('toMt4Acc')}
                </When>
                <When condition={currentValues.paymentType === paymentMethods.CREDIT_OUT.name}>
                  {this.renderMt4SelectField('fromMt4Acc')}
                </When>
              </Choose>
            </div>
            <div className="row">
              <Field
                name="amount"
                label={attributeLabels.amount}
                type="number"
                step="any"
                placeholder="0.00"
                className="col-4"
                normalize={floatNormalize}
                inputAddon={sourceAccount && <Currency code={sourceAccount.symbol} showSymbol={false} />}
                showErrorMessage={false}
                component={InputField}
              />
              <If condition={currentValues && currentValues.paymentType === paymentMethods.DEPOSIT.name}>
                <Field
                  name="externalReference"
                  type="text"
                  className="col-8"
                  label={I18n.t(attributeLabels.externalReference)}
                  component={InputField}
                  position="vertical"
                />
              </If>
              <If condition={currentValues && currentValues.paymentType === paymentMethods.CREDIT_IN.name}>
                <Field
                  withTime
                  closeOnSelect={false}
                  name="expirationDate"
                  type="text"
                  className="col-5"
                  label={I18n.t(attributeLabels.expirationDate)}
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
                playerUUID={playerUUID}
                noteTargetType={targetTypes.PAYMENT}
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
                  disabled={pristine || submitting || invalid}
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

const FORM_NAME = 'createPaymentForm';

const Form = reduxForm({
  form: FORM_NAME,
  initialValues: {
    paymentType: '',
  },
  validate: (
    data,
    { playerProfile: { tradingProfile: { mt4Users } }, currentValues },
  ) => {
    let rules = {
      paymentType: 'required|string',
      amount: 'required|numeric',
      externalReference: 'required|string',
    };

    if ([
      paymentMethods.WITHDRAW.name,
      paymentMethods.TRANSFER.name,
    ].includes(data.paymentType)
        && currentValues.login
        && currentValues.amount
        && Number(mt4Users.find(({ login }) => login === currentValues.login).balance) < currentValues.amount) {
      // make fake error to prevent submit when no funds on account
      return { login: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.MT4_NO_MONEY') };
    }

    if ([paymentMethods.CREDIT_OUT.name].includes(data.paymentType)
      && currentValues.login
      && currentValues.amount
      && Number(mt4Users.find(({ login }) => login === currentValues.login).credit) < currentValues.amount) {
      // make fake error to prevent submit when no credit funds on account
      return { login: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.MT4_NO_MONEY') };
    }

    if (data.paymentType === paymentMethods.DEPOSIT.name) {
      rules = { ...rules, paymentMethod: 'required|string' };
    }

    if (data.paymentType === paymentMethods.CREDIT_IN.name) {
      rules = { ...rules, expirationDate: 'required|string' };
    }

    if (data.paymentType === paymentMethods.TRANSFER.name) {
      rules = {
        ...rules,
        source: 'required|numeric',
        target: 'required|numeric',
      };

      if (currentValues
          && currentValues.source
          && currentValues.amount
          && Number(mt4Users.find(({ login }) => login === currentValues.source).balance) < currentValues.amount) {
        // make fake error to prevent submit when no funds on account
        return { source: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.MT4_NO_MONEY') };
      }

      if (currentValues
          && currentValues.source
          && currentValues.target
          && currentValues.source === currentValues.target) {
        return {
          source: I18n.t('COMMON.SOMETHING_WRONG'),
          target: I18n.t('COMMON.SOMETHING_WRONG'),
        };
      }
    } else {
      rules = { ...rules, login: 'required|numeric' };
    }

    return createValidator(rules, attributeLabels, false)(data);
  },
})(PaymentAddModal);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(Form);
