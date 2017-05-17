import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as filesActionCreators } from '../modules/files';
import ProfileLayout from '../layouts/ProfileLayout';
import config, { getAvailableTags } from '../../../config/index';
import { statusActions } from '../../../constants/user';

const mapStateToProps = (state) => {
  const {
    profile: {
      profile,
      ip,
      accumulatedBalances: { data: accumulatedBalances },
      notes,
      walletLimits,
      uploading,
    },
    auth,
    i18n: { locale },
  } = state;
  const lastIp = ip.list.length > 0
    ? ip.list[0]
    : null;
  let availableStatuses = [];

  if (profile && profile.data && statusActions[profile.data.profileStatus]) {
    availableStatuses = statusActions[profile.data.profileStatus];
  }

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
    ip,
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
  fetchIp: actionCreators.fetchIPs,
  fetchAccumulatedBalances: actionCreators.fetchBalances,
  acceptBonus: actionCreators.acceptBonus,
  cancelBonus: actionCreators.cancelBonus,
  fetchActiveBonus: actionCreators.fetchActiveBonus,
  updateSubscription: actionCreators.updateSubscription,
  loadFullProfile: actionCreators.loadFullProfile,
  lockDeposit: actionCreators.lockDeposit,
  lockWithdraw: actionCreators.lockWithdraw,
  unlockDeposit: actionCreators.unlockDeposit,
  unlockWithdraw: actionCreators.unlockWithdraw,
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
  saveFiles: filesActionCreators.saveFiles,
  deleteFile: filesActionCreators.deleteFile,
  downloadFile: filesActionCreators.downloadFile,
};

export default connect(mapStateToProps, mapActions)(ProfileLayout);
