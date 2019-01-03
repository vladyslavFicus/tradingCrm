import gql from 'graphql-tag';
import update from 'react-addons-update';
import { notesQuery } from '../queries/notes';

const updateNoteMutation = gql`mutation updateNote(
  $targetUUID: String!
  $content: String!
  $pinned: Boolean!
  $noteId: String!
) {
  note {
    update(
       noteId: $noteId
       targetUUID: $targetUUID
       content: $content
       pinned: $pinned
      ) {
      data {
        pinned
        noteId
        content
        _id
        targetUUID
        playerUUID
        changedBy
        changedAt
      }
      error {
        error
      }
    }
  }
}`;

const addNoteMutation = gql`mutation addNote(
  $content: String!
  $targetUUID: String!
  $pinned: Boolean!
  $playerUUID: String!
) {
  note {
    add(
      content: $content
      targetUUID: $targetUUID
      pinned: $pinned
      playerUUID: $playerUUID
    ) {
      data {
        playerUUID
        pinned
        noteId
        _id
        content
        targetUUID
        changedBy
        changedAt
      }
      error {
        error
      }
    }
  }
}`;

const removeNoteMutation = gql`mutation removeNote(
  $noteId: String!,
) {
  note {
    remove(
      noteId: $noteId,
      ) {
      data {
        noteId
      }
      error {
        error
      }
    }
  }
}`;

const addPinnedNote = (proxy, params, data) => {
  const variables = { ...params, pinned: true };

  try {
    const { notes } = proxy.readQuery({ query: notesQuery, variables });
    const updatedNotes = update(notes, {
      data: { content: { $unshift: [data] } },
    });
    proxy.writeQuery({ query: notesQuery, variables, data: { notes: updatedNotes } });
  } catch (e) {
    console.log(e);
  }
};

const removeNote = (proxy, variables, noteId) => {
  try {
    const { notes: { data: { content } }, notes } = proxy.readQuery({ query: notesQuery, variables });
    const selectedIndex = content.findIndex(({ noteId: noteUuid }) => noteUuid === noteId);
    const updatedNotes = update(notes, {
      data: {
        content: { $splice: [[selectedIndex, 1]] },
      },
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
  addPinnedNote,
};
