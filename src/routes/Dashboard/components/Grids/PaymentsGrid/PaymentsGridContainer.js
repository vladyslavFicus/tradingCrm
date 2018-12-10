import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { getClientPayments } from '../../../../../graphql/queries/payments';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import { actionCreators as transactionsActionCreators } from '../../../../../redux/modules/transactions';
import PaymentsGrid from './PaymentsGrid';

const mapStateToProps = ({ auth: { brandId, uuid } }) => ({
  auth: {
    brandId,
    uuid,
  },
});

const mapDispatchToProps = {
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  loadPaymentStatuses: transactionsActionCreators.fetchPaymentStatuses,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(getClientPayments, {
    name: 'clientPayments',
    options: variables => ({ variables }),
  }),
)(PaymentsGrid);
