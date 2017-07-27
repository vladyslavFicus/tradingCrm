import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as viewActionCreators } from '../modules';
import { getTransactionRejectReasons, getTransactionChargebackReasons } from '../../../../../config';
import { paymentActions } from '../../../../../constants/payment';

const mapStateToProps = ({ userTransactions, profile: { profile } }) => ({
  ...userTransactions,
  currencyCode: profile.data.currencyCode,
  playerProfile: profile.data,
  paymentActionReasons: {
    [paymentActions.REJECT]: getTransactionRejectReasons(),
    [paymentActions.CHARGEBACK]: getTransactionChargebackReasons(),
  },
});

const mapActions = {
  fetchEntities: viewActionCreators.fetchEntities,
  fetchFilters: viewActionCreators.fetchFilters,
  onChangePaymentStatus: viewActionCreators.changePaymentStatus,
  loadPaymentStatuses: viewActionCreators.fetchPaymentStatuses,
  loadPaymentAccounts: viewActionCreators.fetchPaymentAccounts,
  addPayment: viewActionCreators.addPayment,
  manageNote: viewActionCreators.manageNote,
  resetNote: viewActionCreators.resetNote,
  resetAll: viewActionCreators.resetAll,
};

export default connect(mapStateToProps, mapActions)(View);
