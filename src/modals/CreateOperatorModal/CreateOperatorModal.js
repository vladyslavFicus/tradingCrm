import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { omit, get } from 'lodash';
import { parseErrors } from 'apollo';
import {
  departmentsLabels,
  rolesLabels,
  passwordPattern,
} from 'constants/operators';
import { Button } from 'components/UI';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { generate } from 'utils/password';
import renderLabel from 'utils/renderLabel';
import { createValidator, translateLabels } from 'utils/validator';
import { userTypes, userTypeLabels } from 'constants/hierarchyTypes';
import { attributeLabels, customErrors } from './constants';

const validator = createValidator({
  firstName: ['required', 'string', 'min:2'],
  lastName: ['required', 'string', 'min:2'],
  email: ['required', 'email'],
  password: ['required', `regex:${passwordPattern}`],
  phone: 'min:3',
  department: 'required',
  userType: 'required',
  role: 'required',
  branchType: 'required',
  branch: 'required',
}, translateLabels(attributeLabels), false, customErrors);

class CreateOperatorModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onExist: PropTypes.func.isRequired,
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    isOpen: PropTypes.bool.isRequired,
    branchHierarchy: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      teams: PropTypes.array,
      desks: PropTypes.array,
      offices: PropTypes.array,
      brands: PropTypes.array,
      branchTypes: PropTypes.array,
    }).isRequired,
    modals: PropTypes.shape({
      existingOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    submitNewOperator: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    history: PropTypes.router.history.isRequired,
  };

  state = {
    selectedBranchType: '',
    selectedDepartment: '',
    branches: null,
  };

  onSubmit = async ({ department, role, branch, email, ...data }) => {
    const {
      submitNewOperator,
      notify,
      onCloseModal,
      onExist,
    } = this.props;

    try {
      const {
        data: operatorData,
      } = await submitNewOperator({
        variables: { ...data, department, role, email, branchId: branch },
      });

      const { uuid } = get(operatorData, 'operator.createOperator');

      this.props.history.push(`/operators/${uuid}/profile`);
    } catch (e) {
      const { error } = parseErrors(e);

      if (error === 'error.validation.email.exists') {
        onExist({
          department,
          role,
          branchId: branch,
          email,
        });
      } else {
        notify({
          level: 'error',
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('COMMON.SOMETHING_WRONG'),
        });
      }
    }

    onCloseModal();
  };

  handleBranchChange = (setFieldValue, selectedBranchType, fieldName) => {
    const branches = this.props.branchHierarchy[selectedBranchType]
      .map(({ uuid, name }) => ({ value: uuid, label: name }));

    setFieldValue(fieldName, selectedBranchType);

    this.setState({
      selectedBranchType,
      branches,
    });
  }

  handleDepartmentChange = (setFieldValue, value, name) => {
    setFieldValue(name, value);

    this.setState({ selectedDepartment: value });
  };

  render() {
    const {
      departmentsRoles,
      onCloseModal,
      isOpen,
      branchHierarchy: {
        loading,
        branchTypes,
      },
    } = this.props;

    const {
      selectedBranchType,
      selectedDepartment,
      branches,
    } = this.state;

    const placeholderRole = (departmentsRoles[selectedDepartment]
      && departmentsRoles[selectedDepartment].length)
      ? I18n.t('COMMON.SELECT_OPTION.DEFAULT')
      : I18n.t('COMMON.SELECT_OPTION.NO_ITEMS');

    const placeholderBranchType = (!Array.isArray(branches) || branches.length === 0)
      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
      : I18n.t('COMMON.SELECT_OPTION.DEFAULT');

    return (
      <Modal className="create-operator-modal CreateOperatorModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{}}
          validate={validator}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.onSubmit}
        >
          {({ isValid, dirty, isSubmitting, setFieldValue }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{I18n.t('OPERATORS.MODALS.NEW_OPERATOR.TITLE')}</ModalHeader>
              <ModalBody>
                <div className="row">
                  <Field
                    name="firstName"
                    className="col-md-6"
                    label={I18n.t(attributeLabels.lastName)}
                    placeholder={I18n.t(attributeLabels.lastName)}
                    component={FormikInputField}
                  />
                  <Field
                    name="lastName"
                    className="col-md-6"
                    label={I18n.t(attributeLabels.firstName)}
                    placeholder={I18n.t(attributeLabels.firstName)}
                    component={FormikInputField}
                  />
                  <Field
                    name="email"
                    type="email"
                    className="col-md-6"
                    label={I18n.t(attributeLabels.email)}
                    placeholder={I18n.t(attributeLabels.email)}
                    component={FormikInputField}
                  />
                  <Field
                    name="password"
                    className="col-md-6"
                    addition={<span className="icon-generate-password" />}
                    onAdditionClick={() => setFieldValue('password', generate())}
                    label={I18n.t(attributeLabels.password)}
                    placeholder={I18n.t(attributeLabels.password)}
                    component={FormikInputField}
                  />
                  <Field
                    name="phone"
                    type="phone"
                    className="col-md-6"
                    label={I18n.t(attributeLabels.phone)}
                    placeholder={I18n.t(attributeLabels.phone)}
                    component={FormikInputField}
                  />
                  <Field
                    name="userType"
                    className="col-md-6"
                    label={I18n.t(attributeLabels.userType)}
                    component={FormikSelectField}
                    searchable
                  >
                    {
                      Object.keys(
                        omit(userTypes, [
                          userTypes.CUSTOMER,
                          userTypes.LEAD_CUSTOMER,
                          userTypes.AFFILIATE_PARTNER,
                        ]),
                      ).map(userType => (
                        <option key={userType} value={userType}>
                          {I18n.t(renderLabel(userType, userTypeLabels))}
                        </option>
                      ))
                    }
                  </Field>
                  <Field
                    name="department"
                    className="col-md-6"
                    label={I18n.t(attributeLabels.department)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    component={FormikSelectField}
                    customOnChange={value => this.handleDepartmentChange(setFieldValue, value, 'department')}
                    disabled={isSubmitting}
                  >
                    {
                      Object
                        .keys(departmentsRoles)
                        .sort()
                        .map(department => (
                          <option key={department} value={department}>
                            {I18n.t(renderLabel(department, departmentsLabels))}
                          </option>
                        ))
                    }
                  </Field>
                  <Field
                    name="role"
                    className="col-md-6"
                    label={I18n.t(attributeLabels.role)}
                    placeholder={selectedDepartment
                      ? placeholderRole
                      : I18n.t('COMMON.SELECT_OPTION.SELECT_DEPARTMENT')}
                    component={FormikSelectField}
                    disabled={!selectedDepartment}
                  >
                    {
                      (departmentsRoles[selectedDepartment] || []).map(role => (
                        <option key={role} value={role}>
                          {I18n.t(renderLabel(role, rolesLabels))}
                        </option>
                      ))
                    }
                  </Field>
                  <div className="form-group col-md-6">
                    <Field
                      name="branchType"
                      component={FormikSelectField}
                      label={I18n.t(attributeLabels.branchType)}
                      placeholder={loading
                        ? I18n.t('COMMON.SELECT_OPTION.LOADING')
                        : I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      disabled={loading}
                      customOnChange={value => this.handleBranchChange(setFieldValue, value, 'branchType')}
                    >
                      {branchTypes.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {I18n.t(label)}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <Field
                    name="branch"
                    className="col-md-6"
                    searchable
                    label={I18n.t(attributeLabels.branch)}
                    component={FormikSelectField}
                    placeholder={selectedBranchType
                      ? placeholderBranchType
                      : I18n.t('COMMON.SELECT_OPTION.SELECT_BRANCH_TYPE')}
                    disabled={!selectedBranchType || !branches}
                  >
                    {(branches || []).map(({ value, label }) => (
                      <option key={value} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))}
                  </Field>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="row">
                  <div className="col-5 text-muted font-size-12 text-left">
                    <b>{I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE')}</b>:
                    {I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE_MESSAGE')}
                  </div>
                  <div className="col-7 text-right">
                    <Button
                      default
                      commonOutline
                      className="CreateOperatorModal__button margin-0 margin-right-15"
                      onClick={onCloseModal}
                    >
                      {I18n.t('COMMON.BUTTONS.CANCEL')}
                    </Button>
                    <Button
                      type="submit"
                      primary
                      className="CreateOperatorModal__button margin-0"
                      disabled={!dirty && !isValid && isSubmitting}
                    >
                      {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default CreateOperatorModal;
