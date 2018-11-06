import { connect } from 'react-redux';
import { compose } from 'redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { statusActions } from '../../../../../constants/bonus-campaigns';
import ConfirmActionModal from '../../../../../components/Modal/ConfirmActionModal';
import { withModals, withNotifications } from '../../../../../components/HighOrder';

const mapStateToProps = ({ bonusCampaignView, i18n: { locale } }) => ({
  ...bonusCampaignView,
  locale,
  availableStatusActions: bonusCampaignView.data && statusActions[bonusCampaignView.data.state]
    ? statusActions[bonusCampaignView.data.state]
    : [],
});

const mapActions = {
  fetchCampaign: actionCreators.fetchCampaign,
  updateCampaign: actionCreators.updateCampaign,
  uploadFile: actionCreators.uploadPlayersFile,
  onChangeCampaignState: actionCreators.changeCampaignState,
  cloneCampaign: actionCreators.cloneCampaign,
  removeAllPlayers: actionCreators.removeAllPlayers,
};

export default compose(
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  connect(mapStateToProps, mapActions),
  withNotifications,
)(View);
