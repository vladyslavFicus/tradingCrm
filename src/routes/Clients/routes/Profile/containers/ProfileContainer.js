import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withNotifications, withModals } from 'components/HighOrder';
import config, { getActiveBrandConfig, getBrandId } from 'config';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import NoteModal from 'components/NoteModal';
import { clientQuery, getLoginLock } from 'graphql/queries/profile';
import { notesQuery } from 'graphql/queries/notes';
import { questionnaireLasDataQuery } from 'graphql/queries/questionnaire';
import { unlockLoginMutation } from 'graphql/mutations/auth';
import {
  updateSubscription,
  blockMutation,
  resumeMutation,
  suspendMutation,
  suspendProlong,
  unblockMutation,
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
import { actionCreators as filesActionCreators } from '../modules/files';
import Profile from '../components/Profile';
import { actionCreators } from '../modules';

const PINNED_NOTES_SIZE = 100;

const mapStateToProps = (state) => {
  const {
    profile: {
      uploading,
      profile,
    },
    auth,
    i18n: {
      locale,
    },
  } = state;

  const uploadModalInitialValues = {};
  const uploadingFilesUUIDs = Object.keys(uploading);
  if (uploadingFilesUUIDs.length) {
    uploadingFilesUUIDs.forEach((uuid) => {
      uploadModalInitialValues[uuid] = {
        name: '',
        category: '',
      };
    });
  }

  return {
    auth,
    profile,
    uploading,
    uploadModalInitialValues,
    locale,
    config: config.player,
  };
};

const mapActions = {
  changePassword: actionCreators.changePassword,
  activateProfile: actionCreators.activateProfile,
  uploadFile: actionCreators.uploadFile,
  cancelFile: actionCreators.cancelFile,
  resetUploading: actionCreators.resetUploading,
  fetchFiles: filesActionCreators.fetchFiles,
  saveFiles: filesActionCreators.saveFiles,
  deleteFile: filesActionCreators.deleteFile,
  downloadFile: filesActionCreators.downloadFile,
  fetchProfile: actionCreators.fetchProfile,
};

export default compose(
  withRouter,
  withModals({
    confirmActionModal: ConfirmActionModal,
    noteModal: NoteModal,
    representativeModal: RepresentativeUpdateModal,
  }),
  connect(mapStateToProps, mapActions),
  graphql(blockMutation, {
    name: 'blockMutation',
  }),
  graphql(suspendMutation, {
    name: 'suspendMutation',
  }),
  graphql(suspendProlong, {
    name: 'suspendProlong',
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
  graphql(resumeMutation, {
    name: 'resumeMutation',
  }),
  graphql(unblockMutation, {
    name: 'unblockMutation',
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
  graphql(clientQuery, {
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
    name: 'playerProfile',
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
  withNotifications,
)(Profile);
