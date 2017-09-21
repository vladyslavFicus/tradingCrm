import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { paymentActions } from '../../../../../constants/payment';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import { getTransactionRejectReasons, getTransactionChargebackReasons } from '../../../../../config';

const mapStateToProps = ({ openLoopTransactions, i18n: { locale } }) => ({
  ...openLoopTransactions,
  locale,
  paymentActionReasons: {
    [paymentActions.REJECT]: getTransactionRejectReasons(),
    [paymentActions.CHARGEBACK]: getTransactionChargebackReasons(),
  },
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  fetchFilters: actionCreators.fetchFilters,
  fetchPlayerProfile: actionCreators.fetchPlayerProfile,
  onChangePaymentStatus: actionCreators.changePaymentStatus,
  loadPaymentStatuses: actionCreators.fetchPaymentStatuses,
  resetAll: actionCreators.resetAll,
};

export default connect(mapStateToProps, mapActions)(View);
