import gql from 'graphql-tag';

const createCall = gql`mutation AsteriskCreateCall($number: String!, $prefix: Int!) {
  clickToCall {
    asterisk {
      createCall(number: $number, prefix: $prefix)
    }
  }
}`;

export {
  createCall,
};
