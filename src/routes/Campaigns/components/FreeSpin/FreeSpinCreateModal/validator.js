import { get } from 'lodash';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import { attributeLabels } from '../constants';

export default (values, {
  aggregatorId,
  freeSpinOptions: {
    freeSpinOptions,
  },
}) => {
  const fields = get(freeSpinOptions, `[${aggregatorId}].fields`, []);
  let rules = {
    freeSpinsAmount: ['integer', 'min:0', 'required'],
    freeSpinLifeTime: ['integer', 'min:0', 'required'],
    linesPerSpin: ['integer', 'required'],
    betPerLine: ['numeric', 'min:0', 'required'],
    pageCode: ['required', 'string'],
    betLevel: ['required', 'integer'],
    coinSize: ['required', 'integer'],
    rhfpBet: ['required', 'integer'],
    betPerLineAmounts: ['required'],
    comment: ['string'],
    betMultiplier: ['integer', 'required'],
    bonusTemplateUUID: ['required', 'string'],
  };

  rules = fields.reduce((acc, curr) => ({ ...acc, [curr]: rules[curr] }), {});

  return createValidator({
    ...rules,
    currency: ['string', 'required'],
    name: ['string', 'required'],
    providerId: ['string', 'required'],
    gameId: ['string', 'required'],
    aggregatorId: ['string', 'required'],
  }, translateLabels(attributeLabels), false)(values);
};
