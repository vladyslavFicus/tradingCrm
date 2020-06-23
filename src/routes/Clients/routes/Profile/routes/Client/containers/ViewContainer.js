import { graphql, compose } from 'react-apollo';
import { withNotifications, withModals } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import {
  updateMutation,
  updateLimitProfileMutation,
  updatePersonalInformationMutation,
  verifyEmailMutation,
  updateEmailMutation,
} from 'graphql/mutations/profile';
import { newProfile } from 'graphql/queries/profile';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import View from '../components/View';

export default compose(
  withNotifications,
  withStorage(['auth']),
  withModals({ confirmationModal: ConfirmActionModal }),
  graphql(updatePersonalInformationMutation, {
    name: 'updatePersonalInformation',
  }),
  graphql(updateMutation, {
    name: 'profileUpdate',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(verifyEmailMutation, {
    name: 'verifyEmail',
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
)(View);
