import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from 'utils/validator';

const attributeLabels = {
  reason: 'Reason',
};
const validator = createValidator({
  reason: 'required|string',
}, attributeLabels, false);

class RejectModal extends Component {
  render() {
    const {
      show,
      className,
      onSubmit,
      handleSubmit,
      onClose,
      submitting,
      onToggle,
    } = this.props;

    return (
      <Modal isOpen={show} toggle={onToggle} className={className}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onToggle}>Reject</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <Field
                name="reason"
                label={attributeLabels.reason}
                component={'textarea'}
                className={'form-control'}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              disabled={submitting}
              color="danger"
            >Reject</Button>{' '}
            <Button
              color="secondary"
              onClick={onClose}
            >Cancel</Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'rejectModal',
  validate: validator,
})(RejectModal);
