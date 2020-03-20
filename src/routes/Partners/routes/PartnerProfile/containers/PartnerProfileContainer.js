import { get } from 'lodash';
import { graphql, compose } from 'react-apollo';
import { withModals, withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import { unlockLoginMutation } from 'graphql/mutations/auth';
import { changePassword, sendInvitation } from 'graphql/mutations/operators';
import { changeStatus } from 'graphql/mutations/partners';
import { getLoginLock } from 'graphql/queries/profile';
import { partnerQuery } from 'graphql/queries/partners';
import { statusActions } from 'constants/partners';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import PartnerProfile from '../components/PartnerProfile';

export default compose(
  withStorage(['auth', 'brand']),
  withNotifications,
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
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
        refetchPartner: getPartner.refetch,
        availableStatuses: partnerProfile.status && statusActions[partnerProfile.status]
          ? statusActions[partnerProfile.status]
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
  graphql(sendInvitation, {
    name: 'sendInvitation',
  }),
)(PartnerProfile);
