import gql from 'graphql-tag';

const ContactsFragment = gql`fragment ContactsFragment on ContactsType {
  additionalEmail
  additionalPhone
  email
  phone
}`;

export {
  ContactsFragment,
};
