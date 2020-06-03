import { graphql, compose } from 'react-apollo';
import { withNotifications, withModals } from 'hoc';
import { getFilesCategoriesList, getFilesListByProfileUUID } from 'graphql/queries/files';
import { updateFileStatusMutation, updateFileMetaMutation } from 'graphql/mutations/files';
import { withStorage } from 'providers/StorageProvider';
import { UploadModal } from 'components/Files';
import Files from '../components/Files';

export default compose(
  withNotifications,
  withStorage(['token']),
  withModals({
    uploadModal: UploadModal,
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
