import { connect } from 'react-redux';
import { actionCreators as ipActionCreators } from '../modules/ip';
import { actionCreators as bonusActionCreators } from '../modules/bonus';
import { actionCreators as viewActionCreators } from '../modules/view';
import ProfileLayout from '../layouts/ProfileLayout';

const mapStateToProps = ({ profile: { view: userProfile, bonus, ip } }) => ({
  ...userProfile,
  bonus,
  ip,
});

const mapActions = {
  fetchIp: ipActionCreators.fetchEntities,
  acceptBonus: bonusActionCreators.acceptBonus,
  cancelBonus: bonusActionCreators.cancelBonus,
  fetchActiveBonus: bonusActionCreators.fetchActiveBonus,
  checkLock: viewActionCreators.checkLock,
  fetchBalances: viewActionCreators.fetchBalances,
  fetchProfile: viewActionCreators.fetchProfile,
  getBalance: viewActionCreators.getBalance,
  loadFullProfile: viewActionCreators.loadFullProfile,
  lockDeposit: viewActionCreators.lockDeposit,
  lockWithdraw: viewActionCreators.lockWithdraw,
  unlockDeposit: viewActionCreators.unlockDeposit,
  unlockWithdraw: viewActionCreators.unlockWithdraw,
};

export default connect(mapStateToProps, mapActions)(ProfileLayout);
