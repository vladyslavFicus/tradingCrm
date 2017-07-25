import React, { Component } from 'react';
import ImageViewer from 'react-images';
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
import { actionCreators as windowActionCreators, actionTypes as windowActionTypes } from '../../../redux/modules/window';
import {
  UploadModal as UploadFileModal,
  DeleteModal as DeleteFileModal,
} from '../../../components/Files';
import './ProfileLayout.scss';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};
const MODAL_WALLET_LIMIT = 'wallet-limit-modal';
const MODAL_INFO = 'info-modal';
const MODAL_UPLOAD_FILE = 'upload-modal';
const MODAL_DELETE_FILE = 'delete-modal';
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
      data: PropTypes.userProfile,
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
    availableTags: PropTypes.array.isRequired,
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
    walletLimits: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.walletLimitEntity).isRequired,
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
    walletLimitAction: PropTypes.func.isRequired,
    uploadModalInitialValues: PropTypes.object.isRequired,
    cancelFile: PropTypes.func.isRequired,
    resetUploading: PropTypes.func.isRequired,
    uploading: PropTypes.object.isRequired,
    fetchFiles: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    manageNote: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };
  static defaultProps = {
    availableStatuses: [],
    lastIp: null,
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

  cacheChildrenComponent = (component) => {
    this.children = component;
  };

  componentWillMount() {
    document.body.classList.add('user-profile-layout');
    window.addEventListener('scroll', this.handleScrollWindow);
  }

  componentDidMount() {
    this.handleLoadProfile();

    window.addEventListener('message', ({ data, origin }) => {
      const action = JSON.parse(data);

      if (origin === window.location.origin) {
        if (typeof action === 'object' && action.type === windowActionTypes.SCROLL_TO_TOP) {
          window.scrollTo(0, 0);
        }
      }
    });
  }

  handleScrollWindow = () => {
    if (window && window.parent !== window && window.parent.postMessage) {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        window.parent.postMessage(JSON.stringify(windowActionCreators.showScrollToTop(true)), window.location.origin);
      } else if (document.body.scrollTop < 100 || document.documentElement.scrollTop < 100) {
        window.parent.postMessage(JSON.stringify(windowActionCreators.showScrollToTop(false)), window.location.origin);
      }
    }
  };

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

  handleLoadProfile = (needForceUpdate = false) => {
    const {
      profile,
      fetchProfile,
      fetchNotes,
      params,
      checkLock,
      fetchFiles,
    } = this.props;

    if (!profile.isLoading) {
      fetchProfile(params.id)
        .then(() => fetchNotes({ playerUUID: params.id, pinned: true }))
        .then(() => fetchFiles(params.id))
        .then(() => checkLock(params.id, { size: 999 }))
        .then(() => {
          if (needForceUpdate &&
            this.children &&
            typeof this.children.handleRefresh === 'function') {
            this.children.handleRefresh();
          }
        });
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
          header: 'Reset password',
          body: (
            <span>
              Reset password link was sent to <strong>{data.email}</strong>.
            </span>
          ),
          footer: (
            <button className="btn btn-default" onClick={this.handleCloseModal}>
              Close
            </button>
          ),
        });
      }
    }
  };

  handleProfileActivateClick = async () => {
    const { activateProfile, profile: { data: { uuid, email } } } = this.props;

    if (uuid) {
      const action = await activateProfile(uuid);

      if (action && !action.error) {
        this.handleOpenModal(MODAL_INFO, {
          header: 'Send user activation link',
          body: (
            <span>
              Activation link has been sent to <strong>{email || uuid}</strong>.
            </span>
          ),
          footer: (
            <button className="btn btn-default" onClick={this.handleCloseModal}>
              Close
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

  handleChangeWalletLimitState = (data) => {
    this.props.walletLimitAction({ ...data, playerUUID: this.props.params.id });
  };

  handleUpdateSubscription = async (name, value) => {
    const { params: { id: playerUUID }, updateSubscription, fetchProfile } = this.props;
    const action = await updateSubscription(playerUUID, name, value);

    if (action && !action.error) {
      await fetchProfile(playerUUID);
    }

    return action;
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

  render() {
    const { modal, popover, informationShown, imageViewer: imageViewerState } = this.state;
    const {
      profile: { data: profileData },
      children,
      params,
      lastIp,
      location,
      availableTags,
      availableStatuses,
      accumulatedBalances,
      changeStatus,
      notes,
      walletLimits,
      uploading,
      uploadModalInitialValues,
      manageNote,
      config,
      profile,
      locale,
    } = this.props;

    return (
      <div className="player panel profile-layout">
        <div className="profile-layout-heading">
          <Header
            locale={locale}
            data={profileData}
            lastIp={lastIp}
            accumulatedBalances={accumulatedBalances}
            availableStatuses={availableStatuses}
            onStatusChange={changeStatus}
            availableTags={availableTags}
            walletLimits={{
              state: walletLimits,
              actions: { onChange: this.handleChangeWalletLimitState },
            }}
            isLoadingProfile={profile.isLoading}
            addTag={this.handleAddTag}
            deleteTag={this.handleDeleteTag}
            onAddNoteClick={this.handleAddNoteClick(params.id, targetTypes.PROFILE)}
            onResetPasswordClick={this.handleResetPasswordClick}
            onProfileActivateClick={this.handleProfileActivateClick}
            onWalletLimitChange={this.handleChangeWalletLimitState}
            onRefreshClick={() => this.handleLoadProfile(true)}
          />

          <div className="hide-details-block">
            <div className="hide-details-block_arrow" />
            <button
              className="hide-details-block_text btn-transparent"
              onClick={this.handleToggleInformationBlock}
            >
              {informationShown ? I18n.t('COMMON.DETAILS_COLLAPSE.HIDE') : I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')
              }
            </button>
            <div className="hide-details-block_arrow" />
          </div>

          <Collapse isOpen={informationShown}>
            <Information
              data={profileData}
              ips={profileData.signInIps}
              updateSubscription={this.handleUpdateSubscription}
              onEditNoteClick={this.handleEditNoteClick}
              notes={notes}
            />
          </Collapse>
        </div>
        <div className="panel profile-user-content">
          <div className="panel-body">
            <div className="nav-tabs-horizontal">
              <Tabs
                items={userProfileTabs}
                location={location}
                params={params}
              />

              <div className="padding-vertical-20">
                {children}
              </div>
            </div>
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
            isOpen
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
            isOpen
            profile={profileData}
            onClose={this.handleCloseModal}
          />
        }
        {
          modal.name === MODAL_INFO &&
          <Modal
            onClose={this.handleCloseModal}
            isOpen
            {...modal.params}
          />
        }
        {
          modal.name === MODAL_WALLET_LIMIT &&
          <Modal
            onClose={this.handleCloseModal}
            isOpen
            {...modal.params}
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
