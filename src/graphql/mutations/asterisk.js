import gql from 'graphql-tag';

const createCall = gql`mutation AsteriskCreateCall($number: String!, $prefix: Int!) {
  asterisk {
    createCall(number: $number, prefix: $prefix) {
      success
    }
  }
}`;

export {
  createCall,
};
