import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { depositFulfillmentQuery } from '.././../../../graphql/queries/campaigns';
import DepositFulfillmentView from './DepositFulfillmentView';
import { methodStatuses } from '../../../../constants/payment';

const paymentMethodsQuery = gql`query getPaymentMethods($status: String!){
  paymentMethods(status: $status) {
    data {
      uuid
      methodName
    }
    error {
      error
    }
  }
}`;

export default compose(
  connect(({ i18n: { locale } }) => ({
    locale,
  })),
  graphql(paymentMethodsQuery, {
    name: 'paymentMethods',
    options: {
      variables: {
        status: methodStatuses.ACTIVE,
      },
    },
  }),
)(DepositFulfillmentView);
