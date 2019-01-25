import { fieldTypes } from 'components/ReduxForm/ReduxFieldsConstructor';
import I18n from 'utils/fake-i18n';

const fieldNames = {
  BRANCH: 'branch',
};

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
    name: fieldNames.BRANCH,
    label: I18n.t('COMMON.BRANCH'),
    disabled: !branchTypeSelected || options.length === 0,
    placeholder: branchTypeSelected ? placeholder : I18n.t('COMMON.SELECT_OPTION.SELECT_BRANCH_TYPE'),
    withAnyOption: false,
    className: 'col-md-4',
    selectOptions: options || [],
  };
};

export {
  fieldNames,
  branchField,
  getBranchOption,
};
