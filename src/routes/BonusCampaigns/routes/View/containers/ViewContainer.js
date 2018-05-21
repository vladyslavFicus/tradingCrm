import { connect } from 'react-redux';
import View from '../components/View';
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
})(View);

