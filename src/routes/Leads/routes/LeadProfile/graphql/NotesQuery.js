import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { PINNED_NOTES_SIZE } from '../constants';

export const NoteFragment = gql`fragment NoteFragment on Note {
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
}`;

export const REQUEST = gql`query NotesQuery(
    $targetUUID: String!
    $pinned: Boolean
    $size: Int
  ){
  notes(
    targetUUID: $targetUUID
    pinned: $pinned
    size: $size
    ) {
    data {
      content {
        ...NoteFragment
      }
    }
    error {
      error
    }
  }
}
${NoteFragment}`;

const NotesQuery = ({
  match: {
    params: { id },
  },
  children,
}) => (
  <Query
    query={REQUEST}
    variables={{
      size: PINNED_NOTES_SIZE,
      targetUUID: id,
      pinned: true,
    }}
  >
    {children}
  </Query>
);

NotesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  ...PropTypes.router,
};

export default NotesQuery;
