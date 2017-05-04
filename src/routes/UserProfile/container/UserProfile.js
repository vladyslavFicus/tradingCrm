import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import ProfileLayout from '../layouts/ProfileLayout';
import { getAvailableTags } from '../../../config/index';
import { statusActions } from '../../../constants/user';

const mapStateToProps = (state) => {
  const {
    profile: {
      profile,
      ip,
      accumulatedBalances: { data: accumulatedBalances },
      notes,
      walletLimits,
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

  return {
    profile,
    ip,
    lastIp,
    notes,
    accumulatedBalances,
    availableTags: getAvailableTags(auth.department),
    availableStatuses,
    walletLimits,
    locale,
  };
};

const mapActions = {
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
};

export default connect(mapStateToProps, mapActions)(ProfileLayout);
