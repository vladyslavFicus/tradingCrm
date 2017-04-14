import React, { Component, PropTypes } from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import keyMirror from 'keymirror';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { InputField, SelectField, AmountCurrencyField } from '../../../../../components/ReduxForm';

const FORM_NAME = 'createPaymentForm';

const paymentTypes = keyMirror({
  DEPOSIT: null,
  WITHDRAW: null,
  CONFISCATE: null,
});

const paymentTypeLabels = {
  [paymentTypes.DEPOSIT]: 'Manual deposit',
  [paymentTypes.WITHDRAW]: 'Manual withdraw',
  [paymentTypes.CONFISCATE]: 'Confiscate',
};

const attributeLabels = {
  paymentType: 'PaymentType',
  amount: 'Amount',
  paymentMethod: 'Payment method',
};

class PaymentAddModal extends Component {
  static propTypes = {
    currencyCode: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    currentValues: PropTypes.shape({
      paymentType: PropTypes.string.isRequired,
    }),
  };

  renderPaymentMethodField = () => {
    const { currentValues } = this.props;

    if (currentValues && currentValues.paymentType && currentValues.paymentType !== paymentTypes.WITHDRAW) {
      return null;
    }

    return (
      <div className="col-md-4">
        <Field
          name="paymentMethod"
          label={attributeLabels.paymentMethod}
          type="text"
          component={InputField}
          position="vertical"
        />
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
      currencyCode,
      currentValues,
    } = this.props;

    return (
      <Modal className="payment-create-modal" toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>New transaction</ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <div className="row">
              <div className="col-md-4">
                <Field
                  name="paymentType"
                  type="text"
                  label={attributeLabels.paymentType}
                  component={SelectField}
                  position="vertical"
                >
                  {Object.keys(paymentTypes).map(type => (
                    <option key={type} value={type}>
                      {paymentTypeLabels[type]}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="col-md-4">
                <Field
                  name="amount"
                  label={attributeLabels.amount}
                  type="text"
                  placeholder="0.00"
                  currencyCode={currencyCode}
                  component={AmountCurrencyField}
                />
              </div>

              {this.renderPaymentMethodField()}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="row">
              <div className="col-sm-6 text-muted font-size-12 text-left">
                <b>Note</b>: This action can not be undone!
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
      paymentType: paymentTypes.DEPOSIT,
    },
    //validate,
  })(PaymentAddModal)
);
