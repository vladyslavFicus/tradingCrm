import gql from 'graphql-tag';
import update from 'react-addons-update';
import { notesQuery } from '../queries/notes';

const updateNoteMutation = gql`mutation updateNote(
    $author: String!,
    $content: String!,
    $pinned: Boolean!,
    $playerUUID: String!,
    $targetType: String!,
    $uuid: String!,
    $targetUUID: String!,
) {
  note {
    update(
       author: $author,
       content: $content,
       pinned: $pinned,
       playerUUID: $playerUUID,
       targetType: $targetType,
       uuid: $uuid,
       targetUUID: $targetUUID,
      ) {
      data {
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
      error {
        error
      }
    }
  }
}`;

const addNoteMutation = gql`mutation addNote(
  $author: String!,
  $content: String!,
  $pinned: Boolean!,
  $playerUUID: String!,
  $targetType: String!,
  $targetUUID: String!,
) {
  note {
    add(
      author: $author,
      content: $content,
      pinned: $pinned,
      playerUUID: $playerUUID,
      targetType: $targetType,
      targetUUID: $targetUUID,
      ) {
      data {
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
      error {
        error
      }
    }
  }
}`;

const removeNoteMutation = gql`mutation removeNote(
  $uuid: String!,
) {
  note {
    remove(
      uuid: $uuid,
      ) {
      data {
        uuid
      }
      error {
        error
      }
    }
  }
}`;

const addNote = (proxy, variables, data) => {
  try {
    const { notes } = proxy.readQuery({ query: notesQuery, variables });
    const updatedNotes = update(notes, {
      content: { $push: [data] },
    });
    proxy.writeQuery({ query: notesQuery, variables, data: { notes: updatedNotes } });
  } catch (e) {
    console.log(e);
  }
};

const removeNote = (proxy, variables, uuid) => {
  try {
    const { notes: { content }, notes } = proxy.readQuery({ query: notesQuery, variables });
    const selectedIndex = content.findIndex(({ uuid: noteUuid }) => noteUuid === uuid);
    const updatedNotes = update(notes, {
      content: { $splice: [[selectedIndex, 1]] },
    });
    proxy.writeQuery({ query: notesQuery, variables, data: { notes: updatedNotes } });
  } catch (e) {
    console.log(e);
  }
};


export {
  updateNoteMutation,
  addNoteMutation,
  removeNoteMutation,
  removeNote,
  addNote,
};
