import gql from 'graphql-tag';
import queryNames from 'constants/apolloQueryNames';
import { NoteFragment } from '../fragments/notes';
import { PaymentContentFragment } from '../fragments/payments';

const getPayments = gql`query ${queryNames.paymentsQuery}($args: PaymentSearch__Input) {
  payments (args: $args) {
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

const getClientPayments = gql`query ${queryNames.paymentsQuery}($args: PaymentSearch__Input) {
  clientPayments (args: $args) {
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
  getPayments,
  getClientPayments,
  getPaymentMethods,
  getManualPaymentMethods,
};
