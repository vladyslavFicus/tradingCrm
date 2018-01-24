import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../../../modules';
import { actionCreators as settingsActionCreators } from '../modules';
import { actionCreators as campaignsActionCreators } from '../modules/campaigns';
import { customValueFieldTypes } from '../../../../../../../constants/form';
import { fulfilmentTypes, rewardTypes } from '../../../../../../../constants/bonus-campaigns';

const mapFulfillmentsToForm = (data) => {
  let result = {};

  if ([fulfilmentTypes.DEPOSIT, fulfilmentTypes.FIRST_DEPOSIT].indexOf(data.fulfilmentType) > -1) {
    result = {
      deposit: {
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        lockAmountStrategy: data.lockAmountStrategy,
        firstDeposit: data.fulfilmentType === fulfilmentTypes.FIRST_DEPOSIT,
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
      bonusLifetime: data.bonusLifetime,
      campaignRatio: data.campaignRatio,
      claimable: data.claimable,
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
    games: { games, providers },
    templates: { data: templates },
  },
  options: { data: { currencyCodes } },
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
    games,
    providers,
    templates,
    locale,
  };
};

const mapActions = {
  updateCampaign: actionCreators.updateCampaign,
  revert: actionCreators.revert,
  removeNode: actionCreators.removeNode,
  addNode: actionCreators.addNode,
  createFreeSpinTemplate: settingsActionCreators.createFreeSpinTemplate,
  fetchFreeSpinTemplates: settingsActionCreators.fetchFreeSpinTemplates,
  fetchFreeSpinTemplate: settingsActionCreators.fetchFreeSpinTemplate,
  fetchGames: settingsActionCreators.fetchGames,
  fetchCampaigns: campaignsActionCreators.fetchCampaigns,
  fetchCampaign: campaignsActionCreators.fetchCampaign,
};

export default connect(mapStateToProps, mapActions)(View);
