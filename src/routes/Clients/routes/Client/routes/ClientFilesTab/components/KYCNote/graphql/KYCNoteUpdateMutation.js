import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation KYCNoteUpdate(
    $noteId: String!
    $content: String!
    $pinned: Boolean!
  ) {
    note {
      update(
        noteId: $noteId
        content: $content
        pinned: $pinned
      )
    }
  }
`;

const KYCNoteUpdate = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

KYCNoteUpdate.propTypes = {
  children: PropTypes.func.isRequired,
};

export default KYCNoteUpdate;
