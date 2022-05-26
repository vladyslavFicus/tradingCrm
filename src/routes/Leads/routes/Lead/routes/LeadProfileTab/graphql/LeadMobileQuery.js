import { gql } from '@apollo/client';

export default gql`query LeadProfileTab__LeadMobileQuery($uuid: String!) {
  leadContacts(uuid: $uuid) {
    mobile
  }
}
`;
