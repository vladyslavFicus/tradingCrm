import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as filesActionCreators } from '../modules/files';
import ProfileLayout from '../layouts/ProfileLayout';
import config, { getAvailableTags } from '../../../config';
import { statusActions } from '../../../constants/user';
import Permissions from '../../../utils/permissions';

const mapStateToProps = (state) => {
  const {
    profile: {
      profile,
      accumulatedBalances: { data: accumulatedBalances },
      notes,
      walletLimits,
      uploading,
    },
    auth,
    i18n: { locale },
    permissions: { data: currentPermissions },
  } = state;

  const lastIp = profile.data.signInIps.length > 0
    ? profile.data.signInIps[0]
    : null;
  let availableStatuses = [];

  if (profile && profile.data && statusActions[profile.data.profileStatus]) {
    availableStatuses = statusActions[profile.data.profileStatus];
  }

  availableStatuses = availableStatuses
    .filter(action => (new Permissions([action.permission])).check(currentPermissions));

  const uploadModalInitialValues = {};
  const uploadingFilesUUIDs = Object.keys(uploading);
  if (uploadingFilesUUIDs.length) {
    uploadingFilesUUIDs.forEach((uuid) => {
      uploadModalInitialValues[uuid] = { name: '', category: '' };
    });
  }

  return {
    auth,
    profile,
    lastIp,
    notes,
    accumulatedBalances,
    availableTags: getAvailableTags(auth.department),
    availableStatuses,
    walletLimits,
    uploading,
    uploadModalInitialValues,
    locale,
    config: config.player,
  };
};

const mapActions = {
  fetchProfile: actionCreators.fetchProfile,
  updateSubscription: actionCreators.updateSubscription,
  addTag: actionCreators.addTag,
  deleteTag: actionCreators.deleteTag,
  changeStatus: actionCreators.changeStatus,
  fetchNotes: actionCreators.fetchNotes,
  addNote: actionCreators.addNote,
  editNote: actionCreators.editNote,
  deleteNote: actionCreators.deleteNote,
  resetPassword: actionCreators.resetPassword,
  activateProfile: actionCreators.activateProfile,
  checkLock: actionCreators.checkLock,
  walletLimitAction: actionCreators.walletLimitAction,
  uploadFile: actionCreators.uploadFile,
  cancelFile: actionCreators.cancelFile,
  resetUploading: actionCreators.resetUploading,
  manageNote: actionCreators.manageNote,
  fetchFiles: filesActionCreators.fetchFiles,
  saveFiles: filesActionCreators.saveFiles,
  deleteFile: filesActionCreators.deleteFile,
  downloadFile: filesActionCreators.downloadFile,
};

export default connect(mapStateToProps, mapActions)(ProfileLayout);
