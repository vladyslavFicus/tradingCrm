import gql from 'graphql-tag';

const createFilterSet = gql`mutation createFilterSet(
  $name: String!
  $fields: String!
  $type: String!
  $favourite: Boolean!
) {
  filterSet {
    create(
      name: $name
      fields: $fields
      type: $type
      favourite: $favourite
    ) {
      error {
        error
        fields_errors
      }
      data {
        name
        uuid
      }
    }
  }
}`;

const updateFilterSet = gql`mutation updateFilterSet(
  $name: String!
  $fields: String!
  $uuid: String!
) {
  filterSet {
    update(
      name: $name
      fields: $fields
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
      data {
        uuid
      }
    }
  }
}`;

export {
  createFilterSet,
  updateFilterSet,
  updateFavourite,
  deleteFilterSet,
};
