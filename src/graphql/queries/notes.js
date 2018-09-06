import gql from 'graphql-tag';

const notesQuery = gql`query notes(
  $playerUUID: String!
  $pinned: Boolean
  $size: Int
  $page: Int
  $changedAtTo: String
  $changedAtFrom: String
  $targetType: String
  ){
  notes(
    playerUUID: $playerUUID
    pinned: $pinned
    size: $size
    page: $page
    changedAtTo: $changedAtTo
    changedAtFrom: $changedAtFrom
    targetType: $targetType
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

