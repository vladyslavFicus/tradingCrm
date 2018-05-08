import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { paymentActions, chargebackReasons, rejectReasons } from '../../../../../constants/payment';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';

const mapStateToProps = ({
  transactions,
  i18n: { locale },
  auth: { brandId, uuid },
}) => ({
  ...transactions,
  locale,
  paymentActionReasons: {
    [paymentActions.REJECT]: rejectReasons,
    [paymentActions.CHARGEBACK]: chargebackReasons,
  },
  auth: { brandId, uuid },
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  fetchFilters: actionCreators.fetchFilters,
  fetchPlayerProfile: actionCreators.fetchPlayerProfile,
  onChangePaymentStatus: actionCreators.changePaymentStatus,
  loadPaymentStatuses: actionCreators.fetchPaymentStatuses,
  resetAll: actionCreators.resetAll,
  exportEntities: actionCreators.exportEntities,
};

export default connect(mapStateToProps, mapActions)(View);
