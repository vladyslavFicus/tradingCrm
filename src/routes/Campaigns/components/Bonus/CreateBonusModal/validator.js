import { createValidator } from '../../../../../utils/validator';
import { customValueFieldTypes } from '../../../../../constants/form';

export default (values) => {
  const rules = {
    name: ['required', 'string'],
    lockAmountStrategy: ['required', 'string'],
    moneyTypePriority: ['required', 'string'],
    wagerWinMultiplier: ['required', 'numeric'],
    'maxBet[0].amount': ['required', 'numeric', 'greater:0'],
    bonusLifeTime: ['required', 'integer'],
  };

  ['grantRatio', 'wageringRequirement'].forEach((field) => {
    if (values[field].type === customValueFieldTypes.ABSOLUTE) {
      rules[`${field}.absolute[0].amount`] = ['required', 'numeric', 'greater:0'];
    } else {
      rules[`${field}.percentage`] = ['required', 'numeric', 'greater:0'];
    }
  });

  if (values.prizeCapingType === customValueFieldTypes.ABSOLUTE) {
    rules['capping.absolute[0].amount'] = ['numeric', 'greater:0'];
    rules['prize.absolute[0].amount'] = ['numeric', 'greater:0'];
  } else {
    rules['capping.percentage'] = ['required', 'numeric', 'greater:0'];
    rules['prize.percentage'] = ['required', 'numeric', 'greater:0'];
  }


  if (values.grantRatio.type === customValueFieldTypes.PERCENTAGE) {
    rules['maxGrantAmount[0].amount'] = ['required', 'numeric', 'greater:0'];
  }

  return createValidator(rules, {}, false)(values);
};
