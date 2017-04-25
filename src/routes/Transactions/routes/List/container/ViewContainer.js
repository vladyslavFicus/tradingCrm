import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';
import { paymentActions } from '../../../../../constants/payment';
import { getTransactionRejectReasons, getTransactionChargebackReasons } from '../../../../../config';

const mapStateToProps = ({ transactions }) => ({
  ...transactions,
  paymentActionReasons: {
    [paymentActions.REJECT]: getTransactionRejectReasons(),
    [paymentActions.CHARGEBACK]: getTransactionChargebackReasons(),
  },
});

const mapActions = {
  fetchBalance: actionCreators.fetchBalance,
  fetchBalances: actionCreators.fetchBalances,
  fetchBonus: actionCreators.fetchBonus,
  fetchEntities: actionCreators.fetchEntities,
  onChangePaymentStatus: actionCreators.changePaymentStatus,
  loadPaymentStatuses: actionCreators.fetchPaymentStatuses,
};

export default connect(mapStateToProps, mapActions)(View);
