import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { attributeLabels } from '../constants';
import UpdateOperatorDepartmentsFormMutation from './graphql/UpdateOperatorDepartmentsFormMutation';
import './DepartmentsForm.scss';

const validate = createValidator({
  department: ['required'],
  role: ['required'],
}, translateLabels(attributeLabels));

class DepartmentsForm extends PureComponent {
  static propTypes = {
    addDepartment: PropTypes.func.isRequired,
    operatorUuid: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity).isRequired,
  };

  state = {
    show: false,
  };

  handleAddDepartment = async ({ department, role }) => {
    const { operatorUuid: uuid, addDepartment, notify, onSuccess } = this.props;

    try {
      await addDepartment({
        variables: {
          uuid,
          department,
          role,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.MESSAGE'),
      });

      onSuccess();

      this.toggleDepartmentForm();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.MESSAGE'),
      });
    }
  };

  toggleDepartmentForm = () => (this.setState(({ show }) => ({ show: !show })));

  render() {
    const { departmentsRoles, authorities } = this.props;
    const { show } = this.state;

    const operatorDepartments = authorities.map(({ department }) => department);
    const availableDepartments = Object.keys(departmentsRoles)
      .filter(item => !operatorDepartments.includes(item));

    return (
      <div>
        <If condition={!show && availableDepartments.length}>
          <Button type="button" className="btn btn-sm" onClick={this.toggleDepartmentForm}>
            {I18n.t('OPERATORS.PROFILE.DEPARTMENTS.ADD_BUTTON_LABEL')}
          </Button>
        </If>

        <If condition={show}>
          <Formik
            initialValues={{
              department: '',
              role: '',
            }}
            onSubmit={this.handleAddDepartment}
            validate={validate}
          >
            {({ dirty, isValid, isSubmitting, values: { department } }) => (
              <Form className="DepartmentsForm__form">
                <Field
                  name="department"
                  label={I18n.t(attributeLabels.department)}
                  className="DepartmentsForm__input"
                  component={FormikSelectField}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  {availableDepartments.map(item => (
                    <option key={item} value={item}>
                      {I18n.t(renderLabel(item, departmentsLabels))}
                    </option>
                  ))}
                </Field>
                <Field
                  name="role"
                  label={I18n.t(attributeLabels.role)}
                  className="DepartmentsForm__input"
                  component={FormikSelectField}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  disabled={!department || !departmentsRoles[department]}
                >
                  {(departmentsRoles[department] || []).map(item => (
                    <option key={item} value={item}>
                      {I18n.t(renderLabel(item, rolesLabels))}
                    </option>
                  ))}
                </Field>
                <div className="DepartmentsForm__buttons">
                  <Button
                    disabled={!dirty || !isValid || isSubmitting}
                    type="submit"
                    primary
                  >
                    {I18n.t('COMMON.SAVE')}
                  </Button>
                  <Button
                    common
                    onClick={this.toggleDepartmentForm}
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </If>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    addDepartment: UpdateOperatorDepartmentsFormMutation,
  }),
)(DepartmentsForm);
