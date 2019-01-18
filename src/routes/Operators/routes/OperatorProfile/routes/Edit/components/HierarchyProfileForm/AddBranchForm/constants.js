import { omit } from 'lodash';
import { fieldTypes } from 'components/ReduxForm/ReduxFieldsConstructor';
import { branchTypes as branches } from 'constants/hierarchyTypes';
import I18n from 'utils/fake-i18n';

const fieldNames = {
  BRANCH: 'branch',
};

const branchTypes = Object
  .keys(omit(
    branches,
    [branches.COMPANY, branches.BRAND]
  ))
  .map(value => ({ value, label: I18n.t(`COMMON.${value}`) }));

const branchField = (
  branchTypeSelected,
  branchesLoading,
  options,
) => {
  const placeholder = (!Array.isArray(options) || options.length === 0)
    ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
    : I18n.t('COMMON.SELECT_OPTION.DEFAULT');

  return {
    type: fieldTypes.SELECT,
    name: fieldNames.BRANCH,
    label: I18n.t('COMMON.BRANCH'),
    disabled: branchesLoading || !branchTypeSelected || options.length === 0,
    placeholder: branchTypeSelected ? placeholder : I18n.t('COMMON.SELECT_OPTION.SELECT_BRANCH_TYPE'),
    withAnyOption: false,
    className: 'col-md-4',
    selectOptions: options || [],
  };
};

export {
  branchTypes,
  branchField,
  fieldNames,
};
