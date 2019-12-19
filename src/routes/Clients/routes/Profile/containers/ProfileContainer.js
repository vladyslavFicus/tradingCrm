import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { getActiveBrandConfig, getBrandId } from 'config';
import { withPermission } from 'providers/PermissionsProvider';
import { withStorage } from 'providers/StorageProvider';
import { withNotifications, withModals } from 'components/HighOrder';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import NoteModal from 'components/NoteModal';
import { getLoginLock, newProfile } from 'graphql/queries/profile';
import { getFilesListByProfileUUID } from 'graphql/queries/files';
import { notesQuery } from 'graphql/queries/notes';
import { questionnaireLasDataQuery } from 'graphql/queries/questionnaire';
import { unlockLoginMutation } from 'graphql/mutations/auth';
import {
  updateSubscription,
  changeProfileStatusMutation,
  passwordResetRequest,
  changePassword,
} from 'graphql/mutations/profile';
import {
  updateNoteMutation,
  removeNoteMutation,
  addNoteMutation,
  removeNote,
  addPinnedNote,
} from 'graphql/mutations/note';
import Profile from '../components/Profile';

const PINNED_NOTES_SIZE = 100;

export default compose(
  withRouter,
  withPermission,
  withNotifications,
  withStorage(['token']),
  withModals({
    confirmActionModal: ConfirmActionModal,
    noteModal: NoteModal,
    representativeModal: RepresentativeUpdateModal,
  }),
  graphql(changeProfileStatusMutation, {
    name: 'changeProfileStatus',
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
  graphql(passwordResetRequest, {
    name: 'passwordResetRequest',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
        brandId: getBrandId(),
      },
    }),
  }),
  graphql(changePassword, {
    name: 'changePassword',
  }),
  graphql(addNoteMutation, {
    name: 'addNote',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
      location: { query },
    }) => ({
      refetchQueries: [{
        query: notesQuery,
        variables: {
          size: PINNED_NOTES_SIZE,
          targetUUID: playerUUID,
          pinned: true,
        },
      }, {
        query: notesQuery,
        variables: {
          targetUUID: playerUUID,
          size: 25,
          page: 0,
          ...query ? query.filters : {},
        },
      }],
    }),
  }),
  graphql(updateNoteMutation, {
    name: 'updateNote',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      update: (proxy, {
        data: {
          note: {
            update: {
              data: {
                noteId,
                pinned,
                targetUUID,
              },
              data,
            },
          },
        },
      }) => {
        const {
          notes: {
            data: {
              content,
            },
          },
        } = proxy.readQuery({
          query: notesQuery,
          variables: {
            targetUUID: playerUUID,
            pinned: true,
            size: PINNED_NOTES_SIZE,
          },
        });

        const selectedNote = content.find(({
          noteId: noteUuid,
        }) => noteUuid === noteId);

        if (selectedNote && !pinned) {
          removeNote(proxy, { targetUUID, pinned: true, size: PINNED_NOTES_SIZE }, noteId);
        }

        if (!selectedNote && pinned) {
          addPinnedNote(proxy, { targetUUID, size: PINNED_NOTES_SIZE }, data);
        }
      },
    }),
  }),
  graphql(removeNoteMutation, {
    name: 'removeNote',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
      location: { query },
    }) => ({
      update: (proxy, {
        data: {
          note: {
            remove: {
              data: {
                noteId,
              },
            },
          },
        },
      }) => {
        removeNote(proxy, { targetUUID: playerUUID, pinned: true, size: PINNED_NOTES_SIZE }, noteId);
        removeNote(proxy, {
          targetUUID: playerUUID,
          size: 25,
          page: 0,
          ...query ? query.filters : {},
        }, noteId);
      },
    }),
  }),
  graphql(updateSubscription, {
    name: 'updateSubscription',
  }),
  graphql(newProfile, {
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
    name: 'newProfile',
  }),
  graphql(notesQuery, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        size: PINNED_NOTES_SIZE,
        targetUUID: playerUUID,
        pinned: true,
      },
    }),
    name: 'pinnedNotes',
  }),
  graphql(questionnaireLasDataQuery, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        profileUUID: playerUUID,
      },
    }),
    skip: () => !getActiveBrandConfig().regulation.isActive,
    name: 'questionnaireLastData',
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
)(Profile);
