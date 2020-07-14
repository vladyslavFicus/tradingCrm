import gql from 'graphql-tag';
import { NoteFragment } from '../fragments/notes';

const updateNoteMutation = gql`mutation updateNote(
  $subject: String
  $content: String!
  $targetUUID: String!
  $pinned: Boolean!
  $noteId: String!
) {
  note {
    update(
       noteId: $noteId
       targetUUID: $targetUUID
       subject: $subject
       content: $content
       pinned: $pinned
      ) {
      ...NoteFragment
    }
  }
}
${NoteFragment}`;

const addNoteMutation = gql`mutation addNote(
  $subject: String
  $content: String!
  $targetUUID: String!
  $pinned: Boolean!
  $playerUUID: String!
  $targetType: String!
) {
  note {
    add(
      subject: $subject
      content: $content
      targetUUID: $targetUUID
      pinned: $pinned
      playerUUID: $playerUUID
      targetType: $targetType
    ) {
      ...NoteFragment
    }
  }
}
${NoteFragment}`;

const removeNoteMutation = gql`mutation removeNote(
  $noteId: String!,
) {
  note {
    remove(noteId: $noteId) {
      noteId
    }
  }
}`;

export {
  updateNoteMutation,
  addNoteMutation,
  removeNoteMutation,
};
