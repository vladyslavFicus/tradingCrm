import { accountTypes } from 'constants/accountTypes';
import {
  fieldTypes,
  fieldClassNames,
} from 'components/ReduxForm/ReduxFieldsConstructor';

export default () => [{
  type: fieldTypes.SELECT,
  name: 'accountType',
  label: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE',
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.SMALL,
  selectOptions: accountTypes.map(({ label, value }) => ({ value, label })),
}];
