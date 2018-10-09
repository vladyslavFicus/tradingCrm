import gql from 'graphql-tag';

const notesQuery = gql`query notes(
  $playerUUID: String!
  $pinned: Boolean
  $size: Int
  $page: Int
  $changedAtTo: String
  $changedAtFrom: String
  $targetType: String
  $tagType: tagTypes
  ){
  notes(
    playerUUID: $playerUUID
    pinned: $pinned
    size: $size
    page: $page
    changedAtTo: $changedAtTo
    changedAtFrom: $changedAtFrom
    targetType: $targetType
    tagType: $tagType
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
      changedAt
    }
  }
}`;

export {
  notesQuery,
};

