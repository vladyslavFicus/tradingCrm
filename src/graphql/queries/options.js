import gql from 'graphql-tag';

const currencyQuery = gql`query signUpOptions($brandId: String!) {
  options {
    signUp(brandId: $brandId) {
      post {
        currency {
          base
          list
          rates {
            amount
            currency
          }
        }
      }
    }
  }
}`;

const isDwhApiEnableQuery = gql`query servicesOptions {
  options {
    services {
      isDwhApiEnable
    }
  }
}`;

export {
  currencyQuery,
  isDwhApiEnableQuery,
};
