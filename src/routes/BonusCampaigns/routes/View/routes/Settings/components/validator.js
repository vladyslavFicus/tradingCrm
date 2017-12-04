import _ from 'lodash';
import { createValidator, translateLabels } from '../../../../../../../utils/validator';
import { attributeLabels } from '../constants';
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
          value: ['required', 'numeric', 'customTypeValue.value'],
          type: [`in:${allowedCustomValueTypes.join()}`],
        },
        wagerWinMultiplier: ['required', 'integer', 'max:999'],
        bonusLifetime: ['required', 'integer'],
        moneyTypePriority: ['required', `in:${Object.keys(moneyTypeUsage).join()}`],
      },
    },
  };

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

  return createValidator(rules, translateLabels(attributeLabels), false)(values);
};
