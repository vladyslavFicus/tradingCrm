import gql from 'graphql-tag';

const notesQuery = gql`query notes(
  $targetUUID: String!
  $pinned: Boolean
  $tagType: tagTypes
  $size: Int,
  $page: Int,
  ){
  notes(
    targetUUID: $targetUUID
    pinned: $pinned
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

