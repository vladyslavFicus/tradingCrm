import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { REQUEST as notesQuery } from './NotesQuery';
import { PINNED_NOTES_SIZE } from '../constants';

const REQUEST = gql`mutation AddLeadProfileNote(
  $subject: String
  $content: String!
  $targetUUID: String!
  $pinned: Boolean!
  $playerUUID: String!
  $targetType: String!
) {
  note {
    add(
      subject: $subject
      content: $content
      targetUUID: $targetUUID
      pinned: $pinned
      playerUUID: $playerUUID
      targetType: $targetType
    ) {
      data {
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
      }
      error {
        error
      }
    }
  }
}`;

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
