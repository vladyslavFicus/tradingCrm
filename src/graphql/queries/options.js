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

const servicesQuery = gql`query servicesOptions {
  options {
    services
  }
}`;

export {
  currencyQuery,
  servicesQuery,
};
