import { fieldTypes } from 'components/ReduxForm/ReduxFieldsConstructor';

const fieldNames = {
  BRANCH: 'branch',
};

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
    name: fieldNames.BRANCH,
    label: 'COMMON.BRANCH',
    disabled: !branchTypeSelected || options.length === 0,
    placeholder: branchTypeSelected ? placeholder : 'COMMON.SELECT_OPTION.SELECT_BRANCH_TYPE',
    withAnyOption: false,
    className: 'col-md-4',
    selectOptions: options || [],
    optionsWithoutI18n: true,
  };
};

export {
  fieldNames,
  branchField,
  getBranchOption,
};
