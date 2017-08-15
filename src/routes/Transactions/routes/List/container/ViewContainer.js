import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { paymentActions } from '../../../../../constants/payment';
import { getTransactionRejectReasons, getTransactionChargebackReasons } from '../../../../../config';

const mapStateToProps = ({ transactions, i18n: { locale } }) => ({
  ...transactions,
  locale,
  paymentActionReasons: {
    [paymentActions.REJECT]: getTransactionRejectReasons(),
    [paymentActions.CHARGEBACK]: getTransactionChargebackReasons(),
  },
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  fetchFilters: actionCreators.fetchFilters,
  fetchPlayerProfile: actionCreators.fetchPlayerProfile,
  onChangePaymentStatus: actionCreators.changePaymentStatus,
  loadPaymentStatuses: actionCreators.fetchPaymentStatuses,
  resetAll: actionCreators.resetAll,
};

export default connect(mapStateToProps, mapActions)(View);
