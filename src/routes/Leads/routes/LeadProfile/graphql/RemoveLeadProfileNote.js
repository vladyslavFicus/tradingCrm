import React from 'react';
import { get } from 'lodash';
import { Mutation } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { removeNote, removeNoteMutation } from 'graphql/mutations/note';
import { PINNED_NOTES_SIZE } from '../constants';

const REQUEST = removeNoteMutation;

const RemoveLeadProfileNote = ({
  match: {
    params: { id: targetUUID },
  },
  location: { query },
  children,
}) => (
  <Mutation
    mutation={REQUEST}
    update={(proxy, mutationResult) => {
      const { noteId } = get(mutationResult, 'data.note.remove.data');

      removeNote(
        proxy,
        { targetUUID, pinned: true, size: PINNED_NOTES_SIZE },
        noteId,
      );

      removeNote(
        proxy,
        {
          targetUUID,
          size: 25,
          page: 0,
          ...(query ? query.filters : {}),
        },
        noteId,
      );
    }}
  >
    {children}
  </Mutation>
);

RemoveLeadProfileNote.propTypes = {
  children: PropTypes.func.isRequired,
  ...PropTypes.router,
};

export default RemoveLeadProfileNote;
