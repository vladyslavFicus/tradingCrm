import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation RemoveNoteMutation(
    $noteId: String!
  ) {
    note {
      remove(noteId: $noteId) {
        noteId
      }
    }
  }
`;

const RemoveNoteMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

RemoveNoteMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default RemoveNoteMutation;
