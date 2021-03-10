import gql from 'graphql-tag';

const AddressFragment = gql`
  fragment AddressFragment on Profile__Address {
    address
    city
    countryCode
    poBox
    postCode
    state
  }
`;

export {
  AddressFragment,
};
