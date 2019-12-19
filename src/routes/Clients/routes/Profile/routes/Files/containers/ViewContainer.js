import { graphql, compose } from 'react-apollo';
import { getFilesCategoriesList } from 'graphql/queries/files';
import { deleteMutation, updateFileStatusMutation, updateFileMetaMutation } from 'graphql/mutations/files';
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
)(Files);
