import { graphql, compose } from 'react-apollo';
import { withNotifications, withModals } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import {
  updatePersonalInformationMutation,
  verifyEmailMutation,
  updateEmailMutation,
} from 'graphql/mutations/profile';
import { profile } from 'graphql/queries/profile';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import View from '../components/View';

export default compose(
  withNotifications,
  withStorage(['auth']),
  withModals({ confirmationModal: ConfirmActionModal }),
  graphql(updatePersonalInformationMutation, {
    name: 'updatePersonalInformation',
  }),
  graphql(verifyEmailMutation, {
    name: 'verifyEmail',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(profile, {
    name: 'profile',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(updateEmailMutation, {
    name: 'updateEmail',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
)(View);
