import gql from 'graphql-tag';

const createOrLinkTagMutation = gql`mutation createOrLinkTag(
  $tagId: String
  $tagName: String!
  $content: String
  $targetUUID: String
  $pinned: Boolean
) {
  tag {
    createOrLink(
       tagId: $tagId
       tagName: $tagName
       tagType: TAG
       content: $content
       targetUUID: $targetUUID
       pinned: $pinned
      ) {
      data {
        tagId
      }
      error {
        error
      }
    }
  }
}`;

const unlinkTagMutation = gql`mutation unlinkTag($tagId: String, $targetUUID: String) {
  tag {
    unlink(tagId: $tagId, targetUUID: $targetUUID) {
      success
    }
  }
}`;

export {
  createOrLinkTagMutation,
  unlinkTagMutation,
};
