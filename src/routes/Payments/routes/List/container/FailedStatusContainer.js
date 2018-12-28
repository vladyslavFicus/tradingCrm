import { connect } from 'react-redux';
import FailedStatusIcon from '../../../../../components/FailedStatusIcon';
import { actionCreators } from '../modules/paymentStatusMessages';

export default connect(
  ({ transactions }) => ({ paymentStatusMessages: transactions.paymentStatusMessages }),
  dispatch => ({
    onOpen: (paymentStatusMessages, paymentId, UUID) => {
      if (Object.keys(paymentStatusMessages).indexOf(paymentId) === -1) {
        dispatch(actionCreators.fetchPaymentStatuses(UUID, paymentId));
      }
    },
  }),
  (stateProps, dispatchProps, ownProps) => Object.assign({}, ownProps, stateProps, {
    onOpen: () => dispatchProps.onOpen(stateProps.paymentStatusMessages, ownProps.paymentId, ownProps.uuid),
    children: stateProps.paymentStatusMessages[ownProps.paymentId] || '',
  })
)(FailedStatusIcon);
