import { createValidator } from '../../../../../../utils/validator';
import { customValueFieldTypes } from '../../../../../../constants/form';

export default (values) => {
  const rules = {
    name: ['required', 'string'],
    lockAmountStrategy: ['required', 'string'],
    moneyTypePriority: ['required', 'string'],
    'maxBet[0].amount': ['numeric', 'greater:0', 'max: 1000000'],
    bonusLifeTime: ['required', 'integer'],
  };

  ['grantRatio', 'wageringRequirement'].forEach((field) => {
    if (values[field].type === customValueFieldTypes.ABSOLUTE) {
      rules[`${field}.absolute[0].amount`] = ['required', 'numeric', 'greater:0', 'max: 1000000'];
    } else {
      rules[`${field}.percentage`] = ['required', 'numeric', 'greater:0'];
    }
  });

  if (values.prizeCapingType === customValueFieldTypes.ABSOLUTE) {
    rules['capping.absolute[0].amount'] = ['numeric', 'min:1', 'max: 1000000'];
    rules['prize.absolute[0].amount'] = ['numeric', 'min:1', 'max: 1000000', 'lessOrSame:capping.absolute[0].amount'];
  } else {
    rules['capping.percentage'] = ['numeric', 'greater:0'];
    rules['prize.percentage'] = ['numeric', 'greater:0', 'lessOrSame:capping.percentage'];
  }

  if (values.grantRatio.type === customValueFieldTypes.PERCENTAGE) {
    rules['maxGrantAmount[0].amount'] = ['required', 'numeric', 'greater:0'];
  }

  return createValidator(rules, {}, false)(values);
};
