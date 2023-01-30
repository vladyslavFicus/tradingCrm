import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { NoteFragment } from 'apollo/fragments/notes';

const REQUEST = gql`
  query PinnedNotesQuery(
    $targetUUID: String!
    $pinned: Boolean
    $size: Int
  ) @connection(key: "PinnedNotes") {
    notes(
      targetUUID: $targetUUID
      pinned: $pinned
      size: $size
    ) {
      size
      page
      totalElements
      totalPages
      number
      last
      content {
        ...NoteFragment
      }
    }
  }
  ${NoteFragment}
`;

const PinnedNotesQuery = ({ children, targetUUID }) => (
  <Query
    query={REQUEST}
    variables={{
      size: 100,
      pinned: true,
      targetUUID,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

PinnedNotesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  targetUUID: PropTypes.string.isRequired,
};

export default PinnedNotesQuery;
