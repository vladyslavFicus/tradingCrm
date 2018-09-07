import { get } from 'lodash';
import { createValidator, translateLabels } from '../../../../../../utils/validator';
import { attributeLabels } from '../constants';

export default (values, {
  aggregatorId,
  freeSpinOptions: {
    freeSpinOptions,
  },
  gameId,
  games,
}) => {
  const fields = get(freeSpinOptions, `[${aggregatorId}].fields`, []);
  let rules = {
    freeSpinsAmount: ['integer', 'min:0', 'required'],
    freeSpinLifeTime: ['integer', 'min:0', 'required'],
    denomination: ['numeric', 'min:0', 'required'],
    coins: ['integer', 'required'],
    linesPerSpin: ['integer', 'required'],
    betPerLineAmounts: {
      0: {
        amount: ['required', 'numeric', 'greater:0'],
      },
    },
    pageCode: ['required', 'string'],
    betLevel: ['required', 'integer'],
    coinSize: ['required', 'numeric'],
    rhfpBet: ['required', 'integer'],
    comment: ['string'],
    clientId: ['string', 'required'],
    moduleId: ['string', 'required'],
    nearestCost: ['numeric', 'required'],
    displayLine1: ['string', 'max:255'],
    displayLine2: ['string', 'max:255'],
    betMultiplier: ['integer', 'required'],
    bonusTemplateUUID: {
      uuid: ['required', 'string'],
    },
    claimable: ['boolean'],
  };

  if (gameId) {
    const { coinsMin, coinsMax } = get(games, 'games.content', []).find(i => i.gameId === gameId) || {};

    rules.coins.push(`min:${coinsMin}`);
    rules.coins.push(`max:${coinsMax}`);
  }

  rules = fields.reduce((acc, curr) => ({ ...acc, [curr]: rules[curr] || [] }), {});

  return createValidator({
    ...rules,
    name: ['string', 'required'],
    providerId: ['string', 'required'],
    gameId: ['string', 'required'],
    internalGameId: ['string'],
    aggregatorId: ['string', 'required'],
  }, translateLabels(attributeLabels), false)(values);
};
