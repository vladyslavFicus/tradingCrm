import React, { Component } from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { get } from 'lodash';
import I18n from '../../../../../../../../../../utils/i18n';
import { createValidator } from '../../../../../../../../../../utils/validator';
import { InputField, NasSelectField } from '../../../../../../../../../../components/ReduxForm';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import { typesLabels } from '../../../../../../../../../../constants/payment';
import Currency from '../../../../../../../../../../components/Amount/Currency';
import './PaymentAddModal.scss';
import { paymentTypes, paymentAccounts } from './constants';

const attributeLabels = {
  paymentType: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TYPE'),
  amount: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.AMOUNT'),
  paymentAccount: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_ACCOUNT'),
  externalReference: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXTERNAL_REF'),
  fromMt4Acc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.FROM_MT4'),
  toMt4Acc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TO_MT4'),
};

class PaymentAddModal extends Component {
  static propTypes = {
    playerProfile: PropTypes.userProfile.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onManageNote: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    onLoadPaymentAccounts: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      paymentType: PropTypes.string,
      amount: PropTypes.string,
      paymentAccountUuid: PropTypes.string,
      fromMt4Acc: PropTypes.string,
      toMt4Acc: PropTypes.string,
    }),
    error: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    playerLimits: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.playerLimitEntity).isRequired,
      deposit: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      withdraw: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      error: PropTypes.object,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
    }).isRequired,
    mt4Accounts: PropTypes.arrayOf(PropTypes.mt4User),
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
    mt4Accounts: [],
  };

  state = {
    availablePaymentAccounts: [],
  };

  async componentWillMount() {
    const { onLoadPaymentAccounts, playerProfile: { currencyCode } } = this.props;

    const action = await onLoadPaymentAccounts();
    if (action && !action.error) {
      const availablePaymentAccounts = action.payload.map(account => ({
        uuid: account.uuid,
        currency: account.lastPayment && account.lastPayment.currency ?
          account.lastPayment.currency : currencyCode,
        label: account.details,
      }));

      this.setState({
        availablePaymentAccounts,
      });
    }
  }

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

  isPaymentMethodDisabled(type) {
    const { playerLimits } = this.props;
    let method = type.toLowerCase();

    if (method === paymentTypes.Confiscate) {
      method = 'withdraw';
    }

    return playerLimits[method] ? playerLimits[method].locked : false;
  }

  renderPaymentAccountField = () => {
    const { currentValues } = this.props;
    const { availablePaymentAccounts } = this.state;

    if (!currentValues || currentValues.paymentType !== paymentTypes.Withdraw) {
      return null;
    }

    const emptyOptionLabel = availablePaymentAccounts.length === 0
      ? I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_PAYMENT_ACCOUNTS_LABEL')
      : I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.CHOOSE_PAYMENT_ACCOUNT_LABEL');

    return (
      <Field
        name="paymentAccountUuid"
        label={attributeLabels.paymentAccount}
        placeholder={emptyOptionLabel}
        disabled={availablePaymentAccounts.length === 0}
        component={NasSelectField}
        className="col select-field-wrapper"
        showErrorMessage={false}
        searchable={false}
      >
        {availablePaymentAccounts.map(item => (
          <option key={item.uuid} value={item.uuid}>
            {item.label}
          </option>
        ))}
      </Field>
    );
  };

  renderMt4SelectField = (label, name, className) => (
    <Field
      name={name || 'login'}
      label={I18n.t(attributeLabels[label || 'fromMt4Acc'])}
      component={NasSelectField}
      placeholder={this.props.mt4Accounts.length === 0
        ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
        : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
      }
      disabled={this.props.mt4Accounts.length === 0}
      className={`${className || 'col'} select-field-wrapper`}
      searchable={false}
      showErrorMessage={false}
      singleOptionComponent={({ onClick, mt4 = {} }) => (
        <div key={mt4.login} className="value-wrapper" onClick={onClick}>
          <div className="header-block-middle">
            {mt4.login}
          </div>
          <div className="header-block-small">
            {mt4.symbol}
          </div>
        </div>
      )}
    >
      {this.props.mt4Accounts.map(acc => (
        <option key={acc.login} value={acc.login} mt4={acc}>
          {`${acc.login}`}
        </option>
      ))}
    </Field>
  )

  render() {
    const {
      onClose,
      onSubmit,
      handleSubmit,
      pristine,
      submitting,
      invalid,
      playerProfile,
      currentValues,
      error: errors,
    } = this.props;

    const filteredPaymentTypes = Object
      .keys(paymentTypes)
      .filter(type => !this.isPaymentMethodDisabled(type) && typesLabels[type]);

    return (
      <Modal contentClassName="payment-modal" toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>
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
            searchable={false}
            showErrorMessage={false}
          >
            {filteredPaymentTypes.map(type => (
              <option key={type} value={type}>
                {paymentTypes[type]}
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
                    code={playerProfile.currencyCode}
                    showSymbol={false}
                  />
                }
                currencyCode={playerProfile.currencyCode}
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
            </div>
            <div className="form-row">
              <Choose>
                <When condition={currentValues.paymentType === paymentTypes.Deposit}>
                  <Field
                    name="paymentAccount"
                    label={attributeLabels.paymentAccount}
                    placeholder={I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.CHOOSE_PAYMENT_ACCOUNT_LABEL')}
                    component={NasSelectField}
                    className="col select-field-wrapper"
                    searchable={false}
                    showErrorMessage={false}
                  >
                    {paymentAccounts.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Field>
                  <div className="col-auto arrow-icon-wrapper">
                    <i className="icon-arrow-down" />
                  </div>
                  {this.renderMt4SelectField()}
                </When>
                <When condition={currentValues.paymentType === paymentTypes.Withdraw}>
                  {this.renderMt4SelectField()}
                  <div className="col-auto arrow-icon-wrapper">
                    <i className="icon-arrow-down" />
                  </div>
                  {this.renderPaymentAccountField()}
                </When>
                <When condition={currentValues.paymentType === paymentTypes.Confiscate}>
                  {this.renderMt4SelectField('', '', 'col-6')}
                </When>
                <When condition={currentValues.paymentType === paymentTypes.Transfer}>
                  {this.renderMt4SelectField('', 'source')}
                  <div className="col-auto arrow-icon-wrapper">
                    <i className="icon-arrow-down" />
                  </div>
                  {this.renderMt4SelectField('toMt4Acc', 'target')}
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
                  onClick={onClose}
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
  validate: (data) => {
    let rules = {
      paymentType: 'required|string',
      amount: 'required|numeric',
      externalReference: 'required|string',
    };

    if (data.paymentType === paymentTypes.Withdraw
        || data.paymentType === paymentTypes.Deposit) {
      rules = { ...rules, paymentAccountUuid: 'required|string' };
    }

    if (data.paymentType === paymentTypes.Transfer) {
      rules = {
        ...rules,
        fromMt4Acc: 'required|numeric',
        toMt4Acc: 'required|numeric',
      };
    } else {
      rules = { ...rules, mt4Acc: 'required|numeric' };
    }

    return createValidator(rules, attributeLabels, false)(data);
  },
})(PaymentAddModal);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(Form);
