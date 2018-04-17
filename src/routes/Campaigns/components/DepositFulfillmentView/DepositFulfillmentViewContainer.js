import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { depositFulfillmentQuery } from '.././../../../graphql/queries/campaigns';
import { currencyQuery } from '../../../../graphql/queries/options';
import DepositFulfillmentView from './DepositFulfillmentView';
import { getBrandId } from '../../../../config';
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
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: {
      variables: {
        brandId: getBrandId(),
      },
    },
  }),
  graphql(depositFulfillmentQuery, {
    options: ({ uuid }) => ({
      variables: {
        uuid,
      },
    }),
    skip: ({ uuid, optionCurrencies: { loading } }) => !uuid || loading,
    name: 'depositFulfillment',
  }),
)(DepositFulfillmentView);
