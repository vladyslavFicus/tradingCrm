import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
        error {
          error
        }
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
