import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import keyMirror from 'keymirror';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { InputField, SelectField } from '../../../../../components/ReduxForm';

const FORM_NAME = 'createPaymentForm';

const paymentTypes = keyMirror({
  DEPOSIT: null,
  WITHDRAW: null,
  CONFISCATE: null,
});

const paymentTypeLabels = keyMirror({
  [paymentTypes.DEPOSIT]: 'Manual deposit',
  [paymentTypes.WITHDRAW]: 'Manual withdraw',
  [paymentTypes.CONFISCATE]: 'Confiscate',
});

const attributeLabels = {
  paymentType: 'PaymentType',
  amount: 'Amount',
  paymentMethod: 'Payment method',
};

class PaymentAddModal extends Component {


  renderPaymentMethodField = () => {
    const { currentValues } = this.props;

    if (currentValues.paymentType !== paymentTypes.WITHDRAW) {
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
     isOpen,
     pristine,
     submitting,
     valid,
   } = this.props;

   return (
     <Modal className="payment-create-modal" toggle={onClose} isOpen={isOpen}>
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
               {this.renderAmountField()}
             </div>

             {this.renderPaymentMethodField()}
           </div>
         </ModalBody>
         <ModalFooter>
           <div className="row">
             <div className="col-sm-6 text-muted font-size-12">
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

export default reduxForm({
  form: FORM_NAME,
  //validate: validator,
})(PaymentAddModal);
