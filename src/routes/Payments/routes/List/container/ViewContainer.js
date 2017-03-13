import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import List from '../components/List';
import { actionCreators as paymentActionCreators } from 'redux/modules/payment';

const mapStateToProps = ({ paymentsList: list }) => ({ list });
const mapActions = {
  ...actionCreators,
  onChangePaymentStatus: paymentActionCreators.changePaymentStatus,
  loadPaymentStatuses: paymentActionCreators.fetchPaymentStatuses,
};

export default connect(mapStateToProps, mapActions)(List);
