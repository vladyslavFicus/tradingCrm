import { I18n } from 'react-redux-i18n';
import { accountTypes } from 'constants/accountTypes';
import {
  fieldTypes,
  fieldClassNames,
} from 'components/ReduxForm/ReduxFieldsConstructor';

const attributeLabels = {
  accountType: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE',
};

export default () => [{
  type: fieldTypes.SELECT,
  name: 'accountType',
  label: I18n.t(attributeLabels.accountType),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.SMALL,
  selectOptions: accountTypes.map(({ label, value }) => ({ value, label })),
}];
