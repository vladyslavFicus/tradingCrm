import gql from 'graphql-tag';

const filterSetByUserIdQuery = gql`query getFilterSets($type: FilterSet__Types__Enum!) {
  filterSets(type: $type) {
    favourite {
      name
      uuid
      favourite
    }
    common {
      name
      uuid
      favourite
    }
  }
}`;

const filterSetByIdQuery = gql`query getFilterSetById(
  $uuid: String!
) {
  filterSet(
    uuid: $uuid
  )
}`;

export {
  filterSetByUserIdQuery,
  filterSetByIdQuery,
};
