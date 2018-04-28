import gql from 'graphql-tag';

const notesQuery = gql`query notes(
  $playerUUID: String!,
  $pinned: Boolean,
  $targetType: String,
  $size: Int,
  $page: Int,
  $searchValue: String,
  $from: String,
  $to: String,
  $targetUUID: String,
  ){
  notes(
    playerUUID: $playerUUID,
    pinned: $pinned,
    targetUUID: $targetUUID,
    targetType: $targetType,
    searchValue: $searchValue,
    from: $from,
    to: $to,
    size: $size,
    page: $page,
    ) {
    size
    page
    totalElements
    number
    last
    content {
      content
      uuid
      author
      creationDate
      creatorUUID
      lastEditionDate
      lastEditorUUID
      playerUUID
      targetType
      targetUUID
      pinned
    }
  }
}`;

export {
  notesQuery,
};

