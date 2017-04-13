import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';
import { actionCreators as paymentActionCreators } from '../../../../../redux/modules/payment';
import { getTransactionRejectReasons } from '../../../../../config';

const mapStateToProps = ({ transactions }) => ({
  ...transactions,
  paymentRejectReasons: getTransactionRejectReasons(),
});
const mapActions = {
  ...actionCreators,
  onChangePaymentStatus: paymentActionCreators.changePaymentStatus,
  loadPaymentStatuses: paymentActionCreators.fetchPaymentStatuses,
};

export default connect(mapStateToProps, mapActions)(View);
