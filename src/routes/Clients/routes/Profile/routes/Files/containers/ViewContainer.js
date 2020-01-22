import { graphql, compose } from 'react-apollo';
import { getFilesCategoriesList, getFilesListByProfileUUID } from 'graphql/queries/files';
import { updateFileStatusMutation, updateFileMetaMutation, deleteMutation } from 'graphql/mutations/files';
import { withNotifications, withModals } from 'components/HighOrder';
import { withStorage } from 'providers/StorageProvider';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import Files from '../components/Files';

export default compose(
  withNotifications,
  withStorage(['token']),
  withModals({
    deleteModal: ConfirmActionModal,
  }),
  graphql(deleteMutation, {
    name: 'delete',
  }),
  graphql(updateFileMetaMutation, {
    name: 'updateFileMeta',
  }),
  graphql(getFilesCategoriesList, {
    name: 'getFilesCategoriesList',
  }),
  graphql(updateFileStatusMutation, {
    name: 'updateFileStatus',
    options: ({
      match: { params: { id: clientUuid } },
    }) => ({
      variables: { clientUuid },
    }),
  }),
  graphql(getFilesListByProfileUUID, {
    name: 'filesList',
    options: ({
      match: { params: { id: clientUUID } },
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        clientUUID,
        page: 0,
        size: 20,
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),
)(Files);
