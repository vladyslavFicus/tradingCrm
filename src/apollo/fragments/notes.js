import { gql } from '@apollo/client';

const NoteFragment = gql`fragment NoteFragment on Note {
  _id
  noteId
  targetUUID
  targetType
  playerUUID
  subject
  content
  pinned
  changedAt
  changedBy
  operator {
    fullName
  }
}
`;

export {
  NoteFragment,
};
