import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { actionCreators } from '../modules';
import CampaignList from '../components/CampaignList';
import ConfirmActionModal from '../../../../../../../../../components/Modal/ConfirmActionModal';
import { withModals, withNotifications } from '../../../../../../../../../components/HighOrder';
import { resetPlayerMutation } from '.././../../../../../../../../graphql/mutations/campaigns';

const mapStateToProps = ({
  profile: { profile: { data: profile } },
  playerBonusCampaignsList: { list },
  i18n: { locale },
}) => ({
  list,
  locale,
  profile,
});

export default compose(
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  connect(mapStateToProps, actionCreators),
  graphql(resetPlayerMutation, {
    name: 'resetPlayer',
  }),
  withNotifications,
)(CampaignList);
