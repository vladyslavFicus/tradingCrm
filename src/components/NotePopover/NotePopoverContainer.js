import { graphql, compose } from 'react-apollo';
import {
  addNoteMutation,
  removeNoteMutation,
  updateNoteMutation,
} from 'graphql/mutations/note';
import NotePopover from './NotePopover';

export default compose(
  graphql(addNoteMutation, {
    name: 'addNote',
  }),
  graphql(updateNoteMutation, {
    name: 'updateNote',
  }),
  graphql(removeNoteMutation, {
    name: 'removeNote',
  }),
)(NotePopover);
