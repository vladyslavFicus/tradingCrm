import { connect } from 'react-redux';
import { compose } from 'redux';
import OperatorProfile from '../components/OperatorProfile';
import { actionCreators } from '../modules';
import { statusActions } from '../../../../../constants/operators';
import { withModals } from '../../../../../components/HighOrder';
import ConfirmActionModal from '../../../../../components/Modal/ConfirmActionModal';

const mapStateToProps = (state) => {
  const {
    operatorProfile: {
      view: operatorProfile,
      authorities,
    },
  } = state;

  return {
    ...operatorProfile,
    authorities,
    availableStatuses: operatorProfile && operatorProfile.data
      ? statusActions[operatorProfile.data.operatorStatus]
        ? statusActions[operatorProfile.data.operatorStatus]
        : []
      : [],
  };
};
const mapActions = {
  changeStatus: actionCreators.changeStatus,
  onResetPassword: actionCreators.resetPassword,
  onSendInvitation: actionCreators.sendInvitation,
  fetchAuthority: actionCreators.fetchAuthority,
  fetchProfile: actionCreators.fetchProfile,
  fetchForexOperator: actionCreators.fetchForexOperator,
};

export default compose(
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  connect(mapStateToProps, mapActions),
)(OperatorProfile);
