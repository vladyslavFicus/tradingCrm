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
    betPerLineAmounts: {
      0: {
        amount: ['required', 'numeric', 'greater:0'],
      },
    },
    pageCode: ['required', 'string'],
    betLevel: ['required', 'integer'],
    coinSize: ['required', 'integer'],
    rhfpBet: ['required', 'integer'],
    comment: ['string'],
    betMultiplier: ['integer', 'required'],
    bonusTemplateUUID: {
      uuid: ['required', 'string'],
    },
  };

  rules = fields.reduce((acc, curr) => ({ ...acc, [curr]: rules[curr] }), {});

  return createValidator({
    ...rules,
    name: ['string', 'required'],
    providerId: ['string', 'required'],
    gameId: ['string', 'required'],
    internalGameId: ['string'],
    aggregatorId: ['string', 'required'],
  }, translateLabels(attributeLabels), false)(values);
};
