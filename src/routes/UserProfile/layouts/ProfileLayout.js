import React, { Component } from 'react';
import Tabs from '../../../components/Tabs';
import Modal from '../../../components/Modal';
import Header from '../components/Header';
import NotePopover from '../../../components/NotePopover';
import { userProfileTabs } from '../../../config/menu';
import { targetTypes } from '../../../constants/note';
import Information from '../components/Information';
import PropTypes from '../../../constants/propTypes';
import UploadModal from '../../../components/Files/UploadModal';
import DeleteModal from '../../../components/Files/DeleteModal';
import './ProfileLayout.scss';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};
const MODAL_WALLET_LIMIT = 'wallet-limit-modal';
const MODAL_INFO = 'info-modal';
const UPLOAD_MODAL = 'upload-modal';
const DELETE_MODAL = 'delete-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class ProfileLayout extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      data: PropTypes.userProfile,
      error: PropTypes.any,
      isLoading: PropTypes.bool.isRequired,
    }),
    children: PropTypes.any.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    ip: PropTypes.shape({
      list: PropTypes.arrayOf(PropTypes.ipEntity).isRequired,
    }).isRequired,
    notes: PropTypes.pageableState(PropTypes.noteEntity).isRequired,
    lastIp: PropTypes.ipEntity,
    location: PropTypes.object.isRequired,
    availableTags: PropTypes.array.isRequired,
    addTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    availableStatuses: PropTypes.arrayOf(PropTypes.object),
    accumulatedBalances: PropTypes.object.isRequired,
    updateSubscription: PropTypes.func.isRequired,
    changeStatus: PropTypes.func.isRequired,
    loadFullProfile: PropTypes.func.isRequired,
    fetchActiveBonus: PropTypes.func.isRequired,
    fetchIp: PropTypes.func.isRequired,
    fetchAccumulatedBalances: PropTypes.func.isRequired,
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
    uploadFile: PropTypes.func.isRequired,
    manageNote: PropTypes.func.isRequired,
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
  };

  state = {
    popover: { ...popoverInitialState },
    modal: { ...modalInitialState },
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
    };
  }

  componentWillMount() {
    const {
      profile,
      loadFullProfile,
      fetchActiveBonus,
      fetchIp,
      fetchAccumulatedBalances,
      fetchNotes,
      params,
      checkLock,
    } = this.props;

    if (!profile.isLoading) {
      loadFullProfile(params.id)
        .then(() => fetchNotes({ playerUUID: params.id, pinned: true }))
        .then(() => fetchActiveBonus(params.id))
        .then(() => fetchIp(params.id, { limit: 10 }))
        .then(() => fetchAccumulatedBalances(params.id))
        .then(() => checkLock(params.id));
    }
  }

  setNoteChangedCallback = (cb) => {
    this.setState({ noteChangedCallback: cb });
  };

  setFileChangedCallback = (cb) => {
    this.setState({ fileChangedCallback: cb });
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
          ...params,
          target,
          initialValues: {
            targetUUID,
            targetType,
            pinned: false,
            playerUUID: this.props.params.id,
          },
          placement: 'left bottom',
        },
      },
    });
  };

  handleUploadFileClick = (params) => {
    this.setState({
      modal: {
        name: UPLOAD_MODAL,
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
        name: DELETE_MODAL,
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

  render() {
    const { modal, popover, informationShown } = this.state;
    const {
      profile: { data: profileData },
      children,
      params,
      ip,
      lastIp,
      location,
      availableTags,
      availableStatuses,
      accumulatedBalances,
      updateSubscription,
      changeStatus,
      notes,
      walletLimits,
      uploading,
      uploadModalInitialValues,
      manageNote,
    } = this.props;

    return (
      <div className="player panel profile-layout">
        <div className="container-fluid">
          <div className="profile-layout-heading">
            <Header
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
              addTag={this.handleAddTag}
              deleteTag={this.handleDeleteTag}
              onAddNoteClick={this.handleAddNoteClick(params.id, targetTypes.PROFILE)}
              onResetPasswordClick={this.handleResetPasswordClick}
              onProfileActivateClick={this.handleProfileActivateClick}
              onWalletLimitChange={this.handleChangeWalletLimitState}
            />

            <div className="hide-details-block">
              <div className="hide-details-block_arrow" />
              <div className="hide-details-block_text" onClick={this.handleToggleInformationBlock}>
                {informationShown ? 'Hide details' : 'Show details'}
              </div>
              <div className="hide-details-block_arrow" />
            </div>

            {
              informationShown &&
              <Information
                data={profileData}
                ips={ip.list}
                updateSubscription={updateSubscription.bind(null, params.id)}
                onEditNoteClick={this.handleEditNoteClick}
                notes={notes}
              />
            }
          </div>

          <div className="row">
            <section className="panel profile-user-content">
              <div className="panel-body">
                <div className="nav-tabs-horizontal">
                  <Tabs
                    items={userProfileTabs}
                    location={location}
                    params={params}
                  />

                  <div className="tab-content padding-vertical-20">
                    {children}
                  </div>
                </div>
              </div>
            </section>
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
          modal.name === UPLOAD_MODAL &&
          <UploadModal
            {...modal.params}
            isOpen
            onClose={this.handleCloseUploadModal}
            uploading={Object.values(uploading)}
            initialValues={uploadModalInitialValues}
            uploadFile={this.props.uploadFile}
            onCancelFile={this.handleUploadingFileDelete}
            onSubmit={this.handleSubmitUploadModal}
            onManageNote={manageNote}
          />
        }
        {
          modal.name === DELETE_MODAL &&
          <DeleteModal
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
      </div>
    );
  }
}

export default ProfileLayout;
