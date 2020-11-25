import gql from 'graphql-tag';

const updateFavourite = gql`mutation updateFilterSet(
  $favourite: Boolean!
  $uuid: String!
) {
  filterSet {
    updateFavourite(
      favourite: $favourite
      uuid: $uuid
    )
  }
}`;

const deleteFilterSet = gql`mutation deleteFilterSet(
  $uuid: String!
) {
  filterSet {
    delete(uuid: $uuid)
  }
}`;

export {
  updateFavourite,
  deleteFilterSet,
};
