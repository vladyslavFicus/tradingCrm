import gql from 'graphql-tag';

const AddressFragment = gql`
  fragment AddressFragment on Profile__Address {
    address
    city
    countryCode
    postCode
    state
  }
`;

export {
  AddressFragment,
};
