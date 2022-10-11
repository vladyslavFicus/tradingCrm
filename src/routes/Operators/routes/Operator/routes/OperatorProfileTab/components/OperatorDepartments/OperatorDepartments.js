import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import PermissionContent from 'components/PermissionContent';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import AddAuthorityMutation from './graphql/AddAuthorityMutation';
import RemoveAuthorityMutation from './graphql/RemoveAuthorityMutation';
import AuthoritiesOptionsQuery from './graphql/AuthoritiesOptionsQuery';
import './OperatorDepartments.scss';

const attributeLabels = {
  department: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.DEPARTMENT',
  role: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.ROLE',
};

// unAvailableDepartments - is departments that can't be set to Operator
const unAvailableDepartments = ['AFFILIATE', 'AFFILIATE_PARTNER', 'PLAYER'];

class OperatorDepartments extends PureComponent {
  static propTypes = {
    auth: PropTypes.auth.isRequired,
    notify: PropTypes.func.isRequired,
    operatorQuery: PropTypes.query({
      operator: PropTypes.operator,
    }).isRequired,
    addAuthority: PropTypes.func.isRequired,
    removeAuthority: PropTypes.func.isRequired,
    authoritiesQuery: PropTypes.query({
      authoritiesOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
      // authoritiesOptions: { [department]: [role1, role2, role3, ...] }
    }).isRequired,
  }

  state = {
    isVisibleDepartmentCreationForm: false,
  }

  toggleDepartmentCreationFormVisibility = () => {
    this.setState(({ isVisibleDepartmentCreationForm }) => ({
      isVisibleDepartmentCreationForm: !isVisibleDepartmentCreationForm,
    }));
  }

  handleAddAuthority = async ({ department, role }, { setSubmitting, resetForm }) => {
    const { operatorQuery, addAuthority, notify } = this.props;

    const uuid = operatorQuery.data?.operator?.uuid;

    try {
      await addAuthority({
        variables: {
          uuid,
          role,
          department,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.MESSAGE'),
      });

      operatorQuery.refetch();
      resetForm();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.MESSAGE'),
      });
    }

    setSubmitting(false);
  };

  handleRemoveAuthority = async (department, role) => {
    const { operatorQuery, removeAuthority, notify } = this.props;

    const uuid = operatorQuery.data?.operator?.uuid;

    try {
      await removeAuthority({
        variables: {
          uuid,
          role,
          department,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.MESSAGE'),
      });

      operatorQuery.refetch();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.MESSAGE'),
      });
    }
  }

  render() {
    const { operatorQuery, authoritiesQuery, auth } = this.props;
    const { isVisibleDepartmentCreationForm } = this.state;

    const operatorUuid = operatorQuery.data?.operator?.uuid;
    const operatorAuthorities = operatorQuery.data?.operator?.authorities || [];
    const authorities = authoritiesQuery.data?.authoritiesOptions || {};

    const operatorDepartments = operatorAuthorities.map(({ department }) => department);

    const availableDepartments = Object.keys(authorities)
      .filter(department => ![...operatorDepartments, ...unAvailableDepartments].includes(department));

    return (
      <div className="OperatorDepartments">
        <div className="OperatorDepartments__title">
          {I18n.t('OPERATORS.PROFILE.DEPARTMENTS.LABEL')}
        </div>

        {/* Authorities list */}
        <div className="OperatorDepartments__list">
          {operatorAuthorities.map(({ department, role }) => (
            <div className="OperatorDepartments__item" key={`${department}-${role}`}>
              <div className="OperatorDepartments__item-title">
                {I18n.t(renderLabel(department, departmentsLabels))}
                {' - '}
                {I18n.t(renderLabel(role, rolesLabels))}
              </div>

              <If condition={operatorUuid !== auth.uuid}>
                <PermissionContent permissions={permissions.OPERATORS.DELETE_AUTHORITY}>
                  <i
                    className="fa fa-trash OperatorDepartments__item-remove"
                    onClick={() => this.handleRemoveAuthority(department, role)}
                  />
                </PermissionContent>
              </If>
            </div>
          ))}
        </div>

        {/* Authority creation button and form */}
        <If condition={operatorUuid !== auth.uuid}>
          <PermissionContent permissions={permissions.OPERATORS.ADD_AUTHORITY}>
            <Choose>
              <When condition={!isVisibleDepartmentCreationForm}>
                <Button
                  small
                  tertiary
                  disabled={operatorQuery.loading}
                  className="OperatorDepartments__add-button"
                  onClick={this.toggleDepartmentCreationFormVisibility}
                >
                  {I18n.t('OPERATORS.PROFILE.DEPARTMENTS.ADD_BUTTON_LABEL')}
                </Button>
              </When>
              <Otherwise>
                <hr />

                <Formik
                  initialValues={{}}
                  validate={
                    createValidator({
                      department: ['required'],
                      role: ['required'],
                    }, translateLabels(attributeLabels))
                  }
                  validateOnBlur={false}
                  validateOnChange={false}
                  onSubmit={this.handleAddAuthority}
                >
                  {({ isSubmitting, values }) => {
                    const availableRoles = values.department
                      ? authorities[values.department]
                      : [];

                    return (
                      <Form className="OperatorDepartments__form">
                        <Field
                          name="department"
                          className="OperatorDepartments__form-field"
                          label={I18n.t(attributeLabels.department)}
                          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                          component={FormikSelectField}
                          disabled={isSubmitting}
                        >
                          {availableDepartments.map(department => (
                            <option key={department} value={department}>
                              {I18n.t(renderLabel(department, departmentsLabels))}
                            </option>
                          ))}
                        </Field>

                        <Field
                          name="role"
                          label={I18n.t(attributeLabels.role)}
                          className="OperatorDepartments__form-field"
                          component={FormikSelectField}
                          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                          disabled={!availableRoles.length}
                        >
                          {availableRoles.map(role => (
                            <option key={role} value={role}>
                              {I18n.t(renderLabel(role, rolesLabels))}
                            </option>
                          ))}
                        </Field>

                        <div className="OperatorDepartments__form-buttons">
                          <Button
                            primary
                            className="OperatorDepartments__form-button"
                            disabled={isSubmitting}
                            type="submit"
                          >
                            {I18n.t('COMMON.SAVE')}
                          </Button>

                          <Button
                            secondary
                            className="OperatorDepartments__form-button"
                            onClick={this.toggleDepartmentCreationFormVisibility}
                          >
                            {I18n.t('COMMON.CANCEL')}
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </Otherwise>
            </Choose>
          </PermissionContent>
        </If>
      </div>
    );
  }
}

export default compose(
  withStorage(['auth']),
  withNotifications,
  withRequests({
    addAuthority: AddAuthorityMutation,
    removeAuthority: RemoveAuthorityMutation,
    authoritiesQuery: AuthoritiesOptionsQuery,
  }),
)(OperatorDepartments);
