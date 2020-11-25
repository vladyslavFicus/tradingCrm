import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { NoteFragment } from 'graphql/fragments/notes';

const REQUEST = gql`
  query LeadNotesQuery(
    $targetUUID: String!
    $pinned: Boolean
    $size: Int
    $page: Int
    $changedAtTo: String
    $changedAtFrom: String
  ) {
    notes(
      targetUUID: $targetUUID
      pinned: $pinned
      size: $size
      page: $page
      changedAtTo: $changedAtTo
      changedAtFrom: $changedAtFrom
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

const LeadNotesTabQuery = ({
  match: {
    params: { id },
  },
  location: { state },
  children,
}) => (
  <Query
    query={REQUEST}
    variables={{
      targetUUID: id,
      size: 20,
      page: 0,
      ...state?.filters,
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
