import _ from 'lodash';
import { createValidator, translateLabels } from '../../../../../../../utils/validator';
import { attributeLabels, optInPeriods } from '../constants';
import {
  targetTypesLabels,
  lockAmountStrategy,
  moneyTypeUsage,
} from '../../../../../../../constants/bonus-campaigns';
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
      },
    },
    rewards: {
      bonus: {
        campaignRatio: {
          value: ['numeric', 'customTypeValue.value'],
          type: [`in:${allowedCustomValueTypes.join()}`],
        },
        wagerWinMultiplier: ['integer', 'max:999'],
        bonusLifetime: ['integer'],
        moneyTypePriority: [`in:${Object.keys(moneyTypeUsage).join()}`],
      },
    },
  };

  if (values.optInPeriod) {
    rules.optInPeriodTimeUnit.push('required');
  }

  const fulfillmentDeposit = _.get(values, 'fulfillments.deposit');
  if (fulfillmentDeposit) {
    const minAmount = fulfillmentDeposit.minAmount;
    if (minAmount && !isNaN(parseFloat(minAmount).toFixed(2))) {
      rules.fulfillments.deposit.maxAmount.push('greaterOrSame:fulfillments.deposit.minAmount');
    }
    rules.fulfillments.deposit.lockAmountStrategy.push('required');
  }

  const conversionPrize = _.get(values, 'conversionPrize.value');
  if (conversionPrize && !isNaN(parseFloat(conversionPrize).toFixed(2))) {
    rules.capping.value.push('greaterThan:conversionPrize.value');
  }

  const capping = _.get(values, 'capping.value');
  if (capping && !isNaN(parseFloat(capping).toFixed(2))) {
    rules.conversionPrize.value.push('lessThan:capping.value');
  }

  const rewardsBonus = _.get(values, 'rewards.bonus');
  const rewardsFreeSpins = _.get(values, 'rewards.freeSpin');

  if (rewardsBonus && !rewardsFreeSpins) {
    rules.rewards.bonus.campaignRatio.value.push('required');
    rules.rewards.bonus.wagerWinMultiplier.push('required');
    rules.rewards.bonus.bonusLifetime.push('required');
    rules.rewards.bonus.moneyTypePriority.push('required');
  }

  return createValidator(rules, translateLabels(attributeLabels), false)(values);
};
