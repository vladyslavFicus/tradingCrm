import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Payments from '../components/Payments';
import { actionCreators as viewActionCreators } from '../modules';
import { paymentActions, chargebackReasons, rejectReasons } from '../../../../../../../../../constants/payment';
import { addPaymentMutation } from '../../../../../../../../../graphql/mutations/payment';
import { getClientPaymentsByUuid } from '../../../../../../../../../graphql/queries/payments';

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
  manageNote: viewActionCreators.manageNote,
  resetNote: viewActionCreators.resetNote,
  resetAll: viewActionCreators.resetAll,
  fetchActiveBonus: viewActionCreators.fetchActiveBonus,
};

export default compose(
  graphql(addPaymentMutation, {
    name: 'addPayment',
  }),
  graphql(getClientPaymentsByUuid, {
    name: 'clientPayments',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
      },
    }),
  }),
  connect(mapStateToProps, mapActions),
)(Payments);
