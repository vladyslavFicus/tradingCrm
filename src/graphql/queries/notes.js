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
    $department: String
  ){
  notes(
    targetUUID: $targetUUID
    pinned: $pinned
    size: $size
    page: $page
    changedAtTo: $changedAtTo
    changedAtFrom: $changedAtFrom
    targetType: $targetType
    department: $department
    ) {
    size
    page
    totalElements
    totalPages
    number
    last
    content {
      ...NoteFragment,
    }
  }
}
${NoteFragment}`;

export {
  notesQuery,
};
