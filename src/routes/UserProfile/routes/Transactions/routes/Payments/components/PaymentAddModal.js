import React, { Component } from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../../../utils/validator';
import { SelectField, InputField } from '../../../../../../../components/ReduxForm';
import { shortify } from '../../../../../../../utils/uuid';
import Amount from '../../../../../../../components/Amount';
import NoteButton from '../../../../../../../components/NoteButton';
import {
  types as paymentTypes,
  manualTypesLabels as paymentTypesLabels,
} from '../../../../../../../constants/payment';
import { targetTypes } from '../../../../../../../constants/note';
import PropTypes from '../../../../../../../constants/propTypes';
import Currency from '../../../../../../../components/Amount/Currency';

const attributeLabels = {
  type: 'Payment Type',
  amount: 'Amount',
  paymentAccount: 'Payment account',
};

class PaymentAddModal extends Component {
  static propTypes = {
    playerProfile: PropTypes.userProfile.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onLoadPaymentAccounts: PropTypes.func.isRequired,
    onManageNote: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    currentValues: PropTypes.shape({
      type: PropTypes.string,
    }),
    note: PropTypes.noteEntity,
    error: PropTypes.string,
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
  };
  static defaultProps = {
    submitting: false,
    pristine: false,
    currentValues: {},
    note: null,
    error: '',
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
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

  handleNoteClick = (target) => {
    const { note } = this.props;
    if (note) {
      this.context.onEditNoteClick(target, note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(null, targetTypes.PAYMENT)(target, this.getNotePopoverParams());
    }
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

    if (!currentValues || currentValues.type !== paymentTypes.Withdraw) {
      return null;
    }

    const emptyOptionLabel = availablePaymentAccounts.length === 0
      ? I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_PAYMENT_ACCOUNTS_LABEL')
      : I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.CHOOSE_PAYMENT_ACCOUNT_LABEL');

    return (
      <div className="col">
        <Field
          name="paymentAccountUuid"
          label={attributeLabels.paymentAccount}
          type="text"
          component={SelectField}
          position="vertical"
          showErrorMessage={false}
        >
          <option value="">{emptyOptionLabel}</option>
          {
            availablePaymentAccounts.map(item => (
              <option key={item.uuid} value={item.uuid}>
                {item.label}
              </option>
            ))}
        </Field>
      </div>
    );
  };

  renderInfoBlock = () => {
    const {
      playerProfile: { playerUUID, fullName, currencyCode },
      currentValues,
      invalid,
    } = this.props;

    if (invalid || !(currentValues && currentValues.amount) || !currencyCode) {
      return null;
    }

    return (
      <div className="row mb-3">
        <div className="col-9 mx-auto text-center font-weight-700">
          {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.ACTION_TEXT', {
            action: paymentTypesLabels[currentValues.type],
          })}
          {' '}
          <Amount
            amount={currentValues.amount}
            currency={currencyCode}
          />
          {' '}
          {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.ACTION_TEXT_ACCOUNT', {
            fullName,
            uuid: shortify(playerUUID),
          })}
        </div>
      </div>
    );
  };

  render() {
    const {
      onClose,
      onSubmit,
      handleSubmit,
      pristine,
      submitting,
      invalid,
      playerProfile,
      note,
      error,
    } = this.props;

    const filteredPaymentTypes = Object.keys(paymentTypes).filter(type => !this.isPaymentMethodDisabled(type));

    return (
      <Modal toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>
          {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.TITLE')}
        </ModalHeader>
        <ModalBody>
          <form id="new-transaction" className="container-fluid" onSubmit={handleSubmit(onSubmit)}>
            {
              error &&
              <div className="alert alert-warning">
                {I18n.t(error)}
              </div>
            }
            <div className="row">
              <div className="col-4">
                <Field
                  name="type"
                  type="text"
                  label={attributeLabels.type}
                  showErrorMessage={false}
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
                  {filteredPaymentTypes.map(type => (
                    <option key={type} value={type}>
                      {paymentTypesLabels[type]}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-3">
                <Field
                  name="amount"
                  label={attributeLabels.amount}
                  type="text"
                  placeholder="0.00"
                  inputAddon={<Currency code={playerProfile.currencyCode} />}
                  currencyCode={playerProfile.currencyCode}
                  showErrorMessage={false}
                  position="vertical"
                  component={InputField}
                />
              </div>
              {this.renderPaymentAccountField()}
            </div>
            {this.renderInfoBlock()}
            <div className="text-center">
              <NoteButton
                id="add-transaction-item-note-button"
                note={note}
                onClick={this.handleNoteClick}
              />
            </div>
          </form>
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
                  className="btn btn-primary text-uppercase margin-left-5"
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
    type: paymentTypes.Deposit,
  },
  validate: (data) => {
    const rules = {
      type: 'required|string',
      amount: 'required|numeric',
    };

    if (data.type === paymentTypes.Withdraw) {
      rules.paymentAccountUuid = 'required|string';
    }

    return createValidator(rules, attributeLabels, false)(data);
  },
})(PaymentAddModal);
export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(Form);
