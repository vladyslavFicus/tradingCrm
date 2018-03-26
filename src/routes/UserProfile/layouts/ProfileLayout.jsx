import React, { Component } from 'react';
import ImageViewer from 'react-images';
import { Collapse } from 'reactstrap';
import get from 'lodash/get';
import { I18n } from 'react-redux-i18n';
import Tabs from '../../../components/Tabs';
import Modal from '../../../components/Modal';
import Permissions from '../../../utils/permissions';
import { actions as walletActions } from '../../../constants/wallet';
import { actions as statusActions, statusActions as userStatuses } from '../../../constants/user';
import Header from '../components/Header';
import NotePopover from '../../../components/NotePopover';
import { targetTypes } from '../../../constants/note';
import Information from '../components/Information';
import PropTypes from '../../../constants/propTypes';
import getFileBlobUrl from '../../../utils/getFileBlobUrl';
import {
  UploadModal as UploadFileModal,
  DeleteModal as DeleteFileModal,
} from '../../../components/Files';
import ChangePasswordModal from '../../../components/ChangePasswordModal';
import ShareLinkModal from '../components/ShareLinkModal';
import ConfirmActionModal from '../../../components/Modal/ConfirmActionModal';
import BackToTop from '../../../components/BackToTop';

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
const MODAL_RESET_PASSWORD = 'reset-password-modal';
const modalInitialState = {
  name: null,
  params: {},
};
const imageViewerInitialState = {
  isOpen: false,
  images: [],
};

