import { compose, graphql } from 'react-apollo';
import { getPayments } from '../../../../../graphql/queries/payments';
import PaymentsGrid from './PaymentsGrid';

export default compose(
  graphql(getPayments, {
    name: 'paymentsData',
    options: variables => ({ variables: { args: variables } }),
  }),
)(PaymentsGrid);
