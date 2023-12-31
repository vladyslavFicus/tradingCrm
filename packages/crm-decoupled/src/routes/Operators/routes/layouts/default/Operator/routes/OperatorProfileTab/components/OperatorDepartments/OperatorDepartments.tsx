import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, Constants } from '@crm/common';
import { Button, FormikSingleSelectField } from 'components';
import { Operator } from '__generated__/types';
import useOperatorDepartments from 'routes/Operators/routes/hooks/useOperatorDepartments';
import './OperatorDepartments.scss';

const attributeLabels = {
  department: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.DEPARTMENT',
  role: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.ROLE',
};

type Props = {
  operator: Operator,
  isCurrentOperator: boolean,
  onRefetch: () => void,
};

const OperatorDepartments = (props: Props) => {
  const {
    operator,
    isCurrentOperator,
    onRefetch,
  } = props;

  const {
    allowDeleteAuthority,
    allowAddAuthority,
    availableDepartments,
    isVisibleCreationForm,
    operatorAuthorities,
    availableRoles,
    toggleVisibilityCreationForm,
    handleAddAuthority,
    handleRemoveAuthority,
  } = useOperatorDepartments({
    operator,
    onRefetch,
  });

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
              {I18n.t(Utils.renderLabel(department, Constants.Operator.departmentsLabels))}
              {' - '}
              {I18n.t(Utils.renderLabel(role, Constants.Operator.rolesLabels))}
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
                Utils.createValidator({
                  department: ['required'],
                  role: ['required'],
                }, Utils.translateLabels(attributeLabels))
              }
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={handleAddAuthority}
            >
              {({ isSubmitting, values }) => {
                const availableRolesDepartment = availableRoles(values.department);

                return (
                  <Form className="OperatorDepartments__form">
                    <Field
                      name="department"
                      className="OperatorDepartments__form-field"
                      data-testid="OperatorDepartments-departmentSelect"
                      label={I18n.t(attributeLabels.department)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      component={FormikSingleSelectField}
                      disabled={isSubmitting}
                      options={availableDepartments.map(department => ({
                        label: I18n.t(Utils.renderLabel(department, Constants.Operator.departmentsLabels)),
                        value: department,
                      }))}
                    />

                    <Field
                      name="role"
                      label={I18n.t(attributeLabels.role)}
                      className="OperatorDepartments__form-field"
                      data-testid="OperatorDepartments-roleSelect"
                      component={FormikSingleSelectField}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      disabled={!availableRolesDepartment.length}
                      options={availableRolesDepartment.map((role: string) => ({
                        label: I18n.t(Utils.renderLabel(role, Constants.Operator.rolesLabels)),
                        value: role,
                      }))}
                    />

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
