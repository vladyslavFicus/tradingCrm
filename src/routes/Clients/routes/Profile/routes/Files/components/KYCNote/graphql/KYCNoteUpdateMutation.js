import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation KYCNoteUpdate(
    $content: String!
    $noteId: String!
  ) {
    note {
      update(
        noteId: $noteId
        content: $content
      ) {
        _id
      }
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
