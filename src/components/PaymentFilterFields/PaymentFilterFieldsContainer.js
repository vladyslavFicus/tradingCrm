import { compose, graphql, withApollo } from 'react-apollo';
import { operatorsQuery } from 'graphql/queries/operators';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import { getPaymentMethods } from 'graphql/queries/payments';
import PaymentFilterFields from './PaymentFilterFields';

export default compose(
  withApollo,
  graphql(getUserBranchHierarchy, {
    name: 'hierarchy',
    options: () => ({
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(operatorsQuery, {
    name: 'operators',
  }),
  graphql(getPaymentMethods, {
    name: 'paymentMethods',
  }),
)(PaymentFilterFields);
