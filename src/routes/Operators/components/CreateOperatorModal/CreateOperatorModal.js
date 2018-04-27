import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField, SelectField, CheckBox } from '../../../../components/ReduxForm';
import { createValidator, translateLabels } from '../../../../utils/validator';
import renderLabel from '../../../../utils/renderLabel';
import { attributeLabels } from './constants';
import { departmentsLabels, rolesLabels } from '../../../../constants/operators';
import { withReduxFormValues } from '../../../../components/HighOrder';

class CreateOperatorModal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    change: PropTypes.func,
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    formValues: PropTypes.shape({
      department: PropTypes.string,
      role: PropTypes.string,
    }),
  };
  static defaultProps = {
    pristine: false,
    submitting: false,
    valid: false,
    formValues: {},
    change: null,
  };

  handleChangeDepartment = (e) => {
    const { departmentsRoles, change } = this.props;
    const roles = departmentsRoles[e.target.value];

    if (roles.length > 0) {
      change('role', roles[0]);
    }
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      departmentsRoles,
      pristine,
      submitting,
      valid,
      onCloseModal,
      isOpen,
      formValues,
    } = this.props;

    return (
      <Modal className="create-operator-modal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('OPERATORS.MODALS.NEW_OPERATOR.TITLE')}</ModalHeader>
        <ModalBody id="create-operator-modal-form" tag="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <Field
              name="firstName"
              type="text"
              label={I18n.t(attributeLabels.firstName)}
              component={InputField}
              position="vertical"
              showErrorMessage={false}
              id="create-new-operator-first-name"
              className="col-md-6"
            />
            <Field
              name="lastName"
              type="text"
              label={I18n.t(attributeLabels.lastName)}
              component={InputField}
              position="vertical"
              showErrorMessage={false}
              id="create-new-operator-last-name"
              className="col-md-6"
            />
            <Field
              name="email"
              type="text"
              label={I18n.t(attributeLabels.email)}
              component={InputField}
              position="vertical"
              showErrorMessage={false}
              id="create-new-operator-email"
              className="col-md-6"
            />
            <Field
              name="phone"
              type="text"
              label={I18n.t(attributeLabels.phone)}
              component={InputField}
              position="vertical"
              showErrorMessage={false}
              id="create-new-operator-phone"
              className="col-md-6"
            />
            <Field
              name="department"
              type="text"
              label={I18n.t(attributeLabels.department)}
              component={SelectField}
              position="vertical"
              onChange={this.handleChangeDepartment}
              className="col-md-6"
            >
              {Object.keys(departmentsRoles).map(value => (
                <option key={value} value={value}>
                  {renderLabel(value, departmentsLabels)}
                </option>
              ))}
            </Field>
            <Field
              name="role"
              type="text"
              label={I18n.t(attributeLabels.role)}
              component={SelectField}
              position="vertical"
              disabled={!formValues}
              className="col-md-6"
            >
              {formValues.department && departmentsRoles[formValues.department].map(value => (
                <option key={value} value={value}>
                  {renderLabel(value, rolesLabels)}
                </option>
              ))}
            </Field>
          </div>
          <Field
            name="sendMail"
            type="checkbox"
            component={CheckBox}
            id="create-new-operator-send-invitation-checkbox"
            label={I18n.t('OPERATORS.MODALS.NEW_OPERATOR.SEND_INVITATION')}
          />
        </ModalBody>
        <ModalFooter>
          <div className="row">
            <div className="col-5 text-muted font-size-12 text-left">
              <b>{I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE')}</b>
              {':'}
              {I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE_MESSAGE')}
            </div>
            <div className="col-7">
              <button
                type="button"
                className="btn btn-default-outline"
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </button>
              <button
                type="submit"
                disabled={pristine || submitting || !valid}
                className="btn btn-primary ml-2"
                id="create-new-operator-submit-button"
                form="create-operator-modal-form"
              >
                {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default compose(
  reduxForm({
    form: 'operatorCreateForm',
    validate: createValidator({
      firstName: ['required', 'string', 'min:3'],
      lastName: ['required', 'string', 'min:3'],
      email: ['required', 'email'],
      phone: 'min:3',
      department: 'required',
      role: 'required',
    }, translateLabels(attributeLabels), false),
  }),
  withReduxFormValues,
)(CreateOperatorModal);
