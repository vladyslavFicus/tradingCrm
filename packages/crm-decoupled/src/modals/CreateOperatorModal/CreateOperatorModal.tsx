import React from 'react';
import { useNavigate } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { omit } from 'lodash';
import { Utils, Constants, parseErrors, notify, Types } from '@crm/common';
import { HierarchyBranch } from '__generated__/types';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import Modal from 'components/Modal';
import { ExistingOperatorModalProps } from '../ExistingOperatorModal';
import { useAuthoritiesOptionsQuery } from './graphql/__generated__/AuthoritiesOptionsQuery';
import { useHierarchyUserBranchesQuery } from './graphql/__generated__/HierarchyUserBranchesQuery';
import { useCreateOperatorMutation } from './graphql/__generated__/CreateOperatorMutation';
import './CreateOperatorModal.scss';

const attributeLabels = {
  firstName: 'COMMON.FIRST_NAME',
  lastName: 'COMMON.LAST_NAME',
  email: 'COMMON.EMAIL',
  phone: 'COMMON.PHONE',
  department: 'COMMON.DEPARTMENT',
  role: 'COMMON.ROLE',
  userType: 'COMMON.USER_TYPE',
  branch: 'COMMON.BRANCH',
  branchType: 'COMMON.BRANCH_TYPE',
  password: 'COMMON.PASSWORD',
};

export type ExistValues = Omit<ExistingOperatorModalProps, 'onCloseModal'>;

type FormValues = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone: string,
  userType: string,
  department: string,
  role: string,
  branchType: string,
  branchId: string,
};

export type Props = {
  onExists: (values: ExistValues) => void,
  onCloseModal: () => void,
};

