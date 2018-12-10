import React, { Component } from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { get } from 'lodash';
import classNames from 'classnames';
import I18n from '../../../../../../../../../../utils/i18n';
import { createValidator } from '../../../../../../../../../../utils/validator';
import { InputField, NasSelectField, DateTimeField } from '../../../../../../../../../../components/ReduxForm';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import {
  types as paymentTypes,
  typesLabels,
  manualPaymentMethods,
  manualPaymentMethodsLabels,
} from '../../../../../../../../../../constants/payment';
import Currency from '../../../../../../../../../../components/Amount/Currency';
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

class PaymentAddModal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onManageNote: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    currentValues: PropTypes.shape({
      paymentType: PropTypes.string,
      amount: PropTypes.string,
      fromMt4Acc: PropTypes.string,
      toMt4Acc: PropTypes.string,
    }),
    playerProfile: PropTypes.object.isRequired,
    error: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    reset: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
  };

  static defaultProps = {
    submitting: false,
    pristine: false,
    currentValues: {},
    error: [],
  };

  getNotePopoverParams = () => ({
    placement: 'bottom',
    onSubmit: this.handleSubmitNote,
    onDelete: this.handleDeleteNote,
  });

  handleSubmitNote = (data) => {
    this.props.onManageNote(data);
    this.context.hidePopover();
  };

  handleDeleteNote = () => {
    this.props.onManageNote(null);
    this.context.hidePopover();
  };

  handlePaymentTypeChanged = (value) => {
    const { change, reset } = this.props;

    reset();
    change('paymentType', value);
  }

  renderMt4SelectOption = name => ({ onClick, mt4 = {} }) => {
    const { currentValues: { paymentType, amount } } = this.props;
    const notEnoughBalance = parseFloat(mt4.balance) < amount;
    const warningMessage = (
      [paymentTypes.Deposit, paymentTypes.CREDIT_IN].indexOf(paymentType) === -1
      && name !== 'target'
    );

    return (
      <div
        key={mt4.login}
        className="value-wrapper"
        onClick={notEnoughBalance && warningMessage ? () => {} : onClick}
      >
        <div className="header-block-middle">
          {mt4.name}
          <If condition={warningMessage && notEnoughBalance}>
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
          <If condition={[paymentTypes.CREDIT_IN, paymentTypes.CREDIT_OUT].includes(paymentType)}>
            <div className={classNames({ 'color-danger': Number(mt4.credit) === 0 })}>
              {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.CREDIT')}: {mt4.symbol} {mt4.credit}
            </div>
          </If>
        </div>
      </div>
    );
  };

  renderMt4SelectField = (label, name, className) => {
    const { playerProfile: { tradingProfile } } = this.props;
    const mt4Users = get(tradingProfile, 'mt4Users') || [];

    return (
      <Field
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
        {mt4Users.map(acc => (
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
      onSubmit,
      handleSubmit,
      pristine,
      submitting,
      invalid,
      playerProfile: {
        currencyCode,
      },
      currentValues,
      error: errors,
    } = this.props;

    return (
      <Modal contentClassName="payment-modal" toggle={onCloseModal} isOpen>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.TITLE')}
        </ModalHeader>
        <ModalBody tag="form" id="new-transaction" className="container-fluid" onSubmit={handleSubmit(onSubmit)}>

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
            {Object.values(paymentTypes).map(type => (
              <option key={type} value={type}>
                {I18n.t(typesLabels[type])}
              </option>
            ))}
          </Field>
          <div className={`payment-fields ${(currentValues && currentValues.paymentType) ? 'visible' : ''}`}>
            <div className="row">
              <Field
                name="amount"
                label={attributeLabels.amount}
                type="text"
                placeholder="0.00"
                className="col-4"
                inputAddon={
                  <Currency
                    code={currencyCode}
                    showSymbol={false}
                  />
                }
                currencyCode={currencyCode}
                showErrorMessage={false}
                component={InputField}
              />
              <If condition={currentValues && currentValues.paymentType === paymentTypes.Deposit}>
                <Field
                  name="externalReference"
                  type="text"
                  className="col-8"
                  label={I18n.t(attributeLabels.externalReference)}
                  component={InputField}
                  position="vertical"
                />
              </If>
              <If condition={currentValues && currentValues.paymentType === paymentTypes.CREDIT_IN}>
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
            <div className="form-row align-items-center">
              <Choose>
                <When condition={currentValues.paymentType === paymentTypes.Deposit}>
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
                <When condition={currentValues.paymentType === paymentTypes.Withdraw}>
                  {this.renderMt4SelectField()}
                </When>
                <When condition={currentValues.paymentType === paymentTypes.Confiscate}>
                  {this.renderMt4SelectField()}
                </When>
                <When condition={currentValues.paymentType === paymentTypes.Transfer}>
                  {this.renderMt4SelectField('', 'source')}
                  <div className="col-auto arrow-icon-wrapper">
                    <i className="icon-arrow-down" />
                  </div>
                  {this.renderMt4SelectField('toMt4Acc', 'target')}
                </When>
                <When condition={currentValues.paymentType === paymentTypes.CREDIT_IN}>
                  {this.renderMt4SelectField('toMt4Acc')}
                </When>
                <When condition={currentValues.paymentType === paymentTypes.CREDIT_OUT}>
                  {this.renderMt4SelectField('fromMt4Acc')}
                </When>
              </Choose>
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
                  type="reset"
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
    { playerProfile: { tradingProfile: { mt4Users } }, currentValues }
  ) => {
    let rules = {
      paymentType: 'required|string',
      amount: 'required|numeric',
      externalReference: 'required|string',
    };

    if ((data.paymentType === paymentTypes.Withdraw
        || data.paymentType === paymentTypes.CREDIT_OUT
        || data.paymentType === paymentTypes.Confiscate)
        && currentValues.login
        && currentValues.amount
        && Number(mt4Users.find(({ login }) => login === currentValues.login).balance) < currentValues.amount) {
      // make fake error to prevent submit when no funds on account
      return { login: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.MT4_NO_MONEY') };
    }

    if (data.paymentType === paymentTypes.Deposit) {
      rules = { ...rules, paymentMethod: 'required|string' };
    }

    if (data.paymentType === paymentTypes.CREDIT_IN) {
      rules = { ...rules, expirationDate: 'required|string' };
    }

    if (data.paymentType === paymentTypes.Transfer) {
      rules = {
        ...rules,
        source: 'required|string',
        target: 'required|string',
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
      rules = { ...rules, login: 'required|string' };
    }

    return createValidator(rules, attributeLabels, false)(data);
  },
})(PaymentAddModal);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(Form);
