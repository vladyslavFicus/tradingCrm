import React, { Component } from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../utils/validator';
import { SelectField, InputField } from '../../../../../components/ReduxForm';
import { shortify } from '../../../../../utils/uuid';
import Amount from '../../../../../components/Amount';
import NoteButton from '../../../../../components/NoteButton';
import {
  types as paymentTypes,
  manualTypesLabels as paymentTypesLabels,
} from '../../../../../constants/payment';
import { targetTypes } from '../../../../../constants/note';
import PropTypes from '../../../../../constants/propTypes';
import Currency from '../../../../../components/Amount/Currency';

const FORM_NAME = 'createPaymentForm';

const attributeLabels = {
  type: 'Payment Type',
  amount: 'Amount',
  paymentAccount: 'Payment account',
};

const validate = (values) => {
  const rules = {
    type: 'required|string',
    amount: 'required|numeric',
  };

  if (values.type === paymentTypes.Withdraw) {
    rules.paymentAccount = 'required|string';
  }

  return createValidator(
    rules,
    attributeLabels,
    false,
  )(values);
};

class PaymentAddModal extends Component {
  static propTypes = {
    playerInfo: PropTypes.shape({
      currencyCode: PropTypes.string,
      fullName: PropTypes.string,
      playerUUID: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onLoadPaymentAccounts: PropTypes.func.isRequired,
    onManageNote: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    currentValues: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }),
    note: PropTypes.noteEntity,
    error: PropTypes.string,
  };
  static defaultProps = {
    submitting: false,
    pristine: false,
    valid: false,
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

  async componentDidMount() {
    const { onLoadPaymentAccounts, playerInfo: { currencyCode } } = this.props;

    const action = await onLoadPaymentAccounts();
    if (action && !action.error) {
      const availablePaymentAccounts = action.payload.map(account => ({
        paymentAccount: account.paymentAccount,
        currency: account.lastPayment && account.lastPayment.currency ?
          account.lastPayment.currency : currencyCode,
        paymentAccountId: account.uuid,
        label: `${account.paymentAccount} - ${shortify(account.details)}`,
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

  handleNoteClick = (target) => {
    const { note } = this.props;
    if (note) {
      this.context.onEditNoteClick(target, note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(null, targetTypes.PAYMENT)(target, this.getNotePopoverParams());
    }
  };

  handleSubmitNote = data => new Promise((resolve) => {
    this.props.onManageNote(data);
    this.context.hidePopover();
    resolve();
  });

  handleDeleteNote = () => new Promise((resolve) => {
    this.props.onManageNote(null);
    this.context.hidePopover();
    resolve();
  });

  renderPaymentAccountField = () => {
    const { currentValues } = this.props;
    const { availablePaymentAccounts } = this.state;

    if (currentValues && currentValues.type && currentValues.type !== paymentTypes.Withdraw) {
      return null;
    }

    const emptyOptionLabel = availablePaymentAccounts.length === 0 ?
      'No payment accounts' : 'Choose payment account';

    return (
      <div className="col-md-5">
        <Field
          name="paymentAccount"
          label={attributeLabels.paymentAccount}
          type="text"
          component={SelectField}
          position="vertical"
          showErrorMessage={false}
        >
          <option value="">{emptyOptionLabel}</option>
          {availablePaymentAccounts.map(item => (
            <option key={item.paymentAccountId} value={item.paymentAccount}>
              {item.label}
            </option>
          ))}
        </Field>
      </div>
    );
  };

  renderInfoBlock = () => {
    const {
      playerInfo: { playerUUID, fullName, currencyCode },
      currentValues,
      valid,
    } = this.props;

    if (!valid || !(currentValues && currentValues.amount) || !currencyCode) {
      return null;
    }

    return (
      <div className="center-block text-center width-400 font-weight-700">
        {`You are about to ${paymentTypesLabels[currentValues.type]}`} {' '}
        <Amount currency={currencyCode} amount={currentValues.amount} /> {' '}
        {`from ${fullName} ${shortify(playerUUID)} account`}
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
      valid,
      playerInfo: { currencyCode },
      note,
      error,
    } = this.props;

    return (
      <Modal className="payment-create-modal" toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>New transaction</ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            {error && <div className="alert alert-warning">
              {I18n.t(error)}
            </div>}
            <div className="row">
              <div className="col-md-4">
                <Field
                  name="type"
                  type="text"
                  label={attributeLabels.type}
                  showErrorMessage={false}
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">--- Select ---</option>
                  {Object.keys(paymentTypes).map(type => (
                    <option key={type} value={type}>
                      {paymentTypesLabels[type]}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="col-md-3">
                <Field
                  name="amount"
                  label={attributeLabels.amount}
                  type="text"
                  placeholder="0.00"
                  inputAddon={<Currency code={currencyCode} />}
                  currencyCode={currencyCode}
                  showErrorMessage={false}
                  position="vertical"
                  component={InputField}
                />
              </div>

              {this.renderPaymentAccountField()}
            </div>
            <div className="row">
              {this.renderInfoBlock()}
            </div>
            <div className="row text-center">
              <NoteButton
                id="add-transaction-item-note-button"
                note={note}
                onClick={this.handleNoteClick}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="row">
              <div className="col-sm-6 text-muted font-size-12 text-left">
                <span className="font-weight-700">Note</span>: This action can not be undone!
              </div>
              <div className="col-sm-6 text-right">
                <button
                  type="reset"
                  className="btn btn-default-outline text-uppercase"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  disabled={pristine || submitting || !valid}
                  type="submit"
                  className="btn btn-primary text-uppercase"
                >
                  Confirm
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    initialValues: {
      type: paymentTypes.Deposit,
    },
    validate,
  })(PaymentAddModal),
);
