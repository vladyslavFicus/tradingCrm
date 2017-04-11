import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';
import { actionCreators as paymentActionCreators } from '../../../../../redux/modules/payment';
import config from '../../../../../config';

const mapStateToProps = ({ transactions }) => ({
  ...transactions,
});
const mapActions = {
  ...actionCreators,
  onChangePaymentStatus: paymentActionCreators.changePaymentStatus,
  loadPaymentStatuses: paymentActionCreators.fetchPaymentStatuses,
};

export default connect(mapStateToProps, mapActions)(View);
