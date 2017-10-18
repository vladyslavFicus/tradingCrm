import React, { Component } from 'react';
import ImageViewer from 'react-images';
import _ from 'lodash';
import { Collapse } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import Tabs from '../../../components/Tabs';
import Modal from '../../../components/Modal';
import Header from '../components/Header';
import NotePopover from '../../../components/NotePopover';
import { userProfileTabs } from '../../../config/menu';
import { targetTypes } from '../../../constants/note';
import Information from '../components/Information';
import PropTypes from '../../../constants/propTypes';
import getFileBlobUrl from '../../../utils/getFileBlobUrl';
import {
  actionCreators as windowActionCreators,
} from '../../../redux/modules/window';
import {
  UploadModal as UploadFileModal,
  DeleteModal as DeleteFileModal,
} from '../../../components/Files';
import ChangePasswordModal from '../../../components/ChangePasswordModal';
import ShareLinkModal from '../components/ShareLinkModal';

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
    notes: PropTypes.pageableState(PropTypes.noteEntity).isRequired,
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
    availableTags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
    })),
    currentTags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    addTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    availableStatuses: PropTypes.arrayOf(PropTypes.object),
    accumulatedBalances: PropTypes.object.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    updateSubscription: PropTypes.func.isRequired,
    changeStatus: PropTypes.func.isRequired,
    fetchNotes: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    activateProfile: PropTypes.func.isRequired,
    checkLock: PropTypes.func.isRequired,
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
    playerLimitAction: PropTypes.func.isRequired,
    uploadModalInitialValues: PropTypes.object.isRequired,
    cancelFile: PropTypes.func.isRequired,
    resetUploading: PropTypes.func.isRequired,
    uploading: PropTypes.object.isRequired,
    fetchFiles: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    manageNote: PropTypes.func.isRequired,
    fetchBalances: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };
  static defaultProps = {
    availableTags: [],
    currentTags: [],
    availableStatuses: [],
    lastIp: null,
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };
  static childContextTypes = {
    onAddNote: PropTypes.func.isRequired,
    onEditNote: PropTypes.func.isRequired,
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    refreshPinnedNotes: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
    onUploadFileClick: PropTypes.func.isRequired,
    setFileChangedCallback: PropTypes.func.isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
    showImages: PropTypes.func.isRequired,
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      onAddNote: this.props.addNote,
      onEditNote: this.props.editNote,
      onAddNoteClick: this.handleAddNoteClick,
      onEditNoteClick: this.handleEditNoteClick,
      setNoteChangedCallback: this.setNoteChangedCallback,
      refreshPinnedNotes: this.handleRefreshPinnedNotes,
      hidePopover: this.handlePopoverHide,
      onUploadFileClick: this.handleUploadFileClick,
      setFileChangedCallback: this.setFileChangedCallback,
      onDeleteFileClick: this.handleDeleteFileClick,
      showImages: this.showImages,
      cacheChildrenComponent: this.cacheChildrenComponent,
    };
  }

  state = {
    popover: { ...popoverInitialState },
    modal: { ...modalInitialState },
    imageViewer: { ...imageViewerInitialState },
    noteChangedCallback: null,
    fileChangedCallback: null,
    informationShown: true,
  };

  componentWillMount() {
    window.addEventListener('scroll', this.handleScrollWindow);
  }

  componentDidMount() {
    this.handleLoadAdditionalProfileData();
  }

  componentWillUnmount() {
    document.body.classList.remove('user-profile-layout');
    window.removeEventListener('scroll', this.handleScrollWindow);
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

  isShowScrollTop = () => document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;

  handleScrollWindow = _.debounce(() => {
    if (window.isFrame) {
      if (this.isShowScrollTop()) {
        window.dispatchAction(windowActionCreators.showScrollToTop(true));
      } else if (!this.isShowScrollTop()) {
        window.dispatchAction(windowActionCreators.showScrollToTop(false));
      }
    }
  }, 300);

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
      fetchBalances,
    } = this.props;

    return fetchNotes({ playerUUID: params.id, pinned: true })
      .then(() => fetchBalances(params.id))
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

  handleDeleteNoteClick = (item) => {
    const { noteChangedCallback } = this.state;

    return new Promise(resolve => this.props.deleteNote(item.uuid)
      .then(() => {
        this.handlePopoverHide();

        this.props.fetchNotes({ playerUUID: this.props.params.id, pinned: true });
        if (typeof noteChangedCallback === 'function') {
          noteChangedCallback();
        }

        return resolve();
      }));
  };

  handleRefreshPinnedNotes = () => {
    this.props.fetchNotes({ playerUUID: this.props.params.id, pinned: true });
  };

  handleSubmitNote = (data) => {
    const { noteChangedCallback } = this.state;

    return new Promise((resolve) => {
      if (data.uuid) {
        return resolve(this.props.editNote(data.uuid, data));
      }
      return resolve(this.props.addNote(data));
    }).then(() => {
      this.handlePopoverHide();
      this.handleRefreshPinnedNotes();

      if (typeof noteChangedCallback === 'function') {
        noteChangedCallback();
      }
    });
  };

  handlePopoverHide = () => {
    this.setState({ popover: { ...popoverInitialState } });
  };

  handleResetPasswordClick = async () => {
    const { resetPassword, profile: { data } } = this.props;

    if (data.email) {
      const action = await resetPassword({ email: data.email });

      if (action && !action.error) {
        this.handleOpenModal(MODAL_INFO, {
          className: 'modal-danger',
          header: 'Reset password',
          body: (
            <span>
              Reset password link was sent to <strong>{data.email}</strong>.
            </span>
          ),
          footer: (
            <button className="btn btn-default-outline pull-left" onClick={this.handleCloseModal}>
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </button>
          ),
        });
      }
    }
  };

  handleSubmitNewPassword = async (data) => {
    const {
      resetPassword,
      resetPasswordConfirm,
      fetchResetPasswordToken,
      profile: { data: playerProfile },
    } = this.props;

    if (!playerProfile.email) {
      this.context.addNotification({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.NO_EMAIL.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.NO_EMAIL.MESSAGE'),
      });
    }

    const resetPasswordAction = await resetPassword({ email: playerProfile.email }, false);

    if (!resetPasswordAction || resetPasswordAction.error) {
      return this.context.addNotification({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE'),
      });
    }

    const fetchResetPasswordTokenAction = await fetchResetPasswordToken(playerProfile.playerUUID);

    if (!fetchResetPasswordTokenAction || fetchResetPasswordTokenAction.error) {
      return this.context.addNotification({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE'),
      });
    }

    const resetPasswordConfirmAction = await resetPasswordConfirm({
      ...data,
      token: fetchResetPasswordTokenAction.payload,
    });

    const hasError = !resetPasswordConfirmAction || !!resetPasswordConfirmAction.error;

    this.context.addNotification({
      level: hasError ? 'error' : 'success',
      title: hasError
        ? I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE')
        : I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.TITLE'),
      message: hasError
        ? I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE')
        : I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.MESSAGE'),
    });

    if (!hasError) {
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
            <button className="btn btn-default-outline pull-left" onClick={this.handleCloseModal}>
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </button>
          ),
        });
      }
    }
  };

  handleAddTag = (tag, priority) => {
    this.props.addTag(this.props.params.id, tag, priority);
  };

  handleDeleteTag = (id) => {
    this.props.deleteTag(this.props.params.id, id);
  };

  handleChangePlayerLimitState = (data) => {
    this.props.playerLimitAction({ ...data, playerUUID: this.props.params.id });
  };

  handleUnlockLogin = () => this.props.unlockLogin(this.props.params.id);

  handleUpdateSubscription = async (data, updatedSubscription) => {
    const { params: { id: playerUUID }, updateSubscription } = this.props;

    return updateSubscription(playerUUID, data, updatedSubscription);
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

  render() {
    const { modal, popover, informationShown, imageViewer: imageViewerState } = this.state;
    const {
      profile: { data: playerProfile, receivedAt, isLoading, error },
      children,
      params,
      lastIp,
      location,
      availableTags,
      currentTags,
      availableStatuses,
      accumulatedBalances,
      changeStatus,
      notes,
      playerLimits,
      uploading,
      uploadModalInitialValues,
      manageNote,
      config,
      locale,
    } = this.props;

    return (
      <div className="layout">
        <div className="layout-info">
          <Header
            playerProfile={playerProfile}
            locale={locale}
            lastIp={lastIp}
            accumulatedBalances={accumulatedBalances}
            availableStatuses={availableStatuses}
            onStatusChange={changeStatus}
            availableTags={availableTags}
            currentTags={currentTags}
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
              data={playerProfile}
              ips={playerProfile.signInIps}
              updateSubscription={this.handleUpdateSubscription}
              onEditNoteClick={this.handleEditNoteClick}
              notes={notes}
            />
          </Collapse>
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
            onManageNote={manageNote}
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

        <ImageViewer
          backdropClosesModal
          showImageCount={false}
          {...imageViewerState}
          onClose={this.handleCloseImageViewer}
        />
      </div>
    );
  }
}

export default ProfileLayout;
