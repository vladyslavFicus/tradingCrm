import gql from 'graphql-tag';

export default gql`query getFilterSetById(
  $uuid: String!
) {
  filterSet(
    uuid: $uuid
  )
}`;
