import { connect } from 'react-redux';
import { compose } from 'redux';
import { actionCreators } from '../modules';
import View from '../components/View';
import ConfirmActionModal from '../../../../../../../../../components/Modal/ConfirmActionModal';
import { withModals } from '../../../../../../../../../components/HighOrder';

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
)(View);
