import React from 'react';
import { get } from 'lodash';
import { Mutation } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import {
  addPinnedNote,
  removeNote,
  updateNoteMutation,
} from 'graphql/mutations/note';
import { notesQuery } from 'graphql/queries/notes';
import { PINNED_NOTES_SIZE } from '../constants';

const REQUEST = updateNoteMutation;

const UpdateLeadProfileNote = ({
  match: {
    params: { id },
  },
  children,
}) => (
  <Mutation
    mutation={REQUEST}
    update={(proxy, mutationResult) => {
      const {
        data: { noteId, pinned, targetUUID },
        data,
      } = get(mutationResult, 'data.note.update');

      const {
        notes: {
          data: { content },
        },
      } = proxy.readQuery({
        query: notesQuery,
        variables: {
          size: PINNED_NOTES_SIZE,
          targetUUID: id,
          pinned: true,
        },
      });

      const selectedNote = content.find(({ noteId: noteUUID }) => noteUUID === noteId);

      if (selectedNote && !pinned) {
        removeNote(
          proxy,
          { targetUUID, pinned: true, size: PINNED_NOTES_SIZE },
          noteId,
        );
      }

      if (!selectedNote && pinned) {
        addPinnedNote(proxy, { targetUUID, size: PINNED_NOTES_SIZE }, data);
      }
    }}
  >
    {children}
  </Mutation>
);

UpdateLeadProfileNote.propTypes = {
  children: PropTypes.func.isRequired,
  ...PropTypes.router,
};

export default UpdateLeadProfileNote;
