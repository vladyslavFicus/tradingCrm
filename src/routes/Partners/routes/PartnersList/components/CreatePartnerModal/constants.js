import React from 'react';
import keyMirror from 'keymirror';
import { fieldTypes } from 'components/ReduxForm/ReduxFieldsConstructor';

const attributeLabels = {
  firstName: 'COMMON.FIRST_NAME',
  lastName: 'COMMON.LAST_NAME',
  email: 'COMMON.EMAIL',
  phone: 'COMMON.PHONE',
  department: 'COMMON.DEPARTMENT',
  role: 'COMMON.ROLE',
  branch: 'COMMON.BRANCH',
  password: 'COMMON.PASSWORD',
};

const fieldNames = keyMirror({
  department: null,
  role: null,
});

const getBranchOption = branchType => [{ value: branchType, label: `COMMON.${branchType}` }];

const branchField = (
  branchTypeSelected,
  options,
) => {
  const placeholder = (!Array.isArray(options) || options.length === 0)
    ? 'COMMON.SELECT_OPTION.NO_ITEMS'
    : 'COMMON.SELECT_OPTION.DEFAULT';

  return {
    type: fieldTypes.SELECT,
    name: 'branch',
    label: attributeLabels.branch,
    disabled: !branchTypeSelected || options.length === 0,
    placeholder: branchTypeSelected ? placeholder : 'COMMON.SELECT_OPTION.SELECT_BRANCH_TYPE',
    withAnyOption: false,
    className: 'col-md-6',
    selectOptions: options || [],
  };
};

const formFields = handleGeneratePassword => [{
  type: fieldTypes.INPUT,
  name: 'firstName',
  label: attributeLabels.firstName,
  id: 'create-new-operator-first-name',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'lastName',
  label: attributeLabels.lastName,
  id: 'create-new-operator-last-name',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'email',
  label: attributeLabels.email,
  id: 'create-new-operator-email',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'password',
  label: attributeLabels.password,
  onIconClick: handleGeneratePassword,
  inputAddon: <span className="icon-generate-password" />,
  inputAddonPosition: 'right',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'phone',
  label: attributeLabels.phone,
  id: 'create-new-operator-phone',
  className: 'col-md-6',
  showErrorMessage: true,
}];

export {
  attributeLabels,
  branchField,
  formFields,
  fieldNames,
  getBranchOption,
};
