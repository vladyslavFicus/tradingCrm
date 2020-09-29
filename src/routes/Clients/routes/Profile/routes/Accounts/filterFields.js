import { accountTypes } from 'constants/accountTypes';
import {
  fieldTypes,
  fieldClassNames,
} from 'components/ReduxForm/ReduxFieldsConstructor';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';

export default () => {
  const platformTypes = getAvailablePlatformTypes();

  const filterFields = [{
    type: fieldTypes.SELECT,
    name: 'accountType',
    label: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE',
    placeholder: 'COMMON.SELECT_OPTION.ANY',
    className: fieldClassNames.SMALL,
    selectOptions: accountTypes.map(({ label, value }) => ({ value, label })),
  }];

  if (platformTypes.length > 1) {
    filterFields.push({
      type: fieldTypes.SELECT,
      name: 'platformType',
      label: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PLATFORM_TYPE',
      placeholder: 'COMMON.SELECT_OPTION.ANY',
      className: fieldClassNames.SMALL,
      selectOptions: platformTypes.map(({ label, value }) => ({ value, label })),
    });
  }

  return filterFields;
};
