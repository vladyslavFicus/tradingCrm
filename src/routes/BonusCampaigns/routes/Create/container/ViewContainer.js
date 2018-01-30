import { connect } from 'react-redux';
import ViewLayout from '../layouts/ViewLayout';
import { actionCreators } from '../modules';

const mapStateToProps = ({ bonusCampaignCreate, i18n: { locale } }) => ({
  ...bonusCampaignCreate,
  locale,
});
export default connect(mapStateToProps, {
  createCampaign: actionCreators.createCampaign,
  uploadFile: actionCreators.uploadPlayersFile,
  onChangeCampaignState: actionCreators.changeCampaignState,
  cloneCampaign: actionCreators.cloneCampaign,
  removeAllPlayers: actionCreators.removeAllPlayers,
})(ViewLayout);
