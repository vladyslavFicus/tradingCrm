import { connect } from 'react-redux';
import View from '../components/View';
import config from '../../../../../../../config/index';
import { actionCreators } from '../../../modules';
import { customValueFieldTypes } from '../../../../../../../constants/form';

const mapStateToProps = ({ bonusCampaignView: { data }, i18n: { locale } }) => ({
  bonusCampaign: data,
  bonusCampaignForm: {
    campaignName: data.campaignName,
    campaignPriority: data.campaignPriority,
    targetType: data.targetType,
    currency: data.currency,
    startDate: data.startDate,
    endDate: data.endDate,
    wagerWinMultiplier: data.wagerWinMultiplier,
    bonusLifetime: data.bonusLifetime,
    campaignRatio: data.campaignRatio,
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
  },
  currencies: config.nas.currencies.supported || [],
  locale,
});

const mapActions = {
  updateCampaign: actionCreators.updateCampaign,
};

export default connect(mapStateToProps, mapActions)(View);
