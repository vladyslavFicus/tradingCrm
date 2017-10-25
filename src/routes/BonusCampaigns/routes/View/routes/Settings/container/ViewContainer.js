import { connect } from 'react-redux';
import View from '../components/View';
import config from '../../../../../../../config';
import { actionCreators } from '../../../modules';
import { customValueFieldTypes } from '../../../../../../../constants/form';
import { campaignTypes } from '../../../../../../../constants/bonus-campaigns';

const mapStateToProps = ({ bonusCampaignView: { data, nodeGroups }, i18n: { locale } }) => {
  let bonusCampaignForm = {
    campaignName: data.campaignName,
    campaignPriority: data.campaignPriority,
    targetType: data.targetType,
    currency: data.currency,
    startDate: data.startDate,
    endDate: data.endDate,
    conversionPrize: data.conversionPrize || {
      value: null,
      type: customValueFieldTypes.ABSOLUTE,
    },
    capping: data.capping || {
      value: null,
      type: customValueFieldTypes.ABSOLUTE,
    },
    optIn: data.optIn,
    campaignType: data.campaignType,
    minAmount: data.minAmount,
    maxAmount: data.maxAmount,
    excludeCountries: !data.includeCountries,
    countries: data.countries || [],
  };

  bonusCampaignForm = {
    ...bonusCampaignForm,
    rewards: {
      bonus: {
        wagerWinMultiplier: data.wagerWinMultiplier,
        moneyTypePriority: data.moneyTypePriority,
        bonusLifetime: data.bonusLifetime,
        campaignRatio: data.campaignRatio,
      },
    },
  };

  if ([campaignTypes.DEPOSIT, campaignTypes.FIRST_DEPOSIT].indexOf(bonusCampaignForm.campaignType) > -1) {
    bonusCampaignForm = {
      ...bonusCampaignForm,
      fulfillments: {
        deposit: {
          minAmount: data.minAmount,
          maxAmount: data.maxAmount,
          lockAmountStrategy: data.lockAmountStrategy,
          firstDeposit: bonusCampaignForm.campaignType === campaignTypes.FIRST_DEPOSIT,
        },
      },
    };
  } else if (campaignTypes.PROFILE_COMPLETED) {
    bonusCampaignForm = {
      ...bonusCampaignForm,
      fulfillments: {
        profileCompleted: true,
      },
    };
  }

  return {
    bonusCampaign: data,
    bonusCampaignForm,
    nodeGroups,
    currencies: config.nas.currencies.supported || [],
    locale,
  };
};

const mapActions = {
  updateCampaign: actionCreators.updateCampaign,
  revert: actionCreators.revert,
  removeNode: actionCreators.removeNode,
  addNode: actionCreators.addNode,
};

export default connect(mapStateToProps, mapActions)(View);
