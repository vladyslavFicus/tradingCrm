import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
