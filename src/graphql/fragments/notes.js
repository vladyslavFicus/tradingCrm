import gql from 'graphql-tag';

const NoteFragment = gql`fragment NoteFragment on Note {
  _id
  noteId
  targetUUID
  playerUUID
  subject
  content
  pinned
  changedAt
  changedBy
  operator {
    fullName
  }
}`;

export {
  NoteFragment,
};
