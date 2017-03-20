import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as ipActionCreators } from '../modules/ip';
import { actionCreators as accumulatedBalancesActionCreators } from '../modules/accumulatedBalances';
import { actionCreators as bonusActionCreators } from '../modules/bonus';
import { actionCreators as viewActionCreators } from '../modules/view';
import ProfileLayout from '../layouts/ProfileLayout';
import { getAvailableTags } from 'config/index';
import { statusActions } from 'constants/user';

const mapStateToProps = (state) => {
  const {
    profile: {
      view: userProfile, ip, accumulatedBalances: { data: accumulatedBalances }, notes,
    }, auth,
  } = state;
  const lastIp = ip.entities.content
    ? ip.entities.content[ip.entities.content.length - 1]
    : null;

  return {
    ...userProfile,
    ip,
    lastIp,
    notes,
    accumulatedBalances,
    availableTags: getAvailableTags(auth.department),
    availableStatuses: userProfile && userProfile.profile && userProfile.profile.data
      ? statusActions[userProfile.profile.data.profileStatus]
        ? statusActions[userProfile.profile.data.profileStatus]
        : []
      : [],
  };
};

const mapActions = {
  fetchIp: ipActionCreators.fetchEntities,
  fetchAccumulatedBalances: accumulatedBalancesActionCreators.fetchEntities,
  acceptBonus: bonusActionCreators.acceptBonus,
  cancelBonus: bonusActionCreators.cancelBonus,
  fetchActiveBonus: bonusActionCreators.fetchActiveBonus,
  updateSubscription: viewActionCreators.updateSubscription,
  checkLock: viewActionCreators.checkLock,
  fetchBalances: viewActionCreators.fetchBalances,
  fetchProfile: viewActionCreators.fetchProfile,
  getBalance: viewActionCreators.getBalance,
  loadFullProfile: viewActionCreators.loadFullProfile,
  lockDeposit: viewActionCreators.lockDeposit,
  lockWithdraw: viewActionCreators.lockWithdraw,
  unlockDeposit: viewActionCreators.unlockDeposit,
  unlockWithdraw: viewActionCreators.unlockWithdraw,
  addTag: viewActionCreators.addTag,
  deleteTag: viewActionCreators.deleteTag,
  changeStatus: viewActionCreators.changeStatus,
  fetchNotes: actionCreators.fetchNotes,
  addNote: actionCreators.addNote,
  editNote: actionCreators.editNote,
  deleteNote: actionCreators.deleteNote,
  resetPassword: actionCreators.resetPassword,
};

export default connect(mapStateToProps, mapActions)(ProfileLayout);
