import { gql } from '@apollo/client';

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
