import { get } from 'lodash';
import { createValidator, translateLabels } from '../../../../utils/validator';
import { attributeLabels, optInPeriods } from './constants';
import {
  targetTypes,
  targetTypesLabels,
  lockAmountStrategy,
  moneyTypeUsage,
} from '../../../../constants/bonus-campaigns';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

export default (values, params) => {
  const {
    allowedCustomValueTypes,
    countries,
  } = params;

  const rules = {
    campaignName: ['required', 'string', `max:${CAMPAIGN_NAME_MAX_LENGTH}`],
    optIn: 'boolean',
    targetType: ['required', 'string', `in:${Object.keys(targetTypesLabels).join()}`],
    currency: 'required',
    startDate: 'required',
    endDate: 'required|nextDate:startDate',
    capping: {
      value: ['numeric', 'customTypeValue.value'],
      type: [`in:${allowedCustomValueTypes.join()}`],
    },
    optInPeriod: ['numeric', 'min:0'],
    optInPeriodTimeUnit: [`in:${Object.keys(optInPeriods).join()}`],
    linkedCampaignUUID: ['string'],
    conversionPrize: {
      value: ['numeric', 'customTypeValue.value'],
      type: [`in:${allowedCustomValueTypes.join()}`],
    },
    country: `in:,${Object.keys(countries).join()}`,
    fulfillments: {
      deposit: {
        minAmount: ['numeric', 'min:0'],
        maxAmount: ['numeric', 'min:0'],
        lockAmountStrategy: ['string', `in:${Object.keys(lockAmountStrategy).join()}`],
        depositNumber: ['integer', 'min:1'],
      },
    },
    rewards: {
      bonus: {
        wagerWinMultiplier: ['integer', 'max:999'],
        bonusLifeTime: ['integer'],
        maxBet: ['numeric'],
        maxGrantedAmount: ['numeric'],
        moneyTypePriority: [`in:${Object.keys(moneyTypeUsage).join()}`],
      },
      freeSpin: {
        name: ['string'],
        providerId: ['string'],
        gameId: ['string'],
        maxBet: ['numeric'],
        aggregatorId: ['string'],
        moneyTypePriority: ['string'],
        freeSpinsAmount: ['integer', 'min:0'],
        linesPerSpin: ['integer'],
        betPerLine: ['numeric', 'min:0'],
        bonusLifeTime: ['integer', 'min:1', 'max:230'],
        multiplier: ['integer', 'min:1', 'max:500'],
      },
    },
  };


  if (values.optInPeriod) {
    rules.optInPeriodTimeUnit.push('required');
  }

  if (values.targetType === targetTypes.LINKED_CAMPAIGN) {
    rules.linkedCampaignUUID.push('required');
  }

  const fulfillmentDeposit = get(values, 'fulfillments.deposit');
  if (fulfillmentDeposit) {
    const minAmount = fulfillmentDeposit.minAmount;

    if (minAmount && !isNaN(parseFloat(minAmount).toFixed(2))) {
      rules.fulfillments.deposit.maxAmount.push('greaterOrSame:fulfillments.deposit.minAmount');
    }
    rules.fulfillments.deposit.lockAmountStrategy.push('required');
  }

  const conversionPrize = get(values, 'conversionPrize.value');
  if (conversionPrize && !isNaN(parseFloat(conversionPrize).toFixed(2))) {
    rules.capping.value.push('greaterThan:conversionPrize.value');
  }

  const capping = get(values, 'capping.value');
  if (capping && !isNaN(parseFloat(capping).toFixed(2))) {
    rules.conversionPrize.value.push('lessThan:capping.value');
  }

  const rewardsBonus = get(values, 'rewards.bonus');
  const rewardsFreeSpins = get(values, 'rewards.freeSpin');

  if (rewardsBonus && !rewardsFreeSpins) {
    rules.rewards.bonus.campaignRatio = {
      value: ['numeric', 'customTypeValue.value', 'required'],
      type: [`in:${allowedCustomValueTypes.join()}`],
    };
    rules.rewards.bonus.wagerWinMultiplier.push('required');
    rules.rewards.bonus.bonusLifeTime.push('required');
    rules.rewards.bonus.moneyTypePriority.push('required');
  }

  if (rewardsFreeSpins && !rewardsFreeSpins.templateUUID) {
    ['name', 'providerId', 'gameId', 'aggregatorId', 'freeSpinsAmount', 'linesPerSpin',
      'betPerLine', 'bonusLifeTime', 'multiplier', 'moneyTypePriority',
    ].map(field => rules.rewards.freeSpin[field].push('required'));
  }

  return createValidator(rules, translateLabels(attributeLabels), false)(values);
};
