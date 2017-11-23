import { createValidator, translateLabels } from '../../../../../../utils/validator';
import { attributeLabels } from '../../constants';
import { targetTypesLabels } from '../../../../../../constants/bonus-campaigns';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

export default (values, params) => {
  const { allowedCustomValueTypes, campaignType } = params;

  const rules = {
    campaignName: ['required', 'string', `max:${CAMPAIGN_NAME_MAX_LENGTH}`],
    startDate: 'required',
    endDate: 'required|nextDate:startDate',
    currency: 'required',
    bonusLifetime: 'required|integer',
    campaignRatio: {
      value: 'required|numeric|customTypeValue.value',
      type: ['required', `in:${allowedCustomValueTypes.join()}`],
    },
    capping: {
      value: ['numeric', 'customTypeValue.value'],
      type: [`in:${allowedCustomValueTypes.join()}`],
    },
    conversionPrize: {
      value: ['numeric', 'customTypeValue.value'],
      type: [`in:${allowedCustomValueTypes.join()}`],
    },
    wagerWinMultiplier: 'required|integer|max:999',
    campaignType: ['required', 'string', `in:${campaignType.join()}`],
    targetType: ['required', 'string', `in:${Object.keys(targetTypesLabels).join()}`],
    minAmount: 'min:0',
    maxAmount: 'min:0',
    lockAmountStrategy: 'required',
    promoCode: 'string',
  };

  if (values.minAmount) {
    const minAmount = parseFloat(values.minAmount).toFixed(2);

    if (!isNaN(minAmount)) {
      rules.maxAmount = 'greaterOrSame:minAmount';
    }
  }

  if (values.maxAmount) {
    const maxAmount = parseFloat(values.maxAmount).toFixed(2);

    if (!isNaN(maxAmount)) {
      rules.minAmount = 'lessOrSame:maxAmount';
    }
  }

  if (values.conversionPrize && values.conversionPrize.value) {
    const value = parseFloat(values.conversionPrize.value).toFixed(2);

    if (!isNaN(value)) {
      rules.capping.value.push('greaterThan:conversionPrize.value');
    }
  }

  if (values.capping && values.capping.value) {
    const value = parseFloat(values.capping.value).toFixed(2);

    if (!isNaN(value)) {
      rules.conversionPrize.value.push('lessThan:capping.value');
    }
  }

  return createValidator(rules, translateLabels(attributeLabels), false)(values);
};
