import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { actionCreators } from '../modules';
import { withNotifications, withModals } from '../../../../../components/HighOrder';
import { actionCreators as filesActionCreators } from '../modules/files';
import Profile from '../components/Profile';
import config, { getBrandId } from '../../../../../config';
import { clientQuery } from '../../../../../graphql/queries/profile';
import { notesQuery } from '../../../../../graphql/queries/notes';
import ConfirmActionModal from '../../../../../components/Modal/ConfirmActionModal';
import RepresentativeUpdateModal from '../../../../../components/RepresentativeUpdateModal';
import NoteModal from '../../../../../components/NoteModal';
import {
  updateSubscription,
  blockMutation,
  resumeMutation,
  suspendMutation,
  suspendProlong,
  unblockMutation,
  passwordResetRequest,
  changePassword,
} from '../../../../../graphql/mutations/profile';
import {
  updateNoteMutation,
  removeNoteMutation,
  addNoteMutation,
  removeNote,
  addPinnedNote,
} from '../../../../../graphql/mutations/note';

const mapStateToProps = (state) => {
  const {
    profile: {
      playerLimits,
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
    playerLimits,
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
          },
        });

        const selectedNote = content.find(({
          noteId: noteUuid,
        }) => noteUuid === noteId);

        if (selectedNote && !pinned) {
          removeNote(proxy, { targetUUID, pinned: true }, noteId);
        }

        if (!selectedNote && pinned) {
          addPinnedNote(proxy, { targetUUID }, data);
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
        removeNote(proxy, { targetUUID: playerUUID, pinned: true }, noteId);
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
    fetchPolicy: 'network-only',
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
        targetUUID: playerUUID,
        pinned: true,
      },
    }),
    name: 'pinnedNotes',
  }),
  withNotifications,
)(Profile);
