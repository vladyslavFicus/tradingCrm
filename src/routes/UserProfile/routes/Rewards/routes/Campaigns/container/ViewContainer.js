import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';

const mapStateToProps = ({
  profile: { profile: { data: profile } },
  playerBonusCampaignsList: { list },
  i18n: { locale },
  userRewardsSubTabs: { tabs: subTabRoutes },
}) => ({
  list,
  locale,
  profile,
  subTabRoutes,
});
const mapActions = {
  fetchPlayerCampaigns: actionCreators.fetchPlayerCampaigns,
  declineCampaign: actionCreators.declineCampaign,
  optInCampaign: actionCreators.optInCampaign,
  unTargetCampaign: actionCreators.unTargetCampaign,
  fetchCampaigns: actionCreators.fetchCampaigns,
  addPlayerToCampaign: actionCreators.addPlayerToCampaign,
  addPromoCodeToPlayer: actionCreators.addPromoCodeToPlayer,
};

export default connect(mapStateToProps, mapActions)(View);
