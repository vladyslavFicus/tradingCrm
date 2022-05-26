import { gql } from '@apollo/client';

export default gql`query LeadProfileTab__LeadEmailQuery($uuid: String!) {
  leadContacts(uuid: $uuid) {
    email
  }
}
`;
