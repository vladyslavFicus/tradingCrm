import { connect } from 'react-redux';
import ViewLayout from '../layouts/ViewLayout';
import { actionCreators } from '../modules';
import { statusActions } from '../../../../../constants/bonus-campaigns';

const mapStateToProps = ({ bonusCampaignView, i18n: { locale } }) => ({
  ...bonusCampaignView,
  locale,
  availableStatusActions: bonusCampaignView.data && statusActions[bonusCampaignView.data.state]
    ? statusActions[bonusCampaignView.data.state]
    : [],
});
export default connect(mapStateToProps, {
  fetchCampaign: actionCreators.fetchCampaign,
  updateCampaign: actionCreators.updateCampaign,
  uploadFile: actionCreators.uploadPlayersFile,
  onChangeCampaignState: actionCreators.changeCampaignState,
  cloneCampaign: actionCreators.cloneCampaign,
  removeAllPlayers: actionCreators.removeAllPlayers,
})(ViewLayout);
