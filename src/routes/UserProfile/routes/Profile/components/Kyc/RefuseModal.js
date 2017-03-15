import React, { Component, PropTypes } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from 'utils/validator';

const attributeLabels = {
  reason: 'Identity rejection reason',
};

const validator = createValidator({
  reason: 'required|string',
}, attributeLabels, false);

class RefuseModal extends Component {
  render() {
    const {
      profile: {
        initials,
        language,
      },
      onSubmit,
      handleSubmit,
      pristine,
      submitting,
      invalid,
      isOpen,
      onClose,
      className,
    } = this.props;

    return <Modal isOpen={isOpen} toggle={onClose} className={className}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={onClose}>KYC Request rejection</ModalHeader>
        <ModalBody>
          <div className="text-center">
            <h3>Refusing verification</h3>
            <div className="font-weight-700">{initials}</div>
            <div>Account language: {language}</div>
          </div>
          <div className="form-group padding-top-20">
            <label>{attributeLabels.reason}</label>
            <Field
              name="reason"
              label={attributeLabels.reason}
              component='textarea'
              className='form-control'
              rows="3"
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color=""
            onClick={onClose}
            className="btn margin-inline"
          >Cancel</Button> {' '}
          <Button
            type="submit"
            color="danger"
            className="btn margin-inline"
            disabled={pristine || submitting || invalid}
          >Refuse & Send notification</Button>
        </ModalFooter>
      </form>
    </Modal>;
  }
}

export default reduxForm({
  form: 'refuseModal',
  validate: validator,
})(RefuseModal);
