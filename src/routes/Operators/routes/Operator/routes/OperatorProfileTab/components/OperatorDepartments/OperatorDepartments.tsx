import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Operator } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { useAddAuthorityMutation } from './graphql/__generated__/AddAuthorityMutation';
import { useRemoveAuthorityMutation } from './graphql/__generated__/RemoveAuthorityMutation';
import { useAuthoritiesOptionsQuery } from './graphql/__generated__/AuthoritiesOptionsQuery';
import './OperatorDepartments.scss';

const attributeLabels = {
  department: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.DEPARTMENT',
  role: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.ROLE',
};

// unAvailableDepartments - is departments that can't be set to Operator
const unAvailableDepartments = ['AFFILIATE', 'AFFILIATE_PARTNER', 'PLAYER'];

type FormValues = {
  department: string,
  role: string,
};

type Props = {
  operator: Operator,
  isCurrentOperator: boolean,
  onRefetch: () => void,
};

const OperatorDepartments = (props: Props) => {
  const {
    operator: {
      uuid,
      authorities,
    },
    isCurrentOperator,
    onRefetch,
  } = props;

  const permission = usePermission();

  const allowDeleteAuthority = permission.allows(permissions.OPERATORS.DELETE_AUTHORITY);
  const allowAddAuthority = permission.allows(permissions.OPERATORS.ADD_AUTHORITY);

  const [isVisibleCreationForm, setIsVisibleCreationForm] = useState(false);

  // ===== Requests ===== //
  const authoritiesOptionsQuery = useAuthoritiesOptionsQuery();

  const operatorAuthorities = authorities || [];
  const queryAuthorities: Record<string, Array<string>> = authoritiesOptionsQuery?.data?.authoritiesOptions || {};

  const operatorDepartments = operatorAuthorities.map(({ department }) => department);

  const availableDepartments = Object.keys(queryAuthorities)
    .filter(department => ![...operatorDepartments, ...unAvailableDepartments].includes(department));

  const [addAuthorityMutation] = useAddAuthorityMutation();

  const [removeAuthorityMutation] = useRemoveAuthorityMutation();

  // ===== Handlers ===== //
  const toggleVisibilityCreationForm = () => {
    setIsVisibleCreationForm(!isVisibleCreationForm);
  };

  const handleAddAuthority = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      await addAuthorityMutation({ variables: { ...values, uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.MESSAGE'),
      });

      onRefetch();
      resetForm();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.MESSAGE'),
      });
    }
  };

  const handleRemoveAuthority = async (department: string, role: string) => {
    try {
      await removeAuthorityMutation({
        variables: {
          uuid,
          role,
          department,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.MESSAGE'),
      });

      onRefetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.MESSAGE'),
      });
    }
  };

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

            <If condition={!isCurrentOperator && allowDeleteAuthority}>
              <i
                className="fa fa-trash OperatorDepartments__item-remove"
                onClick={() => handleRemoveAuthority(department, role)}
              />
            </If>
          </div>
        ))}
      </div>

      {/* Authority creation button and form */}
      <If condition={!isCurrentOperator && allowAddAuthority}>
        <Choose>
          <When condition={!isVisibleCreationForm}>
            <Button
              small
              tertiary
              className="OperatorDepartments__add-button"
              data-testid="OperatorDepartments-addDepartmentButton"
              onClick={toggleVisibilityCreationForm}
            >
              {I18n.t('OPERATORS.PROFILE.DEPARTMENTS.ADD_BUTTON_LABEL')}
            </Button>
          </When>

          <Otherwise>
            <hr />

            <Formik
              initialValues={{ department: '', role: '' }}
              validate={
                createValidator({
                  department: ['required'],
                  role: ['required'],
                }, translateLabels(attributeLabels))
              }
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={handleAddAuthority}
            >
              {({ isSubmitting, values }) => {
                const availableRoles = queryAuthorities[values.department] || [];

                return (
                  <Form className="OperatorDepartments__form">
                    <Field
                      name="department"
                      className="OperatorDepartments__form-field"
                      data-testid="OperatorDepartments-departmentSelect"
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
                      data-testid="OperatorDepartments-roleSelect"
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
                        data-testid="OperatorDepartments-saveButton"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {I18n.t('COMMON.SAVE')}
                      </Button>

                      <Button
                        secondary
                        className="OperatorDepartments__form-button"
                        data-testid="OperatorDepartments-cancelButton"
                        onClick={toggleVisibilityCreationForm}
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
      </If>
    </div>
  );
};

export default React.memo(OperatorDepartments);
