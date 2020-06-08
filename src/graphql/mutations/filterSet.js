import gql from 'graphql-tag';

const updateFavourite = gql`mutation updateFilterSet(
  $favourite: Boolean!
  $uuid: String!
) {
  filterSet {
    updateFavourite(
      favourite: $favourite
      uuid: $uuid
    ) {
      error {
        error
        fields_errors
      }
      success
    }
  }
}`;

const deleteFilterSet = gql`mutation deleteFilterSet(
  $uuid: String!
) {
  filterSet {
    delete(
      uuid: $uuid
    ) {
      error {
        error
        fields_errors
      }
      success
    }
  }
}`;

export {
  updateFavourite,
  deleteFilterSet,
};
