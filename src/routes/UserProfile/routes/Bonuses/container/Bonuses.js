import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as bonusActionCreators } from '../../../modules/bonus';
import List from '../components/List';

const mapStateToProps = ({ profile: { bonus, view: { profile } }, userBonusesList: { list } }) => {
  const userBalance = profile.data.balance;
  const emptyBalance = {
    amount: 0,
    currency: userBalance.currency,
  };

  return {
    list,
    profile,
    accumulatedBalances: {
      data: {
        total: userBalance,
        bonus: bonus && bonus.data ? bonus.data.balance : emptyBalance,
        real: bonus && bonus.data ? {
          amount: userBalance.amount - bonus.data.balance.amount,
          currency: userBalance.currency,
        } : userBalance,
      },
    },
    bonus,
  };
};
const mapActions = {
  ...actionCreators,
  ...bonusActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
