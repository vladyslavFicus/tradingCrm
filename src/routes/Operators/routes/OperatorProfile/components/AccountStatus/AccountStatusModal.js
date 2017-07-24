import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from '../../../../../../utils/validator';
import { SelectField } from '../../../../../../components/ReduxForm';
import { reasons as operatorChangeStatusReasons } from '../../../../../../constants/operators';

const attributeLabels = {
  reason: 'Reason',
};
const validator = createValidator({
  reason: `required|string|in:${operatorChangeStatusReasons.join()}`,
}, attributeLabels, false);

class AccountStatusModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    show: PropTypes.bool,
    action: PropTypes.string,
    reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
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
      ...rest
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
              <Field
                name="reason"
                label={attributeLabels.reason}
                component={SelectField}
                className={'form-control'}
                position="vertical"
              >
                <option>-- Select reason --</option>
                {reasons.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
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
