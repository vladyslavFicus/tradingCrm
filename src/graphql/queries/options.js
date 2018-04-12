import gql from 'graphql-tag';

const currencyQuery = gql`query signUpOptions($brandId: String!) {
  options {
    signUp(brandId: $brandId) {
      post {
        currency {
          list
          base
        }
      }
    }
  }
}`;

export {
  currencyQuery,
};
