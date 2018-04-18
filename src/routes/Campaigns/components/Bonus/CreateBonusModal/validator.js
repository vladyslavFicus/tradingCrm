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

  ['prize', 'grantRatio', 'wageringRequirement', 'capping'].forEach((field) => {
    if (values[field].type === customValueFieldTypes.ABSOLUTE) {
      rules[`${field}.value[0].amount`] = ['required', 'numeric', 'greater:0'];
    } else {
      rules[`${field}.percentage`] = ['required', 'numeric', 'greater:0'];
    }
  });


  return createValidator({
    ...rules,
    name: ['string', 'required'],
    providerId: ['string', 'required'],
    gameId: ['string', 'required'],
    aggregatorId: ['string', 'required'],
  }, {}, false)(values);
};
