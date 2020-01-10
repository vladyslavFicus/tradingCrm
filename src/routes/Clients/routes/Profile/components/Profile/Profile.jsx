import React, { Component, Fragment } from 'react';
import ImageViewer from 'react-images';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Switch, Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';
import { getActiveBrandConfig, getApiRoot } from 'config';
import Permissions from 'utils/permissions';
import getFileBlobUrl from 'utils/getFileBlobUrl';
import {
  statusActions as userStatuses,
} from 'constants/user';
import PropTypes from 'constants/propTypes';
import { viewType as noteViewType, targetTypes } from 'constants/note';
import Tabs from 'components/Tabs';
import Modal from 'components/Modal';
import NotePopover from 'components/NotePopover';
import {
  UploadModal as UploadFileModal,
  DeleteModal as DeleteFileModal,
} from 'components/Files';
import ChangePasswordModal from 'components/ChangePasswordModal';
import BackToTop from 'components/BackToTop';
import HideDetails from 'components/HideDetails';
import Route from 'components/Route';
import NotFound from 'routes/NotFound';
import {
  ClientView,
  Payments,
  TradingActivity,
  Accounts,
  Notes,
  Files,
  Feed,
  Callbacks,
  Risks,
} from '../../routes';
import Header from '../Header';
import Information from '../Information';
import { userProfileTabs, moveField } from './constants';

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
    notify: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    pinnedNotes: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      notes: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
          author: PropTypes.string,
          lastEditorUUID: PropTypes.string,
          targetUUID: PropTypes.string,
        })),
      }),
    }).isRequired,
    location: PropTypes.object.isRequired,
    updateSubscription: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    questionnaireLastData: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      questionnaire: PropTypes.object,
    }),
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
      noteModal: PropTypes.modalType,
    }).isRequired,
    getLoginLock: PropTypes.object.isRequired,
    passwordResetRequest: PropTypes.func.isRequired,
    removeNote: PropTypes.func.isRequired,
    unlockLoginMutation: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  static childContextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    onEditModalNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
    triggerRepresentativeUpdateModal: PropTypes.func.isRequired,

    // ?
    onUploadFileClick: PropTypes.func.isRequired,
    setFileChangedCallback: PropTypes.func.isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
    showImages: PropTypes.func.isRequired,
  };

  static defaultProps = {
    // Can be null for unregulated brands
    questionnaireLastData: null,
  };

  cacheChildrenComponents = [];

  state = {
    popover: { ...popoverInitialState },
    modal: { ...modalInitialState },
    imageViewer: { ...imageViewerInitialState },
    noteChangedCallback: null,
    fileChangedCallback: null,
  };

  getChildContext() {
    return {
      onAddNoteClick: this.handleAddNoteClick,
      onEditNoteClick: this.handleEditNoteClick,
      onEditModalNoteClick: this.handleEditModalNoteClick,
      setNoteChangedCallback: this.setNoteChangedCallback,
      hidePopover: this.handlePopoverHide,
      registerUpdateCacheListener: this.registerUpdateCacheListener,
      unRegisterUpdateCacheListener: this.unRegisterUpdateCacheListener,
      triggerRepresentativeUpdateModal: this.triggerRepresentativeUpdateModal,
      onUploadFileClick: this.handleUploadFileClick,
      setFileChangedCallback: this.setFileChangedCallback,
      onDeleteFileClick: this.handleDeleteFileClick,
      showImages: this.showImages,
    };
  }

  get availableStatuses() {
    const { newProfile, permission: { permissions } } = this.props;
    const profileStatus = get(newProfile, 'newProfile.data.status.type');

    if (!profileStatus) {
      return [];
    }

    return userStatuses[profileStatus]
      .filter(action => (new Permissions([action.permission]))
        .check(permissions));
  }

  setNoteChangedCallback = (cb) => {
    this.setState({ noteChangedCallback: cb });
  };

  setFileChangedCallback = (cb) => {
    this.setState({ fileChangedCallback: cb });
  };

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

  triggerRepresentativeUpdateModal = type => () => {
    const {
      modals: { representativeModal },
      newProfile: { refetch, newProfile: { data } },
      match: { params: { id } },
    } = this.props;

    const assignToOperator = get(data, `acquisition.${type.toLowerCase()}Representative`) || null;

    representativeModal.show({
      type,
      clients: [{
        uuid: id,
      }],
      currentInactiveOperator: assignToOperator,
      header: I18n.t('CLIENT_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', { type: type.toLowerCase() }),
      additionalFields: [moveField(type)],
      onSuccess: () => refetch(),
    });
  };

  handleLoadProfile = async (needForceUpdate = false) => {
    const {
      filesList,
      newProfile,
      pinnedNotes,
      questionnaireLastData,
    } = this.props;

    if (!newProfile.loading) {
      await Promise.all([
        filesList.refetch(),
        newProfile.refetch(),
        pinnedNotes.refetch(),
        ...[questionnaireLastData && questionnaireLastData.refetch()],
      ]);

      if (needForceUpdate) {
        this.cacheChildrenComponents.forEach((component) => {
          component.update();
        });
      }
    }
  };

  unlockLogin = async () => {
    const { unlockLoginMutation, match: { params: { id: playerUUID } }, notify } = this.props;
    const response = await unlockLoginMutation({ variables: { playerUUID } });
    const success = get(response, 'data.auth.unlockLogin.data.success');

    if (success) {
      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });
    } else {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  };

  handleOpenModal = (name, params) => {
    this.setState(({ modal }) => ({
      modal: {
        ...modal,
        name,
        params,
      },
    }));
  };

  handleCloseModal = () => {
    this.setState({ modal: { ...modalInitialState } });
  };

  handleUploadFileClick = (params) => {
    this.setState({
      modal: {
        name: MODAL_UPLOAD_FILE,
        params: {
          newProfile: get(this.props, 'newProfile.newProfile.data', {}),
          ...params,
          onSuccess: () => this.props.filesList.refetch(),
        },
      },
    });
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

  handleAddNoteClick = targetUUID => (target, params = {}) => {
    this.setState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          placement: 'bottom',
          ...params,
          target,
          targetType: targetTypes.PLAYER,
          initialValues: {
            targetUUID,
            playerUUID: targetUUID,
            pinned: false,
          },
        },
      },
    });
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

  handleEditModalNoteClick = (type, item) => () => {
    const { modals: { noteModal } } = this.props;

    noteModal.show({
      type,
      onEdit: data => this.handleSubmitNoteClick(noteViewType.MODAL, data),
      onDelete: () => this.handleDeleteNoteClick(noteViewType.MODAL, item.noteId),
      tagType: item.tagType,
      initialValues: {
        ...item,
      },
    });
  };

  handleDeleteNoteClick = async (viewType, noteId) => {
    const { removeNote } = this.props;
    const { noteChangedCallback } = this.state;

    await removeNote({ variables: { noteId } });
    this.handleNoteHide(viewType);

    if (typeof noteChangedCallback === 'function') {
      noteChangedCallback();
    }
  };

  handleNoteHide = (type) => {
    const { modals: { noteModal } } = this.props;

    if (type === noteViewType.POPOVER) {
      this.handlePopoverHide();
    } else {
      noteModal.hide();
    }
  };

  handleSubmitNoteClick = async (viewType, data) => {
    const { noteChangedCallback } = this.state;
    const {
      updateNote,
      addNote,
      match: { params: { id: playerUUID } },
    } = this.props;

    if (data.noteId) {
      const updatedNote = await updateNote({ variables: data });

      this.handleNoteHide(viewType);

      if (typeof noteChangedCallback === 'function') {
        noteChangedCallback();
      }

      return updatedNote;
    }

    const response = await addNote({
      variables: {
        ...data,
        playerUUID,
      },
    });

    this.handleNoteHide(viewType);

    if (typeof noteChangedCallback === 'function') {
      noteChangedCallback();
    }

    return response;
  };

  handlePopoverHide = () => {
    this.setState({ popover: { name: null, params: {} } });
  };

  handleResetPasswordClick = () => {
    const {
      newProfile: {
        newProfile: {
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

  handleUpdateSubscription = async (data) => {
    const { match: { params: { id: playerUUID } }, updateSubscription } = this.props;

    return updateSubscription({ variables: { playerUUID, ...data } });
  };

  showImages = async (fileUuid, fileType, options = {}) => {
    const {
      match: { params: { id } },
      token,
    } = this.props;
    const url = `${getApiRoot()}/attachments/users/${id}/files/${fileUuid}`;

    const images = [{
      src: await getFileBlobUrl(url, {
        method: 'GET',
        headers: {
          Accept: fileType,
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
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
    const {
      newProfile: {
        newProfile: {
          data: {
            firstName,
            lastName,
            uuid,
          },
        },
      },
    } = this.props;

    this.handleOpenModal(MODAL_CHANGE_PASSWORD, {
      fullName: `${firstName} ${lastName}`,
      playerUUID: uuid,
    });
  };

  render() {
    if (get(this.props, 'newProfile.newProfile.error')) {
      return <NotFound />;
    }

    const {
      modal,
      popover,
      imageViewer: imageViewerState,
    } = this.state;
    const {
      newProfile: {
        newProfile,
        loading,
        refetch,
      },
      match: { params },
      location,
      pinnedNotes: { notes },
      match: {
        path,
      },
      getLoginLock,
      questionnaireLastData,
      changeProfileStatus,
      filesList,
    } = this.props;

    const loginLock = get(getLoginLock, 'loginLock', {});
    const newProfileData = get(newProfile, 'data') || {};
    const acquisitionData = get(newProfileData, 'acquisition') || {};
    const lastSignInSessions = get(newProfileData, 'profileView.lastSignInSessions') || [];

    if (loading) {
      return null;
    }

    return (
      <Fragment>
        <If condition={newProfileData}>
          <Helmet title={`${newProfileData.firstName} ${newProfileData.lastName}`} />
        </If>
        <div className="profile__info">
          <Header
            newProfile={newProfileData}
            questionnaireLastData={questionnaireLastData}
            availableStatuses={this.availableStatuses}
            onStatusChange={changeProfileStatus}
            isLoadingProfile={loading}
            onAddNoteClick={this.handleAddNoteClick(params.id)}
            onResetPasswordClick={this.handleResetPasswordClick}
            onRefreshClick={() => this.handleLoadProfile(true)}
            unlockLogin={this.unlockLogin}
            loginLock={loginLock}
            loaded={!loading}
            onChangePasswordClick={this.handleChangePasswordClick}
          />
          <HideDetails>
            <Information
              newProfile={newProfileData}
              ips={lastSignInSessions}
              updateSubscription={this.handleUpdateSubscription}
              onEditNoteClick={this.handleEditNoteClick}
              pinnedNotes={get(notes, 'data') || {}}
              acquisitionData={acquisitionData}
              loading={loading}
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
            <Route
              disableScroll
              path={`${path}/profile`}
              render={props => <ClientView refetchProfileDataOnSave={() => this.handleLoadProfile(true)} {...props} />}
            />
            <Route disableScroll path={`${path}/payments`} component={Payments} />
            <Route disableScroll path={`${path}/trading-activity`} component={TradingActivity} />
            <Route disableScroll path={`${path}/accounts`} component={Accounts} />
            <Route disableScroll path={`${path}/callbacks`} component={Callbacks} />
            <Route disableScroll path={`${path}/notes`} component={Notes} />
            <Route
              disableScroll
              path={`${path}/files`}
              render={props => (
                <Files filesList={filesList} {...props} />
              )}
            />
            <Route disableScroll path={`${path}/feed`} component={Feed} />
            <If condition={getActiveBrandConfig().isRisksTabAvailable}>
              <Route
                disableScroll
                path={`${path}/risk`}
                render={props => <Risks refetchProfile={refetch} {...props} />}
              />
            </If>
            <Redirect to={`${path}/profile`} />
          </Switch>
        </div>
        {
          popover.name === NOTE_POPOVER
          && (
            <NotePopover
              isOpen
              manual
              toggle={this.handlePopoverHide}
              onAddSuccess={data => this.handleSubmitNoteClick(noteViewType.POPOVER, data)}
              onUpdateSuccess={data => this.handleSubmitNoteClick(noteViewType.POPOVER, data)}
              onDeleteSuccess={data => this.handleDeleteNoteClick(noteViewType.POPOVER, data)}
              {...popover.params}
            />
          )
        }
        {
          modal.name === MODAL_UPLOAD_FILE
          && (
            <UploadFileModal
              {...modal.params}
              onClose={this.handleCloseModal}
            />
          )
        }
        {
          modal.name === MODAL_DELETE_FILE
          && (
            <DeleteFileModal
              {...modal.params}
              newProfile={newProfile}
              onClose={this.handleCloseModal}
            />
          )
        }
        {
          modal.name === MODAL_INFO
          && (
            <Modal
              isOpen
              onClose={this.handleCloseModal}
              {...modal.params}
            />
          )
        }
        {
          modal.name === MODAL_WALLET_LIMIT
          && (
            <Modal
              isOpen
              onCloseModal={this.handleCloseModal}
              {...modal.params}
            />
          )
        }
        {
          modal.name === MODAL_CHANGE_PASSWORD
          && (
            <ChangePasswordModal
              {...modal.params}
              onClose={this.handleCloseModal}
              onSubmit={this.handleSubmitNewPassword}
            />
          )
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
