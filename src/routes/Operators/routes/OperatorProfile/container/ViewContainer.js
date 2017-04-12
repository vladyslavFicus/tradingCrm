import { connect } from 'react-redux';
import OperatorProfileLayout from '../layouts/OperatorProfileLayout';
import { actionCreators } from '../modules';
import { statusActions } from '../../../../../constants/operators';

const mapStateToProps = ({ operatorProfile: { view: operatorProfile, ip } }) => {
  const lastIp = ip.entities.content
    ? ip.entities.content[ip.entities.content.length - 1]
    : null;

  return {
    ...operatorProfile,
    lastIp,
    ip,
    availableStatuses: operatorProfile && operatorProfile.data
      ? statusActions[operatorProfile.data.operatorStatus]
        ? statusActions[operatorProfile.data.operatorStatus]
        : []
      : [],
  };
};
const mapActions = {
  fetchIp: actionCreators.fetchEntities,
  fetchProfile: actionCreators.fetchProfile,
  changeStatus: actionCreators.changeStatus,
  onResetPassword: actionCreators.resetPassword,
  onSendInvitation: actionCreators.sendInvitation,
};

export default connect(mapStateToProps, mapActions)(OperatorProfileLayout);
