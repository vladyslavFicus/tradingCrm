import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';
import { routes as subTabRoutes } from '../../../constants';
import { filterItems as filterAvailableItems } from '../../../../../../../utils/permissions';

const mapStateToProps = ({
  profile: { profile: { data: profile } },
  playerBonusCampaignsList: { list },
  i18n: { locale },
  permissions: { data: currentPermissions },
}) => ({
  list,
  locale,
  profile,
  subTabRoutes: filterAvailableItems(subTabRoutes, currentPermissions),
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
