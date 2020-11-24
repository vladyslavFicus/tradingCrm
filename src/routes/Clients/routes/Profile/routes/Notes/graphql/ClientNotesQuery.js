import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
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

const ClientNotesQuery = ({ match: { params: { id } }, location: { state }, children }) => (
  <Query
    query={REQUEST}
    variables={{
      size: 20,
      page: 0,
      targetUUID: id,
      ...state?.filters,
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
    state: PropTypes.object,
  }).isRequired,
};

export default ClientNotesQuery;