class ProfileLayout extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      data: PropTypes.userProfile.isRequired,
      error: PropTypes.any,
      isLoading: PropTypes.bool.isRequired,
    }).isRequired,
    children: PropTypes.any.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    notes: PropTypes.object.isRequired,
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
    fetchProfile: PropTypes.func.isRequired,
    updateSubscription: PropTypes.func.isRequired,
    fetchNotes: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    unlockPayment: PropTypes.func.isRequired,
    lockPayment: PropTypes.func.isRequired,
    activateProfile: PropTypes.func.isRequired,
    checkLock: PropTypes.func.isRequired,
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
    unlockLogin: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    saveFiles: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    blockMutation: PropTypes.func.isRequired,
    unblockMutation: PropTypes.func.isRequired,
    suspendProlong: PropTypes.func.isRequired,
    suspendMutation: PropTypes.func.isRequired,
    resumeMutation: PropTypes.func.isRequired,
    userProfileTabs: PropTypes.array.isRequired,
  };
  static defaultProps = {
    lastIp: null,
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
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
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  state = {
    popover: { ...popoverInitialState },
    modal: { ...modalInitialState },
    imageViewer: { ...imageViewerInitialState },
    noteChangedCallback: null,
    fileChangedCallback: null,
    informationShown: true,
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
      cacheChildrenComponent: this.cacheChildrenComponent,
    };
  }

  componentDidMount() {
    this.handleLoadAdditionalProfileData();
  }
  get availableStatuses() {
    const { playerProfile: { playerProfile: profile } } = this.props;

    return userStatuses[profile.data.profileStatus]
      .filter(action => (new Permissions([action.permission]))
        .check(this.context.permissions));
  }

  get availableTags() {
    const { playerProfile: { playerProfile: { data: { tags } } }, availableTagsByDepartment } = this.props;
    const selectedTags = tags
      ? tags.map(option => `${option.priority}/${option.tag}`)
      : [];

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

  cacheChildrenComponent = (component) => {
    this.children = component;
  };

  handleLoadProfile = (needForceUpdate = false) => {
    const {
      profile,
      fetchProfile,
      params,
    } = this.props;

    if (!profile.isLoading) {
      fetchProfile(params.id)
        .then(this.handleLoadAdditionalProfileData)
        .then(() => {
          if (needForceUpdate &&
            this.children &&
            typeof this.children.handleRefresh === 'function') {
            this.children.handleRefresh();
          }
        });
    }
  };

  handleLoadAdditionalProfileData = () => {
    const {
      params,
      fetchNotes,
      checkLock,
      fetchFiles,
    } = this.props;

    return fetchNotes({ playerUUID: params.id, pinned: true })
      .then(() => fetchFiles(params.id))
      .then(() => checkLock(params.id, { size: 999 }));
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

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  handleAddNoteClick = (targetUUID, targetType) => (target, params = {}) => {
    this.setState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          placement: 'left bottom',
          ...params,
          target,
          initialValues: {
            targetUUID,
            targetType,
            pinned: false,
            playerUUID: this.props.params.id,
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
          profile: this.props.profile.data,
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

    const action = await this.props.saveFiles(this.props.params.id, data);
    let hasPinnedNotes = false;

    if (action && !action.error) {
      await Promise.all(Object.values(this.props.uploading).map((file) => {
        if (file.note !== null) {
          if (!hasPinnedNotes && file.note.pinned) {
            hasPinnedNotes = true;
          }
          return this.props.addNote({ ...file.note, targetUUID: file.fileUUID });
        }

        return false;
      }));
    }

    if (hasPinnedNotes) {
      this.handleRefreshPinnedNotes();
    }

    this.handleResetUploading();
    this.handleCloseModal();

    if (typeof fileChangedCallback === 'function') {
      fileChangedCallback();
    }
  };

  handleUploadingFileDelete = async (file) => {
    await this.props.deleteFile(this.props.params.id, file.fileUUID);
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

    const action = await deleteFile(this.props.params.id, data.uuid);
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
    const { updateNote, addNote } = this.props;
    const { noteChangedCallback } = this.state;

    if (data.uuid) {
      return updateNote({ variables: { ...data } });
    }

    await addNote({ variables: { ...data } });

    this.handlePopoverHide();

    if (typeof noteChangedCallback === 'function') {
      noteChangedCallback();
    }
  };

  handlePopoverHide = () => {
    this.setState({ popover: { ...popoverInitialState } });
  };

  handleResetPasswordClick = () => {
    this.handleOpenModal(MODAL_RESET_PASSWORD);
  };

  handleResetPassword = async () => {
    const {
      passwordResetRequest,
    } = this.props;

    const response = await passwordResetRequest();
    const success = get(response, 'data.profile.passwordResetRequest.success');

    if (success) {
      this.context.addNotification({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.SUCCESS_NOTIFICATION_TEXT'),
      });

      this.handleCloseModal();
    } else {
      this.context.addNotification({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.ERROR_NOTIFICATION_TEXT'),
      });
    }
  };

  handleSubmitNewPassword = async ({ password }) => {
    const { changePassword } = this.props;

    const response = await changePassword({ variables: { password } });
    const success = get(response, 'data.profile.changePassword.success');

    this.context.addNotification({
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
    const { activateProfile, profile: { data: { playerUUID, email } } } = this.props;

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
    this.props.addTag({ variables: { tag, priority } });
  };

  handleDeleteTag = (id) => {
    this.props.removeTag({ variables: { id: parseInt(id, 10) } });
  };

  handleChangePlayerLimitState = ({ action, ...data }) => {
    if (walletActions.LOCK === action) {
      this.props.lockPayment({ variables: { ...data, playerUUID: this.props.params.id } });
    } else {
      this.props.unlockPayment({ variables: { ...data, playerUUID: this.props.params.id } });
    }
  };

  handleUnlockLogin = () => this.props.unlockLogin(this.props.params.id);

  handleUpdateSubscription = async (data) => {
    const { params: { id: playerUUID }, updateSubscription } = this.props;

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
    const { profile: { data: playerProfile } } = this.props;

    this.handleOpenModal(MODAL_CHANGE_PASSWORD, {
      fullName: `${playerProfile.firstName} ${playerProfile.lastName}`,
      playerUUID: `${playerProfile.authorUuid}`,
    });
  };

  handleShareProfileClick = () => {
    this.handleOpenModal(MODAL_SHARE_PROFILE);
  };

  handleChangeStatus = ({ action, ...data }) => {
    const {
      blockMutation,
      unblockMutation,
      suspendProlong,
      suspendMutation,
      resumeMutation,
    } = this.props;

    if (action === statusActions.BLOCK) {
      blockMutation({ variables: data });
    } else if (action === statusActions.UNBLOCK) {
      unblockMutation({ variables: data });
    } else if (action === statusActions.REMOVE) {
      resumeMutation({ variables: data });
    } else if (action === statusActions.SUSPEND) {
      suspendMutation({ variables: data });
    } else if (action === statusActions.PROLONG) {
      suspendProlong({ variables: data });
    }
  };

  render() {
    const { modal, popover, informationShown, imageViewer: imageViewerState } = this.state;
    const {
      profile: { data: playerProfile, receivedAt, isLoading, error },
      playerProfile: { playerProfile: profile, loading },
      children,
      params,
      location,
      notes: { notes, loading: notesLoading },
      playerLimits,
      uploading,
      uploadModalInitialValues,
      config,
      updateNote,
      locale,
      userProfileTabs,
    } = this.props;

    return (
      <div className="layout">
        <div className="layout-info">
          <If condition={!loading && !notesLoading}>
            <Header
              playerProfile={profile.data}
              locale={locale}
              lastIp={
                profile.data.signInIps && profile.data.signInIps.length > 0
                  ? profile.data.signInIps[0]
                  : null
              }
              availableStatuses={this.availableStatuses}
              onStatusChange={this.handleChangeStatus}
              availableTags={this.availableTags}
              currentTags={profile.data.tags ?
                profile.data.tags.map(({ tag, ...data }) => ({ label: tag, value: tag, ...data })) :
                []
              }
              playerLimits={{
                state: playerLimits,
                actions: { onChange: this.handleChangePlayerLimitState },
                unlockLogin: this.handleUnlockLogin,
              }}
              isLoadingProfile={isLoading}
              addTag={this.handleAddTag}
              deleteTag={this.handleDeleteTag}
              onAddNoteClick={this.handleAddNoteClick(params.id, targetTypes.PROFILE)}
              onResetPasswordClick={this.handleResetPasswordClick}
              onProfileActivateClick={this.handleProfileActivateClick}
              onPlayerLimitChange={this.handleChangePlayerLimitState}
              onRefreshClick={() => this.handleLoadProfile(true)}
              loaded={!!receivedAt && !error}
              onChangePasswordClick={this.handleChangePasswordClick}
              onShareProfileClick={this.handleShareProfileClick}
            />
            <div className="hide-details-block">
              <div className="hide-details-block_divider" />
              <button
                className="hide-details-block_text btn-transparent"
                onClick={this.handleToggleInformationBlock}
              >
                {informationShown ? I18n.t('COMMON.DETAILS_COLLAPSE.HIDE') : I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')}
              </button>
              <div className="hide-details-block_divider" />
            </div>
            <Collapse isOpen={informationShown}>
              <Information
                data={profile.data}
                ips={profile.data.signInIps}
                updateSubscription={this.handleUpdateSubscription}
                onEditNoteClick={this.handleEditNoteClick}
                notes={notes}
              />
            </Collapse>
          </If>
        </div>
        <div className="layout-content">
          <div className="nav-tabs-horizontal">
            <Tabs
              items={userProfileTabs}
              location={location}
              params={params}
            />
            {children}
          </div>
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
          modal.name === MODAL_SHARE_PROFILE &&
          <ShareLinkModal
            onClose={this.handleCloseModal}
            playerUUID={playerProfile.playerUUID}
          />
        }
        {
          modal.name === MODAL_RESET_PASSWORD &&
          <ConfirmActionModal
            onSubmit={this.handleResetPassword}
            onClose={this.handleCloseModal}
            modalTitle={I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TITLE')}
            actionText={I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TEXT')}
            fullName={`${playerProfile.firstName} ${playerProfile.lastName}`}
            uuid={playerProfile.playerUUID}
            submitButtonLabel={I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.BUTTON_ACTION')}
          />
        }
        <ImageViewer
          backdropClosesModal
          showImageCount={false}
          {...imageViewerState}
          onClose={this.handleCloseImageViewer}
        />
        <BackToTop />
      </div>
    );
  }
}

export default ProfileLayout;
