import gql from 'graphql-tag';

export default gql`query filterSetByIdQuery(
  $uuid: String!
) {
  filterSet(
    uuid: $uuid
  )
}`;
