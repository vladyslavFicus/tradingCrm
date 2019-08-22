import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { unlockLoginMutation } from 'graphql/mutations/auth';
import { changePassword } from 'graphql/mutations/partners';
import { getLoginLock } from 'graphql/queries/profile';
import { partnerQuery } from 'graphql/queries/partners';
import { statusActions, operatorTypes } from 'constants/operators';
import { withModals, withNotifications } from 'components/HighOrder';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import OperatorProfile from 'routes/Operators/routes/OperatorProfile/components/OperatorProfile';
import { actionCreators } from 'routes/Operators/routes/OperatorProfile/modules';

const mapActions = {
  changeStatus: actionCreators.changeStatus,
  onResetPassword: actionCreators.resetPassword,
  onSendInvitation: actionCreators.sendInvitation,
};

export default compose(
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  connect(() => ({ operatorType: operatorTypes.PARTNER }), mapActions),
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
  graphql(partnerQuery, {
    name: 'getPartner',
    options: ({ match: { params: { id } } }) => ({
      variables: { uuid: id },
      fetchPolicy: 'network-only',
    }),
    props: ({ getPartner }) => {
      const { authorities, ...partnerProfile } = get(getPartner, 'partner.data') || {};
      return {
        isLoading: get(getPartner, 'loading', true),
        authorities: authorities || {},
        data: {
          ...partnerProfile,
        },
        error: get(getPartner, 'partner.error.error'),
        refetchOperator: getPartner.refetch,
        availableStatuses: partnerProfile.operatorStatus && statusActions[partnerProfile.operatorStatus]
          ? statusActions[partnerProfile.operatorStatus]
          : [],
      };
    },
  }),
  graphql(changePassword, {
    name: 'changePassword',
  }),
  withNotifications,
)(OperatorProfile);
