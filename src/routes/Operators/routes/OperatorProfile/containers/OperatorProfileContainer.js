import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { unlockLoginMutation } from 'graphql/mutations/auth';
import { getLoginLock } from 'graphql/queries/profile';
import { statusActions } from 'constants/operators';
import { withModals, withNotifications } from 'components/HighOrder';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import OperatorProfile from '../components/OperatorProfile';
import { actionCreators } from '../modules';

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
  graphql(unlockLoginMutation, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      refetchQueries: [{
        query: getLoginLock,
        variables: {
          playerUUID,
        },
      }],
    }),
    name: 'unlockLoginMutation',
  }),
  graphql(getLoginLock, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'getLoginLock',
  }),
  withNotifications,
)(OperatorProfile);
