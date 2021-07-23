import gql from 'graphql-tag';

const ContactsFragment = gql`
  fragment ContactsFragment on Profile__Contacts {
    additionalEmail
    additionalPhone
    email
    phone
  }
`;

export {
  ContactsFragment,
};
