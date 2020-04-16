import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { PINNED_NOTES_SIZE } from '../constants';

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
        _id
        noteId
        targetUUID
        playerUUID
        content
        pinned
        changedAt
        changedBy
      }
    }
    error {
      error
    }
  }
}`;

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
