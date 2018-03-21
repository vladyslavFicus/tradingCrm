import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../../../modules';
import { actionCreators as settingsActionCreators } from '../modules';
import { actionCreators as campaignsActionCreators } from '../modules/campaigns';
import { actionCreators as paymentsActionCreators } from '../modules/payments';
import { customValueFieldTypes } from '../../../../../../../constants/form';
import { fulfilmentTypes, rewardTypes } from '../../../../../../../constants/bonus-campaigns';

const mapFulfillmentsToForm = (data) => {
  let result = {};

  if (data.fulfilmentType === fulfilmentTypes.DEPOSIT) {
    result = {
      deposit: {
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        lockAmountStrategy: data.lockAmountStrategy,
        depositNumber: data.depositNumber,
        restrictedPaymentMethods: data.restrictedPaymentMethods,
      },
    };
  } else if (data.fulfilmentType === fulfilmentTypes.PROFILE_COMPLETED) {
    result = {
      profileCompleted: true,
    };
  } else if (data.fulfilmentType === fulfilmentTypes.WITHOUT_FULFILMENT) {
    result = {
      noFulfillments: true,
    };
  }

  return result;
};

const mapRewardsToForm = (data) => {
  let result = {
    bonus: {
      wagerWinMultiplier: data.wagerWinMultiplier,
      moneyTypePriority: data.moneyTypePriority,
      bonusLifeTime: data.bonusLifeTime,
      campaignRatio: data.campaignRatio,
      claimable: data.claimable,
      maxBet: data.maxBet,
      maxGrantedAmount: data.maxGrantedAmount,
    },
  };

  if (data.campaignType === rewardTypes.FREE_SPIN) {
    result = {
      ...result,
      freeSpin: {
        templateUUID: data.templateUUID,
      },
    };
  }

  return result;
};

const mapStateToProps = ({
  bonusCampaignView: { data, nodeGroups },
  bonusCampaignSettings: {
    games: { games },
    freeSpinTemplates: { data: freeSpinTemplates },
    bonusTemplates: { data: bonusTemplates },
    payments: { list: paymentMethods },
  },
  options: { data: { currencyCodes, baseCurrency } },
  i18n: { locale },
}) => {
  let bonusCampaignForm = {
    campaignName: data.campaignName,
    targetType: data.targetType,
    currency: data.currency,
    startDate: data.startDate,
    endDate: data.endDate,
    optInPeriod: data.optInPeriod,
    optInPeriodTimeUnit: data.optInPeriodTimeUnit,
    linkedCampaignUUID: data.linkedCampaignUUID,
    conversionPrize: data.conversionPrize || {
      value: null,
      type: customValueFieldTypes.ABSOLUTE,
    },
    capping: data.capping || {
      value: null,
      type: customValueFieldTypes.ABSOLUTE,
    },
    optIn: data.optIn,
    maxBet: data.maxBet,
    maxGrantedAmount: data.maxGrantedAmount,
    fulfilmentType: data.fulfilmentType,
    excludeCountries: data.excludeCountries,
    countries: data.countries || [],
    promoCode: data.promoCode,
  };

  bonusCampaignForm = {
    ...bonusCampaignForm,
    fulfillments: mapFulfillmentsToForm(data),
    rewards: mapRewardsToForm(data),
  };

  return {
    bonusCampaign: data,
    bonusCampaignForm,
    nodeGroups,
    currencies: currencyCodes,
    baseCurrency,
    games,
    freeSpinTemplates,
    bonusTemplates,
    paymentMethods,
    locale,
  };
};

const mapActions = {
  updateCampaign: actionCreators.updateCampaign,
  revert: actionCreators.revert,
  removeNode: actionCreators.removeNode,
  addNode: actionCreators.addNode,
  addFreeSpinTemplate: settingsActionCreators.addFreeSpinTemplate,
  createFreeSpinTemplate: settingsActionCreators.createFreeSpinTemplate,
  addBonusTemplate: settingsActionCreators.addBonusTemplate,
  createBonusTemplate: settingsActionCreators.createBonusTemplate,
  fetchFreeSpinTemplates: settingsActionCreators.fetchFreeSpinTemplates,
  fetchBonusTemplates: settingsActionCreators.fetchBonusTemplates,
  fetchFreeSpinTemplate: settingsActionCreators.fetchFreeSpinTemplate,
  fetchBonusTemplate: settingsActionCreators.fetchBonusTemplate,
  fetchGames: settingsActionCreators.fetchGames,
  fetchCampaigns: campaignsActionCreators.fetchCampaigns,
  fetchCampaign: campaignsActionCreators.fetchCampaign,
  fetchPaymentMethods: paymentsActionCreators.fetchPaymentMethods,
  resetAllNodes: actionCreators.resetAllNodes,
};

export default connect(mapStateToProps, mapActions)(View);
