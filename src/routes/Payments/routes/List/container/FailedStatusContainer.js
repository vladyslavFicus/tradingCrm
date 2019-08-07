import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import FailedStatusIcon from '../../../../../components/FailedStatusIcon';
import { actionCreators } from '../../../../../redux/modules/transactions/paymentStatusMessages';

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
    children: stateProps.paymentStatusMessages[ownProps.paymentId] || I18n.t('COMMON.SELECT_OPTION.LOADING'),
  }),
)(FailedStatusIcon);
