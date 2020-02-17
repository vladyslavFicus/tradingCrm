import React from 'react';
import keyMirror from 'keymirror';
import { fieldTypes } from 'components/ReduxForm/ReduxFieldsConstructor';
import { affiliateTypeLabels } from '../../../../constants';

const attributeLabels = {
  firstName: 'COMMON.FIRST_NAME',
  lastName: 'COMMON.LAST_NAME',
  email: 'COMMON.EMAIL',
  phone: 'COMMON.PHONE',
  department: 'COMMON.DEPARTMENT',
  role: 'COMMON.ROLE',
  branch: 'COMMON.BRANCH',
  password: 'COMMON.PASSWORD',
  affiliateType: 'COMMON.PARTNER_TYPE',
  externalAffiliateId: 'COMMON.EXTERNAL_AFILIATE_ID',
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

const formFields = (handleGeneratePassword, handleGenerateExternalId) => [{
  type: fieldTypes.INPUT,
  name: 'firstName',
  label: attributeLabels.firstName,
  id: 'create-new-partner-first-name',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'lastName',
  label: attributeLabels.lastName,
  id: 'create-new-partner-last-name',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.INPUT,
  name: 'email',
  label: attributeLabels.email,
  id: 'create-new-partner-email',
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
  id: 'create-new-partner-phone',
  className: 'col-md-6',
  showErrorMessage: true,
}, {
  type: fieldTypes.SELECT,
  name: 'affiliateType',
  label: attributeLabels.affiliateType,
  id: 'create-new-partner-affiliateType',
  placeholder: 'COMMON.SELECT_OPTION.SELECT_PARTNER_TYPE',
  className: 'col-md-6',
  showErrorMessage: true,
  disabled: Object.keys(affiliateTypeLabels).length === 1,
  selectOptions: Object.keys(affiliateTypeLabels).map(value => ({
    value,
    label: affiliateTypeLabels[value],
  })),
  withAnyOption: false,
  searchable: false,
}, {
  type: fieldTypes.INPUT,
  name: 'externalAffiliateId',
  label: attributeLabels.externalAffiliateId,
  onIconClick: handleGenerateExternalId,
  inputAddon: <span className="icon-generate-password" />,
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
