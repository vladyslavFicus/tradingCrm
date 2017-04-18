import React, { Component } from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from '../../../../../utils/validator';
import { SelectField, InputField } from '../../../../../components/ReduxForm';
import { shortify } from '../../../../../utils/uuid';
import Amount from '../../../../../components/Amount';
import PopoverButton from '../../../../../components/PopoverButton';
import {
  types as paymentTypes,
  manualTypesLabels as paymentTypesLabels,
} from '../../../../../constants/payment';
import { targetTypes } from '../../../../../constants/note';
import PropTypes from '../../../../../constants/propTypes';

const FORM_NAME = 'createPaymentForm';

const attributeLabels = {
  type: 'Payment Type',
  amount: 'Amount',
  paymentMethod: 'Payment method',
};

const validate = (values) => {
  const rules = {
    type: 'required|string',
    amount: 'required|numeric',
  };

  if (values.type === paymentTypes.Withdraw) {
    rules.paymentMethod = 'required|string';
  }

  return createValidator(
    rules,
    attributeLabels,
    false
  )(values);
};

class PaymentAddModal extends Component {
  static propTypes = {
    playerInfo: PropTypes.shape({
      currencyCode: PropTypes.string,
      fullName: PropTypes.string,
      shortUUID: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onLoadPaymentMethods: PropTypes.func.isRequired,
    onManageNote: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    currentValues: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }),
    note: PropTypes.noteEntity,
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
  };

  state = {
    availablePaymentMethods: [],
  };

  async componentDidMount() {
    const { onLoadPaymentMethods, playerInfo: { currencyCode } } = this.props;

    const action = await onLoadPaymentMethods();
    if (action && !action.error) {
      const availablePaymentMethods = action.payload.map(method => ({
        paymentMethod: method.paymentMethod,
        currency: method.lastPayment && method.lastPayment.currency ?
          method.lastPayment.currency : currencyCode,
        paymentAccountId: method.uuid,
        label: `${method.paymentMethod} - ${shortify(method.details)}`,
      }));
      this.setState({
        availablePaymentMethods,
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

  handleSubmitNote = (data) => {
    return new Promise((resolve) => {
      this.props.onManageNote(data);
      this.context.hidePopover();
      resolve();
    });
  };

  handleDeleteNote = () => {
    return new Promise((resolve) => {
      this.props.onManageNote(null);
      this.context.hidePopover();
      resolve();
    });
  };

  renderPaymentMethodField = () => {
    const { currentValues } = this.props;
    const { availablePaymentMethods } = this.state;

    if ((currentValues && currentValues.type && currentValues.type !== paymentTypes.Withdraw)
      || !availablePaymentMethods.length
    ) {
      return null;
    }

    return (
      <div className="col-md-5">
        <Field
          name="paymentMethod"
          label={attributeLabels.paymentMethod}
          type="text"
          component={SelectField}
          position="vertical"
          showErrorMessage={false}
        >
          <option value="">Choose payment method</option>
          {availablePaymentMethods.map(item => (
            <option key={item.paymentAccountId} value={item.paymentMethod}>
              {item.label}
            </option>
          ))}
        </Field>
      </div>
    );
  };

  renderInfoBlock = () => {
    const {
      playerInfo: { shortUUID, fullName, currencyCode },
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
        {`from ${fullName} ${shortUUID} account`}
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
    } = this.props;

    return (
      <Modal className="payment-create-modal" toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>New transaction</ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
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
                  currencyCode={currencyCode}
                  showErrorMessage={false}
                  position="vertical"
                  component={InputField}
                />
              </div>

              {this.renderPaymentMethodField()}
            </div>
            <div className="row">
              { this.renderInfoBlock() }
            </div>
            <div className="row text-center">
              <PopoverButton
                id="add-transaction-item-note-button"
                className="cursor-pointer"
                onClick={id => this.handleNoteClick(id)}
              >
                {note
                  ? <i className="fa fa-sticky-note" />
                  : <i className="fa fa-sticky-note-o" />
                }
              </PopoverButton>
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
  })(PaymentAddModal)
);
