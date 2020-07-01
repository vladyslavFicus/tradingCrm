import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NoteFragment } from 'graphql/fragments/notes';

const REQUEST = gql`
  query ClientNotesQuery(
    $targetUUID: String!
    $pinned: Boolean
    $size: Int
    $page: Int
    $changedAtTo: String
    $changedAtFrom: String
    $targetType: String
    $department: String
  ) {
    notes(
      targetUUID: $targetUUID
      pinned: $pinned
      size: $size
      page: $page
      changedAtTo: $changedAtTo
      changedAtFrom: $changedAtFrom
      targetType: $targetType
      department: $department
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

const ClientNotesQuery = ({ match: { params: { id } }, location: { query }, children }) => (
  <Query
    query={REQUEST}
    variables={{
      size: 20,
      page: 0,
      targetUUID: id,
      ...query ? query.filters : {},
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

ClientNotesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    query: PropTypes.object,
  }).isRequired,
};

export default ClientNotesQuery;
