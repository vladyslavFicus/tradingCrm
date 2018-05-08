import { connect } from 'react-redux';
import OperatorProfileLayout from '../layouts/OperatorProfileLayout';
import { actionCreators } from '../modules';
import { statusActions } from '../../../../../constants/operators';

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
};

export default connect(mapStateToProps, mapActions)(OperatorProfileLayout);
