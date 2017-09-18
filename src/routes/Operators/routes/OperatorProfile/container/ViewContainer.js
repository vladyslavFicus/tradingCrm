import { connect } from 'react-redux';
import OperatorProfileLayout from '../layouts/OperatorProfileLayout';
import { actionCreators } from '../modules';
import { statusActions } from '../../../../../constants/operators';

const mapStateToProps = ({
  operatorProfile: {
    view: operatorProfile,
  },
}) => ({
  ...operatorProfile,
  availableStatuses: operatorProfile && operatorProfile.data
    ? statusActions[operatorProfile.data.operatorStatus]
      ? statusActions[operatorProfile.data.operatorStatus]
      : []
    : [],
});
const mapActions = {
  fetchProfile: actionCreators.fetchProfile,
  changeStatus: actionCreators.changeStatus,
  onResetPassword: actionCreators.resetPassword,
  onSendInvitation: actionCreators.sendInvitation,
};

export default connect(mapStateToProps, mapActions)(OperatorProfileLayout);
