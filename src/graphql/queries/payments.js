import gql from 'graphql-tag';

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
  getPaymentMethods,
  getManualPaymentMethods,
};
