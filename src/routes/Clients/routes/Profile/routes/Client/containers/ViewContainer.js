import { graphql, compose } from 'react-apollo';
import { withNotifications, withModals } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import {
  updatePersonalInformationMutation,
  updateAddressMutation,
  verifyEmailMutation,
  updateEmailMutation,
} from 'graphql/mutations/profile';
import { profile } from 'graphql/queries/profile';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import View from '../components/View';

export default compose(
  withNotifications,
  withStorage(['auth']),
  withModals({ confirmationModal: ConfirmActionModal }),
  graphql(updatePersonalInformationMutation, {
    name: 'updatePersonalInformation',
  }),
  graphql(updateAddressMutation, {
    name: 'updateAddress',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
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
