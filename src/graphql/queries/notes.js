/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

const notesQuery = gql`query notes(
    $playerUUID: String!
    $pinned: Boolean
    $size: Int
    $changedAtTo: String
    $changedAtFrom: String
    $targetType: String
  ){
  notes(
    playerUUID: $playerUUID
    pinned: $pinned
    size: $size
    changedAtTo: $changedAtTo
    changedAtFrom: $changedAtFrom
    targetType: $targetType
    ) {
    data {
      size
      page
      totalElements
      totalPages
      number
      last
      content {
        _id
        pinned
        noteId
        content
        targetUUID
        changedBy
        changedAt
      }
    } error {
      error
    }
  }
}`;

export {
  notesQuery,
};

