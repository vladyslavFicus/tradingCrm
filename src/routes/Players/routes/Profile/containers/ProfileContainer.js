import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'react-addons-update';
import { withRouter } from 'react-router-dom';
import { actionCreators } from '../modules';
import { withNotifications, withModals } from '../../../../../components/HighOrder';
import { actionCreators as filesActionCreators } from '../modules/files';
import Profile from '../components/Profile';
import config, { getBrandId } from '../../../../../config';
import Permissions from '../../../../../utils/permissions';
import { userProfileTabs } from '../../../../../config/menu';
import { profileQuery, locksQuery } from '../../../../../graphql/queries/profile';
import { notesQuery } from '../../../../../graphql/queries/notes';
import ConfirmActionModal from '../../../../../components/Modal/ConfirmActionModal';
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
import { lockMutation, unlockMutation } from '../../../../../graphql/mutations/payment';
import { unlockLoginMutation } from '../../../../../graphql/mutations/auth';
import {
  updateNoteMutation,
  removeNoteMutation,
  addNoteMutation,
  removeNote,
  removePinnedNote,
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
    permissions: {
      data: currentPermissions,
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
    userProfileTabs: userProfileTabs
      .filter(i => !(i.permissions instanceof Permissions) || i.permissions.check(currentPermissions)),
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
  }),
  connect(mapStateToProps, mapActions),
  graphql(blockMutation, {
    name: 'blockMutation',
  }),
  graphql(locksQuery, {
    name: 'locks',
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
          playerUUID,
          pinned: true,
        },
      }, {
        query: notesQuery,
        variables: {
          playerUUID,
          size: 10,
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
                tagId,
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
            content,
          },
        } = proxy.readQuery({
          query: notesQuery,
          variables: {
            playerUUID,
            pinned: true,
          },
        });

        const selectedNote = content.find(({
          tagId: noteUuid,
        }) => noteUuid === tagId);

        if (selectedNote && !pinned) {
          removePinnedNote(proxy, { playerUUID }, tagId);
        }

        if (!selectedNote && pinned) {
          addPinnedNote(proxy, { playerUUID, targetUUID }, data);
        }
      },
    }),
  }),
  graphql(unlockMutation, {
    name: 'unlockPayment',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      update: (proxy, {
        data: {
          payment: {
            unlock: {
              data: {
                id,
              },
            },
          },
        },
      }) => {
        const {
          playerProfileLocks: {
            payment,
          },
          playerProfileLocks,
        } = proxy.readQuery({
          query: locksQuery,
          variables: {
            playerUUID,
          },
        });

        if (payment) {
          const selectedIndex = payment.findIndex(({
            id: paymentId,
          }) => id === paymentId);
          const updatedLocks = update(playerProfileLocks, {
            payment: {
              $splice: [
                [selectedIndex, 1],
              ],
            },
          });

          proxy.writeQuery({
            query: locksQuery,
            variables: {
              playerUUID,
            },
            data: {
              playerProfileLocks: updatedLocks,
            },
          });
        }
      },
    }),
  }),
  graphql(lockMutation, {
    name: 'lockPayment',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      update: (proxy, {
        data: {
          payment: {
            lock: {
              data,
              error,
            },
          },
        },
      }) => {
        if (!error) {
          const {
            playerProfileLocks: {
              payment,
            },
            playerProfileLocks,
          } = proxy.readQuery({
            query: locksQuery,
            variables: {
              playerUUID,
            },
          });
          const updatedLocks = update(playerProfileLocks, {
            payment: payment ? {
              $push: [data],
            } : {
              $set: [data],
            },
          });

          proxy.writeQuery({
            query: locksQuery,
            variables: {
              playerUUID,
            },
            data: {
              playerProfileLocks: updatedLocks,
            },
          });
        }
      },
    }),
  }),
  graphql(unlockLoginMutation, {
    name: 'unlockLogin',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      update: (proxy, {
        data: {
          auth: {
            unlockLogin: {
              data: {
                success,
              },
            },
          },
        },
      }) => {
        const {
          playerProfileLocks: {
            login,
          },
          playerProfileLocks,
        } = proxy.readQuery({
          query: locksQuery,
          variables: {
            playerUUID,
          },
        });

        if (login && success) {
          const updatedLocks = update(playerProfileLocks, {
            login: {
              locked: {
                $set: false,
              },
              expirationDate: {
                $set: null,
              },
              reason: {
                $set: null,
              },
            },
          });

          proxy.writeQuery({
            query: locksQuery,
            variables: {
              playerUUID,
            },
            data: {
              playerProfileLocks: updatedLocks,
            },
          });
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
                tagId,
              },
            },
          },
        },
      }) => {
        removePinnedNote(proxy, { playerUUID }, tagId);
        removeNote(proxy, {
          playerUUID,
          size: 10,
          page: 0,
          ...query ? query.filters : {},
        }, tagId);
      },
    }),
  }),
  graphql(updateSubscription, {
    name: 'updateSubscription',
  }),
  graphql(profileQuery, {
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
        playerUUID,
        pinned: true,
      },
    }),
    name: 'pinnedNotes',
  }),
  withNotifications,
)(Profile);
