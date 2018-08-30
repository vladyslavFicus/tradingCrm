import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'react-addons-update';
import { withRouter } from 'react-router-dom';
import { actionCreators } from '../modules';
import { withNotifications, withModals } from '../../../../../components/HighOrder';
import { actionCreators as filesActionCreators } from '../modules/files';
import Profile from '../components/Profile';
import config, { getAvailableTags, getBrandId } from '../../../../../config';
import { profileQuery } from '../../../../../graphql/queries/profile';
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
import {
  updateNoteMutation,
  removeNoteMutation,
  addNoteMutation,
  removeNote,
  addNote,
} from '../../../../../graphql/mutations/note';
import { removeTagMutation, addTagMutation } from '../../../../../graphql/mutations/tag';

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
  const availableTagsByDepartment = getAvailableTags(auth.department);

  return {
    auth,
    availableTagsByDepartment,
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
      auth: {
        fullName,
      },
      match: {
        params: {
          id: playerUUID,
        },
      },
      location: { query },
    }) => ({
      variables: {
        author: fullName,
      },
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
    options: () => ({
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
            targetUUID,
            pinned: true,
          },
        });
        const selectedNote = content.find(({
          uuid: noteUuid,
        }) => noteUuid === tagId);

        if (selectedNote && !pinned) {
          removeNote(proxy, {
            targetUUID,
            pinned: true,
          }, tagId);
        }

        if (!selectedNote && pinned) {
          addNote(proxy, {
            targetUUID,
            pinned: true,
          }, data);
        }
      },
    }),
  }),
  graphql(addTagMutation, {
    name: 'addTag',
    props: ({
      ownProps: {
        match: {
          params: {
            id: playerUUID,
          },
        },
      },
      addTag,
    }) => ({
      addTag({
        priority,
        tag,
      }) {
        return addTag({
          variables: {
            playerUUID,
            priority,
            tag,
          },
          optimisticResponse: {
            tag: {
              __typename: 'TagMutation',
              add: {
                __typename: 'addTag',
                error: null,
                data: {
                  priority,
                  id: null,
                  tag,
                  __typename: 'Tag',
                },
              },
            },
          },
        });
      },
    }),
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      update: (proxy, {
        data: {
          tag: {
            add: {
              data,
              error,
            },
          },
        },
      }) => {
        if (!error) {
          const {
            playerProfile,
          } = proxy.readQuery({
            query: profileQuery,
            variables: {
              playerUUID,
            },
          });
          const updatedProfile = update(playerProfile, {
            data: {
              tags: {
                $push: [data],
              },
            },
          });

          proxy.writeQuery({
            query: profileQuery,
            variables: {
              playerUUID,
            },
            data: {
              playerProfile: updatedProfile,
            },
          });
        }
      },
    }),
  }),
  graphql(removeTagMutation, {
    name: 'removeTag',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      update: (proxy, {
        data: {
          tag: {
            remove: {
              data,
              error,
            },
          },
        },
      }) => {
        if (error) {
          return;
        }
        const {
          id,
        } = data;
        const {
          playerProfile: {
            data: {
              tags,
            },
          },
          playerProfile,
        } = proxy.readQuery({
          query: profileQuery,
          variables: {
            playerUUID,
          },
        });

        if (tags) {
          const selectedIndex = tags.findIndex(({
            id: tagId,
          }) => parseInt(id, 10) === tagId);
          const updatedProfile = update(playerProfile, {
            data: {
              tags: {
                $splice: [
                  [selectedIndex, 1],
                ],
              },
            },
          });

          proxy.writeQuery({
            query: profileQuery,
            variables: {
              playerUUID,
            },
            data: {
              playerProfile: updatedProfile,
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
        removeNote(proxy, {
          targetUUID: playerUUID,
          pinned: true,
        }, tagId);
        removeNote(proxy, {
          targetUUID: playerUUID,
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
        targetUUID: playerUUID,
        pinned: true,
      },
    }),
    name: 'notes',
  }),
  withNotifications,
)(Profile);
