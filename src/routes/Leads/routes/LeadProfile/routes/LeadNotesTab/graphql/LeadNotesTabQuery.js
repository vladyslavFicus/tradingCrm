import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query NotesQuery(
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
      size
      page
      totalElements
      totalPages
      number
      last
      content {
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
    }
    error {
      error
    }
  }
}`;

const LeadNotesTabQuery = ({
  match: {
    params: { id },
  },
  location: { query },
  children,
}) => (
  <Query
    query={REQUEST}
    variables={{
      targetUUID: id,
      size: 20,
      page: 0,
      ...(query ? query.filters : {}),
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

LeadNotesTabQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
};

export default LeadNotesTabQuery;
