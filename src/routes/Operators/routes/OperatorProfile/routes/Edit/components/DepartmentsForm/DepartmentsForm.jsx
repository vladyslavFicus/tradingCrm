import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import get from 'lodash/get';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import renderLabel from 'utils/renderLabel';
import { attributeLabels } from '../constants';
import UpdateOperatorDepartmentsFormMutation from './graphql/UpdateOperatorDepartmentsFormMutation';
import './DepartmentsForm.scss';

const validate = (values, availableDepartments, departmentsRoles) => (
  createValidator({
    department: ['required', `in:${availableDepartments.join()}`],
    role: ['required', `in:${departmentsRoles[values.department].join()}`],
  }, translateLabels(attributeLabels), false)(values));

class DepartmentsForm extends PureComponent {
  static propTypes = {
    addDepartment: PropTypes.func.isRequired,
    operatorUuid: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity),

  };

  static defaultProps = {
    authorities: [],
  };

  state = {
    show: false,
    availableRoles: [],
  };

  initialValues = {
    department: '',
    role: '',
  };

  handleAddDepartment = async ({ department, role }) => {
    const { operatorUuid: uuid, addDepartment, notify } = this.props;
    const response = await addDepartment({ variables: { uuid, department, role } });
    const error = get(response, 'data.operator.addDepartment.error');

    notify({
      level: error ? 'error' : 'success',
      title: error
        ? I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.TITLE')
        : I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.TITLE'),
      message: error
        ? I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.MESSAGE')
        : I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.MESSAGE'),
    });

    if (!error) {
      this.toggleShow();
    }
  };

  handleChangeDepartment = (department, setValues) => {
    const { departmentsRoles } = this.props;
    const roles = departmentsRoles[department];
    setValues({
      department,
      role: roles ? roles[0] : '',
    });
    this.setState({ availableRoles: roles || [] });
  }

  toggleShow = () => (this.setState(({ show }) => ({ show: !show })));

  render() {
    const { departmentsRoles, authorities } = this.props;
    const { availableRoles, show } = this.state;

    const operatorDepartments = authorities.map(({ department }) => department);
    const availableDepartments = Object.keys(departmentsRoles)
      .filter(item => !operatorDepartments.includes(item));

    return (
      <div>
        <If condition={!show && availableDepartments.length}>
          <Button type="button" className="btn btn-sm" onClick={this.toggleShow}>
            {I18n.t('OPERATORS.PROFILE.DEPARTMENTS.ADD_BUTTON_LABEL')}
          </Button>
        </If>

        <If condition={show}>
          <Formik
            initialValues={this.initialValues}
            onSubmit={this.handleAddDepartment}
            validate={values => validate(values, availableDepartments, departmentsRoles)}
          >
            {({ dirty, isValid, isSubmitting, setValues, values: { department } }) => (
              <Form className="DepartmentsForm__form">
                <Field
                  name="department"
                  label={I18n.t(attributeLabels.department)}
                  className="DepartmentsForm__input"
                  component={FormikSelectField}
                  customOnChange={value => this.handleChangeDepartment(value, setValues)}
                  withAnyOption
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
                  disabled={!department}
                  withAnyOption
                >
                  {availableRoles.map(item => (
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
                    onClick={this.toggleShow}
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
