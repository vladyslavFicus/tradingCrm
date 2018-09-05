import gql from 'graphql-tag';

const playerNotesQuery = gql`query playerNotes(
  $playerUUID: String!
  $pinned: Boolean
  $size: Int,
  $page: Int,
  ){
  playerNotes(
    playerUUID: $playerUUID
    pinned: $pinned
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
      changedAt
    }
  }
}`;

export {
  playerNotesQuery,
};

