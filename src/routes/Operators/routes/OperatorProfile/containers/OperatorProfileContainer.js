import { get } from 'lodash';
import { graphql, compose } from 'react-apollo';
import { withModals, withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import { unlockLoginMutation } from 'graphql/mutations/auth';
import { changePassword, passwordResetRequest, changeStatus } from 'graphql/mutations/operators';
import { getLoginLock } from 'graphql/queries/profile';
import { operatorQuery } from 'graphql/queries/operators';
import { statusActions } from 'constants/operators';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import OperatorProfile from '../components/OperatorProfile';

export default compose(
  withStorage(['auth']),
  withNotifications,
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  graphql(unlockLoginMutation, {
    options: ({
      match: {
        params: {
          id: uuid,
        },
      },
    }) => ({
      refetchQueries: [{
        query: getLoginLock,
        variables: { uuid },
      }],
    }),
    name: 'unlockLoginMutation',
  }),
  graphql(getLoginLock, {
    options: ({
      match: {
        params: {
          id: uuid,
        },
      },
    }) => ({
      variables: {
        uuid,
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
        authorities,
        data: {
          ...operatorProfile,
        },
        error: get(getOperator, 'error'),
        refetchOperator: getOperator.refetch,
        availableStatuses: operatorProfile.operatorStatus && statusActions[operatorProfile.operatorStatus]
          ? statusActions[operatorProfile.operatorStatus]
          : [],
      };
    },
  }),
  graphql(changeStatus, {
    name: 'changeStatus',
  }),
  graphql(changePassword, {
    name: 'changePassword',
  }),
  graphql(passwordResetRequest, {
    name: 'resetPassword',
  }),
)(OperatorProfile);
