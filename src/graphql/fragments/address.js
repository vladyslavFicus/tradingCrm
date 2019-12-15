import gql from 'graphql-tag';

const AddressFragment = gql`fragment AddressFragment on AddressType {
  address
  city
  countryCode
  postCode
  state
}`;

export {
  AddressFragment,
};
