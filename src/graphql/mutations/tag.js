import gql from 'graphql-tag';

const createOrLinkTagMutation = gql`mutation createOrLinkTag(
  $tagId: String!
  $tagName: String!
  $content: String
) {
  tag {
    createOrLink(
       tagId: $tagId
       tagName: $tagName
       tagType: TAG
       content: $content
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

export {
  createOrLinkTagMutation,
};
