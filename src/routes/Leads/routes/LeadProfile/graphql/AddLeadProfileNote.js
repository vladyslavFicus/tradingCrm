import React from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { addNoteMutation } from 'graphql/mutations/note';
import { notesQuery } from 'graphql/queries/notes';
import { PINNED_NOTES_SIZE } from '../constants';

const REQUEST = addNoteMutation;

const AddLeadProfileNote = ({
  match: {
    params: { id },
  },
  location: { query },
  children,
}) => (
  <Mutation
    mutation={REQUEST}
    refetchQueries={[
      {
        query: notesQuery,
        variables: {
          size: PINNED_NOTES_SIZE,
          targetUUID: id,
          pinned: true,
        },
      },
      {
        query: notesQuery,
        variables: {
          targetUUID: id,
          size: 25,
          page: 0,
          ...(query ? query.filters : {}),
        },
      },
    ]}
  >
    {children}
  </Mutation>
);

AddLeadProfileNote.propTypes = {
  children: PropTypes.func.isRequired,
  ...PropTypes.router,
};

export default AddLeadProfileNote;
