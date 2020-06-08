import gql from 'graphql-tag';

const filterSetByUserIdQuery = gql`query getFilterSets(
  $type: FilterSet__Types!
) {
  filterSets(
    type: $type
  ) {
    error {
      error
      fields_errors
    }
    data {
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
  }
}`;

const filterSetByIdQuery = gql`query getFilterSetById(
  $uuid: String!
) {
  filterSet(
    uuid: $uuid
  ) {
    data
    error {
      error
      fields_errors
    }
  }
}`;

export {
  filterSetByUserIdQuery,
  filterSetByIdQuery,
};
