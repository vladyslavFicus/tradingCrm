import React, { Component, PropTypes } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from 'utils/validator';
import {  SelectField } from 'components/ReduxForm/UserProfile';
import { reasons as operatorChangeStatusReasons } from 'constants/operators'

const attributeLabels = {
  reason: 'Reason',
};
const validator = (data) => {
  return createValidator({
    reason: `required|string|in:${operatorChangeStatusReasons.join(',')}`,
  }, attributeLabels, false)(data);
};

class AccountStatusModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
  };

  render() {
    const {
      show,
      action,
      reasons,
      title,
      onHide,
      onSubmit,
      handleSubmit,
      ...rest,
    } = this.props;

    return (
      <Modal {...rest} isOpen={show} toggle={onHide}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {
            !!title &&
            <ModalHeader toggle={onHide}>
              {title}
            </ModalHeader>
          }
          <ModalBody>
            {
              <div className="form-group">
                <Field
                  name="reason"
                  label={attributeLabels.reason}
                  component={SelectField}
                  className={'form-control'}
                >
                  <option>-- Select reason --</option>
                  {reasons.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
            }
          </ModalBody>

          <ModalFooter>
            <Button
              color="success"
              type="submit"
            >{action}</Button>
            <Button
              color="secondary"
              onClick={onHide}
            >Cancel</Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'accountStatusModal',
  validate: validator,
})(AccountStatusModal);
