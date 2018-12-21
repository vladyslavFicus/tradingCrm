import { fieldTypes, fieldClassNames } from '../ReduxForm/ReduxFieldsConstructor';
import I18n from '../../utils/fake-i18n';

export const attributeLabels = {
  operators: I18n.t('COMMON.CHOOSE_OPERATOR'),
};

export const formFields = (disabled, operators) => [{
  type: fieldTypes.SELECT,
  name: 'operatorId',
  label: I18n.t(attributeLabels.operators),
  placeholder: I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
  className: fieldClassNames.MEDIUM,
  disabled,
  withAnyOption: false,
  selectOptions: operators.map(({ uuid, fullName }) => ({ value: uuid, label: fullName })),
}];
