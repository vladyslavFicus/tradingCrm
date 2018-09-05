import gql from 'graphql-tag';
import update from 'react-addons-update';
import { notesQuery } from '../queries/notes';

const updateNoteMutation = gql`mutation updateNote(
  $tagId: String!
  $targetUUID: String!
  $content: String!
  $pinned: Boolean!
) {
  note {
    update(
       tagId: $tagId
       targetUUID: $targetUUID
       newContent: $content
       pinned: $pinned
      ) {
      data {
        tagName
        pinned
        tagId
        content
        tagType
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
        tagName
        pinned
        tagId
        content
        tagType
        targetUUID
        changedBy
        changedAt
      }
    }
  }
}`;

const removeNoteMutation = gql`mutation removeNote(
  $tagId: String!,
) {
  note {
    remove(
      tagId: $tagId,
      ) {
      data {
        tagId
      }
      error {
        error
      }
    }
  }
}`;

const addPinnedNote = (proxy, variables, data) => {
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

const removePinnedNote = (proxy, variables, tagId) => {
  try {
    const { notes: { content }, notes } = proxy.readQuery({ query: notesQuery, variables });
    const selectedIndex = content.findIndex(({ tagId: noteUuid }) => noteUuid === tagId);
    const updatedNotes = update(notes, {
      content: { $splice: [[selectedIndex, 1]] },
    });
    proxy.writeQuery({ query: notesQuery, variables, data: { notes: updatedNotes } });
  } catch (e) {
    console.log(e);
  }
};

const removeNote = (proxy, variables, tagId) => {
  try {
    const { notes: { content }, notes } = proxy.readQuery({ query: notesQuery, variables });
    const selectedIndex = content.findIndex(({ tagId: noteUuid }) => noteUuid === tagId);
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
  removePinnedNote,
  addPinnedNote,
};
