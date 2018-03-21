import gql from 'graphql-tag';

const addTagMutation = gql`mutation addTag(
  $tag: String!,
  $priority: String!,
  $playerUUID: String!
) {
  tag {
    add(
      playerUUID: $playerUUID,
      tag: $tag,
      priority: $priority,
      ) {
      data {
        id
        tag
        priority
      }
      error {
        error
      }
    }
  }
}`;


const removeTagMutation = gql`mutation removeTag(
  $playerUUID: String!,
  $id: ID!
) {
  tag {
    remove(
      playerUUID: $playerUUID,
      id: $id
      ) {
      data {
        id
      }
      error {
        error
      }
    }
  }
}`;

export {
  addTagMutation,
  removeTagMutation,
};
