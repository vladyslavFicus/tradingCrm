import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation DeleteFileMutation(
    $uuid: String!,
  ) {
    file {
      delete(
        uuid: $uuid
      )
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
