import { gql } from '@apollo/client';

export default gql`query LeadPhonesQuery($uuid: String!) {
  leadContacts(uuid: $uuid) {
    phone
    mobile
  }
}
`;
