import { compose, graphql } from 'react-apollo';
import { getClientPayments } from '../../../../../graphql/queries/payments';
import PaymentsGrid from './PaymentsGrid';

export default compose(
  graphql(getClientPayments, {
    name: 'clientPayments',
    options: variables => ({ variables: { args: variables } }),
  }),
)(PaymentsGrid);
