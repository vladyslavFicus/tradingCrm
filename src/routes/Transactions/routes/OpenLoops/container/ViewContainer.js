import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import List from '../components/List';

const mapStateToProps = ({ openLoopPaymentsList: list }) => ({ list });
const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  onChangePaymentStatus: actionCreators.changePaymentStatus,
  loadPaymentStatuses: actionCreators.fetchPaymentStatuses,
};

export default connect(mapStateToProps, mapActions)(List);
