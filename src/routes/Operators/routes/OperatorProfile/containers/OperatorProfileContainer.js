import { connect } from 'react-redux';
import { get } from 'lodash';
import { graphql, compose } from 'react-apollo';
import { unlockLoginMutation } from 'graphql/mutations/auth';
import { changePassword } from 'graphql/mutations/operators';
import { getLoginLock } from 'graphql/queries/profile';
import { operatorQuery } from 'graphql/queries/operators';
import { statusActions } from 'constants/operators';
import { withModals, withNotifications } from 'components/HighOrder';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import OperatorProfile from '../components/OperatorProfile';
import { actionCreators } from '../modules';

const mapActions = {
  changeStatus: actionCreators.changeStatus,
  onResetPassword: actionCreators.resetPassword,
  onSendInvitation: actionCreators.sendInvitation,
};

export default compose(
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  connect(null, mapActions),
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
  graphql(operatorQuery, {
    name: 'getOperator',
    options: ({ match: { params: { id } } }) => ({
      variables: { uuid: id },
      fetchPolicy: 'network-only',
    }),
    props: ({ getOperator }) => {
      const { authorities, ...operatorProfile } = get(getOperator, 'operator.data') || {};
      return {
        isLoading: get(getOperator, 'loading', true),
        authorities: authorities || {},
        data: {
          ...operatorProfile,
        },
        error: get(getOperator, 'operator.error.error'),
        refetchOperator: getOperator.refetch,
        availableStatuses: operatorProfile.operatorStatus && statusActions[operatorProfile.operatorStatus]
          ? statusActions[operatorProfile.operatorStatus]
          : [],
      };
    },
  }),
  graphql(changePassword, {
    name: 'changePassword',
  }),
  withNotifications,
)(OperatorProfile);
