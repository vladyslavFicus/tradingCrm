import gql from 'graphql-tag';
import queryNames from 'constants/apolloQueryNames';
import { NoteFragment } from '../fragments/notes';
import { PaymentContentFragment } from '../fragments/payments';

const getClientPayments = gql`query ${queryNames.paymentsQuery}(
  $args: PaymentsInputType
) {
  clientPayments (
    args: $args
  ) {
    data {
      page
      number
      totalElements
      size
      last
      content {
        ...PaymentContentFragment
      }
    }
    error {
      error
    }
  } 
}
${NoteFragment}
${PaymentContentFragment}`;

const getClientPaymentsByUuid = gql`query ${queryNames.paymentsQuery}(
  $args: PaymentsByUuidInputType
) {
  clientPaymentsByUuid (
    args: $args
  ) {
    data {
      page
      number
      totalElements
      size
      last
      content {
        ...PaymentContentFragment
      }
    }
    error {
      error
    }
  } 
}
${NoteFragment}
${PaymentContentFragment}`;

const getOperatorPaymentMethods = gql`query getOperatorPaymentMethods {
  operatorPaymentMethods {
    data {
      _id
      methodName
      uuid
    }
    error {
      error
    }
  } 
}`;

const getPaymentMethods = gql`query getPaymentMethods {
  paymentMethods {
    data
    error {
      error
    }
  }
}`;

const getManualPaymentMethods = gql` query getManualPaymentMethods {
  manualPaymentMethods {
    data
    error {
      error
    }
  }
}`;

export {
  getClientPayments,
  getClientPaymentsByUuid,
  getOperatorPaymentMethods,
  getPaymentMethods,
  getManualPaymentMethods,
};
