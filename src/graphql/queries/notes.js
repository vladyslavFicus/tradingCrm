
import gql from 'graphql-tag';

const notesQuery = gql`query notes($playerUUID: String!, $pinned: Boolean){
  notes(playerUUID: $playerUUID,pinned: $pinned) {
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

