import compose from 'compose-function';
import { graphql } from '@apollo/client/react/hoc';
import { withNotifications, withModals } from 'hoc';
import { getFilesCategories, getFilesByProfileUUID } from 'graphql/queries/files';
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
  graphql(getFilesCategories, {
    name: 'filesCategoriesData',
  }),
  graphql(updateFileStatusMutation, {
    name: 'updateFileStatus',
    options: ({
      match: { params: { id } },
    }) => ({
      variables: { uuid: id },
    }),
  }),
  graphql(getFilesByProfileUUID, {
    name: 'clientFilesData',
    options: ({
      match: { params: { id: clientUuid } },
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        clientUuid,
        page: 0,
        size: 20,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(Files);
