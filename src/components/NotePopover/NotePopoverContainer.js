import { graphql, compose } from 'react-apollo';
import {
  addNoteMutation,
  removeNoteMutation,
  updateNoteMutation,
} from 'graphql/mutations/note';
import { NoteFragment } from 'graphql/fragments/notes';
import NotePopover from './NotePopover';

const ENTITIES = [
  'File',
  'PaymentTrading',
  'Callback',
];

const addToApolloCache = targetUUID => (cache, { data: { note: { add: { data } } } }) => {
  if (data) {
    cache.writeFragment({
      fragment: NoteFragment,
      data,
    });

    ENTITIES.forEach((entity) => {
      const item = cache.data.get(`${entity}:${targetUUID}`);

      if (item) {
        cache.data.set(`${entity}:${targetUUID}`, {
          ...item,
          note: {
            generated: false,
            id: `${data.__typename}:${data.noteId}`,
            type: 'id',
            typename: data.__typename,
          },
        });
      }
    });
  }
};

const removeFromApolloCache = targetUUID => (cache, { data: { note: { remove: { data } } } }) => {
  if (data) {
    ENTITIES.forEach((entity) => {
      const item = cache.data.get(`${entity}:${targetUUID}`);

      if (item) {
        cache.data.set(`${entity}:${targetUUID}`, {
          ...item,
          note: null,
        });

        cache.data.delete(`${data.__typename}:${data.noteId}`);
      }
    });
  }
};

export default compose(
  graphql(addNoteMutation, {
    name: 'addNote',
    options: ({ initialValues: { targetUUID } }) => ({
      update: addToApolloCache(targetUUID),
    }),
  }),
  graphql(updateNoteMutation, {
    name: 'updateNote',
  }),
  graphql(removeNoteMutation, {
    name: 'removeNote',
    options: ({ initialValues: { targetUUID } }) => ({
      update: removeFromApolloCache(targetUUID),
    }),
  }),
)(NotePopover);
