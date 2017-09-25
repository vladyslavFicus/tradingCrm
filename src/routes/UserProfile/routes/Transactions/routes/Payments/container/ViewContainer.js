import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as viewActionCreators } from '../modules/index';
import { getTransactionRejectReasons, getTransactionChargebackReasons } from '../../../../../../../config/index';
import { paymentActions } from '../../../../../../../constants/payment';
import { actionCreators as locationActionCreators } from '../../../../../../../redux/modules/location';

const mapStateToProps = ({ userTransactions, profile: { profile, playerLimits }, i18n: { locale } }) => ({
  ...userTransactions,
  locale,
  currencyCode: profile.data.currencyCode,
  playerProfile: profile.data,
  playerLimits,
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
  locationChange: locationActionCreators.locationChange,
};

export default connect(mapStateToProps, mapActions)(View);
