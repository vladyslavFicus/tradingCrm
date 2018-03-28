import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'react-addons-update';
import { actionCreators } from '../modules';
import { withNotifications } from '../../../components/HighOrder';
import { actionCreators as filesActionCreators } from '../modules/files';
import ProfileLayout from '../layouts/ProfileLayout';
import config, { getAvailableTags } from '../../../config';
import Permissions from '../../../utils/permissions';
import { userProfileTabs } from '../../../config/menu';
import { profileQuery } from '.././../../graphql/queries/profile';
import { locksQuery } from '.././../../graphql/queries/payment';
import { notesQuery } from '.././../../graphql/queries/notes';
import {
  updateSubscription,
  blockMutation,
  resumeMutation,
  suspendMutation,
  suspendProlong,
  unblockMutation,
  passwordResetRequest,
  changePassword,
} from '.././../../graphql/mutations/profile';
import { lockMutation, unlockMutation } from '.././../../graphql/mutations/payment';
import {
  updateNoteMutation,
  removeNoteMutation,
  addNoteMutation,
  removeNotes,
  removeNote,
  addNote,
} from '.././../../graphql/mutations/note';
import { removeTagMutation, addTagMutation } from '.././../../graphql/mutations/tag';

const mapStateToProps = (state) => {
  const {
    profile: {
      profile,
      notes,
      playerLimits,
      uploading,
    },
    auth,
    i18n: { locale },
    permissions: { data: currentPermissions },
  } = state;

  const uploadModalInitialValues = {};
  const uploadingFilesUUIDs = Object.keys(uploading);
  if (uploadingFilesUUIDs.length) {
    uploadingFilesUUIDs.forEach((uuid) => {
      uploadModalInitialValues[uuid] = { name: '', category: '' };
    });
  }
  const availableTagsByDepartment = getAvailableTags(auth.department);

  return {
    auth,
    profile,
    notes,
    availableTagsByDepartment,
    playerLimits,
    uploading,
    uploadModalInitialValues,
    userProfileTabs: userProfileTabs.filter(
      i => !(i.permissions instanceof Permissions) || i.permissions.check(currentPermissions)
    ),
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
};

export default compose(
  connect(mapStateToProps, mapActions),
  graphql(blockMutation, {
    name: 'blockMutation',
  }),
  graphql(locksQuery, {
    name: 'locks',
    options: ({ params: { id: playerUUID } }) => ({
      variables: {
        playerUUID,
      },
    }),
  }),
  graphql(suspendMutation, {
    name: 'suspendMutation',
  }),
  graphql(suspendProlong, {
    name: 'suspendProlong',
  }),
  graphql(passwordResetRequest, {
    name: 'passwordResetRequest',
    options: ({ params: { id: playerUUID } }) => ({
      variables: {
        playerUUID,
        brandId: window.app.brandId,
      },
    }),
  }),
  graphql(changePassword, {
    name: 'changePassword',
    options: ({ params: { id: playerUUID } }) => ({
      variables: {
        playerUUID,
      },
    }),
  }),
  graphql(resumeMutation, {
    name: 'resumeMutation',
  }),
  graphql(unblockMutation, {
    name: 'unblockMutation',
  }),
  graphql(updateNoteMutation, {
    name: 'updateNote',
    options: ({ profile: { data: { playerUUID } } }) => ({
      update: (proxy, { data: { note: { update: { data: { uuid, pinned }, data } } } }) => {
        const { notes: { content } } = proxy.readQuery({ query: notesQuery, variables: { playerUUID, pinned: true } });
        const selectedNote = content.find(({ uuid: noteUuid }) => noteUuid === uuid);

        if (selectedNote && !pinned) {
          removeNote(proxy, { playerUUID, pinned: true }, uuid);
        }

        if (!selectedNote && pinned) {
          addNote(proxy, { playerUUID, pinned: true }, data);
        }
      },
    }),
  }),
  graphql(addTagMutation, {
    name: 'addTag',
    options: ({ params: { id: playerUUID } }) => ({
      variables: {
        playerUUID,
      },
      update: (proxy, { data: { tag: { add: { data, error } } } }) => {
        if (!error) {
          const {
            playerProfile: {
              data: {
                tags,
              },
            },
            playerProfile,
          } = proxy.readQuery({ query: profileQuery, variables: { playerUUID } });
          const updatedProfile = update(playerProfile, {
            data: { tags: tags ? { $push: [data] } : { $set: [data] } },
          });

          proxy.writeQuery({ query: profileQuery, variables: { playerUUID }, data: { playerProfile: updatedProfile } });
        }
      },
    }),
  }),
  graphql(removeTagMutation, {
    name: 'removeTag',
    options: ({ params: { id: playerUUID } }) => ({
      variables: {
        playerUUID,
      },
      update: (proxy, { data: { tag: { remove: { data, error } } } }) => {
        if (error) {
          return;
        }
        const { id } = data;
        const {
          playerProfile: {
            data: {
              tags,
            },
          },
          playerProfile,
        } = proxy.readQuery({ query: profileQuery, variables: { playerUUID } });

        if (tags) {
          const selectedIndex = tags.findIndex(({ id: tagId }) => parseInt(id, 10) === tagId);
          const updatedProfile = update(playerProfile, {
            data: { tags: { $splice: [[selectedIndex, 1]] } },
          });

          proxy.writeQuery({ query: profileQuery, variables: { playerUUID }, data: { playerProfile: updatedProfile } });
        }
      },
    }),
  }),
  graphql(unlockMutation, {
    name: 'unlockPayment',
    options: ({ params: { id: playerUUID } }) => ({
      update: (proxy, { data: { payment: { unlock: { data: { id } } } } }) => {
        const {
          paymentLocks: {
            payment,
          },
          paymentLocks,
        } = proxy.readQuery({ query: locksQuery, variables: { playerUUID } });

        if (payment) {
          const selectedIndex = payment.findIndex(({ id: paymentId }) => id === paymentId);
          const updatedLocks = update(paymentLocks, {
            payment: { $splice: [[selectedIndex, 1]] },
          });

          proxy.writeQuery({ query: locksQuery, variables: { playerUUID }, data: { paymentLocks: updatedLocks } });
        }
      },
    }),
  }),
  graphql(lockMutation, {
    name: 'lockPayment',
    options: ({ params: { id: playerUUID } }) => ({
      update: (proxy, { data: { payment: { lock: { data, error } } } }) => {
        if (!error) {
          const {
            paymentLocks: {
              payment,
            },
            paymentLocks,
          } = proxy.readQuery({ query: locksQuery, variables: { playerUUID } });
          const updatedLocks = update(paymentLocks, {
            payment: payment ? { $push: [data] } : { $set: [data] },
          });

          proxy.writeQuery({ query: locksQuery, variables: { playerUUID }, data: { paymentLocks: updatedLocks } });
        }
      },
    }),
  }),
  graphql(addNoteMutation, {
    name: 'addNote',
    options: ({ auth: { fullName }, params: { id: playerUUID } }) => ({
      variables: {
        author: fullName,
      },
      refetchQueries: [{
        query: notesQuery,
        variables: {
          playerUUID,
          pinned: true,
        },
      },
      {
        query: notesQuery,
        variables: {
          playerUUID,
        },
      }],
    }),
  }),
  graphql(removeNoteMutation, {
    name: 'removeNote',
    options: ({ profile: { data: { playerUUID } } }) => ({
      update: (proxy, { data: { note: { remove: { data: { uuid } } } } }) => {
        removeNotes(proxy, playerUUID, uuid);
      },
    }),
  }),

  graphql(updateSubscription, {
    name: 'updateSubscription',
  }),
  graphql(profileQuery, {
    options: ({ params: { id: playerUUID } }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'playerProfile',
  }),
  graphql(notesQuery, {
    options: ({ params: { id: playerUUID } }) => ({
      variables: {
        playerUUID,
        pinned: true,
      },
    }),
    name: 'notes',
  }),
  withNotifications,
)(ProfileLayout);
