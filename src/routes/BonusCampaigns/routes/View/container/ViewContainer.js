import { connect } from 'react-redux';
import ViewLayout from '../layouts/ViewLayout';
import { actionCreators } from '../modules';
import { statusActions } from '../../../constants';

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
})(ViewLayout);
