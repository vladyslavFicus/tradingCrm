import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as viewActionCreators } from '../modules/view';
import { getTransactionRejectReasons } from '../../../../../config/index';

const mapStateToProps = ({
  userTransactions,
  profile: { view: { profile }, accumulatedBalances: { data: accumulatedBalances } },
}) => ({
  ...userTransactions,
  currencyCode: profile.data.currencyCode,
  profile: profile.data,
  accumulatedBalances,
  paymentRejectReasons: getTransactionRejectReasons(),
});

const mapActions = {
  ...viewActionCreators,
  onChangePaymentStatus: viewActionCreators.changePaymentStatus,
  loadPaymentStatuses: viewActionCreators.fetchPaymentStatuses,
  //loadWithdrawMethods: paymentActionCreators
};

export default connect(mapStateToProps, mapActions)(View);
