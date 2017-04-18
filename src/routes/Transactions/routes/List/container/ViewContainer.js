import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';
import { getTransactionRejectReasons } from '../../../../../config';

const mapStateToProps = ({ transactions }) => ({
  ...transactions,
  paymentRejectReasons: getTransactionRejectReasons(),
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
