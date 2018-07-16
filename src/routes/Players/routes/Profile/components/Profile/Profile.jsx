import React, { Component, Fragment } from 'react';
import ImageViewer from 'react-images';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { Switch, Redirect } from 'react-router-dom';
import Tabs from '../../../../../../components/Tabs';
import Modal from '../../../../../../components/Modal';
import NotFound from '../../../../../NotFound';
import Permissions from '../../../../../../utils/permissions';
import { actions as walletActions } from '../../../../../../constants/wallet';
import {
  actions as statusActions,
  statusActions as userStatuses,
  statuses as playerProfileStatuses,
} from '../../../../../../constants/user';
import Header from '../Header';
import NotePopover from '../../../../../../components/NotePopover';
import { targetTypes } from '../../../../../../constants/note';
import Information from '../Information';
import PropTypes from '../../../../../../constants/propTypes';
import getFileBlobUrl from '../../../../../../utils/getFileBlobUrl';
import {
  UploadModal as UploadFileModal,
  DeleteModal as DeleteFileModal,
} from '../../../../../../components/Files';
import ChangePasswordModal from '../../../../../../components/ChangePasswordModal';
import ShareLinkModal from '../ShareLinkModal';
import BackToTop from '../../../../../../components/BackToTop';
import HideDetails from '../../../../../../components/HideDetails';
import {
  ProfileView,
  Notes,
  Limits,
  Files,
  Feed,
  Devices,
  PaymentAccounts,
  Transactions,
  Rewards,
  ClientView,
} from '../../routes';
import { Route } from '../../../../../../router';
import rootConfig from '../../../../../../config';
import { markets } from '../../../../../../constants/markets';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};
const MODAL_WALLET_LIMIT = 'wallet-limit-modal';
const MODAL_INFO = 'info-modal';
const MODAL_UPLOAD_FILE = 'upload-modal';
const MODAL_DELETE_FILE = 'delete-modal';
const MODAL_CHANGE_PASSWORD = 'change-password-modal';
const MODAL_SHARE_PROFILE = 'share-profile-modal';
const modalInitialState = {
  name: null,
  params: {},
};
const imageViewerInitialState = {
  isOpen: false,
  images: [],
};

