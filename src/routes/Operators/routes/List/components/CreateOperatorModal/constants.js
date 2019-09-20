import React from 'react';
import keyMirror from 'keymirror';
import { fieldTypes } from 'components/ReduxForm/ReduxFieldsConstructor';
import I18n from 'utils/fake-i18n';
import renderLabel from 'utils/renderLabel';

const attributeLabels = {
  firstName: I18n.t('COMMON.FIRST_NAME'),
  lastName: I18n.t('COMMON.LAST_NAME'),
  email: I18n.t('COMMON.EMAIL'),
  phone: I18n.t('COMMON.PHONE'),
  department: I18n.t('COMMON.DEPARTMENT'),
  role: I18n.t('COMMON.ROLE'),
  branch: I18n.t('COMMON.BRANCH'),
  password: I18n.t('COMMON.PASSWORD'),
};

const fieldNames = keyMirror({
  department: null,
  role: null,
});

const getBranchOption = branchType => [{ value: branchType, label: I18n.t(`COMMON.${branchType}`) }];

const branchField = (
  branchTypeSelected,
  options,
) => {
  const placeholder = (!Array.isArray(options) || options.length === 0)
    ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
    : I18n.t('COMMON.SELECT_OPTION.DEFAULT');

  return {
    type: fieldTypes.SELECT,
    name: 'branch',
    label: I18n.t(attributeLabels.branch),
    disabled: !branchTypeSelected || options.length === 0,
    placeholder: branchTypeSelected ? placeholder : I18n.t('COMMON.SELECT_OPTION.SELECT_BRANCH_TYPE'),
    withAnyOption: false,
    className: 'col-md-6',
    selectOptions: options || [],
  };
};

const formFields = ({
  departmentsLabels,
  departmentsRoles,
  rolesLabels,
  formValues,
}, handleGeneratePassword) => [{
  type: fieldTypes.INPUT,
  name: 'firstName',
  label: I18n.t(attributeLabels.firstName),
  id: 'create-new-operator-first-name',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'lastName',
  label: I18n.t(attributeLabels.lastName),
  id: 'create-new-operator-last-name',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'email',
  label: I18n.t(attributeLabels.email),
  id: 'create-new-operator-email',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'password',
  label: I18n.t(attributeLabels.password),
  onIconClick: handleGeneratePassword,
  inputAddon: <span className="icon-generate-password" />,
  inputAddonPosition: 'right',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'phone',
  label: I18n.t(attributeLabels.phone),
  id: 'create-new-operator-phone',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.SELECT,
  name: fieldNames.department,
  label: I18n.t(attributeLabels.department),
  customOnChange: true,
  withAnyOption: false,
  searchable: false,
  className: 'col-md-6',
  selectOptions: Object
    .keys(departmentsRoles)
    .map(value => ({ value, label: renderLabel(value, departmentsLabels) })),
}, {
  type: fieldTypes.SELECT,
  name: fieldNames.role,
  label: I18n.t(attributeLabels.role),
  disabled: !formValues,
  withAnyOption: false,
  searchable: false,
  className: 'col-md-6',
  selectOptions: formValues.department && departmentsRoles[formValues.department]
    .map(value => ({ value, label: renderLabel(value, rolesLabels) })),
}];

export {
  attributeLabels,
  branchField,
  formFields,
  fieldNames,
  getBranchOption,
};
