import { fieldTypes, fieldClassNames } from '../ReduxForm/ReduxFieldsConstructor';

export const attributeLabels = {
  operators: 'COMMON.CHOOSE_OPERATOR',
};

export const formFields = (disabled, operators) => [{
  type: fieldTypes.SELECT,
  name: 'operatorId',
  label: attributeLabels.operators,
  placeholder: 'COMMON.SELECT_OPTION.DEFAULT',
  className: fieldClassNames.MEDIUM,
  disabled,
  withAnyOption: false,
  selectOptions: operators.map(({ uuid, fullName }) => ({
    value: uuid,
    label: fullName,
  })),
  optionsWithoutI18n: true,
}];
