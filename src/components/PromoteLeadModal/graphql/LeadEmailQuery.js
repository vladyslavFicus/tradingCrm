import { gql } from '@apollo/client';

export default gql`query LeadEmailQuery($uuid: String!) {
  leadContacts(uuid: $uuid) {
    email
  }
}
`;
