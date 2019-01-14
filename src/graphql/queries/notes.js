/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';
import { NoteFragment } from '../fragments/notes';

const notesQuery = gql`query notes(
    $targetUUID: String!
    $pinned: Boolean
    $size: Int
    $page: Int
    $changedAtTo: String
    $changedAtFrom: String
    $targetType: String
  ){
  notes(
    targetUUID: $targetUUID
    pinned: $pinned
    size: $size
    page: $page
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
        ...NoteFragment,
      }
    } error {
      error
    }
  }
}
${NoteFragment}`;

export {
  notesQuery,
};