const CreateOperatorModal = (props: Props) => {
  const { onExists, onCloseModal } = props;

  const navigate = useNavigate();

  const userTypesOptions = Object.keys(omit(Constants.userTypes, ['CUSTOMER', 'LEAD_CUSTOMER', 'AFFILIATE_PARTNER']));

  // ===== Requests ===== //
  const authoritiesOptionsQuery = useAuthoritiesOptionsQuery();

  const authorities: Record<string, Array<string>> = authoritiesOptionsQuery.data?.authoritiesOptions || {};
  const departmentsRoles = omit(authorities, 'AFFILIATE');

  const hierarchyUserBranchesQuery = useHierarchyUserBranchesQuery();

  const branchesByType: Record<string, HierarchyBranch[] | null> = hierarchyUserBranchesQuery.data?.userBranches || {};
  const branchTypesOptions = Object.keys(omit(branchesByType, '__typename'));

  const [createOperatorMutation] = useCreateOperatorMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    try {
      const { data } = await createOperatorMutation({ variables: values });

      const uuid = data?.operator?.createOperator?.uuid;

      if (uuid) {
        navigate(`/operators/${uuid}`);
      }

      onCloseModal();
    } catch (e) {
      const { error } = parseErrors(e);

      if (error === 'error.validation.email.exists') {
        const { email, department, role, branchId, userType } = values;

        onCloseModal();

        onExists({ email, department, role, branchId, userType });
      } else {
        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('COMMON.SOMETHING_WRONG'),
        });
      }
    }
  };

  const handleGeneratePassword = () => Utils.generate();

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        userType: '',
        department: '',
        role: '',
        branchType: '',
        branchId: '',
      }}
      validate={Utils.createValidator(
        {
          firstName: ['required', 'string', 'min:2'],
          lastName: ['required', 'string', 'min:2'],
          email: ['required', 'email'],
          password: [
            'required',
            `regex:${Constants.Operator.passwordPattern}`,
            `max:${Constants.Operator.passwordMaxSize}`,
          ],
          phone: 'min:3',
          userType: 'required',
          department: 'required',
          role: 'required',
          branchType: 'required',
          branchId: 'required',
        },
        Utils.translateLabels(attributeLabels),
        false,
        {
          'regex.password': Constants.Operator.passwordCustomError,
        },
      )}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, setFieldValue, submitForm }) => {
        const departmentsOptions = Object.keys(departmentsRoles).sort();
        const rolesOptions = departmentsRoles[values.department] || [];
        const branchesOptions = branchesByType[values.branchType] || [];

        const placeholderBranchType = branchesOptions.length
          ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
          : I18n.t('COMMON.SELECT_OPTION.DEFAULT');

        return (
          <Modal
            onCloseModal={onCloseModal}
            title={I18n.t('MODALS.CREATE_OPERATOR_MODAL.TITLE')}
            buttonTitle={I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
            disabled={isSubmitting}
            clickSubmit={submitForm}
            note={(
              <>
                <b>{I18n.t('MODALS.CREATE_OPERATOR_MODAL.NOTE')}</b>
                {': '}
                {I18n.t('MODALS.CREATE_OPERATOR_MODAL.NOTE_MESSAGE')}
              </>
            )}
          >
            <Form>
              <Field
                name="firstName"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-firstNameInput"
                label={I18n.t(attributeLabels.firstName)}
                placeholder={I18n.t(attributeLabels.firstName)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="lastName"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-lastNameInput"
                label={I18n.t(attributeLabels.lastName)}
                placeholder={I18n.t(attributeLabels.lastName)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="email"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-emailInput"
                label={I18n.t(attributeLabels.email)}
                placeholder={I18n.t(attributeLabels.email)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="password"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-passwordInput"
                label={I18n.t(attributeLabels.password)}
                placeholder={I18n.t(attributeLabels.password)}
                addition={<span className="icon-generate-password" />}
                onAdditionClick={() => setFieldValue('password', handleGeneratePassword())}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="phone"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-phoneInput"
                label={I18n.t(attributeLabels.phone)}
                placeholder={I18n.t(attributeLabels.phone)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="userType"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-userTypeSelect"
                label={I18n.t(attributeLabels.userType)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={isSubmitting}
                searchable
              >
                {userTypesOptions.map(userType => (
                  <option key={userType} value={userType}>
                    {I18n.t(Utils.renderLabel(userType, Constants.userTypeLabels))}
                  </option>
                ))}
              </Field>

              <Field
                name="department"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-departmentSelect"
                label={I18n.t(attributeLabels.department)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={isSubmitting}
                searchable
              >
                {departmentsOptions.map(department => (
                  <option key={department} value={department}>
                    {I18n.t(Utils.renderLabel(department, Constants.Operator.departmentsLabels))}
                  </option>
                ))}
              </Field>

              <Field
                name="role"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-roleSelect"
                label={I18n.t(attributeLabels.role)}
                placeholder={
                    rolesOptions.length
                      ? I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                      : I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                  }
                component={FormikSelectField}
                disabled={isSubmitting || !rolesOptions.length}
                searchable
              >
                {rolesOptions.map(role => (
                  <option key={role} value={role}>
                    {I18n.t(Utils.renderLabel(role, Constants.Operator.rolesLabels))}
                  </option>
                ))}
              </Field>

              <Field
                name="branchType"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-branchTypeSelect"
                label={I18n.t(attributeLabels.branchType)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={isSubmitting}
                searchable
              >
                {branchTypesOptions.map(branchType => (
                  <option key={branchType} value={branchType}>
                    {I18n.t(`COMMON.${branchType}`)}
                  </option>
                ))}
              </Field>

              <Field
                name="branchId"
                className="CreateOperatorModal__field"
                data-testid="CreateOperatorModal-branchIdSelect"
                label={I18n.t(attributeLabels.branch)}
                placeholder={
                    values.branchType
                      ? placeholderBranchType
                      : I18n.t('COMMON.SELECT_OPTION.SELECT_BRANCH_TYPE')
                  }
                component={FormikSelectField}
                disabled={isSubmitting || !branchesOptions.length}
                searchable
              >
                {branchesOptions.map(({ name, uuid }) => (
                  <option key={uuid} value={uuid}>
                    {name}
                  </option>
                ))}
              </Field>
            </Form>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default React.memo(CreateOperatorModal);
