import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField, SelectField } from '../../../../components/ReduxForm';
import { createValidator } from '../../../../utils/validator';
import renderLabel from '../../../../utils/renderLabel';
import { departments, departmentsLabels, roles, rolesLabels } from '../../../../constants/operators';

const attributeLabels = {
  firstName: I18n.t('COMMON.FIRST_NAME'),
  lastName: I18n.t('COMMON.LAST_NAME'),
  email: I18n.t('COMMON.EMAIL'),
  phone: I18n.t('COMMON.PHONE'),
  department: I18n.t('COMMON.DEPARTMENT'),
  role: I18n.t('COMMON.ROLE'),
};

const validator = createValidator({
  firstName: ['required', 'string', 'min:3'],
  lastName: ['required', 'string', 'min:3'],
  email: ['required', 'email'],
  phone: 'min:3',
  department: 'required',
  role: 'required',
}, attributeLabels, false);

class CreateOperatorModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    availableDepartments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    availableRoles: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    change: PropTypes.func,
    currentValues: PropTypes.shape({
      department: PropTypes.string,
      role: PropTypes.string,
    }),
  };
  static defaultProps = {
    pristine: false,
    submitting: false,
    valid: false,
    currentValues: {},
    change: null,
  };

  handleChangeDepartment = (e) => {
    if (e.target.value === departments.ADMINISTRATION) {
      this.props.change('role', roles.ROLE4);
    }
  };

  handleSubmit = data => this.props.onSubmit(data);

  render() {
    const {
      handleSubmit,
      onSubmit,
      availableDepartments,
      pristine,
      submitting,
      valid,
      availableRoles,
      onClose,
      currentValues,
    } = this.props;

    return (
      <Modal className="create-operator-modal" toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>{I18n.t('OPERATORS.MODALS.NEW_OPERATOR.TITLE')}</ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <div className="row">
              <div className="col-sm-6">
                <Field
                  name="firstName"
                  type="text"
                  label={attributeLabels.firstName}
                  component={InputField}
                  position="vertical"
                  showErrorMessage={false}
                  id="create-new-operator-first-name"
                />
              </div>
              <div className="col-sm-6">
                <Field
                  name="lastName"
                  type="text"
                  label={attributeLabels.lastName}
                  component={InputField}
                  position="vertical"
                  showErrorMessage={false}
                  id="create-new-operator-last-name"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <Field
                  name="email"
                  type="text"
                  label={attributeLabels.email}
                  component={InputField}
                  position="vertical"
                  showErrorMessage={false}
                  id="create-new-operator-email"
                />
              </div>
              <div className="col-sm-6">
                <Field
                  name="phone"
                  type="text"
                  label={attributeLabels.phone}
                  component={InputField}
                  position="vertical"
                  showErrorMessage={false}
                  id="create-new-operator-phone"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <Field
                  name="department"
                  type="text"
                  label={attributeLabels.department}
                  component={SelectField}
                  position="vertical"
                  onChange={this.handleChangeDepartment}
                >
                  {availableDepartments.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {renderLabel(label, departmentsLabels)}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-sm-6">
                <Field
                  name="role"
                  type="text"
                  label={attributeLabels.role}
                  component={SelectField}
                  position="vertical"
                  disabled={!currentValues || (currentValues.department === departments.ADMINISTRATION)}
                >
                  {availableRoles.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {renderLabel(label, rolesLabels)}
                    </option>
                  ))}
                </Field>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="form-check">
                  <label className="form-check-label">
                    <Field
                      className="form-check-input"
                      name="sendMail"
                      type="checkbox"
                      component="input"
                      id="create-new-operator-send-invitation-checkbox"
                    />
                    {I18n.t('OPERATORS.MODALS.NEW_OPERATOR.SEND_INVITATION')}
                  </label>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="row">
              <div className="col-sm-6 text-muted font-size-12">
                <b>{I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE')}</b>
                {':'}
                {I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE_MESSAGE')}
              </div>
              <div className="col-sm-6">
                <button
                  type="reset"
                  className="btn btn-default-outline"
                  onClick={onClose}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </button>

                <button
                  type="submit"
                  disabled={pristine || submitting || !valid}
                  className="btn btn-primary ml-2"
                  id="create-new-operator-submit-button"
                >
                  {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
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
  currentValues: getFormValues('operatorCreateForm')(state),
}))(
  reduxForm({
    form: 'operatorCreateForm',
    validate: validator,
  })(CreateOperatorModal),
);
