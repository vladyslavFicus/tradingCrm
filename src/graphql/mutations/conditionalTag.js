import gql from 'graphql-tag';

const addTagsMutation = gql`mutation conditionalTag(
  $tag: String!,
  $name: String!,
  $type: String!,
  $file: Upload!,
) {
  conditionalTag { 
    addTags(
      tag: $tag,
      type: $type,
      name: $name
      file: $file
    ) {
      data { 
        uuid
      } 
      error {
        error
        fields_errors
      }
    }
  }
}`;

const disableTagMutation = gql`mutation disableTag(
  $uuid: String!,
) {
  conditionalTag { 
    disableTag(
      uuid: $uuid,
    ) {
      data { 
        uuid
        _id
        conditionStatus
      } 
      error {
        error
        fields_errors
      }
    }
  }
}`;

export {
  addTagsMutation,
  disableTagMutation,
};
