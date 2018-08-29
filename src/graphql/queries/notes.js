import gql from 'graphql-tag';

const notesQuery = gql`query notes(
  $targetUUID: String!
  $tagType: String
  $size: Int,
  $page: Int,
  ){
  notes(
    targetUUID: $targetUUID
    tagType: $tagType
    size: $size
    page: $page
    ) {
    size
    page
    totalElements
    number
    last
    content {
      tagName
      pinned
      tagId
      content
      tagType
      targetUUID
      changedBy
    }
  }
}`;

export {
  notesQuery,
};

