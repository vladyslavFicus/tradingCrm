import { graphql, compose } from 'react-apollo';
import { withNotifications, withModals } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import {
  updateMutation,
  updateLimitProfileMutation,
  updatePersonalInformationMutation,
  updateContactsMutation,
  updateAddressMutation,
  verifyPhoneMutation,
  verifyEmailMutation,
  updateEmailMutation,
} from 'graphql/mutations/profile';
import { newProfile } from 'graphql/queries/profile';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import View from '../components/View';

export default compose(
  withNotifications,
  withModals({ confirmationModal: ConfirmActionModal }),
  graphql(updatePersonalInformationMutation, {
    name: 'updatePersonalInformation',
  }),
  graphql(updateMutation, {
    name: 'profileUpdate',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(updateAddressMutation, {
    name: 'updateAddress',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(verifyPhoneMutation, {
    name: 'verifyPhone',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(verifyEmailMutation, {
    name: 'verifyEmail',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(updateContactsMutation, {
    name: 'updateContacts',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(updateLimitProfileMutation, {
    name: 'profileLimitedUpdate',
    options: ({ match: { params: { id: profileId } } }) => ({ variables: { profileId } }),
  }),
  graphql(newProfile, {
    name: 'newProfile',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(updateEmailMutation, {
    name: 'updateEmail',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
)(withStorage(['auth'])(View));
