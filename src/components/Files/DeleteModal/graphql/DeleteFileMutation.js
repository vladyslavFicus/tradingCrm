import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation DeleteFileMutation(
    $uuid: String!,
  ) {
    file {
      delete(uuid: $uuid) {
        error {
          error
        }
      }
    }
  }
`;

const DeleteFileMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DeleteFileMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DeleteFileMutation;
