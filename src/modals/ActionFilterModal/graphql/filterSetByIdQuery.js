import { gql } from '@apollo/client';

export default gql`query getFilterSetById(
  $uuid: String!
) {
  filterSet(
    uuid: $uuid
  )
}
`;
