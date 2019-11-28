import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import {
  updateMutation,
  updateLimitProfileMutation,
  updatePersonalInformationMutation,
  updateContactsMutation,
  updateAddressMutation,
  verifyPhoneMutation,
  verifyEmailMutation,
} from 'graphql/mutations/profile';
import { withNotifications } from 'components/HighOrder';
import { newProfile } from 'graphql/queries/profile';
import { withStorage } from 'providers/StorageProvider';
import { actionCreators as filesActionCreators } from '../../../modules/files';
import View from '../components/View';

const mapActions = {
  downloadFile: filesActionCreators.downloadFile,
};

export default compose(
  connect(null, mapActions),
  withNotifications,
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
)(withStorage(['auth'])(View));
