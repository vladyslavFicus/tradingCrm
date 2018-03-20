import { get } from 'lodash';
import { createValidator, translateLabels } from '../../../../utils/validator';
import { attributeLabels, optInPeriods } from './constants';
import { GAME_TYPES, HARDCODED_PROVIDERS } from './Rewards/Nodes/FreeSpin/constants';
import {
  targetTypes,
  targetTypesLabels,
  lockAmountStrategy,
  moneyTypeUsage,
} from '../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../constants/form';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

export default (values, props) => {
  const {
    allowedCustomValueTypes,
    countries,
  } = props;

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
    optInPeriod: ['numeric', 'min:1'],
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
        aggregatorId: ['string'],
        freeSpinsAmount: ['integer', 'min:0'],
        linesPerSpin: ['integer'],
        betPerLine: ['numeric', 'min:0'],
        count: ['numeric'],
        lifeTime: ['numeric'],
        bonus: {
          name: ['string'],
          bonusLifeTime: ['integer', 'min:1', 'max:230'],
          moneyTypePriority: [`in:${Object.keys(moneyTypeUsage).join()}`],
          lockAmountStrategy: ['string'],
          maxGrantAmount: ['numeric'],
          grantRatio: {
            type: ['string'],
            value: ['numeric'],
          },
          wageringRequirement: {
            type: ['string'],
            value: ['numeric', 'max:1000000'],
          },
          capping: {
            type: ['string'],
            value: ['numeric', 'min:0'],
          },
          prize: {
            type: ['string'],
            value: ['numeric', 'min:0'],
          },
        },
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
    if (
      rewardsFreeSpins.aggregatorId === 'softgamings' &&
      HARDCODED_PROVIDERS.indexOf(rewardsFreeSpins.providerId) !== -1
    ) {
      rules.rewards.freeSpin.pageCode = ['required'];
      rules.rewards.freeSpin.betLevel = ['required', 'min:1', 'max:5'];
    }

    [
      'name', 'providerId', 'gameId', 'aggregatorId',
      'freeSpinsAmount', 'linesPerSpin', 'betPerLine', 'count', 'lifeTime',
    ]
      .map(field => rules.rewards.freeSpin[field].push('required'));
  }

  const freeSpinBonus = get(values, 'rewards.freeSpin.bonus');

  if (freeSpinBonus) {
    ['name', 'bonusLifeTime', 'moneyTypePriority', 'lockAmountStrategy']
      .map(field => rules.rewards.freeSpin.bonus[field].push('required'));

    if (freeSpinBonus.grantRatio && freeSpinBonus.grantRatio.type === customValueFieldTypes.PERCENTAGE) {
      rules.rewards.freeSpin.bonus.maxGrantAmount.push('required');
    }

    const freeSpinBonusType = get(freeSpinBonus, 'wageringRequirement.type');
    if (freeSpinBonusType !== customValueFieldTypes.ABSOLUTE) {
      rules.rewards.freeSpin.bonus.wageringRequirement.value.push('min:100');
    } else {
      rules.rewards.freeSpin.bonus.wageringRequirement.value.push('min:1');
    }

    rules.rewards.freeSpin.bonus.wageringRequirement.value.push('required');
    rules.rewards.freeSpin.bonus.wageringRequirement.type.push('required');
    rules.rewards.freeSpin.bonus.grantRatio.value.push('required');

    const prize = get(freeSpinBonus, 'prize.value');
    if (prize && !isNaN(parseFloat(prize).toFixed(2))) {
      rules.rewards.freeSpin.bonus.capping.value.push('greaterThan:rewards.freeSpin.bonus.prize.value');
    }

    const capping = get(freeSpinBonus, 'capping.value');
    if (capping && !isNaN(parseFloat(capping).toFixed(2))) {
      rules.rewards.freeSpin.bonus.prize.value.push('lessThan:rewards.freeSpin.bonus.capping.value');
    }
  }

  return createValidator(rules, translateLabels(attributeLabels), false)(values);
};