class Profile extends Component {
  static propTypes = {
    locks: PropTypes.shape({
      paymentLimits: PropTypes.shape({
        payment: PropTypes.arrayOf(PropTypes.shape({
          type: PropTypes.string,
        })),
        login: PropTypes.shape({
          lock: PropTypes.bool,
          expirationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
          reason: PropTypes.string,
        }),
      }),
    }).isRequired,
    notify: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    notes: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      notes: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
          author: PropTypes.string,
          lastEditorUUID: PropTypes.string,
          targetUUID: PropTypes.string,
        })),
      }),
    }).isRequired,
    lastIp: PropTypes.ipEntity,
    location: PropTypes.object.isRequired,
    config: PropTypes.shape({
      files: PropTypes.shape({
        maxSize: PropTypes.number.isRequired,
        types: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    auth: PropTypes.shape({
      token: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    }).isRequired,
    addTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    updateSubscription: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    unlockPayment: PropTypes.func.isRequired,
    lockPayment: PropTypes.func.isRequired,
    activateProfile: PropTypes.func.isRequired,
    playerProfile: PropTypes.shape({
      playerProfile: PropTypes.shape({
        loading: PropTypes.bool,
      }),
    }).isRequired,
    playerLimits: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.playerLimitEntity).isRequired,
      deposit: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      withdraw: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      error: PropTypes.object,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
    }).isRequired,
    uploadModalInitialValues: PropTypes.object.isRequired,
    cancelFile: PropTypes.func.isRequired,
    resetUploading: PropTypes.func.isRequired,
    uploading: PropTypes.object.isRequired,
    fetchFiles: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    saveFiles: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    blockMutation: PropTypes.func.isRequired,
    unblockMutation: PropTypes.func.isRequired,
    suspendProlong: PropTypes.func.isRequired,
    suspendMutation: PropTypes.func.isRequired,
    resumeMutation: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    userProfileTabs: PropTypes.array.isRequired,
    availableTagsByDepartment: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
  };
  static defaultProps = {
    lastIp: null,
  };
  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };
  static childContextTypes = {
    onAddNote: PropTypes.func.isRequired,
    onEditNote: PropTypes.func.isRequired,
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
    onUploadFileClick: PropTypes.func.isRequired,
    setFileChangedCallback: PropTypes.func.isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
    showImages: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };

  state = {
    popover: { ...popoverInitialState },
    modal: { ...modalInitialState },
    imageViewer: { ...imageViewerInitialState },
    noteChangedCallback: null,
    fileChangedCallback: null,
  };

  getChildContext() {
    return {
      onAddNote: this.props.addNote,
      onEditNote: this.props.updateNote,
      onAddNoteClick: this.handleAddNoteClick,
      onEditNoteClick: this.handleEditNoteClick,
      setNoteChangedCallback: this.setNoteChangedCallback,
      hidePopover: this.handlePopoverHide,
      onUploadFileClick: this.handleUploadFileClick,
      setFileChangedCallback: this.setFileChangedCallback,
      onDeleteFileClick: this.handleDeleteFileClick,
      showImages: this.showImages,
      registerUpdateCacheListener: this.registerUpdateCacheListener,
      unRegisterUpdateCacheListener: this.unRegisterUpdateCacheListener,
    };
  }

  componentDidMount() {
    const { match: { params: { id } }, fetchProfile } = this.props;

    fetchProfile(id);
  }

  get availableStatuses() {
    const { playerProfile } = this.props;
    let profileStatus = get(playerProfile, 'playerProfile.data.profileStatus');

    if (!profileStatus) {
      return [];
    }

    if (profileStatus === playerProfileStatuses.SUSPENDED) {
      const permanent = get(playerProfile, 'playerProfile.data.profileStatusPermanent', false);

      if (permanent) {
        profileStatus = playerProfileStatuses.PERMANENT_SUSPENDED;
      }
    }

    return userStatuses[profileStatus]
      .filter(action => (new Permissions([action.permission]))
        .check(this.context.permissions));
  }

  get availableTags() {
    const { playerProfile: { playerProfile }, availableTagsByDepartment } = this.props;

    if (!playerProfile || !playerProfile.data) {
      return [];
    }

    const { data: { tags } } = playerProfile;
    const selectedTags = tags ? tags.map(option => `${option.priority}/${option.tag}`) : [];

    return selectedTags && availableTagsByDepartment
      ? availableTagsByDepartment
        .filter(option => selectedTags.indexOf(`${option.priority}/${option.value}`) === -1)
      : [];
  }

  setNoteChangedCallback = (cb) => {
    this.setState({ noteChangedCallback: cb });
  };

  setFileChangedCallback = (cb) => {
    this.setState({ fileChangedCallback: cb });
  };

  cacheChildrenComponents = [];

  registerUpdateCacheListener = (componentName, handler) => {
    this.cacheChildrenComponents.push({
      name: componentName,
      update: handler,
    });
  };

  unRegisterUpdateCacheListener = (componentName) => {
    const { cacheChildrenComponents } = this;

    if (cacheChildrenComponents.length) {
      const index = cacheChildrenComponents.findIndex(component => component.name === componentName);

      if (index > -1) {
        cacheChildrenComponents.splice(index, 1);
      }
    }
  };

  handleLoadProfile = async (needForceUpdate = false) => {
    const {
      playerProfile,
      notes,
      fetchFiles,
      fetchProfile,
      profile,
      match: { params },
      locks,
    } = this.props;

    if (!playerProfile.isLoading && !profile.isLoading) {
      await playerProfile.refetch();
      await fetchProfile(params.id);
      await notes.refetch();
      await locks.refetch();
      await fetchFiles(params.id);

      if (needForceUpdate) {
        this.cacheChildrenComponents.forEach((component) => {
          component.update();
        });
      }
    }
  };

  handleOpenModal = (name, params) => {
    this.setState({
      modal: {
        ...this.state.modal,
        name,
        params,
      },
    });
  };

  handleCloseModal = () => {
    this.setState({ modal: { ...modalInitialState } });
  };

  handleAddNoteClick = (targetUUID, targetType) => (target, params = {}) => {
    this.setState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          placement: 'bottom',
          ...params,
          target,
          initialValues: {
            targetUUID,
            targetType,
            pinned: false,
            playerUUID: this.props.match.params.id,
          },
        },
      },
    });
  };

  handleUploadFileClick = (params) => {
    this.setState({
      modal: {
        name: MODAL_UPLOAD_FILE,
        params: {
          profile: get(this.props, 'playerProfile.playerProfile.data', {}),
          ...params,
        },
      },
    });
  };

  handleCloseUploadModal = () => {
    this.handleCloseModal();
    this.handleResetUploading();
  };

  handleResetUploading = () => {
    Object
      .values(this.props.uploading)
      .forEach((file) => {
        this.props.cancelFile(file);
      });

    this.props.resetUploading();
  };

  handleSubmitUploadModal = async (data) => {
    const { fileChangedCallback } = this.state;
    const { auth: { fullName } } = this.props;
    const action = await this.props.saveFiles(this.props.match.params.id, data);
    let hasPinnedNotes = false;

    if (action && !action.error) {
      await Promise.all(Object.values(this.props.uploading).map((file) => {
        if (file.note !== null) {
          if (!hasPinnedNotes && file.note.pinned) {
            hasPinnedNotes = true;
          }
          return this.props.addNote({ variables: { ...file.note, targetUUID: file.fileUUID, author: fullName } });
        }

        return false;
      }));
    }

    this.handleResetUploading();
    this.handleCloseModal();

    if (typeof fileChangedCallback === 'function') {
      fileChangedCallback();
    }
  };

  handleUploadingFileDelete = async (file) => {
    await this.props.deleteFile(this.props.match.params.id, file.fileUUID);
    this.props.cancelFile(file);
  };

  handleDeleteFileClick = (e, data) => {
    e.preventDefault();

    this.setState({
      modal: {
        name: MODAL_DELETE_FILE,
        params: {
          file: data,
          onSuccess: this.handleDelete.bind(null, data),
        },
      },
    });
  };

  handleDelete = async (data) => {
    const { deleteFile } = this.props;
    const { fileChangedCallback } = this.state;

    const action = await deleteFile(this.props.match.params.id, data.uuid);
    if (action && !action.error) {
      if (typeof fileChangedCallback === 'function') {
        fileChangedCallback();
      }
      this.handleCloseModal();
    }
  };

  handleEditNoteClick = (target, item, params = {}) => {
    this.setState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          ...params,
          item,
          target,
          initialValues: { ...item },
        },
      },
    });
  };

  handleDeleteNoteClick = async (item) => {
    const { removeNote } = this.props;
    const { noteChangedCallback } = this.state;

    await removeNote({ variables: { uuid: item.uuid } });
    this.handlePopoverHide();

    if (typeof noteChangedCallback === 'function') {
      noteChangedCallback();
    }
  };

  handleSubmitNote = async (data) => {
    const { updateNote, addNote, auth: { fullName } } = this.props;
    const { noteChangedCallback } = this.state;

    if (data.uuid) {
      const updatedNote = await updateNote({ variables: { ...data, author: fullName } });

      this.handlePopoverHide();

      return updatedNote;
    }

    await addNote({ variables: { ...data, author: fullName } });

    this.handlePopoverHide();

    if (typeof noteChangedCallback === 'function') {
      noteChangedCallback();
    }
  };

  handlePopoverHide = () => {
    this.setState({ popover: { name: null, params: {} } });
  };

  handleResetPasswordClick = () => {
    const {
      playerProfile: {
        playerProfile: {
          data: {
            firstName,
            lastName,
          },
        },
      },
      match: { params: { id } },
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      uuid: id,
      onSubmit: this.handleResetPassword,
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TEXT'),
      fullName: `${firstName} ${lastName}`,
      submitButtonLabel: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.BUTTON_ACTION'),
    });
  };

  handleResetPassword = async () => {
    const {
      notify,
      passwordResetRequest,
      modals: { confirmActionModal },
    } = this.props;

    const response = await passwordResetRequest();
    const success = get(response, 'data.profile.passwordResetRequest.success');

    if (success) {
      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.SUCCESS_NOTIFICATION_TEXT'),
      });

      confirmActionModal.hide();
    } else {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.ERROR_NOTIFICATION_TEXT'),
      });
    }
  };

  handleSubmitNewPassword = async ({ password }) => {
    const { changePassword, notify, match: { params: { id: playerUUID } } } = this.props;

    const response = await changePassword({ variables: { password, playerUUID } });
    const success = get(response, 'data.profile.changePassword.success');

    notify({
      level: !success ? 'error' : 'success',
      title: !success
        ? I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE')
        : I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.TITLE'),
      message: !success
        ? I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE')
        : I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.MESSAGE'),
    });

    if (success) {
      this.handleCloseModal();
    }
  };

  handleProfileActivateClick = async () => {
    const { activateProfile, playerProfile: { playerProfile: { data: { playerUUID, email } } } } = this.props;

    if (playerUUID) {
      const action = await activateProfile(playerUUID);

      if (action && !action.error) {
        this.handleOpenModal(MODAL_INFO, {
          header: 'Send user activation link',
          body: (
            <span>
              Activation link has been sent to <strong>{email || playerUUID}</strong>.
            </span>
          ),
          footer: (
            <button className="btn btn-default-outline mr-auto" onClick={this.handleCloseModal}>
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </button>
          ),
        });
      }
    }
  };

  handleAddTag = (tag, priority) => {
    this.props.addTag({ tag, priority });
  };

  handleDeleteTag = (id) => {
    const { match: { params: { id: playerUUID } } } = this.props;
    this.props.removeTag({ variables: { id: parseInt(id, 10), playerUUID } });
  };

  handleChangePlayerLimitState = ({ action, ...data }) => {
    if (walletActions.LOCK === action) {
      this.props.lockPayment({ variables: { ...data, playerUUID: this.props.match.params.id } });
    } else {
      this.props.unlockPayment({ variables: { ...data, playerUUID: this.props.match.params.id } });
    }
  };

  handleUnlockLogin = () => this.props.unlockLogin({ variables: { playerUUID: this.props.match.params.id } });

  handleUpdateSubscription = async (data) => {
    const { match: { params: { id: playerUUID } }, updateSubscription } = this.props;

    return updateSubscription({ variables: { playerUUID, ...data } });
  };

  showImages = async (url, type, options = {}) => {
    const images = [{
      src: await getFileBlobUrl(url, {
        method: 'GET',
        headers: {
          Accept: type,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.auth.token}`,
        },
      }),
    }];

    this.setState({
      imageViewer: {
        isOpen: true,
        images,
        ...options,
        onClose: () => this.handleCloseImageViewer(() => window.URL.revokeObjectURL(images[0])),
      },
    });
  };

  handleCloseImageViewer = (cb) => {
    this.setState({ imageViewer: { ...imageViewerInitialState } }, () => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  };

  handleChangePasswordClick = () => {
    const { playerProfile: { playerProfile: { data: playerProfile } } } = this.props;

    this.handleOpenModal(MODAL_CHANGE_PASSWORD, {
      fullName: `${playerProfile.firstName} ${playerProfile.lastName}`,
      playerUUID: `${playerProfile.authorUuid}`,
    });
  };

  handleShareProfileClick = () => {
    this.handleOpenModal(MODAL_SHARE_PROFILE);
  };

  handleChangeStatus = async ({ action, ...data }) => {
    const {
      blockMutation,
      unblockMutation,
      suspendProlong,
      suspendMutation,
      resumeMutation,
      locks,
    } = this.props;

    switch (action) {
      case statusActions.BLOCK:
        await blockMutation({ variables: data });
        break;
      case statusActions.UNBLOCK:
        await unblockMutation({ variables: data });
        break;
      case statusActions.REMOVE:
        await resumeMutation({ variables: data });
        break;
      case statusActions.SUSPEND: {
        const { durationAmount, durationUnit, ...variables } = data;
        let duration;

        if (durationAmount && durationUnit) {
          duration = { amount: durationAmount, unit: durationUnit };
        }

        await suspendMutation({ variables: { ...variables, duration } });
      }
        break;
      case statusActions.PROLONG: {
        const { durationAmount, durationUnit, ...variables } = data;
        let duration;

        if (durationAmount && durationUnit) {
          duration = { amount: durationAmount, unit: durationUnit };
        }

        await suspendProlong({ variables: { ...variables, duration } });
      }
        break;
      default:
        break;
    }

    locks.refetch();
  };

  render() {
    if (get(this.props, 'playerProfile.playerProfile.error')) {
      return <NotFound />;
    }

    const { modal, popover, imageViewer: imageViewerState } = this.state;
    const {
      playerProfile: { playerProfile, loading },
      match: { params },
      location,
      notes: { notes },
      playerLimits,
      uploading,
      uploadModalInitialValues,
      config,
      updateNote,
      match: {
        url,
        path,
        params: {
          id,
        },
      },
      locks,
      locale,
      userProfileTabs,
    } = this.props;

    const profile = get(playerProfile, 'data');
    const playerProfileLocks = get(locks, 'playerProfileLocks');
    const viewComponent = rootConfig.market === markets.crm ? ClientView : ProfileView;

    return (
      <Fragment>
        <div className="profile__info">
          <Header
            playerProfile={profile}
            locale={locale}
            locks={playerProfileLocks}
            lastIp={get(profile, 'signInIps.0')}
            availableStatuses={this.availableStatuses}
            onStatusChange={this.handleChangeStatus}
            availableTags={this.availableTags}
            currentTags={profile && profile.tags
              ? profile.tags.map(({ tag, ...data }) => ({ label: tag, value: tag, ...data }))
              : []
            }
            playerLimits={{
              state: playerLimits,
              actions: { onChange: this.handleChangePlayerLimitState },
              unlockLogin: this.handleUnlockLogin,
            }}
            isLoadingProfile={loading}
            addTag={this.handleAddTag}
            deleteTag={this.handleDeleteTag}
            onAddNoteClick={this.handleAddNoteClick(params.id, targetTypes.PROFILE)}
            onResetPasswordClick={this.handleResetPasswordClick}
            onProfileActivateClick={this.handleProfileActivateClick}
            onPlayerLimitChange={this.handleChangePlayerLimitState}
            onRefreshClick={() => this.handleLoadProfile(true)}
            loaded={!loading}
            onChangePasswordClick={this.handleChangePasswordClick}
            onShareProfileClick={this.handleShareProfileClick}
          />
          <HideDetails>
            <Information
              data={profile}
              ips={get(profile, 'signInIps', [])}
              updateSubscription={this.handleUpdateSubscription}
              onEditNoteClick={this.handleEditNoteClick}
              notes={notes}
            />
          </HideDetails>
        </div>
        <Tabs
          items={userProfileTabs}
          location={location}
          params={params}
        />
        <div className="card no-borders">
          <Switch>
            <Route disableScroll path={`${path}/profile`} component={viewComponent} />
            <Route disableScroll path={`${path}/notes`} component={Notes} />
            <Route disableScroll path={`${path}/limits`} component={Limits} />
            <Route disableScroll path={`${path}/files`} component={Files} />
            <Route disableScroll path={`${path}/feed`} component={Feed} />
            <Route disableScroll path={`${path}/paymentAccounts`} component={PaymentAccounts} />
            <Route disableScroll path={`${path}/devices`} component={Devices} />
            <Route disableScroll path={`${path}/rewards`} component={Rewards} />
            <Route disableScroll path={`${path}/transactions`} component={Transactions} />
            <Redirect to={`${url}/profile`} />
          </Switch>
        </div>
        {
          popover.name === NOTE_POPOVER &&
          <NotePopover
            toggle={this.handlePopoverHide}
            isOpen
            onSubmit={this.handleSubmitNote}
            onDelete={this.handleDeleteNoteClick}
            {...popover.params}
          />
        }
        {
          modal.name === MODAL_UPLOAD_FILE &&
          <UploadFileModal
            {...modal.params}
            onClose={this.handleCloseUploadModal}
            uploading={Object.values(uploading)}
            initialValues={uploadModalInitialValues}
            uploadFile={this.props.uploadFile}
            onCancelFile={this.handleUploadingFileDelete}
            onSubmit={this.handleSubmitUploadModal}
            onManageNote={updateNote}
            maxFileSize={config.files.maxSize}
            allowedFileTypes={config.files.types}
          />
        }
        {
          modal.name === MODAL_DELETE_FILE &&
          <DeleteFileModal
            {...modal.params}
            playerProfile={playerProfile}
            onClose={this.handleCloseModal}
          />
        }
        {
          modal.name === MODAL_INFO &&
          <Modal
            isOpen
            onClose={this.handleCloseModal}
            {...modal.params}
          />
        }
        {
          modal.name === MODAL_WALLET_LIMIT &&
          <Modal
            isOpen
            onClose={this.handleCloseModal}
            {...modal.params}
          />
        }
        {
          modal.name === MODAL_CHANGE_PASSWORD &&
          <ChangePasswordModal
            {...modal.params}
            onClose={this.handleCloseModal}
            onSubmit={this.handleSubmitNewPassword}
          />
        }
        {
          modal.name === MODAL_SHARE_PROFILE && playerProfile &&
          <ShareLinkModal
            onClose={this.handleCloseModal}
            playerUUID={id}
          />
        }
        <ImageViewer
          backdropClosesModal
          showImageCount={false}
          {...imageViewerState}
          onClose={this.handleCloseImageViewer}
        />
        <BackToTop />
      </Fragment>
    );
  }
}

export default Profile;
