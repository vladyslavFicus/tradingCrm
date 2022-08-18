import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { omit } from 'lodash';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import {
  departmentsLabels,
  passwordCustomError,
  passwordMaxSize,
  passwordPattern,
  rolesLabels,
} from 'constants/operators';
import { userTypes, userTypeLabels } from 'constants/hierarchyTypes';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { generate } from 'utils/password';
import CreateOperatorMutation from './graphql/CreateOperatorMutation';
import AuthoritiesOptionsQuery from './graphql/AuthoritiesOptionsQuery';
import HierarchyUserBranchesQuery from './graphql/HierarchyUserBranchesQuery';
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

const validate = createValidator(
  {
    firstName: ['required', 'string', 'min:2'],
    lastName: ['required', 'string', 'min:2'],
    email: ['required', 'email'],
    password: ['required', `regex:${passwordPattern}`, `max:${passwordMaxSize}`],
    phone: 'min:3',
    userType: 'required',
    department: 'required',
    role: 'required',
    branchType: 'required',
    branchId: 'required',
  },
  translateLabels(attributeLabels),
  false,
  {
    'regex.password': passwordCustomError,
  },
);

class CreateOperatorModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    authoritiesQuery: PropTypes.query({
      authoritiesOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    }).isRequired,
    hierarchyUserBranchesQuery: PropTypes.query({
      userBranches: PropTypes.shape({
        BRAND: PropTypes.arrayOf(PropTypes.branchHierarchyType),
        OFFICE: PropTypes.arrayOf(PropTypes.branchHierarchyType),
        DESK: PropTypes.arrayOf(PropTypes.branchHierarchyType),
        TEAM: PropTypes.arrayOf(PropTypes.branchHierarchyType),
      }),
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    createOperator: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onExists: PropTypes.func.isRequired,
  };

  handleGeneratePassword = () => generate();

  handleSubmit = async (values) => {
    const {
      createOperator,
      onCloseModal,
      onExists,
      history,
      notify,
    } = this.props;

    try {
      const newOperator = await createOperator({ variables: values });

      const uuid = newOperator.data?.operator?.createOperator?.uuid;

      if (uuid) {
        history.push(`/operators/${uuid}/profile`);
      }

      onCloseModal();
    } catch (e) {
      const { error } = parseErrors(e);

      if (error === 'error.validation.email.exists') {
        const { email, department, role, branchId } = values || {};

        onCloseModal();
        onExists({ email, department, role, branchId });
      } else {
        notify({
          level: 'error',
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('COMMON.SOMETHING_WRONG'),
        });
      }
    }
  }

  render() {
    const {
      authoritiesQuery,
      hierarchyUserBranchesQuery,
      isOpen,
      onCloseModal,
    } = this.props;

    const authorities = authoritiesQuery.data?.authoritiesOptions || {};

    const departmentsRoles = omit(authorities, 'AFFILIATE');

    const userTypesOptions = Object.keys(omit(userTypes, ['CUSTOMER', 'LEAD_CUSTOMER', 'AFFILIATE_PARTNER']));

    const branchesByType = hierarchyUserBranchesQuery.data?.userBranches || {};
    const branchTypesOptions = Object.keys(omit(branchesByType, '__typename'));

    return (
      <Modal className="CreateOperatorModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{
            userType: '',
            department: '',
            role: '',
            branchType: '',
            branchId: '',
          }}
          validate={validate}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
        >
          {({
            values,
            isSubmitting,
            setFieldValue,
          }) => {
            const departmentsOptions = Object.keys(departmentsRoles).sort();
            const rolesOptions = values.department ? departmentsRoles[values.department] : [];
            const branchesOptions = values.branchType ? branchesByType[values.branchType] : [];

            const placeholderBranchType = branchesOptions.length
              ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
              : I18n.t('COMMON.SELECT_OPTION.DEFAULT');

            return (
              <Form>
                <ModalHeader toggle={onCloseModal}>{I18n.t('MODALS.CREATE_OPERATOR_MODAL.TITLE')}</ModalHeader>
                <ModalBody>
                  <Field
                    name="firstName"
                    className="CreateOperatorModal__field"
                    label={I18n.t(attributeLabels.firstName)}
                    placeholder={I18n.t(attributeLabels.firstName)}
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />
                  <Field
                    name="lastName"
                    className="CreateOperatorModal__field"
                    label={I18n.t(attributeLabels.lastName)}
                    placeholder={I18n.t(attributeLabels.lastName)}
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />
                  <Field
                    name="email"
                    className="CreateOperatorModal__field"
                    label={I18n.t(attributeLabels.email)}
                    placeholder={I18n.t(attributeLabels.email)}
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />
                  <Field
                    name="password"
                    className="CreateOperatorModal__field"
                    label={I18n.t(attributeLabels.password)}
                    placeholder={I18n.t(attributeLabels.password)}
                    addition={<span className="icon-generate-password" />}
                    onAdditionClick={() => setFieldValue('password', this.handleGeneratePassword())}
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />
                  <Field
                    name="phone"
                    className="CreateOperatorModal__field"
                    label={I18n.t(attributeLabels.phone)}
                    placeholder={I18n.t(attributeLabels.phone)}
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />
                  <Field
                    name="userType"
                    className="CreateOperatorModal__field"
                    label={I18n.t(attributeLabels.userType)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    component={FormikSelectField}
                    disabled={isSubmitting}
                    searchable
                  >
                    {userTypesOptions.map(userType => (
                      <option key={userType} value={userType}>
                        {I18n.t(renderLabel(userType, userTypeLabels))}
                      </option>
                    ))}
                  </Field>
                  <Field
                    name="department"
                    className="CreateOperatorModal__field"
                    label={I18n.t(attributeLabels.department)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    component={FormikSelectField}
                    disabled={isSubmitting}
                    searchable
                  >
                    {departmentsOptions.map(department => (
                      <option key={department} value={department}>
                        {I18n.t(renderLabel(department, departmentsLabels))}
                      </option>
                    ))}
                  </Field>
                  <Field
                    name="role"
                    className="CreateOperatorModal__field"
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
                        {I18n.t(renderLabel(role, rolesLabels))}
                      </option>
                    ))}
                  </Field>
                  <Field
                    name="branchType"
                    className="CreateOperatorModal__field"
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
                </ModalBody>
                <ModalFooter>
                  <div className="CreateOperatorModal__note">
                    <b>{I18n.t('MODALS.CREATE_OPERATOR_MODAL.NOTE')}</b>
                    {': '}
                    {I18n.t('MODALS.CREATE_OPERATOR_MODAL.NOTE_MESSAGE')}
                  </div>
                  <div className="CreateOperatorModal__buttons">
                    <Button
                      onClick={onCloseModal}
                      className="CreateOperatorModal__button"
                      commonOutline
                    >
                      {I18n.t('COMMON.BUTTONS.CANCEL')}
                    </Button>

                    <Button
                      className="CreateOperatorModal__button"
                      primary
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
                    </Button>
                  </div>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withRequests({
    createOperator: CreateOperatorMutation,
    authoritiesQuery: AuthoritiesOptionsQuery,
    hierarchyUserBranchesQuery: HierarchyUserBranchesQuery,
  }),
)(CreateOperatorModal);
