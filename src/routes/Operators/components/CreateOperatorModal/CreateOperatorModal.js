import React, { Component, PropTypes } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { InputField, SelectField } from 'components/ReduxForm';
import { createValidator } from 'utils/validator';
import './CreateOperatorModal.scss';

const attributeLabels = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  department: 'Department',
  role: 'Role',
};

const validator = createValidator({
  firstName: ['required', 'min:3'],
  lastName: ['required', 'min:3'],
  email: ['required', 'email'],
  phone: ['required', 'min:3'],
  department: ['required'],
  role: ['required'],
}, attributeLabels, false);

class CreateOperatorModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    departments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    roles: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
  };

  handleSubmit = (data) => {
    this.props.onSubmit(data);
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      departments,
      pristine,
      submitting,
      valid,
      roles,
      onClose,
      isOpen,
    } = this.props;

    return <Modal className="create-operator-modal" toggle={onClose} isOpen={isOpen}>
      <ModalHeader toggle={onClose}>New operator</ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <Field
                name="firstName"
                type="text"
                label={attributeLabels.firstName}
                component={InputField}
                position="vertical"
                showErrorMessage={false}
              />
            </div>
            <div className="col-md-6">
              <Field
                name="lastName"
                type="text"
                label={attributeLabels.lastName}
                component={InputField}
                position="vertical"
                showErrorMessage={false}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Field
                name="email"
                type="text"
                label={attributeLabels.email}
                component={InputField}
                position="vertical"
                showErrorMessage={false}
              />
            </div>
            <div className="col-md-6">
              <Field
                name="phone"
                type="text"
                label={attributeLabels.phone}
                component={InputField}
                position="vertical"
                showErrorMessage={false}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="row margin-left-0">
                <div className="col-md-6">
                  <Field
                    name="department"
                    label={attributeLabels.department}
                    component={SelectField}
                    position="vertical"
                    showErrorMessage={false}
                    children={[
                      <option value="">Select department</option>,
                      ...departments.map(({ label, value }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )),
                    ]}
                  />
                </div>
                <div className="col-md-4 col-md-offset-1">
                  <Field
                    name="role"
                    label={attributeLabels.role}
                    component={SelectField}
                    position="vertical"
                    showErrorMessage={false}
                    children={[
                      <option value="">Select role</option>,
                      ...roles.map(({ label, value }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )),
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="row">
            <div className="col-sm-7 text-muted font-size-12">
              <b>Note</b>: You will be able to set additional departments in operator's profile once it's created
            </div>
            <div className="col-sm-5 text-right">
              <button
                type="reset"
                className="btn btn-default-outline text-uppercase"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={pristine || submitting || !valid}
                className="btn btn-primary text-uppercase"
              >
                Create & open
              </button>
            </div>
          </div>
        </ModalFooter>
      </form>
    </Modal>;
  }
}

export default reduxForm({
  form: 'operatorCreateForm',
  validate: validator,
})(CreateOperatorModal);
