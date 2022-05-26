import { gql } from '@apollo/client';

export default gql`query LeadProfileTab__LeadPhoneQuery($uuid: String!) {
  leadContacts(uuid: $uuid) {
    phone
  }
}
`;
