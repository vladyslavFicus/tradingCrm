import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';

const mapStateToProps = ({
  profile: { profile: { data: profile } },
  playerBonusCampaignsList: { list },
  i18n: { locale },
}) => ({
  list,
  locale,
  profile,
});
const mapActions = {
  fetchPlayerCampaigns: actionCreators.fetchPlayerCampaigns,
  declineCampaign: actionCreators.declineCampaign,
  fetchCampaigns: actionCreators.fetchCampaigns,
  addPlayerToCampaign: actionCreators.addPlayerToCampaign,
};

export default connect(mapStateToProps, mapActions)(View);
