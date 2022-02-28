import { gql } from '@apollo/client';

export default gql`query filterSetByIdQuery(
  $uuid: String!
) {
  filterSet(
    uuid: $uuid
  )
}
`;
