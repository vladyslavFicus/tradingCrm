import { connect } from 'react-redux';
import { actionCreators as ipActionCreators } from '../modules/ip';
import { actionCreators as accumulatedBalancesActionCreators } from '../modules/accumulatedBalances';
import { actionCreators as bonusActionCreators } from '../modules/bonus';
import { actionCreators as viewActionCreators } from '../modules/view';
import ProfileLayout from '../layouts/ProfileLayout';
import { getAvailableTags } from 'config/index';
import { statusActions } from 'constants/user';

const mapStateToProps = ({ profile: { view: userProfile, bonus, ip, accumulatedBalances }, auth }) => {
  const userBalance = userProfile.profile.data.balance;
  const emptyBalance = {
    amount: 0,
    currency: userBalance.currency,
  };

  return {
    ...userProfile,
    ip,
    accumulatedBalances: {
      ...accumulatedBalances,
      data: {
        deposits: accumulatedBalances.data && accumulatedBalances.data.deposits ?
          accumulatedBalances.data.deposits : emptyBalance,
        withdraws: accumulatedBalances.data && accumulatedBalances.data.withdraws ?
          accumulatedBalances.data.withdraws : emptyBalance,
        total: userBalance,
        bonus: bonus && bonus.data ? bonus.data.balance : emptyBalance,
        real: bonus && bonus.data ? {
          amount: userBalance.amount - bonus.data.balance.amount,
          currency: userBalance.currency,
        } : userBalance,
      },
    },
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
};

export default connect(mapStateToProps, mapActions)(ProfileLayout);
