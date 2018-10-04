import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import Payments from '../components/Payments';
import { createDepositMutation, createWithdrawMutation } from '../../../../../../../../../graphql/mutations/payment';
import { getOperatorPaymentMethods } from '../../../../../../../../../graphql/queries/payments';
import { actionCreators as viewActionCreators } from '../modules';
import { paymentActions, chargebackReasons, rejectReasons } from '../../../../../../../../../constants/payment';

const mapStateToProps = ({
  userTransactions,
  profile: { profile, playerLimits },
  i18n: { locale },
}) => ({
  ...userTransactions,
  locale,
  currencyCode: profile.data.currencyCode,
  playerProfile: profile.data,
  playerLimits,
  paymentActionReasons: {
    [paymentActions.REJECT]: rejectReasons,
    [paymentActions.CHARGEBACK]: chargebackReasons,
  },
});

const mapActions = {
  fetchEntities: viewActionCreators.fetchEntities,
  fetchFilters: viewActionCreators.fetchFilters,
  onChangePaymentStatus: viewActionCreators.changePaymentStatus,
  loadPaymentStatuses: viewActionCreators.fetchPaymentStatuses,
  loadPaymentAccounts: viewActionCreators.fetchPaymentAccounts,
  addPayment: viewActionCreators.addPayment,
  manageNote: viewActionCreators.manageNote,
  resetNote: viewActionCreators.resetNote,
  resetAll: viewActionCreators.resetAll,
  fetchActiveBonus: viewActionCreators.fetchActiveBonus,
  exportEntities: viewActionCreators.exportEntities,
};

export default compose(
  connect(mapStateToProps, mapActions),
  graphql(getOperatorPaymentMethods, { name: 'operatorPaymentMethods' }),
  graphql(createDepositMutation, { name: 'createDeposit' }),
  graphql(createWithdrawMutation, { name: 'createWithdraw' }),
)(Payments);
